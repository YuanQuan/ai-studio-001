# 六PNG生产接入与QA证据技术评审 v0.3

结论：**APPROVED，限定生产接入技术及已提交证据的准确范围**。首轮身份绑定、manifest追溯、冷恢复缺依赖行动均已关闭。此批准不表示整体功能PASS、RELEASE_READY、用户批准或Master最终接受。v0.1/v0.2原始发现及执行快照保留。本轮使用授权gpt-6.1-sol low完成技术文档与只读核验，未修改Client文件、未重画、未用WebP、未加依赖、未Git。

## 生产输入与实际输出

六资源中三legacy完整画布保留，裁剪候选只进入既定bundle目标；三全画布PNG同步活动源。四个受保护既有差异、三全画布PNG及唯一milk_tea源码共8路径当前身份逐项吻合。六源meta UUID、派生原始尺寸/offset/pivot保持，原画布SHA不同于裁片reference不构成冲突。FINAL_INPUT_BINDING.json绑定八源、Client四件、最终工具及QA四件。

独立逐文件审查v05实际三端产物：803/823/821文件路径不变，各恰7项差异：六native PNG及main脚本。18份native候选SHA及尺寸全部吻合。其他全部文件原始SHA相同，含全部运行import/config JSON，证明运行UUID与几何保持。每端减少265925 bytes，六PNG贡献265923、授权字符修复贡献2；不据此推断GPU内存、DrawCall或性能改善。三份正式留存Creator日志与原日志及manifest SHA一致，含Finished，记录Creator3.8.8退出36。Web只调试；WX/TT为正式目标，但CLI成功不等于目标设备运行通过。

milk_tea_lab.ts精确唯一“三杯完成！”改为“三杯完成!”，after SHA86808200d37b4554c2e28ac33bba728232f8178cb025bc9530efa04c895a9ce5。main脚本确有改变；仅替换该唯一授权字符串、归一_RF.push脚本UUID、并对client_asset_modules execute作用域绑定做k→S,F→k,S→F名称循环后，三端严格整文件相等。未归一其他字符串、属性、控制流或跨模块标识符。见SCRIPT_DIFFERENCE.json及可复核脚本。

## 复现、生成工具与代码健康

ROOT内approved_png_base_payload.json锁667有效payload、36,266,325 bytes，SHA7f3bf66203ff90cf92233a3188f14e508c2dda4b3053d0b7eb19db7240d9f114；构建配置独立生成。v06-reconstructed实际667项与v05事后重构preimport逐路径SHA吻合，v06未CLI构建，不冒充本轮实测包。v05 preimport清单是确定性事后重构，非原现场捕获；相对baseline仅六PNG、唯一源码、三配置10项改变，无meta预改。Creator后76项meta差异（4新增、72改写），非meta无变化；运行几何由实际构建JSON字节身份独立核实。

独立选择性archive冻结d123冷恢复首次缺7张PILOT export，补齐冻结GENERATED_MANIFEST逐项列出的确切依赖后旧builder成功，667项全部匹配持久清单。最终README改为动态取全部approvedExport，与成功配方一致，缺依赖行动关闭；初始失败和成功证据均留存COLD_RECOVERY_AUDIT.json。最新工具7c52440785e740fb94dd017bf38f7fe456a8241e2e165914a7a9cb4c9fd4d33e正例及七负例8/8通过，不沿用旧工具SHA。

代码健康：沿用单一生成工具及共用身份validator；批次逻辑限六ID、固定授权、payload完整性和隔离复制，无第三方依赖、业务模块耦合或新的运行Manager。保留原入口以复现冻结输入；正式命令显式选择当前override/base-stage。当前不要求无关大重构；将来扩批须另评估批次硬编码，不自动扩本轮。

现成compiled-manifest探针仅适配路径后执行新v05真实bundle：三端419资源描述路径/type全匹配，资源/meta/模块依赖missing为0；10个WALK→RUN共享canonical为原批准别名。82派生frame reset几何及释放断言通过、live0。这是compiled代码+cc stub+真实导入meta/config受控核验，不是GPU、完整419视觉或真实平台加载验收。

## QA最终报告的边界

QA v0.2已冻结，203项EVIDENCE_INDEX原始SHA/bytes全部吻合；旧v0.1不改。旧38稳定矩阵、90完整组合图和20有效循环只归旧v08。新包6资源可见入口、64动作/镜像/装扮关键帧、U01可达缩放拖动及奶茶10阶段代表流程归实际v05 HTTP8937，未拿v06当built。8阶段完整三杯胜局与另两阶段错误/超时/退出分支分别记录，174配方GUI穷尽、全部动态精确时序、全419视觉叠图不计PASS。

QA-FUNCTIONAL为5 PASS、9 PARTIAL、1性能BLOCKED；RELEASE三项NOT_TESTED。旧全角感叹号P2由新包完整三杯和结算截图/8937日志回归关闭；验证设置“循环”字形P2保留，未改字体资产。未见证据表明该缺字由PNG压缩引入，也不宣称console clean。

独立核新8937主会话14条和恢复会话1条退出，moduleLeases/pendingRequests/heldDerivedFrames/moduleInflight/derivedLive均0；listenerCleanupCount仍NOT_TESTED，不能推断heap/GPU无泄漏或新20循环完成。旧混合FONT_FIX_CONSOLE不单独作为新回归证据。

U00 status0下载失败及page load failed原日志保留。Master核原服务进程不在，精确退出时间未知；不确证代码缺陷。重启同目录同8937后U00完整加载、返回菜单及五计数归零证据存在，工具清理已完成。不能由恢复成功倒推原错误不存在。

未测边界保留：GPU/heap/FPS/DrawCall、60秒×3、精确冷热3次加载、全时序/录像、174配方GUI、每新视窗全热区、WX/TT设备/SDK/安全区/弱网及上传限额。现有证据允许接受技术生产接入和报告真实性，不授予整体功能或发布通过。

## 冻结QA四件身份

- `deliverables/qa/MINIGAME-ART-OPT-PNG-20261017-QA/v0.2/TEST_REPORT.md`：`04e51950f0db0121896adde5c1ed7c53926e594eefa552d6f5c25e7481cb0e3b`
- `deliverables/qa/MINIGAME-ART-OPT-PNG-20261017-QA/v0.2/CLIENT_TEST_RESULTS.md`：`1e19f66c6eb1e06ccf5d5284142b33686449bbd7987da1cae0a008a35f33900e`
- `deliverables/qa/MINIGAME-ART-OPT-PNG-20261017-QA/v0.2/EVIDENCE_INDEX.json`：`fa65ba47d124c4c654b8afb02bc4f1b58e968e8d74d49475cd8eb26dd1fab8fc`
- `deliverables/qa/MINIGAME-ART-OPT-PNG-20261017-QA/v0.2/DELIVERABLE.json`：`d39b7305c7af495aed710b05eb71506eabc5da8115acc91302fe9a0dd32d3786`
