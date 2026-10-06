# U01 Web FUNCTIONAL 性能方案 v0.2

Task：UNIT-SAMPLE-SINGLE-ENTRY-PERF-PLAN-001。Owner：Tech Lead。规则：studio-workflow-v2-policy。状态：候选提案，待 Client、QA、Master 同版 Review 和用户审批；本轮不执行性能测试，所有数值均不是已实测结果。方案批准也不代表性能达标。

## 输入与适用性

正式输入为 Product Scope v0.2、Tech Plan v0.1、QA Plan v0.2、Client Implement v0.2（各自任务 ARTIFACT_APPROVAL.json 为批准事实源）。被测范围为唯一菜单和 U01 四层全屏场景、1～1.8 倍覆盖缩放、水平拖动、重置、返回重入。四层 PNG、Prefab、Controller 身份和全屏语义不变。

| 项目 | 适用性与依据 | 验证类型 |
|---|---|---|
| 冷启动、首次进入与缓存重入耗时 | 适用，四张2172×724图及Prefab创建影响进入体验 | 必测 |
| 静止、持续拖动、缩放、重置的帧间隔 | 适用，全屏透明四层绘制及输入变换影响交互 | 必测 |
| 重复进入退出的对象、监听器、资源与堆增长 | 适用，Controller onEnable/onDisable注册/解除输入和view监听；静态成对不证明运行释放 | 必测 |
| DrawCall和纹理数量 | 适用，作为增长与异常诊断；同图集不证明合批 | 观察，增长须分析 |
| GPU驻留纹理内存 | 适用但目前无可靠读取工具，不可用JS堆替代 | NOT_TESTED并披露局限，不作为本Web硬门槛 |
| Server、数据库、顾客并发、战斗/VFX | N/A，获批范围不存在这些对象或服务 | 不新增测试负载 |
| 真机、小游戏SDK、真实弱网 | 本阶段排除，项目决议限定模拟Web视口 | NOT_TESTED，不是平台N/A |

原 project/quality/PERFORMANCE_BUDGET.md 属 DEMO-001 候选手机预算，含顾客、TileMap等不同负载，本方案不继承其55 FPS、20ms p95、5秒观察值为U01硬标准。

## 环境及测量前置

引用同轮待批 QA Matrix v0.1：deliverables/qa/UNIT-SAMPLE-SINGLE-ENTRY-QA-MATRIX-001/v0.1/WEB_TEST_MATRIX.md。仅在该矩阵及本方案都获批后执行：Creator 3.8.8、Web Mobile debug=false、本地loopback HTTP实际构建；Windows与Chrome精确版本、WebGL后端、WEB-01～05视口与DPR以获批矩阵为准。若矩阵改版，先进行本方案交叉核对，不能默默继承。性能五视口全测，WEB-03 DPR3作为高像素负载重点，不能用桌面短窗口代替。

每次记录OS/浏览器/GPU/驱动、实际WebGL、CSS尺寸/DPR/Canvas像素、屏幕刷新率及电源模式、CPU/RAM、后台负载、构建配置/源commit/产物SHA-256与资产哈希。主机设备数据及实际刷新率目前 NOT_RECORDED；运行基线 NOT_TESTED。禁用CPU/网络节流，前台可见、浏览器缩放100%，关闭无关高负载程序；采样时不截图、不录屏、不打开实时Profiler面板。输入轨迹及Perf原始数据保留；另轮录制相同操作供视觉核对。页面失焦、系统休眠、负载干扰则整轮无效并记录原因后重采，不删除真实卡顿样本。

优先沿项目共享 cocos-cli-browser 流程构建并核对HTTP实际产物；采用矩阵明确的Chrome进行本次性能量测。同版正式环境选择优先于通用工具偏好。工具自动审批拒绝时按正规授权处理，不能换浏览器或端口绕过。缺必需环境/采样权限/计数方法，受影响项 BLOCKED，已有功能证据可独立保留。

## 基线和采样步骤

执行时锁定批准的Client v0.2所对应构建；实现报告截图与几何检查不当性能基线。先在相同构建、环境及每个矩阵项收集第一组3轮基线 B0，再做独立3轮验证 V0，报告所有原始值。B0本身也检查绝对门槛，不能把慢基线当通过依据。之后改动建立B1并作变更影响复测，不跨构建或环境合并平均。没有B0时允许采集数据，不作正式达标结论。

1. 冷启动：每轮用隔离干净浏览器会话，清除此入口HTTP缓存及站点存储；服务已启动，不含Creator构建时间。记录导航开始到唯一菜单完整可操作，再记录点击进入到四层背景及控件完整且可响应。3轮，保存网络时间线和完成信号；冷启动值不是只测JS开始后的加载。
2. 热进入：保留缓存，先进入退出一次预热，回菜单等待5秒；每轮从进入输入事件到下一次完整可操作画面，3轮。完成信号由测试侧核对四层/控件有效、资源就绪、相机初态，并在下一次渲染完成后标记，不能仅取函数返回时刻。Client提供可审查观察方法，QA试采核对；无可靠首帧完成判据则该项BLOCKED。
3. 每轮先加载稳定10秒；S0覆盖倍率1×中心静止60秒，S1为1×持续左右往返60秒，S2为1.8×左右往返60秒，S3为1×到1.8×再回1×、在左右端缩小回收及重置的循环60秒。各场景独立重复3轮，不把加载阶段混入稳定帧统计。拖动每秒60个等间隔输入、每5秒从左到右再返回；S3每5秒一次倍率/重置操作，保留坐标、时间戳、倍率与相机位置。输入根据实时可见边界构造，不直接写cameraX。WEB-03另作获批双指输入同负载采样，按钮缩放与双指分列。
4. 生命周期：同一浏览器做20次进入/退出，每次U01保持5秒，菜单保持5秒。预热完成后的第0、5、10、15、20轮菜单，以及进入时的四层实例、Controller实例、U01绑定监听数、活动计时器和缓存纹理数量分别记录。返回后等待至少两次引擎帧和5秒，再取样，避免把destroy延迟当泄漏。监听/计时器用Client提供的只读运行计数方式，未知记NOT_TESTED，不猜测为0。
5. JS堆仅诊断：在生命周期检查点使用同一DevTools heap snapshot方式、相同GC操作及等待条件取保留堆与对象类型数量；独立诊断轮，不能与帧率测量同时做。没有GC/快照权限则记录限制。资源缓存可保留已加载四张图；不要求每次退出纹理清零。

## 指标、候选门槛与选择依据

以下全部为待批U01 Web候选门槛，审批后才可用于正式QA，不代表Product已承诺或当前主机达标。选择以可操作交互及防重复实例为依据，数值由本次Tech提案提出，初次试采不得为通过而放宽，若不合理须新版本及再次审批。

| 指标 | 候选判定 | 选择依据 |
|---|---|---|
| 冷导航到菜单 / 首次进入 | 各轮分别≤3000ms / ≤1500ms | 本地HTTP、固定小场景的等待上限，分离入口与场景问题 |
| 热缓存进入 | 每轮≤500ms | 重复操作应迅速恢复，小场景不应持续阻塞 |
| S0～S3帧间隔 | 每轮p95≤33.3ms、p99≤50ms；>50ms比例≤1%；不得出现连续无新帧≥500ms | 约30Hz交互节奏和明显卡顿上限；不是手机60FPS承诺 |
| 操作到可见反馈 | 每轮p95≤100ms、最大≤250ms | 避免拖动、按钮和重置明显滞后；按输入事件到包含对应变换的完成帧测量 |
| 生命周期对象与监听 | 返回菜单后U01实例/专属监听/计时器回到第0轮基线；进入时四层及Controller计数不随循环增加 | 绝对防重复与释放门槛，不要求未知的菜单总节点常数 |
| 相对退化 | V0各场景3轮p95中位数相比B0增加>20%且增加>3ms，或热进入中位数增加>20%且>50ms，触发复核，未解释前性能结论BLOCKED | 同构建重复对照识别环境与采样不稳定，不当成可放宽绝对值理由 |
| JS保留堆、DrawCall、纹理数量 | 记录每检查点；第10/15/20轮持续增长、未平台化须分析。堆增加>max(5MiB,B0堆10%)触发诊断，不单凭此值判泄漏 | 堆含引擎缓存且不同于GPU，增长曲线和保留引用共同判断 |

帧指标用浏览器Performance原始trace及测试侧requestAnimationFrame时间戳计算；以连续帧间隔升序、nearest-rank方式求p95/p99，>50ms比例为超限间隔数/有效间隔数，保留样本数、均值、最大值及>33.3ms计数。rAF是浏览器呈现机会代理，非GPU帧耗时/引擎实际FPS；QA同时核对引擎完成帧时间线，不能只凭空回调宣称画面在更新。平均FPS仅观察，不替代分位数。

反馈测量用输入时间戳、Controller变换观察和引擎完成帧关联；无法关联时BLOCKED，不能把事件处理函数时长写成端到端响应。DrawCall如工具只能在debug构建取得，应单列诊断构建hash与结果，不代替debug=false被测版本。四张RGBA8无mipmap的单份像素估算为2172×724×4×4=25,160,448字节，约23.99MiB；这是理论像素量，压缩/上传/缓存/mipmap/渲染目标均可改变驻留值，不是实测预算或已通过证据。

## 报告与门禁

正式TEST_REPORT分列功能、视觉、性能；每项记录矩阵/场景ID、构建/资产版本、冷热缓存、负载轨迹、采样/重复数、每轮原始结果、B0/V0、候选获批版本、阈值、证据路径、无效轮原因、缺陷。性能必要硬项失败阻止对应验收；P0/P1/P2沿已批定义，不自行升级。只观察指标可记录WARN及原因，证实无界增长或必要硬项缺证据不能整体PASS。GPU实测缺失单列NOT_TESTED，其不属本Web硬项的边界须获同版Review确认。

方案/环境未批：性能NOT_TESTED；工具、基线或必需计数缺失：相关项BLOCKED；实际数值失败：FAIL。不得以代码审查、几何检查、主观流畅替代性能采样。不得通过降低DPR、删图、改视觉、降输入频率或修改上限直接达标；需要变更时提交Master并走原审批。用户批准本稿后，由Master另行授权QA执行及Client测量支持，报告再经用户确认，Master接受前不标DONE。本任务仅交付方案，不编辑项目公共预算或旧审批。


## v0.2 修订：测量支持交付契约（替代上文笼统的Client提供观察方法与输入方法）

修订来源为v0.1 CLIENT_REVIEW.json 的3项MAJOR及2项INFO；v0.1保留专业退回历史，未发生用户拒绝。上文指标及五视口范围保留；采集、60Hz负载、双指、监听计数及被测身份以本章具体契约为准。支持工具目前未实现、未试采，不能宣称正式QA已具备执行条件。

### 支持Task和审批前置

Master已创建正式Client支持Task `UNIT-SAMPLE-SINGLE-ENTRY-QA-MEASUREMENT-001`，当前BACKLOG；本方案与Web矩阵均获用户批准前不得启动。其输入为本性能方案批准版本、QA矩阵批准版本、Client实现v0.2及源码/资产身份。Required Artifact建议：

- FEATURE_BRIEF.md：探针与外部采集边界、允许API、输入生成工具、观测字段、绑定集合、开销及回滚方案；Tech/QA Review后用户批准，才允许实现必要源码探针或测试扩展。
- MEASUREMENT_CONTRACT.md、采集/输入脚本及SHA-256：Creator3.8.8兼容探针、受控本地Chrome DevTools Protocol（CDP）输入与trace采集。CDP连接须由正式支持任务明确授权，只绑定loopback、隔离测试浏览器profile，不读取用户日常会话；无连接权限记BLOCKED，不绕过浏览器自动审批。没有CDP能力时只能修订支持Brief及本方案，不能把人工Shift拖动当60Hz轨迹。
- VALIDATION_REPORT.md中的实施记录、BUILD_IDENTITY.json证据：探针构建M与无探针批准源码对照构建U的源commit、资产SHA、Creator/配置/输出SHA、脚本hash、开关、依赖差异及探针移除方法。
- VALIDATION_REPORT.md及原始JSONL/trace/绑定快照：试采非正式QA，证明本章事件关联、冷导航起点、两触点、实际间隔、真实绑定计数、卸载、开销对照和采集器隔离可用。Tech与QA独立Review；Client实施报告及试采支持交付经用户确认后，由Master解锁正式QA执行。

支持任务不可更改获批图片、镜头公式、UI或核心流程。探针改变构建即新Artifact，不能继续宣称M是原已批v0.2产物。仅外部只读采集可以保留原构建hash，但必须试采证明所有硬项能观测；不能预设debug=false可访问私有状态。支持任务所需批准不代替QA TEST_REPORT审批。

### 时间、完成帧与输入关联字段

采集协议JSONL最小字段：schema_version、run_id、build_sha、collector_sha、matrix_id、scenario_id、input_id、event_type、touch_ids、css_xy、browser_dispatch_mono_ms、dom_received_mono_ms、engine_received_mono_ms、engine_frame_seq、cpu_submit_mono_ms、cameraX、zoom、layer_transforms、scene_epoch、owner_id。导航另记录navigation_start与首个menu_ready/u01_ready。状态/绑定采样另有sample_point、target_id、event_key、callback_id、owner_id、active_count、created_epoch、destroy_requested、is_valid、timer_id、collector_owned。

外部控制器在导航之前启动CDP trace、安装新文档采集脚本并记录导航命令起点；PerformanceNavigationTiming为页面起点依据，保存请求/资源加载时间线。时钟使用页面performance时间域，CDP monotonic与页面时间在每轮开始/结束做配对校准，记录偏移及误差。误差>2ms、导航前安装失败、trace缺片或跨scene_epoch关联失败则对应延迟项BLOCKED。

探针在Creator3.8.8受支持的Director帧完成事件处记录CPU渲染提交序号；实际API和事件名由支持Brief对锁定引擎源码确认（不得凭猜测调用）。menu_ready/u01_ready须同时满足当前Scene与根节点有效、必要按钮及四层SpriteFrame有效、初始镜头及布局已计算、完成资源请求，并记录随后首次提交帧。输入由外部生成唯一input_id，通过时间戳/事件类型/触点坐标关联DOM及Controller实际处理记录，不将id写入cameraX或直接调用镜头setter。每个input_id记录处理前后变换及第一次包含该变换的提交帧；重复/合并事件明确标记，未关联比例>1%则试采不通过。

CPU提交不是GPU执行完成或屏幕呈现。正式硬响应指标限定为输入到包含变换的CPU提交时间，并单列Chrome trace可得的合成/呈现时间；用trace时间线校验帧间隔与变换帧，当前无可靠GPU完成/presentation关联时后两项NOT_TESTED，不把CPU响应称端到端屏幕响应。上文“操作到可见反馈”候选阈值100/250ms在v0.2改名“操作到变换帧CPU提交”，同数值用于该有限口径，须随本版重新审批。截图只用于独立视觉核对，不能作为精确计时。rAF仍仅为浏览器机会代理，硬帧指标需与引擎实际CPU提交序列交叉核对，无新提交≥500ms按本版门槛记录。

### 60Hz轨迹与双指生成

支持脚本使用已授权CDP `Input.dispatchMouseEvent`/`Input.dispatchTouchEvent`，每16.667ms计划一次move；使用单调时钟调度，记录计划、实际发送、DOM接收和Controller接收时间。禁止事后补发积压事件制造瞬时峰值。实际发送间隔落在12～22ms的比例须≥95%，任何间隔>50ms或接收丢失/未关联>1%使该轮负载不合格，记录全部数据后重采；连续两轮不合格暂停并诊断工具，不以低频代替。接收合并单列，不当作引擎性能卡顿掩盖。

坐标采用Canvas CSS矩形内、避开悬浮控件的安全水平带，并保存其坐标、DPR和引擎UI坐标映射。S1/S2每5秒一周期：前2.5秒目标到左端、后2.5秒目标到右端；每程move保持60Hz，在可用CSS带的10%～90%范围拖动。按真实Controller按下起点语义分段：达到CSS边缘即mouseup/touchend，在对侧可用起点重新按下继续同向拖；这些边界up/down计入轨迹但不计入move间隔统计。观测cameraX仅用于确认达限和换向，不直接修改。触达镜头极限后在剩余时间继续往外施压，保证限位负载；若试采证明某矩阵/倍率在2.5秒内不能通过这些分段触达两端，则调整经Review批准的输入速度/分段协议或修订周期，不能伪称完成两端负载。

双指使用固定两个touch id，同时touchStart；两指在不命中UI的中心区域对称改变距离，每16.667ms更新两点，保持中心稳定。距离变化与实际zoom关联，上限1.8和下限1分别观察；两点结束后清理。取消专项发touchCancel且核对Controller.activeTouches/gesture/inputMode清空，独立于稳定帧采样。试采必须输出Controller收到两个同时有效id及pinch状态、缩放变换和边界回收轨迹；页面缩放或只收到一个id不合格。矩阵人工Shift方法可用于功能专项的两点核对，本性能负载统一用获批CDP生成器，不混合两种输入数据。

### 真实绑定与资源生命周期

观测集合覆盖全部场景拥有者，不能只数Controller：Controller的input 8项、viewport MOUSE_LEAVE/SIZE_CHANGED 2项、view canvas-resize/design-resolution-changed 2项、4按钮TOUCH_END；Gallery的input MOUSE_DOWN/MOUSE_UP 2项、view上述2项、当前菜单入口按钮TOUCH_END，以及Gallery、Controller、Prefab实例和四图层节点。按钮/场景重载产生新owner_id与scene_epoch。专属计时器涵盖引擎scheduler及项目setTimeout/setInterval/requestAnimationFrame，当前源码没有调度不意味着运行永远为0。

支持工具需在场景首次初始化前安装事件绑定观测，分别记录实际EventTarget on/once/off/targetOff/removeAll与节点销毁调用成功后的绑定条目，并用Creator3.8.8实际事件容器的只读快照核对callback、target及owner引用；对应私有实现访问如有必要须在Brief说明版本绑定，不当跨版本通用接口。仅on/off自建计数账本不够，试采需在菜单及U01状态核对真实绑定快照，并以heap retained references复核退出后仍被全局input/view持有的旧Gallery/Controller。工具无法可靠读取/核对则硬生命周期项BLOCKED，不以场景遍历替代。once自动解除和targetOff批量解除均要反映真实集合。

返回后旧epoch应在两帧加5秒窗口内解除专属全局绑定，当前新菜单Gallery及其入口监听仍存在，按新epoch计数而非要求整个Gallery全为0。生命周期第0/5/10/15/20点比较相同菜单状态新epoch的活跃集合与所有旧epoch残留；U01专属层/Controller退出后归零，当前菜单Gallery保持单实例，旧epoch全局监听为0。节点destroyRequested尚未实际销毁、heap暂时保留无全局引用、资源缓存纹理仍在分别记录；缓存不归零可以接受，旧epoch全局强引用不能忽略。采集器自己的Director/DOM/CDP/定时器归collector_owned并单列，计数剔除前保留明细与安装/卸载验证，不能借采集器名义剔除业务监听。

### 探针开销及构建对照

U为无探针控制构建，M为观测构建；二者同Creator/debug=false、资产、业务源码、配置及输入生成脚本，仅探针差异。支持报告明确提交/完整hash，源码diff只含获批观测路径；M与U都不得标作未经确认的原v0.2同一hash。外部trace/输入工具各自hash及安装方式固定。

每视口S0/S1/S2/S3分别至少3轮U/M交替试采，保存原始trace、帧间隔与输入轨迹。探针预算：p95帧间隔增加≤max(1ms,U的5%)，热进入中位数增加≤max(10ms,U的5%)，无丢记录/未卸载自身绑定；该预算为待批候选，超过则优化采集器或提交新方案，不能扣除估算开销制造PASS。M正式运行建立独立B0/V0；U也执行可采得的加载、帧trace、相同输入控制对照，U硬指标失败不能因M通过被覆盖。GPU/真实屏幕反馈局限仍明确披露。采集需预分配有限缓冲、轮末导出，记录峰值缓冲/采集CPU开销，不在每事件同步写磁盘或录屏。正式报告分别列U、M数值与结果，说明硬绑定与CPU输入关联来自M，控制性能来自U，用户未确认支持交付前两者均不作正式QA结论。
