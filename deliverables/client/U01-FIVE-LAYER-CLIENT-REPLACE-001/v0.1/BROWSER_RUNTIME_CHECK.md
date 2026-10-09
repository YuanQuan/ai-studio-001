# U01 v0.1 内置浏览器运行检查

执行：Master；记录时间2026-10-09 12:15 +08:00。实测起点约12:10，准确起止时间未独立计时，不作性能时长结论。

对象：Creator 3.8.8 当前Web-Mobile实际构建，经 http://127.0.0.1:4173/ 加载；index SHA256 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，构建身份及HTTP记录见HTTP_RUNTIME_HANDOFF.md及evidence/BUILD_OUTPUT_SHA256.txt。通过Codex内置浏览器原生鼠标点击/拖动操作，未注入引擎状态。

| CSS视窗 | 中心 | 左/右拖动极限 | 证据 |
| --- | --- | --- | --- |
| 320×568 | PASS | PASS | evidence/320x568-{center,left,right}.jpg |
| 360×640 | PASS | PASS | evidence/360x640-{center,left,right}.jpg |
| 390×844 | PASS | PASS | evidence/390x844-{center,left,right}.jpg |
| 414×896 | PASS | PASS | evidence/414x896-{center,left,right}.jpg |
| 720×1280 | PASS | PASS | evidence/720x1280-{center,left,right}.jpg |

五视窗均检查全屏背景、水平拖动和边界停靠；未发现背景空白边/图层切口，河水在近景下部、街道在远岸、水草在水前。左/右各多次拖动至画面停止继续移动，中心以重置按钮恢复。这里的五尺寸是桌面浏览器CSS视窗，DPR1，不是五款真实手机实测。

390×844：点重置后连续点放大10次达到代码定义的1.8上限；画面放大且保持UI位置，左右多次拖动到极限，证据zoom-max/zoom-left/zoom-right.jpg。连续点缩小10次后点重置恢复原中心画面，目视与原center一致。确切1.0–1.8界限由源码/静态检查佐证，界面无数值读数，未声称由截图测出倍率。鼠标模拟单指拖动和加减按钮；实体手机双指触摸未测。

720×1280：右边界状态点击返回菜单，菜单可见；再次进入U01恢复默认中心与缩放，证据return-menu/reenter.jpg。菜单U02/U03仍在，未对其他单元进行完整回归。

console-warn-error.json 捕获结果为空数组：此次浏览器会话未捕获warn/error。viewport-dom.json保留720×1280画布真实边界、DPR1。临时浏览器视窗覆盖在验证后已恢复。

限制：截图保留既有调试性能面板，遮挡左下局部；面板显示的约40–55 FPS、约148–151MiB纹理内存是当前桌面浏览器整工程瞬时值，不能据此判定目标手机帧率或单套PNG真实内存。五PNG未压缩RGBA理论60MiB，具体文件字节量见Client报告。Creator日志虽有完成标记及退出36，仍含build-script SIGTERM记录；实际HTTP加载与操作成功作为交叉验证，不将其表述为无警告构建或真机通过。
