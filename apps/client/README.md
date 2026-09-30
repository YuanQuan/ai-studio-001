# 百鬼夜市 Demo Creator 工程

唯一可运行工程入口：从仓库根目录在 Cocos Creator **3.8.8** 中打开 `apps/client/`。根目录的 `client/` 仅保留版本标记与组织说明，不是另一个 Creator 工程。

工程基于本机 Creator 3.8.8 内置 `empty-2d` 模板创建。`assets/demo/` 中的 21 张 PNG 来自已获批准的 `deliverables/art/ART-ASSET-DEMO-001/v0.2/`；三组目录 `scenes/`、`props/`、`characters/` 保持源文件名。Creator 首次打开后生成 `.meta`，不要手工改写 UUID。

`assets/DemoScene.scene` 由 Creator 保存的空白场景扩展为静态排布草稿，包含 15×15 等距地表示意、两桥、阎罗殿、目标摊位两态、背景摊位、角色示意和固定路径锚点。`assets/demo/tilemaps/NightMarket.tmx` 是同一格局的 Tiled 源文件；当前场景仍以单张 Sprite 展示地表，尚未在 Creator 中完成 TMX 导入和 TiledMap 组件替换。`tools/` 下两个脚本用于复现静态草稿，不包含玩法逻辑；不要对已在编辑器修改过的场景直接重复运行场景生成脚本。

下一步需在 Creator 的资源面板刷新资产、重新打开 `DemoScene`，检查画面和 Console，随后完成正式 TiledMap、Prefab、相机范围及截图校准。Web 预览入口为编辑器顶部预览按钮；Web 构建入口为 Creator 的「项目 → 构建发布 → Web Mobile」。当前尚未取得预览/构建通过证据。

Creator 的 `library/`、`temp/`、`local/`、`build/`、`node_modules/` 为本机生成内容，不提交到仓库。
