import argparse
import datetime as dt
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "EXECUTION_LEDGER.json"

parser = argparse.ArgumentParser()
parser.add_argument("action", choices=["reserve", "finish"])
parser.add_argument("--group", required=True)
parser.add_argument("--prompt")
parser.add_argument("--native")
parser.add_argument("--reference", action="append", default=[])
parser.add_argument("--transparent", action="store_true")
parser.add_argument("--kind", choices=["initial", "correction"], default="initial")
parser.add_argument("--issue")
args = parser.parse_args()

data = json.loads(LEDGER.read_text())
now = dt.datetime.now(dt.timezone(dt.timedelta(hours=8))).isoformat(timespec="seconds")
if args.action == "reserve":
    assert args.prompt
    assert not any(c.get("status") == "SUBMITTED_OUTCOME_UNKNOWN" for c in data["calls"])
    if args.kind == "initial":
        assert data["usage"]["initial_calls_submitted"] < data["limits"]["initial_calls"]
    else:
        assert data["usage"]["correction_calls_submitted"] < data["limits"]["correction_calls"]
        assert args.issue
        assert data["issue_rounds"].get(args.issue, 0) < data["limits"]["correction_rounds_per_same_issue"]
    assert data["usage"]["remaining_potential_calls"] > 0
    prompt = ROOT / args.prompt
    entry = {
        "call_index": len(data["calls"]) + 1,
        "stage": "full_batch_initial" if args.kind == "initial" else "full_batch_correction",
        "source_group": args.group,
        "issue": args.issue,
        "tool": "image_gen.imagegen",
        "input_reference": args.reference,
        "prompt_file": args.prompt,
        "prompt_sha256": hashlib.sha256(prompt.read_bytes()).hexdigest(),
        "transparent_background": args.transparent,
        "request_id": None,
        "idempotency_key": None,
        "status": "SUBMITTED_OUTCOME_UNKNOWN",
        "candidates": 0,
        "started_at": now,
        "known_cost": "unknown",
        "repeat_policy": "Reserve an unknown result; inspect tool outcome before considering another call."
    }
    data["calls"].append(entry)
    data["usage"]["initial_calls_submitted" if args.kind == "initial" else "correction_calls_submitted"] += 1
    if args.kind == "correction":
        data["issue_rounds"][args.issue] = data["issue_rounds"].get(args.issue, 0) + 1
    data["usage"]["unknown_outcome_calls_reserved"] += 1
    data["usage"]["remaining_potential_calls"] -= 1
    data["state"] = "FULL_BATCH_GENERATING"
elif args.action == "finish":
    assert args.native
    matching = [c for c in data["calls"] if c["source_group"] == args.group and c["status"] == "SUBMITTED_OUTCOME_UNKNOWN"]
    assert len(matching) == 1
    entry = matching[0]
    native = ROOT / args.native
    assert native.is_file()
    from PIL import Image
    with Image.open(native) as image:
        size = image.size
    entry.update({
        "status": "SUCCESS_RECEIVED_ART_REVIEW_PENDING",
        "candidates": 1,
        "finished_at": now,
        "output_native_path": args.native,
        "output_sha256": hashlib.sha256(native.read_bytes()).hexdigest(),
        "native_dimensions": list(size),
    })
    data["usage"]["unknown_outcome_calls_reserved"] -= 1
    data["usage"]["candidates_received"] += 1
LEDGER.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
print(json.dumps({"state": data["state"], "entry": entry, "usage": data["usage"]}, ensure_ascii=False))
