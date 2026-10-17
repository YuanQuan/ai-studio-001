# Client 资源接入实现 v0.2（进行中）

本版承接已批准的 Client Brief v0.1（SHA-256 `36d879472e4d4bff9f5ab1314f63e6c2fbf8b5c3d539e4c043b2d321f732dc72`）和 Tech Import v0.2 对齐。本阶段仍属同一 Client 实现，不冒称独立上游审批。

已完成确定性 staging 生成器、Module/Texture 派生资源解析、U01/U05页面provider接入、Main Gallery页面session候选接线、Loader addRef/decRef资源所有权修复及可执行依赖图测试。生产输入使用Master冻结711文件、reader addendum单文件、5个显式源码override和6个显式新增文件。精确hash、转换和命令见 `SOURCE_CHANGE_MANIFEST.json`。

`staging-project` 是可再生隔离输入，不建议纳入最终Git提交：Root将其复制到独立临时目录执行Creator，以免在交付输入树写入Library、Temp和构建缓存。

## 可复核验证

- `node tests/client/asset-integration/asset_integration.test.cjs`：PASS，覆盖83来源与派生几何、纹理身份缓存、别名、lease共享/释放以及间接Prefab→frame→texture依赖保留。
- Creator自带 TypeScript 编译器兼容语义检查：PASS，命令见 `OWNER_VERIFICATION.json`。
- Staging：PASS，复制717项（711冻结+6显式新增）；83个历史裁片映射对应72张物理派生PNG；10组相同图像alias；849个资产UUID无重复。far_l及桥体未引用原图、far_l未用批准裁片和5张未引用U05 legacy纹理从生产staging排除。Scene原有Gallery序列化硬引用已清空，并启用 `useOptimizedBundles`。
- 已生成 Web-mobile、微信、抖音构建配置；小游戏bundle使用本地 `subpackage`、`isRemote:false`，配置只选择UnitSamples场景。

Creator实际导入/UUID回读、三端构建、浏览器/设备运行、同尺度视觉、20轮生命周期、实际包体和GPU/图集收益均保持 `NOT_TESTED`，待Root隔离运行。staging文件字节不代表发布包体。

## 重现命令

```sh
node apps/client/tools/asset-integration/build_staging.cjs <absolute-stage-root>
node apps/client/tools/asset-integration/generate_build_configs.cjs <absolute-stage-root>
```

Creator命令与各端配置hash见 `BUILD_MANIFEST.json`。
