# 首轮出图审计：左右朝向辨识未过

2026-10-03 01:41:23 +08:00 左右首次出图落盘，依据同版 `ART_PREFLIGHT.json` 与 `TECH_PREFLIGHT.json` 双签。保留当时逐帧 PNG、图集、板凳、预览、原始 SVG、导出脚本及 `frames/FRAME_MANIFEST.json` 的原始副本；后续修订不得覆盖本目录。

首次脚本实际输出：Node v22.12.0、sharp 0.35.4、libvips 8.18.6；23 张逐帧 PNG 的 SHA256 全部不同，`1024×1024` 图集 1 页，RGBA8 基础量 4,194,304 B；`sprites/ghost_atlas.png` SHA256 为 `fb48dfa1d954aaaf4be691374f9c7eec98954a1f82ea643175565d195c42d77e`。`preview/contact_sheet.png` SHA256 为 `2085b4e9ab6671165f823f7d4d101ad2285eb9a8c4db275372f97efe430e5883`。

Art 视觉自检结论：**首轮图不能提交正式用户审阅**。虽然左右节点可镜像，五官和身体仍过于正面，移动态左右在小屏难以辨识，Product v0.2 的左右十格标准不能判通过。其余帧/图集输出用于核对管线，不作为最终资源。下一次出图按 `PREFLIGHT_REVISION_01.md` 新增 Art/Tech 双签再执行。Creator/目标机仍 `NOT_TESTED`。
