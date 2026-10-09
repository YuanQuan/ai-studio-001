# U03 01/02 代表样张 r2 技术后验

批次 `U03-SHOP-SIGN-REVISION-V02`，继承已批准的 v0.2 方案及 Art/Tech 同批制作预签。**结论：01/02 首样技术后验通过，可按原同批预签继续 03–06。** r1 对 02 预览字形的退回记录保留在 `SAMPLE_TECH_POSTCHECK_V02.md/.json`；本次 r2 针对该项修复及分层重新检查。无需新增首样用户审批；最终六店自行切图实片包直接送用户 Gate2 审核。

## 实际文件核对

读取 `SAMPLE_BUILD_REPORT_V02_R2.json`、`SAMPLE_DIFF_REPORT_V02_R2.json`、`SAMPLE_REVISION_R2.md`。逐一重算 r2 两份 PSD、四张 body/sign PNG、两张重组图的 SHA-256，均与报告匹配。Pillow 实际可打开两份 1024×1024 PSD，分别 11/8 层；四张 PNG 为 1024×1024 RGBA。390×844 与 720×1280 静态视窗尺寸逐件匹配；旧新并排和重组图均在 `preview/sign_revision_v02_r2/`。这些静态图不作为 Creator 运行证据。

| 样张 | 后验结果 |
|---|---|
| 01 | body SHA `A299B998D8E94C67D598B1B1414C7EDA8167E612680A0A99056BA0B010008BED`，与 r1 已核 body 同字节；新 sign SHA `890BCF6FA6506A65DDB3EDC2A66B4CD9107684A05388C55050005DA12E61605D`，也与 r1 同字节。r2 PSD SHA `7362E9B891A0D37022A56A8EEE53EBBD16722A982BE313501C63EA644E293170`，11 层，将新牌拆为挂件/牌板/logo 独立层。新牌 bbox `(821,449,943,651)`，右边余 81 px；body 仅在旧牌缺口 ROI `(346,470,678,591)` 修改 40,172 像素，允许区外差异 0。拆层未改变显示效果；重组中右灯、窗口、檐口可见。**PASS**。 |
| 02 | body SHA `03036F8054C97AE8D48F31E8E8FB074EADD9270E87FDD28DAEF7A4FDC9268E56` 与旧 Gate2 完全一致；新 sign SHA `6DEC87F0EEC638F6F5915A7D4D5C8C51995B3FC320A9F253194352410EA246E6`。r2 PSD SHA `3B57ADC63C2D641FB8CFDFA35C5A1E4887146F623F5EBD134DE29A6022A8AA61`，8 层，牌板、勺/浆与字独立。`source/build_samples_r2.py` 第 73–86 行从 v0.1 正式 PSD 的 `sign_glyph.png` 裁原“糖”轮廓、调色、缩放；生成式预览文字未作 r2 字源。新 sign bbox `(685,627,820,890)`，距 foot y=900 为 10 px；画布右边余 204 px。允许区外差异 0；重组中车轮、伞与糖画主体可见。**PASS**。 |

12 片全画布 RGBA 的约 48 MiB 仍只是像素容量估算。新批全量实际 alpha、Creator 导入、图集页数、驻留内存、DrawCall、Web/设备运行与性能均 `NOT_TESTED`。Art 继续 03–06 时须保持获批原 PSD 继承和两片契约；03 新“现”字使用已核官方 OFL 字体或可追溯原创字形，并在实图核与旧“烤”的字效协调。六店切片版本、重组及限制由执行 Agent 核对后直接呈用户 Gate2；批准前 Client 不得替换现有贴图。
