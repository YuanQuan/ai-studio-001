# U04 六店长对话分层资源 v0.1｜Gate2 具体切片审核包

**请审核本批实图与切片版本。**六位店长各有 0/2/3 魂，共 18 份分层 PSD、18 张干净脸底人物基底、90 张透明局部表情、18 张前发/遮挡片；另有一套透明九宫格面板及两枚独立固定云纹。三轴为“店长 6 选 1／魂阶段 0、2、3 选 1／表情高兴、惊讶、悲伤、微笑、生气 5 选 1”；切换一轴时保留另两轴，店长姓名随店长与阶段对应人物同步。18 组均从获批 1024×1536 原立绘定向修出；获批原文件原位保留。

## 看图与检查

1. [六店长同一 U00 画幅静态总览](review/u00_dialogue_overview.png)：六格均用现有 U00 实素材同一裁切、同一 1280×720 横屏物理画幅、同一九宫格、姓名/对白与三轴选择控件。人物按各自正式 base＋smile＋front 映射重组，等高显示到腰部；显示用裁切矩形逐格见 [来源记录](review/u00_dialogue_overview_sources.json)。这是静态合成审图，非 Creator 运行截图；底层正式 base 保留更多像素，未按展示裁切损伤。
2. [18 阶段 × 5 表情总板](review/all_90_combinations.png)：90 格以中文标注，按各阶段脸部实际坐标等比例裁切，眉眼嘴、下巴与标签完整。请重点比较高兴与微笑的口型、惊讶张口、悲伤和生气眉嘴，以及发丝遮挡和旧五官残留。各批次逐组审图仍见 [主 Art 30 格](review/main_30_combinations.png)、[阿炭/阿角 30 格](../../U04-DIALOGUE-ACAJ-BATCH-001/v0.1/review/batch_30_combinations.png)、[阿灯/小锦 30 格](../../U04-DIALOGUE-ADXJ-BATCH-001/v0.1/review/batch_30_combinations.png)。早期 WIP/拒用候选不计入正式审图。
3. [九宫格三尺寸](review/nine_slice_sizes.png)：正式 [透明面板 PNG](exports/u04_dialogue_panel_9s.png) 与 [PSD 母版](source/u04_dialogue_panel_9s.psd)。原图 512×256、左/上/右/下 Insets 均 48px，切线 x=48/464、y=48/208；384×192、768×256、1024×384 重组的四角 48×48 像素与原图逐像素相同。姓名、对白、三轴控件均独立绘制；固定云纹各有独立 PNG，不烘入伸缩中心。

[资源清单](ASSET_MANIFEST.json)逐个登记 129 个待导入 PNG 的稳定 ID、实际路径、SHA-256、尺寸及计划客户端路径，并列 18 个 PSD；[图层和导出映射](LAYER_EXPORT_MAP.json)逐阶段记录源图、脸片 rect/pivot、基底和前发位置、叠放顺序与批次来源；[PSD 检查](PSD_VALIDATION.json)实解析 18 份母版均为 18 层，其中默认仅 SMILE 三层、BASE、FRONT 可见，另四态与原图参考层隐藏但保留。每表情的眉/眼/嘴透明源层分别可编辑；它们是栅格元素层，不是可矢量编辑原画。[90 组合检查](COMBINATION_CHECK.json)逐项证明导出 base＋选定脸片＋front 的静态重组逐通道 0 差；[九宫格检查](NINE_SLICE_CHECK.json)列角部静态像素对照。原图、失败候选和修补范围记录见 [制作记录](PRODUCTION_NOTES.md)。

本包 Gate1 制作方案已获用户批准，首图 Art/Tech 同批预签、孟桃0魂样张核验和全量复签均有记录；阿炭/阿角、阿灯/小锦两个独立批次按哈希复制并整合，源批次保留。**此处请求的是 Gate2 对具体切片 v0.1 与同尺度静态视觉效果的独立批准。**批准前不进行 Client 正式接入。当前工程 720×1280 是设计分辨率且使用 FIXED_WIDTH；本批 1280×720 是横屏物理审图候选，不能据此宣称 Cocos UI 坐标、运行视窗或设备适配通过。Sprite.Type.SLICED、长文本安全区、字体许可、图集/内存及真实 UUID 均待后续接入实测；审图用系统字体只烘在 review 图里，未随游戏资源分发。
