# U01 v0.3 来源与实际制作记录

- 已批 Gate1 方案：`U01-GENTLE-UNDERWORLD-ART-PLAN-001/v0.2`，Producer 已登记 `USER_APPROVED`。首图前 Art/Tech 对同一预案 SHA-256 `321F07CAA3C3096C30EC809FF88C323EDDF45D9409840C4A8D5E7EEA5EA3AD4F` 分别签认；详见 `ART_PREFLIGHT.json` 与 `TECH_PREFLIGHT.json`。
- 旧场景唯一底本：`deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`，SHA-256 `428A7B1CBEE4FB775D90D84401F4558F12FB93B0E3D60F57067D574CE969D6ED`。保存的 PSD 四层经独立回读，与批准的四张 PNG 逐像素相同。没有使用被用户退回的 v0.2 花、莲纹、景石、忘川 PSD/PNG/SVG/笔触。
- 新六件由本批原创 path-only SVG 绘制；无外部图片、字体、模板或 `<text>` 调用。SVG 源和实际 alpha、pivot 对应关系在 `CUT_MANIFEST.json`。桥牌先作代表样张，Art 与 Tech 对实际 PSD/PNG/可读性/预算分别通过后扩展其余五件；见 `ART_SAMPLE_REVIEW.json`、`TECH_SAMPLE_REVIEW.json`。
- 本地工具：Node v24.19.0，sharp 0.35.4，libvips 8.18.6，librsvg 2.62.91；bundled Python/Pillow/NumPy 回读与核验；原版 bggg `image2psd.py assemble` 组装。sharp 本地许可标 Apache-2.0，bggg 本地许可 MIT。工具只用于制作，不进入游戏包；全部间接依赖许可和外部相似权利未独立逐项核清。
- 最终 PSD：`deliverables/art/U01-GENTLE-UNDERWORLD-ASSET-001/v0.3/psd/u01_gentle_underworld_props.psd`，SHA-256 `186A86CD365F46293A7103A3B58D1259ECB5D131E3112B0FF803CAB761E78CF5`，24 个栅格层；四原层与每个挂件分部均已从保存后的 PSD 回读核对。PSD 内无原生文件夹组或原生可编辑文字，独立层以稳定 ID 前缀成组；原始 SVG 路径旁存。
- 四旧层＋六件各自透明 PNG 在原点同尺度重组，整体 `review/overall_from_psd.png`；与 PSD 存储预览最大色道差 `0`，不同色道数 `0`。对批准旧整体可见差异 18668 像素，均在六件预案盒内。
- 30 张静态手机投影：五比例 × 中/左/右 × zoom1/1.8，所有合成像素 alpha 最小值 255、未露底；另有三张移动中间态。它们是 Art 投影，非 Creator 运行。悬浮控件遮挡、实际贴图/图集/性能和目标设备为 `NOT_TESTED`。

## 六件与实际 alpha 盒

| ID | PNG SHA-256 | alpha 盒（右下不含） | pivot |
|---|---|---|---|
| `U01_PROP_LANTERN_A` | `839EB2D0E04886C6C13A7ABBA9BD87B7A8684FF7F26A99192A21065B5CE2D5BB` | `[772, 163, 814, 221]` | `[792, 223]` |
| `U01_PROP_LANTERN_B` | `7B4BDA996A51FBE6B47CF82205F5FECA9D62F608F367F08D7C6DFC1E620EF30A` | `[1261, 184, 1295, 232]` | `[1278, 235]` |
| `U01_PROP_SOUL_BANNER` | `653DD42F4837AF1B19EA972BAE6638ECA98358F84027BC4C9ADA5117A5552E9A` | `[683, 334, 744, 504]` | `[700, 499]` |
| `U01_PROP_ROAD_SIGN` | `390FD05A0D4E1AA7F0739128731040C1C15B3CCC55348A0557CD5DFC8E98532B` | `[832, 374, 913, 513]` | `[866, 511]` |
| `U01_PROP_FENGDU_LETTERS` | `50A44247103478EA7FC30A45434574BAF2F17A1FDB971FF7A26FAA5E19F077FC` | `[2039, 259, 2092, 275]` | `[2050, 268]` |
| `U01_PROP_BRIDGE_SIGN` | `B3D710FC0C09EA5A4D0A4A24A6C1AC3F1C37C04BBB79BAF7FE62EB19BE2BD3C3` | `[1025, 417, 1147, 467]` | `[1086, 422]` |

## 候选落位收敛

Gate1 的引魂幡候选脚锚 `(720,499)` 在实际绘制中按杆脚落点改为 `(700,499)`；alpha 最下可见 y503 较 Gate1 候选 y501 低 2px，系独立脚座/落影，仍在 Art/Tech 首图前同签预案 y329–504 检查盒内。孔明灯 A alpha 盒右端 814 为不含端，最右可见 x813，落在 Gate1 x770–813。此为位置/笔触收敛，母版四旧层和 L04 边缘均不变；效果仍以 Gate2 用户判断为准。
