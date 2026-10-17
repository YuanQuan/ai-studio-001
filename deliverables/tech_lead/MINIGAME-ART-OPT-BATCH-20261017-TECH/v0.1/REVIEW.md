# 全批技术复签与客户端最终实现评审 v0.1

结论：**APPROVED，内部实现可交 Master 呈用户审核**。本结论绑定 Resource **v0.8**、Gallery **v0.5** 及最终 `final-v0.8-portable` 工程；不代表用户已批准 Client、QA 已通过、平台已验收或可以发布。用户确认后由 Master/Producer 进入下一适用 QA 流程。资源具体批准与代码阶段批准分开，未新增中间用户门禁。

准确输入与源码 SHA 见 `FINAL_REVIEW_IDENTITY.json`；实际输出 SHA、入口与包结构见 Tech v0.30 `AUDIT_IDENTITY.json`、`OUTPUT_FILE_COMPARISON.json`。Resource 最终 DELIVERABLE SHA 为 `33613eb893394c2cfc93bc012013b0d8126c42a57be577c32b1027e16bd0a30d`。Gallery 源 `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`，U01 源 `ee3bf82a3a0426f72881f496c35c3bddaf8f7d9a0c0fac2d62da96c9480f8042`。框架、U05及全部最终 TypeScript 身份逐文件登记，不用旧源码通过结论替换当前候选。

## 验收原文与结果（原顺序）

|验收原文|本阶段结果与依据|
|---|---|
|独立核全批预案源/范围/坐标、特殊资源排除、PSD/采样/预算，首图前与Art同SHA签认，未审批的不导入。|PASS。`TECH_PRESIGN.json` 绑定 Art v0.2 预案 SHA `fe1221f4…`、scope `ffcb38f0…`，76件首图前同批签认。原73+3透明RGB采样修订、14PSD/76层、保护边/原画布/135分钟预算及185项排除均有独立证据。Master记录用户批准具体76件及效果，旧7件原批准保留后才接入；本轮不做自产切图后置效果复审。|
|Client Brief经技术对齐后才实现；按已批契约核跨端API、租约竞争/释放、适配、视觉保留及代码健康。|PASS（已实现且有证据的范围）。原 Brief、接入/Gallery Brief及轻评审可追溯；单 runtime、owner token+generation、共享/失败/取消/迟到、addRef/decRef、CUSTOM/trim=false/原UIT、路径别名与 Canvas/输入域核验完成。TS实际方法、Creator实际发射代码和真实HTTP/IAB分别记录，不能互相替代。真实平台安全区/胶囊仍未测。|
|结合真实代码/测试/Creator构建/HTTP运行证据给逐项Review，平台/性能缺证据不通过，不增加自产切图后置Review。|PASS（评审工作与证据边界）。三端实际构建、生产419条资源覆盖、真实Web及循环证据已核；平台真机/性能等缺证项下列明确NOT_TESTED，未签通过。存在总包发布限制，未降质/删内容/CDN规避。|

## 当前实现与实际证据

- **资源/几何**：83历史获批身份可追溯；现行暗眼底图代替已不引用的旧 far_l，因此发布82逻辑项、72物理图，游客10对walk/run别名共享图但保留40逻辑帧及顺序。三个LOCK获批裁图保留；旧far与两旧桥身不回流。97模块419 descriptor 在三平台实际 Creator `config.paths/type` 与 staging 文件/meta 零缺口；UUID、别名回读及 library 裁片几何一致。importer会恢复裁片原尺寸/零offset，公开派生 `SpriteFrame.reset` 补原画布与offset，不虚称importer已持久保留。派生帧禁packable；未裁特殊UV、九宫格/字体语义保持。
- **释放/竞争**：独立代码与有效探针覆盖共享所有权、失败回滚、取消重试、异常清理和不同owner同generation。实际Creator编译曾把Set spread降为concat，已改并直接执行真实发射产物复核；for-of helper有实际证据正常。原force release改配对addRef/非force decRef，避免Prefab间接依赖被提前强毁。源码顺序与本机引擎deferredDestroy/afterdraw核验完成，实际页循环另证。
- **20轮**：Master v0.7 有效20次已加载页面退出，覆盖U00–U05；逐项复核 `DISPOSAL_RESULTS.json`，退出后的 moduleLeases、pendingRequests、heldDerivedFrames、moduleInflight、derivedLive 全0。5次早退/错页不计有效20；全日志22释放事件保留。已查看20有效加载接触表。`pageBindingsCleared`是实现诊断，不等于监听器或系统内存实测。
- **实际交互**：Root `RUNTIME_VERIFICATION.md` 记录U01缩放/拖动、游客动作/装扮/镜像、六店、U04 90/90状态、奶茶正确配方推进2/3并退出；小屏菜单双向拖/滚轮可达U05，游客拖不误装备，U00双向与Step/关闭。v0.6 U01拖后close失败保留；v0.7修后首次close与下一层实测通过，v0.8直接smoke复测菜单、U01 320拖后首次close/返回、U04 720加载/返回。两最终日志 warning/error 为0。短对话未形成长文本溢出，不能宣称其真实正向滚动已测；该方向仅源码/实际compiled方法覆盖。
- **布局继承**：v0.5的38张图仅作为六页面×六竖屏+U04两横屏的稳定布局证据。v0.29完整diff与AST比较：Gallery260/U0192成员不变，变化限手势与取消生命周期，无静态几何/字号/布局算法变化；11个实际发射布局/绘制函数在标识符归一后结构一致。旧图仍标v0.5，不伪记新build截图；v0.7另有六菜单尺寸图与受影响路径回归。
- **便携复现**：v0.30逐相对路径SHA核对，v0.7→v0.8每端仅主脚本不同。两生成模块注册UUID变化，加上作用域内一致变量换名后，三个完整脚本严格相等；其余输出/入口/配置字节相同。故有界继承v0.7运行证据，v0.8并未重跑20轮。pre-import两个stage均667文件/36,266,325字节、清单SHA `ea20600a…` 一致；排除本地profiles/.DS_Store、四条获批快照恢复及未授权漂移拒绝有证据，不用Creator后生成集合混作此口径。

旧黑屏、读取白条、微小控件、Set spread、退役资源回流、U04假失败、反向手势及U01残留指针均保留各版本失败事实；最终相应修复有源码/实际compiled及Root实际运行闭环。Owner较早文档中“待父Task构建/IAB”保留为当时事实，当前结果以精确绑定的Master运行报告和本次评审为准。

## 构建、包体与未测项

Creator 3.8.8 三端实际CLI均exit36且日志含Finished。真实Editor导出Bundle平台overwrite已用于生成输入，微信/抖音 `game.json` 均有8本地分包，包括world/tourist/shops/dialogue/milk-tea五业务包。三端同字节PNG跨包重复组0；不泛化成所有类型都无重复。

|物理输出|总字节|排除全部声明分包后的启动根目录字节|
|---|---:|---:|
|Web|38,670,790|不适用|
|微信|38,707,433|3,256,025|
|抖音|38,681,779|3,230,374|

这些是磁盘文件计量，不是实际上传/账号审核口径。抖音相对20MiB参考多17,710,259字节，相对十进制20MB多18,681,779字节；分包不消除总包差额。**本轮不签发布包体达标。**

以下均为 **NOT_TESTED / 未通过声明**：微信/抖音DevTools与账号上传、真机解码/运行、真实刘海/手势/胶囊、DPR2/3、GPU/堆峰值、drawcall、全量监听器计数。普通PNG字节收益不代表GPU收益。目标平台构建成功不替代这些验证。

## 后续压缩方案及门禁

压缩制作方案仍只有文档，未出图。v0.24 `COMPRESSION_PLAN_FINAL_REVIEW.json` 批准送用户Gate1，最终四SHA：ART_BRIEF `37611b86…`、ASSET_MANIFEST `7850497a…`、DELIVERABLE `123ae1ca…`、PRODUCTION_PLAN `ab306ec1…`，完整值见 `FINAL_REVIEW_IDENTITY.json`。6件/最多18候选+6参考/150人分钟/0生成式调用；全RGBA含alpha0精确、WebP exact、固定ICC及同采样要求。WebP兼容、收益均未测；用户Gate1后同批预签、具体样本Gate2后才接入，不继承旧图批准为新候选授权。

Master可呈交当前实现供用户决定下一适用QA及后续压缩方案。保持原Studio最终用户/QA门禁；本Task当前交Review，不标DONE。
