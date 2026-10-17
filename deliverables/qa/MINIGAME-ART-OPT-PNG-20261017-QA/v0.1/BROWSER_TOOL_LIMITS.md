# 工具与环境局限

本轮cua_repl正式文档：IAB browser ID2、QA独立tab1、HTTP http://127.0.0.1:8921/。viewport公开set只接受width/height；无DPR控制。实际读回DPR1，Canvas及视窗尺寸见BROWSER_EVIDENCE。浏览器工具未提供浏览器精确版本/UA读回（DOM只读scope没有navigator），不编造版本；引擎锁定Creator3.8.8，Node精确版本另见执行环境。

原生capabilities仅viewport/visibility（browser）与pageAssets/webmcp（tab），dev仅console logs；无录屏、trace、GPU、heap、DrawCall接口。截图/人工跨调用等待不构成帧时间或冷/热耗时采样。只读DOM用于Canvas矩形；未注入hook、未修改实现或探针。尝试读取现有runtime变量被只读scope拒绝，无状态修改，实际90由UI巡检与完整截图取证。

服务第一次因sandbox bind限制失败，经过正式require_escalated授权后同一端口启动，非换端口绕过。服务工具session19813；绑定127.0.0.1；浏览器viewport已reset并交Client独占。
