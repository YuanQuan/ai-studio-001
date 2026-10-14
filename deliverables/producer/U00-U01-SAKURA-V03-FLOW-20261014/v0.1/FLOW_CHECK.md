# U00/U01 共享樱花 v0.3 环境接入流程核对（进行中）

- 用户2026-10-14明确：“好的，继续推动后面的工作，让U01和U00可以使用这套新的资源，之前的不要了”。Master在 `deliverables/master/U00-U01-SAKURA-V03-INTEGRATION-20261014/v0.1/USER_AUTHORIZATION.json` 固定五项准确文件SHA，Producer本轮逐项复算吻合；Art v0.3 独立Gate2记录 `ARTIFACT_APPROVAL_GATE2_v0.3.json` 为 `USER_APPROVED`。原用户消息精确时刻未知，Master可信执行起点为10:16:11 +08:00。批准具体18切片/重组及U00/U01单元示例接入、旧活动环境退役；六店游客、其它示例功能和历史证据保留，不新增生图。
- 截至10:23:50 +08:00，Master建Tech、Client、Producer三Task。Art旧任务 `USER_REVIEW`但现行审批与独立Gate2均已`USER_APPROVED`；Master最终接受文件尚待，Art Task不提前`DONE`。Producer本文件是本Task首份Required，FLOW可从READY进入IN_PROGRESS；Tech首份`TECH_DESIGN.md`及Client首份`FEATURE_BRIEF.md`尚待实存，均保持READY。
- 下游接入以已批准v0.3切片为正式输入。Client须给18资源同字节、43初始实例、真实UUID、共享U00/U01资源/数据、旧活动引用审计和退役、Creator3.8.8导入构建、本地HTTP内置浏览器画面/操作证据；未实际验证项不能写PASS。此为单元示例，Owner自行验证，不增加QA任务或发布结论。Client最终具体版本待用户审核前不能标DONE。
- 本轮只监督流程与资源登记；其他U05等并行会话改动保留，日志/看板仅以独立U00-U01-SAKURA-V03-FLOW-20261014标记更新。结束时补continuity与可核起止复盘，不用跨轮等待冒充制作耗时。

- 10:25:26核Tech首份Required `TECH_DESIGN.md`非空，Tech READY→IN_PROGRESS；Client首份Required仍待。此时Tech文字预案不等于资源已导入或运行已验。

- 10:25:52核Master `deliverables/master/U00-U01-SAKURA-V03-INTEGRATION-20261014/v0.1/ART_MASTER_ACCEPTANCE.md`实存，明确已重算PSD/ZIP身份、Art Required/用户Gate2批准齐并接受Art制作交付；Art Task现DONE。仅完成美术资源，不冒充Client接入或运行通过。

- 10:27:02核Client首份Required `FEATURE_BRIEF.md`非空，Client READY→IN_PROGRESS。后续修改前的备份/hash、资源导入、43实例映射、旧引用审计、Creator构建与内置浏览器真实操作均待各自实证，不能以开工替代。

- 10:35:34只读核 `apps/client/assets/resources/sakura_v03/` 中18张PNG与已批准Art `CUT_MANIFEST.json`逐SHA同字节，且18个对应`.png.meta`文件实存。此是工作树复制/候选元数据的静态证据，不等于Creator已导入、真实UUID有效、场景引用已改、构建或运行通过；Client正式RESOURCE_IMPORT_MANIFEST仍待。

- 10:44:33据Master本轮明确消息：Client已通过正规提权环境执行Creator CLI，终端显示Finished in35s并退出码36；此前受sandbox SIGABRT/LaunchServices影响的尝试非当前BLOCKED。Client真实构建日志、当前Web产物身份、加载和HTTP/IAB证据正在核，Producer尚未据文件判构建完整PASS。Master同时通报Tech静态18资源同字节/43布局/54UUID独立一致，正式Tech记录待提交后再核；旧环境未物理删除。

- 10:46:58核刚落盘的Client `evidence/creator-final-stdout.log`：有`build task(web-mobile) in 9224`，之后Creator metric `collectCompsFromScene`抛`TypeError: Cannot read properties of null (reading constructor)`并告警`Missing class: 9e547Ys0ktFGYIectTcx+4S`。虽前述CLI退出码36，完整构建/当前输出可用性不能据此判PASS；已向Master报告，待Client定位组件/类与HTTP加载证据。此为进行中诊断，不直接判无法恢复BLOCKED。

- 10:48:43核Client `RESOURCE_IMPORT_MANIFEST.json`18项：每张Client PNG与批准Art文件SHA逐一同字节；对应Creator 3.8.8 `.png.meta`均写`imported:true`，image/Texture2D/SpriteFrame 54个UUID与清单逐一吻合且互异。这是资源导入身份静态证据；场景43实例、实际构建后置异常及浏览器操作仍待，不据此退役旧环境。共享资源登记的Client接入段尚待Owner回填。

- 10:50:05更正首次Creator结果归属：Master实际打开该次Web产物，显示旧LanternPilot单奶茶场景，Owner使用了错误默认profile入口；因此前述Finished in35s/exit36只证明一次错误入口构建，不能作为U00/U01成功运行。切换正确UnitSamples隔离重建又发现并发U05脚本三组件注册失败。Master已将必要入口修复写入授权文档/Task note，U05 Owner自行拆独立TS，Client仅同步最新源并做onExit兼容及清理U04无效字段的最小类型修复，正在重新构建。Client保持真实IN_PROGRESS，旧活动环境不清理；HTTP/IAB正确入口验证待。

- 10:53:28核Client新 `evidence/creator-final-unit-entry-stdout.log`：正确UnitSamples入口构建脚本记录U05BitmapText/U05MilkTeaLab/U05NineSlicePlate三个组件注册，Web Mobile build task六秒结束；同日志仍有build-script SIGTERM。只记重建产物进展，HTTP/IAB实际U00/U01画面与操作、异常性质待实核，旧活动环境暂留。

- 10:56左右核Client `evidence/STATIC_VALIDATION.json`列18同字节PNG、43初始实例、镜像几何/稳定ID、五层Prefab直接节点及U00/U04共享填充等为PASS_STATIC；`LEGACY_RETIREMENT_AUDIT.md`列旧五层/U01目录与脚本无活动引用，同时明确旧物理文件暂留待正确入口IAB U01/U04实际验证。`NON_TARGET_PRESERVATION_CHECK.md`记录U05并发保护。静态结论不冒充运行PASS或退役完成。

- 11:00左右核Client新 `RUN_VERIFICATION.md`与`IMPLEMENTATION_REPORT.md`：Master正确入口IAB已留U00新版街景初屏截图、U01 43环境+6店初始JSON；初版导出Texture2D UUID因Creator动态图集为空，Client源码已改用实际导入meta的UUID。该源码修正发生在当时8776构建之后，须最终重建并逐一复核18项导出UUID；完整编辑操作、U04/其它示例及旧环境退役尚待。

- 11:05左右核Client更新的 `RUN_VERIFICATION.md`：Master IAB截图/JSON支持U00竖屏六店游客及街栏链、U01 43环境+6店基线、各原型添加、拖缩镜像删除、分页到43、相机、重置返回重入等初验；横屏现有布局遮部分画布，明确未全面适配。`RETIREMENT_CANDIDATES.json`列34项旧文件仍WAITING_MASTER_RUNTIME_GATE，U04/相机边缘和textureUuid最终重建待，不将初验记成全项通过。

- 11:12左右核Client `SPRITEFRAME_TRIM_AUDIT.json`：18张SpriteFrame中16张Creator自动trim，raw尺寸与源一致。更新`STATIC_VALIDATION.json`新增共享U00/U04及U01的trim安全初始化、JSON导出采用meta textureUuid两项静态PASS；Master左边缘候选图已实存。修正后Creator重建/IAB边缘效果仍待，不凭静态结论提前退役。

- 11:28左右独立解析Master IAB `evidence/u01_trim_fixed_export.json`：schema `U01_SAKURA_LAYOUT_V0_3`、18 prototypes、49 instances（43环境+6店），18项image/Texture2D/SpriteFrame UUID全非空，18 SHA与54 UUID均与Client `RESOURCE_IMPORT_MANIFEST.json`逐项相同。此消除初版运行UUID空值问题；边缘/旧物理资源退役及最终回归仍待。

- 11:27:42 +08:00 Master明确8787 IAB初验PASS并放行：U00 left/right_edge_trim_fixed、zoom_upper_limit、street_hidden/environment_only、guest_count_2、调整导出与390×844；U04阿炭+微笑对话；U01 trim_fixed基线43环境+6店与18×3 UUID全非空。Client现可退役已审计的34旧活动环境文件并做最终构建；退役实际文件、最终build与重入导出待，不能提前USER_REVIEW/DONE。

- 11:28左右核Client `RETIREMENT_CANDIDATES.json` 34项均 `RETIRED_AFTER_MASTER_IAB_PASS`，Producer逐路径检查活动工程34/34已不存在；历史母版与修改前备份非退役范围。旧`LEGACY_RETIREMENT_AUDIT.md`仍写暂留，需Owner更新最终审计，终版build/IAB回归待。

- 11:31左右核Client更新`LEGACY_RETIREMENT_AUDIT.md`：34旧活动文件按原SHA、无外部UUID引用精确退役；稳定Prefab/五层节点、六店游客与历史母版保留。最终`BUILD_MANIFEST.json`指显式UnitSamples入口、Creator3.8.8 Web Mobile5秒构建完成、733输出文件、HTTP8787状态200、16源身份同快照且差异空；`final-build/creator-web-mobile.log`存CLI清理SIGTERM，Owner依既有退出模式解释。退役后Master重入与18UUID复导出待。

- 11:35左右独立解析Master退役后终版 `u01_final_post_retirement_export.json`：schema v0.3、18 prototypes、49实例=43环境+6店，18 SHA/54三类UUID逐项与Client `RESOURCE_IMPORT_MANIFEST.json`相同且非空；终版U01实图也实存。完整Master运行结论、Tech Review及Client正式DELIVERABLE与Task原文对齐待，不抢记USER_REVIEW。

- 11:44左右核Tech三Required实存：`DELIVERABLE.json` 11项索引路径全实存，六项验收与Task原文同序PASS，`REVIEW.json` APPROVED；Tech Task IN_PROGRESS→REVIEW，待Master内部接受后才记DONE/PROFESSIONAL_REVIEW。Client最终成品仍未用户批准。

- 11:49左右核Client五Required全实存、`DELIVERABLE.json`13索引均按版本目录/项目根实存，六项Task验收原文同序PASS；`RUN_VERIFICATION.md`已收退役后U00/U01/U04及U02/U03/U05入口smoke、终版导出与空warning/error，目标机/GPU/DrawCall仍NOT_TESTED。Tech Review APPROVED；Client Task IN_PROGRESS→REVIEW，待Master最终接受及具体版审批绑定，不提前USER_REVIEW/DONE。

- 12:05:51 +08:00 Master `MASTER_ACCEPTANCE.md`正式接受Tech内部支持及Client六项PASS；`FINAL_IDENTITY.json`九项SHA由Producer逐项复算0差，终版build main SHA b55009be…c66227，`USER_REVIEW_PACKET.md` SHA ff52b2c3…e9af。Tech REVIEW→DONE/PROFESSIONAL_REVIEW；Client REVIEW→USER_REVIEW，准确现行Approval指该具体packet、review_ref Master接受、decided_at null。Art v0.3先前批准不代替当前接入运行效果用户决定，Client非DONE；目标机未测、单元示例无QA。

- 12:11:30 +08:00最终精确退役数量更正：先按`RETIREMENT_CANDIDATES.json`列出的34项原候选逐SHA/引用审计退役；之后Client确认旧目录已空且无引用，再移除该1个空目录及169字节目录meta，合计35个文件+1空目录。Client `LEGACY_RETIREMENT_AUDIT.md`与清单列原候选和追加目录meta SHA；此前各节点“34候选”是阶段性准确事实，不代表最终总清理数。

- 12:11:30 +08:00 Master `FLOW_MASTER_ACCEPTANCE.md`正式接受Producer三Required、六Task原文验收PASS及13索引；FLOW REVIEW→DONE/PROFESSIONAL_REVIEW。精确退役总数35文件（原34候选+1目录meta）和1空目录。Client准确v0.1仍USER_REVIEW、decided_at null、待用户对运行画面及编辑效果决定，非DONE；无本线READY/IN_PROGRESS空转，QA/目标机未测。
