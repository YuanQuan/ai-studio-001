# U00 参数基线修订实施记录 v0.5

用户提供完整 JSON 后，已将六店脚点更新为 `(-1079,-234)`, `(-780,-260)`, `(-410,-235)`, `(350,-237)`, `(689,-249)`, `(1030,-249)`；对应 baseline scale 为 `.34,.34,.34,.34,.34,.40`。三名顾客仍为 `.28`，count 3。恢复按钮重置至新的店铺位置/scale 数组，离开后重入则重新构造该数组与顾客默认 scale。

改动仅在 `apps/client/assets/UnitSampleGallery.ts`。复用既有六店 Prefab、顾客适配和调节面板；没有新增资源或依赖，未改正式玩法、接口或图像。

源码 SHA-256：`299F72C84A01653C696B28015E6ACFF7130CC14CFAEB181CAD3B852A87306C0A`。参数输入见 `USER_LAYOUT_INPUT.json`。构建与运行未完成：本机 Creator 3.8.8 管理员启动两次均返回 Windows 错误 `0xc0000142`，Creator 构建脚本未执行，当前版没有新 build 输出。旧 v0.4 构建和运行证据不作为 v0.5 通过证据。具体尝试见 `BUILD_AND_RUNTIME_RECORD.md`。

assets TypeScript noEmit 检查通过，退出码0。使用 Creator 3.8.8 自带 TypeScript 及 U00隔离工程配置：`node <Creator 3.8.8>/resources/app.asar.unpacked/node_modules/typescript/lib/tsc.js --noEmit --project apps/client/temp/u00-scale-build-20261009/tsconfig.json --skipLibCheck --target ES2017`。检查读取隔离副本中的源码与 Creator 声明；其中 Gallery SHA 与本报告源码 SHA 一致。

此为单元示例，Owner 技术自核不代表独立 QA。等待 Tech/Master 对准确源码版本完成 Review；本次用户参数输入授权不等于 v0.5 整版批准。
