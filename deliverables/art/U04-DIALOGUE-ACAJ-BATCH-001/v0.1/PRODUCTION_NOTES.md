# 阿炭／阿角六阶段制作记录 v0.1

## 2026-10-10 来源核对与开工

- 已读取本 Task、Gate1 用户批准、孟桃0魂首样 Art/Tech 通过、Art 全量预签及 Tech `APPROVED_FOR_FULL_BATCH_PRODUCTION`。本批次只处理阿炭与阿角的 0／2／3 魂，不重复制作共享九宫格。
- 六张唯一批准源均来自 `U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json` 对应 `characters/mgr_ac_s{0,2,3}.png`、`mgr_aj_s{0,2,3}.png`；逐文件重算 SHA-256 与登记值全部一致，尺寸均为 1024×1536 RGBA。原件不覆写。实际来源视检板：`review/source_six_stage_inspection.png`。
- 视检确认阿炭三阶保持深灰短发、橙色发梢、烤串与围裙；阿角三阶保持双角、长发、紫蓝衣装与挂饰。六张原图的脸位置、眼角、发丝遮挡和成长比例各异，不采用孟桃0魂坐标。
- 当前结果只证明来源身份与版本核对，以及制作已开始。脸区标定、局部表情、PSD 和重组仍在制作；未获得本批实图验收，更未获得 Gate2、客户端导入或运行结论。

## 制作方法与实际修改

- 逐张在原图 `1024×1536` 坐标标定双眉、双眼、嘴、鼻保护区和 256×256 脸部画布。六组数值及重跑入口见 `source/pipeline/build_acaj.py`；逐组导出 rect、pivot、基底偏移见 `LAYER_EXPORT_MAP.json`，不得把参数套到其他角色。
- 原图经 alpha 软边阈值清理，人物/衣装/职业物 RGB 沿用来源；旧五官仅在 `source/u04_*_repair_mask.png` 的局部区域以相邻真实皮肤采样拟合补洞，鼻区单独保护。`PSD_VALIDATION.json` 实算遮罩外 RGB 修改像素，六组均为 0。平面原图的清洁脸底是局部重建，不冒充原生可编辑原画。
- 五态眉、眼、嘴源层各自保留 256×256 真实 alpha，五张输出脸片只含局部五官。前发层从源图发顶连通的深色发丝提取，交叠在当前表情上；非发丝旧眉不进入该层。原图参考及四态的 12 个源层在每份 PSD 中以真实隐藏标志保存，默认可见 `BASE+SMILE眉眼嘴+FRONT HAIR` 五层。
- 底片按原图上部半身裁到 1024px 高，六张尺寸分别为阿炭0/2/3：454/513/609×1024，阿角0/2/3：593/594/574×1024；五态脸片全为 256×256。完整人物批准源另保留在 PSD 隐藏参考层。导出区域、前发偏移和 SHA-256 均在清单中。共享九宫格沿主 Art 首样，不另做。
- 使用 `bggg-creator-image2psd` 的本批次本地适配副本 `source/pipeline/image2psd_hidden_adapter.py`，只补 PSD 隐藏标志和可见缓存合成；原 skill 文件未修改。六份 PSD 可由 Pillow 解析为 1024×1536 的 18 个栅格层；可见缓存与微笑重组最大通道差 1～2，系缓存转换舍入。PSD 可编辑范围限栅格层，非矢量层或原画天然分层。

## 失败候选与返工

- 首轮五态板留在 `review/failed_v1/`。其阿炭与阿角的非微笑态出现原微笑嘴线残影，阿角新嘴偏左，部分眉线被前发误带。故未作为交付，逐源重标嘴全程线段、皮肤补洞区及嘴锚点，并把前发改为从发顶连通的真实发丝。
- 返工后 `review/batch_30_combinations.png` 与六张 `review/u04_*_five_state_board.png` 可逐人逐态复核。阿炭0魂左嘴淡痕再次清理，鼻部保护；阿炭3魂收窄眼部补色区域；阿角2/3魂延伸旧嘴右上角清理范围。六张静态 U00 微笑场景只用 `current_shops_on_v03_scene.png` 当前实际像素；1280×720 是物理画幅审图候选，非 Cocos 横屏运行结论。

## 完成校验及门禁

- `ASSET_MANIFEST.json`、`LAYER_EXPORT_MAP.json`、`PSD_VALIDATION.json`、`COMBINATION_CHECK.json` 是六组/30组合的版本化实物清单、坐标、SHA、PSD 显隐与重组结果。逐组导出半身+当前脸片+前发与全画布目标同区域对比，五态最大逐通道差均为 0；遮罩外源 RGB 修改像素均为 0。原图六张 SHA 与批准清单一致。
- 本目录为 Art 内部制作批次，等待主 Art 按 SHA 字节整合及 Master 独立审图，再进入全任务统一 Gate2。未取得 Gate2 用户具体切片批准，Client 路径仅计划、UUID 未导入；Creator、Web 或目标机运行及 QA 均未测试。
