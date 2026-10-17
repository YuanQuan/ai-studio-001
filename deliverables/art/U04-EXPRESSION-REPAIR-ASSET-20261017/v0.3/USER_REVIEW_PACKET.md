# U04 表情边缘修订 v0.3｜待用户审核

本轮把圈出的断眉、双线与前发遮挡从原 1254 候选按原位重提；AD、XJ 还清除了共用前景层中真正叠在新眉上的旧线。AC0 的黑眼圈、XJ 的眼镜圈、各态眼口和角色姿态保留。未新增生图调用，Client 未接入。

请先看 [九个圈选状态的原生 1:1 修前／修后](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/review/NINE_CIRCLED_STATES_NATIVE1X_BEFORE_AFTER.png)，再看 [1280×720 U00 实际显示像素对照](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/review/NINE_CIRCLED_STATES_U00_ACTUAL1X_BEFORE_AFTER.png) 与 [30 态新总板](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/review/U04_30_STATE_NAMED_ACTUAL_SCALE.png)。每态另有 `review/compare/*_native4x.png` 放大近图、透明切片、差异遮罩和真实 U00 图。

本轮实际改动：AC0 四态前发／眉交叉、AJ2 sad 右眉与斜前发、AD0 五态右眉（含共用层连带 happy/smile）、XJ0 五态左青眉（含共用层连带四态）。MT、AT 全套以及 AC surprised、AJ 其余四态维持旧文件 hash。AD/XJ 共用 front 只在事前登记的旧眉窄区清 alpha；真实前发与 XJ 镜圈未清。

[资源清单](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/ASSET_MANIFEST.json) 与 [切片映射](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/LAYER_EXPORT_MAP.json) 指向真实当前文件和 SHA。四个阶段的新母版及逐态核验 PSD 位于 `source/`：AC `u04_ac_s0_expression_v03.psd`、AJ `u04_aj_s2_expression_v03.psd`、AD `u04_ad_s0_{happy,surprised,sad,smile,angry}_expression_v03.psd`、XJ 同五态。各 PSD 保留旧语义层（隐藏）、逐态新五官层、当前局部补层与 base/front，打开默认态互斥；各态透明 face 与 AD/XJ 新 front 在 `exports/`。脚本可读回 PSD、源语义重组与 20 态 face 像素一致；尚未做 Photoshop 界面人工打开，也未做客户端运行或正式 QA。

AD 另附五份 `source/u04_ad_s0_{happy,surprised,sad,smile,angry}_native_composition_reference_v03.psd`（768×768），每份直接放入清单中当前原生 base、对应 face、当前 front，原生偏移均为 `[232,139]`，用于核对实际切片三层。原有 1024×1536 AD PSD 保留源语义编辑母版。其 v0.2 继承的 `BASE_REPAIR` 源图缩至 768 后与当时导出的原生 base 有 467 像素差异（原生框 `[310,146,336,179]`，局部可见）；因此原源母版不作为 AD 原生 base 的逐像素证明。本轮没有改动这两份继承图或当前 U00 成品，实际原生组合以新增验证 PSD 和现行切片为准。 Tech 静态读回确认五份验证 PSD 的嵌入层与对应实片及原生偏移逐像素一致、PSD 合并图与工具预览 RGB 差 0；独立 PIL 三层合成与该预览仅有 1–2 通道值的合成舍入差。

[修订检查与尝试账本](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/REVISION_CHECK.json) 记录：AJ sad 第一轮眉线改善但斜发仍灰，第二轮补齐后通过首样；AC 四态第一轮修水平擦除带，第二轮接续左邻同一发丝。其后一个诊断近图把 AC front 错放到 face 原点，造成“残余竖缝”假象；正确坐标下 native/source/U00 三层实链相等且发丝连续。曾拟议的“front 肤色污染”归因已撤回，未修改 AC front，也没有第三次 AC 资产编辑。预签原件、错误诊断记录及更正见 [最终诊断补充](/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.3/DIAGNOSIS_ADDENDUM.json)。

本包是具体资源 Gate2 用户审核输入。用户明确批准本版本前不导入 Client；静态专业核验与用户决定由 Master/Producer 在各自记录中收口。
