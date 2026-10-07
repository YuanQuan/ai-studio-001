# U01 温和地府元素｜Art / Tech / Client 切图协作记录 v0.2

批次：`U01-GENTLE-UNDERWORLD-ASSET-001/v0.2`。Gate1 与 Art/Tech 同 SHA 预签已完成；本记录是实际切图后的边界和交接讨论，**不替代用户对本版切图效果的 Gate2 审核**。Art 与 Tech 在 v0.2 对实际新文件复核；Client 的同名四图/UUID/视差边界意见来自 v0.1 试制时的只读协作，本版未重新要求 Client 修改或签新资源效果。三方均未修改 Cocos 工程。

| 角色 | 已核内容与结论 | 后续边界 |
|---|---|---|
| Art | 从修订 PSD 保存后的九个栅格层按四个原有语义导出四张 2172×724 RGBA，全画布原点 (0,0)，L03 合花/景石/牌匾，L04 合桥刻；五个对象的 SVG 原路径、透明层和局部差异已留档。旧 L01/L02 导出 SHA 与旧版完全相同，L04 四边 RGBA 与旧版相同。`review/overall_from_psd.png` 为四张同尺度重组。 | 用户 Gate2 批准具体版后才能将新 L03/L04 交正式客户端；不制作第五视差层、不 trim、不改旧 PSD。 |
| Tech Lead | 同批预签 `TECH_PREFLIGHT.json` 对预案 SHA-256 `F64D3B8E8AEEF654DEF21C163F9C5692DC919A4F6EC973FE35176E4DBB7D1416` 为 `APPROVED`。切图后独立只读核：四张 2172×724 RGBA，L03 2957、L04 344 个变化像素均在批准候选盒；四层 alpha bbox 不变、L04 边缘不变，2172×724 与每侧 2 UI guard 的现有镜头几何前提仍在。四张 RGBA8 展开合计约 23.995 MiB；未增第五纹理页。Tech 特别要求记录方案盒按闭区间，bbox 用右/下不包含，及四导出重组与 PSD 存储预览最多 1 色道值差异。 | PNG 压缩后体积不等于 GPU 内存；实际纹理格式、目标机内存、Draw Call、帧时、采样边缘待获批接入后实测，不能凭静态数据标 PASS。 |
| Client | v0.1 试制时只读核现行 `pf_street_base_01.prefab` 固定四节点 L01_Sky / L02_Mountains / L03_Ground / L04_Foreground；现行四 SpriteFrame UUID 依次为 `7108d512-5f6f-42d1-9411-c6f48de13939@f9941`、`c788f23d-127c-48a9-890c-36679d56dce4@f9941`、`8fae7865-9c46-46f6-8484-849ebe8a6634@f9941`、`685d480f-3b1a-4f77-b796-79b9ec5de834@f9941`。本版 Art/Tech 核四候选 PNG 与工程现用文件仍同名、同 2172×724；v0.2 的实际 SHA 以 `CUT_MANIFEST.json` 为准，不把旧 Client 咨询当成 v0.2 实测。现控制器视差 `[0.3,0.8,1,1]`、zoom 1–1.8、前景边缘 guard 2 UI 单位；保持四张完整画布、文件名、ID、层序。 | Gate2 用户批准后 Client 才可按正式流程替换 L03/L04 文件字节并保留既有 `.meta`/UUID 与 Prefab 引用；再核 Creator 导入、所有手机比例边缘、悬浮控件遮挡、真实资源消耗。当前工程仍是旧版，不将候选 PNG 的 hash 写成已导入 hash。 |

方案坐标例如 `x920–948` 按两端均含；本批程序 bbox `(x0,y0,x1,y1)` 按左/上含、右/下不含。Tech 指出的 x948 四像素及 x165 三像素合计七个端点差异，均位于已批闭区间内。最终四图和实际源映射以 `CUT_MANIFEST.json` 为唯一逐文件清单。
