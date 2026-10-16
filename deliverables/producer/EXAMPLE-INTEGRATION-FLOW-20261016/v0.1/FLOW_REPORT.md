# 获批示例切片接入流程 v0.1

- 正式授权：`deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/USER_AUTHORIZATION.json` 分别记录用户“好的继续吧”批准 U05 布局准确 `v0.1-r2`，以及“ 一起批准，继续接入 ”批准 Art `EXAMPLE-REVISION-ART-20261015/v0.1` 的桥清理、街面镜像与眼睛循环切片 Gate2。用户消息精确发送时间未知，不能把本轮文件mtime当作用户发送时间。
- Producer 于 2026-10-16T09:03:55+08:00 核三份新 Task、授权和两份先前审批，并开始本流程记录，FLOW `READY→IN_PROGRESS`。新 Client/Tech Task 在首份Required或源码实产可核前保持 `READY`。
- 旧版本决策：`tasks/U05-CUSTOMER-LAYOUT-CLIENT-20261016/ARTIFACT_APPROVAL.json` 与 `tasks/EXAMPLE-REVISION-ART-20261015/ARTIFACT_APPROVAL_GATE2.json` 分别转 `USER_APPROVED`，对应Task为 `DONE`；送审身份、旧日志和Art实际文件保持。此批准解锁新切片接入，不自动批准接入后的运行版；原 `EXAMPLE-REVISION-CLIENT-20261015` 完整运行版审批仍保持原状态。
- 本轮接入范围：批准的五张唯一PNG按原字节导入，真实客户端路径/UUID与镜像、眼睛四秒循环接入由Client实产后核录；Tech复核代码、资产与运行身份。新接入版仍需Creator3.8.8构建、HTTP/IAB及用户独立审核。单元示例无QA，无新生图、无Studio同步；保护起始共享未提交差异，仅本线新交付和项目独立marker，不执行Git。
- Client首Required `FEATURE_BRIEF.md` mtime09:04:45+08:00实存，Task `READY→IN_PROGRESS`。Brief明确五图用途、街面左母图右镜像、眼睛四秒opacity与U01基础导出隔离；实际图片/UUID/运行仍待。
- 五张获批新PNG已复制到 `apps/client/assets/resources/sakura_v03/`；Producer以Art v0.1 `exports/` 对照逐字节5/5相同。当前对应 `.meta` 尚未实存，不能据复制推断Creator正式导入或真实UUID，接入仍在执行。
- 随后Creator已生成五份新 `.meta`，Producer读取五个主UUID并再次核PNG5/5与Art源字节一致；Client正式导入manifest和最终构建身份尚待，不据此提前判运行效果。
- Client `evidence/ASSET_UUID_MANIFEST.json` 已实存，Producer复算5项Art/工程PNG SHA、字节及 `.meta` 主UUID均匹配；清单SHA `24979cda4b6f81f51b553e4ce74776b86b1aaefcf82d89a949259ec3d4ecb79b`，真实路径和UUID已登记本线资源表。`BUILD_MANIFEST.json` 记TypeScript0、Creator3.8.8构建exit36/Finished、8885预览；Master真实IAB待核，不提前判接入版运行通过。
- Master r2实际浏览器导出 `deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/evidence/u01-r2-failed-export.json` 显示三处资源 `path` 仍指旧图。五新PNG字节/UUID静态核对保持成立，但运行引用失败；Client已定点改path，r3构建与浏览器重验中，r2不作最终送审身份。
- Client `BUILD_MANIFEST.json` 已更新r3 TypeScript0、Creator3.8.8构建exit36/Finished、8886预览；同文件保留r2 `FAIL_RUNTIME_ASSET_PATH`。r3实际IAB导出与画面仍待Master核，不提前判运行通过。
- r3实际定时眼睛差异框仅34×34，未呈现99×54源图比例，Client记录 `FAIL_EYE_OVERLAY_DIMENSIONS`；Sprite初始化覆盖尺寸是当前排查推断。Client定点将UITransform尺寸设置移到SpriteFrame赋值之后，r4 TypeScript0、Creator3.8.8构建exit36/Finished、781输出，8886预览；r2/r3失败留史，r4实际IAB待核。
- r4新端口差分仍近方形，未据此判视觉通过。Client追加一次性节点日志，r5/r6诊断构建；r6 TypeScript0、Creator exit36/Finished、781输出、8889预览。Master `evidence/r6-eye-diagnostics.json` 记录overlay UITransform99×54、父1536×720、SpriteFrame originalSize99×54，但近方形差分原因尚未定，不能用节点数值替代画面结论。
- Client `EYE_PIXEL_DIFF_INVESTIGATION.md` 澄清34×34仅为两个时点变化像素包围盒，不能单独证明overlay尺寸错误；r6配置完成与首帧UITransform均99×54，SpriteFrame原尺寸99×54。早期r3/r4过程失败/疑点记录保留，最终视觉是否合格待Master实图结论。
- Master `IAB_VERIFICATION.json` 已记r6实际Web 720×1280 PASS：U01五新SpriteFrame UUID加载、初始/重置/重入55项完整JSON一致（原53几何不变+两街面）；U00手动镜头左右新桥/镜像街面/前栏杆遮挡及仅双眼局部变化；U05已批布局保留，warning/error空。眼睛亮层实测节点99×54，4秒周期由代码/数值补证；目标设备性能、完整奶茶业务回归未重复测。Client/Tech最终Required与同版Review待齐，仍不提前送审新接入版。
- Tech两Required实存，`REVIEW.json` mtime09:37:49+08:00，验收原文同序PASS、专业决定APPROVED；Task `READY→IN_PROGRESS→REVIEW`。专业结论以r6实际UUID/构建/IAB及静态实现为据，未测逐帧周期、far逐项镜像编辑、目标机或完整U05回归；待Master接受内部支持。
- Client四Required与DELIVERABLE实存，交付所列19项证据路径均存在，三条Task验收原文同序PASS；Producer按当前schema实际约束核Task/Deliverable/Tech Review及已批准旧Approval均无错误，Task `IN_PROGRESS→REVIEW`。同版Master接受、冻结身份与正式用户包待落盘，新接入运行版此时尚未获用户批准。
- Master `MASTER_REVIEW.json` 接受Client三验收，`TECH_MASTER_ACCEPTANCE.json` 接受Tech专业支持。Producer逐一复算 `RUNTIME_IDENTITY.json` 所列21文件路径和SHA-256全部匹配，Master五核心HTTP身份亦已核对；新运行版准确 `v0.1-r6` 绑定 `USER_REVIEW_PACKET.md`，Client `REVIEW→USER_REVIEW`、审批 `USER_REVIEW/decided_at:null`。Tech `REVIEW→DONE`，内部审批 `PROFESSIONAL_REVIEW`；这两项不代表本版获得用户批准。
- Continuity check：本线U05布局与Art Gate2两个旧准确版本已 `DONE`，Client r6真实 `USER_REVIEW`，Tech `DONE`；FLOW三Required正在收束并送Master内部接受。无可继续却仅以 `READY/IN_PROGRESS` 占位的本线任务。原 `EXAMPLE-REVISION-CLIENT-20261015` 审批状态不变。未开展QA，未重复完整奶茶业务回归。
