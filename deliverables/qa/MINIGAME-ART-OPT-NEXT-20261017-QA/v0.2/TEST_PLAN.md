# 资源及适配正式测试计划 v0.2

Task：MINIGAME-ART-OPT-NEXT-20261017-QA；test_phase：FUNCTIONAL；规则：studio-workflow-v2-policy。状态：专业评审待审、具体计划待用户批准，全部执行用例 NOT_TESTED。

## 当前目标与门禁

本次由单元示例转入正式资源/功能 QA 计划，不追溯虚构编码前已有正式 TEST_PLAN。历史 Owner、Master 运行记录仅用于风险发现与复现入口，不转记 QA PASS。本计划经过 Tech 专业 Review、Master 提交并获用户明确批准后，才可执行；当前不产 TEST_REPORT、不启动浏览器、Editor、构建或修改源码。该计划批准不表示测试通过或可发布。

## 冻结输入与追溯

所有路径以仓库根目录为基准。

- 授权：deliverables/master/MINIGAME-ART-OPT-NEXT-20261017/v0.1/USER_AUTHORIZATION.json 与 SCOPE.md。
- target_ref：deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/FINAL_IDENTITY.json，SHA256 `405f33048277a7d4cd42a851fef836ca908d1a0f99d825e9a9878710d3385843`。本轮只读核对其文件身份一致。
- 该清单锁定 Main v0.5、U05 v0.3、Gallery v0.5、Resource v0.8 的源码和 Artifact；实现提交 d123c23a9861805d18ce6c766dd6c0c378823152。执行前按 current_sources 与 artifact_files 逐项核哈希，具体 Web 输出须关联 RESOURCE_STAGING_INPUT_FREEZE、PORTABLE_BUILD_EQUIVALENCE 和各 BUILD_MANIFEST，不能只用 Git commit 或“最新构建”。
- 已批准功能/视觉/适配契约：该冻结清单内 Client 主线 v0.1 FEATURE_BRIEF、U05 v0.1 FEATURE_BRIEF、Integrate Client/Gallery v0.1 FEATURE_BRIEF，以及其引用的已批准 Art/UI/VFX 版本；输入对应批准由本轮 Producer approved_snapshots 核对。执行证据逐例记录具体视觉参考、稳定资产 ID、实际路径和 UUID，不能用待审候选替换。
- 历史线索：deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RUNTIME_VERIFICATION.md；Tech v0.29 FINAL_V07_SUBREVIEW.json 与 v0.30 PORTABLE_EQUIVALENCE_REVIEW.json。旧 v07 的20循环与旧 v05 的38布局截图不能写成本次 QA 实测；v08仅有局部 Owner运行。正式 QA 优先直接测冻结 v08。
- environment_ref：本目录 ENVIRONMENT_INVENTORY.json；具体用例：CLIENT_TEST_CASES.md。

## 阶段矩阵

|阶段|范围|当前可测性与边界|
|---|---|---|
|FUNCTIONAL|固定实际 Web 输出，六页面×320×568、360×640、390×844、414×896、412×915、720×1280；U04原两横屏依旧矩阵锁定|DPR1为已有能力线索；正式执行需逐次记录实际 DPR、Canvas 矩形及缩放，不能写成设备结论|
|FUNCTIONAL|受控 safe/capsule 缺失/裁切、letterbox、零窗口恢复、取消/迟到/失败重试|通过已有受控测试入口隔离验证坐标和生命周期；模拟不替代真实平台，无权限可用入口则单项 BLOCKED，交Master协调，不改代码|
|FUNCTIONAL|动作、店铺、90对话状态、奶茶、419路径、派生帧、20重入、Web性能和包体|按用例执行；性能工具可用性在执行前确认，缺指标如实 NOT_TESTED|
|RELEASE 后续|DPR2/3、真实刘海/底部手势/capsule、微信/抖音开发工具、真机纹理/性能/生命周期、实际弱网|当前 NOT_TESTED，需明确候选包、设备/容器版本与平台范围；不作为本次固定Web FUNCTIONAL的隐藏阻塞，也不授予设备采购或上传权限|

DPR2/3若现有工具能真实设置并读回，可在 FUNCTIONAL补充桌面模拟结果，仍不能替代RELEASE设备项；DPR1截图不可改标签冒充。无Server改动，不建Server用例；不扩展支付、广告、账号/CDN与未批准玩法。受控加载取消属于功能异常测试，真实限速/断网不在当前执行范围。

## 性能、包体与判定

PERFORMANCE_BUDGET.md v0.1仍待批准且仅指DEMO-001，55 FPS、p95 20ms、5秒不作为本批阈值。当前适用硬检查为退出后moduleLeases/pendingRequests/heldDerivedFrames/moduleInflight/derivedLive归零，20循环无持续资源增长；节点/监听器/计时器能可靠观测时同步记录，不能把上述五项归零当作完整内存/GPU无泄漏证明。

本计划建议同批批准以下测量口径：固定Web机器、浏览器版本、DPR、viewport、同一冻结输出；U00初态、U01最大/最小缩放持续拖动、U02动作镜像切换、U03六店轮换、U04对话切换、U05配方交互各稳定后采样60秒、3轮；冷/热加载各3次记录请求到首帧齐备可操作耗时。保存帧时间原始序列/p50/p95/p99、FPS、DrawCall平均/峰值、JS heap曲线及可得GPU纹理量。未有批准数值预算的项只给实测及差异，不判数值达标；Tech Review需明确观测指标是否足够，必要数值验收若仍未定则性能结论保留NOT_TESTED/BLOCKED，不汇总整体PASS。GPU不可读时列不可测及纹理字节估算，绝不以heap代替GPU。

包体逐relative路径计量并核hash：最终历史Web 38,670,790/WX 38,707,433/TT 38,681,779字节仅作对照，启动根包须注明八分包排除规则。物理输出大小不等于上传包/平台限额通过；20MiB与20MB分别标单位，平台限额待开发工具和账号验证。禁止为通过删内容、改画质或远程托管。

## 证据及退出要求

每例记录ID、阶段、状态、build/源码/资源/配置身份、工具和浏览器版本、实际viewport/DPR/缩放、步骤、期望/实际、截图/短录屏/日志路径、异常及缺陷ID。视觉对照保持同背景同视窗同显示尺度，颜色、透明边、脚点和镜像以冻结批准图为准；差异图仅发现问题，最终专业视觉判断保留Art/UI职责。截图不代表GPU采样或真机通过。

执行报告分别列功能、视觉、性能、NOT_TESTED和BLOCKED；P0/P1阻塞对应验收，P2显式列出由用户确认；不擅自确定尚未批准的严重度新边界。不具备必要证据不能报告整体PASS。Test计划本身需Review与用户批准，QA结果仍需后续用户确认和Master接受。

## 版本变化后的重验触发

六件压缩样本只获Gate1，未获具体效果Gate2且未正式接入；不消费候选图，不改变当前baseline。未来批准且接入后，必须核资源/UUID/映射和构建新身份，重验419路径、全RGBA/透明边/颜色/脚点/镜像、同尺度画面、20释放、加载/包体/纹理兼容和性能；由Master评估影响范围，不无条件继承旧结果。

## v0.2 技术修订与实际入口（只读盘点，未执行）

F05分页面判定：U00 cover拖到两端不得出现非预期露底/接缝；U01使用获批完整画布contain，letterbox是设计结果，不以消除留白为验收目标。U01相机/编辑层与面板分别操作，重点检查面板不抢输入和首次关闭。

冻结执行副本约束：批准后先由Master协调准备完整冻结v08源码/资源副本，逐项核FINAL_IDENTITY current_sources及artifact_files，并核PORTABLE_BUILD_EQUIVALENCE的Web逐文件清单，保存副本路径、Node版本、脚本SHA与build清单SHA。以下入口只能在核验副本运行，不读取活动workspace。相对cwd入口须以副本为cwd；__dirname入口须保留副本内原目录。现存compiled探针硬编码v08临时路径：只能当该路径仍存在且每个输出hash等于冻结清单时直接用；否则该探针BLOCKED交Master，不自行替换路径、注入hook或用其他编译产物冒充。脚本与输入副本身份核验失败也BLOCKED。下列命令均为将来批准后的命令，本轮没有执行。

1. F04/F12源级受控入口：`node deliverables/client/MINIGAME-ART-OPT-BATCH-20261017-CLIENT/v0.4/evidence/framework-contract-tests-v0.4.cjs`。脚本以process.cwd读取module_assets.ts、viewport_mapper.ts、viewport_adapter.ts，经Creator附带TypeScript转译。输入是脚本内mock loader/window/微信API、safe/capsule矩形、resize/零尺寸及拒绝Promise、多owner/取消/逆序释放；输出JSON result/leases/viewport和断言退出码。属于源级mock契约，不能证明Creator实际渲染、微信SDK或真机DPR。脚本旧版本名称不代表源旧版本：将来必须绑定副本当前冻结TS哈希，不能继承旧输出。
2. F11/F12补充入口：`node tests/client/asset-integration/asset_integration.test.cjs`，可选参数为已核身份的staging根目录。__dirname定位仓库根，现存脚本身份已纳入FINAL_IDENTITY。用伪SpriteFrame/cc与TS转译检查派生帧和生命周期，属于source/mock，输出断言/检查日志，不当浏览器画面或GPU结果。
3. F12实际compiled方法入口：`node deliverables/tech_lead/MINIGAME-ART-OPT-BATCH-20261017-TECH/v0.30/creator-u04-method-probe.cjs`。读固定v08 Web的assets/main/index.js、src/chunks/bundle.js、assets/internal/index.js；提取实际编译的U04方法，以stub cc/可控Promise驱动重入、supersede、退出和当前失败，期望PASS文本及退出码0。实际compiled方法+模拟宿主，不是Creator运行渲染/浏览器/真机。脚本绑定的root为`/private/tmp/minigame-art-opt-integration-final-v0.8-portable/build-output/minigame-art-opt-integration-final-v0.8-portable-web-mobile`。
4. F12 compiled补充：`node deliverables/tech_lead/MINIGAME-ART-OPT-BATCH-20261017-TECH/v0.30/creator-compiled-probe.cjs`，同上固定root/三个输出文件；输入Map迭代、重复module ID、loading entries、取消operation；期望JSON actualCreatorBundle=true及去重/取消等断言满足。仍是compiled+stub，不是完整运行。

F04模拟覆盖以脚本实际断言为准，未被这些入口覆盖的特定方向/裁切组合列NOT_TESTED或单项BLOCKED，不能宣称全部坐标矩阵通过。F12实际早退由内置浏览器点击冻结Web执行并保留画面及日志，受控失败与迟到由上述入口覆盖；两类结论分列。

F14采样来源和缺口：目前本轮没有确认可用的DrawCall、GPU、heap峰值采样接口，也没有确认可导出浏览器帧时间序列的工具。不得临时注入requestAnimationFrame/performance hook或把截图时间当帧时间。已有RUNTIME_VERIFICATION及browser-integration-v07/CONSOLE.json、DISPOSAL_RESULTS.json只提供历史资源计数线索；未来只读采集冻结Web现有[ModuleAssets]/session释放日志可用于F13五项计数，不能当F14帧时间/DrawCall/GPU/heap。未来批准后先查看现有工具原生能力：如能原生导出trace则记录来源/原始文件和精度，按原口径采样；如无接口，各对应性能项保持NOT_TESTED/单项BLOCKED并交Master协调，不能杜撰60秒序列。必要性能结论未形成不能报性能PASS，但已完成的功能子项独立报告，不因未批数值目标自动否定全部功能。

本轮变更仅修期望、路径和可执行性，没有正式测试、没有新增Server或RELEASE范围。历史运行文档准确路径为`deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/RUNTIME_VERIFICATION.md`。原横屏矩阵为`deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v05/matrix.json`，U04两横屏1280×720与844×390。
