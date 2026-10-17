# 冻结旧基线 QA 执行报告 v0.1

当前结论：已完成并提交本轮可复核执行结果，整体 **不能判PASS**；必要性能指标单项BLOCKED，多项用例存在未覆盖子项。未发现已复现P0/P1，发现1个P2字体覆盖警告。报告仅针对冻结旧v08；新六PNG和一字符修复的补充QA将独立登记，不能从本报告继承通过。

Task：MINIGAME-ART-OPT-PNG-20261017-QA；test_phase：FUNCTIONAL；规则：studio-workflow-v2-policy。输入为用户批准QA v0.2 TEST_PLAN/CLIENT_TEST_CASES与本批USER_AUTHORIZATION；旧计划文件中“待批”是历史版本描述，具体执行授权以本批记录为准。此报告待专业Review和用户确认，不授予发布权限。

## 身份与方法

target_ref：FINAL_IDENTITY.json SHA256 405f33048277a7d4cd42a851fef836ca908d1a0f99d825e9a9878710d3385843；来源实现d123c23a9861805d18ce6c766dd6c0c378823152。完整只读冻结仓库 /private/tmp/minigame-png-qa-frozen-repository-20261017，本轮独立核146/146源/Artifact哈希一致，保护活动workspace差异。4现成探针以该cwd运行，未改脚本，各exit0；source/mock、compiled/stub与真实浏览器结果分别记载。

实际Web来自 /private/tmp/minigame-art-opt-integration-final-v0.8-portable/build-output/minigame-art-opt-integration-final-v0.8-portable-web-mobile。按PORTABLE_BUILD_EQUIVALENCE逐文件清单，本轮核Web803、WX823、TT821文件零差异。Web38,670,790，WX38,707,433，TT38,681,779字节。本轮没有重新CLI构建，构建证据为冻结已建产物与已锁日志的独立身份核验，不把历史Owner运行计成本轮QA。

真实HTTP/IAB、DPR1、六页面六竖屏和两横屏稳定38截图；90现成UI巡检及90无遮挡完整组合图；20个有效完整加载循环和退出日志；奶茶简单阶段完整三杯。截图与原console原UTC时间分别保留。执行开始/结束边界以证据首末时间为准，不把文件整理时间混成浏览器运行时间。工具局限详BROWSER_TOOL_LIMITS。

## 分项结论

身份/包体/现成受控入口的已测断言通过；20有效循环的moduleLeases/pendingRequests/heldDerivedFrames/moduleInflight/derivedLive均0。36竖屏+2横屏稳定初态无明显阻断裁切，U01获批contain留白保留；未逐尺寸穷尽所有热区。90组完整画面检查未见缺层/人物错配，不能代替Art颜色/风格专业判断、全RGBA同尺度叠图或长文测试。四动作仅关键帧，未完成全部装扮镜像与动态时序验收。完整细分见CLIENT_TEST_RESULTS，未完成项不写PASS。

性能：五计数归零的资源契约已测；帧时间、FPS、DrawCall、heap、GPU、60秒×3、精确冷/热耗时未测/单项BLOCKED。没有批准数值预算的项也不虚构达标。RELEASE三项NOT_TESTED，缺设备/账号/SDK/弱网工具不记N/A。

缺陷P2 QA-PNG-001：旧冻结v08完成简单阶段三杯时，console 2026-10-17T13:20:25.613Z 出现“[U05 BMFont] 未覆盖字形：！”（U+FF01/65281），来源assets/main/index.js；冻结milk_tea_lab.ts:1007标题“三杯完成！”；正式FNT无65281且存在ASCII33。证据U05-three-cups-complete.png、CONSOLE.json。功能三杯已完成；字体兼容文案由Master协调，旧报告保留警告，新包需完整三杯回归，不因源码修改自动关闭。

## 证据有效性

初始矩阵同调用resize/capture产生过渡布局，整组不计PASS，已跨独立工具调用重采stable38并看联系表。初始批量循环未等完成加载，20尝试不计有效；有效循环另为VALID_CYCLES及generation13~32，联系表20张均完整页面。没有将历史v07循环、旧v05截图或Owner报告转写本轮结论。无真实录屏接口，使用关键帧和console，视频项保留局限。

下一步为Master协调新PNG精确产物身份及补充影响范围；原基线未覆盖的完整动作时序/组合、极限缩放、全热区矩阵、完整配方/异常、专业逐RGBA及必要性能仍须显式保持未测，不能以本报告认定功能全验收或RELEASE_READY。
