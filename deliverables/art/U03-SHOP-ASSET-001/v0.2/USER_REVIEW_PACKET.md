# U03 六店牌匾 v0.2｜Gate2 实片用户审核包

本包依据用户已批准的 v0.2 制作方案完成。**请以[六店同尺度重组总览](preview/sign_revision_v02_final/six_shop_same_scale_overview.png)为主入口**，并查看[12 片透明切片联系表](preview/sign_revision_v02_final/twelve_slices_checker_sheet.png)。联系表左列为 body、右列为 sign；蓝底总览由对应两片在 1024×1024 同原点重组后缩成相同尺度。此包是实际 PSD/PNG 候选切片，不是生成式方向图。

| 店 | 实际变化 | PSD | body PNG | sign PNG | 重组 | 390 / 720 静态视窗 |
|---|---|---|---|---|---|---|
| 01 奶茶 | 旧大牌撤除并局部补缺口；右檐小木牌杯叶 logo | [PSD](psd/shop_01_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_01_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_01_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_01_recomposed.png) | [390](preview/sign_revision_v02_final/shop_01_390x844.png) / [720](preview/sign_revision_v02_final/shop_01_720x1280.png) |
| 02 糖画 | 大侧牌改车前小牌；勺浆指向原正式字形“糖” | [PSD](psd/shop_02_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_02_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_02_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_02_recomposed.png) | [390](preview/sign_revision_v02_final/shop_02_390x844.png) / [720](preview/sign_revision_v02_final/shop_02_720x1280.png) |
| 03 现烤 | 原左竖牌上“炭”换合法源“现”；原“烤”字像素保留 | [PSD](psd/shop_03_charcoal_grill_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_03_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_03_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_03_recomposed.png) | [390](preview/sign_revision_v02_final/shop_03_390x844.png) / [720](preview/sign_revision_v02_final/shop_03_720x1280.png) |
| 04 理发 | 原檐下横牌框/纸芯内换剪刀与梳子 | [PSD](psd/shop_04_barber_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_04_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_04_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_04_recomposed.png) | [390](preview/sign_revision_v02_final/shop_04_390x844.png) / [720](preview/sign_revision_v02_final/shop_04_720x1280.png) |
| 05 花灯 | 原牌已符合方向，PSD 与两片原字节沿用 | [PSD](psd/shop_05_unchanged_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_05_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_05_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_05_recomposed.png) | [390](preview/sign_revision_v02_final/shop_05_390x844.png) / [720](preview/sign_revision_v02_final/shop_05_720x1280.png) |
| 06 投壶 | 原牌已符合方向，PSD 与两片原字节沿用 | [PSD](psd/shop_06_unchanged_sign_revision_v02.psd) | [body](exports/sign_revision_v02_final/tex_u03_shop_06_body_sign_revision_v02.png) | [sign](exports/sign_revision_v02_final/tex_u03_shop_06_sign_sign_revision_v02.png) | [重组](preview/sign_revision_v02_final/shop_06_recomposed.png) | [390](preview/sign_revision_v02_final/shop_06_390x844.png) / [720](preview/sign_revision_v02_final/shop_06_720x1280.png) |

## 审核重点与实际核对

1. 01 小牌在右檐下，杯、珍珠、叶可辨；原檐下大匾已清除，幕帘与瓶罐保留。旧牌后仅 `(346,470,678,591)` 缺口局部补像素，主体其他区无差异。小牌 logo 取已授权方向图的低分辨率局部，保留栅格笔触；放大后线条较原 PSD 高分辨率经营物柔和，请按 390/720 实际静态视窗判断。
2. 02 勺尖和糖浆流线向下指向小“糖”；“糖”来自原正式 PSD 独立字层，首次 r1 预览字已撤。旧车轮、红伞、糖画剪影及 body PNG 原字节未动。
3. 03 左侧牌实际写“现烤”，原“烤”字原像素，官方 OFL 字体新“现”加厚笔画并仿旧暖橙暗棕字效；烟与串物未动。04 横牌保留原框与纸芯，剪刀/梳子来自已授权方向图局部，第二指环作局部栅格修复以提高 390 宽可读性。05/06 完全沿用原版 PSD 与两片。[03／04 局部修订记录](FINAL_LOCAL_REVISION_03_04.md)保留先前候选对照。
4. 六店均为 1024×1024 RGBA、脚点 `(512,900)`。六套 PSD、12 张切片、六套重组、390/720 静态视窗均有实存 SHA，见 [切片清单](CUT_MANIFEST_V02.json)；未修改区差异像素均为 0，见[差异与重组报告](DIFF_AND_RECOMPOSITION_REPORT.json)。[PSD 图层映射](PSD_LAYER_EXPORT_MAP.md)说明逐层来源与可编辑边界。

这份候选尚待本轮 **Gate2 具体实片与重组效果**的用户明确批准。当前未替换 Client 已导入贴图；390/720 为静态视窗，正式接入后的 Creator 运行、目标设备与性能仍按后续流程核验。
