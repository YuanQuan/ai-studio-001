# 客户端本轮测试结果 v0.1

Task：MINIGAME-ART-OPT-PNG-20261017-QA；阶段：FUNCTIONAL。PARTIAL/PASS_WITH_LIMIT为报告覆盖标签，不是任务状态；任何未覆盖子项均NOT_TESTED。未以复合标签改写批准期望。

|用例|结论|本轮实际及局限|证据（同目录）|
|---|---|---|---|
|QA-F01|PASS|冻结146/146源/Artifact、Web803文件全hash吻合；6模块实际进入/返回。|FROZEN_SOURCE_IDENTITY.json、OUTPUT_IDENTITY.json、VALID_CYCLES_CONTACT.png|
|QA-F02|PARTIAL|6×6稳定页面截图完成，DPR1，真实Canvas矩形读回；本轮未在每个尺寸逐一完成所有拖滚/按钮组合，不能汇总全交互PASS。|stable-*.png、BROWSER_EVIDENCE.json|
|QA-F03|PARTIAL|两横屏稳定U04页面已采；横屏下人物/表情/背景逐项切换未全覆盖。|stable-U04-1280x720.png、stable-U04-844x390.png|
|QA-F04|PARTIAL|冻结源现成契约探针exit0，包含safe/capsule/fallback/零窗口等实际断言；未覆盖方向/裁切的所有组合。属于SIMULATED。|PROBE_EXECUTION.json 第1项|
|QA-F05|PARTIAL|U01面板真实拖动后首次关闭成功；U00/U01七方向拖动留图，U01contain留白；最大/最小缩放未可靠确认到契约边界，滚轮尝试不冒充成功。|U01-first-close.png、U00-drag-*.png、U01-camera-*.png|
|QA-F06|PARTIAL|U02四动作按钮已实点及关键帧留图；全装扮×左右镜像/逐帧时序未完成，关键帧不替代视频。|U02-walk/run/happy/sad.png|
|QA-F07|PARTIAL|六店两轮12次真实切换并留图；映射加载无异常；缩放和同尺度批准稿逐RGBA专业视觉对照未完整执行。|U03-shop-0至11.png、CONSOLE.json|
|QA-F08|PASS_WITH_LIMIT|现成UI巡检90/90零失败；6人物×3阶段×5表情另逐组点击并关闭面板，保存90完整画面，三联系表复核未见缺层/串人物。仅示例短文，长文不在本结论；最终风格/色彩专业判断仍归Art/UI。|U04-sweep-90-complete.png、U04-full-*.png|
|QA-F09|PARTIAL|normal/loading/disabled/selected可达状态已观察；U01关闭和奶茶配方代理上下按钮可用。未发现可达长文，长文实图滚动NOT_TESTED；pressed瞬态及error真实画面未全覆盖。|U01-panel-after-drag.png、U05-cup1-selected.png、PROBE_EXECUTION.json|
|QA-F10|PARTIAL|简单阶段真实完整3杯成功：幽灯+霜铃+鬼火、月雾+霜铃+鬼火、幽灯+云魄+鬼火，最终三杯完成/熟练度+10。未穷尽174配方/5难度及所有错误重复取消分支；发现P2字体警告。|U05-recipe1/2/3.png、U05-three-cups-complete.png、CONSOLE.json|
|QA-F11|PARTIAL|已核冻结资源路径身份，现成资产入口本轮确认419 runtime paths、83 source rows及派生几何/共享释放/源不可变/bad hash rejection。未产完整419逐项视觉叠图/每UUID导入行审计；不能用旧Tech审计替成本轮QA。|PROBE_EXECUTION.json 第2项、OUTPUT_IDENTITY.json|
|QA-F12|PASS_WITH_LIMIT|实际U04 loading早退→稳定菜单→重入完整画面；源mock及compiled/stub失败、迟到、owner、取消等4入口均exit0。两类证据分开，不是弱网。|U04-early-exit-*.png、U04-after-early-reentry.png、PROBE_EXECUTION.json|
|QA-F13|PASS_WITH_LIMIT|20有效循环截图均完整加载；20独立generation13~32退出日志五计数全零。早期批量20尝试未等加载，全部不计有效循环。heap/监听器/GPU未知，不据此宣称完整无泄漏。|VALID_CYCLES.json、RELEASE_COUNTS.json、VALID_CYCLES_CONTACT.png；无效CYCLES.json另存|
|QA-F14|BLOCKED|浏览器公开能力仅viewport/visibility、截图、DOM、console，无原生trace/录像/帧时间/DrawCall/heap/GPU接口；不注入hook。60秒×3序列与冷/热3次精确首帧耗时未测，不能性能PASS。|BROWSER_TOOL_LIMITS.md|
|QA-F15|PASS_WITH_LIMIT|三端逐relative路径计量hash零差异；WX根3256025、TT根3230374字节，按8分包root排除。上传/平台限额未测。|OUTPUT_IDENTITY.json、PACKAGE_MEASUREMENT.json|

QA-R01/R02/R03：均NOT_TESTED。无指定设备/小游戏开发工具/账号/实际弱网矩阵，本轮未执行RELEASE，不记N/A，不作为固定Web的隐藏失败。

90组的文件名使用UI位置标签，实际配置key以画面显示为准：mt=MT、at=AT、tan=AC、jiao=AJ、deng=AD、mian=XI。三个阶段s0/s2/s3，表情happy/surprise/sad/smile/angry。90完整图均关闭覆盖面板后采，原90面板图仅作输入过程。稳定矩阵只认stable前缀38张；初次矩阵重采因resize时序无效，不作为缺陷或PASS依据。
