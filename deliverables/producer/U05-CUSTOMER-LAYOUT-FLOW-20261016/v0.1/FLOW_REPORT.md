# U05顾客与气泡布局修订流程 v0.1

- Master正式输入：`deliverables/master/U05-CUSTOMER-LAYOUT-20261016/v0.1/USER_REQUEST.md`，用户截图要求顾客下移、订单气泡及目标奶茶图案缩小；保持顾客尺寸、动画、业务与既有图片。
- 本轮新任务：`tasks/U05-CUSTOMER-LAYOUT-CLIENT-20261016/task.json` 与 `tasks/U05-CUSTOMER-LAYOUT-FLOW-20261016/task.json`。Producer于2026-10-16T08:45:02+08:00核Task与输入并开始本记录，FLOW `READY→IN_PROGRESS`；Client首Required或源码实产待核，暂保持READY。
- 版本关系：上轮 `EXAMPLE-REVISION-CLIENT-20261015/v0.1-r2` 准确运行版和Art新资源Gate2继续各自 `USER_REVIEW`，本次修订不改变其审批历史，也不构成上轮Gate2批准。本轮布局效果完成实际构建与浏览器核验、同版Review后另送用户审阅。
- 保护边界：起始共享工作区有既存未提交差异，本线只修改U05相关源码及角色交付、项目日志和看板独立marker；不把先前差异归为本轮。无新美术、无QA Agent，子Agent不执行Git。
- Client首份 `FEATURE_BRIEF.md` mtime 2026-10-16T08:46:03+08:00，`apps/client/assets/labs/u05/milk_tea_lab.ts` 有本轮源码差异，Task `READY→IN_PROGRESS`；方案坐标为顾客Y下移35、气泡300×188、杯图0.55，实际效果待构建/浏览器。
- Client `IMPLEMENTATION_REPORT.md`、`RUN_VERIFICATION.md`、`evidence/BUILD_MANIFEST.json` 已实存；manifest记TypeScript退出0、Creator3.8.8构建exit36且Finished、766输出，正式与隔离U05源码SHA `31654def53c7fd20b86ca1968cd5c3e6e24e57b29a1607c79fcbbe71a3479d8d` 一致。8883 HTTP预览已监听，Master真实浏览器画面待核，不提前标效果通过。
- Master在720×1280内置浏览器点入U05、开始并待顾客入场稳定，两张实图 `deliverables/master/U05-CUSTOMER-LAYOUT-20261016/v0.1/customer-layout.png`（SHA `e86fb316aae19fe8ee820a3cd751e3c809e8bbdc1be41f2629d9581111e7cbd9`）与 `customer-detail.png`（SHA `d24b9f0c4f068e63b8f0e428d55e790bf08e66a9602c0e6f801e687db10244da`）实存；Master确认顾客下移、气泡/目标杯缩小且完整，warning/error空。Client最终Required和同版Review待补，不提前送审。
- Client选择页文字微调后r2构建 `BUILD_MANIFEST.json` 更新为exit36、766输出、正式源码SHA `306128c61f4d9fb41c5e4c25852a7cf88cbe09e533819f0587b0fca0ae0933a7`，8884预览已启，Master `selection-layout.png` 已实存。Client第四Required虽实存，但第二验收 `NOT_TESTED`，待最终r2实图结论与Owner更新，不提前USER_REVIEW。

## 最终送审与连续执行检查

- Client四份Required实存，`DELIVERABLE.json`两项验收与Task原文同序PASS、状态 `READY_FOR_REVIEW`；`BUILD_MANIFEST.json`记r2 Creator3.8.8成功、766输出、TypeScript0，Root独立复核最终源码与构建身份。
- Master `BROWSER_VERIFICATION.json` 记录8884最终r2、720×1280浏览器三项布局检查PASS、日志空；三张截图均为最终r2。`IDENTITY.json`五项路径SHA由Producer逐件复算5/5匹配，清单SHA-256 `c41f63a8bb3b2ce4f13d40dc2769338642b42e391571715bd6adebb5e27d04c5`。Master `MASTER_REVIEW.json` APPROVED，仅准本轮布局版送审。
- 新 Client审批 `tasks/U05-CUSTOMER-LAYOUT-CLIENT-20261016/ARTIFACT_APPROVAL.json` 指准确 `USER_REVIEW_PACKET.md` v0.1-r2，`USER_REVIEW`、`decided_at=null`；Task `IN_PROGRESS→REVIEW→USER_REVIEW`。上轮 Art Gate2 与 Client 运行版审批原状保留。本轮仅实测布局画面，未重复上轮完整业务回归，目标设备性能未测；无新图接入、无QA。
- Continuity：Client已到真实用户门禁；FLOW本报告与复盘实存，待Master核收内部支持。无本线无阻塞却仅以READY/IN_PROGRESS占位的任务。
