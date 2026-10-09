# U03 六店牌匾字体定向修订制作预案 v0.1

批次 `U03-SIGN-FONT-R1`。依据用户 2026-10-07 指令及 `project/changes/CP-U03-SHOP-SIGN-FONT-20261007.md`，本预案只覆盖六店 `sign_glyph`；原批次视觉形制、挂位、店体、画布、脚点、双片上限均沿用已签 `FULL_BATCH_PLAN.md` 和 `FULL_BATCH_PREFLIGHT.json`。旧预签的逐笔自绘字体方法不再适用。本预案须经 Art、Tech Lead 对同一 SHA-256 预签后才可写入拟正式 PSD、切片或 `exports/`。

## 字体、来源及使用方式

- 选用 **Ma Shan Zheng Regular**。官方字体项目：<https://github.com/googlefonts/mashanzheng>；原版字体 `source/font_candidates/MaShanZheng-Regular.ttf`，SHA-256 `6D2546BB189C732A8CA29AF9E22457B152387D158AA459E4AC2CE1E51788B7FB`。Tech 独立解析实际 TTF 的 name 表得 `Version 2.003`（head.fontRevision 约 2.003006）；以文件 SHA 锁定本次具体字节版本。
- 许可为 SIL Open Font License 1.1，官方文本 <https://github.com/googlefonts/mashanzheng/blob/master/OFL.txt>，本地逐字副本 `source/font_candidates/MaShanZheng-OFL.txt`。本批只把字体光栅化为牌匾字层 PNG，并写入 PSD；游戏资源不嵌入、不分发 TTF。保留字体、许可和来源记录供审计。若改为分发字体文件，先核 OFL 的文件分发条件并另签。
- 已在 `preview/font_revision/six_sign_font_comparison_mashan.png` 用六店旧字/新字两排同尺度比较；新字笔势有统一的中式夜市书写感，在各自牌底上仍保留木、糖片、熏木、纸、竹的形制差异。每店完整 390×844 候选投影见同目录 `shop_0x_mashan_390x844_candidate.png`；候选字高数据为 `MASHAN_CANDIDATE_METRICS.json`。该静态比较不是 Creator/设备通过结果。

## 定向修订步骤与不能改变的边界

1. 以现有各店 `source/shop_0x/sign_0x_glyphs.png` 和 `source/psd_work/shop_0x/layer_sources/sign_glyph.png`、`psd/shop_0x_*.psd` 为旧版证据，先记录 SHA，不删除；新字候选来自固定字体文件、准确牌文「奶茶、糖画、炭烤、理发、花灯、投壶」及 `source/font_candidates/render_mashan_preview.py` 的字盒/颜色/抗锯齿参数。逐字保持正读，不拉宽、扭曲或临摹参考字。
2. 预签后把六张候选 `shop_0x_mashan_glyph_candidate.png` 作为独立 `sign_glyph` 工作层，重建六份 1024² PSD；其余可见层、隐藏 `reference_source`、牌底、挂件与店体均保持逐像素一致。新 PSD 在原路径产生前先把旧版隔离进有版本和哈希的历史目录，防止无法追溯。不得以整体重生图替换当前 PSD。
3. 仅从新 PSD 可见层和现有层序输出每店 `body`、`sign` 两张全画布 RGBA PNG；`sign=sign_hardware+sign_board+sign_glyph`。用同尺度透明重组逐像素或最大 1/255 alpha 舍入比对 PSD 的实际可见层重组。另出六店 720×1280 与 390×844 同脚线静态投影，不用局部放大代替全视口。记录每个字的 alpha bbox、高度和有效细笔、字底对比、牌文、黑/灰/白/夜蓝四底 alpha 边。390 宽以 1024→316 px 的保守显示复核字高≥24 CSS px、细笔≥2 CSS px；未达则在原牌内部调整字号和笔宽，不能擅改牌形挂位。
4. 用独立 PSD 解析器核层名、顺序、眼睛状态：工作层可见，`reference_source` 隐藏、非导出；读实际工作层 RGBA 通道重组，不用不透明缓存预览当运行资源。做一个仅改 `sign_glyph` 的局部探针，核其他图层及遮挡不变。记录各 PSD、两片 PNG、重组图、投影图、字体及许可证的相对路径与 SHA-256、sourceRect/originalSize/foot、待导入 Creator 路径和 `PLANNED_NOT_IMPORTED` 状态。
5. 新版实图完成后 Art 核视觉，Tech 核纹理/字尺/层结构/两片重组，Client 只讨论切片交接，不正式接入。六店具体新版切片及同尺度重组由 Master 提交用户 Gate2 审批；获批前 Client 任务保持未解锁。

## 停止条件

任何一店出现字错/缺字、字形不清、遮挡经营线索、字高或细笔低于候选线、PSD 其他层发生变化、来源层误显示、两片无法重组、需要第三张纹理、字体授权证据变化，停止该店正式导出，保留旧/新证据，按受影响范围修订预案并重新预签。静态投影不作为 Creator Web 性能或设备可读性验收。
