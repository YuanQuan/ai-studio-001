# U03 五店 B 92% 字效受限栅格正式制作预案 v0.3

批次 `U03-SIGN-B92-FIVE-20261007`；状态：Art 预签，待 Tech 对**本文件同一 SHA-256** 预签后开首张正式图。范围仅 01 奶茶、02 糖画、03 炭烤、05 花灯、06 投壶；04 理发店待整体重绘方案 v0.3 用户批准和单独同版预签。本预案依据用户已批准的 B 92% 字效及 `ZCOOL_KUAILE_RASTER_RIGHTS_ADDENDUM_V02.md` 受限栅格门槛。

## 锁定输入

输入为 `psd/` 现有五店 `font_r1b` 多层 PSD，均为 1024²，脚点 `(512,900)`：

| 店 | 输入 PSD | SHA-256 |
|---|---|---|
| 01 | `shop_01_milk_tea_font_r1b.psd` | `0647E5C10569821B5F91BC79FBE80795DEAD02FCBFB5F21FCAB2995C19C739E1` |
| 02 | `shop_02_sugar_art_font_r1b.psd` | `1CF5E665D41401EED85B2EB75675BA34B7F21E7DCE7BDF070186055CA2D2326E` |
| 03 | `shop_03_charcoal_grill_font_r1b.psd` | `A51A3CDEA8C9F46316A5448E214DB374D946AA88CA1F7C2458E149431C3F3AD6` |
| 05 | `shop_05_lantern_font_r1b.psd` | `1B3EFABC77E0A04F2008D859CAEB969CA255A66CB996E3F76C68EE5536D8FB18` |
| 06 | `shop_06_pitch_pot_font_r1b.psd` | `7532C2B886AF9FFB7F0C42809F9E3F9B024E24C114BAE9221A6F2B31B5A44001` |

已批 92% 同尺度视觉样张：`preview/font_selection_wordshub/B_zcool_kuaile_styled_smaller_92/six_shop_same_scale_overview.png`，SHA-256 `858DDC2F017DE62797775F2D1C8FDCD4BB0EBD26559C69663CD559CC16C60045`。锁定渲染脚本 `source/font_candidates/render_zcool_kuaile_styled.py`，开工前复核实际脚本 SHA 并写入生产清单。候选 TTF 仅本地，实际 SHA-256 `302D8DEE7D2CB7D25D6BC89399E43513D2CAFD031862BD46BCE47F573C68807E`，name `HappyZcool-2016` Regular Version 3.12，12 字覆盖；官网原 TTF 和声明原件未取得，未作官方二进制比对。

## 唯一可改层与视觉参数

每店只替换 `sign_glyph` 为已栅格化的复合字效，并可在牌匾空白区加入最多两组小装饰的独立随字层。牌板、五金、挂位、店体、灯光、经营物、脚点、所有其他层的 RGBA 与眼睛状态均禁改；隐藏 `reference_source` 不导出。旧 PSD 原样封存，新 PSD 用新版本名，逐层 SHA 验证禁改层一致。

字效沿已批 B 样张：同一站酷快乐体字芯；原 alpha 源像素半径 3 圆盘膨胀形成同色系深色粗圆底，半径 6 外扩形成约 3 px 浅色窄描边，向右下 `(4,4)` 源像素浅立体背面；少量顶侧亮边。整体字效围绕原牌定位框中心等比至 **92%**，包括圆底、描边和立体。每牌最多两组 `≤22×12` 源像素装饰。保留字孔、准确简体牌文、牌框留白，不生成屋顶 LOGO。

## 输出与验收

每店输出新独立 PSD、`body`/`sign` 两片 1024² RGBA、同尺度重组、390×844 与 720×1280 全视口投影、四底 alpha 检查、逐字 bbox/字高/有效细笔、`sourceRect`/`originalSize`/`foot=(512,900)`、资产 ID/路径/版本/SHA。390 宽按现行保守 1024→316 CSS px 投影，字芯高候选线 ≥24 CSS px，有效细笔 ≥2 CSS px；若未达须修订并复核，不靠局部放大声称通过。两片合成须与 PSD 可见工作层重组一致，最大仅容许 1/255 alpha 舍入。Tech 后验还需核两片纹理与运行风险；静态图不能代替 Creator 实测。

预签完成才改五份正式字层。五店实图及六店未来合版均需用户 Gate2 对具体切片批准后 Client 才正式接入。组织 Agent 自行切图按项目契约提交实际切片和同尺度重组后直接交用户审核，保留 Art/Tech 对生产过程的检查记录。

## 权利与停止条件

本批仅产固定六店牌文的静态栅格像素；TTF 仅本地，不能进 PSD、仓库、游戏包或外发包，不能改字体软件本身。官方免费商用发布声明 URL、候选来源 URL、字体指纹和原包未比对事实写入清单。正式暂存前核 `.gitignore` 与 staged 文件；若误包含 TTF/OTF/WOFF/ZIP/DOCX，停止提交。若官网原件后续显示不一致或限制商业牌匾图片、需分发字体软件、缺字错字、禁改层变化、两片不符、四底脏边、字孔粘连或小屏线宽不合格，停止出片并回报 Master。

## Art 预签

Art 对本版五店输入指纹、字效视觉锚点、仅字层改动、受限栅格用途与交付列表预签。`04` 不在本预签范围；本签名不表示正式图已制作或 Gate2 已通过。Tech 必须对本文件相同 SHA 独立签认后才能开首张正式图。
