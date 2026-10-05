# 单元示例1｜四层场景 Creator 接入技术规格 v0.2

任务：`UNIT-MENU-SCENE1-TECH-RUNTIME-001`。本版是 Tech Lead 对 v0.1 用户反馈的修订稿，保留原版历史；输入是已批准的产品增量 `UNIT-MENU-SCENE1-SCOPE-001 v0.1`、四层切图 Gate2 `UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` 和既有 `UNIT-MENU-TECH-DESIGN-001 v0.2`。目标仅是 Web 阶段示例1的四层固定场景与镜头，并补齐美术交付到 Creator 正式资源的目录、描述和命名契约。双目录明细见同版 `RESOURCE_PATH_AND_NAMING_SPEC.md` 与项目登记表 `project/ASSET_HANDOFF_REGISTRY.md`。尚未导入 Creator、生成运行截图或做性能采样，以下实施与运行项均为 `NOT_TESTED`。

## 1. 模块边界与依赖

- 在当前 Cocos Creator 3.8.8 物理工程中新增示例1正式场景源与一个背景 Prefab；独立入口和未来第7项引用同一 Prefab UUID、SpriteFrame UUID 与资源版本，不复制一套同貌底板。Lab 菜单、调试按钮只属于 `labs/menu/`；正式背景 Prefab 不携带 Lab 路由或测试状态。正式文件名和计划路径采用同版资源规范，Creator 未创建前不得填实际 UUID。
- 背景 Prefab 负责四层显示顺序和统一源坐标；场景镜头控制负责水平位置、统一倍率、边界与复位；输入协调负责 UI 捕获、鼠标/触控手势与取消。各模块通过明确的视口参数和镜头状态交互，不向网络、服务端或游戏经济模型增加接口。
- 本任务不制作第2–7项独立对象。画中现有的树、灯廊、桥灯、纸船/烛光是四层固定图像；未来第4项的可切换对象必须另有独立资源 ID。示例1不得出现店铺、角色、板凳或独立可切换对象实例。未来第7项与桥/栏杆前后穿行的遮挡需另审，不能将当前四张整层图自动视作已解决。

## 2. 唯一正式图片版本与导入

以下为**从后到前**的显示顺序。每张使用 Gate2 所批的 `psd_full_canvas_layers/` 文件；不得用 `layer_sources/` 的 2171 像素天空源直接替换正式全画布导出，也不得从旧 Demo 或原始整图另切。

| 层序 | 内容 | 正式 PNG 相对 `deliverables/art/moonlit_psd_20261005_v2_raw/` | SHA-256 | 水平位移系数 |
|---|---|---|---|---:|
| 1 | 天空、月云星 | `psd_full_canvas_layers/01_01_94477409.png` | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` | 0.3 |
| 2 | 山峦、远建筑 | `psd_full_canvas_layers/02_02_933386cf.png` | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` | 0.8 |
| 3 | 地面、树木、右廊 | `psd_full_canvas_layers/03_03_23db4183.png` | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` | 1.0 |
| 4 | 桥、栏杆、河水与前景 | `psd_full_canvas_layers/04_04_c82fb659.png` | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` | 1.0 |

PSD 母版 `moonlit_four_layers.psd` SHA-256 为 `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`，获批整体合成为 `overall_from_psd.png`。四张正式 PNG 均为 2172×724 RGBA，源坐标 `(0,0)` 对齐，层级仅按上表，不按文件导入时间或节点名称推断。保持图片像素、混合关系和光晕，禁止 Client 通过裁切、调色、过滤或 tint 静默修图。

本表列的是**已存在的美术交付原件**；`project/ASSET_HANDOFF_REGISTRY.md` 逐件映射计划中的 `apps/client/assets/units/background/textures/` 工程路径，并把 PSD 母版和审核合成图明确列为“不接入”。工程路径、文件名、`.meta` 与 UUID 在 Client 实际导入并提交证据前均是计划值；不得据本规格宣称正式资源已经存在。旧 Tech v0.2 曾提出 `apps/client/assets/units/background/StreetBase.prefab` 作为候选，新版为统一命名提出 `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab`，尚无现存 UUID 可迁移；此路径须随本版审核后交 Client 落地。

Creator 导入时逐项登记：源文件目录/文件名与 SHA-256、实际工程目录/文件名与 SHA-256、PNG `.meta` 的 image 主 UUID、Texture2D 子资源 UUID、SpriteFrame 子资源 UUID、Prefab `.meta` 主 UUID、对应子资源键名、导入后的宽高、trim/offset/pivot、采样过滤、alpha/混合、mipmap、压缩设置与实际 Web 回退格式。image 主 UUID 与 Texture2D/SpriteFrame 子资源 UUID 不得混用。四层采用**相同 2172×724 逻辑画布、居中锚点 `(0.5,0.5)`、相同几何尺寸与缩放**；建议禁用自动裁透明或验证 SpriteFrame 的 trim/offset 在显示节点上精确恢复原位。不能让山/桥各自按 alpha 外接框居中。若 Creator 默认导入引起坐标或 alpha 偏差，以记录的配置和同尺度重组对照排查，修改图片须另走 Art 变更门禁。天空最右一列透明，且三张半透明层有过滤边风险，必须在 Web 运行时查四角、左右端及拖缩过程中的 1 像素缝、杂色和黑边。

2172 像素宽超过部分 2048 纹理限制；这里仅标兼容风险，不能从 PNG 可导入推断所有目标格式可用。四张**全画布** PNG 以 RGBA8 展开为 `4×2172×724×4=25,160,448` 字节，约 23.99 MiB，仅为基础纹理面积估算；不等于 Web 运行时内存、峰值、DrawCall 或性能合格。压缩格式、图集、mipmap、CPU 解码副本与透明过绘由后续实际构建记录。若某 Web 测试环境不支持现图，先给出浏览器/渲染后端/最大纹理尺寸/失败截图，再比较分片或格式方案及视觉影响，不能直接缩图、重绘或替换获批版。

## 3. 竖屏视口、视差与镜头状态

当前项目配置设计分辨率 720×1280，`fitWidth` 与 `fitHeight` 均开启；这不是实际 Web 视口尺寸。每次进入、浏览器视口改变、模拟手机分辨率或 DPR 变化后，以 **Creator 实际可见且扣除适用安全区的逻辑视口** `Vw×Vh` 重算。四层源尺寸 `W=2172,H=724`。采用统一状态 `{cameraX,z}`；`z` 为相对适高倍率：

```text
sCover = max(Vw/W, Vh/H)
s = sCover × z
visibleSourceWidth = Vw/s
cameraXMin = -(W-visibleSourceWidth)/2
cameraXMax = +(W-visibleSourceWidth)/2
layerScreenX[i] = (Vw-W×s)/2 - cameraX×s×ratio[i]
layerScreenY[i] = (Vh-H×s)/2
ratio[后→前] = [0.3, 0.8, 1.0, 1.0]
```

上式的 `layerScreenX/Y` 是源图左上角相对于有效视口左上角的逻辑显示坐标，供实现或测试换算；Creator 节点可用中心锚点/正交相机的等价世界坐标实现，但**不得对四层分别缩放**或只移动公共相机而遗漏逐层系数。缩放锚点在有效场景视口中心；垂直中心固定。拖拽屏幕横向位移 `Δx` 对应 `cameraX ← clamp(cameraX-Δx/s,cameraXMin,cameraXMax)`，松手后保持合法位置；若实现有惯性，须仍满足边界和无抖动，且由 Client Brief 明示。缩放后重新计算 `s`、合法区间并夹取当前位置。`zMin=1` 是当前图片适高覆盖的几何下限候选；小于它可能露出上下未绘区域。浏览器预览的 `zMax=1.8` 仅是候选，不是正式批准倍率；Client 应在后续 `FEATURE_BRIEF` 中明确最终上下限与初始相机参数，附依据供 Tech/Product 评审并由用户审批。若有效视口出现 `visibleSourceWidth>W`，当前图无法水平覆盖，须返回配置/视觉变更，不允许负区间倒置。

首帧需要桥区域可辨认。建议初始 `cameraX=0,z=1` 作为测量起点，实际初值要由同尺度 Creator 截图对照获批图与 Product S02 审定；不要求月亮与桥首帧同见。重置、退出再进入均恢复最终获批的 `{cameraX0,z0}`，并清除正在进行的拖拽、双指缩放和惯性状态。未来第7项复用完全相同的初始化和边界规则。

S03 位移测量：固定视口与 `z`，记录相同一次手势前后的 `cameraX` 与每层显示原点；预期位移为 `-ΔcameraX×s×ratio[i]`。建议以至少 100 个逻辑显示像素的近景有效位移取样，逐层坐标与公式偏差不超过 1 个**逻辑显示像素**，并同时核 `近景3/近景4=1`、`山/近景=0.8`、`天/近景=0.3`；该容差是待本技术稿审批的测量建议，测试时还需记录实际 DPR 与截图物理像素换算。不能只看肉眼“差不多”或在触及边界后用被夹取的手势距离算比例。四层贴图视觉内容不同，优先用节点位置/矩阵和带时间戳录屏共同取证，截图只辅助核对接缝。

## 4. 输入优先级与生命周期

输入优先级为屏幕 UI/Lab 控件、对话等覆盖层先于场景。指针起始于 UI 命中区时，整个该指针序列由 UI 捕获，不传给场景；场景中起始的指针可水平拖动。鼠标主键拖拽、滚轮缩放以及模拟触控的单指拖拽/双指缩放应映射到同一 `cameraX,z` 状态；鼠标和触控测试分别取证。双指其中一指落在 UI、手势中途重置、指针取消/移出、缩放与拖动切换时，清除旧手势基准，避免相机跳变。是否在 Web 中模拟多点触控、所用 DevTools 模式与输入事件来源，后续 QA 测试矩阵记录。Lab 缩放/重置按钮可调用同一镜头命令，但不得把控件点击误作背景拖动。

进入场景创建/引用四层获批资源，记录初始镜头；退出时取消手势订阅、缩放/拖动中的临时状态与回调。重置恢复同一相机初值并保留四层固定图；未来第7项的可切换对象复位不得清除或修改四层底板。资源版本追踪至少保存 `美术源路径+SHA-256 → Creator 正式路径+SHA-256 → Texture2D/SpriteFrame UUID → Prefab UUID → Scene 实例`，并比较独立与组合场景，场景级允许覆盖仅限正式批准的实例位置等字段。导入后的路径、哈希、`.meta` UUID 和使用位置由 Client 回填登记表，Art 核美术源映射，Tech 核引用链；未回填即 `NOT_TESTED`。

## 5. 接入与验证门禁

1. 本技术稿与同版资源规范、项目交接登记表经 Tech、Art、Client 专业 Review、Master Review 与用户批准后，可作为**示例1限定范围的正式技术增量**，覆盖旧 Tech v0.2 中与 `DEC-UNIT-MENU-WEB-TEST-005` 冲突的实体机开工/验收条款；旧版其他七菜单技术要求保持历史效力，不另增一个仅重复本次修订的审批门禁。Client `FEATURE_BRIEF` 与 QA `TEST_PLAN` 须引用获批 Product、Gate2、Tech 版本并分别完成 Review/用户审批；之后 Client 才正式编码/导入。用户批准 Gate2 本身只放行这批图片，不代表接入方案、倍率或运行质量获批。
2. Client 实现后提交源文件、实际工程目录/文件名、导入后 PNG hash、PNG `.meta` 中 image 主 UUID 与 Texture2D/SpriteFrame 子资源 UUID、Prefab `.meta` 主 UUID、场景引用、构建 commit、Creator 版本、Web 浏览器/模拟配置、首帧/左右端/最小最大倍率/重置/输入隔离的截图与录屏、坐标测量及导入设置记录，并回填登记表的“实际工程状态”。同一正式资源替换时保留稳定资产 ID、说明旧新 hash 与 UUID 是否保持；如 UUID 改变，列受影响 Prefab/Scene 引用和迁移验证。Tech Review 可核实现与版本；未提供的场景不得写 `PASS`。
3. QA 在**后续用户批准的** Web 多模拟手机分辨率矩阵和性能预算下运行。矩阵至少包含 720×1280 设计比例与另一不同竖屏比例，具体模拟视口、浏览器、DPR、模拟方式、样本路径与数值阈值待正式稿锁定。性能预算之前可记录原始 FPS、帧时间、DrawCall、内存/纹理估算与实际可取数据，不给数值达标结论。
4. 本阶段不要求实体手机型号、小游戏容器或微信/抖音真机数据。上述尚未测试范围保持 `NOT_TESTED`，Web 模拟分辨率结果不能外推其通过。未来若追加平台验收，另行设范围、预算与 Artifact Gate。

目前结论：四层文件版本与数学方案可作为 **Creator Web 接入方案候选**；实际 Creator 导入、画面、浏览器多分辨率覆盖、性能与 QA 全部 `NOT_TESTED`。本版请审核方案、计算及门禁边界；具体 `zMax`、初始相机位置/倍率由后续 Client `FEATURE_BRIEF` 明示并经用户审批，Web 测试矩阵与性能阈值则按分阶段路径在运行验收前另审。
