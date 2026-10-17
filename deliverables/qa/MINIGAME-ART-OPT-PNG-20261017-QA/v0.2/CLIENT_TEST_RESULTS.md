# 客户端最终测试结果 v0.2

Task：MINIGAME-ART-OPT-PNG-20261017-QA；FUNCTIONAL；规则studio-workflow-v2-policy。PASS只表示本行明确声明的已测范围；PARTIAL中的未测子项保持NOT_TESTED，不改变批准期望。新旧target分开追溯。

|用例|最终覆盖标签|实际结果及边界|证据（本目录或明确相对路径）|
|---|---|---|---|
|QA-F01|PASS|旧146身份及新三端803/823/821逐hash吻合；六页真实进入/退出。新U00服务退出后一次恢复加载成功，未确证代码缺陷，服务恢复后成功。|NEW_BUILD_IDENTITY.json；U00-service-recovered-loaded.png|
|QA-F02|PARTIAL|旧v08跨独立调用稳定6×6矩阵已核；新包主要热区已实际操作，未在每个新尺寸穷尽所有热区/拖滚。|../v0.1/stable-*.png；TOURIST_64_CONTACT.png|
|QA-F03|PARTIAL|旧v08两横屏稳定U04已采；未完整执行每个横屏全部人物/表情/背景输入。|../v0.1/stable-U04-1280x720.png、stable-U04-844x390.png|
|QA-F04|PARTIAL|旧冻结源SIMULATED探针断言exit0；未覆盖所有特定方向/裁切组合，不称真实SDK/设备验证。|../v0.1/PROBE_EXECUTION.json|
|QA-F05|PARTIAL|新U01真实滚轮30次放大、50次缩小+额外6次饱和、最大7方向拖动、重入恢复及面板拖后下一层/关闭；数字状态1.00为对象scale，不是cameraZoom实测。U00完整极限缩放矩阵未全。|new-sky-camera-max/min/min-saturated.png、new-sky-max-drag-*.png|
|QA-F06|PARTIAL|新包4动作×左右×8装扮共64真实输入关键帧，联系表已核，未见镜像缺层；无录像/逐帧时序接口，不能确认完整时间序列和精确脚点轨迹。|tourist-*.png；TOURIST_64_CONTACT.png|
|QA-F07|PASS|新包六店真实轮换两轮12图，店05两PNG对应UUID和RGBA一致，无串店/缺图；风格判断不替代Art。|shops-two-rounds-0至11.png；SIX_PNG_IDENTITY_RGBA.json|
|QA-F08|PASS|旧v08巡检90/90零失败并保存90无遮挡完整画面；新AT_S3实际选择就绪，base全RGBA一致。新包未重新GUI跑90全组，不扩张为新90视觉穷尽。|../v0.1/U04-full-*.png；new-at-s3.png|
|QA-F09|PARTIAL|normal/loading/selected/disabled、配方/取消确认可达状态已操作；无现成可达长文，长文实图NT；pressed精确瞬态未测。新增验证设置“循环”缺字P2。|N2-exit-confirm.png、N2-exit-cancel-continues.png；CONSOLE_NEW_BUILD.json|
|QA-F10|PARTIAL|10阶段均进入：8个完整三杯胜局；地狱2到第三杯超时，噩梦2错误配方不推进/材料清空、取消及确认退出。非174随机穷尽；详细阶段表另列。|EIGHT_WINS_CONTACT.png、D2-final-result.png、N2-*.png|
|QA-F11|PARTIAL|新实际构建全hash、6PNG候选字节/参考全RGBA、UUID/geometry逐项绑定；现成compiled审计本轮419三端descriptor路径/type无missing，派生82释放live0。非419逐项视觉叠图，也非浏览器/GPU。|SIX_PNG_IDENTITY_RGBA.json、COMPILED_MANIFEST_AUDIT.json|
|QA-F12|PASS|旧实际U04加载早退后重入+4冻结现成mock/compiled入口exit0；新包正常实际退出日志五计数0；服务故障导致加载失败已显式呈现且服务恢复后重试一次正常。非弱网专项。|../v0.1/U04-early-exit-*.png、U00_RECOVERY_CONSOLE.json|
|QA-F13|PARTIAL|旧有效20个完整加载循环generation13~32五计数均0；新主会话14条和恢复会话1条退出日志五计数均0。新包未重新20有效循环，不外推旧20；heap/GPU/监听器不可读。|../v0.1/VALID_CYCLES.json；NEW_DISPOSAL_COUNTS.json、U00_RECOVERY_CONSOLE.json|
|QA-F14|BLOCKED|无原生trace/FPS/DrawCall/heap/GPU/录像接口；未注入hook，60秒×3和精确冷/热耗时NT，不能性能PASS。|../v0.1/BROWSER_TOOL_LIMITS.md|
|QA-F15|PASS|新Web38404865、WX38441508、TT38415854字节，逐relative路径全hash；WX根3256025、TT根3230374，排除8分包root。平台上传/限额NT。|NEW_BUILD_IDENTITY.json、PACKAGE_MEASUREMENT.json|

汇总：FUNCTIONAL 5 PASS、9 PARTIAL、1 BLOCKED；RELEASE R01/R02/R03均NOT_TESTED。未测子项不计通过，总体不能PASS。

## 奶茶10阶段代表流程

|阶段|配置时限|本轮GUI结果|证据|
|---|---|---|---|
|简单1|不限时|完整3杯胜局+10|font-three-cups-complete.png|
|简单2|不限时|完整3杯胜局+10|E2-complete.png|
|中等1|150秒|完整3杯胜局+15|M1-complete.png|
|中等2|135秒|完整3杯胜局+15|M2-complete.png|
|困难1|135秒|完整3杯胜局+22|H1-complete.png|
|困难2|120秒|原尝试归档诊断时超时；一次恢复重试完整3杯胜局+22|H2-timeout-result.png；H2-retry-complete.png|
|地狱1|120秒|完整3杯胜局+30|D1-complete.png|
|地狱2|105秒|到第三杯，提交/呈现期间到0超时；完整胜局未测，不记游戏缺陷|D2-final-result.png|
|噩梦1|105秒|完整3杯胜局+40|N1-final-result.png|
|噩梦2|90秒|错误配方1/1/6对预期3/3/2提交后不推进、材料清空；取消退出继续、确认退出回选择；胜局未测|N2-configuration.png；N2-wrong-feedback.png；N2-confirm-exited-to-selection.png|

使用现成示例验证设置开启隔离验证、切阶段1/2；没有写localStorage或注入状态。174配方由Math.random抽取，当前UI无确定性逐条配方入口，不无限刷单，也未用未批准新hook实现穷尽。定时局配方窗不暂停时钟，工具/模型读取截图及代理小料滚动往返占用实际时限；D2/N2完整胜局明确未测而非通过，相关已测错误/退出/超时分支独立报告。

64游客截图槽位bits：1帽子/2眼镜/4手环，0~7全部组合；left/right为UI方向按钮真实选择。PNG仅冻结关键帧，无录像，不能推断精确播放时间。U01的UI缩放1.00是选中图层比例，镜头仅按画面放大缩小及饱和结果取证，数值clamp来自源码，不冒充runtime数值读回。
