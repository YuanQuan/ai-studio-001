# 02 糖画车前小牌候选源

状态：**Art 母版 Owner 待筛选的候选源**。本目录没有正式 PSD、切片、Gate2 结论或客户端接入结果。

## 范围与依据

- 同批范围依 `../../FULL_BATCH_LIGHT_R3_PRODUCTION_ADDENDUM.md`：沿用 v0.2 车体及中间明暗，只提高车前小立牌的板、糖勺和糖浆清晰度；保留小“糖”字，图案语义不变。
- 造型参照 `../../../v0.1/preview/mixed_signs_v04/six_shop_mixed_signs_overview.png`，实际尺度参照 `../../../v0.2/preview/sign_revision_v02_final/shop_02_recomposed.png` 与 `../reference/shop_02_v02_sign_zoom.png`。项目内该方向图的商业改编权限已由用户确认。本轮没有输入在线第三方图、品牌图或外部字体。
- 旧 v0.2 正式 sign 位于 1024×1024 画布的 `(685,627,820,890)`，脚点仍为 `(512,900)`。这里的原始 PNG 不是该画布的现成切片；需由母版 Owner 组合和检查遮挡。

## 文件与推荐

- `board_tall_raw.png`：**优先板层**。窄高木板带两短脚；牌板和右侧厚度清晰，暗面保留木纹。画法比 v0.2 略厚实，需母版 Owner 在相同背景与尺寸下确认。
- `spoon_syrup_raw.png`：**独立勺浆层**。勺口、把手和短琥珀糖浆在小尺寸仍有清楚轮廓。
- `placement_preview_no_glyph.png`：只把上述两源按建议尺寸放回 1024 画布；`context_preview_no_glyph.png` 只叠 v0.2 body 和蓝底供位置观察。**二者都没有“糖”字，均非提交用户的成品效果。**
- `candidate_a_sign_raw.png`、`candidate_b_sign_raw.png`、`candidate_c_sign_raw.png`：初轮完整无字牌参考。勺与板在单张 PNG 内合平，只可作为造型/材质候选，不能宣称勺、板已独立可编辑。A 的勺最接近小图案，B 装饰较多，C 较亮但牌面较宽。
- `board_blank_raw.png`：较宽空白板备选；缩到原牌 bbox 可能变形，故不优先。

## 建议组装与字源

先按不透明主体裁掉生成 PNG 周围的微弱透明噪点，保留原始文件不改。`placement_preview_no_glyph.png` 的板主体目标 bbox 为 `(685,627,820,890)`；糖勺浆约放在 `(710,647,794,725)`。下半板留给小“糖”，建议先试约 70–78 px 宽的字形，再同 390/720 视窗核读字与勺的主次。预览仅使用 Pillow 缩放和 alpha 合成，没有画字或修改 v0.2 body。

正式“糖”字只从 `../../../v0.2/source/psd_work_r2/shop_02/layer_sources/sign_glyph_reused_sugar.png` 的原正式字层（SHA-256 `671874A020AFBC180B458BA1EAF26641E37BE5A5018FCA442D0C2FED575A2645`）或经核许可的新字源来。该正式字层原 bbox `(706,765,799,859)`，原版偏大且发糊；不要仅放大旧贴片，也不要从 AI 方向图或本目录候选抠文字。文字应独立栅格层，由母版 Owner 处理字重、缩放和边缘清晰度。

## 来源、可编辑范围与限制

六张原始源由本次 Codex 内置 imagegen 生成，提示要求无字、真透明底、暖木与通透琥珀糖浆；原始生成文件已原样复制进本目录，SHA 和尺寸见 `SOURCE_MANIFEST.json`。生成式图像本身不提供原生矢量、真实物理材质层或 PSD 语义层。`board_tall_raw.png` 与 `spoon_syrup_raw.png` 是**两个可分别移动的栅格对象**；勺内木头和糖浆仍在同一张源图中，若最终预签要求二者进一步拆层，须由母版 Owner 定向遮罩/补绘并记录。完整牌 A/B/C 内板与勺也不可无损独立移动。

原始图均有极低 alpha 的边缘噪点，预览按 alpha >16 的主体 bbox 裁切后缩放；正式导出需检查边缘半透明、缩至实尺后的勺尖及木边清晰度。木板生成画法与已选图不是逐像素继承，必须经同背景、同视窗、同尺度实图复核。未制作 PSD，未对客户端贴图、性能或运行效果作判断。
