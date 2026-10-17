# 实际Web预检记录（历史版本，不是最终验收）

本轮IAB在新建标签3后恢复，可取DOM/AX、截图、控制台并以原生Canvas坐标点击和滚轮输入。先前旧标签2超时保留历史，原因未确定，不再笼统认为工具不可用。全程只用Codex内置浏览器与文档化Cua API，没有引擎隐藏状态注入。

## 历史v0.5

Root在loopback8890提供固定目录 `/private/tmp/minigame-art-opt-batch-20261017-build-v0.5/minigame-art-opt-batch-20261017-web-mobile-v0.5`（session92018，随后确认Ctrl-C退出）。普通沙箱启动HTTP被拒，正规require_escalated同命令获准后启动；未换端口绕过。IAB标签3实际黑屏，控制台2026-10-17T04:36:21.118Z报 `_wrapNativeSuper is not a function`，指向assets/main/index.js:2760。截图和错误分别见BROWSER_PREFLIGHT_BLACK.jpg / BROWSER_PREFLIGHT_ERRORS.json。Client据实定位native Error子类构建辅助，并改为保留双instanceof的原型兼容构造；编译成功不替代该运行失败。

## 候选v0.6

旧服务停止后Root切同端口到 `/private/tmp/minigame-art-opt-batch-20261017-build-v0.6/minigame-art-opt-batch-20261017-web-mobile-v0.6`，session67380。页面URL带 `?build=v0.6-candidate`，源码输出由Client另保构建日志及assets/main/index.js SHA `d78f44dc59ded239ce32b384a78b2298464296473fb1eb16ce9bb958f332cb77`。实际已进入菜单和U00、U01，启动黑屏消失。标签控制台会保留旧v0.5时间戳错误，不能把同一旧记录误算为本次启动新错。

以文档化viewport设320×568，DOM窗口实读320×568、DPR1。Canvas点击进入U00、打开/关闭调节面板、返回菜单、进入U01、打开工具面板并滚动至后续层/坐标/原型/店铺操作均实际有效。截图V06_U00_320x568.jpg / V06_U00_PANEL_320x568.jpg / V06_U01_320x568.jpg。

发现并退回：U00顶部和U01独立按钮实际文字显著低于已批阈值，U01长导航标题多行裁切；U00模态面板底部被原相机HUD绘在其前而遮挡。Main已据此修按钮16/24、精简标题并提模态层序，相关最后源码delta由Tech v0.8实际方法复核通过，仍待新构建复测。v0.6含新reader的已知中间缺陷，故不作为最终阅读器通过证据。

桌面默认1280×720预检时可见旧debug Profiler（菜单约60FPS、35 draw、纹理估计90.44MB），仅为当次画面读数，未测峰值、未代表真机、未据此判断生命周期稳定或资源优化收益。小屏会遮挡内容，最终视觉构建要求关闭覆盖；性能结果须另按环境与证据记录。

DPR2/3、刘海/平台胶囊、目标小游戏/真机、20次实际页面资源/监听增长和最终候选完整运行尚未据此通过。
