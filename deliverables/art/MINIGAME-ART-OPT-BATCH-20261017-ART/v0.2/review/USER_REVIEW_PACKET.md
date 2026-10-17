# 全批无损资源 v0.2：具体切片与同尺度效果待用户 Gate2

请审核本批**76 件新候选**：73 件此前未裁的新资源，以及 3 件已批样本的透明 RGB 采样修订候选。修订的 3 件为奶茶店 shop_01 body/sign 与樱花 spirit_a_flame，原 v0.1 已批切片及批准均保留；仅在本批 v0.2 具体版本获用户明确批准后，才拟以新3件替代。其余游客7件已批样本原样引用。本次没有修改或导入 `apps/client` 资源。

## 直接看图

- [14 模块审阅总览](contact_sheets/overview.png)：每格做了 fit 缩略，仅供查找资产，**不代表游戏实际显示尺度**；完整分模块图在 `contact_sheets/`。
- [樱花批准场景源与本批重组同尺度对照](same_scale/scene_source_vs_new_same_scale.png)：左右各 3072×1024，按原 v0.3 `instances_bottom_to_top` 的43个实例位置、尺寸、层序作离线静态投影，15件本批樱花候选与原图可见零差；同一投影的单独原图/新图亦在 `same_scale/`。
- 六店 body/sign 原1024²叠放的源与新图同尺度对照：`same_scale/shop_01_body_sign_source_vs_new.png` ～ `shop_06_body_sign_source_vs_new.png`。六店均可见零差。
- 76件各自原尺寸重组在 `review/recompositions/`；实际裁片在 `exports/`，14个真实多层 PSD 在 `source/psd/`。逐件点名和 SHA 见 [资产登记](../ASSET_MANIFEST.md)、[裁片清单](../CUT_MANIFEST.json) 与 [层到导出映射](../PSD_LAYER_EXPORT_MAP.md)。

## 数值与来源

76 件现行批准源到真实 PSD 层的 alpha 与 alpha>0 RGB 均逐像素零差；从 PSD 层取裁框后，仅在 alpha=0 位置回填同件批准源同坐标隐藏 RGB，共 297,322 像素。最终**裁框完整 RGBA**逐通道与批准源相同，原尺寸重组可见 RGBA/alpha 零差。黑、灰、白背景的整数 source-over 全零差。23件原尺寸透明 RGB 在裁框外与源不同，已按 x/y 各 .25/.5/.75 的9相位作 CPU 直通双线性 source-over 实算，最大8bit RGB差 0；另53件原尺寸全RGBA恒等，因此任意相位均同值。原已批3件相同诊断可复现最大约63.126/63.188/62.692，v0.2 三件为0。完整逐项数据和限制在 [比较报告](COMPARISON_REPORT.json)。这不是 Creator/GPU/真机采样通过结论。

76件批准源 PNG 总 18,906,721 字节，新裁片总 13,346,084 字节，按这76文件的字节求和减少 5,560,637 字节（29.41%）。它不计 PSD、未裁资源、压缩包、运行图集或平台包体，不能据此推断 DrawCall/内存收益。14个 PSD 共137,574,022字节，最大单文件20,010,744字节；本批无需单个大ZIP，审阅直接引用上述实际文件。

## 审批边界

268现状 = 76新候选 + 7旧样本原样引用 + 50无收益保留 + 135特殊/未核保留。对话手工 sourceRect、九宫格、字体图集、自定义UV、无匹配源配饰、未获Gate2的U05交互均未通用裁切。旧 v0.1 全批预案/预签和试点87文件身份未漂移；本轮268现行客户端源逐SHA无漂移，见 [源与历史检查](SOURCE_AND_HISTORY_CHECK.json)。前置 Art/Tech 同预案 SHA `fe1221f4069c0f062e80af8b385ef3f638084f9d84025f04f402e3a2d408f083` 已批准，**不替代**本批具体切片 Gate2。Art Owner 已作文件/像素/静态效果核对，组织 Agent 自切图按现行规则直接呈用户，不另加切后效果专业复审或Creator预览门禁。

请用户对本批 v0.2 **76 件具体裁片及上述同尺度重组效果**作批准或退回决定。获批前 Client 不得把这些候选作为正式资源接入。Creator 导入后真实 UUID、trim/offset/UV、实际运行画面、GPU/目标平台采样、包体与性能均 `NOT_TESTED`，由后续接入与运行阶段核验。
