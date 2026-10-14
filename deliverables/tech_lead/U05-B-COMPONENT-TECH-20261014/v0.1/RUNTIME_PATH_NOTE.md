# U05 B 运行资源目录最小修正

结论：**APPROVED，限运行目录与加载路径修正**。当前 U05 Lab 在 `milk_tea_lab.ts` 使用 `resources.load('u05_milk_tea/config', JsonAsset, ...)`；其动态 TypeScript 资源引用若仅把 PNG/FNT 放入原计划 `assets/units/shops/milk_tea/textures/u05_b/`，不能由该调用路径证明它们进入 Web `resources` 包。U04 另有明确的 `assetManager.loadBundle('dialogue')` 和 `bundle.load` 机制，但 U05 概要设计未设置相应 AssetBundle。

建议将本批获准后实际运行资产统一放在 `apps/client/assets/resources/u05_milk_tea/u05_b/`，同一资源只保留这一份字节，文件名及 SHA 与 Art 清单保持一致。配置仍沿用 `resources/u05_milk_tea/config`。Client 对 PNG 导入的 SpriteFrame 以 `u05_milk_tea/u05_b/<资产ID>/spriteFrame` 等 Creator 实际可加载子资产路径核对；BMFont 的 `.fnt` 与同名 PNG 成对放入该目录并按 Creator 实际导入类型加载。不能把磁盘绝对路径或 `.png` 文件路径直接当 `resources.load` 的运行路径，也不能仅凭源码有字符串就宣称构建收录。

若 Client 保留 `assets/units/shops/...`，须提供该目录的 Creator AssetBundle 配置及 `loadBundle/bundle.load` 成功证据，或 Scene/Prefab 序列化引用与构建/运行证据。当前最小路径是 `resources`，不触碰图片像素、PSD、图集字符或授权版本。Art 原清单的 `client_path_plan` 是计划值，实际导入后应在同一资源登记文档改为真实运行路径、版本与 UUID；不得静默宣称原计划路径已导入。

新组件切片 Gate2 未批前仅可实现通用 SLICED/BitmapFont 代码与计划路径；获批后才复制具体 PNG/FNT 并验证 Creator 导入、Web 包内容、运行画面及目标平台。当前上述构建和运行检查均 `NOT_TESTED`。
