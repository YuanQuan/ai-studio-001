# -*- coding: utf-8 -*-
import json
from datetime import datetime, timezone, timedelta
from pathlib import Path

root = Path(__file__).resolve().parents[1]
path = root / "EXECUTION_LEDGER.json"
data = json.loads(path.read_text(encoding="utf-8"))
assert len(data["calls"]) == 14
assert data["usage"]["initial_calls_submitted"] == 11
assert data["usage"]["correction_calls_submitted"] == 3
assert data["usage"]["unknown_outcome_calls_reserved"] == 0
assert data["usage"]["candidates_received"] == 14

default_dir = "/Users/yuanquan/.codex/generated_images/01a13586-91aa-7fe0-ac16-345c2e7fd241/"
names = [
    "exec-5eb8a5cb-0590-485d-b7b3-c0e8f9ad4b7c.png",
    "exec-e0a8ee6c-327b-4840-a69f-38cd25baf432.png",
    "exec-df908ce7-40e3-4fec-8002-91b2e650239f.png",
    "exec-8c5ff190-216d-486a-b56f-48949dc9672b.png",
    "exec-81f24f83-e702-40c8-b8cc-adfa9ee17854.png",
    "exec-080fbb49-2845-4531-b9e5-39e68887627a.png",
    "exec-4632ea4e-ae7e-426e-bab6-9ef1462fcf8f.png",
    "exec-9a8e6ddb-bd23-44da-9ef6-08ed4b3d321e.png",
    "exec-e55adfd5-4fc5-45ba-8958-42145f773aa8.png",
    "exec-d57c06f1-261b-4499-82dc-147a052b162b.png",
    "exec-5ef2587a-afbe-49fa-846d-85aa7dee1525.png",
    "exec-c620881d-4374-4ec1-9a4b-2e50f44d0248.png",
    "exec-0ef86eed-4da1-4040-9251-c0d421f16eda.png",
    "exec-b2255003-5c83-411f-9e43-b397ad78cc73.png",
]
for call, name in zip(data["calls"], names):
    default = Path(default_dir) / name
    assert default.is_file(), default
    call["tool_original_output_path"] = str(default)
    if call["call_index"] == 4:
        call["status"] = "SUCCESS_ART_REVIEW_REVISE_MOON_SCALE_POSITION"
    elif call["call_index"] >= 5:
        call["status"] = "SUCCESS_ART_REVIEW_PASS"
data["deterministic_operations"][-1]["status"] = "SUCCESS_ART_SAMPLE_AND_TECH_PASS"
data["state"] = "ART_DELIVERABLE_READY_FOR_GATE2_USER_REVIEW"
now = datetime.now(timezone(timedelta(hours=8)))
start = datetime.fromisoformat(data["calls"][0]["started_at"])
elapsed = (now - start).total_seconds() / 60
data["usage"]["production_and_verification_wall_minutes"] = round(elapsed, 2)
data["usage"]["wall_time_basis"] = "Conservative elapsed from first generation to final verification; includes any short review/communication waits, because exact pause split is not reliably measured."
data["usage"]["remaining_potential_calls"] = 1
data["usage"]["unused_correction_calls"] = 1
data["usage"]["budget_within_4h_conservative"] = elapsed <= 240
data["issue_rounds"]["moon_scale_position"] = 1
data["runtime_observation"] = "Environment active 17 PNG theoretical RGBA8 expansion 30.79 MiB; Cocos target not tested. Six existing 1024x1024 shops, if later used by client, are separately ~48 MiB theoretical and make 40 MiB total target unproven/at risk. No shops exported in this Art package. Browser micro-motion uses five canvas drawImage calls per frame, not Cocos batch draw measurement."
data["final_selected"] = {
    "sky_native": "source/native/sky_moon_correction_01_native.png",
    "bridge_native_chain": ["source/native/bridge_correction_01_native.png", "source/native/street_patch_correction_02_native.png"],
    "bridge_combined": "source/bridge_correction_02_full_work.png",
    "bridge_half_canonical": "exports/tex_sakura_rr_bridge_half.png",
    "psd": "source/scene_sakura_reuse_master.psd",
    "scene": "review/scene_environment.png",
    "verification": "FILE_VERIFICATION.json"
}
path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"state":data["state"],"calls":len(data["calls"]),"elapsed_upper_bound_minutes":round(elapsed,2),"remaining":data["usage"]["remaining_potential_calls"]},ensure_ascii=False))
