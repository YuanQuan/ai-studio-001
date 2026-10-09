# U03 六店牌匾三套免费字体选择稿 v0.1

用户最新反馈当前牌匾字体仍不好看，要求先提供三套方案供选择。本稿是**视觉选择资料**，不是正式 PSD/切片，也不触发 Gate2。三案均套在同一六店店体、同一牌底/挂件、同一字盒、同一色值和同一 1024² 母版上；390×844 候选统一把 1024 源宽显示为 316 CSS px。04 理发店**仍是旧视角，视角修订另走 `BARBER_ANGLE_REVISION_PLAN.md` 的独立门禁**。已有 Ma Shan Zheng R1B 不计入这三案，保留为历史。

总览：`preview/font_selection_3/three_fonts_six_shops_comparison.png`，SHA-256 `F99FE76C39A366D0974657F255ED89D3D9AC418FA260574298C5F08670C0D0ED`。六列依次奶茶、糖画、炭烤、理发、花灯、投壶；三行依次 A/B/C。逐案六店同尺度大图与每店 390×844 全视口样张如下。

| 方案 | 字体气质与画面 | 六店同尺度总览 / SHA-256 | 390 全视口样张 |
|---|---|---|---|
| A 霞鹜文楷 | 书卷、清秀，横竖笔画较轻；适合温和的夜市招牌，极小视口细笔需在正式制作时复核 | `preview/font_selection_3/A_lxgw_wenkai/six_shop_same_scale_overview.png` / `94F4C02D65FBF554751D1889480053DD2E90DF3A454B902F71DDBD52B686660C` | 同目录 `shop_01_390x844.png` … `shop_06_390x844.png` |
| B 思源宋体 | 稳重、有宋体衬线和题字感；本选择稿取官方可变字体 weight=700 | `preview/font_selection_3/B_noto_serif_sc/six_shop_same_scale_overview.png` / `238413FAD2C149806458C49A3A343B73C2B8DF8583437FC581B60C2DBDD04130` | 同目录六张 `shop_0x_390x844.png` |
| C 得意黑 | 窄斜、现代美术字感，对比最鲜明；与传统瓦木风格的融合由用户选择 | `preview/font_selection_3/C_smiley_sans/six_shop_same_scale_overview.png` / `9B89B425F4A37169A767AD6C4D37077146E0CE32CF19860AC0E6EA0E01D387AA` | 同目录六张 `shop_0x_390x844.png` |

三案各 12 字实际 alpha bbox 在静态 390 投影下最低分别为 A `25.30`、B `26.54`、C `27.77` CSS px；这只说明高度，**未**替代正式资源需要的核心细笔≥2 CSS px、牌底对比、Creator 实际可读性检查。正式选定后，Art 与 Tech 再对选中字形和必要的牌内笔宽微调同版预签；只定向替换六 PSD 的 `sign_glyph`，并重核 04 角度修订版、两片重组、双竖屏投影、授权、哈希，交用户具体 Gate2 审核。

## 字体文件与授权核对

三套实际源文件及许可全文保存在 `source/font_candidates/three_options/`，机器可查记录为同目录 `FONT_LICENSE_AUDIT.json`。三套实际 TTF 均覆盖「奶茶糖画炭烤理发花灯投壶」12 字；本选择稿只生成栅格预览，游戏包不包含字体文件。SIL OFL 1.1 许可文本允许在条件下使用、修改和分发字体；后续若改成把 TTF 嵌入或随游戏分发，须按实际分发方式复核许可及保留文字。三套都不会把第三方图像素材引入店体。

| 方案 | 官方来源与许可 | 实际文件、内部版本与 SHA-256 | 许可副本 SHA-256 |
|---|---|---|---|
| A | [LXGW WenKai 官方仓库](https://github.com/lxgw/LxgwWenKai)、[OFL 原文](https://github.com/lxgw/LxgwWenKai/blob/main/OFL.txt) | `LXGWWenKai-Regular.ttf`；Version 1.522；`39AD71264B588165B469E35E6AFB162A378DACD1F95348160240BA9038AC3009` | `1A25E35DA1031C6C3436FDE545BB9CB5ACA954E9873AFE510C834B8B79BD21A0` |
| B | [Google Fonts Noto Serif SC 官方目录](https://github.com/google/fonts/tree/main/ofl/notoserifsc)、[OFL 原文](https://github.com/google/fonts/blob/main/ofl/notoserifsc/OFL.txt) | `NotoSerifSC-wght.ttf`；Version 2.003-H1、字重轴 700；`050080D9255A86808F2945BFFAC582B31EF32BC36411CE29563B4961670C66F9` | `5E0DA210FB04058A8C0087985D2D456B931C2579811A49655721D3CF0C36B6D6` |
| C | [得意黑官方 v2.0.1 发布](https://github.com/atelier-anchor/smiley-sans/releases/tag/v2.0.1)、[OFL 原文](https://github.com/atelier-anchor/smiley-sans/blob/main/LICENSE) | 官方 zip 中 `SmileySans-Oblique.ttf`；Version 2.0.1；`B447D7E781F08BC95C4C9F23BA71ED2B8EBB639AA7184485C71C4CA5AFCD25C4` | `9401F4050F1B66C26B6CCDC8B0E14A3C1CC37AAC122EDA84386F25854A9BEC72` |

本稿推荐用户先看三张六店大图，再逐店放大 390 样张比较。选择 A/B/C 是字体方向选择，**不**批准当前 04 屋体角度，也不自动批准最终切片。
