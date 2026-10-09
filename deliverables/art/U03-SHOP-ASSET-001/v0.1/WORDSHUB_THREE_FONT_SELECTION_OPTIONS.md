# U03 六店牌匾字体选型稿：站酷文艺体／站酷快乐体／一点颜体

版本：选择稿 2026-10-07。仅供用户比较字体气质；未修改六店正式 PSD、切片或客户端资源。六店保持原牌匾形制和位置。04 理发店仍是旧视角，后续按单独角度方案修订。

## 视觉对照

- 三案六店同尺度总览：`preview/font_selection_wordshub/requested_three_fonts_six_shops_comparison.png`，SHA-256 见下方封存表。
- 各案六店单独总览：`A_zcool_wenyi/six_shop_same_scale_overview.png`、`B_zcool_kuaile/six_shop_same_scale_overview.png`、`C_i_yanti_mixed/six_shop_same_scale_overview.png`，均在 `preview/font_selection_wordshub/` 下。
- 每案的 `shop_01_390x844.png` 至 `shop_06_390x844.png` 为 390×844 视口投影，路径在各案目录下；另留同名 `shop_XX_full.png` 原尺度选择图。

| 案 | 字体气质与牌匾效果 | 12 字覆盖 | 390 投影最小字框高 | 本轮状态 |
|---|---|---|---:|---|
| A 站酷文艺体 | 工整、有轻微书写感；双字牌较稳 | 12/12 | 24.07 CSS px | 可选视觉方向，正式使用前核原版声明及文件一致性 |
| B 站酷快乐体 | 更厚、更活泼；小屏上更醒目 | 12/12 | 27.77 CSS px | 可选视觉方向，正式使用前核原版声明及文件一致性 |
| C 一点颜体 | 颜体笔势较强，但简体字不齐 | 9/12 | 25.92 CSS px（混排图） | **混排演示，非完整字体方案** |

C 的原 TTF 缺「发、灯、壶」。选择图中这三字临时由思源宋体替代，图注已明示；不能把图中六块牌匾称为纯一点颜体。字框高仅是选型图几何检查，正式资产的细笔、对比和运行性能仍须按生产批次复核。

## 字体来源、授权与风险

本轮从用户指定的 [wordshub/free-font](https://github.com/wordshub/free-font) 聚合仓库取得实际 TTF，并读取字体内部名称表、版本、版权字段和六店 12 字的 cmap。完整机器审计为 `source/font_candidates/wordshub_requested/FONT_LICENSE_AUDIT.json`。聚合仓库的“免费”描述本身不作为正式商用许可。

| 案 | 当前实际文件 SHA-256 | 原发布方证据 | 正式生产前尚须核验 |
|---|---|---|---|
| A | `92F38E2C2CFBFE2760A26A4273C3505C1A1AEC41AADA725EEBA416C15E131FBD` | [站酷文艺体发布页](https://www.zcool.com.cn/assets/ZNzg1Ng==)标示免费授权使用并包含商用；TTF 内为 `zcoolwenyiti` Version 1.000 / 2018 zcool | 取得发布页所列原版 TTF 与《站酷文艺体使用必读声明》，比对字节／版本及图片输出、嵌入、分发条款 |
| B | `302D8DEE7D2CB7D25D6BC89399E43513D2CAFD031862BD46BCE47F573C68807E` | [站酷快乐体 2016 修订版发布页](https://www.zcool.com.cn/assets/7285916528355077132.html)标示免费授权使用并包含商用；TTF 内为 `HappyZcool-2016` Version 3.12 / LiuBingKe 2016 | 取得发布页所列原版 TTF 与《站酷快乐体（修订版）使用声明》，比对字节／版本及图片输出、嵌入、分发条款 |
| C | `7ABA8F5BB77EA7E0FC37C0E5E709BD8E1D49B44A3C91EB503F426562602F9C2A` | [一点颜体上游项目页](https://founder.acgvlyric.org/iu/doku.php/%E9%80%A0%E5%AD%97:%E9%96%8B%E6%BA%90%E5%AD%97%E5%9E%8B_i.%E9%A1%8F%E9%AB%94)及字体内嵌字段指向 GNU GPL 2.0+；TTF 内为 `I.Ngaan` Version 1.004 | 上游发布包未与聚合仓库文件比对；需解决三缺字、GPL 交付义务，并对王汉宗字体系的历史 IP 争议作独立确认 |

[wordshub README](https://github.com/wordshub/free-font) 自身在王汉宗系列段落记录与文鼎字体相似及版权争议。因此 C 可以用于本次直观比较，**不能据此直接进入正式商用资产**。A/B 的发布页商用表述提供了积极证据，但当前所用二进制来自聚合库，尚未取得其随附声明原件并完成官方文件比对；不能把它们误称为 OFL。

## 文件封存

以下 SHA-256 对应当前选择稿；若改图须重新封存。

| 文件（相对本目录） | SHA-256 |
|---|---|
| `preview/font_selection_wordshub/requested_three_fonts_six_shops_comparison.png` | `89043186CF9CB2E107B46E4E9BB461B3B3D859C7D1AEE137D111957669E2A114` |
| `preview/font_selection_wordshub/A_zcool_wenyi/six_shop_same_scale_overview.png` | `9B19E2FBF8A5E90324FD2CFB1D6CDCD212F92CDE92050F27FC0E6C6AE826406F` |
| `preview/font_selection_wordshub/B_zcool_kuaile/six_shop_same_scale_overview.png` | `22F4489691A207CC066ED20F058079DCFDA770FCA86AD8935FF3C02D79EB8791` |
| `preview/font_selection_wordshub/C_i_yanti_mixed/six_shop_same_scale_overview.png` | `68A2887BFA4F74EBF119E9A892E9AFCD84EF0D9FF2FF541E3B4E36791EA8BC7E` |

确认字体视觉方向后，Art 将先完成正式字体文件许可核验，再将所选字形与 04 视角方案纳入对应的制作预案和门禁。当前 R1B 正式 PSD 与切片保持原样，不能把本选择稿视为 Gate2 或 Client 接入批准。
