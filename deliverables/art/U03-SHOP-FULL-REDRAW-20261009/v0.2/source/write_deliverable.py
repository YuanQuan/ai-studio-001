import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
project = root.parents[3]
task = json.loads((project / "tasks/U03-SHOP-FULL-REDRAW-20261009/TASK.json").read_text(encoding="utf-8"))
manifest = json.loads((root / "CUT_MANIFEST.json").read_text(encoding="utf-8"))
sha = __import__("hashlib").sha256((root / "CUT_MANIFEST.json").read_bytes()).hexdigest().upper()
evidence = [
    "shop_04_reference_v01_v02_same_scale_black.png显示水平屋脊/檐口/台阶及双柱对称；CUT_MANIFEST.json逐SHA证实其余五店原PSD、两片和视窗同字节引用v0.1。",
    "BARBER_FRONT_VIEW_REVISION_PLAN.md SHA与Art/Tech受影响预签一致，均早于04正式出图；说明来源、画布/脚点、分层、ID与检查方式。",
    "04新源imagegen_whole_r2.png、4层PSD、两片RGBA真透明PNG实存；build_report与清单记录尺寸/alpha，body+sign与重组逐像素一致；已在390和720静态视窗实看视角/牌面/透明边。",
    "CUT_MANIFEST.json列六店每份资源的项目路径与SHA；六店总览、六份同尺度重组及双静态视窗均可经清单访问，五店直接指向v0.1原文件。",
    f"USER_REVIEW_PACKET.md已备具体v0.2总览/三图对照/清单SHA {sha}；待Producer把Task及Gate2 Approval转USER_REVIEW，用户尚未批准，Client资源未替换。",
]
artifacts = [
    "BARBER_FRONT_VIEW_REVISION_PLAN.md",
    "ART_BARBER_REVISION_PRESIGN.json",
    "CUT_MANIFEST.json",
    "PSD_LAYER_EXPORT_MAP.md",
    "USER_REVIEW_PACKET.md",
    "preview/six_shop_full_redraw_overview.png",
    "preview/shop_04_reference_v01_v02_same_scale_black.png",
    "psd/shop_04_full_redraw_v02.psd",
    "exports/tex_u03_shop_04_body_full_redraw_v02.png",
    "exports/tex_u03_shop_04_sign_full_redraw_v02.png",
]
base = root.relative_to(project)
output = {
    "task_id": task["id"],
    "owner": "art",
    "summary": "只修正04理发店建筑视角并提交六店v0.2整体看图，其他五店按原文件SHA继承；具体资源待用户Gate2审核。",
    "artifacts": [(base / path).as_posix() for path in artifacts] + ["deliverables/tech_lead/U03-SHOP-FULL-REDRAW-20261009/v0.2/TECH_BARBER_REVISION_PRESIGN.json"],
    "acceptance_results": [
        {"criterion": criterion, "result": "PASS" if index < 4 else "NOT_TESTED", "evidence": evidence[index]}
        for index, criterion in enumerate(task["acceptance"])
    ],
    "assumptions": ["用户最新退修范围仅04建筑视角；01/02/03/05/06按v0.1同字节继承。"],
    "risks": ["04 PSD为四层可见栅格分区，隐藏背面未补绘。", "Creator实际运行与性能尚未在新版接入后验证。"],
    "status": "READY_FOR_REVIEW",
}
(root / "DELIVERABLE.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
print(sha)
