# 奶茶店左檐灯笼首样技术预检

本文件是首样前只读预检；同批 `MASK_SPEC.json` 经 Art 锁定后，另以 `TECH_PRESIGN.json` 绑定其 SHA-256。尚未创建 mask、Effect、场景或构建，不据此判运行通过。

Art 已锁定 `MASK_SPEC.json` SHA-256 `4f12245b7a68cd95c54563bdf84b1c93f8f0a582037692064441bcad57d701a6`。按其源 body、椭圆×绿色通道×alpha 公式在内存重算，非零像素 2431、排他 bbox `[200,533,249,598]`，与规格一致，处于最大 ROI `[178,505,280,670]` 内；未写出 mask 文件。这只核公式和范围，不证明新 PNG/引擎采样通过。

## 本机与工程依据

- 项目 `apps/client/package.json` 锁 Cocos Creator `3.8.8`；本机 `/Applications/Cocos/Creator/3.8.8/CocosCreator.app` 的 `Info.plist` 报 `3.8.8`，可执行文件位于 `Contents/MacOS/CocosCreator`。内置 CLI 的构建/导入能力尚未对本 pilot 实测，`--help` 未返回可用说明。
- 同版内置引擎 `cocos/2d/framework/ui-renderer.ts` 暴露 `customMaterial` 并在 `updateMaterial()` 中应用；`cocos/asset/assets/material.ts` 提供 `setProperty()`；内置 `builtin-sprite.effect` 展示 Sprite 的 UV、`cc_spriteTexture` 采样与 source-over 混合。这些支持设计小型单 Sprite 局部亮度候选，不证明新 Effect 已编译或能精确复现获批像素。
- 现有奶茶店 body SpriteFrame `.meta` 为 1024×1024、`trimType:none`、`atlasUuid` 空、`packable:true`，Prefab 的 `_atlas` 为空、`_customMaterial` 为空。构建时 UV、动态图集/合批、实际混合及颜色路径仍需读运行 SpriteFrame 并验证，不能从 `.meta` 推断恒定状态。

## 首样前签认条件

1. 在独立 pilot 引用原 body 纹理与当前 SpriteFrame，锁原纹理/像素哈希、实际 texture 尺寸、`uv`、`rect`、trim、atlas/动态合批状态；将 Art 锁定的 1024 原图 ROI/mask 明确映射到最终纹理采样域。映射与运行资源不一致时停止，不修改正式 PNG、`.meta` 或奶茶店入口。
   Client 已选独立 pilot 的运行时新 `SpriteFrame`：复用原 frame 的 Texture2D，显式设完整 rect/originalSize/offset 与 `packable=false`，不落新 `.meta`/PNG；本机同版引擎源确认构造、texture 和 packable setter。仍须在首次渲染与实际构建核 UV/rect/trim/atlas，不能仅以源坐标直接采样。
2. 仅本店体 pilot Sprite 使用独立材质实例与局部亮度 Effect。控制一个 mask 与强度参数；不向共享材质写动态参数，不影响 sign、室内灯、右杯牌或其他实例。若材质隔离、Effect 编译或颜色/alpha 混合不能验证，停止首样。
3. mask 采用 Art 最终规格的 128×256 L8、内缘 4 像素羽化，计划 R8 原始数据 32,768 字节；实际 Creator 导入的 GPU 格式、分配与常驻增量须验证且 ≤0.25 MiB，不允许复制约 4 MiB 的 1024² RGBA body。强度 1.0 须回原图同条件全画面可见 RGB/alpha；动态 mask 外零差、全画面 alpha 不变。CPU/GPU 差异仅用真实目标设备及可核测量精度评估；新增 Draw Call ≤1 是硬限，0 是优化目标。
4. 最短完整 2 秒循环检查 1.0 基准、0.90 极值、首尾接缝、打断/隐藏/重复触发回基准和静态降级。Creator 导入、构建、HTTP 实际产物及 Codex 内置浏览器回放分别留证；未执行项保持 `NOT_TESTED`。示例由 Owner 留证，不安排 QA。

制作预算仍为 0 次生图、1 个候选、同一缺陷累计至多 2 轮修正、4 小时、0 元新增费用。此预检不消耗制作预算，也不替代 Gate2 对实际资源的用户审核。
