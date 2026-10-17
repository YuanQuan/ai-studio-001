# 阿灯／小锦 0 魂五态表情修复交接

本单元按用户批准的 v0.2 制作方案、同批 Art／Tech 首图预签，先完成 AD_S0 与 XJ_S0 的 happy 代表样。六代表样实际通过 Art／Tech 复签后，Master 于 2026-10-17 以 `EXPANSION_RELEASE.json` 放行本单元余 8 态；现两人各五态均已完成内部制作与 Art 自检。未取得 Gate2 用户对具体切片的批准，未接入 Client。

源画布 1024×1536；AD 面部源矩形 `[310,185,566,441]`，XJ `[330,223,586,479]`。两者均从 256×256 ROI 按 0.75 缩放为 192×192 原生 face/front，底图为 768×768。AD 原生偏移 `(232,139)`、XJ `(248,167)`。每态独立内置 imagegen 调用，共 10／16 次，均成功，无未知调用或额外修复生图；原 18 次上限按正式扩批释放收紧为 16。全批 48 的即时计数由 Master 合并，不能据本单元账本自行推断。逐次输入、提示、时刻、候选 SHA 见 `GENERATION_LEDGER.json`。

两张 happy 沿用已过首样审核的 AD final02、XJ final03。其余八态分别在 Art 亲定的眉、眼、嘴多边形细掩膜内提取 4–5 个真实栅格语义层；冻结两阶段已审 foundation base 与 front，各态不重作肤底、发际或镜片。XJ front 一次显示获批高近视金／蓝灰圈纹及折射细节，旧 base 重复环已清、原 front 眼窗 18 个淡肤旧眼点已清；四个新增候选自带镜框均未进新 oneface。happy 的单眼眨眼仅属该态，其他四态分别重画双眼透视。原批准图、旧 PSD、旧正式 base/front 与 happy 首样文件均保留原字节。

每态有 1254×1254 候选、256 特征 mask/定义与语义层、192 face、冻结 768 base／192 front、768 实际重组、1280×720 U00 真背景静帧、43 层五态互斥 PSD 与预览。每个 PSD 都含五组新语义层，只有当前态可见，旧表情及旧 front 均隐藏。`review/expansion_draft/five_state_psd_native_validation_01.json` 逐项绑定 SHA 并实读 PSD flag；原生 ROI 外对旧正式 base 的 RGBA 差 0，PSD 预览与特征重组像素至多 2 级整数取整差。`native_u00_recompose_report_01.json` 记录 U00 背景裁剪、尺寸、肖像实际 570×570 缩放与 `(10,150)` 贴图坐标。表情脸在 U00 实际约 143×143 px；两张 A–E 无情绪标签盲辨板的映射另存，Master 已事先作答后核对 10／10 正确，见其 `BLIND_ADXJ_DRAFT01_RESULT.json`。这些显示像素此后未修改，板及 U00 SHA 可证明沿用盲辨结果。

`ASSET_SUPPORT_MANIFEST.json` 给出全部逐态素材与 SHA，`SAMPLE_ART_REVIEW.json` 给出 Art 逐态实图判断；上述为内部 Art 交主 Art／Tech 复审的结果，不能替代正式 Gate2 用户审批或接入后运行对照。PSD 可编辑范围为逐态眉眼口栅格和底图／前景层，不宣称原画笔触或矢量可逆。
