# U01 回归记录（U02 v0.3-R2）

状态：PASS（限 Codex IAB、390×667 鼠标操作；不代表触控或正式 QA）。

## R2 实测

- 在同版 R2 Web-Mobile 输出（http://127.0.0.1:8775/）进入 U01，记录初态、缩放/拖动后画面变化、Reset 后回到初始构图；再进入 U02，重入初态 action=null、phase=initial、朝向 right、帽/眼镜/手环全卸下、状态 ready 且无 error。证据：evidence/retry-20261009-r2/u01-initial-390x667.jpg、u01-zoom-drag-390x667.jpg、u01-reset-390x667.jpg、runtime-reenter-390x667.json。
- U03 六个店铺逐一可见：奶茶、糖画、炭烤、理发、花灯、投壶。证据：evidence/retry-20261009-r2/u03-shop01-390x667.jpg 至 u03-shop06-390x667.jpg。
- Root 在 IAB 以 CUA 鼠标正常点击 U02 控件；短屏下控件可见，返回/重置及页面切换正常。R2本轮未执行托盘拖动；R1历史托盘拖动观察不继承为R2证据。没有据此声称真实触屏通过。
- 浏览器控制台原始采集文件包含一条 R2 启动前（2026-10-08T16:13:37.293Z）的 audit harness MutationObserver 异常。按 R2 启动时间 2026-10-09T00:20:10+08:00 过滤后，当前 R2 页面 error/warn 为0；过滤说明及原始记录分别见 browser-console-r2-window.json、browser-console.json。

## 静态保护

- U01 Prefab UUID 2d697fb3-01f0-4330-a180-a9c162310bf8 保留；Scene 链接检查 STATIC_PASS（19对象/26引用），U03 六个店铺引用保留。R2 caption 修正未改 Scene。
- R2 为独立 build U02-TOURIST-CLIENT-INTEGRATION-001-v0.3-R2，147文件/20,421,377 bytes；清单见 evidence/retry-20261009-r2/BUILD_MANIFEST.json。

该记录限客户端同版鼠标回归，不替代 QA 的全量用例、真实触控、目标设备或发布验收。
