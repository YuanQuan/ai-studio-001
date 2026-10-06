# U01 实现级构建与运行冒烟

Task `UNIT-SAMPLE-SINGLE-ENTRY-CLIENT-IMPLEMENT-001`，实现版本v0.1。本报告由Master记录真实CLI与内置浏览器结果，供Client同版交付及专业Review引用；不属于正式QA，不生成TEST_REPORT。

## 来源与引擎

当前工程全部现存assets/settings/package.json/tsconfig复制到隔离 `apps/client/temp/u01-cli-snapshot-20261006`，保留原UUID与meta，避免当前已开Editor竞争AssetDB。唯一现存Scene是 `UnitSamples.scene`，入口UUID `01e65005-5a46-45a1-9a16-820ac4b919ae`；未通过缩小范围略过活动场景。

使用锁定Creator3.8.8，按本机缓存写权限的既有约束通过Windows正式RunAs启动（admin=true），不改ACL。最终无调试构建使用官方configPath和JSON boolean debug=false；`u01-final-result.json`实际退出36，日志build17.371s，14:18:44.254退出。源工程全部assets与实际最终快照字节逐项相同，构建输出与截图hash见 `u01-final-build-identity.json`。

Creator导入/反序列化、脚本与资源打包在本次构建通过，并由实际U01运行确认加载；这不证明未涉及引擎schema/平台的完整覆盖。Chromium磁盘缓存拒绝访问及merge_dep默认值告警存在，但当前完成日志、退出36、加载与交互均正常；不将非空stderr全部判游戏错误。原始日志保留。

## 实际内置浏览器检查

HTTP `http://127.0.0.1:18039/`，仅绑定loopback，Python服务pid30044提供本次快照实际web-mobile输出。IAB tab3，稳定检查画面1040×1296。全部通过真实鼠标/Canvas输入，不使用evaluate调用游戏或注入状态。

|检查|结果|真实操作与证据|
|---|---|---|
|唯一菜单|PASS|`u01-final-menu.png`，批准U01标题、说明和唯一“进入 U01”，无旧九项入口。|
|进入四层页|PASS|点击[520,475]；`u01-final-enter.png`，四层画面和全部控件显示。|
|放大|PASS|点击+[739,1096]；`u01-final-zoom-in.png`月亮/桥几何放大，控件保持独立。|
|缩小|PASS|点击−[300,1096]；`u01-final-zoom-out.png`恢复进入尺度。|
|拖动/视差|PASS|[500,630]拖至[620,630]；`u01-final-drag.png`桥移右，天空/月与前景差异可见。|
|重置|PASS|点击[520,1096]；`u01-final-reset.png`恢复初始尺度/桥中心构图。|
|UI拖动隔离|PASS|控件根空白区[570,1050]拖至[650,1050]，`u01-final-ui-isolation.png`背景保持原构图。|
|返回|PASS|点击[520,1170]，`u01-final-return.png`返回同一唯一U01菜单。|
|重入|PASS|返回后再次点击[520,475]；`u01-final-reenter.png`回到初始四层页，控件继续存在。|
|加载与可用console|PASS|`u01-final-console-errors.json`为空；资源HTTP加载见本地http日志，无可见missing资源/unknown property提示。该查询仅覆盖工具所捕获消息。|

## 失败与修复追溯

首轮debug构建退出36，但缩放与重置实测无响应。原因是Gallery重构改用Controller按钮Map时，addComponent触发onEnable早于字段赋值；首次bindTouchControls得到空引用。Gallery修为先inactive、addComponent/填入所有依赖、active触发绑定、reset，Controller本体与UUID保留。修复前截图及日志保留，不倒写PASS。最终同版源码重新构建后上述交互实测通过。

无调试构建首次脚本拼错隔离项目路径，在项目加载前exit1；错误路径证据另存 `u01-release-wrong-path-result.json/out.log`。修正为已存在快照后release exit36，再更新修复代码并以独立final日志完成当前构建。旧失败与最新成功区分。

## 验证边界

这是实现冒烟。触屏双指、越界手势矩阵、完整功能/视觉/性能与发布目标的正式QA仍按已批QA Plan，在实现版本获用户批准后执行；本报告不批准实现、不宣称QA通过。当前无Mask背景超出边框为沿用的旧表现，批准输入未要求新裁切，本次未借清理改画面；后续调整须保持产品/视觉范围治理。
