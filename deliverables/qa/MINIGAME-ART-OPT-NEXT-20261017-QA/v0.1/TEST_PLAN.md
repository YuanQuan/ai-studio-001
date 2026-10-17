# 资源及适配正式测试计划 v0.1

Task：MINIGAME-ART-OPT-NEXT-20261017-QA；test_phase：FUNCTIONAL；规则：studio-workflow-v2-policy。状态：专业评审待审、具体计划待用户批准，全部执行用例 NOT_TESTED。

## 当前目标与门禁

本次由单元示例转入正式资源/功能 QA 计划，不追溯虚构编码前已有正式 TEST_PLAN。历史 Owner、Master 运行记录仅用于风险发现与复现入口，不转记 QA PASS。本计划经过 Tech 专业 Review、Master 提交并获用户明确批准后，才可执行；当前不产 TEST_REPORT、不启动浏览器、Editor、构建或修改源码。该计划批准不表示测试通过或可发布。

## 冻结输入与追溯

所有路径以仓库根目录为基准。

- 授权：deliverables/master/MINIGAME-ART-OPT-NEXT-20261017/v0.1/USER_AUTHORIZATION.json 与 SCOPE.md。
- target_ref：deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/FINAL_IDENTITY.json，SHA256 `405f33048277a7d4cd42a851fef836ca908d1a0f99d825e9a9878710d3385843`。本轮只读核对其文件身份一致。
- 该清单锁定 Main v0.5、U05 v0.3、Gallery v0.5、Resource v0.8 的源码和 Artifact；实现提交 d123c23a9861805d18ce6c766dd6c0c378823152。执行前按 current_sources 与 artifact_files 逐项核哈希，具体 Web 输出须关联 RESOURCE_STAGING_INPUT_FREEZE、PORTABLE_BUILD_EQUIVALENCE 和各 BUILD_MANIFEST，不能只用 Git commit 或“最新构建”。
- 已批准功能/视觉/适配契约：该冻结清单内 Client 主线 v0.1 FEATURE_BRIEF、U05 v0.1 FEATURE_BRIEF、Integrate Client/Gallery v0.1 FEATURE_BRIEF，以及其引用的已批准 Art/UI/VFX 版本；输入对应批准由本轮 Producer approved_snapshots 核对。执行证据逐例记录具体视觉参考、稳定资产 ID、实际路径和 UUID，不能用待审候选替换。
- 历史线索：同目录 RUNTIME_VERIFICATION.md；Tech v0.29 FINAL_V07_SUBREVIEW.json 与 v0.30 PORTABLE_EQUIVALENCE_REVIEW.json。旧 v07 的20循环与旧 v05 的38布局截图不能写成本次 QA 实测；v08仅有局部 Owner运行。正式 QA 优先直接测冻结 v08。
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
