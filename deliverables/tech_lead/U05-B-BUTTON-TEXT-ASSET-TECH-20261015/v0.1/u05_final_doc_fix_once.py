#!/usr/bin/env python3
"""One-shot U05 registry path correction. Dry-run is the default."""
import argparse
import hashlib
import json
import struct
import sys
import zlib
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

ROOT = Path("/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001")
BASE = ROOT / "deliverables/art/U05-B-INTERACTION-ASSETS-20261014/v0.3"
LOCK = ROOT / "deliverables/master/U05-B-RESOURCE-REGISTER-CLOSURE-PLAN-20261015/v0.1/FROZEN_INPUTS.json"
SCHEMA = ROOT / "schemas/deliverable.schema.json"
APPROVAL = ROOT / "tasks/U05-B-REGISTER-FINAL-DOC-FIX-PLAN-20261015/ARTIFACT_APPROVAL_v0.1.json"
PLAN_DIR = ROOT / "deliverables/master/U05-B-REGISTER-FINAL-DOC-FIX-PLAN-20261015/v0.1"
APPROVAL_HASHES = PLAN_DIR / "APPROVAL_HASHES.json"
PLAN_FILES = {
    "review_packet": "REVIEW_PACKET.md",
    "technical_feasibility": "TECH_FEASIBILITY_REVIEW.md",
    "deliverable": "DELIVERABLE.json",
}
TECH_RELEASE = ROOT / "deliverables/tech_lead/U05-B-BUTTON-TEXT-ASSET-TECH-20261015/v0.1/REGISTER_FINAL_DOC_FIX_BUDGET_RELEASE.json"
FROZEN_SHA = "835e81a4c3b90b3e494fd3b7faf591fcefe13c7e01095adcfccdb125d7a794c1"
OUT = Path("/private/tmp/u05_final_doc_fix_once")
NAMES = ("CUT_MANIFEST.json", "ASSET_MANIFEST.md", "PRODUCTION_LEDGER.json", "DELIVERABLE.json")
EXPECTED = {
    "CUT_MANIFEST.json": "6bcbec86536d72940e0bf3c76d8dd8d53c86d5279fa0b78512557dc9e5a593d9",
    "ASSET_MANIFEST.md": "9a7d6f7844ff13a952081f4ab65b071f5c3814cab6750b1ccfc06c8491da57ce",
    "PRODUCTION_LEDGER.json": "88e4de97f029a570b9f55f85eb2dd8400ca18e153c3bb6631f91ad9ef8949eac",
    "DELIVERABLE.json": "19d3cd9b170d1c53b0d05c173cb906faeecf97895b5bd1a6b759fe9866b2919f",
}
OLD = "client/assets/resources/u05b/"
NEW = "apps/client/assets/resources/u05_milk_tea/u05_b/"
PRIOR_FULL = 1956.148
PRIOR_TOTAL = 6111.092
HARD_CAP = 240.0


def sha(data):
    return hashlib.sha256(data).hexdigest()


def jread(path):
    return json.loads(path.read_text(encoding="utf-8"))


def safe_rel(value):
    p = PurePosixPath(value)
    assert isinstance(value, str) and value and not p.is_absolute(), value
    assert ".." not in p.parts and "\\" not in value and "\x00" not in value, value
    return p


def png_info(data):
    """Read PNG dimensions, mode and alpha bounds using only stdlib."""
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    pos, width, height, depth, color, interlace = 8, None, None, None, None, None
    compressed, palette, transparency = [], None, None
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        kind = data[pos + 4:pos + 8]
        payload = data[pos + 8:pos + 8 + length]
        assert len(payload) == length
        if kind == b"IHDR":
            width, height, depth, color, comp, filt, interlace = struct.unpack(">IIBBBBB", payload)
            assert comp == 0 and filt == 0
        elif kind == b"IDAT":
            compressed.append(payload)
        elif kind == b"PLTE":
            palette = payload
        elif kind == b"tRNS":
            transparency = payload
        pos += length + 12
        if kind == b"IEND":
            break
    assert width and height and depth == 8 and interlace == 0, (width, height, depth, interlace)
    channels_by_color = {0: 1, 2: 3, 3: 1, 4: 2, 6: 4}
    assert color in channels_by_color
    channels = channels_by_color[color]
    raw = zlib.decompress(b"".join(compressed))
    stride = width * channels
    assert len(raw) == height * (stride + 1)
    rows, previous = [], bytearray(stride)
    offset = 0
    for _ in range(height):
        filt = raw[offset]
        scan = bytearray(raw[offset + 1:offset + 1 + stride])
        offset += stride + 1
        for i in range(stride):
            left = scan[i - channels] if i >= channels else 0
            up = previous[i]
            upper_left = previous[i - channels] if i >= channels else 0
            if filt == 1:
                scan[i] = (scan[i] + left) & 255
            elif filt == 2:
                scan[i] = (scan[i] + up) & 255
            elif filt == 3:
                scan[i] = (scan[i] + ((left + up) // 2)) & 255
            elif filt == 4:
                p = left + up - upper_left
                pa, pb, pc = abs(p-left), abs(p-up), abs(p-upper_left)
                predictor = left if pa <= pb and pa <= pc else up if pb <= pc else upper_left
                scan[i] = (scan[i] + predictor) & 255
            else:
                assert filt == 0, filt
        rows.append(scan)
        previous = scan
    if color == 6:
        mode, alpha_at = "RGBA", lambda row, x: row[x * 4 + 3]
    elif color == 4:
        mode, alpha_at = "LA", lambda row, x: row[x * 2 + 1]
    elif color == 3:
        mode = "P"
        alpha_at = lambda row, x: transparency[row[x]] if transparency and row[x] < len(transparency) else 255
    elif color == 2:
        mode = "RGB"
        if transparency and len(transparency) == 6:
            tr = struct.unpack(">HHH", transparency)
            alpha_at = lambda row, x: 0 if tuple(row[x*3:x*3+3]) == tr else 255
        else:
            alpha_at = lambda row, x: 255
    else:
        mode = "L"
        if transparency and len(transparency) == 2:
            tr = struct.unpack(">H", transparency)[0]
            alpha_at = lambda row, x: 0 if row[x] == tr else 255
        else:
            alpha_at = lambda row, x: 255
    xs, ys = [], []
    for y, row in enumerate(rows):
        row_x = [x for x in range(width) if alpha_at(row, x) != 0]
        if row_x:
            xs.extend((row_x[0], row_x[-1] + 1))
            ys.append(y)
    bbox = [min(xs), min(ys), max(xs), max(ys) + 1] if xs and color in (4, 6) else None
    if color == 3 and palette:
        mode = "P"
    return [width, height], mode, bbox


def validate_schema(instance, schema, where="$"):
    """Small stdlib validator for the JSON Schema keywords used here."""
    typ = schema.get("type")
    if typ == "object":
        assert isinstance(instance, dict), where
        for key in schema.get("required", []):
            assert key in instance, where + "." + key
        props = schema.get("properties", {})
        if schema.get("additionalProperties") is False:
            assert set(instance) <= set(props), where
        for key, value in instance.items():
            if key in props:
                validate_schema(value, props[key], where + "." + key)
    elif typ == "array":
        assert isinstance(instance, list), where
        item_schema = schema.get("items")
        if item_schema:
            for i, value in enumerate(instance):
                validate_schema(value, item_schema, "%s[%d]" % (where, i))
    elif typ == "string":
        assert isinstance(instance, str), where
        assert len(instance) >= schema.get("minLength", 0), where
    if "enum" in schema:
        assert instance in schema["enum"], where


def check_frozen():
    lock = jread(LOCK)
    files = lock.get("files")
    assert isinstance(files, dict) and len(files) == 10
    base = ROOT / safe_rel(lock["source_dir"])
    for rel, expected in files.items():
        path = base / safe_rel(rel)
        data = path.read_bytes()
        assert len(data) == expected["bytes"] and sha(data) == expected["sha256"], rel
    return 10


def build_outputs(start_utc=None):
    elapsed = None
    frozen_before = check_frozen()
    source = {n: (BASE / n).read_bytes() for n in NAMES}
    hashes = {n: sha(b) for n, b in source.items()}
    assert hashes == EXPECTED, hashes
    cut = json.loads(source[NAMES[0]])
    md = source[NAMES[1]].decode("utf-8")
    ledger = json.loads(source[NAMES[2]])
    delivery = json.loads(source[NAMES[3]])
    assert ledger["activity_start_utc"] == "2026-10-15T04:20:13+00:00"
    assert ledger["activity_precommit_end_utc"] == "2026-10-15T04:23:13.280953+00:00"
    assert ledger["prior_full_conservative_seconds"] == 1548.148
    assert ledger["prior_total_conservative_seconds"] == 5703.092

    ids = set()
    assert len(cut["png_assets"]) == 58
    runtime, nulls = 0, 0
    for a in cut["png_assets"]:
        assert a["asset_id"] not in ids
        ids.add(a["asset_id"])
        rel = safe_rel(a["art_path"])
        data = (ROOT / rel).read_bytes()
        assert sha(data) == a["sha256"], a["asset_id"]
        dims, mode, bbox = png_info(data)
        assert dims == a["size_px"] and mode == a["mode"] and bbox == a["alpha_bbox_xyxy"], a["asset_id"]
        assert a["client_uuid"] is None
        if a["runtime_cut"]:
            assert a["client_path_planned"] == OLD + Path(a["art_path"]).name, a["asset_id"]
            a["client_path_planned"] = NEW + Path(a["art_path"]).name
            runtime += 1
        else:
            assert a["client_path_planned"] is None
            nulls += 1
    assert runtime == 54 and nulls == 4 and len(ids) == 58
    font = cut["font_descriptor"]
    safe_rel(font["art_path"])
    font_data = (ROOT / font["art_path"]).read_bytes()
    assert sha(font_data) == font["sha256"] and len(font_data) == font["bytes"]
    assert font["client_path_planned"] == OLD + "U05_ART_FONT.fnt"
    font["client_path_planned"] = NEW + "U05_ART_FONT.fnt"
    md = md.replace(OLD, NEW)
    assert md.count(OLD) == 0 and md.count(NEW) == 55

    budget = next(x for x in delivery["acceptance_results"] if x["criterion"] == "同批签认及预算")
    budget["result"] = "FAIL"
    budget["evidence"] = (
        "历史首轮约 256 秒，超过 240 秒单轮上限约 16 秒且未追认；第二次失败 dry-run 用时 152 秒。"
        "本次开始前累计 FULL 1956.148 秒、总计 6111.092 秒。"
    )
    for risk in (
        "预算判定 FAIL：历史首轮约超 240 秒硬上限 16 秒且未追认；先前累计 FULL/总计为 1956.148/6111.092 秒。",
        "Gate2 具体资源审批仍为 PENDING；本登记修正不构成用户批准，客户端未导入，UUID 仍为空。",
        "独立 Tech 终审尚未完成；登记保持 BLOCKED_PENDING_INDEPENDENT_TECH_REVIEW。",
    ):
        if risk not in delivery["risks"]:
            delivery["risks"].append(risk)
    if not any(x["criterion"] == "独立 Tech 终审" for x in delivery["acceptance_results"]):
        delivery["acceptance_results"].append({
            "criterion": "独立 Tech 终审", "result": "NOT_TESTED",
            "evidence": "临时预检内容通过；正式替换和独立 Tech 终审尚未执行。",
        })

    if start_utc is None:
        ledger["final_doc_fix_activity"] = {
            "start_utc": "TO_BE_CAPTURED_FROM_ART_EVENT",
            "precommit_checkpoint_utc": "NOT_RUN",
            "postwrite_checkpoint_utc": "NOT_RUN",
            "full_round_actual_end_time_source": "Producer event record after script exit; not inferred",
            "elapsed_conservative_upper_seconds": int(HARD_CAP),
            "cumulative_full_before_run_seconds": PRIOR_FULL,
            "cumulative_full_conservative_upper_seconds": round(PRIOR_FULL + HARD_CAP, 3),
            "cumulative_total_before_run_seconds": PRIOR_TOTAL,
            "cumulative_total_conservative_upper_seconds": round(PRIOR_TOTAL + HARD_CAP, 3),
            "hard_cap_seconds": int(HARD_CAP),
        }
        ledger["correction_preflight"] = {
            "mode": "DRY_RUN_ONLY", "prior_first_run_seconds_approx": 256,
            "prior_first_run_start_utc": "2026-10-15T04:20:13Z",
            "prior_first_run_precommit_end_utc": "2026-10-15T04:23:13.280953Z",
            "prior_first_run_final_end_utc": "2026-10-15T04:24:29Z",
            "prior_first_run_hard_cap_seconds": 240, "prior_first_run_breach_seconds_approx": 16,
            "prior_first_run_breach_retroactively_approved": False,
            "prior_failed_dry_run_start_utc": "2026-10-15T06:01:38Z",
            "prior_failed_dry_run_end_utc": "2026-10-15T06:04:10Z",
            "prior_failed_dry_run_seconds": 152,
            "cumulative_full_before_next_run_seconds": PRIOR_FULL,
            "cumulative_total_before_next_run_seconds": PRIOR_TOTAL,
            "elapsed_conservative_upper_seconds": int(HARD_CAP),
            "cumulative_full_conservative_upper_seconds": round(PRIOR_FULL + HARD_CAP, 3),
            "cumulative_total_conservative_upper_seconds": round(PRIOR_TOTAL + HARD_CAP, 3),
            "elapsed_seconds": "ONLY_COMPUTED_ON_COMMIT", "gate2_user_approval": "PENDING",
            "full_round_actual_end_time_source": "Producer event record after task exit",
        }
    else:
        start = datetime.fromisoformat(start_utc.replace("Z", "+00:00"))
        assert start.tzinfo is not None
        end = datetime.now(timezone.utc)
        elapsed = (end - start.astimezone(timezone.utc)).total_seconds()
        assert elapsed >= 0, "--start-utc is in the future"
        assert elapsed < HARD_CAP, "elapsed time reached the 240-second hard cap; refusing commit"
        end_utc = end.isoformat()
        ledger["correction_preflight"] = {
            "mode": "COMMIT", "prior_first_run_seconds_approx": 256,
            "prior_first_run_start_utc": "2026-10-15T04:20:13Z",
            "prior_first_run_precommit_end_utc": "2026-10-15T04:23:13.280953Z",
            "prior_first_run_final_end_utc": "2026-10-15T04:24:29Z",
            "prior_first_run_hard_cap_seconds": 240, "prior_first_run_breach_seconds_approx": 16,
            "prior_first_run_breach_retroactively_approved": False,
            "prior_failed_dry_run_start_utc": "2026-10-15T06:01:38Z",
            "prior_failed_dry_run_end_utc": "2026-10-15T06:04:10Z",
            "prior_failed_dry_run_seconds": 152,
            "cumulative_full_before_next_run_seconds": PRIOR_FULL,
            "cumulative_total_before_next_run_seconds": PRIOR_TOTAL,
            "elapsed_at_precommit_seconds": round(elapsed, 3),
            "observed_precommit_checkpoint_utc": end_utc,
            "gate2_user_approval": "PENDING",
            "full_round_actual_end_time_source": "Producer event record after task exit",
        }

    cut["status"] = "BLOCKED_PENDING_INDEPENDENT_TECH_REVIEW"
    ledger["status"] = "BLOCKED_PENDING_INDEPENDENT_TECH_REVIEW"

    schema = jread(SCHEMA)
    validate_schema(delivery, schema)
    outputs = {
        NAMES[0]: (json.dumps(cut, ensure_ascii=False, indent=2) + "\n").encode(),
        NAMES[1]: md.encode(),
        NAMES[2]: (json.dumps(ledger, ensure_ascii=False, indent=2) + "\n").encode(),
        NAMES[3]: (json.dumps(delivery, ensure_ascii=False, indent=2) + "\n").encode(),
    }
    check_frozen()
    return outputs, hashes, frozen_before, runtime, nulls, elapsed


def approval_passes():
    if not APPROVAL.is_file() or not APPROVAL_HASHES.is_file() or not TECH_RELEASE.is_file():
        return False
    approval = jread(APPROVAL)
    approval_schema = jread(ROOT / "schemas/artifact_approval.schema.json")
    validate_schema(approval, approval_schema)
    if not (
        approval.get("task_id") == "U05-B-REGISTER-FINAL-DOC-FIX-PLAN-20261015"
        and approval.get("role") == "master"
        and approval.get("artifact") == "deliverables/master/U05-B-REGISTER-FINAL-DOC-FIX-PLAN-20261015/v0.1/DELIVERABLE.json"
        and approval.get("version") == "v0.1"
        and approval.get("status") == "USER_APPROVED"
    ):
        return False
    hashes_doc = jread(APPROVAL_HASHES)
    expected_files = {filename: sha((PLAN_DIR / filename).read_bytes()) for filename in PLAN_FILES.values()}
    if not (
        hashes_doc.get("task_id") == approval["task_id"]
        and hashes_doc.get("version") == approval["version"]
        and hashes_doc.get("status") == "USER_APPROVED"
        and hashes_doc.get("files") == expected_files
    ):
        return False
    approval_sha = sha(APPROVAL.read_bytes())
    hashes_sha = sha(APPROVAL_HASHES.read_bytes())
    release = jread(TECH_RELEASE)
    budget = release.get("conservative_budget_seconds", {})
    return (
        release.get("task_id") == "U05-B-REGISTER-FINAL-DOC-FIX-PLAN-20261015"
        and release.get("role") == "tech_lead"
        and release.get("decision") == "CONDITIONAL_RELEASE_ONE_FINAL_DOC_FIX"
        and release.get("approval_record_sha256") == approval_sha
        and release.get("approval_hashes_sha256") == hashes_sha
        and release.get("script_sha256") == sha(Path(__file__).read_bytes())
        and release.get("frozen_inputs_sha256") == FROZEN_SHA
        and budget.get("activity_hard_cap_seconds") == 240
        and budget.get("old_activity_reset") is False
    )


def commit_once(outputs, start_utc):
    assert approval_passes(), "approval record missing or status is not USER_APPROVED"
    old = {n: (BASE / n).read_bytes() for n in NAMES}
    assert {n: sha(b) for n, b in old.items()} == EXPECTED, "official documents changed since preflight"
    backup_dir = OUT / "backup"
    backup_dir.mkdir(parents=True, exist_ok=True)
    for n, data in old.items():
        (backup_dir / n).write_bytes(data)
    start = datetime.fromisoformat(start_utc.replace("Z", "+00:00"))
    written = []
    attempted_hashes = {}
    attempted_sha_list = []
    try:
        precommit = datetime.now(timezone.utc)
        precommit_elapsed = (precommit - start.astimezone(timezone.utc)).total_seconds()
        assert 0 <= precommit_elapsed < HARD_CAP, "240-second hard cap reached before replacement"
        ledger = json.loads(outputs["PRODUCTION_LEDGER.json"])
        ledger["final_doc_fix_activity"] = {
            "start_utc": start.astimezone(timezone.utc).isoformat(),
            "precommit_end_utc": precommit.isoformat(),
            "elapsed_at_precommit_seconds": round(precommit_elapsed, 3),
            "postwrite_checkpoint_utc": "PENDING_POST_WRITE_VERIFICATION",
            "hard_cap_seconds": int(HARD_CAP),
            "cumulative_full_before_run_seconds": PRIOR_FULL,
            "cumulative_full_through_precommit_seconds": round(PRIOR_FULL + precommit_elapsed, 3),
            "cumulative_total_before_run_seconds": PRIOR_TOTAL,
            "cumulative_total_through_precommit_seconds": round(PRIOR_TOTAL + precommit_elapsed, 3),
        }
        ledger["correction_preflight"].update({
            "mode": "COMMIT", "precommit_end_utc": precommit.isoformat(),
            "elapsed_at_precommit_seconds": round(precommit_elapsed, 3),
        })
        outputs["PRODUCTION_LEDGER.json"] = (json.dumps(ledger, ensure_ascii=False, indent=2) + "\n").encode()
        for n in NAMES:
            staged = OUT / (n + ".new")
            staged.write_bytes(outputs[n])
            attempted_hashes[n] = sha(staged.read_bytes())
            attempted_sha_list.append({"file": n, "phase": "initial_replace", "sha256": attempted_hashes[n]})
            staged.replace(BASE / n)
            written.append(n)
        for n in NAMES:
            assert (BASE / n).read_bytes() == outputs[n]
        check_frozen()
        postwrite_checkpoint = datetime.now(timezone.utc)
        elapsed = (postwrite_checkpoint - start.astimezone(timezone.utc)).total_seconds()
        assert elapsed < HARD_CAP, "240-second hard cap reached after replacements; rollback required"

        # Record the verified checkpoint separately from actual process end.
        # The conservative bound covers the complete bounded run; Producer logs
        # the actual end after this script exits.
        final_ledger = json.loads((BASE / "PRODUCTION_LEDGER.json").read_bytes())
        final_ledger["final_doc_fix_activity"].update({
            "postwrite_checkpoint_utc": postwrite_checkpoint.isoformat(),
            "elapsed_at_postwrite_checkpoint_seconds": round(elapsed, 3),
            "full_round_actual_end_time_source": "Producer event record after task exit; not inferred here",
            "elapsed_conservative_upper_seconds": int(HARD_CAP),
            "cumulative_full_conservative_upper_seconds": round(PRIOR_FULL + HARD_CAP, 3),
            "cumulative_total_conservative_upper_seconds": round(PRIOR_TOTAL + HARD_CAP, 3),
        })
        final_ledger["correction_preflight"].update({
            "elapsed_conservative_upper_seconds": int(HARD_CAP),
            "cumulative_full_conservative_upper_seconds": round(PRIOR_FULL + HARD_CAP, 3),
            "cumulative_total_conservative_upper_seconds": round(PRIOR_TOTAL + HARD_CAP, 3),
            "full_round_actual_end_time_source": "Producer event record after task exit",
        })
        closed = (json.dumps(final_ledger, ensure_ascii=False, indent=2) + "\n").encode()
        stage = OUT / "PRODUCTION_LEDGER.json.closed"
        stage.write_bytes(closed)
        assert sha(stage.read_bytes()) == sha(closed)
        attempted_hashes["PRODUCTION_LEDGER.json"] = sha(stage.read_bytes())
        attempted_sha_list.append({"file": "PRODUCTION_LEDGER.json", "phase": "conservative_close_replace",
                                  "sha256": attempted_hashes["PRODUCTION_LEDGER.json"]})
        stage.replace(BASE / "PRODUCTION_LEDGER.json")
        outputs["PRODUCTION_LEDGER.json"] = closed
        for n in NAMES:
            assert (BASE / n).read_bytes() == outputs[n]
        check_frozen()
        final_elapsed = (datetime.now(timezone.utc) - start.astimezone(timezone.utc)).total_seconds()
        assert final_elapsed < HARD_CAP, "240-second hard cap reached during final verification; rollback required"
    except Exception as error:
        rollback, failures = {}, []
        for n in NAMES:
            try:
                restore = OUT / (n + ".rollback")
                restore.write_bytes(old[n])
                restore.replace(BASE / n)
                after = sha((BASE / n).read_bytes())
                rollback[n] = {
                    "before_sha256": sha(old[n]), "attempted_sha256": attempted_hashes.get(n),
                    "rollback_sha256": after, "restored": after == sha(old[n]),
                }
                if after != sha(old[n]):
                    failures.append(n + ": restored SHA mismatch")
            except Exception as rollback_error:
                rollback[n] = {
                    "before_sha256": sha(old[n]), "attempted_sha256": attempted_hashes.get(n),
                    "rollback_sha256": None, "restored": False, "error": str(rollback_error),
                }
                failures.append(n + ": " + str(rollback_error))
        (OUT / "rollback_audit.json").write_text(json.dumps({
            "original_failure": str(error), "files": rollback,
            "attempted_sha_list": attempted_sha_list,
            "rollback_complete": not failures, "rollback_errors": failures,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        raise
    return {n: sha((BASE / n).read_bytes()) for n in NAMES}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--dry-run", action="store_true", help="default: validate and write previews only")
    mode.add_argument("--commit", action="store_true", help="one-time official update; requires USER_APPROVED artifact")
    parser.add_argument("--start-utc", help="actual Art activity start, ISO8601 with timezone; required with --commit")
    args = parser.parse_args()
    if args.commit and not args.start_utc:
        parser.error("--commit requires --start-utc ISO8601")
    if not args.commit and args.start_utc:
        parser.error("--start-utc is accepted only with --commit")
    if args.commit and not approval_passes():
        raise SystemExit("REFUSED: required USER_APPROVED artifact is absent or not approved")

    outputs, sources, frozen_count, runtime, nulls, elapsed = build_outputs(args.start_utc if args.commit else None)
    OUT.mkdir(parents=True, exist_ok=True)
    for name, data in outputs.items():
        (OUT / name).write_bytes(data)
    # Re-read previews and validate the written preview set before any official replace.
    preview = {n: (OUT / n).read_bytes() for n in NAMES}
    assert preview == outputs
    validate_schema(jread(OUT / "DELIVERABLE.json"), jread(SCHEMA))
    assert check_frozen() == frozen_count == 10
    official_hashes = commit_once(outputs, args.start_utc) if args.commit else None
    exit_checkpoint = datetime.now(timezone.utc).isoformat()
    result = {
        "result": "COMMIT_COMPLETE" if args.commit else "PASS_DRY_RUN_ONLY",
        "output_dir": str(OUT), "official_repository_written": bool(args.commit),
        "script_exit_checkpoint_utc": exit_checkpoint,
        "ledger_full_round_actual_end_time_source": "Producer event record after script exit; ledger records only checkpoints and conservative bound",
        "source_hashes_verified": sources, "preview_hashes": {n: sha(b) for n, b in outputs.items()},
        "runtime_png_paths_rewritten": runtime, "null_png_paths_preserved": nulls,
        "asset_manifest_replacements": outputs[NAMES[1]].decode().count(NEW),
        "frozen_files_sha_and_bytes_verified": 10, "deliverable_schema": "PASS_MANUAL_STDlib",
        "elapsed_conservative_upper_seconds": int(HARD_CAP) if args.commit else "ONLY_APPLIES_IF_COMMITTED",
        "cumulative_full_conservative_upper_seconds": round(PRIOR_FULL + HARD_CAP, 3) if args.commit else None,
        "cumulative_total_conservative_upper_seconds": round(PRIOR_TOTAL + HARD_CAP, 3) if args.commit else None,
        "budget_acceptance": "FAIL", "gate2_user_approval": "PENDING",
        "official_hashes_after_commit": official_hashes,
    }
    audit_path = OUT / "run_exit_audit.json"
    audit_path.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    result["temporary_exit_audit"] = str(audit_path)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, OSError, ValueError, KeyError, zlib.error) as exc:
        print("PREFLIGHT FAILED: %s" % exc, file=sys.stderr)
        raise
