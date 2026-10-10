# 阿灯／小锦六阶段制作记录 v0.1

启动核对：2026-10-10T17:55:30+08:00

Gate1 已批准，孟桃首样张 Art/Tech PASS；全量 Art/Tech 同 SHA 批次预签已批准。本支持单元只在本目录制作，交主 Art 统一 Gate2。

## 批准源逐项重算

- AD S0: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ad_s0.png`，SHA-256 `fa4f47e03eedaea1d0d0dbe1b773d48d550d887027e971030cf83eadc80717c4`，1024×1536 RGBA，非零 alpha bbox `(0, 16, 1002, 1536)`。
- AD S2: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ad_s2.png`，SHA-256 `8707280cab50da42a963baa921fd57b159522739a40a4983decaaa1327997e69`，1024×1536 RGBA，非零 alpha bbox `(0, 14, 1004, 1520)`。
- AD S3: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ad_s3.png`，SHA-256 `7c31f425877d7d869893c0c97abd09c3228c70f80066f5c7ed67452ccfd62a01`，1024×1536 RGBA，非零 alpha bbox `(0, 12, 994, 1518)`。
- XJ S0: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_xj_s0.png`，SHA-256 `bbde4f30cfb84ddef890e6bfdea6ca3990f9669235a6f3abf27b78dc11b26dd9`，1024×1536 RGBA，非零 alpha bbox `(49, 22, 974, 1508)`。
- XJ S2: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_xj_s2.png`，SHA-256 `6b5f7a4781dd233ec02acde3782afee0f3174ad42078670d36745cea5d75ceb8`，1024×1536 RGBA，非零 alpha bbox `(65, 16, 992, 1502)`。
- XJ S3: `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_xj_s3.png`，SHA-256 `b14d8db0b874aab07f0c342fdd2c1ff651ac220e07400a620189d23012429097`，1024×1536 RGBA，非零 alpha bbox `(33, 0, 984, 1536)`。

以上六源通过哈希核对；逐图视觉校准和实际制作证据继续记于本文件。U00 背景只使用 current_shops_on_v03_scene.png；共享九宫格沿用主样，不在本批重制。

## 逐阶段视觉校准与制作结果

六张批准源先看全身与 300..650 × 190..490 局部网格。阿灯三阶段同服饰配色，但灯笼/手势和成长构图各不同；小锦 S0 单眼眨眼戴镜、S2 双眼睁开戴镜、S3 双眼睁开且无镜。坐标均以各自源图 1024×1536 实测，详见 `production_data.json` 的逐图五官 bbox，`source/pipeline/build_batch.py` 的逐阶段蒙版多边形。每阶段仅从自身已批准源提取眉/眼/默认嘴；小锦 S0 非默认惊讶、悲伤、生气的右眼只镜像其自身左眼，不跨人物或魂阶拷贝。

| 阶段 | 脸区源坐标 XYXY | 五官皮肤采样像素 | 修改RGB像素 | mask外RGB变更 | 前遮挡 |
|---|---|---:|---:|---:|---|
| AD_S0 | `[310, 185, 566, 441]` | 6563 | 20745 | 0 | 源前发 |
| AD_S2 | `[308, 184, 564, 440]` | 7088 | 20721 | 0 | 源前发 |
| AD_S3 | `[310, 184, 566, 440]` | 6896 | 22586 | 0 | 源前发 |
| XJ_S0 | `[330, 223, 586, 479]` | 8014 | 17156 | 0 | 源前发＋镜框 |
| XJ_S2 | `[330, 222, 586, 478]` | 7367 | 18855 | 0 | 源前发＋镜框 |
| XJ_S3 | `[320, 190, 576, 446]` | 6463 | 20551 | 0 | 源前发 |

皮肤修补只覆盖旧眉眼嘴语义 mask，鼻孔/鼻尖按六张不同位置保留；RGB mask 外逐像素无变化。半身基底以源图上半 1024×1024 整体缩至 768×768，因此不裁掉两侧灯笼、弓箭和手臂；局部脸片从每阶段各自 256×256 源画布缩至 192×192，导出同一 pivot `(96,96)`，在基底内按各自 face rect 的 0.75 倍偏移。前遮挡同为 192×192，并保留批准源色。源 PSD 仍是 1024×1536 原坐标；清脸补洞为局部重建，原画并非天然分层。

已保留 `review/rejected_v3_nose_and_mouth/` 中的失败板、PSD预览及小锦S3旧嘴残影脸底。该失败版的鼻尖保留孔误伸入嘴区，造成非微笑态露旧嘴；已逐阶段重定位鼻孔并复核小锦S3五态板。更早脚本迭代曾有眉粗条/前发接缝，未留完整导出快照，不能把它们称作已复核资产。当前版本生气嘴改为源色细抿嘴曲线，悲伤下垂嘴和高兴张口笑均与默认微笑分开。

## 可复核产出与范围

- `source/approved_original_*.png` 六份与批准清单 SHA 完全一致；原批准文件未覆写。
- 六份 PSD 由 `bggg-creator-image2psd` 临时隐藏层适配脚本组装，源图 reference 和四态 12 个真实 alpha 眉眼嘴层保留为隐藏，默认仅 BASE/SMILE 三层/FRONT 可见；每份 18 层。脚本只生成可编辑栅格层，不能称为原生矢量或天然对象分层。
- `exports/` 有六张 768×768 RGBA 基底、30 张 192×192 RGBA 局部脸片和六张 192×192 前遮挡；九宫格引用首样共享 512×256 版本，未重造。
- `review/*_export_recomposition.png` 共30张，导出基底＋选中脸＋前遮挡同像素坐标重组，与独立从眉眼嘴源层合成的目标逐通道差异为0；`review/*_u00_static.png` 共30张，在同一当前 U00 背景像素、1280×720物理画幅和同人物尺度审图。`review/six_stage_u00_smile_board.png` 可核六身份阶段默认态。
- U00 静态审图使用本机字体仅作标记，字体未纳入资源；此静态画幅不代表 Creator 横屏布局或目标机运行。客户端路径计划、UUID未导入，具体切片还须主Art整合后统一 Gate2 用户审批。

本轮最终静态检验记录时刻：2026-10-10T18:14:05+08:00。
