# 百鬼夜市 Cocos Creator 工程

## 当前运行入口

正式示例入口为 `assets/UnitSamples.scene`。Gallery包含U00夜市总览、U01樱花环境布局编辑器、U04店长对话及其他仍在用的单元示例。U00/U01共用获批的樱花v0.3场景资源，U04继续通过同一个街景Prefab使用新版背景；既有六家店铺与游客资源保持独立。旧U01 v0.2资源与旧五层背景已在本轮验证后退役，母版、审批与历史交付仍保留。

## 开发与运行

执行 Creator 构建前先读 [本项目构建操作记录](CREATOR_BUILD_RUNBOOK.md)。其中记录了本机 Windows 管理员令牌与沙箱提权的区别、2026-10-09 成功证据，以及输入 SHA、日志、输出和实际 Web 检查步骤。

使用项目锁定的 Cocos Creator 3.8.8 打开 `apps/client/`，场景入口为 `assets/UnitSamples.scene`。U00、U01和U04复用 `assets/units/background/prefabs/pf_street_base_01.prefab` 与同一套 `assets/resources/sakura_v03/` 18张批准PNG；真实Art/Client路径、SHA与Creator image/Texture2D/SpriteFrame UUID登记于 [资源交接登记](../../project/ASSET_HANDOFF_REGISTRY.md) 和 [本任务导入清单](../../deliverables/client/U00-U01-SAKURA-V03-CLIENT-20261014/v0.1/RESOURCE_IMPORT_MANIFEST.json)。U01布局与原型身份数据在 `assets/labs/u01/sakura_v03_layout.ts`。

Web Mobile 构建后，使用项目本地服务提供实际输出，并记录本次入口Scene/profile、main bundle hash、settings与资源源身份。单元示例运行检查应覆盖菜单、进入/返回/重入及对应交互；浏览器Web结果不代表原生、小游戏容器或目标设备性能通过。当前任务最终构建细节见其Client交付记录。

## 工程维护

根目录 `client/` 仅保留版本标记与组织说明，不是另一个 Creator 工程。`assets/demo/` 与旧 `DemoScene.scene` 已从活动样例退役；工作树中既有删除必须按 Client 实施报告和 Git 基线核账，不能把预存删除误记为本轮产出。`tools/` 仅保留当前Web构建静态服务 `serve-unit-build.mjs`；依赖旧DemoScene与`assets/demo/`的一次性场景装配/校准脚本已按资源审计及授权退役，原件哈希备份位置见Client实施报告。Creator 的 `library/`、`temp/`、`local/`、`build/`、`node_modules/` 为生成内容，按项目忽略规则管理。
