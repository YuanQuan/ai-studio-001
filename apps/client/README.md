# 百鬼夜市 Cocos Creator 工程

## 当前运行入口

本工程当前只提供 `UnitSamples.scene` 中的 U01 四层场景镜头示例。启动页面显示“U01 四层场景镜头”，说明为“查看四层场景视差，并拖动、缩放或重置镜头。”；按“进入 U01”打开四层背景，可拖动视差、缩放、重置并返回菜单后再次进入。旧九项单元样例已从活动菜单、Gallery 实现和场景中退役；历史产品说明、任务、评审与审批记录仍保留在各自交付目录。

## 开发与运行

执行 Creator 构建前先读 [本项目构建操作记录](CREATOR_BUILD_RUNBOOK.md)。其中记录了本机 Windows 管理员令牌与沙箱提权的区别、2026-10-09 成功证据，以及输入 SHA、日志、输出和实际 Web 检查步骤。

使用项目锁定的 Cocos Creator 3.8.8 打开 `apps/client/`，场景入口为 `assets/UnitSamples.scene`。页面复用 `assets/units/background/prefabs/pf_street_base_01.prefab`、四张已登记的背景 PNG 和 `assets/labs/menu/scene1_camera_controller.ts`；这些正式资产的路径、哈希和 UUID 以 `project/ASSET_HANDOFF_REGISTRY.md` 及对应交付记录为准。

Web Mobile 构建后，可从工程目录运行 `node tools/serve-unit-build.mjs`，由仅监听 `127.0.0.1:8765` 的本地服务提供实际 `build/web-mobile` 输出。Codex 内置浏览器运行检查应关联本次构建版本，并记录加载、菜单、进入/返回/重入、拖动/缩放/重置及 UI 输入隔离证据。浏览器 Web 结果不代表原生、小游戏容器或目标设备性能通过。

## 工程维护

根目录 `client/` 仅保留版本标记与组织说明，不是另一个 Creator 工程。`assets/demo/` 与旧 `DemoScene.scene` 已从活动样例退役；工作树中既有删除必须按 Client 实施报告和 Git 基线核账，不能把预存删除误记为本轮产出。`tools/` 仅保留当前Web构建静态服务 `serve-unit-build.mjs`；依赖旧DemoScene与`assets/demo/`的一次性场景装配/校准脚本已按资源审计及授权退役，原件哈希备份位置见Client实施报告。Creator 的 `library/`、`temp/`、`local/`、`build/`、`node_modules/` 为生成内容，按项目忽略规则管理。
