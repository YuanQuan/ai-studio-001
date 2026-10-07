# U01 温和地府元素｜v0.2 来源与实际重新制作记录

## 门禁和输入

Gate1 `U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.1` 为 `USER_APPROVED`。本版首图前 `PREFLIGHT_PLAN.md` SHA-256 `F64D3B8E8AEEF654DEF21C163F9C5692DC919A4F6EC973FE35176E4DBB7D1416`，Art 于 2026-10-07 12:50:39 +08:00、Tech 于 12:51:24 +08:00 对**同一 SHA**分别 `APPROVED`。v0.2 首个新 PNG 创建于 12:53:41 +08:00，签认在先；`source_build/runtime_before_render.json` 于 12:53:09 +08:00 写明此前 v0.2 目录内 PNG/PSD/SVG 文件数为 0，记录当次 Node `v24.19.0`、sharp `0.35.4`、libvips `8.18.6`、librsvg `2.62.91` 与绘图脚本/预案 SHA。旧 v0.1 因栅格化工具未列入预签，已在 `v0.1/PROCESS_DEVIATION.md` 冻结为 `HISTORICAL_TRIAL_NOT_FOR_GATE2`，其 PSD/PNG 未复制为本版。

实际输入是已批 `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`（SHA-256 `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`）及预案锁定的五份原创 SVG 路径源。源 PSD 独立 raw-channel 回读出四层，各层 RGBA 与已批四张旧 PNG 逐像素相同。五 SVG 由 Art 手写路径构成，含原创逐笔“忘川”；`make_local_art.js` SHA-256 `E9D5F48B9CD6D3C59257DD3C778F7B29B91B82A56DA0DCBAE4C87435A20D0A81`。运行该脚本在 v0.2 目录**重新写出**五份 SVG 和五张透明全画布 PNG，五 SVG SHA 与预案锁定值逐件相同。没有新 imagegen、外部图片、网络参考、第三方字体或游戏截图输入。

旧已批 `RIGHTS_AND_SOURCE.md` 登记用户原话“我拥有原图及商用改编权”。公开 [OpenAI Terms of Use—Content](https://openai.com/policies/terms-of-use/) 与 [Service Terms §6](https://openai.com/policies/service-terms/) 已核；本批不把公开条款推断为用户特定账户合同或第三方权利独立证明。五处新增路径的内部初筛未见模仿某一可识别外部作品；这并非法律鉴定。实际制作工具来自本机 bundled runtime：`sharp/package.json` 标 `Apache-2.0`、同目录有 `LICENSE`，bggg skill 本地 `LICENSE` 为 MIT（BGGG 2026）；Pillow `12.3.0`、NumPy `2.3.5`、Python `3.12.14` 用于源回读、导出及核验。工具及二进制依赖均未放入游戏运行包，间接依赖许可没有逐项独立核清。

## 实际加工与视觉修订

1. `source_build/make_local_art.js` 用本版运行环境重渲染 GU-01a/b 两簇短圆彼岸花、GU-02 桥心三瓣莲水纹、GU-03 低矮横向园景石、GU-04 牌匾手绘“忘川”。五份 SVG 在 `source_build/editable_strokes/`，五张 2172×724 RGBA 对象层在 `source_build/local_layers/`。候选盒沿已批方案；方案端点是闭区间，脚本 bbox 右/下不包含。
2. `source_build/build_psd_and_exports.py` 从已批旧 PSD 再次独立读取四层，核与旧 PNG 像素一致；调用签认的本地 `bggg-creator-image2psd/scripts/image2psd.py assemble`，按 L01、L02、L03、GU-01a、GU-01b、GU-03、GU-04、L04、GU-02 写出新九层 PSD。它随后从**保存后的本版 PSD**回读九层，合出四张正式候选语义 PNG 和同尺度整体重组图；原旧 PSD 及 v0.1 试制文件未改动。
3. `source_build/render_viewports.py` 依现行 Client v0.2 的 720 逻辑宽、前景 2 UI 单位边缘余量、zoom 1–1.8、视差 `[0.3,0.8,1,1]` 对四张本版 PNG 分层投影，输出 9:16、9:18、9:19.5、9:20、9:21 各六状态共 30 张和总览。30 张合成的最小 alpha 均为 255、透明露底像素为 0。它们没有悬浮控件，**不是 Creator 运行截图**。
4. `review/local_detail_board.png` 是从本版四张 PNG 的同尺度重组图裁取四处局部后添加审核标签，没有另绘内容或改变正式画面。它用于让用户看清小元素；`review/overall_from_psd.png` 与四张导出是效果事实源。

视觉打磨发生于冻结的 v0.1 试制期：第一眼自审将偏直立的景石压成低矮横向园石，把易读成 X 的桥纹改为三瓣莲，并给花梗加深青叶片遮脚。v0.2 仅对这组已锁定且获 Art/Tech 预签的最终 SVG 路径重新渲染，未改变 Gate1 内容与范围。v0.1 第一轮预览被同名脚本覆盖，不能当可核原始图；此事实已在 `v0.1/SOURCE_AND_EDIT_RECORD.md` 披露。

## 实测差异和限制

`CUT_MANIFEST.json` 列本版 PSD、四张 PNG、五个 SVG/透明层、整体/视窗图的真实路径与 SHA。L01/L02 新 PNG 连文件 SHA 与旧版一致；L03 有 2957、L04 有 344 个 RGBA 差异像素，均在已批闭区间局部盒内；L04 四边 RGBA 与旧版相同，四张 alpha bbox 均不变。四图先合成与九个 PSD 栅格先合成存在局部 8 位 alpha 舍入差，最大每色道 1 值、561 个色道值不同；未批准区域无差，`review/psd_stored_preview.png` 与 `review/overall_from_psd.png` 分别保留两种结果，不声称完全逐像素同一。

由于已签绘图脚本、五份 SVG 和旧 PSD 完全相同，v0.2 的 PSD/四 PNG SHA 与 v0.1 试制出现**确定性同值**；这不意味着复制了旧二进制。v0.2 的首图前运行时日志、12:53:41 新 PNG 文件创建时刻、12:54:20 新 PSD 文件创建时刻、独立重跑输出和本版源目录构成重新生产的证据。两版审批状态仍分别记录，v0.1 不能因 hash 同值获得追溯预签。

新 PSD 九层可独立开关/移动，五 SVG 路径源可改；PSD 内为栅格层，非原生矢量/文字对象。Photoshop/Photopea GUI 打开与实操、悬浮控件遮挡、Creator 导入和目标机内存/Draw Call/帧时均 `NOT_TESTED`，具体 Gate2 批准前不接入工程。
