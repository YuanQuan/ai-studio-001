# Client 资源接入实现 v0.3（修订中）

本版保留v0.2失败候选及证据，以Master冻结输入、Tech/UI已批准契约和83映射继续同一Client阶段实施。v0.2 Creator CLI虽显示Finished，但Web实际运行出现 `模块清单缺少模块：[object Set]`；微信输出的 `game.json` 只有 `internal/main`，未生成配置请求的5个真实subpackage。失败证据在 `SOURCE_CHANGE_MANIFEST.json` 引用的历史路径中，不覆盖。

修复点：`ModuleAssets.cancelOwner` 和 `getInFlightCount`、`DerivedAssetResolver` 活跃帧释放、U05代理冲突组均显式用 `Array.from` 物化Set/Map迭代对象。单测改用ES5 lowering并执行Set取消、Map计数和U05分组返回。Root已启动v0.3 Creator Web构建/运行，构建结果待其证据回填。Tech仍在核验Cocos Bundle目录meta的小游戏分包枚举；在看到 `game.json` 和每个模块的真实subpackage文件前，不宣称分包通过。

运行 `node tests/client/asset-integration/asset_integration.test.cjs` 与Creator自带TypeScript兼容语义检查均通过。该lowering模拟不是Creator编译产物证据。83项Creator UUID回读、最终可视对照、错误/取消/重入、20轮循环、物理包体和GPU收益仍待实测。

重建输入与各平台命令见 `BUILD_MANIFEST.json`。明确使用v0.3版本化 `OWNER_SOURCE_OVERRIDES.json`；staging本身是可再生临时目录，不提交重复711源树及Creator缓存/输出。
