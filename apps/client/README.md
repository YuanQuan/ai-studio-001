# 百鬼夜市 Demo Creator 工程

唯一可运行工程入口：从仓库根目录在 Cocos Creator **3.8.8** 中打开 `apps/client/`。根目录的 `client/` 仅保留版本标记与组织说明，不是另一个 Creator 工程。

工程基于本机 Creator 3.8.8 内置 `empty-2d` 模板创建。`assets/demo/` 中的 21 张 PNG 来自已获批准的 `deliverables/art/ART-ASSET-DEMO-001/v0.2/`；三组目录 `scenes/`、`props/`、`characters/` 保持源文件名。Creator 首次打开后生成 `.meta`，不要手工改写 UUID。

当前仅完成工程骨架和资源导入。尚未创建 `DemoScene`、TileMap、Prefab、相机及路径锚点，也没有玩法逻辑。静态场景与参数校准完成后，才通过编辑器预览；Web 构建入口为 Creator 的「项目 → 构建发布 → Web Mobile」，构建目录按编辑器配置记录在交付报告中，暂不声称已有可运行构建。

Creator 的 `library/`、`temp/`、`local/`、`build/`、`node_modules/` 为本机生成内容，不提交到仓库。
