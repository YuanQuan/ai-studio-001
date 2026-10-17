# 客户端与视觉用例 v0.2

Task：MINIGAME-ART-OPT-NEXT-20261017-QA。以下全部为设计，执行状态统一 NOT_TESTED。F为当前 FUNCTIONAL，R为后续 RELEASE。P为执行优先级，失败严重度仍按批准规则逐项判定。

共同前置：具体 TEST_PLAN 用户批准；目标 Web 输出/源码/资源按冻结 FINAL_IDENTITY 及其 BUILD_MANIFEST 核验；固定环境、配置、语言、字体及实际 viewport/DPR/缩放。每项记录实际结果、构建身份、证据路径和缺陷ID。期望不是执行结果。追溯输入的完整路径见 TEST_PLAN。

|ID/优先级|追溯|可执行步骤|期望|证据|
|---|---|---|---|---|
|QA-F01 P0|冻结清单/主线Brief|逐文件核源码及Web哈希；经loopback HTTP打开入口；六模块进入返回|身份吻合、无缺失/错误，菜单入口均可到达|hash清单、console、六页面截图|
|QA-F02 P1|主线Brief/旧matrix|六模块逐320×568、360×640、390×844、414×896、412×915、720×1280；点按钮，拖滚菜单/面板到边界，关闭返回|内容和热区一致，无阻断裁切；320奶茶可达；拖动不误点|36页面截图、手势视频、实际DPR及Canvas矩形|
|QA-F03 P1|deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v05/matrix.json|固定1280×720、844×390两横屏并落盘；逐尺寸进入U04，切人物/背景/表情及返回|符合原获批布局和热区，重入不残留|矩阵引用、两尺寸截图/视频|
|QA-F04 P1|主线Mapper契约|用已有隔离受控入口检查letterbox、画布原点、safe裁切/capsule合并、缺失fallback、零窗口恢复、方向变化|四角/触点转换正确，无NaN；缺失按契约诊断；模拟不代表设备通过|受控输入输出/诊断，标SIMULATED|
|QA-F05 P1|U01/Gallery冻结图|最大/最小缩放、两端及七方向拖动；面板拖后第一次关闭，再拖后点下一层；返回重入|U00 cover无非预期露底/接缝；U01已批contain留白不算缺陷，场景无非预期跳变；面板相机不抢输入，按钮首次生效；遮挡/层级正确|边界截图、视频、输入记录|
|QA-F06 P1|游客批准资源/动作|逐游客及装扮执行四动作，左右镜像，拖面板不装备，返回重入|帧顺序/时序/挂点正确、脚点稳定、镜像无漂移缺层、无误装备|四动作关键帧/视频、组合清单|
|QA-F07 P1|六店冻结图/配置|全部六店按批准顺序轮换两轮，切换缩放返回重入|店/招牌/透明边/颜色匹配对应批准版本，无串店残留|六店同尺度截图、ID/映射|
|QA-F08 P1|U04冻结状态集合|从配置导出90个唯一组合编号；逐组合检查人物表情气泡文字，重复切换关闭|90组合无缺漏串图；短文不能证明长文滚动|90行状态结果及日志/关键截图|
|QA-F09 P1|文本面板/UI状态|测试现有可达normal/pressed/disabled/loading/error；有溢出文时拖滚到底反向，关闭重开|状态/方向/边界按批准规格；无可达长文则实图NOT_TESTED，已有受控测试仅覆盖方向|状态表、视频、受控证据及缺口|
|QA-F10 P1|U05 Brief/批准配置|逐批准目标配方完整操作；按已批规则执行错误/重复操作；弹窗取消、确认退出及重入|进度/反馈/转换正确，不能仅到2/3判完整；退出无迟到回调|配置版本、全流程视频/日志|
|QA-F11 P1|Resource v0.8/registry/manifest|逐419 descriptor核路径、alias、meta、UUID和Prefab绑定；按模块加载；对照82 logical/72物理图/10alias；核派生rect/offset/originalSize/trim/anchor|无映射缺口、不改共享frame，脚点镜像/颜色透明边与批准图一致|419行审计、hash/UUID、同尺度叠图|
|QA-F12 P1|ModuleAssets/Gallery Brief|实际加载早退，等待完成后重入；已有隔离入口测当前失败、旧generation迟到、多owner共享、逆序回滚、重复dispose、retry|旧请求不绑新页、失败可显式重试、共享不误放、无负计数|早退独立记录、日志、受控原始输出；不称弱网|
|QA-F13 P1|资源释放契约|六模块轮换20个加载完成有效循环；逐轮进入截图及退出after-draw计数；早退另计|退出moduleLeases/pendingRequests/heldDerivedFrames/moduleInflight/derivedLive均0，无持续增长；不代称完整GPU/监听器检查|20行时刻/模块/计数、截图/日志、heap曲线|
|QA-F14 P1|TEST_PLAN性能口径|固定Web六代表场景各60秒×3轮，冷/热加载各3次；采帧时间、DrawCall、heap及可得GPU|有可复核实测；释放/增长契约满足；无批准数值预算不虚判达标，缺必要指标保留未测/阻塞|原始trace/序列、统计、工具局限|
|QA-F15 P1|BUILD_MANIFEST/BUNDLE_REPORT|逐relative路径计量hash；核Web物理输出、WX/TT根和八分包，明确排除规则和MB/MiB|内容身份一致、无重复遗漏；实际差额如实记录，目录字节不等于上传通过|计量方法、文件清单和输出|
|QA-R01 P1|后续RELEASE矩阵|指定设备/候选包后读取真实DPR2/3、safe/capsule；六模块触控/旋转|真实遮挡避让和触点正确；DPR1不冒充DPR2/3|设备OS/SDK/DPR、坐标/视频|
|QA-R02 P1|后续RELEASE矩阵|指定账号/开发工具/设备后核微信抖音上传包、启动前后台、纹理兼容及平台性能|符合获批平台范围/预算；缺资源NOT_TESTED，Web不外推|工具版本、包hash、真机trace|
|QA-R03 P1|后续RELEASE适用范围|Master锁平台网络能力和弱网矩阵后测适用加载延迟/断开/恢复|遵守批准取消/恢复规则；纯本地不适用须理由Review，缺工具不改N/A|网络设置、日志、恢复视频|

现有隔离入口若不可用，单项 BLOCKED 交 Master 协调，不自行改实现。RELEASE 项当前均 NOT_TESTED，不作为固定本地 Web FUNCTIONAL 隐藏阻塞；不扩展 Server、支付、设备采购或未批玩法。

F04/F12入口命令、受控输入/输出、source/mock与compiled/stub边界及冻结副本绑定详见TEST_PLAN v0.2实际入口章节；未知覆盖单项BLOCKED。F14当前没有已确认DrawCall/GPU/heap/帧序列接口，按该章节保留NOT_TESTED/单项BLOCKED，不注入hook。
