# 七项菜单｜Scene、Prefab 与运行边界 v0.1

本文件是编码前目标结构。路径为获批 Tech v0.2 的候选结构；实际 `.meta` UUID 要由 Creator 生成并登记，不能填造。所有正式对象放在**同一个 Creator 工程**，独立 Scene 与组合 Scene 引用同一个 Prefab。Scene 只允许覆盖世界位置、朝向和 Lab 测试开关；不可覆盖正式贴图、骨骼/剪辑、材质、字体、状态控制或 VFX 引用。

## 1. 七项路由

| 顶层 | 候选 Scene / 子入口 | 初始实例与 Lab 动作 | 返回、重置的核对 |
|---|---|---|---|
| 0 公共导航 | `assets/labs/menu/00_Menu.scene` | 七个顶层卡；第 3 卡进入 3A/3B 子选择，不产生第八顶层 | 仅 Lab 导航组件 |
| 1 空场景与镜头 | `01_Empty.scene` | `STREET_BASE_01`、共享相机、Lab 顶栏/手势控件；水平拖拽、缩放、镜头复位 | 不实例化店/人/凳/树花灯，复位回同一初视野 |
| 2 店铺效果 | `02_Shop.scene` | 一店 `MT_SHOP_01`；常态、一次可动件与暖灯影预览 | 同店重复触发不叠，停光、影及骨骼后回基态 |
| 3 角色效果 | `03_Roles.scene` 或独立 `03A_Mengtao.scene`、`03B_Ghost.scene` | 3A `MT_CHAR_01`；3B `UG_GHOST_01` 与独立 `BENCH_01`。子入口之间不共享临时状态 | 3A 回 idle；3B 取消旧帧/位移/座点；不得复制顾客 |
| 4 其他元素 | `04_Elements.scene` | `UE_TREE_01`、`UE_GRASS_01`、`UE_LANTERN_01` 分别开关与预览 | 隐藏某对象仅停其所属骨骼/光/VFX |
| 5 UI 界面 | `05_UI.scene` | 共用 `UNIT_IDENTITY_UI_01` 与状态预览；Lab 控件独立 | 恢复 normal，正式组件不依赖 Lab 按钮 |
| 6 孟桃对话 | `06_Dialogue.scene` | 共用 `MT_DIALOGUE_UI_01`、两句标注演示的文字 | 清对话进度、焦点与浮层；无分支或奖励 |
| 7 组合场景 | `07_Combo.scene` | 首帧只加载第 1 项同一 `STREET_BASE_01` 与镜头；其他对象从零逐项添加/移除；可选共用身份 UI/对话浮层 | 任意增删后重置为空底板；无旧效果/对象残留 |

入口 2–6 可使用同一底板供展示，但不能导入另一版“相似街景”；若实际 UI 展示需中性底色，由获批 UI/Art 定义，不作为可接入的街景源。所有新路由独立于旧 `UnitSamples.scene`，不重命名旧九项充七项。

## 2. 正式对象与依赖方向

| 稳定 ID | 目标 Prefab | 必需表现与锚点 | 独立／组合 |
|---|---|---|---|
| `STREET_BASE_01` | `assets/units/background/StreetBase.prefab` | 天空远景、地面/河、桥后/前、栏杆后/前片；可绘边界、相机初值；无可切换对象烘入 | 1/7 同 UUID |
| `MT_SHOP_01` | `assets/units/milk-tea-shop/MengtaoShop.prefab` | 静态木砖瓦店身、前柜、木牌匾及杯吸管标、设备/纸盒；子节点 `MT_SHOP_MOTION_01` 骨骼；灯罩/墙柜受光/地影成组；店脚点 | 2/7 同 UUID |
| `MT_CHAR_01` | `assets/units/mengtao/Mengtao.prefab` | 单视角骨骼 idle/work、脚点、手/杯挂点、仅腰牌“孟” | 3A/7 同 UUID |
| `UG_GHOST_01` | `assets/units/ghost-customer/GhostCustomer.prefab` | 世界根含脚点、地影、座位状态；子 `FrameVisual` 独占 SpriteFrame 与 `scaleX`；UI/碰撞/世界光不挂子镜像根 | 3B/7 同 UUID |
| `BENCH_01` | `assets/units/bench/Bench.prefab` | 凳底原点、`seatLeft/seatRight`、接近点、后片/前沿片；与顾客帧分离 | 3B/7 同 UUID |
| `UE_TREE_01` | `assets/units/tree/Tree.prefab` | 固定树根、动态枝叶骨骼和本实例效果 | 4/7 同 UUID |
| `UE_GRASS_01` | `assets/units/flower-grass/FlowerGrass.prefab` | 固定根/土点、动态叶花骨骼和本实例效果 | 4/7 同 UUID |
| `UE_LANTERN_01` | `assets/units/lantern/Lantern.prefab` | 固定挂点、动态灯体骨骼、独立世界暖光 | 4/7 同 UUID |
| `UNIT_IDENTITY_UI_01` | `assets/units/ui/IdentityCard.prefab` | 奶茶店/孟桃共用身份、合法字体与状态，缺席对象不误报均在场 | 5/7 可选及未来主体同 UUID |
| `MT_DIALOGUE_UI_01` | `assets/units/ui/MengtaoDialogue.prefab` | 可复用壳、孟桃/玩家槽与示例标记；运行文字来自已批 Product 两句 | 6/7 可选及未来主体壳同 UUID |

店铺动态件和树花灯各**骨骼对象一页图像附件**；幽灵不是骨骼。`SHOP_LIGHT_PAIR`、`TREE_SWAY`、`FLOWER_NOD`、`LANTERN_SWAY_GLOW` 归对应对象实例。`SHOP_STEAM` 和 `MT_WORK_ACCENT` 仅为已批 VFX 规格中的候选，缺另行获批源时不得启用或把它们算作必须完成的正式资源。

## 3. 层级、相机和输入

世界节点从远到近组织 `Sky/Distance`、`Water/Ground`、`Bridge/Rail Back`、可装配对象后片、按底点排序的 `Actors/Props`、`ShopCounter/BenchFront/BridgeRailFront`、世界光影与局部效果；屏幕 UI 在最上层。前/后片的具体 Sprite/骨骼渲染顺序以 Creator 目标位置截图校准，不能用全桥/全栏一张前景图盖住所有角色。测试点至少覆盖桥两坡/桥口、店柜、凳左右、树灯前后、栏杆断口。

同一个相机控制组件由 1/7 共用。每次拖拽、滚轮/双指缩放、视口比例或安全区改变后用正交视口半宽/半高重算范围；可绘边界不足即限制动作并记录原因，绝不露空白。对话消费所有世界指针；顶栏/托盘消费命中的指针；只有场景空白区操作相机。设计分辨率目前 720×1280，保持原工程设置直到另有获批适配决策。第 7 项开关与第 1 项镜头控制不应各维护一套参数。

## 4. 幽灵状态与座位

状态集合为 `move/run/happy/sad/sit`，另有 `approach/sit_enter/sit_hold/sit_exit` 内部坐姿阶段。一个原创向右方向作为 Art v0.2 的建议，**正式原向以当批 Art/Tech 联签为准**。`move` 与 `run` 使用不同帧序及世界位移节奏，各约 4–6 帧循环预算起点；情绪一次播放后保持其帧，直到新命令/复位；坐姿须先有 `BENCH_01`。状态令牌和场景会话令牌共同防止迟到 Animation 事件或资源回调写回已销毁对象。

`FrameVisual` 只接受一套 SpriteFrame，镜像 `scaleX` 切朝向。世界根保留实际位移、脚点、地影、碰撞/点击区和座位占用；名字、状态标签、非镜像字形也置于 `FrameVisual` 外。坐姿转换时使用板凳世界座点而非镜像后的局部点；撤凳、转向或返回时先取消进座/保持，离座或安全切无座位状态，释放占用，再移除板凳。两向均以真实屏幕接触和前后遮挡图判断，程序镜像成功不代替视觉验收。

## 5. 对象生命周期与同源扫描

进入单元先确认资源门禁并分批加载；未获批或缺失资源只禁用对应操作并显示“资源未就绪”，不回退旧 Demo/空白贴图。每个活动对象持有本实例动画/特效/tween/计时器/订阅句柄；重置和离开先废弃会话、禁止新触发，再停所有句柄、清临时节点、释放座点、恢复材质/alpha 与光影基态，最后释放资源引用。组合移除奶茶店不隐式移除孟桃；移除板凳先处理顾客；移除灯不清店灯。缓存策略需以目标设备测量确定，不能只凭移除节点推断显存已释放。

Creator 首次创建后生成清单：`stable ID → source master version/hash → export hash → asset UUID → Prefab UUID → dependency UUID → allowed Scene instance overrides`。扫描 1/7、2/7、3A/7、3B/7、4/7、5/7、6/7 引用；只允许位置、朝向、Lab 开关等 Scene 覆盖，出现图像/动画/材质/字体/VFX 分叉即失败。未来主体接入后用同一清单追加第三入口，其当前实测状态必须 `NOT_TESTED`。
