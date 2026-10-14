#!/usr/bin/env python3
"""三类奶茶配置生成器；旧五维 profile 留在 milk_tea_config_generator.py。

dry-check 只校验并打印诊断，不写运行配置。production-filter 仅消费稳定
source path 与具体用户批准记录，整包 201 行 READY/true 后产隔离客户端 JSON。
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from tooling.config import milk_tea_config_generator as xlsx  # noqa: E402

TIERS = ["EASY", "MEDIUM", "HARD", "HELL", "NIGHTMARE"]
DIMS = ["TEA", "MILK", "TOPPING"]
HEADERS = {
    "难度阶段": ["stage_id", "tier_id", "stage_no", "xp_from", "recipe_dims", "orders_target", "time_sec", "tea_options", "milk_options", "topping_options", "xp_reward", "status", "export_enabled"],
    "解锁条件": ["tier_id", "prev_tier_id", "initial_open", "xp_enabled", "xp_min", "level_enabled", "level_min", "soul_enabled", "soul_min", "spirit_enabled", "spirit_min", "status", "export_enabled"],
    "原料": ["ingredient_id", "dimension", "name", "sort_order", "status", "export_enabled"],
    "配方": ["recipe_id", "tier_id", "min_stage_no", "drink_name", "tea_id", "milk_id", "topping_id", "status", "export_enabled"],
}
COUNTS = {"难度阶段": 10, "解锁条件": 5, "原料": 12, "配方": 174}
COMBOS = dict(zip(TIERS, [12, 27, 36, 45, 54]))
SOURCE_ARTIFACT = "deliverables/product/U05-B-CONFIG-SOURCE-20261014/v0.1/MILK_TEA_MINIGAME.xlsx"
SOURCE_APPROVAL = "tasks/U05-B-CONFIG-SOURCE-20261014/ARTIFACT_APPROVAL_v0.1.json"
TECH_APPROVAL = "tasks/U05-B-CONFIG-TECH-REVIEW-20261014/ARTIFACT_APPROVAL_v0.1.json"
STABLE_SOURCE = "project/config/source/MILK_TEA_MINIGAME.xlsx"


class ConfigError(ValueError):
    pass


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _read_source(path: Path, *, allow_draft: bool) -> dict[str, list[dict[str, tuple[Any, str | None]]]]:
    raw = xlsx._read_xlsx(path)
    if set(raw) != set(HEADERS):
        raise ConfigError(f"工作表必须且仅能包含四表 {list(HEADERS)}")
    result = {}
    observed_states: set[tuple[str, bool]] = set()
    for name, expected in HEADERS.items():
        headers, values = raw[name]
        if headers != expected:
            raise ConfigError(f"{name} 表头不匹配：{headers}")
        if len(values) != COUNTS[name]:
            raise ConfigError(f"{name} 应为 {COUNTS[name]} 行，实得 {len(values)}")
        rows = []
        for i, cells in enumerate(values, 2):
            cells = cells + [(None, None)] * max(0, len(expected) - len(cells))
            row = {key: cells[j] for j, key in enumerate(expected)}
            status, _ = row["status"]
            enabled, kind = row["export_enabled"]
            if allow_draft:
                if (status, enabled, kind) not in (("DRAFT", False, "b"), ("READY", True, "b")):
                    raise ConfigError(f"{name} 第{i}行状态与导出开关不匹配")
                observed_states.add((status, enabled))
            elif status != "READY" or enabled is not True or kind != "b":
                raise ConfigError(f"{name} 第{i}行未同时 READY/export_enabled=true")
            rows.append(row)
        result[name] = rows
    if allow_draft and len(observed_states) != 1:
        raise ConfigError("配置行状态混杂；整包必须全部 DRAFT/false 或全部 READY/true")
    return result


def _value(row: dict[str, tuple[Any, str | None]], key: str, kind: str, where: str, nullable: bool = False) -> Any:
    value, cell_kind = row[key]
    if nullable and value is None:
        return None
    if kind == "str":
        if not isinstance(value, str) or not value.strip() or cell_kind not in ("str", "s", "inlineStr"):
            raise ConfigError(f"{where}.{key} 必须为非空字符串")
        return value
    if kind == "optional_str":
        if value is None or value == "":
            return None
        if not isinstance(value, str) or cell_kind not in ("str", "s", "inlineStr"):
            raise ConfigError(f"{where}.{key} 必须为字符串或空值")
        return value
    if kind == "bool":
        if not isinstance(value, bool) or cell_kind != "b":
            raise ConfigError(f"{where}.{key} 必须为布尔单元格")
        return value
    if kind == "int":
        if cell_kind != "n" or value is None:
            raise ConfigError(f"{where}.{key} 必须为数值单元格")
        try:
            number = float(value)
        except (ValueError, TypeError) as exc:
            raise ConfigError(f"{where}.{key} 必须为整数") from exc
        if not number.is_integer():
            raise ConfigError(f"{where}.{key} 不允许小数")
        return int(number)
    raise AssertionError(kind)


def _approval(root: Path, approved_source: Path) -> tuple[dict[str, Any], dict[str, Any]]:
    source_approval = json.loads((root / SOURCE_APPROVAL).read_text(encoding="utf-8"))
    tech_approval = json.loads((root / TECH_APPROVAL).read_text(encoding="utf-8"))
    if source_approval.get("task_id") != "U05-B-CONFIG-SOURCE-20261014" or source_approval.get("status") != "USER_APPROVED":
        raise ConfigError("三类产品源表缺准确 v0.1 USER_APPROVED 记录")
    if tech_approval.get("task_id") != "U05-B-CONFIG-TECH-REVIEW-20261014" or tech_approval.get("status") != "USER_APPROVED":
        raise ConfigError("三类配置缺准确 Tech v0.1 USER_APPROVED 记录")
    note = source_approval.get("decision_note", "")
    match = re.search(re.escape(SOURCE_ARTIFACT) + r"=([0-9a-f]{64})", note)
    if not match or match.group(1) != sha256(approved_source):
        raise ConfigError("批准记录未绑定当前 Product 工作簿 SHA-256")
    return source_approval, tech_approval


def validate(path: Path, *, allow_draft: bool) -> tuple[dict[str, Any], dict[str, Any]]:
    tables = _read_source(path, allow_draft=allow_draft)
    stages = []
    unlocks = []
    ingredients = []
    recipes = []
    for row_no, row in enumerate(tables["难度阶段"], 2):
        where = f"难度阶段第{row_no}行"
        entry = {
            "stage_id": _value(row, "stage_id", "str", where),
            "tier_id": _value(row, "tier_id", "str", where),
            "stage_no": _value(row, "stage_no", "int", where),
            "xp_from": _value(row, "xp_from", "int", where),
            "recipe_dims": _value(row, "recipe_dims", "int", where),
            "orders_target": _value(row, "orders_target", "int", where),
            "time_sec": _value(row, "time_sec", "int", where, nullable=True),
            "tea_options": _value(row, "tea_options", "int", where),
            "milk_options": _value(row, "milk_options", "int", where),
            "topping_options": _value(row, "topping_options", "int", where),
            "xp_reward": _value(row, "xp_reward", "int", where),
        }
        stages.append(entry)
    for row_no, row in enumerate(tables["解锁条件"], 2):
        where = f"解锁条件第{row_no}行"
        unlocks.append({"tier_id": _value(row, "tier_id", "str", where),
            "prev_tier_id": _value(row, "prev_tier_id", "optional_str", where),
            **{key: _value(row, key, "bool", where) for key in ("initial_open", "xp_enabled", "level_enabled", "soul_enabled", "spirit_enabled")},
            **{key: _value(row, key, "int", where) for key in ("xp_min", "level_min", "soul_min", "spirit_min")}})
    for row_no, row in enumerate(tables["原料"], 2):
        where = f"原料第{row_no}行"
        ingredients.append({"ingredient_id": _value(row, "ingredient_id", "str", where),
            "dimension": _value(row, "dimension", "str", where), "name": _value(row, "name", "str", where),
            "sort_order": _value(row, "sort_order", "int", where)})
    for row_no, row in enumerate(tables["配方"], 2):
        where = f"配方第{row_no}行"
        recipes.append({"recipe_id": _value(row, "recipe_id", "str", where), "tier_id": _value(row, "tier_id", "str", where),
            "min_stage_no": _value(row, "min_stage_no", "int", where), "drink_name": _value(row, "drink_name", "str", where),
            "tea_id": _value(row, "tea_id", "str", where), "milk_id": _value(row, "milk_id", "str", where),
            "topping_id": _value(row, "topping_id", "str", where)})

    if [s["tier_id"] for s in stages[::2]] != TIERS or len(stages) != 10:
        raise ConfigError("难度阶段须按五档顺序各含两阶段")
    stage_map: dict[tuple[str, int], dict[str, Any]] = {}
    for tier in TIERS:
        group = sorted((s for s in stages if s["tier_id"] == tier), key=lambda s: s["stage_no"])
        if [s["stage_no"] for s in group] != [1, 2] or any(s["stage_id"] != f"MG01_{tier}_{s['stage_no']}" for s in group):
            raise ConfigError(f"{tier} 必须含稳定 ID 的阶段1、2")
        if any(s["recipe_dims"] != 3 or s["orders_target"] != 3 for s in group):
            raise ConfigError(f"{tier} 阶段必须三维、每局三杯")
        time_invalid = (any(s["time_sec"] is not None for s in group) if tier == "EASY"
                        else any(not s["time_sec"] or s["time_sec"] <= 0 for s in group))
        if time_invalid:
            raise ConfigError(f"{tier} 的限时规则不匹配")
        if group[1]["xp_from"] <= group[0]["xp_from"] or group[0]["xp_reward"] != group[1]["xp_reward"]:
            raise ConfigError(f"{tier} XP 门槛/奖励不匹配")
        prev_counts = {"tea_options": 0, "milk_options": 0, "topping_options": 0}
        for stage in group:
            for field, cap in (("tea_options", 3), ("milk_options", 3), ("topping_options", 6)):
                value = stage[field]
                if not 1 <= value <= cap or value < prev_counts[field]:
                    raise ConfigError(f"{stage['stage_id']}.{field} 越界或非单调")
                prev_counts[field] = value
            stage_map[(tier, stage["stage_no"])] = stage
    if [u["tier_id"] for u in unlocks] != TIERS:
        raise ConfigError("解锁表必须按五档各一行")
    for i, unlock in enumerate(unlocks):
        if unlock["prev_tier_id"] != (TIERS[i-1] if i else None) or unlock["initial_open"] != (i == 0):
            raise ConfigError(f"{unlock['tier_id']} 前档引用或初始开放不合法")
        if not 0 <= unlock["soul_min"] <= 3 or not 0 <= unlock["spirit_min"] <= 7:
            raise ConfigError(f"{unlock['tier_id']} 魂/魄阈值越界")
    ids = [i["ingredient_id"] for i in ingredients]
    if len(ids) != 12 or len(set(ids)) != 12:
        raise ConfigError("必须恰有12个唯一原料 ID")
    ingredient_map = {i["ingredient_id"]: i for i in ingredients}
    by_dim = {dim: sorted((i for i in ingredients if i["dimension"] == dim), key=lambda i: i["sort_order"]) for dim in DIMS}
    for dim, rows in by_dim.items():
        if len(rows) != {"TEA": 3, "MILK": 3, "TOPPING": 6}[dim] or [i["sort_order"] for i in rows] != list(range(1, len(rows)+1)):
            raise ConfigError(f"{dim} 数量或 sort_order 不符合 3/3/6 连续顺序")
    if len(recipes) != 174 or len({r["recipe_id"] for r in recipes}) != 174:
        raise ConfigError("必须恰有174条唯一 recipe_id")
    for tier in TIERS:
        tier_recipes = [r for r in recipes if r["tier_id"] == tier]
        if len(tier_recipes) != COMBOS[tier]:
            raise ConfigError(f"{tier} 应有 {COMBOS[tier]} 种配方")
        seen: set[tuple[str, str, str]] = set()
        earliest: dict[tuple[str, str, str], int] = {}
        for r in tier_recipes:
            combo = (r["tea_id"], r["milk_id"], r["topping_id"])
            if combo in seen:
                raise ConfigError(f"{tier} 三元组重复：{combo}")
            seen.add(combo)
            for dim, value in zip(DIMS, combo):
                if value not in ingredient_map or ingredient_map[value]["dimension"] != dim:
                    raise ConfigError(f"{r['recipe_id']} 引用了错误类别的原料 {value}")
            exposed = next((no for no in (1, 2) if all(ingredient_map[v]["sort_order"] <= stage_map[(tier, no)][f"{dim.lower()}_options"] for dim, v in zip(DIMS, combo))), None)
            if r["min_stage_no"] != exposed:
                raise ConfigError(f"{r['recipe_id']} min_stage_no 与逐类首次开放阶段不符")
            earliest[combo] = exposed  # type: ignore[assignment]
        maximum = stage_map[(tier, 2)]
        full_pool = {(a["ingredient_id"], b["ingredient_id"], c["ingredient_id"])
            for a in by_dim["TEA"][:maximum["tea_options"]]
            for b in by_dim["MILK"][:maximum["milk_options"]]
            for c in by_dim["TOPPING"][:maximum["topping_options"]]}
        if seen != full_pool:
            raise ConfigError(f"{tier} 174配方未覆盖最大开放池全部三元组")
        for stage_no in (1, 2):
            stage = stage_map[(tier, stage_no)]
            pool = {(a["ingredient_id"], b["ingredient_id"], c["ingredient_id"])
                for a in by_dim["TEA"][:stage["tea_options"]]
                for b in by_dim["MILK"][:stage["milk_options"]]
                for c in by_dim["TOPPING"][:stage["topping_options"]]}
            eligible = {combo for combo, min_stage in earliest.items() if min_stage <= stage_no}
            if pool != eligible:
                raise ConfigError(f"{tier} 阶段{stage_no}正确项未完整覆盖可用题池")

    config = {"schema_version": "2.0", "config_version": "v0.1", "generator_version": "u05-b-three-class-v0.1",
        "resource_id": "MILK_TEA_MINIGAME", "shop_id": "MT_SHOP_01", "dimensions": DIMS,
        "difficulty_stages": stages, "unlock_conditions": unlocks, "ingredients": ingredients, "recipes": recipes}
    report = {"status": "PASS", "source_sha256": sha256(path), "rows": COUNTS,
        "ingredient_counts": {dim: len(by_dim[dim]) for dim in DIMS}, "recipe_counts_by_tier": COMBOS,
        "stages": 10, "recipe_total": len(recipes), "mode": "DRY_CHECK" if allow_draft else "PRODUCTION_FILTER"}
    return config, report


def production(source: Path, approval_path: Path, output_dir: Path, root: Path = ROOT) -> dict[str, str]:
    stable = (root / STABLE_SOURCE).resolve()
    if source.resolve() != stable:
        raise ConfigError(f"production-filter 只允许稳定源路径 {STABLE_SOURCE}")
    approved_source = (root / SOURCE_ARTIFACT).resolve()
    approval, tech_approval = _approval(root.resolve(), approved_source)
    if approval_path.resolve() != (root / SOURCE_APPROVAL).resolve():
        raise ConfigError("production-filter 仅接受 U05-B-CONFIG-SOURCE v0.1 审批记录")
    if sha256(approved_source) != sha256(root / SOURCE_ARTIFACT):
        raise ConfigError("产品批准工作簿散列不匹配")
    config, report = validate(source, allow_draft=False)
    # Published stable workbook must equal the approved workbook except the authorized
    # row state change from DRAFT/false to READY/true.
    approved_tables = _read_source(approved_source, allow_draft=True)
    stable_tables = _read_source(source, allow_draft=False)
    for name in HEADERS:
        for before, after in zip(approved_tables[name], stable_tables[name]):
            for key in HEADERS[name]:
                if key not in ("status", "export_enabled") and before[key][0] != after[key][0]:
                    raise ConfigError(f"正式源与批准工作簿业务值差异：{name}.{key}")
    source_sha = sha256(source)
    config.update({"source_sha256": source_sha, "approval_version": approval["version"],
        "tech_approval_version": tech_approval["version"]})
    by_id = {item["ingredient_id"]: item for item in config["ingredients"]}
    tiers = []
    for tier in TIERS:
        stage_rows = sorted((s for s in config["difficulty_stages"] if s["tier_id"] == tier), key=lambda s: s["stage_no"])
        choices_by_stage = {}
        for stage in stage_rows:
            choices_by_stage[str(stage["stage_no"])] = {
                dim: [{"ingredient_id": i["ingredient_id"], "name": i["name"]}
                      for i in sorted((i for i in config["ingredients"] if i["dimension"] == dim), key=lambda i: i["sort_order"])
                      [:stage[f"{dim.lower()}_options"]]] for dim in DIMS}
        tier_recipes = [r for r in config["recipes"] if r["tier_id"] == tier]
        tiers.append({"tier_id": tier, "display_name": dict(zip(TIERS, ["简单", "中等", "困难", "地狱", "噩梦"]))[tier],
            "stage_count": 2, "recipe_dims": 3, "stages": [{**s, "ingredient_choices": choices_by_stage[str(s["stage_no"])]} for s in stage_rows],
            "recipe_hints": [{"recipe_id": r["recipe_id"], "min_stage_no": r["min_stage_no"], "drink_name": r["drink_name"],
                "ingredients": {dim: by_id[r[f"{dim.lower()}_id"]]["name"] for dim in DIMS}} for r in tier_recipes]})
    client = {**config, "display_only": True, "tiers": tiers}
    output_dir = output_dir.resolve()
    if output_dir.exists():
        raise ConfigError("候选输出目录已存在；为防覆盖，请使用全新目录")
    output_dir.mkdir(parents=True)
    content = (json.dumps(client, ensure_ascii=False, indent=2) + "\n").encode()
    (output_dir / "milk_tea_minigame.client.json").write_bytes(content)
    digest = hashlib.sha256(content).hexdigest()
    manifest = {**report, "status": "PASS", "source_sha256": source_sha, "client_sha256": digest,
        "approval_ref": SOURCE_APPROVAL, "tech_approval_ref": TECH_APPROVAL, "approved_source_artifact": SOURCE_ARTIFACT}
    (output_dir / "SHA256SUMS.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return {"source_sha256": source_sha, "client_sha256": digest, "candidate_dir": (str(output_dir.relative_to(root)) if output_dir.is_relative_to(root.resolve()) else str(output_dir))}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("dry-check", "production-filter"), required=True)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--approval", type=Path, default=ROOT / SOURCE_APPROVAL)
    parser.add_argument("--output-dir", type=Path)
    args = parser.parse_args()
    try:
        if args.mode == "dry-check":
            _, report = validate(args.source, allow_draft=True)
            print(json.dumps(report, ensure_ascii=False, indent=2))
        else:
            if args.output_dir is None:
                parser.error("production-filter requires --output-dir")
            print(json.dumps(production(args.source, args.approval, args.output_dir), ensure_ascii=False, indent=2))
    except (ConfigError, OSError, KeyError, json.JSONDecodeError) as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
