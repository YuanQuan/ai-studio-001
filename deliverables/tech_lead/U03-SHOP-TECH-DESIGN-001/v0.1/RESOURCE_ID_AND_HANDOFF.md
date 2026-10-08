# U03 正式资源身份与交接规范 v0.1

## 1. 唯一店身份提案

历史获批技术稿 `UNIT-MENU-TECH-DESIGN-001 v0.2` 将 `MT_SHOP_01` 作为孟桃奶茶店的逻辑 Prefab ID；它目前只在文档中规划，仓库内无该店的正式 Prefab、`.meta` 或 UUID。本案 01 奶茶**继承 `MT_SHOP_01` 为唯一正式店身份**，不再创建第二个 `U03_SHOP_01` 正式 Prefab。旧动态件 `MT_SHOP_MOTION_01` 仍属七菜单历史后续范围；U03 只使用静态店身与同店牌匾，不以静态预览删除或完成其动态件。若旧奶茶概念与本次附件外观不一致，必须按已批准 Art 锚点新制作，不能因共享 ID 而复用旧概念像素。

| 产品顺序与身份 | 本版提议唯一正式顶层 ID | Art Gate1 候选登记的映射 | Prefab 计划路径，均未建立 |
|---|---|---|---|
| 01 奶茶 | `MT_SHOP_01` | `U03_SHOP_01_MASTER/VISUAL` → 同店 PSD/导出身份，**不是另一 Prefab** | `apps/client/assets/units/shops/milk_tea/prefabs/pf_mt_shop_01.prefab` |
| 02 糖画 | `SHOP_02` | `U03_SHOP_02_MASTER/VISUAL` → 同店 PSD/导出身份 | `apps/client/assets/units/shops/sugar_art/prefabs/pf_shop_02.prefab` |
| 03 炭烤 | `SHOP_03` | `U03_SHOP_03_MASTER/VISUAL` → 同店 PSD/导出身份 | `apps/client/assets/units/shops/charcoal_grill/prefabs/pf_shop_03.prefab` |
| 04 理发 | `SHOP_04` | `U03_SHOP_04_MASTER/VISUAL` → 同店 PSD/导出身份 | `apps/client/assets/units/shops/barber/prefabs/pf_shop_04.prefab` |
| 05 花灯 | `SHOP_05` | `U03_SHOP_05_MASTER/VISUAL` → 同店 PSD/导出身份 | `apps/client/assets/units/shops/lantern/prefabs/pf_shop_05.prefab` |
| 06 投壶 | `SHOP_06` | `U03_SHOP_06_MASTER/VISUAL` → 同店 PSD/导出身份 | `apps/client/assets/units/shops/pitch_pot/prefabs/pf_shop_06.prefab` |

`U03_SHOP_0x_MASTER/VISUAL` 是已批 Art Gate1 的计划资产登记名。本稿不改 Art 文件：先用上表一对一映射让 01 没有双正式 ID；待 Art 影响 Review、同版用户审批后，Art 与 Client 在 `project/ASSET_HANDOFF_REGISTRY.md` 写入同一行或明确关联，不得留两个可运行奶茶 Prefab。02–06 的 `SHOP_02`–`SHOP_06` 是此处拟新增的主体可复用顶层身份，并非在 U03 Lab 下另做一份资源。若 Art 认为 `U03_SHOP_0x_*` 必须作为跨角色正式对象 ID，与本提案冲突时应由 Master 组织变更决定，不能私自重号。

## 2. 双目录、命名和版本

美术源按已批 Gate1 计划：`deliverables/art/U03-SHOP-ASSET-001/v0.1/psd/shop_01_milk_tea.psd` 至 `shop_06_pitch_pot.psd`，六份独立多层 PSD；`exports/` 保存从对应 PSD 拆层/合并导出的正式 PNG，`review/` 保存同尺度重组和对照。以上路径均为**计划**，不代表已生成，也不把 PSD 或审核图导入 Cocos。

Client 正式图计划置于 `apps/client/assets/units/shops/<店类别>/textures/`，例如 `tex_mt_shop_01_body.png`、`tex_mt_shop_01_sign.png`；实际单张/多张、层名和完整文件清单在 Art/Tech/Client 同批预签及切图协作后决定。前后件、牌匾如合并输出，仍由 PSD 层映射追溯。Prefab 置于同店 `prefabs/`。可选公共地面若被批准使用，独立置于 `units/shops/common/textures/`，不在六份店图间复制旧店影子。Lab 页面 Scene、控制逻辑留 `apps/client/assets/labs/menu/`，不存第二份正式店纹理。

Creator 文件用 ASCII 小写 `snake_case`，`tex_` 图、`pf_` Prefab、`scn_` Scene；逻辑 ID 保留登记表大写。文件名不塞 `v0.1`、日期或哈希；版本、审批和 SHA-256 在交接登记与 Git 留痕。正式路径首次创建前由 Client 对照已批规格检查重名；替换同一资产时保留 `.meta`，不得用删建资源方式偶然改变 UUID。确需改变层数、原点或身份时列出影响并重新审核对应 Artifact。

## 3. `project/ASSET_HANDOFF_REGISTRY.md` 回填字段

每店至少一条顶层身份，逐 PNG/PSD 另列子资源：正式 ID、产品身份和画面描述、Art 实际路径、Art 版本与 SHA-256、Gate1/Gate2 批准版本、Client **计划/实际**路径、导入状态、原图像 UUID、Texture2D 子 UUID、SpriteFrame 子 UUID、Prefab `.meta` 主 UUID、Prefab→SpriteFrame 与 U03/未来主体 Scene 引用。未生成、未导入时分别写 `PLANNED_NOT_GENERATED`、`PLANNED_NOT_IMPORTED`，UUID 为 `待生成`；不能借 U01 的 UUID。若一张 PNG 中含多个 SpriteFrame，逐子资源记录实际键与真实 UUID。

Gate2 后 Art 核 PSD/导出/重组的版本和哈希；Client 导入后核源文件与工程图 SHA-256、Creator 3.8.8 `.meta` 与 AssetDB、实际 Prefab 依赖；Tech 复核单 ID、命名和引用；Producer 检查正式切片批准再解锁 Client。正式替换记录旧→新 hash、审批版本、UUID 是否保持、受影响 Scene/Prefab 和复验结果。`project/ASSET_HANDOFF_REGISTRY.md` 现主要记录 U01；本稿不改其中已实存的 U01 事实，也不把本案计划伪写成导入状态。

## 4. 静态与动态边界

`MT_SHOP_01` 顶层 Prefab 负责当前批准的奶茶静态店体、牌匾与静态光影；未来经独立批准的动态帘/设备与灯变可作为明确子对象或关联组件进入同一正式店对象，骨骼动态件遵循原先单对象单页原则。U03 不自动启用该动态件。其他五店若未来增加动态件同样走新 Artifact，不在本期凭参考图中的火、灯或人物扩范围。这样一店的资产身份稳定，静态 U03 与后续主体阶段可按批准版本逐步复用。
