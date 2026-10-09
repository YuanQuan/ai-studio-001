# U03 六店牌匾修订｜首图前 Art 同批预签 v0.2

状态：**Art 已签认制作预案；须待 Tech Lead 对同一批次完成首图前文字预签后才制作首张正式样张。** 用户已明确批准 `PRODUCTION_PLAN.md` v0.2 SHA-256 `8C193C9E43B8AE6F89AAC816D06DD70A72BC672E27141FC384A698F5561BFA7D` 进入制作；本预签不替代实际切片的第二次用户审核。

## 同批输入与边界

- 同一视觉范围：`VISUAL_ANCHORS.md` SHA-256 `32D039DA35BDDB03F83D800CE1DB22B404ABB19D122E45163565AAB9441BAACD`；`SOURCE_FEASIBILITY.md` SHA-256 `3706A0BF82ADF6142F5EBD95C7CF49247DF46C2758E7D5F403287C2A4A687CE4`。
- 正式像素底板：`../v0.1/SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json` 精确列出六 PSD 与两片；v0.1 原文件、源图和 `source/psd_work` 一律不覆盖。
- 方向输入：`../v0.1/preview/mixed_signs_v04/six_shop_mixed_signs_overview.png`；只从已授权图中按对象抽杯标、糖勺糖浆与剪梳图形作为独立透明层，保存原图及抽取/补绘记录；不截整店或主场景替换原 PSD。
- 画布：六店各 1024×1024 RGBA，foot `(512,900)`；body/sign 全画布同坐标，原稳定资产 ID 与客户端现有 `.meta`/Prefab 身份保持。六店排列、店体轮廓、经营物与近正面角度不变。

## 图层到切片预案

| 店 | 源层修订及预期导出 |
|---|---|
| 01 | 从 `source/psd_work/shop_01/full_redraw_v04/` 复制各层；旧 `sign_hardware/sign_board/sign_glyph` 退出可见合成。原 body 在旧横匾后 x 约 346–678、y 约 470–591 存在矩形透明缺口；只在该处沿原立面/帘幕局部补画并保留修补层。新右檐小木牌分挂件、牌板、logo 透明层。**body 与 sign 都将重新导出并提交 Gate2。** |
| 02 | 从 `source/psd_work/shop_02/zcool_b92_v03/` 复制层；旧竖牌三层退出，已查看旧 body 不含该牌。目标小“糖”可从原 `sign_glyph` 对象区域取原像素；糖勺糖浆参考已授权预览单独抽层。新牌在车前偏右，需保留车轮、糖画和地影可辨。**body 优先原字节继承，sign 新导出。** |
| 03 | 从 `source/psd_work/shop_03/zcool_b92_v03/` 复制层；牌板/挂件/店体保留，仅替换字层，沿用原“烤”对象像素并为新“现”建立同光感独立字层。新字正式生成前核官方字体文件 SHA/字形/许可，或使用有源稿的原创字形。 |
| 04 | 从 `source/psd_work/shop_04/full_redraw_v03/` 复制层；店体与牌板保持，撤原“理发”字层；在牌面加入从授权预览定向抽取或局部补绘的剪刀/梳子独立层。 |
| 05/06 | 复制各自 `zcool_b92_v03` 源层；保留现有“花灯”横牌和“投壶”竖牌的字、板、挂件**原像素**。同尺度核对若已符合锚点，正式导出索引沿用旧 PNG 与 SHA，不为凑新文件改字节。 |

## 首图与批量顺序

代表样张先做 01 与 02，逐项检查旧牌完全移除、01 补洞的立面连续性、右檐挂点与右灯/窗口、02 车前牌与轮/地影/画布边距。需给出新旧 body/sign alpha bbox、旧新版 1024² 重组、关键局部放大、390×844 与 720×1280 同尺度静态视窗。两店样张经 Art 逐锚点自审与 Tech 实图后验后才扩至 03–06；新切片提交 Gate2 前六店需完整清单和六店总览。静态视窗不是 Creator 实际运行。

## 权利与可编辑性

预览源图的原样取像素仅覆盖小图形对象，不包括预览中的生成文字、整店店体或夜市背景。原 PSD 语义层可独立显隐；01 旧牌下的隐藏背面不完整，补画严格限于暴露区，记录修补遮罩和与旧店体未改区的差异。`bggg-creator-image2psd` 只用于现有全画布图层组装并保留源图、manifest、预览和图层编辑限制。官方 [ZCOOL KuaiLe 上游](https://github.com/googlefonts/zcool-kuaile) 与其 [SIL OFL 1.1](https://github.com/googlefonts/zcool-kuaile/blob/main/OFL.txt) 已发现；实际新字使用前必须将下载的官方 TTF 与本地旧文件逐项核 SHA/名称/字形，不把官方仓库存在视为本地旧字自动同源。字体软件不随 PSD/仓库/游戏包分发。

## Art 预签结论

**Art：`APPROVED_FOR_BATCH_PREFLIGHT`，仅指上述固定范围与源层方法可用于首图前同批签认。** 当前新图、新 alpha/内存、实际切片与运行检查均 `NOT_TESTED`。Tech 同批预签、用户 Gate2 实片审核和后续 Client 接入各按既有两次用户审批流程执行；不新增审批门禁。
