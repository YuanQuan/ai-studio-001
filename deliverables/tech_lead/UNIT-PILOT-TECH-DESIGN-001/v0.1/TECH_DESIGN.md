# 孟桃奶茶店单元同源工程技术设计 v0.1

任务：`UNIT-PILOT-TECH-DESIGN-001`；版本日期：2026-10-02；状态：待专业评审与用户审批。上游：Product v0.1与Art概念/拆件 v0.5的`ARTIFACT_APPROVAL.json=USER_APPROVED`。本文件是下游实现契约候选，**没有宣称Prefab、骨骼、图集或测试已完成**。

## 1. 推荐的独立单元形态

保留已钉的`apps/client/` Creator 3.8.8工程。按地面、树木、建筑、精灵、特效分别建立可在Creator资产面板直接打开的独立`.scene`、`.prefab`、资源目录和脚本入口。`assets/labs/`只有演示控制、重置、诊断和测试用导航；`assets/units/`存正式唯一源，主体集成入口只装配其Prefab。每类可分派不同Owner打磨各自目录，并独立运行、验收。共同配置/组件的变更经对应专业Review后进入同一源，避免多人同时编辑同一Prefab造成冲突。具体结构见`CP_REVIEW.md`。

首个单元的建议Creator文件清单（**均为待Client创建，不是现有文件**）：

```text
apps/client/assets/
  units/mengtao/          MT_CHAR_01 的导出数据、单页图集、MengTao.prefab、.meta
  units/milk-tea-shop/    MT_SHOP_STATIC_01 与 MT_SHOP_MOTION_01、MilkTeaShop.prefab、.meta
  units/presentation/     唯一表现控制接口；身份UI与VFX各自批准后才放入其职责目录
  labs/mengtao-shop/      MengTaoShopLab.scene、Lab专用按钮/诊断/重置
  integration/            获批主体集成Scene，实例化同一正式Prefab
```

可编辑分层美术母版由Art在仓库根`art-source/units/mengtao/`及`art-source/units/milk-tea-shop/`维护，包含原画、补绘、Spine源工程和导出设置；Creator的可导入导出物仅放上表`apps/client/assets/units/`对应目录，保留`.meta`。概念稿仍在`deliverables/art/`，不当生产母版。上述路径为本设计与Art生产预检统一候选，实际建目录由各责任角色在批准门禁后实施。

旧`UnitSamples.scene`、`UnitSampleGallery.ts`和`assets/demo/`保留历史，不把21张旧图、9个Prefab或程序占位形体迁成孟桃源。迁移先落唯一源与独立Lab，再装主体测试入口，最后比较源UUID和实际表现；现有真实主体Scene尚未定型，集成入口为待创建的最小验证场景，不宣称主体游戏完成。

**镜头未决**：工程当前设计分辨率720×1280，所选第一街参考图为2172×724横向构图；前者是现工程配置，后者是视觉参考。不得据此静默把产品改横屏。Client和UI须在获批主体镜头/设备比例中分别验证店铺、人物工作点、奶茶牌、孟腰牌的可见区域与字形可读性。Lab可用展示完整对象的调试相机，但同一Prefab/动作与主体保持同源；横向参考和竖屏视口如何裁取，待主体场景镜头规格决定。详见`ASSET_PIPELINE.md`的视口矩阵。

## 2. 对象、资源与层级契约

| 对象 | Creator源/骨骼 | 变换与层级 | 可变范围 |
|---|---|---|---|
| `MT_CHAR_01` | 独立`MengTao.prefab`中一个`sp.Skeleton`，同一`.json/.skel`、`.atlas/.txt`和**一张PNG纹理页**含全部表情、握手、摇杯附件 | root脚底中心；在店身后层上、柜前层下；Lab单独打开时全身可见 | idle/work/reset；本单元单视角。动作手/壶在台面上方，不能靠复制一个前置手图绕过遮挡 |
| `MT_SHOP_STATIC_01` | 店身静态后层与柜前层从同一可编辑母版导出，合装`MilkTeaShop.prefab`；没有无意义Skeleton | 后层10、角色20、布帘30、柜前40为**相对顺序**；前后同一店基点，柜前只挡下身，工作脸/手可见 | 价牌空白、设备/纸盒/杯标为静态；共享瓦木材料可在其它店适配，专属形象不复制 |
| `MT_SHOP_MOTION_01` | 独立三帘片`sp.Skeleton`、**一张PNG纹理页**，挂在店梁锚点；可嵌套于店Prefab但源独立 | 帘轴固定，上缘不漂；不遮孟桃脸、牌匾、台面 | idle轻摆/work强调/reset；不额外动画灯笼或机器 |

真实脚点/帘轴/工作位初始候选取Art v0.5 `PARTS_PLAN.md`，其0–1坐标只是目视值。Art正式分层源和Client装配时测量实际像素、极限姿态与手机可读性，两个入口用同一挂点配置。每个动态对象的“一张图”指所有图像附件一个atlas纹理页；不把骨骼数据/atlas描述误作第二张图，也不强迫两个独立Skeleton共用一页。未来需四方向的旅客应另做方向覆盖、页面积和读图评审。

## 3. 可复用表现接口与状态

`PilotPresentation`为纯表现层候选：`playWork(requestId): {accepted:boolean}`、`reset():void`、`getState(): idle|working|resetting`，以及`started/completed/reset`通知。最终TypeScript签名由Client开工包落定，业务订单/收益不进入此接口。两处入口实例化同一正式表现控制组件与Prefab/资源UUID：Lab按钮调用`playWork`，主体仅由将来获批的业务入口调用。

状态迁移：`idle --playWork--> working --角色char_work工作段结束--> resetting --回到idle姿态与UI--> idle`。**只有孟桃角色`char_work`的正常结束信号驱动本次表现完成**；短帘`awning_work`与可选VFX只是同步表现，二者不参与完成判定，也不得延迟复位。没有VFX时仍按角色完成信号复位。正常结束时立即让短帘回到`awning_idle`，清理一次性VFX、撤销握手/摇杯替换并恢复角色`char_idle`。手动`reset`、Scene卸载或角色动作取消则执行清理与恢复，不伪造一次正常`completed`。`working/resetting`再次收到`playWork`先**拒绝并返回accepted=false**，避免堆叠一组动画；此为最小可重复表现策略候选，不是经营语义。角色Skeleton结束回调只接一次或按`requestId`去重，清空本次回调/订阅；停用/重载后应能从idle再次演示。动作时长和异常回退方式待真实骨骼导出与Client开工包验证，本版不设置固定秒数。

UI只消费已批准的`shopId/managerId`与身份展示数据；本轮只允许“奶茶店 / 孟桃”的准确关联。正式身份组件的版式、字体、状态和许可待UI+Art审批后固定一个源Prefab；Lab专用按钮/日志放Lab目录，不进入主体UI。VFX只消费`started/completed/reset`表现事件，规格由VFX角色审批，不能表示饮品、订单完成、金币、经验或神力。若UI/VFX未获批，可分别用标明Lab专用的诊断文字/无VFX验证状态机，但不能称正式视觉交付。

## 4. 同源不分叉的可检验条件

1. Lab与主体集成Scene的孟桃、店铺Prefab引用指向相同`.meta` UUID；Prefab中的SkeletonData、纹理、脚本、身份UI及VFX版本引用同样核对。用资源依赖扫描留JSON清单/哈希和比较报告。
2. Scene实例只允许位置、缩放、相机适配等登记的装配覆盖；动作、层级、贴图、牌匾、字体、UI样式、VFX资产和表现状态不得在两个实例覆盖。审核Creator序列化的Prefab override。
3. 分别修改一次正式源的可见无业务属性（例如经审批的帘片轻摆参数）并重建/重载Lab与主体入口；两处呈现同一变更、UI身份与工作表现一致；再复位。不能用“看起来类似”替代依赖证据。
4. 版本变化保留新源提交、源文件哈希、导出工具版本、`.meta`和Prefab UUID、压缩配置与构建哈希。项目被复制到多仓时才引入只读包及版本锁，流程见`CP_REVIEW.md`。

## 5. 依赖、迁移与风险

依赖方向：Product/Art已批准语义与概念 → Art/Tech共同生产预检 → 实际分层/骨骼源 → Tech设计及UI/VFX各自审批 → Client `FEATURE_BRIEF` 与QA `TEST_PLAN`批准 → Client实现 →双入口/平台QA。Tech设计与Art生产预检可并行准备，但未共同签认正式出图不能生产骨骼源；Client不能用当前概念PNG顶替正式源。

风险：未发现本机可用Spine编辑器及许可；无实际分层源/逐片面积；单页候选可能装不下；前柜/骨骼跨节点遮挡需极限姿态验证；旧集中脚本迁移可能复制UI/逻辑；微信/抖音真机压缩、alpha与DrawCall待测。原生平台能力通过工程现有适配边界处理，不在表现层直接调用`wx.*`/`tt.*`。本任务无API/服务端/存档变更，无新大型依赖。

可执行工具路径：制作方提供合法Spine编辑器席位与3.8兼容版本的工作站，Art在那里保存`.spine`和全部源母版；构建方在Creator 3.8.8环境实际导入/预览并归档日志。若暂缺席位，先完成分层原画与页草排等不依赖该软件的工作，骨骼数据导出和Client接入保持待验证。不能用未获许可或未知来源工具替代；`CREATOR_DEPENDENCY_AUDIT.md`记录本机搜查范围和官方依据。
