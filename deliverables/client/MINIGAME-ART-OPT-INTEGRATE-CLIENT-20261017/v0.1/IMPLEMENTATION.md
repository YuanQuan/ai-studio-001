# Client 实现记录（进行中）

任务：`MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017`。本实现承接已批准 Gate2、Tech Import v0.2 与 Client Brief v0.1（SHA `36d879472e4d4bff9f5ab1314f63e6c2fbf8b5c3d539e4c043b2d321f732dc72`）。当前阶段只完成独立导入清单生成器、原画布派生帧解析器和有效单测；没有修改 Gallery/U01/U05、Scene/Prefab、资产像素或共享框架。主 Client 冻结最终源码快照后，继续生成隔离 staging、Creator 真实导入与页面按需生命周期接线。

## 已实现

- `apps/client/tools/asset-integration/asset_manifest_generator.cjs` 读取 Tech handoff map 和 Bundle map，校验 83 行计数、每项导出 SHA-256、PNG IHDR 尺寸与批准 crop rect、原画布边界、Bundle 唯一归属和稳定 ID；输出逻辑资产、原 UUID、计划 canonical UUID/路径、派生帧几何、模块依赖清单及相同图像 alias。输出将 `importedImageUuid`/`importedFrameUuid` 留空，并显式标记 `SOURCE_VALIDATED_NOT_CREATOR_IMPORTED`。
- `apps/client/assets/framework/asset-integration/derived_asset_resolver.ts` 通过既有 `ModuleAssets` acquire 模块与显式依赖；调用 Creator 公共 `SpriteFrame.reset` 从不可变源 frame 的 Texture 构造含原画布、rect、offset 的派生 frame；以纹理身份和几何缓存，引用计数归零时先销毁派生 frame 再释放模块租约。未改写导入 frame；批准资源 pivot 均为中心点，非中心点会明确失败。
- `.meta` 当前为 Owner 创建的 Cocos TypeScript 格式候选文件，不是 Creator 导入回读证据；应在隔离 staging Creator 导入时核对/替换真实 subMeta/UUID。

## 可复核检查

`node tests/client/asset-integration/asset_integration.test.cjs` PASS：实际 transpile 并执行 TypeScript resolver；覆盖 83 项来源验证、10 组图像共享、reset 几何、相同路径并发 acquire、末引用释放、源 frame 保持有效、坏 hash 拒绝。

使用项目内 Creator 3.8.8 TypeScript 编译器做静态语义检查，命令为：

```sh
/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/node_modules/typescript/bin/tsc --noEmit -p apps/client/tsconfig.json --skipLibCheck --lib es2018,dom --pretty false
```

该覆盖项目 TS 源，退出码 0。默认 tsconfig 命令会因 Creator bundled declarations 与该项目默认 lib/类型声明不兼容产生大量既有声明/目标库错误；通过 Creator 原编译器并指定兼容 lib 和 `skipLibCheck` 后，本轮可执行静态检查通过。此项不等于 Creator Import/Build。

## 尚未执行

等待 Master 提供主 Client v0.4 冻结的精确源码输入快照。隔离 staging 与原工程的前后 hash 保护、Creator Import UUID/frame 回读、启动 Scene 硬引用解除、83 项资源真实归属、实际 Web/小游戏构建和运行截图、同尺度视觉核验、二十次生命周期循环、GPU/平台包体、图集收益测量及发布包差额均为 `NOT_TESTED`。不能把当前 Node geometry mock 或生成 manifest 写作这些项目的通过证据。
