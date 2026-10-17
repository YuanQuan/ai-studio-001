# 六店长表情修正方案技术评审 v0.2

**结论：同意将 Art v0.2 具体方案送 Gate1 用户审核。** 主方案 `deliverables/art/U04-EXPRESSION-REPAIR-PLAN-20261017/v0.2/PRODUCTION_PLAN.md` SHA-256 为 `691699afcd70db3df4c82490cf7be27be1f3c055f72ac1a69907b2945e9e955a`。本 Review 是制作路线可行性评审，不是首图前 Art/Tech 同批预签，更不证明新资源或运行性能已通过。旧 Art/Tech v0.1 的人工数位板路线已被替换，保留作内部历史，不用于用户送审。

## 源和映射

`SOURCE_AND_MAPPING_CHECK.json` 记录现行18阶段、90态，首批六阶段30态。Art 与 Client 映射 JSON 解析后全量相等；426 个映射源引用及30个获批人形基准文件存在且登记 SHA 匹配。18份PSD的身份、画布和可见层名由 Art `SOURCE_PSD_AUDIT.json` 核得。层名与文件哈希不能证明隐藏内容、原生笔触或局部可编辑性。现行 Client 路径按阶段与状态选择 `base -> oneface -> front` 三层。

Art v0.2 `ASSET_MANIFEST.md` 的稳定ID已与旧正式清单核对：`U04_PORTRAIT_{STAGE}_BASE`、`U04_FACE_{STAGE}_{STATE}`、`U04_FRONT_{STAGE}`；Client 计划路径分别为 `portraits/tex_u04_{stage}_base.png`、`faces/tex_u04_{stage}_face_{state}.png`、`portraits/tex_u04_{stage}_front.png`，与当前加载模式一致。MT/AT/AC/AJ脸源及导出256×256、缩放1.0；AD/XJ脸源256×256、导出192×192、缩放0.75。现有source rect、offset、pivot保持。新版真实UUID须未来接入时查资源及`.meta`后登记；当前未导入，不宣称已验证新版UUID。

## 制作路线可行性

内置 `image_gen` 逐态编辑面部ROI有可调用工具入口，符合当前 Agent 可执行能力。工具可生成候选，但**不保证**原图尺寸、像素配准、精确蒙版、多图层PSD或本地文件路径；方案要求按实际返回结果落地，失败停候选，只有可配准输出才进入确定性合成。眉眼嘴只在能准确分离时记独立语义栅格层；`SKIN/SHADING`支持层组内合成到最终 oneface 输出，仍保持既有三层 Client 接口。不能分离的区域按合并范围和编辑限制记录，不虚构恢复原生笔触。

ROI外像素和alpha以**现行PSD实际可见层及旧切片重组**为冻结基准，保留已完成的清边；获批原立绘作身份和缺失内容参考，不能把清边前软晕拷回。候选的ROI边缘、遮罩、alpha/ICC归一和PSD互斥可见须在实图中检验。小锦0魂获批圈纹高度近视眼镜须单次保留镜框、圈纹、透光和光效；仅移除base/eyes/front重复或错位污染。front独立提取若损光效，先从现行可见源确定性转移，不可删掉圈纹。

预算算术为30个情绪首候选、最多6个阶段脸底/遮挡候选、最多12个返修候选，合计**48次调用/候选上限**；失败或结果未知也计数，先查原结果，不盲目重发。先六代表样张和小锦基础核验，未过不扩余24态；其余12阶段60态另提扩批。90分钟/6小时是停工复核估算，不是工具已验证产能或实际耗时；费用/GPU时间未知，首图前预签仍须核真实批次与预算。

## 后续验收和Gate

代表样张及成品须分别核：①同背景、1280×720视窗、实际缩放下的五态隐藏标签辨识、表情自然度与身份；②统一解码/ICC/alpha配置下ROI外可见像素与alpha保真及清边；③PSD互斥层、真实切片重组、镜片遮挡和三层映射；④接入后的实际截图、贴图/内存/DrawCall与目标设备。自重组零差只说明该合成链一致，不是审美判断。目前新图、PSD、切片和运行验证均 `NOT_TESTED`。

Master可呈 Art v0.2 方案、审核包和本 Review 请用户做Gate1决定。用户批准具体方案后，首张样张前另做Art/Tech同批预签；实际切片和同尺度效果需独立Gate2用户审批，Client才可正式接入。
