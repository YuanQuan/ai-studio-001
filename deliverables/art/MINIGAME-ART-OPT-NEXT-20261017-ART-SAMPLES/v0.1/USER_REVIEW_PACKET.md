# 六件无损压缩样本用户审阅包 v0.1

状态：`USER_REVIEW` 候选。此前用户批准的是制作方案 Gate1；本包提交六件原资源对应的 **12 个具体无损候选文件**、静态对照与文件身份供 Gate2 审核。候选尚未进入正式客户端。

![六件原图、新PNG与WebP的静态缩略总览](OVERVIEW_6x3_STATIC.png)

总览图仅用于定位六件图片，不是游戏实际显示尺度。左列为已批准原 PNG，中列为 PNG 重新编码，右列为 WebP lossless。

## 已完成的验证

- 六份参考副本与冻结源逐字节同 SHA；12 个候选保持原尺寸/画布、straight alpha、透明区隐藏 RGB、原 UV/裁框/支点及 PSD 图层映射。PNG 使用 Pillow 11.3.0 `RGBA8 optimize=True compress_level=9`；WebP 使用 cwebp 1.5.0 `-lossless -exact -q 100 -m 6 -metadata icc`。
- 六源 PNG 只含 `IHDR/IDAT/IEND`，无 ICC/gAMA/sRGB；候选不注入 ICC，固定按 sRGB 解释。12 件经 Pillow RGBA8 解码后，全 RGBA 每通道最大差 0、变化像素 0、alpha=0 隐藏 RGB 变化像素 0、alpha 变化像素 0。六份 WebP 另经 dwebp 1.5.0 `-pam` 第二路径解码，原始 RGBA 与源及 Pillow 解码同 SHA；PAM 只是临时诊断中间件。
- 六源文件合计 4,274,355 B；新 PNG 合计 4,008,432 B，少 265,923 B（6.2214%）；WebP lossless 合计 2,874,240 B，少 1,400,115 B（32.7562%）。这是六件文件字节，不是 native 包、下载量、GPU 纹理内存或运行收益。12 候选均有文件收益，无失败候选。
- 0 生图调用、0 新付费、0 重画、0 降采样、0 有损候选、0 PSD/meta/FNT/正式客户端改动。原 PSD 和图层映射只核文件身份，未重新输出母版或声明 PSD 重渲染通过。

## 可查看的对照

每件 `samples/<资产ID>/evidence/` 含两种格式各自的全 RGBA 差异图、原尺寸 1:1 并排及浅灰/深灰背景并排。差异图对四通道逐通道绝对差取最大值；黑色代表零差。前三件另有按冻结源码公式推导的 720×1280 与 320×568 双栏静态投影：

- [天空 720×1280](samples/tex_sakura_rr_sky_r/evidence/webp_lossless_static_projection_720x1280.png)、[天空 320×568](samples/tex_sakura_rr_sky_r/evidence/webp_lossless_static_projection_320x568.png)
- [招牌 720×1280](samples/tex_u03_shop_05_sign/evidence/webp_lossless_static_projection_720x1280.png)、[招牌 320×568](samples/tex_u03_shop_05_sign/evidence/webp_lossless_static_projection_320x568.png)
- [游客 720×1280](samples/UG_GHOST_01_HAPPY_00/evidence/webp_lossless_static_projection_720x1280.png)、[游客 320×568](samples/UG_GHOST_01_HAPPY_00/evidence/webp_lossless_static_projection_320x568.png)

投影对每对图片使用相同的源码纯色舞台背景、视窗、原裁框/foot 及像素中心 0.5 的 straight-alpha 双线性采样，二栏差 0。它只显示单件在该条件下的静态效果，没有重组完整场景层。游客历史截图显示第 2 帧，不能充当本次 happy 第 0 帧基准。三件候选均未在 Cocos 运行。

人物 `tex_u04_at_s3_base` 和字体 `U05_ART_FONT` 只有原尺寸 1:1 与浅深背景证据：人物实际 AT_S3 选择状态及 safe/面板尺寸，字体实际文本、Label/glyph 使用和轴向 CSS 缩放未冻结，实际显示尺度与组合效果均为 `NOT_TESTED`。店铺主体已有 1:1 静态证据；它与招牌同场组合及完整场景效果仍为 `NOT_TESTED`。

## 具体文件身份

SHA-256 均从本次实际文件重算。完整路径、PSD/层映射、原客户端路径和每张证据图 SHA 见 `ASSET_MANIFEST.md` 与 `FILE_IDENTITY.json`。

| 资产 | 原 PNG：字节 / SHA-256 | 新 PNG：字节 / SHA-256 | WebP lossless：字节 / SHA-256 |
| --- | --- | --- | --- |
| 天空 `tex_sakura_rr_sky_r` | 1,737,963<br>`47a0d302ea835336127078da6b1b1a90dedb0f545e87b341a25dece9bbbd962d` | 1,599,548<br>`95524bce79791503b3caca19b4e9bdc27853279e13b9a15a72b69597c2665760` | 1,200,052<br>`8f1b488953060cea1a53dd5d5b891463f6904674828b51d3f64cdc931fd0d223` |
| 招牌 `tex_u03_shop_05_sign` | 100,820<br>`6174c91490d91007b8dbdaab01a8e5c7c5bbad73098144f3b7a0fe50476e25cd` | 96,452<br>`66f3421ef4a36301ee94ab6569859612d71fba892be59d3749602fbe49c243b0` | 71,186<br>`fcc1ff13bef72069df2dca891d90ef24bcacbcd39c9babcd0ad96b60255bcd59` |
| 游客 `UG_GHOST_01_HAPPY_00` | 112,883<br>`1b8eb1f4796b88b84ab0d3b25711aafeeff7a9e56013b34653b06e606acb6126` | 106,000<br>`fde00b25121f729ac157456c4d5f646965273384d5782557a408072eed588ab8` | 71,340<br>`b07312d66877ceb80fd9106a9ac6e78abd6525197d0d9633bcbe4c192dd336ea` |
| 人物基底 `tex_u04_at_s3_base` | 996,683<br>`b2381c8750733201c948dab82a03e918acb6c67d80dfebf71c4fd4fb740d7210` | 931,082<br>`ba0ac71e12cc88907a95afeab0bad057a9b71db4f3afe0186ce11fadc406ac31` | 619,712<br>`58c5b395598f04ff042a9aa5363a1621a0f99c214ca0c58666ac585bfa75f4bd` |
| 店铺主体 `tex_u03_shop_05_body` | 851,634<br>`520918abbfe180f0c66ccc1584f12e27c684057e73599de4e011e2934bdf9ad1` | 808,111<br>`a166631850df1645fce2e5c92deedb492770650a319db763068be115345b8326` | 628,964<br>`eff41f4d7980bca232e328313603cf479c43c2d827780751dc00adab88c8db01` |
| 字体图集 `U05_ART_FONT` | 474,372<br>`b1afe3e4ebb623f97c9c4bb87600075476bab8421531212ad08e9cee07efeb41` | 467,239<br>`e2b749a9318d2fd80839b042422abb2345346807aa453a215f2a1f70991c9193` | 282,986<br>`bd18483d3f694803487da8c27526ae74893623e5a178e716a4db46a8b963ca9a` |

## 审批边界

请审核本包所列确切 PNG/WebP 候选版本及可见静态效果；若需调整，请按资产 ID 指出。新候选尚无客户端 UUID。首图前 Art/Tech 双签绑定同一 `BATCH_PLAN.json` SHA-256 `a6bc70139a292edfa241235a3cf28666fc2174e3d7e7a08e8e475f83b9c1ef23`；首批及余三件授权、同批技术扩展确认已存档。

Gate2 明确批准后，Client 才可正式接入获批的具体版本；接入后再核 Creator 导入、目标平台、alpha/ICC、是否重编码、实际运行画面、GPU/内存/下载指标与正式 QA。目前这些均为 `NOT_TESTED`。现有源资源及旧批准不因本次候选而撤销。执行账本见 `EXECUTION_LEDGER.json`，逐像素与静态投影数据见 `PIXEL_VERIFICATION.json`、`STATIC_PROJECTION.json`。
