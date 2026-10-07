# U01 温和地府元素｜首张正式资源出图前同批预案 v0.2

任务 `U01-GENTLE-UNDERWORLD-ASSET-001`；批次仅为已批 U01 四层夜景的局部美术修订。制作前方案 `U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.1` 已在 `tasks/U01-GENTLE-UNDERWORLD-ART-PLAN-001/ARTIFACT_APPROVAL.json` 登记为 `USER_APPROVED`。本文件供 Art 与 Tech Lead 对**同一 SHA-256 的文字预案**分别预签；在两份预签均为 `APPROVED` 前，不绘制、生成或导出任何拟正式使用的新图、PSD、切片或样张。本批不修改 Cocos、交互、镜头或已接入资源。

## 0. v0.1 工具偏差与本版重新出图门禁

`v0.1` 在原 Art/Tech 预签未列明 Node/sharp SVG 栅格化工具的情况下已生成图片；Tech 判定该版本只能作为**历史试制/偏差证据**，不得追溯认为“首图前工具已预签”，也不提交正式 Gate2。本 `v0.2` 在任何新渲染、PSD 组装或 PNG 导出**之前**完整列出实际工具、源路径、许可和方法，Art/Tech 对本文件新 SHA 分别签认。双签后从获批旧 PSD 四层与锁定的原创 SVG/绘制脚本**重新生成** v0.2 文件并记录新哈希与运行时版本；不得将 v0.1 PNG/PSD 原封复制为 v0.2 产物。位置、外观、四层范围及 Gate1 已批准的设计语义不变。v0.1 图片和源文件保留真实历史，不改其二进制或哈希。

## 1. 已批准源与版本锁定

| 项目 | 本批锁定内容 |
|---|---|
| 已批母版 | `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`；SHA-256 `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`；2172×724；四个全画布图层，依次为 L01 天空月云、L02 山与远楼、L03 柳树地面牌楼、L04 桥栏河水。母版保持只读，另存本任务 v0.2。 |
| 已批导出 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` 中四张全画布 PNG；`project/ASSET_HANDOFF_REGISTRY.md` 已登记各自哈希与正式 Client 身份。它们只作旧版逐像素基线，不覆盖、不移动、不重新接入。 |
| 视觉锚点 | `deliverables/art/U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.1/VISUAL_ANCHORS.md`、`PLACEMENT_AND_LAYER_MAP.md`；保持冷蓝夜景、暖橙灯、月/山、中央桥河、纸船、柳树、右端牌楼石兽、通路和控件留白。 |
| 来源与权利 | 已批 `deliverables/art/UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001/v0.1/RIGHTS_AND_SOURCE.md` 登记用户 2026-10-05 声明“我拥有原图及商用改编权”。旧 `process_notes.md` 记录四张输入来自 Codex `generated_images`，由本地 bggg 原版脚本组装。2026-10-07 查阅 OpenAI 公开 [Terms of Use—Content](https://openai.com/policies/terms-of-use/) 与 [Service Terms §6](https://openai.com/policies/service-terms/)：前者说明用户与 OpenAI 间输入/输出权利分配、输出可能相似及输入权利责任；后者涉及图像能力。本预案不据公开条款推断用户特定账户合同或第三方权利已独立核清。 |

源检查只读执行：重新核 PSD/四张 PNG SHA、尺寸、PSD 可打开性和四层层序。Tech 本批只读检查指出旧天空的最初输入宽为 2171px，已批 2172px 全画布 L01 的最右 1px 是**历史透明边**；旧 L04 的 alpha bbox 为 `(0,79,2172,724)`。两者均按历史基线保留，不能把天空末列透明误报为新增穿帮或自行补绘。若实际 PSD 不能读出四层或合成与已批重组不一致，停止正式出图，记录差异并由 Art/Tech 修订本预案重签。不得以截图、旧 PNG 重绘整景来代替源 PSD。

## 2. 局部笔触与可编辑母版

按已批方案只增下列五个独立对象层，均为原位透明全画布层；每个对象另保留可编辑的路径/笔触源和绘制记录。旧四层锁定、原可见像素保留；透明叠合只在批准包围盒内产生差异。`gu01_left_flower`、`gu01_right_flower`、`gu03_waystone`、`gu04_plaque_lettering` 归 L03 语义，放在旧 L03 之上、旧 L04 之下；`gu02_bridge_carving` 归 L04，放在旧 L04 桥石像素之上。若石刻要随石面纹理做局部混合，先保留独立层和原像素，不直接破坏旧 L04。

| 对象层 | 允许的源画布包围盒 | 画法与遮挡底线 |
|---|---|---|
| `gu01_left_flower` | x920–948 / y438–480 | 灌木内两支短圆彼岸花，暗珊瑚红、蓝绿叶；由 L04 桥栏自然挡住前沿，不出血色尖刺。 |
| `gu01_right_flower` | x1225–1253 / y438–480 | 右侧少量同族但不镜像的花；不挡灯柱和桥面。 |
| `gu02_bridge_carving` | x1071–1111 / y441–465 | 桥心原石面三瓣莲与短曲水纹，青玉灰低对比；贴合石块透视，不改拱洞、栏杆和桥轮廓。 |
| `gu03_waystone` | x118–165 / y427–493 | 柳树旁圆肩小景石、浅莲纹和少量苔藓；脚部让旧植被视觉遮挡，不占通路、不似墓碑。 |
| `gu04_plaque_lettering` | x2034–2092 / y253–278，且必须在现有木匾内缘 | 原创逐笔手绘“忘川”二字；暖米金、不发光、不新加匾框。字稿和最终透明层独立保存，不调用或描摹系统/商业字体字形。 |

仅用当前母版作构图/色材语言源，不输入外部图片、游戏截图、字体文件、第三方笔刷或新的生成图。常见民俗名称和自然纹样只作为概念，不复刻某一作品的具体表达。新增对象由本批 Art 独立绘制；本地 `bggg-creator-image2psd/LICENSE` 标示 MIT License（BGGG 2026），脚本只作本地制作工具，不进入游戏包。出图前记录实际工具版本与来源、逐对象相似性初筛。若发现实际禁止用途的条款、拟用新增来源许可未核或可识别第三方近似，暂停受影响正式出图并报 Master；已登记用户声明和已核公开条款不因未取得独立权属凭证而自动阻断，也不重复向用户索权。

本批采用**确定的本地管线**：Art 已手写的五个 SVG 路径由本机 Node.js v24.19.0 调用 sharp 0.35.4（底层 libvips 8.18.6、librsvg 2.62.91）逐张渲染成 2172×724 RGBA 透明层；随后 `bggg-creator-image2psd/scripts/image2psd.py assemble` 从**旧 PSD 独立回读核出的四张原位栅格层**和这五张新透明层组装修订 PSD；底到顶保持 `L01, L02, L03, GU-01a, GU-01b, GU-03, GU-04, L04, GU-02`。输出目录仅本任务 `v0.2/source_build/`、`v0.2/psd/`、`v0.2/exports/` 和 `v0.2/review/`，不改旧母版、v0.1 试制或外部 skill 安装目录。新 PSD 的九层为独立**栅格层**，SVG 路径/笔触源在旁文件可改；不声称 PSD 中有原生矢量或文字对象。组装后如任何未批准区域产生可见像素差，停止并修正。

### 实际工具与依赖来源

| 用途 | 锁定工具和本机来源 | 许可与交付边界 |
|---|---|---|
| 原创 SVG 路径栅格化 | Node.js `v24.19.0`：`C:/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`；sharp `0.35.4`：同一 bundled runtime 的 `dependencies/node/node_modules/sharp/`。sharp 当前版本 API 报 libvips `8.18.6`、librsvg `2.62.91`。 | 本地 `sharp/package.json` 为 `Apache-2.0`，同目录有 `LICENSE`；这只是制作工具，不将工具或其二进制依赖带入游戏包。当前只读版本不是 v0.1 当时完整工具日志；v0.2 重出前须写运行时精确版本日志。全部间接依赖许可并未独立逐项核清，不把其称为已全面审定。 |
| PSD 组装 | 本地 `C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py`，SHA-256 `AF7217E0F3DAD1EDAF7EB4017C717CC49C6CE45D35BE88A00C0D2F284B390EBD`；同 skill 的 `LICENSE` 为 MIT（BGGG 2026）。 | 仅使用原版 `assemble` 写本任务 PSD；不重新生成整景，也不分发脚本到游戏运行包。 |
| PSD 独立回读、四导出与静态投影核验 | Bundled Python `3.12.14`、Pillow `12.3.0`、NumPy `2.3.5`；本任务保存的 `build_psd_and_exports.py`、`render_viewports.py` 为执行与验证脚本。 | 只做本地制作/验证，不进入客户端资源；版本与文件输出 SHA 在 v0.2 实际重出日志记录。 |

### 锁定的五份原创笔触输入

来源均为 v0.1 历史试制中由 Art 手写的 SVG 路径；仅引用**路径源**作重新渲染输入，不复制其 PNG/PSD。五份 SVG 不含外部图片链接、字体调用或生成式图像输入；字形“忘川”由路径笔触组成。v0.2 双签后将这五份 SVG 连同绘制脚本按哈希复制至 v0.2 工作目录并重新渲染；任何笔触改动使 SHA 变化时先修订本预案并重新双签。

| 对象 | 锁定源路径 | SHA-256 |
|---|---|---|
| GU-01a | `v0.1/source_build/editable_strokes/gu01_left_flower.svg` | `D194503774E5179661E6DADB562122A652E999DD7A8565420F582017876895CE` |
| GU-01b | `v0.1/source_build/editable_strokes/gu01_right_flower.svg` | `B975B575BD964B78AF6E2826BBAFE7BEB90FF3C4A160A13FB066144BDBD24268` |
| GU-02 | `v0.1/source_build/editable_strokes/gu02_bridge_carving.svg` | `16DFE6275D9FA51311CC39681CB11BBEC383E429A4E02122B0FEBD3319F35955` |
| GU-03 | `v0.1/source_build/editable_strokes/gu03_waystone.svg` | `A658894FC1800A27F6CF304A4E8169CE231FC3233B65DABFB9623E06A106D76A` |
| GU-04 | `v0.1/source_build/editable_strokes/gu04_plaque_lettering.svg` | `68BC1C7C8757DEB6890E5B621D54B1B91D2D27E2E30C8DBB3C5A8607CA39F81A` |

绘制脚本 `v0.1/source_build/make_local_art.js` 的 SHA-256 为 `E9D5F48B9CD6D3C59257DD3C778F7B29B91B82A56DA0DCBAE4C87435A20D0A81`；v0.2 复制核同后运行，不从 v0.1 渲染 PNG 复制。首个新图生成前记录 Node/sharp/libvips/librsvg 的当次输出，核五份 SVG SHA；不匹配就停，不“补签”已经生成的图。

## 3. 四层切图、alpha 与预算

正式输出仍只有 `STREET_BASE_01_L01` 至 `L04` 四张 2172×724 RGBA PNG；左上原点 `(0,0)`，均为完整画布、无 trim、无裁边、无额外第 5 个视差层。L01/L02 与已批 PNG **像素完全一致**；L03/L04 仅各自准许对象范围内有差异。L03 的四个对象先与旧 L03 合成；L04 的桥刻与旧 L04 合成；四张按原顺序同尺度重组，并逐像素比较新 PSD 存储预览、记录差异位置和最大色道值。v0.1 试制已观测到九层先合成与四语义层先合成的 8 位 alpha 整数舍入可能导致局部最多 1/255 色道差；v0.2 若重现则如实记录具体值与仅在批准对象盒内的分布，不称两图逐像素完全相同，若超过 1/255 或越出批准盒则停下修正。禁止把对象挪到镜头/UI 独立层或改变四层随镜头关系。

新图前核旧四张 alpha bbox、左右/上下边和全画布透明情况；新图后逐层记录 alpha bbox、边缘 alpha、差异 bbox、四边像素/透明性及文件 SHA-256。新增笔触距左右画布边至少 80px，最前 L04 四边与旧版逐像素一致；当前 Client 以最前景全图幅 2172×724 约束移动，左右各留 2 UI 单位余量，缩放 1–1.8。因本批不改最前景外缘，预计无需变更该几何；仍须在新图与各竖屏视窗证据中复核接缝和露底。任何边缘变化或额外纹理页需与 Tech 讨论并重签。

估算预算：每张 2172×724 RGBA8 展开约 5.999 MiB；四张约 23.995 MiB（不含 mipmap、压缩格式、GPU/CPU 副本、图集 padding）。沿用原四张尺寸/数量和资产 ID，预计不会新增纹理页或 Draw Call；**这只是尺寸草算**，本批没有 Creator 导入、目标机显存或运行 Draw Call 测量。Tech 要对尺寸、alpha/trim、纹理页和低端设备预算方法预签；超限需列实际成本/视觉损失，不得把花、石纹或原图静默裁掉。切图边界、层遮挡、复用及后续 Client 路径在切图协作记录中由 Art/Tech/Client 核对，Gate2 前不更新工程资源。

## 4. 首图、视窗与交付验证

双签后才制作此批的五个局部层及一个完整的可编辑修订 PSD，并从同一 PSD 导出四图、同尺度重组与审阅图；本批没有进一步量产范围。与旧图按同画布叠放核 GU-01/02/03/04、旧画面锚点、非恐怖程度、桥灯/纸船与通路保持。产出 `PSD_EDITABILITY_REPORT.md`、`SOURCE_AND_EDIT_RECORD.md`、`CUT_MANIFEST.json`、`VISUAL_ANCHOR_CHECK.md`，逐件列路径、哈希、差异范围、可编辑性和未测项。

静态手机投影视窗检查 9:16、9:18、9:19.5、9:20、9:21，各取倍率 1 的中心/左右允许极限及倍率 1.8 的中心/左右允许极限，按当前已批 Client v0.2 的最前景约束与控件位置计算/叠放。重点看：中心花/桥刻、左端景石、右端匾字在约 390px 宽实际阅读尺寸下是否友好可读，返回与场景悬浮减/重置/加控件是否遮挡；所有比例与极限有无露底。旧 `deliverables/client/UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001/v0.2/evidence/` 截图只作定位参考；新静态审阅图须明确标“艺术投影，非 Creator 运行截图”。实际运行、目标机、内存与 Draw Call 记 `NOT_TESTED`。

Art 自行切图后，执行 Agent 核 PSD、四张 PNG、manifest、同尺度重组和视窗图，再由 Master 向用户提交**具体 v0.2 实图版本**作 Gate2 审核；本组织自行切图路径不额外设置切图效果的专业复审或预览环境门禁。用户批准前不交 Client 正式接入。若预签后改变来源、工具、PSD 方法、尺寸、图层语义、对象范围或导出方案，先修订预案并由 Art/Tech 对新 SHA 重新签认。
