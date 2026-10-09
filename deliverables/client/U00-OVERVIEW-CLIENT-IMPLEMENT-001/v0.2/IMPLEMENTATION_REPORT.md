# U00 总览客户端实施报告 v0.2（Owner草稿）

## 本轮变更

在 [UnitSampleGallery.ts](../../../../apps/client/assets/UnitSampleGallery.ts) 中将菜单顺序调整为 U00、U01、U02、U03。U00 顶栏新增“调整店铺”折叠开关；展开后可上一店/下一店选择六店之一，面板显示序号、店名、脚点X/Y、步长以及本轮临时调节提示。X/Y 四向按钮按当前 1、10 或 50 源像素步长微调脚点；选店后相机尽量聚焦该店。按钮受现有 U00 全局触控/鼠标按钮捕获清单保护，面板空白也不启动街景拖动。紧凑设计宽度下，面板控件按行重排并重绘可点击范围，返回/标题/调店顶栏控件也调整尺寸与间距。

调试坐标只保存在 U00 当前页面实例中。面板明确提示离开 U00 后恢复六店初始基线；返回后重新进入也恢复。相机重置只改变相机，不覆写店铺临时脚点。当前基线沿用 v0.1/R3：稳定ID顺序为 `MT_SHOP_01`、`SHOP_02`…`SHOP_06`，脚点X为 -1320、-950、-580、580、950、1320，脚点Y均为 -225，缩放均为0.4；本轮没有正式更改这些默认值。

“恢复六店基线”按钮将本次预览全部坐标还原。 “复制全部参数”导出可读JSON，包含schema、临时预览标记和六店稳定ID、名称、`footX`、`footY`、`scale`。首选浏览器Clipboard API；无论写入成功或失败，都会弹出可选择的只读DOM文本框显示整份JSON。写入成功提示“参数已复制，也可全选下方文本发回对话。”；失败时提示手动复制。异步复制在离开页面后返回时会被页面epoch丢弃，避免旧页面弹窗或访问已销毁控件。导出不是正式配置，也未使用待审批Excel；用户发回坐标并完成项目审批前不写入默认位置。

在 [scene1_camera_controller.ts](../../../../apps/client/assets/labs/menu/scene1_camera_controller.ts) 新增 `focusOnSourceX`，让面板选择店铺可聚焦源坐标。其仅改变镜头中心并重新执行合法边界夹紧，不改变店铺脚点，不改变 U01 默认/重置中心，不更改五层结构。

## 静态核验

- Creator 3.8.8 随附 TypeScript 编译器执行 `--noEmit --strict false --target es2019 --skipLibCheck -p apps/client/tsconfig.json`，退出码0。
- `RESOURCE_INTEGRITY_CHECK.json` 遍历 `apps/client/assets` 全198个Git跟踪文件。两份获授权TS分别与本轮开工SHA对照；其余196项（包括JSON manifest、UUID/meta、图片、Prefab、Scene、字体和其他代码）逐字节与任务起始HEAD对照，196/196未变。
- 本轮开工源码SHA：Gallery `17dbbcff503796dd2031baf8bc97da14987e320c17a7414307470cdee96c2ee4`、Camera `1bf7a59c3accecd2ce4efa85813a6d4c27033e7af15c699225e0f06648625f81`。当前SHA：Gallery `42d27216233c26995a3d8eba052b3a828cf32b1433680277595b5967f2df2f20`、Camera `3b3b55cdb6cbc9cb7cb21bcfc30b521ddedc4edd830356296ec591b6bc085ef7`。本轮没有修改图片、Prefab、字体、Scene、manifest或`.meta`。
- Creator 3.8.8 CLI R2已在隔离副本完成，exec session 16431，exit36、Finished标记，149文件、25,935,211 bytes；源码SHA绑定本报告。R1清单保留作历史。日志中出现engine-script worker SIGTERM，Tech复核认为该诊断未阻止本次构建成功，但不能仅凭日志认定为正常缓存终止；浏览器未发现脚本/资源缺失。既有4174服务HTTP GET/HEAD 200，R2 index SHA与构建输出一致。Master完成R2两视口内置浏览器交互检查，且RUNTIME_R2_MANIFEST已绑定最终源码SHA、两个视口及25份运行证据哈希。本报告将桌面Web实际运行与静态/HTTP检查分开记录。

## 运行验收与边界

RUNTIME_R2_MANIFEST绑定最终Gallery/Camera源码SHA、390×844与720×1280视口、HTTP主脚本哈希和25份运行证据。两视口内菜单顺序、六店选择/聚焦、步长1/10/50、坐标微调、整组六店导出与恢复、离页重进恢复、相机重置保留临时脚点、折叠后街景拖缩、三组独立显隐、顾客数量边界及U01–U03入口回归均通过。成功回调后可选只读文本框提供用户可读JSON；真实手动复制得到855字符并与DOM导出全文一致。实际位置参数可由用户发回对话，再经过正式确认后修改基线。

Clipboard API拒绝/失败分支未专门诱发；真机触控与性能、Creator Library逐UUID回读未测试。此结果是单元示例Owner验证，不构成正式QA结论。当前交付等待Tech/Master专业Review及用户审核，状态保持READY_FOR_REVIEW。
