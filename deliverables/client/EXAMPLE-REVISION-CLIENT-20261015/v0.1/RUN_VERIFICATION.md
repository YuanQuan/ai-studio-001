# 运行验证记录 v0.1

| 项目 | 结果 | 证据 |
|---|---|---|
| Creator 3.8.8 项目 TypeScript 静态检查 | PASS | `evidence/TYPESCRIPT_CHECK.json`；exit code 0，原始 tsc 输出日志存在且为 0 字节（无诊断） |
| Creator TypeScript 资产导入与 UUID | PASS | `evidence/TYPESCRIPT_CHECK.json`；Asset DB 记录 `db://assets/labs/u01/sakura_water_motion_math.ts` 与 UUID `c64f9c9e-14c7-4152-b491-a875fb8f099e` |
| 纯逻辑与结算路径断言 | PASS | `evidence/CLIENT_ASSERTIONS.json`，9 项 PASS；覆盖整组循环、长时间跨越、固定 y、manifest 相位、超时失效与结算隔离 |
| Creator 3.8.8 隔离 UnitSamples 构建 | PASS | `evidence/BUILD_MANIFEST.json`；最终 r2 Creator exit 36、5 秒结束标记、766 个文件，源树 656 文件哈希与正式源码一致 |
| HTTP 与构建身份 | PASS | 最终 `http://127.0.0.1:8882/`；`deliverables/master/EXAMPLE-REVISION-20261015/v0.1/HTTP_IDENTITY.json` 中六个关键文件均 HTTP 200 且哈希一致 |
| Codex 内置浏览器 U00 | PASS | 同镜头两时点背景固定、河面横移、游客动作保留，手动镜头可平移；截图见 Master IAB 记录 |
| Codex 内置浏览器 U01 | PASS | r2 六店位置正常；53 实例初始、重置、重入导出均与冻结 JSON 哈希相同；单实例编辑、锁定拖动、重置、运动与手动镜头实测通过。r1 的六店重叠回归及修复链见 `BUILD_MANIFEST.json` 与 Master 截图 |
| Codex 内置浏览器 U05 | PASS | 错单 sad/恢复，正确 happy/进出、三杯一次完成与一次 +10 提示，90 秒超时失败无奖励，退出/重入清理通过。连续截图核关键帧，完整 1.4 秒/2.8 秒时长由 manifest 与逻辑断言核实 |
| Codex 内置浏览器加载错误 | PASS | Master `IAB_VERIFICATION.json`：r1/r2 warning 与 error 均为 0 |
| U04 共享背景冒烟 | PASS_SMOKE | 共享背景、店长、阿炭与微笑切换、返回菜单见 Master IAB 报告与截图 |
| 目标设备性能、小游戏平台专项 | NOT_TESTED | 没有相应设备或平台证据 |
| Gate2 新眼睛、街面与桥切片 | 未执行（待审批） | 未导入、未绑定；需 Gate2 用户批准并后续单独核运行画面 |

详细的浏览器输入步骤、逐项截图、HTTP 身份和导出比较见 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/IAB_VERIFICATION.json`、`BROWSER_RUNTIME_REPORT.md`、`HTTP_IDENTITY.json`、`U01_EXPORT_COMPARISON.json`。r1 失败截图没有删除；最终审核预览服务是 r2 的 `127.0.0.1:8882`。r1 的 8881 服务已按 Root 要求关闭，8882 保留供审核。
