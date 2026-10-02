# 单元重启｜旧 Creator 工程审计与替换路径 v0.5

2026-10-02；Tech Lead；对应任务 `UNIT-PILOT-ART-CONCEPT-001`。只读审计，不修改 Client 源码或场景。

## 1. 实际检查结果

本轮读取 `apps/client/assets/UnitSampleGallery.ts` 全 618 行、`UnitSamples.scene` JSON、各资源 `.meta`，将序列化 `frames` 的 UUID 与源资源逐一匹配；并读取 `package.json`、`settings/v2/packages/{engine,project,builder}.json`、profiles builder/scene 设置及 README。结果：

| 项 | 本轮证据与判断 |
|---|---|
| Creator 版本 | `package.json` 为 3.8.8。引擎 `spine=true`，选项及包含模块为 `spine-3.8`；`spine-4.2=false`。3D 的 `skeletal-animation=false` 不代表 Spine 被禁用。实际 Spine 导入兼容未测试。 |
| 当前默认使用入口 | README 指向 `UnitSamples.scene`；builder 设置没有已锁定 startScene。场景 UUID 为 `01e65005-5a46-45a1-9a16-820ac4b919ae`。历史 `DemoScene.scene` UUID 为 `849750a9-cd18-4ed3-9249-3a4c01f502d6`，不得将它视为新主体集成入口。 |
| 资源现状 | assets 共 21 PNG、9 Prefab、2 Scene、1 TypeScript。未发现 `.atlas`、`.skel`、骨骼 `.json`、`.ttf` 或 `.otf`。UnitSamples 序列化组件未发现 `sp.Skeleton`。9 Prefab 全在旧 `assets/demo/prefabs/`。 |
| 21 张实际引用 | `UnitSamples.scene` 的 gallery `frames` 共 21 项，UUID 全解析到旧 `assets/demo/`，没有新孟桃或新奶茶店。明细见下表。 |
| UI 与结构 | gallery 同一类负责地图、输入、菜单、按钮、确认卡、角色、遮挡、特效、密度统计。`onLoad` 第 66–68 行关闭历史 WorldRoot，动态建 720×1280 根节点；项目设计分辨率也为 720×1280。新横向全景只定义视觉参考，不自动改成横屏产品。 |
| 旧四方向 | U04 第 433 行起使用 `directionGlyph` 程序形体；U05 第 458 行起关 Sprite、用 Graphics 画方向角色。`moveActor` 第 335 行起索引旧走路 SpriteFrame。均非四方向骨骼。旧店铺四方向控件与当前店铺/店长只需单视角要求不同，不能复用为新验证标准。 |
| 旧特效 | U07 第 516 行起用 Graphics；第 611 行树木整 Sprite angle 微动。未使用树木骨骼；这只是旧机制占位。 |
| 旧性能 | U09 按 dt 统计 FPS，第 559 行起增加旧 Sprite，最大 200。没有新骨骼、DrawCall 计数、目标机纹理格式或内存记录，无法证明新单元性能。 |
| 字体 | 第 103 行 `Label` 没有绑定获许可字体，默认运行字体未登记许可；新共用身份 UI 必须另交 UI/Art 字体规格与许可，不能直接复制此默认配置。 |

### SpriteFrame 索引核对

| 索引 | 实际源路径（相对 `apps/client/assets/demo/`） |
|---|---|
| 0–3 | `scenes/tile_ground.png`、`tile_stone_road.png`、`tile_water.png`、`tile_shore.png` |
| 4–6 | `scenes/bridge_entry.png`、`bridge_exit.png`、`yama_palace.png` |
| 7–8 | `props/stall_ruined.png`、`stall_restored.png` |
| 9 | `characters/keeper_ghost.png` |
| 10–12 | `characters/guest_floating.png` 及 walk_01/02 |
| 13–15 | `characters/guest_horned_beast.png` 及 walk_01/02 |
| 16–18 | `characters/guest_paper_talisman.png` 及 walk_01/02 |
| 19–20 | `props/lantern_warm.png`、`shore_tree.png` |

本轮是源文件/资源引用审计，没有运行编辑器、新构建或真机测试；旧构建成功记录不能移作新单元证据。

## 2. 替换路径和可执行 Review Action

1. **视觉版本引用先替换**：v0.5 独立角色、无人店身、关系图与 PARTS_PLAN 进入用户审阅，旧 v0.4 只保留历史。场景附件不裁切作店身，不导入 gallery frames 当成新单元。新图仍是概念，需要下一阶段真实可编辑分层、分件和骨骼导出。
2. **技术设计决定独立工程形态**：`CP-UNIT-REUSE-001` 仍为 PROPOSED。优先建议一个 Creator 3.8.8 工程里的各类独立 Scene/Prefab/源目录，便于分别打磨并保持 UUID；用户希望尽量独立工程的需求须由正式 Tech Design 明确交付形式，不能静默当作已同意单工程。若要求物理多项目，需共享源发布包、稳定 meta UUID、版本锁和依赖导入校验，不能手工各复制一份并反复改动。
3. **新源分开建立**：获批后分别新建 `assets/units/mengtao/`、`assets/units/milk-tea-shop/` 的真实源、骨骼和 Prefab；旧目录不改名冒充。`MT_CHAR_01` 角色根与脚点、`MT_SHOP_STATIC_01` 店基点/柜台层、`MT_SHOP_MOTION_01` 布帘固定支点、工作位/台面交接锚点来自同一获批拆件版本。路径是建议，不是已写入工程。
4. **共用表现控制**：一份待机→工作→收束→待机控制，允许 Lab 发演示请求；重复触发、reset、结束/VFX清理策略在 Tech Design 和 Client 开工包确认。正式身份组件与资源从同一源引用，Lab 按钮和诊断不进入主体界面。别把旧 U08 修复卡或旧菜单代码当作新业务 UI。
5. **独立入口与主体集成**：分别装配 `MengTaoShopLab.scene` 和获批主体集成入口，均引用同一角色/店身 Prefab UUID、脚本/配置/身份 UI/VFX源版本。两个入口不得有造型或逻辑副本；Prefab override 须列清单，不得覆盖公共 UI 细节。
6. **接入门禁与验证**：Art/Tech 当前签认仅允许概念图。概念批准→真实分层/atlas/骨骼联合出图检查→Tech/UI/VFX规格与 Client FEATURE_BRIEF + QA TEST_PLAN批准→Client 实装→专业评审/用户确认→QA。实装需核对两对象 atlas 各仅一页、导入无缺附件，柜台前沿遮腰而手可见，动作复位和共享源热替换/重建两入口生效，最后平台真机性能。

## 3. 未决与下一门禁

本轮无新骨骼数据、动画、atlas、Prefab、Lab scene 或共享 UI/VFX，实现尚未被替换；旧工程源码仍在。现阶段做到概念当前版本替换与分件/接入条件审计，不能标记整个 Creator 单元 DONE。下一门禁是新三图与拆件方案具体版本的 USER_REVIEW；独立工程形式、生产参数与实装审批随后进入各专业环节。
