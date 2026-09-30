# 百鬼夜市 Demo Creator 工程

## 当前可运行的单元样例

用 Cocos Creator 3.8.8 打开本目录，双击 `assets/UnitSamples.scene`，预览当前场景。菜单可进入 U01–U09 九个独立样例，操作与边界见 `../../project/unit_tests/UNIT_SAMPLES_v0.1.md`。旧 `DemoScene.scene` 是已取消整体 Demo 的历史静态场景。

Web Mobile 构建时将 `UnitSamples.scene.meta` 的 UUID 设为 `startScene`；本地构建后可运行 `node tools/serve-unit-build.mjs`，在浏览器打开 `http://127.0.0.1:8765/`。`tools/create-unit-samples-scene.mjs` 仅用于初次创建场景，已存在场景时会拒绝覆盖。

唯一可运行工程入口：从仓库根目录在 Cocos Creator **3.8.8** 中打开 `apps/client/`。根目录的 `client/` 仅保留版本标记与组织说明，不是另一个 Creator 工程。

工程基于本机 Creator 3.8.8 内置 `empty-2d` 模板创建。`assets/demo/` 中的 21 张 PNG 来自已获批准的 `deliverables/art/ART-ASSET-DEMO-001/v0.2/`；三组目录 `scenes/`、`props/`、`characters/` 保持源文件名。Creator 首次打开后生成 `.meta`，不要手工改写 UUID。

`assets/DemoScene.scene` 由 Creator 保存的空白场景扩展为静态排布，包含 17×17 等距 TileMap、两桥、阎罗殿、目标摊位两态、背景摊位、角色示意和固定路径锚点。Creator 已导入 `assets/demo/tilemaps/NightMarket.tmx` 和 `assets/demo/prefabs/` 的九个静态 Prefab。场景已关联十二个 Prefab 实例：两桥、阎罗殿、目标摊位、五个背景摊位和三名顾客示意。原 225 个 Sprite 地表草稿已在 TiledMap 可见后移除。项目设计分辨率为 720×1280 竖屏、适配宽度。

已取得旧 17×17 静态场景的 Creator Web 预览截图，见 `deliverables/client/CLIENT-CALIBRATION-DEMO-001/v0.3/screens/creator-preview-before-exit-alignment.jpg`。此图拍摄于出口桥路线微调之前；旧场景最终路线、最近／最远镜头和手机触控未完成验证。Web 预览入口为编辑器顶部预览按钮；Web 构建入口为 Creator 的「项目 → 构建发布 → Web Mobile」。旧 `DemoScene.scene` 没有交互代码；本轮相机拖拽、缩放、修复和角色移动样例位于 `UnitSamples.scene`。

`tools/build-static-scene.mjs`、`attach-tiledmap.mjs`、`export-static-prefabs.mjs`、`prune-disabled-ground.mjs` 和 `link-static-prefabs.mjs` 是一次性装配脚本，不要对已在 Creator 编辑的场景重复运行。`calibrate-static-scene.mjs` 用于已迁移前的普通静态节点，Prefab 实例关联完成后不要再次运行。`validate-static-scene.mjs` 检查场景引用、TileMap 和 Prefab 实例；`render-static-layout.py` 从资源拼出评审用镜头构图图，不等同于 Cocos 运行截图。校准证据与状态见 `deliverables/client/CLIENT-CALIBRATION-DEMO-001/v0.3/`。

Creator 的 `library/`、`temp/`、`local/`、`build/`、`node_modules/` 为本机生成内容，不提交到仓库。
