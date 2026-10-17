# QA最终执行报告 v0.2

总体结论：**不能判整体PASS，不具备RELEASE_READY结论**。FUNCTIONAL已测范围5项PASS、9项PARTIAL、1项性能BLOCKED；后续RELEASE3项NOT_TESTED。没有已确认P0/P1；旧结算全角感叹号P2在新包完整三杯已回归关闭；现成验证设置“循环”缺字仍为P2未关闭。报告交付可Review，功能/发布门禁未被替代。

Task：MINIGAME-ART-OPT-PNG-20261017-QA；规则：studio-workflow-v2-policy。批准输入为QA v0.2计划/用例、本批USER_AUTHORIZATION、单字符FONT_PUNCTUATION_FIX_AUTHORIZATION以及F11_AUDIT_AUTHORIZATION。本轮未改代码、未改图、未引入WebP或画质档。

## 两个精确基线

旧冻结基线：v0.1 TEST_REPORT及证据保持原样；FINAL_IDENTITY SHA405f33048277a7d4cd42a851fef836ca908d1a0f99d825e9a9878710d3385843，d123c23a9861805d18ce6c766dd6c0c378823152；完整冻结仓库146/146 SHA核对；实际v08 Web/WX/TT逐文件吻合。旧38稳定布局、90完整组合图、20有效循环归属于旧基线。旧初次resize过渡截图和不等加载的批量循环均保留无效，不计PASS。

新target_ref：deliverables/client/MINIGAME-ART-OPT-PNG-20261017-CLIENT/v0.1/BUILD_MANIFEST.json SHA6402be335c95011a2a57d78affa784dc6c0981fd6e78b8341d68925e29d3bd6b。本次实测**v05实际输出** /private/tmp/minigame-art-opt-png-stage-20261017-v05/build-output/minigame-art-opt-png-20261017-client-v01-web-mobile，经HTTP8937/IAB真实操作。v06仅生产入口重现且未CLI构建，不作实测包。新三端逐文件803/823/821 hash零差异；六PNG stage/candidate字节完全相同，对reference全RGBA完全相同；稳定ID、实际路径、UUID/frameUuid与geometry见SIX_PNG_IDENTITY_RGBA。

本轮未重新运行Creator CLI；对已有获锁CLI日志/真实输出独立核身份。现成4冻结mock/compiled探针均在旧冻结仓库执行；新F11现成审计脚本SHA2f9831f3886a577688712715ad682d3ca0856b5b4b8bc7984c50ce8ba9385531本轮exit0，stdout原样留存，属于compiled+cc stub与真实config文件，非全Creator画面或GPU。

## 功能、视觉、性能

新包实际覆盖六资源可见入口、阿棠三魂、六店两轮、64游客动作/镜像/装扮关键帧、U01滚轮饱和及最大画面七方向/面板输入/重入、奶茶10阶段代表流程。8阶段完整3杯胜局（24杯）有结算图；地狱2超时与噩梦2错误/取消/确认退出分支独立保留。完整逐项结果、差异和未全测范围见CLIENT_TEST_RESULTS，不把一个短文/一个尺度/一张关键帧变成全矩阵或时序通过。

视觉：新六图的静态RGBA身份通过；可见画面未发现缺层/串图，专业风格/色彩判断仍属Art/UI。未完成全419逐视觉叠图、每新视窗全部热区、精确逐帧时序；关键帧不等录像。原90仅归旧基线，新包只补受影响AT_S3，不宣称新90全GUI复测。

性能：旧20有效循环五计数均0；新会话14条、服务恢复会话1条退出日志的moduleLeases/pendingRequests/heldDerivedFrames/moduleInflight/derivedLive均0。新包未重新跑20有效循环，明确不能外推旧20。无原生帧序列/FPS/DrawCall/heap/GPU/录像接口；60秒×3、精确冷热3次加载耗时及GPU/完整内存泄漏结论保持NOT_TESTED/单项BLOCKED。无已批数值预算也不虚构达标。

## 缺陷与运行事件

QA-PNG-001（P2）：旧v08“三杯完成！”缺U+FF01/65281。新包通过获授权ASCII33文案修复，至少完整三杯结算及后续8阶段胜局均显示“三杯完成!”，8937日志没有该全角缺字警告；关闭范围仅该标点。旧警告原样保留在v0.1。

QA-PNG-002（P2，未关闭）：现成示例验证设置的“等级/魂/魄…点击循环”触发缺“循”(U+5FAA/24490)、“环”(U+73AF/29615)。新包console 2026-10-17T14:10:02.777Z等记录；设置仍可操作，主要正式配方及结算已读可用。没有证据表明由PNG压缩引入（六图RGBA一致，相关文案未在单字符补丁范围内），不能称新图回归缺陷；本轮发现并留待用户决定，不新增字体资产。

U00第一次补验在2026-10-17T14:33:09.226Z收到status0资源下载失败，画面显式“资源加载失败/返回菜单/重试”。Master随后以正式elevated ps确认原8937服务PID不存在；无法追溯精确退出时刻，不归责产品代码。重启同一v05、同端口后仅一次恢复验证U00完整加载/返回成功，2026-10-17T14:36:08.498Z退出五计数归零。原失败console与图片保留；文件名new-final-menu.png实际是失败状态下的返回尝试，不能按文件名推断菜单成功。

## 工具、证据与清理

Creator锁3.8.8；真实IAB默认DPR1，明确宽高390×844或720×1280，原稳定矩阵6竖屏+2横屏。浏览器精确版本/UA在只读DOM scope不可得，不编造。新前半段截图116张被已有归档函数闭包写到旧目录，但均使用新唯一名、未覆盖旧文件；发现后移入v0.2，后半段按固定新目录保存并逐图sidecar记录。无sidecar的前半段以截图尺寸/文件时间/原始工具步骤及8937会话关联，不补造精确采样时间；旧v0.1索引内容不变。新索引登记各实际文件hash与有效性。

本轮UI输入已结束，QA旧tab1和恢复tab2已关闭，viewport reset。QA自启8921服务session19813已Ctrl-C正常退出；8937原Client PID已消失，恢复服务session80211已由Master停止，exit0，清理完成。CONSOLE_ALL_ORIGINS原样保留，CONSOLE_NEW_BUILD仅8937，U00_RECOVERY_CONSOLE独立tab会话。日志UTC时间与截图保存时间分开；无可靠数据不计算净制作耗时或归责。

RELEASE R01/R02/R03仍NOT_TESTED：未指定真实设备DPR2/3、安全区/胶囊、SDK账号/上传及弱网矩阵，缺环境不写N/A、不拿Web代替。报告待专业Review、用户确认与Master接受，不自行DONE。
