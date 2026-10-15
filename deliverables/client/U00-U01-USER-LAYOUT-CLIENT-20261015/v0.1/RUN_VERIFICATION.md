# 运行验证：U00与U01用户布局参数更新

## 已完成

- 输入 `deliverables/master/U00-U01-USER-LAYOUT-20261015/v0.1/USER_LAYOUT.json` SHA-256为 `094365e576c948009a04ffdd0c20a9829171c45f642ffaa5ff80a6366842537d`；53实例、21原型、唯一ID全部符合Master `INPUT_VALIDATION.json`。
- `evidence/PARAMETER_STATIC_VALIDATION.json` 对完整profile与冻结JSON逐字段核验通过；所有top-left、尺寸、scale、镜像、order、Cocos中心映射一致。新增tree B/tree A实例映射到L03背景层并保留6.1/7.1层序；六店脚点投影匹配输入派生值。
- `evidence/RESOURCE_SCOPE_VALIDATION.json` 验证21项图片SHA、image UUID、texture UUID、SpriteFrame UUID均匹配冻结输入；共享默认 `sakura_v03_layout.ts` SHA与变更前一致。U04 `openDialogue`仍调用默认 `populateSakuraV03(background, stage)`。
- Creator捆绑TypeScript 5.8.2检查exit 0，日志/退出码分别为 `evidence/typescript-check.log`、`evidence/typescript-exit-code.txt`。
- Creator 3.8.8隔离构建只选 `UnitSamples.scene` / `01e65005-5a46-45a1-9a16-820ac4b919ae`；配置路径、SHA、隔离资产树hash、正式Creator结束日志、官方exit 36、实际输出目录及6个输出hash见 `evidence/BUILD_MANIFEST.json`。Creator任务日志报告28秒，包含启动的单调时钟耗时40.297秒。
- 实际输出目录：`/private/tmp/u00-u01-user-layout-client-20261015-build/u00-u01-user-layout-client-20261015-web-mobile`。Loopback HTTP服务 `http://127.0.0.1:60440/`，PID 17617；服务已在Root完成验证后停止。服务绑定、构建目录和index hash见 `evidence/HTTP_SERVER.json`。

## Root内置浏览器运行结果（同一构建）

- U01初次进入、临时移动/缩放后重置、返回菜单再进入，三份实际导出均和冻结JSON完全相等；每份53实例、21原型。
- U00初次进入、恢复、返回重入的三份“复制参数”导出中，六店每店footX、footY、scale、mirror、orderBottomToTop均与输入投影完全相等。视口拖动可见新增左树、桥、右树和店铺。
- U04对话页旧默认环境、店铺和人物可打开并返回；仅为共享默认兼容冒烟，不是完整回归。
- Master `IAB_VERIFICATION.json` 与 `HTTP_IDENTITY.json` 均为PASS，六个HTTP文件状态200且SHA与本构建一致，控制台warnings/errors为空。Client独立比较见 `evidence/RUNTIME_EXPORT_COMPARISON.json`。


## 未测试范围

未测真实设备、GPU、触控设备和小游戏平台性能。Web-Mobile构建及内置浏览器可见不代表目标设备或正式QA通过。
