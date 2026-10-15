# 运行验证：U01用户布局参数

## 已完成检查

- 冻结输入 `deliverables/master/U01-USER-LAYOUT-20261015/v0.1/USER_LAYOUT.json` SHA-256为 `f34af020733b3ad095c7845d028f8acdfcf5a00fee30ea7a01c547bfac02a364`，与用户授权记录相同。
- TypeScript 5.8.2 `tsc -p tsconfig.json --noEmit --skipLibCheck --target ES2021 --lib ES2021,DOM` exit 0，日志与退出码分别见 `evidence/typescript-check.log`、`evidence/typescript-exit-code.txt`。
- 隔离Creator工程与当前 `apps/client/assets` 全量同步，631个文件哈希差异0；只修改U01编辑器。共享布局、环境、Gallery和Scene源码hash前后相同；21原型PNG字节及图像/SpriteFrame UUID符合冻结输入。详见 `evidence/SCOPE_AND_RESOURCE_VALIDATION.json`。
- 静态模型按编辑器实际顺序生成后，对冻结JSON全部51实例参数/顺序/UUID和21原型身份逐字段比较，0差异；详细结果见 `evidence/PARAMETER_STATIC_VALIDATION.json`。
- Creator 3.8.8官方CLI隔离构建 `web-mobile`成功，官方exit 36且日志含 `build Task (u01-user-layout-20261015-build) Finished`。唯一启动场景 `db://assets/UnitSamples.scene` / `01e65005-5a46-45a1-9a16-820ac4b919ae`。产物目录 `/private/tmp/u01-user-layout-20261015-build`，主bundle SHA-256 `16f586288b6b56620fe203b5a3eeb54ef207291af9b9a17e17b946571d97f17f`。构建身份见 `evidence/BUILD_MANIFEST.json`、`OUTPUT_FILES_SHA256.json`。
- Root在Codex内置浏览器实际检查：U01初次进入后导出与冻结JSON完全相同；临时移动/缩放店2后重置，导出恢复完全相同；返回菜单后重入，导出仍完全相同。三份导出均对完整JSON深度相等，21原型/51实例，浮点和UUID一致。截图、JSON与总体验证在 `deliverables/master/U01-USER-LAYOUT-20261015/v0.1/IAB_VERIFICATION.json` 及相邻 `evidence/`。控制台warnings/errors空。
- HTTP身份：六个关键HTTP文件均状态200且hash与此构建一致；见 `deliverables/master/U01-USER-LAYOUT-20261015/v0.1/HTTP_IDENTITY.json`。
- 三份实际导出的独立机器比较见 `evidence/RUNTIME_EXPORT_COMPARISON.json`。

## 测试限制

未测试目标设备、GPU及小游戏平台性能。内置浏览器功能检查运行于720×1280视口，不作为设备性能结论。本任务零生图，未修改PNG/PSD。
