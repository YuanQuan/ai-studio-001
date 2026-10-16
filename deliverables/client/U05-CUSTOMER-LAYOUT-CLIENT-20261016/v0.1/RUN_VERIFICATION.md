# 运行与静态验证

- TypeScript：PASS，Creator附带TypeScript执行项目 `tsconfig`，退出码0；输出见 `evidence/typescript-check.log`。
- Creator导入与Web构建：PASS，Creator 3.8.8隔离副本构建任务 `U05-CUSTOMER-LAYOUT-CLIENT-20261016-v0.1-r2` 完成，退出码36；stdout/stderr见 `evidence/creator-build-r2-stdout.log` 和 `evidence/creator-build-r2-stderr.log`。
- 构建产物：PASS，最终r2目录含766个文件；关键输出SHA-256见 `evidence/BUILD_MANIFEST.json`。
- 实际浏览器：PASS，Master在最终8884 r2、720×1280内置浏览器确认选择页文字、入场顾客和订单气泡/奶茶布局；warn/error为0。截图及路径记录在manifest和Master交付目录。
- 未重复上轮完整业务场景回归；目标设备性能为NOT_TESTED。
