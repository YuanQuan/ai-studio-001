# U03 01/02 代表样张技术后验 v0.2

批次 `U03-SHOP-SIGN-REVISION-V02`。结论：**01 技术检查通过；02 几何与字节检查通过，字层来源与已批方案冲突，需局部修订后复核。** 本记录只评样张技术事实，不是六店 Gate2 专业效果复审，也不增加用户首样审批。当前新切片不得接入 Client。

## 证据与实测

读取 Art `SAMPLE_BUILD_REPORT_V02.json`、`SAMPLE_DIFF_REPORT_V02.json`、`SAMPLE_VISUAL_MATRIX_V02.md`、`SAMPLE_ART_POSTCHECK_V02.json`，并重读两份 PSD、四份切片、两份重组的当前文件与 SHA。八个文件 SHA 均与 Build Report 对应值一致。Pillow 可打开 PSD，均 1024×1024，分别报告 9/6 帧；四张 PNG 均为 1024×1024 RGBA，实际 alpha bbox 与报告一致。静态视窗、旧新同画布图存在，已查看旧新并排；它们不是 Creator 运行或实际性能证据。

| 样张 | 结果 |
|---|---|
| 01 | body bbox `(142,280,882,900)` 不变；新 sign `(821,449,943,651)`，距右画布边 81 px；脚点 `(512,900)`。旧牌撤后 body 仅在 ROI `(346,470,678,591)` 改 40,172 像素，范围外差异 0。右檐牌在画布内，重组图中挂点、灯、窗口未见明显错遮。body SHA `A299B998…`，sign `890BCF6F…`。**PASS（首样技术范围）**。 |
| 02 | body SHA `03036F80…` 与原 Gate2 字节一致；新 sign bbox `(685,627,820,890)`，距 foot y=900 为 10 px，画布右边余 204 px；旧新牌范围外差异 0。重组中牌位于车前，车轮及糖画主体可见，局部遮住前凳与 Art 已披露的一致。sign SHA `25A71B1D…`。**几何/切片 PASS，字源 REVISE**。 |

## 必修项与继续条件

Art 的 `SAMPLE_VISUAL_MATRIX_V02.md` 明写 02 小“糖”来自用户确认预览中的生成栅格字形；获批 `PRODUCTION_PLAN.md` 明确禁止直接把 AI 预览文字当正式字层，同批 Art 预签要求优先使用旧正式 PSD 的 `sign_glyph`。因此本次 02 样张不能标为完整通过。Art 需只对 02“糖”改用原正式 glyph 或来源与许可完整的新字，保留原版历史，更新 PSD、sign、重组、静态视窗、SHA 与差异报告；Tech 随后复核 02 局部。01 可保留本次已核结果。修订通过后同批可继续 03–06，最终六店实片包按自行切图路径**直接提交用户 Gate2 审核**，无需额外成品专业效果复审。

未测试：Photoshop/Photopea 人工开存、Creator 导入、构建、实际 Web/平台显示、驻留内存、图集/DrawCall 和性能。未将静态图判作运行通过。
