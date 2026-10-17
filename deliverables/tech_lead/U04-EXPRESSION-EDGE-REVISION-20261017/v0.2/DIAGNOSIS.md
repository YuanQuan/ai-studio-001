# U04 脸部断线/重影再修订：独立技术诊断 v0.2

## 基线与圈区

用户再次退回 Art v0.2，明确指出红圈仍有断开、重影；此次目标为 AC_S0 四态、AJ_S2 sad、AD_S0 三态、XJ_S0 surprised 共九态，及共享底层实际波及态。v0.1/v0.2 仅作只读来源。圈框与正确 renderer 映射以 Master `v0.2/ANNOTATED_REGIONS.json`、`NATIVE_REGION_MAPPING.json` 为准。AJ sad 红圈映到 face native 约 x108–266、y8–119，右端越过 256 脸片；AD/XJ 圈上沿可为 native y<0，故必须核 base/front 外延，不能只检查 face alpha。原用户标注附件没有本地路径，上述为 Master 可视圈框近似映射；实际修订需首图前登记更窄的允许蒙版。

## 独立拆层发现

以 AJ_S2 sad 为代表，读取 v0.2 正式 native base 594×1024、256×256 face、186×155 front，依 `face_offset=(120,130)`、`front_offset=(149,170)` 在 native base 合成。base 脸局部在 face 加入前仍可见旧眉/眼碎线；face 本身含新的眉眼及局部皮色/发丝，边缘并非完整不透明覆盖；front 主要恢复前发遮挡，透明脸区的旧 RGB 不参与正常 alpha 合成。三层实片合成可见右额发、眉与眼周多段交叠，断口与双线已存在于原生像素，不是 172×172 总板直裁才产生。AJ sad 原候选 `v0.1/candidates/aj_s2_sad_imagegen_01.png` 与现有语义层/face 要在新方案里逐点对照：候选线是否连续、拆语义层是否切断、base 旧线是否透出、front 发丝是否压错新眉，各项不能混称“正常抗锯齿”。

量化佐证：AJ sad 的右眉额发局部 native x108–204、y34–90 内，base 有 595 个深色像素位于 face alpha<200 的位置，其中 193 个 face alpha=0。此计数混有合法发丝，因此不是“595个旧眉缺陷”；它证明旧底层深线有透出通路，须按像素形状辨识旧五官与应保留发丝。v0.2 曾把 AJ 右眉残灰判为新语义层正常阴影，但用户再次退回已说明可见双线/断口未解决，不能沿用该视觉通过结论。旧 alpha 幂次与亮度阈值试验已失败且计数保留，不能再盲试同类收边。

其余圈区按同一分层树核：AC 四态保留获批黑眼圈疲惫设定，同时区分旧五官残线与黑眼圈；AD 三态圈上沿含 face 外的额发，查共用 base/front 以及眉层接缝；XJ surprised 查前发与眼镜遮挡及左眉，不破坏单次镜圈。当前这些是待逐态实证的检查项，不能将 AJ 结论自动套用。

## 新方法与技术控制点

先在 AJ sad 代表中标记旧五官线像素与应保留的原发丝/黑眼圈/镜圈。先清除底层旧五官（只在授权窄区），再使新眉眼与前发形成单条连续轮廓并核遮挡顺序；必要补绘由 Art 在获准预算内用内置 imagegen 局部编辑，Tech 不制作图片。不得用全脸 alpha 降低、阈值或整图锐化掩盖双线。保留 1024×1536 母版、native face 尺寸、原矩形/支点与 `base → 单态 face → front` 契约。先首样，验证原生三层、PSD嵌入像素、同背景同视窗 U00 实际尺度及圈区近景确实只有一条连续目标线，再扩九态与共用底层受影响态。按先验允许蒙版核 ROI 外 RGBA 零差异和未改 hash；diffmask 是结果证据，不能反向定义允许区。

预算来自 Master 本轮授权：当前最多4次内置 imagegen，累计原批次 32/48，失败/未知保守计数；新方法最多两轮、45分钟与原6小时累计额度取较早停工点。0 CLI、费用/GPU未知。Art/Tech在首图前同批预签，若触及未授权语义或范围先交 Master。自产切图完成后直接交用户 Gate2，不设成品效果专业复审门槛。静态检查不冒称 Client 运行或 QA 通过。

### AJ sad 旧线归因校正

Art 指认 base native x150–160、y85–94 有旧眉黑碎段；独立读取该 11×10 区，base 亮度<100 的像素34个，face alpha 110像素中109个为255。中心(155,89)的face alpha=255。故旧段存在，但多数在当前态被 face 遮住，不能仅凭 base 有旧像素就认定它是当前可见双线的直接来源。必须在用户实际圈出的可见双线坐标，对 `base → face → front` 每步的可见像素做贡献对照；清旧底线可作为防切换/边缘采样保护，当前可见断线还应核 face 语义层本身与原候选的差异。这个校正不改变清旧线加连续重建的预案方向，防止错误归因后仍留下双线。

### AD/XJ 共用 front 旧眉的实际来源补记

Art 在首次共享 front 编辑前登记 `v0.3/ALLOWED_ROI_SHARED_FRONT_ADDENDUM.json`。Tech 独立读取 v0.2 的192×192 RGBA front 并在不透明底色实际 alpha 合成：AD 右眉区域约 native x95–129、y20–27 存在可见深色短线；XJ 左镜圈上方存在可见青色旧眉。它们位于共享 front，前轮“多数脸区透明”的 AJ front 观察不能套用到 AD/XJ。只修改 face 会留下旧眉重影，因此清除共享 front 的旧眉是本轮可见因果修复；同时 front 真前发、XJ 镜圈/光学细节必须保持，五态均需按新 front 逐态重组，未获授权的区域保持零差异。

### AC 前景旧肤色假设的坐标反证（停工诊断）

Art 第二轮后仍见 AC 左前发窄缝，曾拟清 `front` 中所谓 native x22–32、y83–104 旧肤色；该 front 编辑未实际落盘，Master 已要求停 AC。Tech 对照 v0.2 资源登记：AC face source rect 起点 `(350,95)`，front source rect 起点 `(374,140)`，所以 front 文件坐标相对 face native 偏移 `(24,45)`。目标 face native `[22,83,32,104)` 对应 source `[372,178,382,199)`，与 front 的交集仅 front local `[0,38,8,59)`。独立读这块168像素：全有 alpha（251–252），RGB均值约 `(57,49,50)`，为深色真发，没有肤色像素。清除此块会删掉应保护发丝。

此前在 front 文件局部 `[22,83,32,104)` 观察到肤色，但它实际映到 face native `[46,128,56,149)`，并非残缝坐标。因此 `ALLOWED_ROI_AC_FRONT_SKIN_ADDENDUM.json` 的坐标假设不成立，不能执行。正确最小下一步是先在 face native `[22,83,32,104)` 的实际复合结果中重新分离 base、face、front 贡献，确认浅线来源与同位原候选，再提出精确修法；AC 同缺陷本轮自动两轮已满，须保持残缝未通过并交 Master 决定后续授权。不得为赶版本删真发或把未执行的 front 清理写成结果。

进一步在 face native y85/90/95、x22–31 逐像素做 `base→新版face→旧front` 合成：x24–31 的新版face基本不透明、front为深色α251–252，最终RGB约50–63；x22–23无front但base与face同为深色。y100 face局部α降至36–237，x24–31仍由深色front覆盖。由此目标窄框不能支持“front旧肤色导致残灰”的说法。残余浅缝在 Art 1x 对照中可见，但精确亮像素还未有坐标清单，故根因目前为未定位。若未来另获授权，最小可执行诊断须先给残缝亮像素的 face native 坐标，再按 front=(face−(24,45)) 查三层贡献、与候选同位像素比对；只有定位后才定义修复层与笔触。当前本轮两轮已满，AC该处不再编辑。

### AC 对照图纠正与实际结论

Art 确认先前浅竖缝来自诊断对照把 front 错放在 face 原点；front 清理从未执行，也未生成新版 front。正确 native 位置为 base 内 face `(48,95)`、front `(72,140)`。Tech 独立用当前 v0.3 AC happy face 与旧 base/front 实片重组 454×1024 native，和 v0.3 source canvas 在 base rect `(302,0,756,1024)` 的 RGBA 裁片逐像素相等（差0）。将 source 上部1024×850按 Lanczos缩至614×510并置于 U00 `(-55,210)`，发丝区域的不透明像素 RGB 与真实 v0.3 U00 差0。正确 `ac_s0_happy_native4x.png` 中前发连续，未见先前“竖缝”。因此前述“残缝未通过/需另授权清front”是假证据图导致的暂定判断，现撤回；保留诊断过程以追溯，不倒写旧记录。AC第二轮候选接续是否在其他三态同样成立仍需逐态真实组合核，不能仅凭happy推断。

### 最终静态核验补记（Art v0.3 冻结后）

AC sad/smile/angry 与 happy 同按正确 source rect 重组，native base 范围内与各态 source canvas 的 RGBA 差均为 0；四态新 face 的实际像素差只在事前登记 ROI 及连接发丝窄条内，surprised 未变。AD/XJ 前景旧眉确有可见贡献；清除后影响共享 front 的五态，Art 已事前登记其他态新眉局部接续，五态均按新 face/front 输出。AJ sad、AC 四态、AD/XJ 十态的 face/front 差异逐像素核对，所有修改区外为 0；20 张受影响 U00 的差异局限圈域。30 格总板各格来自真实 U00 的 172×172 原像素裁图，未另做脸部缩放。

AD v0.2 继承一项源层限制：1024 full PSD 的 BASE 图缩为 native768 与清单 native base 在眉圈附近有 467 个 RGB 像素差（native `[310,146,336,179)`，alpha 均 253）；以相同 v0.3 face/front 合成后仍有 96–204 个可见像素差。原因是旧流程先改 native，再把变化回投 full source，双向重采样不保证可逆；本轮未改这两份旧 base。为给当前实际切片提供准确可编辑参照，Art 增加 AD 五态 768×768 native 三层 PSD。Tech 读回每态 PSD 中 base768、face192、front192 嵌入像素均与当前清单 PNG 逐像素相同，偏移分别 `(0,0)`、`(232,139)`、`(232,139)`；PSD 合并页和预览 RGB 差 0。旧 full PSD 仍作为历史语义层源保留，不能用它声称 native 严格逐像素等价。详细数值与边界见同目录 `TECH_CHECK.json`。
