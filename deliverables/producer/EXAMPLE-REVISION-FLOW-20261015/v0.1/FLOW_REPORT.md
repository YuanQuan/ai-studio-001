# 示例调整流程记录 v0.1

- 记录时间：2026-10-15T22:29:21+08:00。Master kickoff：2026-10-15T22:21:21.418422+08:00；起始工作区差异见 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/PREEXISTING_STATUS.txt` 及 `baseline/`，不得将其算作本轮改动。
- Gate1：用户明确批准 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/APPROVED_PLAN.md` v0.1，SHA-256 `f683779352c7f2210683818f941691f4d735c5f34fe5e21dc4d42793a2a26c0b`，授权证据 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/USER_AUTHORIZATION.json`；审批登记 `tasks/EXAMPLE-REVISION-ART-20261015/ARTIFACT_APPROVAL_GATE1.json`。
- Art：`deliverables/art/EXAMPLE-REVISION-ART-20261015/v0.1/PRODUCTION_PLAN.md`、`ART_BRIEF.md`、`ART_PRESIGN.json` 已实存，Task `IN_PROGRESS`。Tech：`deliverables/tech_lead/EXAMPLE-REVISION-TECH-20261015/v0.1/TECH_DESIGN.md`、`ART_TECH_PRESIGN.md` 已实存，Task `IN_PROGRESS`。这两份预签只支持同批首图制作，不代替切片审批。当前核对提示：仅 far_l 是实际眼睛对象；far_r 无骷髅，后续签认和清单应收窄，不能扩大资源。
- Client：`deliverables/client/EXAMPLE-REVISION-CLIENT-20261015/v0.1/FEATURE_BRIEF.md` 已实存，Task `IN_PROGRESS`；仅旧获批资源、静止背景及幽灵整组横移的代码可独立推进。新PNG/PSD在Gate2前不得进入 `apps/client`。
- Gate2：`tasks/EXAMPLE-REVISION-ART-20261015/ARTIFACT_APPROVAL_GATE2.json` 当前 `DRAFT`，实际切片、PSD与同尺度重组完成后按自产切图例外直接用户审核；不得用内部专业预签替代，也不额外加效果复审。
- 当前尚无本轮新切片正式提交、Client构建运行结论或Tech最终代码Review；以上保持待核。单元示例不派QA Agent。

- 后续执行证据：Art `diagnostics/bridge_l_inspection_3x.png`、`bridge_r_inspection_3x.png`、`far_l_eye_inspection_4x.png` 实存，仅诊断图；Client `apps/client/assets/labs/u01/sakura_v03_environment.ts` 已有本轮源码差异，仍待构建运行。

- Master 同批范围澄清 `deliverables/master/EXAMPLE-REVISION-20261015/v0.1/PRESIGN_SCOPE_CLARIFICATION.md` 已实存：far_l 是实际眼睛对象子集，far_r 保持原样；不新增制作方法或等待门禁。Tech 后续 Review 应承认此范围。

## 中期实物节点

- Art v0.1 已有 `CUT_MANIFEST.json`、`FILE_VERIFICATION.json`、`BUILD_AUDIT.json`、48 层 PSD、七张导出 PNG（其中五张为新唯一输出）、桥前后对照及四秒眼睛循环 GIF。其静态验证自报重组差异 0、获准区外 RGBA 差异 0、零生图；Creator 导入与运行未测。
- Client `evidence/CLIENT_ASSERTIONS.json` 当前列出八项逻辑断言 PASS。隔离 Creator 构建仍在执行，未登记成功。
- Tech `REVIEW_NOTES.md` 已实存，最终同版 `REVIEW.json` 待 HTTP/IAB 证据。
- Art 正式 `ASSET_MANIFEST.md`、`USER_REVIEW_PACKET.md`、`DELIVERABLE.json` 尚未齐备，Task 保持 `IN_PROGRESS`，Gate2 保持 `DRAFT`。
- 首次隔离 Creator CLI 返回134且无新输出。Root 核22:38:29 macOS崩溃栈后经正规权限恢复，同一隔离源构建exit36，`deliverables/master/EXAMPLE-REVISION-20261015/v0.1/evidence/creator-recovery-stdout.log` 于22:40:08记 `Finished in (4 s)ms`，新产物实存；沙箱启动权限相关只是推断。Root逐655 assets与正式源零差，Client核七核心文件/meta一致。HTTP/IAB仍待。

## 美术 Gate2 正式送审节点

- Art 五份 Required 实存；`DELIVERABLE.json` 的23件 Artifact 实存，三项验收与Task原文同序且均PASS。Producer复算 `CUT_MANIFEST.json` 48条真实源路径SHA、48层PSD SHA、82件ZIP SHA及CRC，均匹配；五张新唯一PNG/七张导出仍在Art交付目录，`client_imported=false`。
- `USER_REVIEW_PACKET.md` SHA-256 `83b343dc71e37fdb7e0d86b6aa9b2b21708b9b646b01295de06240d2729381b0`；完整ZIP SHA-256 `8a13b1c24cf26beab0bd5ad12321f7221024c30fdbe07f7185fe82272d4c9bec`；PSD SHA-256 `3a7c77fc38f02306382ee043f162761e8f3fff1f7a38cf0b165e4158b4432a37`。`ARTIFACT_APPROVAL_GATE2.json` 已转 `USER_REVIEW`，`decided_at=null`，Art Task `IN_PROGRESS→USER_REVIEW`。自产切图直接送用户，未增专业效果复审。
- Root r1 IAB发现U01六店初始化重叠，Client仅在商店节点创建后追加applyItem；r2新构建exit36/766文件，HTTP端口8882。Root已见六店恢复，三态U01导出与冻结53实例完整用户JSON同SHA `094365e576c948009a04ffdd0c20a9829171c45f642ffaa5ff80a6366842537d`；U05 r1关键路径实测。最终r2 IAB报告、Client同版交付与Tech Review待续，均不提前DONE。

## 同版运行送审与连续执行检查

- Client四份 Required 实存，`DELIVERABLE.json` 三项验收与Task原文同序且均PASS，状态 `READY_FOR_REVIEW`。Tech四份 Required 实存、三项验收同序PASS，`REVIEW.json` 为APPROVED；Master `TECH_MASTER_ACCEPTANCE.json` 接受内部支持，Tech Task `IN_PROGRESS→REVIEW→DONE`，专业Artifact仅 `PROFESSIONAL_REVIEW`。
- Master `IAB_VERIFICATION.json` 核r2 U01初始/重置/重入53实例与冻结JSON一致、单实例编辑、U00手动镜头、U04冒烟、U05错单/正确单/一次结算/超时/退出重入；`HTTP_IDENTITY.json` 六核心文件200且同本地SHA。r1六店重叠回归及修复保留，最终浏览器warning/error均0；目标设备性能、临近0秒浏览器竞争分支未测。
- `RUNTIME_IDENTITY.json` v0.1-r2 的26项文件SHA由Producer独立复算26/26匹配，清单SHA-256 `24a27a7c8088878327214ad51e03e99ee6f514da8bf5d25b224b8ab3aabb11da`。Master `MASTER_REVIEW.json` APPROVED，仅同意已有资源代码版本送审。Client Task `IN_PROGRESS→REVIEW→USER_REVIEW`，`ARTIFACT_APPROVAL.json` 指准确 `USER_REVIEW_PACKET.md`、`decided_at=null`。预览 `http://127.0.0.1:8882/` 保持；过渡8881已关闭。
- Art新资源Gate2仍 `USER_REVIEW`、`decided_at=null`，没有用户批准，未导入工程。单元示例无QA Agent。Continuity check：Art与Client均到真实用户门禁，Tech内部支持已DONE；FLOW本报告和复盘均有真实产出，待Master接受后可DONE。当前本线无无阻塞且仅以READY/IN_PROGRESS占位的任务。
