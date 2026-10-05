# 用户指定原始生成图组装 PSD v2

日期：2026-10-05。采用 bggg-creator-image2psd skill 的原版 assemble 脚本。

用户指定四个文件，从底到顶：

1. `exec-94477409-2d97-4ffe-94ac-7ed6b13aa590.png`：天空。
2. `exec-933386cf-d4a2-473b-a3d8-e9c943399806.png`：山峦与远方建筑。
3. `exec-23db4183-120a-4142-8aea-afcbf4370303.png`：地面、树木与右侧走廊。
4. `exec-c82fb659-2bf7-414a-a322-2e532ea7a749.png`：栏杆、桥与前景。

输入文件原始位置：`C:/Users/admin/.codex/generated_images/01a1020f-bbca-7511-9e49-a8475c69ebe6/`。附件路径开头多出的 `/` 已按 Windows 原路径解析。四张输入逐字节复制到本目录 `layer_sources/`，保留原文件名；未重画、校准颜色、修改透明度、移动或缩放。

统一 PSD 画布为 2172×724，四层原点均为 (0,0)，普通混合、100% 图层透明度。天空源图实际为 2171×724，其余三张为 2172×724。天空按原始尺寸放置，最右侧多出的 1 像素列留透明，PSD 合成底色为黑色。skill 导出的四张全画布 PNG 均为 2172×724。

交付：

- `moonlit_four_layers.psd`：四层可编辑栅格 PSD，图层名注明原始文件短 ID。
- `overall_from_psd.png`：保存后回读 PSD 的四层原始通道并重新合成导出的整体效果图。
- `assembly_preview.png`：组装时预览。
- `psd_full_canvas_layers/` 与 `four_layers.zip`：四张全画布 PNG 及压缩包。
- `manifest.json`、`validation.json`、`source_hashes.json`：组装参数、验证记录及输入来源哈希。

验证确认：PSD 含四层、画布 2172×724，逐层透明通道和可见 RGB 与用户指定输入原位放置结果一致；PSD 回读导出与其内存储合成图、组装预览逐像素一致。

本次效果用于直接查看这四张原始图的合成结果，保留输入图已有的轮廓、光晕、色彩和位置差异。PSD 可独立隐藏、移动和编辑四个栅格层。未在 Photoshop/Photopea GUI 中打开，验证限于文件结构、Pillow 可读性、图层回读与导出图目视检查。本版待用户查看，不代表正式资源批准。
