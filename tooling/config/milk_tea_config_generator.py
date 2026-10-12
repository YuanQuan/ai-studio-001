#!/usr/bin/env python3
"""Validate the approved milk tea workbook and emit isolated candidate JSONs.

This tool deliberately writes only to an explicit output directory. It never
updates RESOURCE_INDEX or a runtime path. It uses only Python's standard
library and reads XLSX worksheet XML directly to preserve cell types.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import tempfile
import zipfile
from pathlib import Path, PurePosixPath
from typing import Any
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[2]
TIERS = ["EASY", "MEDIUM", "HARD", "HELL", "NIGHTMARE"]
DIMENSIONS = ["TEA", "MILK", "TOPPING", "SWEET", "ICE"]
EXPECTED_ROWS = {"难度阶段": 10, "解锁条件": 5, "原料": 20, "配方": 15}
HEADERS = {
    "难度阶段": ["stage_id", "tier_id", "stage_no", "xp_from", "recipe_dims", "orders_target", "time_sec", "options_per_dim", "xp_reward", "status", "export_enabled"],
    "解锁条件": ["tier_id", "prev_tier_id", "initial_open", "xp_enabled", "xp_min", "level_enabled", "level_min", "soul_enabled", "soul_min", "spirit_enabled", "spirit_min", "status", "export_enabled"],
    "原料": ["ingredient_id", "dimension", "name", "sort_order", "status", "export_enabled"],
    "配方": ["recipe_id", "tier_id", "min_stage_no", "drink_name", "tea_id", "milk_id", "topping_id", "sweet_id", "ice_id", "status", "export_enabled"],
}
NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}


class ConfigError(ValueError):
    pass


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def _cell_col(ref: str) -> int:
    letters = re.match(r"[A-Z]+", ref)
    if not letters:
        raise ConfigError(f"无效单元格引用：{ref}")
    n = 0
    for char in letters.group(0):
        n = n * 26 + ord(char) - 64
    return n - 1


def _read_xlsx(path: Path) -> dict[str, tuple[list[str], list[list[tuple[Any, str | None]]]]]:
    try:
        archive = zipfile.ZipFile(path)
    except (OSError, zipfile.BadZipFile) as exc:
        raise ConfigError(f"无法读取 XLSX：{exc}") from exc
    with archive:
        names = set(archive.namelist())
        try:
            workbook = ET.fromstring(archive.read("xl/workbook.xml"))
            rels = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        except (KeyError, ET.ParseError) as exc:
            raise ConfigError("XLSX 缺少有效 workbook 元数据") from exc
        targets = {item.attrib["Id"]: item.attrib["Target"] for item in rels.findall("p:Relationship", NS)}
        shared: list[str] = []
        if "xl/sharedStrings.xml" in names:
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared = ["".join(t.text or "" for t in si.findall(".//m:t", NS)) for si in root.findall("m:si", NS)]
        output = {}
        for sheet in workbook.findall("m:sheets/m:sheet", NS):
            title = sheet.attrib["name"]
            rel_id = sheet.attrib[f"{{{NS['r']}}}id"]
            raw_target = targets.get(rel_id)
            if raw_target is None:
                raise ConfigError(f"工作表 {title} 缺少 XML 关系")
            target = str(PurePosixPath("xl") / raw_target) if not raw_target.startswith("/") and not raw_target.startswith("xl/") else raw_target.lstrip("/")
            if target not in names:
                raise ConfigError(f"工作表 {title} XML 不存在：{target}")
            root = ET.fromstring(archive.read(target))
            rows: list[list[tuple[Any, str | None]]] = []
            for row_node in root.findall(".//m:sheetData/m:row", NS):
                row: list[tuple[Any, str | None]] = []
                for cell in row_node.findall("m:c", NS):
                    if cell.find("m:f", NS) is not None:
                        raise ConfigError(f"不接受公式单元格：{title}!{cell.attrib.get('r', '?')}")
                    col = _cell_col(cell.attrib["r"])
                    while len(row) <= col:
                        row.append((None, None))
                    kind = cell.attrib.get("t")
                    value_node = cell.find("m:v", NS)
                    value: Any = value_node.text if value_node is not None else None
                    if kind == "s" and value is not None:
                        value = shared[int(value)]
                    elif kind == "inlineStr":
                        value = "".join(t.text or "" for t in cell.findall(".//m:t", NS))
                    elif kind == "b" and value is not None:
                        value = value == "1"
                    row[col] = (value, kind)
                rows.append(row)
            if not rows:
                raise ConfigError(f"工作表为空：{title}")
            output[title] = ([str(value or "") for value, _ in rows[0]], rows[1:])
        return output


def _required_string(row: dict[str, tuple[Any, str | None]], key: str, where: str) -> str:
    value, kind = row[key]
    if not isinstance(value, str) or not value.strip() or kind not in ("str", "s", "inlineStr"):
        raise ConfigError(f"{where}.{key} 必须是非空字符串")
    return value


def _integer(row: dict[str, tuple[Any, str | None]], key: str, where: str, *, nullable: bool = False) -> int | None:
    value, kind = row[key]
    if value is None and nullable:
        return None
    if kind != "n" or value is None:
        raise ConfigError(f"{where}.{key} 必须是真正的整数单元格")
    try:
        number = float(value)
    except (TypeError, ValueError) as exc:
        raise ConfigError(f"{where}.{key} 必须是真正的整数单元格") from exc
    if not number.is_integer():
        raise ConfigError(f"{where}.{key} 不允许小数")
    return int(number)


def _boolean(row: dict[str, tuple[Any, str | None]], key: str, where: str) -> bool:
    value, kind = row[key]
    if kind != "b" or not isinstance(value, bool):
        raise ConfigError(f"{where}.{key} 必须是布尔单元格")
    return value


def _parse_table(table: tuple[list[str], list[list[tuple[Any, str | None]]]], name: str) -> list[dict[str, tuple[Any, str | None]]]:
    headers, raw_rows = table
    if headers != HEADERS[name]:
        raise ConfigError(f"{name} 表头不匹配；预期 {HEADERS[name]}，实得 {headers}")
    if len(raw_rows) != EXPECTED_ROWS[name]:
        raise ConfigError(f"{name} 必须恰有 {EXPECTED_ROWS[name]} 条数据，实得 {len(raw_rows)}")
    rows = []
    for index, cells in enumerate(raw_rows, 2):
        if len(cells) < len(headers):
            cells = cells + [(None, None)] * (len(headers) - len(cells))
        rows.append({header: cells[col] if col < len(cells) else (None, None) for col, header in enumerate(headers)})
    return rows


def _validate_approval(root: Path, source: Path, approval: Path, actual_sha: str) -> dict[str, Any]:
    approval_rel = "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012/ARTIFACT_APPROVAL_v0.1.json"
    source_rel = "project/config/source/MILK_TEA_MINIGAME.xlsx"
    expected_approval = (root / approval_rel).resolve()
    if approval.resolve() != expected_approval:
        raise ConfigError("仅接受本任务登记的 Product 候选审批记录路径")
    try:
        record = json.loads(approval.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise ConfigError(f"无法读取审批记录：{exc}") from exc
    if record.get("status") != "USER_APPROVED" or record.get("version") != "v0.1" or record.get("task_id") != "MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012":
        raise ConfigError("人工源表未绑定 Product v0.1 USER_APPROVED 审批")
    if record.get("role") != "product":
        raise ConfigError("审批角色不是 Product")
    if source.resolve() != (root / source_rel).resolve():
        raise ConfigError("仅接受资源索引登记的稳定奶茶候选源路径")
    index_path = root / "project/config/RESOURCE_INDEX.json"
    index = json.loads(index_path.read_text(encoding="utf-8"))
    entry = next((r for r in index["resources"] if r.get("id") == "MILK_TEA_MINIGAME"), None)
    if not entry or entry.get("candidate_path") != source_rel or entry.get("candidate_sha256") != actual_sha:
        raise ConfigError("源表与 RESOURCE_INDEX 候选路径或 SHA-256 不一致")
    if entry.get("approval_ref") != approval_rel:
        raise ConfigError("RESOURCE_INDEX.approval_ref 未指向本任务 Product 候选审批记录")
    if entry.get("active_path") is not None or index.get("current_formal_resources"):
        raise ConfigError("该候选任务要求无正式运行入口；索引显示已有 active/formal 资源")
    note = record.get("decision_note", "")
    match = re.search(re.escape(source_rel) + r"=" + r"([0-9a-f]{64})", note)
    if not match or match.group(1) != actual_sha:
        raise ConfigError("Product 审批记录未绑定候选源表的准确 SHA-256")
    return record


def build_config(root: Path, source: Path, approval: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    source = source.resolve()
    actual_sha = sha256(source)
    record = _validate_approval(root, source, approval, actual_sha)
    tables = _read_xlsx(source)
    if set(tables) != set(HEADERS):
        raise ConfigError(f"工作表必须且仅能包含四表：{list(HEADERS)}；实得 {list(tables)}")
    parsed = {name: _parse_table(tables[name], name) for name in HEADERS}

    stages: list[dict[str, Any]] = []
    for i, row in enumerate(parsed["难度阶段"], 2):
        where = f"难度阶段第{i}行"
        tier = _required_string(row, "tier_id", where)
        stage_no = _integer(row, "stage_no", where)
        stage_id = _required_string(row, "stage_id", where)
        if tier not in TIERS or stage_no not in (1, 2) or stage_id != f"MG01_{tier}_{stage_no}":
            raise ConfigError(f"{where} ID/档位/阶段值不合法")
        if _required_string(row, "status", where) != "READY" or not _boolean(row, "export_enabled", where):
            raise ConfigError(f"{where} 必须为 READY 且 export_enabled=true；整包拒绝部分导出")
        time_sec = _integer(row, "time_sec", where, nullable=True)
        stages.append({"stage_id": stage_id, "tier_id": tier, "stage_no": stage_no,
            "xp_from": _integer(row, "xp_from", where), "recipe_dims": _integer(row, "recipe_dims", where),
            "orders_target": _integer(row, "orders_target", where), "time_sec": time_sec,
            "options_per_dim": _integer(row, "options_per_dim", where), "xp_reward": _integer(row, "xp_reward", where)})

    unlocks: list[dict[str, Any]] = []
    for i, row in enumerate(parsed["解锁条件"], 2):
        where = f"解锁条件第{i}行"
        tier = _required_string(row, "tier_id", where)
        if _required_string(row, "status", where) != "READY" or not _boolean(row, "export_enabled", where):
            raise ConfigError(f"{where} 必须为 READY 且 export_enabled=true")
        prev = row["prev_tier_id"][0]
        if prev == "":
            prev = None
        if prev is not None and not isinstance(prev, str):
            raise ConfigError(f"{where}.prev_tier_id 必须为字符串或真空")
        unlocks.append({"tier_id": tier, "prev_tier_id": prev,
            "initial_open": _boolean(row, "initial_open", where),
            "xp_enabled": _boolean(row, "xp_enabled", where), "xp_min": _integer(row, "xp_min", where),
            "level_enabled": _boolean(row, "level_enabled", where), "level_min": _integer(row, "level_min", where),
            "soul_enabled": _boolean(row, "soul_enabled", where), "soul_min": _integer(row, "soul_min", where),
            "spirit_enabled": _boolean(row, "spirit_enabled", where), "spirit_min": _integer(row, "spirit_min", where)})

    ingredients: list[dict[str, Any]] = []
    for i, row in enumerate(parsed["原料"], 2):
        where = f"原料第{i}行"
        if _required_string(row, "status", where) != "READY" or not _boolean(row, "export_enabled", where):
            raise ConfigError(f"{where} 必须为 READY 且 export_enabled=true")
        ingredients.append({"ingredient_id": _required_string(row, "ingredient_id", where),
            "dimension": _required_string(row, "dimension", where), "name": _required_string(row, "name", where),
            "sort_order": _integer(row, "sort_order", where)})

    recipes: list[dict[str, Any]] = []
    for i, row in enumerate(parsed["配方"], 2):
        where = f"配方第{i}行"
        if _required_string(row, "status", where) != "READY" or not _boolean(row, "export_enabled", where):
            raise ConfigError(f"{where} 必须为 READY 且 export_enabled=true")
        def optional_id(key: str) -> str | None:
            value, kind = row[key]
            if value is None or value == "":
                return None
            if not isinstance(value, str) or kind not in ("str", "s", "inlineStr"):
                raise ConfigError(f"{where}.{key} 必须是字符串或真空")
            return value
        recipes.append({"recipe_id": _required_string(row, "recipe_id", where),
            "tier_id": _required_string(row, "tier_id", where), "min_stage_no": _integer(row, "min_stage_no", where),
            "drink_name": _required_string(row, "drink_name", where), "tea_id": _required_string(row, "tea_id", where),
            "milk_id": _required_string(row, "milk_id", where), "topping_id": _required_string(row, "topping_id", where),
            "sweet_id": optional_id("sweet_id"), "ice_id": optional_id("ice_id")})

    _validate_business(stages, unlocks, ingredients, recipes)
    source_ref = {"source_sha256": actual_sha, "approval_version": record["version"], "config_version": "v0.1"}
    server = {"schema_version": "1.0", "resource_id": "MILK_TEA_MINIGAME", **source_ref,
        "shop_id": "MT_SHOP_01", "difficulty_stages": stages, "unlock_conditions": unlocks,
        "ingredients": ingredients, "recipes": recipes}
    ingredient_map = {i["ingredient_id"]: i for i in ingredients}
    client_tiers = []
    for tier in TIERS:
        stage_rows = [s for s in stages if s["tier_id"] == tier]
        dim_count = stage_rows[0]["recipe_dims"]
        enabled_dims = DIMENSIONS[:dim_count]
        choices_by_stage = {}
        for stage in stage_rows:
            choices_by_stage[str(stage["stage_no"])] = {
                dimension: [{"ingredient_id": item["ingredient_id"], "name": item["name"]}
                    for item in sorted((x for x in ingredients if x["dimension"] == dimension), key=lambda x: x["sort_order"])
                    [:stage["options_per_dim"]]]
                for dimension in enabled_dims
            }
        recipes_for_tier = [{"recipe_id": r["recipe_id"], "min_stage_no": r["min_stage_no"], "drink_name": r["drink_name"],
            "ingredients": {dim: ingredient_map[r[field]]["name"] for dim, field in zip(enabled_dims, ["tea_id", "milk_id", "topping_id", "sweet_id", "ice_id"]) if r.get(field)}}
            for r in recipes if r["tier_id"] == tier]
        client_tiers.append({"tier_id": tier, "display_name": {"EASY":"简单", "MEDIUM":"中等", "HARD":"困难", "HELL":"地狱", "NIGHTMARE":"噩梦"}[tier],
            "stage_count": 2, "recipe_dims": dim_count,
            "stages": [{"stage_id": s["stage_id"], "stage_no": s["stage_no"], "orders_target": s["orders_target"], "time_sec": s["time_sec"], "options_per_dim": s["options_per_dim"], "ingredient_choices": choices_by_stage[str(s["stage_no"])]} for s in stage_rows],
            "recipe_hints": recipes_for_tier})
    client = {"schema_version": "1.0", "resource_id": "MILK_TEA_MINIGAME", **source_ref,
        "display_only": True, "tiers": client_tiers}
    return server, client


def _validate_business(stages: list[dict[str, Any]], unlocks: list[dict[str, Any]], ingredients: list[dict[str, Any]], recipes: list[dict[str, Any]]) -> None:
    if [s["tier_id"] for s in stages[::2]] != TIERS or len(stages) != 10:
        raise ConfigError("难度阶段须按五档顺序各含两阶段")
    expected_dims = dict(zip(TIERS, [3, 4, 5, 5, 5]))
    stage_map = {}
    for tier in TIERS:
        group = [s for s in stages if s["tier_id"] == tier]
        if len(group) != 2 or sorted(s["stage_no"] for s in group) != [1, 2]:
            raise ConfigError(f"{tier} 必须恰有阶段1、2")
        group.sort(key=lambda x: x["stage_no"])
        a, b = group
        if a["recipe_dims"] != expected_dims[tier] or b["recipe_dims"] != expected_dims[tier]:
            raise ConfigError(f"{tier} recipe_dims 必须为 {expected_dims[tier]}")
        if a["orders_target"] < 1 or a["orders_target"] != b["orders_target"]:
            raise ConfigError(f"{tier} orders_target 必须为相同正整数")
        if tier == "EASY":
            if a["time_sec"] is not None or b["time_sec"] is not None:
                raise ConfigError("简单必须不限时（time_sec 真空）")
        elif not all(s["time_sec"] and s["time_sec"] > 0 for s in group):
            raise ConfigError(f"{tier} 两阶段均须限时")
        if b["xp_from"] <= a["xp_from"] or a["xp_reward"] != b["xp_reward"]:
            raise ConfigError(f"{tier} 阶段2 XP门槛须更高且奖励两阶段相同")
        if a["xp_from"] < 0 or b["xp_from"] < 0 or a["xp_reward"] < 0 or b["xp_reward"] < 0:
            raise ConfigError(f"{tier} XP门槛与奖励必须为非负整数")
        for s in group:
            if not 2 <= s["options_per_dim"] <= 4:
                raise ConfigError(f"{s['stage_id']} options_per_dim 必须为2–4")
            stage_map[(tier, s["stage_no"])] = s
    rewards = [next(s["xp_reward"] for s in stages if s["tier_id"] == tier) for tier in TIERS]
    if any(right <= left for left, right in zip(rewards, rewards[1:])):
        raise ConfigError("五档通关奖励必须严格递增")
    if [u["tier_id"] for u in unlocks] != TIERS or len({u["tier_id"] for u in unlocks}) != 5:
        raise ConfigError("解锁表必须按五档各一行")
    for i, unlock in enumerate(unlocks):
        expected_prev = TIERS[i - 1] if i else None
        if unlock["prev_tier_id"] != expected_prev or unlock["initial_open"] != (i == 0):
            raise ConfigError(f"{unlock['tier_id']} 前档引用/初始开放不符；前档通关始终必需")
        if not 0 <= unlock["xp_min"] or not 0 <= unlock["level_min"] or not 0 <= unlock["soul_min"] <= 3 or not 0 <= unlock["spirit_min"] <= 7:
            raise ConfigError(f"{unlock['tier_id']} 解锁阈值超范围")
    ids = [item["ingredient_id"] for item in ingredients]
    if len(set(ids)) != len(ids):
        raise ConfigError("ingredient_id 重复")
    by_id = {i["ingredient_id"]: i for i in ingredients}
    by_dimension: dict[str, list[dict[str, Any]]] = {dim: [] for dim in DIMENSIONS}
    for item in ingredients:
        if item["dimension"] not in by_dimension or item["sort_order"] < 1:
            raise ConfigError(f"原料维度或 sort_order 无效：{item['ingredient_id']}")
        by_dimension[item["dimension"]].append(item)
    for dim, values in by_dimension.items():
        if len(values) < 4 or len({i["sort_order"] for i in values}) != len(values):
            raise ConfigError(f"{dim} 至少四项且 sort_order 同维唯一")
    recipe_ids = [r["recipe_id"] for r in recipes]
    if len(set(recipe_ids)) != len(recipe_ids):
        raise ConfigError("recipe_id 重复")
    if [sum(r["tier_id"] == t and r["min_stage_no"] == 1 for r in recipes) for t in TIERS] != [2] * 5:
        raise ConfigError("每档阶段1必须有两条配方")
    if [sum(r["tier_id"] == t and r["min_stage_no"] == 2 for r in recipes) for t in TIERS] != [1] * 5:
        raise ConfigError("每档阶段2必须新增一条配方")
    required = ["TEA", "MILK", "TOPPING", "SWEET", "ICE"]
    for recipe in recipes:
        if recipe["tier_id"] not in TIERS or recipe["min_stage_no"] not in (1, 2):
            raise ConfigError(f"配方档位/阶段无效：{recipe['recipe_id']}")
        dim_count = expected_dims[recipe["tier_id"]]
        for dim, field in zip(required, ["tea_id", "milk_id", "topping_id", "sweet_id", "ice_id"]):
            value = recipe[field]
            enabled = DIMENSIONS.index(dim) < dim_count
            if not enabled and value is not None:
                raise ConfigError(f"{recipe['recipe_id']} 禁用维度 {dim} 必须为空")
            if enabled:
                if value is None or value not in by_id or by_id[value]["dimension"] != dim:
                    raise ConfigError(f"{recipe['recipe_id']}.{field} 缺失或引用了错误维度原料")
                for stage_no in range(recipe["min_stage_no"], 3):
                    stage = stage_map[(recipe["tier_id"], stage_no)]
                    options = sorted(by_dimension[dim], key=lambda x: x["sort_order"])[:stage["options_per_dim"]]
                    if value not in {x["ingredient_id"] for x in options}:
                        raise ConfigError(f"{recipe['recipe_id']} 正确项 {value} 不在 {stage['stage_id']} 备选前N项")


def generate(source: Path, approval: Path, output_dir: Path, root: Path = ROOT) -> dict[str, str]:
    """Create an immutable candidate package, or verify an identical prior package."""
    server, client = build_config(root.resolve(), source, approval)
    server_bytes = (json.dumps(server, ensure_ascii=False, indent=2) + "\n").encode()
    client_bytes = (json.dumps(client, ensure_ascii=False, indent=2) + "\n").encode()
    output_dir = output_dir.resolve()
    repo_root = root.resolve()
    protected_paths = [source.resolve(), approval.resolve(), (repo_root / "project/config/RESOURCE_INDEX.json").resolve()]
    candidate_samples = (repo_root / "deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples").resolve()
    if not output_dir.is_relative_to(candidate_samples):
        raise ConfigError("输出只能写入本任务 v0.2 samples 目录及其新候选子目录")
    if any(path == output_dir or path.is_relative_to(output_dir) or output_dir.is_relative_to(path) for path in protected_paths):
        raise ConfigError("输出目录与源表、审批或资源索引重叠")
    output_dir.parent.mkdir(parents=True, exist_ok=True)
    expected_names = {"milk_tea_minigame.server.json", "milk_tea_minigame.client.json", "SHA256SUMS.json"}
    expected_bytes = {
        "milk_tea_minigame.server.json": server_bytes,
        "milk_tea_minigame.client.json": client_bytes,
    }
    hashes = {
        "source_sha256": server["source_sha256"],
        "server_sha256": hashlib.sha256(server_bytes).hexdigest(),
        "client_sha256": hashlib.sha256(client_bytes).hexdigest(),
    }
    expected_bytes["SHA256SUMS.json"] = (json.dumps(hashes, indent=2) + "\n").encode()
    if output_dir.exists() or output_dir.is_symlink():
        if output_dir.is_symlink() or not output_dir.is_dir():
            raise ConfigError("目标已存在且不是本工具生成的普通目录；请使用新的候选目录")
        try:
            names = {path.name for path in output_dir.iterdir()}
            identical = names == expected_names and all((output_dir / name).is_file() and (output_dir / name).read_bytes() == content for name, content in expected_bytes.items())
        except OSError as exc:
            raise ConfigError(f"无法验证现有候选目录：{exc}") from exc
        if identical:
            return hashes
        raise ConfigError("目标目录内容与新输出不同或包含额外文件；请使用新的候选目录，现有内容未修改")
    tmp = Path(tempfile.mkdtemp(prefix=f".{output_dir.name}.tmp-", dir=output_dir.parent))
    try:
        for name, content in expected_bytes.items():
            (tmp / name).write_bytes(content)
        if output_dir.exists() or output_dir.is_symlink():
            raise ConfigError("目标在生成期间出现；未覆盖现有目录，请使用新的候选目录")
        os.replace(tmp, output_dir)
        return hashes
    finally:
        if tmp.exists():
            import shutil
            shutil.rmtree(tmp)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=ROOT / "project/config/source/MILK_TEA_MINIGAME.xlsx")
    parser.add_argument("--approval", type=Path, default=ROOT / "tasks/MILK-TEA-MINIGAME-CONFIG-PROMOTION-20261012/ARTIFACT_APPROVAL_v0.1.json")
    parser.add_argument("--output-dir", required=True, type=Path, help="本任务 v0.2 samples 内的新候选目录；仅允许验证完全一致的既有输出")
    args = parser.parse_args()
    try:
        hashes = generate(args.source, args.approval, args.output_dir)
    except (ConfigError, OSError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    print(json.dumps(hashes, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
