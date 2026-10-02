# 百鬼夜市七项菜单单元技术设计 v0.2

任务：`UNIT-MENU-TECH-DESIGN-001`；日期：2026-10-03。输入为 `UNIT-MENU-PRODUCT-001 v0.2` 的 `USER_APPROVED` 规格及 `DEC-UNIT-FINAL-ASSET-004`。旧 Tech v0.1 因幽灵骨骼契约与新决定冲突而 `REJECTED`；本文重新定义顾客为 SpriteFrame 序列帧。本文是待专业及用户审批的设计，尚未批准 Client 开工或证明运行通过。

## 1. 工程与同源边界

推荐在现有 Cocos Creator 3.8.8 **一个物理工程**中，把每类对象做独立可编辑 Prefab/源目录，每个 Lab 样例有可直接打开的 Scene。独立、组合、未来主体均引用同一正式 Prefab UUID 与其 SpriteFrame/骨骼/UI/VFX 资源 UUID 和版本哈希，不维护一份“演示专用正式图”。这一方案允许背景、店、角色、树花灯和 UI 并行打磨；多工程复制会让 `.meta`/资源依赖和状态逻辑人工同步，当前没有必要引入。未来若真实出现独立发布或编辑冲突，再由 Master 组织变更。Lab 的菜单、调试状态按钮、测试位置控制和诊断文本只在 `labs/menu/`，不进入正式对象 Prefab。

下列是**待批准的逻辑 ID 与目标路径**；实际 UUID 只能在 Creator 创建后登记，不在本文伪造：

| 稳定 ID | 唯一 Prefab 或 Scene | 独立入口 / 组合用途 |
|---|---|---|
| `STREET_BASE_01` | `apps/client/assets/units/background/StreetBase.prefab` | `labs/menu/01_Empty.scene` 与 `07_Combo.scene` 共用唯一背景；主体未来同版本复用 |
| `MT_SHOP_01` | `units/milk-tea-shop/MengtaoShop.prefab` | 2/7；静态店体与单页骨骼可动件分层 |
| `MT_CHAR_01` | `units/mengtao/Mengtao.prefab` | 3A/7；孟桃实际单视角骨骼 |
| `UG_GHOST_01` | `units/ghost-customer/GhostCustomer.prefab` | 3B/7；**Sprite + Animation/帧序列状态控制**，无幽灵骨骼数据 |
| `BENCH_01` | `units/bench/Bench.prefab` | 3B/7；独立座点与前/后遮挡片，不画入幽灵帧 |
| `UE_TREE_01`、`UE_GRASS_01`、`UE_LANTERN_01` | `units/tree/Tree.prefab`、`units/flower-grass/FlowerGrass.prefab`、`units/lantern/Lantern.prefab` | 4/7；各自可开关，动态部分各骨骼对象单页 |
| `UNIT_IDENTITY_UI_01`、`MT_DIALOGUE_UI_01` | `units/ui/IdentityCard.prefab`、`units/ui/MengtaoDialogue.prefab` | 5/6/7 可选；正式共用 UI，Lab 壳与正式组件分开 |

七项公共导航 `labs/menu/00_Menu.scene`，第 3 项为 3A、3B 子入口，不增加第八个顶层菜单。各 Scene 可独立打开、各 Prefab 可独立编辑；背景源只在入口 1/7 使用同一 UUID。实例只允许位置、朝向和 Lab 测试开关等场景级覆盖；动画剪辑、正式贴图、材质、状态逻辑、关键 UI/VFX 引用不得独立覆盖造成分叉。Client 在实际实施时生成 `source UUID / instance UUID / allowed overrides / dependency UUID / asset hash` 清单，独立与组合逐项比对。Creator [Prefab 文档](https://docs.cocos.com/creator/3.8/manual/en/asset/prefab.html)指出实例属性可覆盖资产，故仅看相同 Prefab 名称不足以证明同源。

## 2. 菜单装载与对象生命周期

| 入口 | 初态与触发 | 清理/复验 |
|---|---|---|
| 1 空背景 | 仅 `STREET_BASE_01`、共享镜头及必要 Lab 控件；水平拖拽、缩放、复位 | 不含店、人、凳、树花灯实例；到边缘不露白 |
| 2 店 | `MT_SHOP_01` 常态；一次可动件和暖灯材质/投影前后对照 | 再触发不叠播；撤回常态及临时光效 |
| 3A 孟桃 | `MT_CHAR_01` idle→一轮工作演示→idle | 取消旧动作/挂点反馈，无顾客也能演示 |
| 3B 幽灵 | `UG_GHOST_01` 与可独立移除的 `BENCH_01`；五态两向 | 幽灵仅帧序列；进座/稳坐/离座、快速切态、镜像、清理均可复验 |
| 4 场景元素 | 树、花草、灯笼各一独立源，分别开关/预览 | 隐藏时骨骼/VFX/暖光停止且不留孤立光斑 |
| 5/6 UI/对话 | 同一正式身份组件及孟桃示例对话组件，Lab 按钮另放 | 关闭释放焦点；不产生经营 UI 或正史剧情状态 |
| 7 组合 | 从入口 1 同一背景 UUID/镜头初态开始，其余对象零实例 | 任意顺序添加/移除 2、3、4 之源；重置回空背景；遮挡/同源对照 |

统一生命周期 `enter → active → reset/leave`：进入时只创建本项所需实例并注册事件；重置先取消帧动画、骨骼动画、位移、tween、定时器与 VFX，释放座点、清临时节点，再恢复初始位置、朝向、对象开关、UI 焦点与镜头；离开时解除事件订阅与资源引用。动作完成回调携带当前会话或状态令牌，离开或下一状态生效后旧回调不得写回节点。组合移除店不自动删除孟桃；移除板凳时先令坐姿安全退出/切到无座位状态，再删板凳，避免悬空。相同正式对象的状态控制由 Prefab/正式组件提供，Lab 只调用，不复制状态机。

旧 `UnitSamples.scene`、`UnitSampleGallery.ts`、`assets/demo` 保留历史；新七入口路由不引用旧九项 U01–U09、旧 21 PNG/9 Prefab 或 45°四方向机制。旧场景的删除、重写不属于本任务。具体审计见 [CREATOR_AUDIT.md](CREATOR_AUDIT.md)。

## 3. 幽灵序列帧、两向和板凳契约

`UG_GHOST_01` 的唯一正式角色美术源是**一个原创方向**、透明逐帧母版及导出的 SpriteFrame 集；不建立 `.spine` 幽灵源，不把旧概念展示板裁成生产帧。逻辑 `facing ∈ {left,right}`，原向由 Art 确定；另一向只令 `VisualRoot.scaleX` 相反。世界节点的位置、移动速度正负、碰撞/点击区、座位占用、地影、局部受光及名字/UI 仍按未镜像的世界坐标计算。文字、身份标志、不能反读的杯子/配件如需呈现，放在非镜像节点或先由 Art 设计为双向可读；不得悄悄新增第二套朝向帧。需要专属反向绘件时提出变更供用户审批。

| 状态 | 帧组织与退出规则 | 本版验证重点 |
|---|---|---|
| `move` | 同方向 SpriteFrame 序列，**约 4–6 帧为草排起点**，循环；世界位移由独立逻辑驱动 | 首尾缝、体量与脚点稳定、可见位移；左右翻转不改变速度的世界方向 |
| `run` | 与 move 分开的约 4–6 帧循环序列；速度/节奏有可读差别 | 不靠简单加速同一 move 片段冒充；首尾缝、透明边、位移与脚点 |
| `happy`、`sad` | 可一次动作接保持帧；切换时旧保持与旧回调同时取消 | 表情/动作辨识，快速往返不残留上一情绪 |
| `sit` | `approach → sit_enter → sit_hold → sit_exit`；保持段按需要静帧或轻循环，不强制 4–6 帧 | 左右各自对齐世界座点，身体与凳面接触、腿部前后关系、离座释放占用 |

4–6 帧是**每个需连续循环动作**的预算起点，不是全部五态的总帧数，更不是已锁定帧率。Art/Tech 在正式逐帧草排时给出源帧顺序、宽高、统一画布/原点、脚点、座姿接触点、透明边、帧驻留时间及循环/一次动作标记；Client 选择 Creator AnimationClip 的 SpriteFrame 属性轨道或等价可审计帧播放器，按同一状态定义切换，不同时并行写 SpriteFrame。每次切态停止前一 Clip/定时器/tween 和完成回调，令牌失效，再切新状态；新方向只变 `VisualRoot` 镜像，不重建第二份材质/图集。播完一次性情绪应明确进入保持帧或批准的下一状态，不能隐式倒回不相干循环。Cocos 3.8 官方 [Animation Clip](https://docs.cocos.com/creator/3.8/manual/en/animation/animation-clip.html)与 [Sprite Frame](https://docs.cocos.com/creator/3.8/manual/en/asset/sprite-frame.html)是实现核对依据；具体导入、采样率和取消事件要在真工程验证。

为避免自动裁透明导致脚底和表情跳动，逐帧保持统一逻辑画布、固定脚点/座点与一致屏幕投影；即便图集允许裁切，也要实测 SpriteFrame 导入的 trim、offset、pivot 与坐姿对齐，不按文件画布大小臆测。逐向复核字形、非对称衣件、手势、世界光影和阴影。若 4–6 帧不能达到自然循环和状态辨识，Art/Tech 提交含新增帧数、画质、图集面积/内存/批次及授权的调整，经 Master/用户批准后变更；不静默堆帧或回退骨骼。

`BENCH_01` 有独立座点、接近点及可拆的前/后遮挡片。落座先停水平位移，确认板凳存在并可用，再移动到接近点、播放进座、锁定座点并显示稳坐；离座播退出段、释放座点、回到可移动状态。镜像只改变幽灵 VisualRoot，世界座点绝不跟着镜像。坐姿中转向、快速切态、板凳消失、离开菜单走同一取消/安全退出路径；另一个方向仍要实看凳面接触，不能以右向通过代表左向通过。

## 4. 分层、镜头和输入

平视横街采用固定背景远景/天空/河水/地面与桥、栏杆的前后片；对象按显式层与脚点排序：远景水体 → 店后层/凳后片 → 顾客、孟桃与可交互物 → 店前柜/凳前片/栏杆前片 → 世界光影与局部 VFX → 屏幕 UI。桥拱/栏杆不能用一张前景图无差别盖住角色；跨 Sprite 与骨骼的遮挡要拆节点或经实测的遮罩处理。透明光晕不能以改变顾客 Sprite 的镜像方向实现，世界受光方向保持一致。

入口 1 与 7 共用背景 Prefab、可绘世界边界和镜头默认参数。现工程 `720×1280` 为竖屏画布，参考图长幅比例只做构图依据；本稿不擅自改项目横竖屏。水平拖拽与鼠标滚轮/触控双指缩放由 Client 转换成同一世界视口参数；每次缩放、设备宽高比或安全区变化后，以实际正交相机可见半宽/半高重算合法相机中心。水平中心须限制在已绘区间 `[left+visibleHalfWidth,right-visibleHalfWidth]`；若区间为空，先由 Art 扩正式分层覆盖或缩小允许视野，再由 Product/Tech 复核，不露白、不拉伸概念图。垂直中心锁定或受已绘范围约束；UI/对话获得指针时不向场景拖拽/缩放传播。初值、上下限、镜头边界和实际小屏字/按钮命中面积均待 Creator 与目标机取证，不虚构数值。

## 5. 资产与性能门禁、依赖方向

美术源与权利记录 → Art/Tech **每次正式出图前**共签 → 正式逐帧/骨骼/静态分层导出 → Creator 导入与资源 UUID 登记 → Client 单元/组合接入 → QA Creator 与 Web/微信/抖音目标设备证据 → 未来主体同 UUID/版本接入复验。具体逐对象签字段见 [ASSET_PIPELINE.md](ASSET_PIPELINE.md)，测量见 [PERFORMANCE_PLAN.md](PERFORMANCE_PLAN.md)。幽灵序列帧图集可按实排为所需页数，不继承骨骼一页硬约束；孟桃、店铺动态件、动态树花灯仍每个**骨骼对象附件一页**。同图集只能减少切纹理机会，不能推出一 DrawCall；混合、材质、遮挡片、UI/VFX 插层和渲染顺序仍可能断批。

本任务不增加服务器接口、经济配置、商店规则、其他角色或第三方大依赖。Art/VFX/UI 受影响规格分别审批；Tech 本版获批后才可作为 Client 正式技术输入。Client 编码前 Feature Brief 与 QA Test Plan 按现有工作流获批，随后制作正式资源/功能并报告实际验证。现有概念 PNG、UI 审阅 SVG 和旧 Demo 不能计正式产出；主体游戏当前未接入，第三入口实测保持 `NOT_TESTED`。风险包括：竖屏与长幅视野冲突、幽灵帧量/透明面积超预算、两向座姿或受光不成立、Spine 作者版本与合法许可不明确、目标机纹理压缩/性能差异。上述风险在实际数据前不宣称已排除。
