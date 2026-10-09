# Owner 自核 v0.5

- PASS：源码六店脚点、ID索引顺序与 `USER_LAYOUT_INPUT.json` 一致；baseline scale 为前五店 0.34、第六店 0.40。
- PASS：三名顾客数量和初始缩放维持 3 / 0.28；恢复函数使用六店 baseline scale 数组及顾客初值。
- PASS：只修改 `UnitSampleGallery.ts` 的 U00 baseline 常量/注释；复用现有资源和调节代码。
- PASS：assets TypeScript `--noEmit`，使用项目 Creator 3.8.8 的声明和 tsconfig，命令附加 `--skipLibCheck --target ES2017`，退出码0；检查包括项目 assets 脚本。
- NOT_TESTED：Creator导入/构建、HTTP实际产物、IAB两视口、恢复/重进运行。本轮 Creator 管理员启动助手返回 `0xc0000142`，没有本版新输出。
- 本自核不等同独立Tech Review、Master Review或正式QA；用户输入不等同整版批准。
