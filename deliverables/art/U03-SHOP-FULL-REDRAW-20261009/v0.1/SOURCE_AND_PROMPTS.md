# U03 六店重绘来源与生成记录 v0.1

- 视觉输入：用户本轮六店图，项目副本 `../../U03-SHOP-REFERENCE-REVISION-20261009/v0.1/reference/user_six_shops_20261009.png`，SHA-256 `B1295170D7245FA8BF4471FF29AFBA8A5C32BA4E5F59637814E87A793C85F8C9`。用户已确认拥有并允许商用改编；项目来源记录见 `tasks/U03-SHOP-REFERENCE-REVISION-20261009/SOURCE_DECLARATION.json`。
- 工具：内置 `image_gen__imagegen`，每店一次独立调用，`transparent_background=true`，六店总图只作构图/风格参考。01 先样张；Art/Tech 同批预签和样张检查后才生成 02–06。全部原始输出已复制到本目录 `source/shop_XX/imagegen_whole_r1.png`；每张都是完整新画。未用旧 PSD/PNG 拼修或对参考六格裁切放大生产。
- 共用提示词意图：`Create ONE entirely newly painted isolated game shop from the specified cell; not a crop, tracing, composited old pixels, or a multi-shop scene. Smooth richly detailed 2D Chinese night-market illustration, near-front view, warm amber lanterns against cool blue shadows. Match silhouette, object identities and proportions. Entire shop visible on genuine transparent alpha; no black board, blue grid, scenery, watermark or extra characters.`

| 店 | 独立提示词的具体视觉目标 | 原始新画 |
| --- | --- | --- |
| 01 | Top-left milk-tea kiosk；蓝瓦卷檐、浅布帘、瓶罐茶锅、双暖灯、右檐珍珠奶茶杯标识；无中央横字牌。 | `source/shop_01/imagegen_whole_r1.png` |
| 02 | Top-middle sugar-art cart；红伞、龙蝶兔糖画、左大轮、工具/糖锅、前右低位木牌，准确单字“糖”及勺浆；无小凳。 | `source/shop_02/imagegen_whole_r1.png` |
| 03 | Top-right grill stall；竹架红棚、烤串炉、三缕烟、左深木竖牌，准确“现烤”，不得写“炭烤”。 | `source/shop_03/imagegen_whole_r1.png` |
| 04 | Bottom-left barber shop；蓝瓦、圆镜/椅/旋转标柱，檐下浅木剪刀梳子图形牌；无“理发”字或屋顶大 LOGO。 | `source/shop_04/imagegen_whole_r1.png` |
| 05 | Bottom-middle lantern stall；竹架、“花灯”牌、莲灯、鱼灯、兔灯、台面灯具和工具桶。 | `source/shop_05/imagegen_whole_r1.png` |
| 06 | Bottom-right pitch-pot stall；竹架、双灯、箭束、青瓷壶、右深蓝绿“投壶”竖牌。 | `source/shop_06/imagegen_whole_r1.png` |

四块中文字均已逐字目视核对；本批没有嵌入或分发外部字体文件，也没有引入外部图库/品牌素材。图片为新生栅格画，文字为画面中的栅格字形，不能宣称为已授权字体软件或可编辑文本层。六 PSD 的实图拆层使用 `bggg-creator-image2psd`；源画、层源、manifest、构建记录在各 `source/shop_XX/psd_work/`，可编辑限制见 `PSD_LAYER_EXPORT_MAP.md`。
