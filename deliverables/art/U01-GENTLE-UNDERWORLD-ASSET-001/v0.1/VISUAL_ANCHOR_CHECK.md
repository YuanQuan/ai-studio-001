# U01 温和地府元素｜实图逐锚点自检 v0.1

对照基线：已批 `UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` 的旧 PSD/同尺度重组，以及 `U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.1/VISUAL_ANCHORS.md`。本表是 Art 对**本批真实修订图**的自检，供用户 Gate2 判断；不是 Client 或 QA 运行结论。证据新图为 `review/overall_from_psd.png`、`review/portrait_viewports.png`、`review/viewports/` 30 张单独静态艺术投影；旧对照为 `deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png` 与旧 Client v0.2 的 `evidence/` 运行截图。

| 视觉锚点 | 结论 | 证据与具体观察 |
|---|---|---|
| 构图与视角 | PASS | 旧四层在新 PSD 中逐像素保留；新四张仍 2172×724 同原点。整体重组中月、山、柳、桥、河、右牌楼位置保持；`review/viewports/9x19_5_center_min.png` 仍以石桥和暖灯为焦点。 |
| 桥、河与通行空间 | PASS | `review/second_pass_bridge_new.png` 的三瓣莲与短水纹仅在桥中石面，未遮拱洞和栏杆；左右花从桥侧灌木露出，不入步道。`CUT_MANIFEST.json` 确认旧区外 RGBA 不变，河灯与原通路保持。 |
| 色彩与光 | PASS | 花为小范围暗珊瑚与蓝绿，桥纹低对比青玉灰，匾字暖米金；`review/overall_from_psd.png` 的冷蓝夜景与暖橙灯仍主导。未做全局调色或新增大面积光源。 |
| 形状与情绪 | PASS | `review/second_pass_waystone_new.png` 改为低矮横向园景石并由叶片遮脚；花瓣短圆，石刻为三瓣莲，右匾为手绘“忘川”。无血、墓碑式立面、鬼脸、刑具或恐怖符号。第一轮高立石/X 形桥纹的反馈已在本版定向修正；原始第一轮预览二进制未留存，详见 `SOURCE_AND_EDIT_RECORD.md`。 |
| 遮挡与层次 | PASS（静态） | 花/景石/匾字归 L03、受旧 L04 前景遮挡；桥纹归 L04。四层视差语义维持 `[0.3,0.8,1,1]`；L04 四边 alpha/RGBA 与旧版相同，五处之外新旧逐像素一致。`source_build/viewport_validation.json` 的 30 张静态投影均无透明露底。Creator 实际采样边缘仍未测。 |
| 手机中/左右视野的内容可读 | PASS（静态） | 9:16、9:18、9:19.5、9:20、9:21，每种中心/左右极限与倍率 1/1.8 的共 30 张分层投影见 `review/portrait_viewports.png`。中心初始可见两花和桥纹；放大中心仍见桥纹；左端两倍率可见低景石，右端两倍率可见匾内“忘川”。彼岸花在放大中心可退出画面，符合已批方案。 |
| 返回与减/重置/加悬浮控件无遮挡 | NOT_TESTED | 本批静态投影**没有绘制任何控件**，不能据其声称实际控件遮挡已通过。新增元素均在旧画面的中部植被、桥石和右牌匾，按旧 Client v0.2 控件位置作静态低风险判断；实际 Creator 运行和触控遮挡须 Client 接入获批资源后复核。 |
| 源文件可追溯、权利与原创 | PASS（文件追溯）；第三方权利独立核验 NOT_TESTED | `SOURCE_AND_EDIT_RECORD.md`、`PSD_EDITABILITY_REPORT.md` 与 `CUT_MANIFEST.json` 记录旧源哈希、新 PSD/四图/五 SVG 哈希和实际可编辑范围。用户原图商用改编权声明已登记；本批无外部图和字体。公开条款已查，但特定合同/第三方相似权利未作独立法律核定。 |

Art 对实际**画面外观**的本轮结论：可提交用户 Gate2 审核。是否喜欢元素密度和文案，由用户对具体本版图片决定。正式资源接入、目标手机、性能、交互与悬浮控件为后续 Client/QA 范围，当前 `NOT_TESTED`。
