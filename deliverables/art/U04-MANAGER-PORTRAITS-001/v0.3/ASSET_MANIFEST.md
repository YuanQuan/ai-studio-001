# 六店长人形修订资产清单 v0.3

本批新制六张独立 PNG、两张板、两份 PSD。所有新图均为审阅候选，非正式 Sprite；四位未修角色只链接 v0.1 候选。全部 v0.3 PNG 为 1024×1536 RGBA，alpha 实测最大 254，有低 alpha 软晕；两板为 3900×1850，地线 y1600。板和 PSD 的合成像素逐像素一致；PSD 各四层：中性背景、0魂完整人物、2魂完整人物、3魂完整人物。只能移动／替换整个阶段，不能单独编辑发丝、五官、衣片或手臂。未在 Photoshop 实开验证。

| 稳定 ID | v0.3 美术路径 | SHA-256 | 用途/状态 |
|---|---|---|---|
| U04_MGR_AJ_S0 | `characters/mgr_aj_s0.png` | `86e5adbca5197ec7c976dab738fa627bda736349d9935ada4b7a621f921aa089` | 阿角男性 0 魂，候选 |
| U04_MGR_AJ_S2 | `characters/mgr_aj_s2.png` | `eaff9d5165a9b293fdda8cf13f12cea72a0bc8d04aa8fe81179f6f9732e018d1` | 阿角男性 2 魂，候选02通过；候选01退修留 `source_images/` |
| U04_MGR_AJ_S3 | `characters/mgr_aj_s3.png` | `254ff2dbb0ef763376a2c5bb4ec69e487573bdd0234ed69baa57d52f231d7363` | 阿角男性 3 魂，候选 |
| U04_MGR_AC_S0 | `characters/mgr_ac_s0.png` | `8a15c6febf0889b3dc014230974d700c8beadd2ba28fb9862640ba092a896a62` | 阿炭 0 魂，候选 |
| U04_MGR_AC_S2 | `characters/mgr_ac_s2.png` | `5ed6504c1f247fc582862a574bd9e245c0a9a800e8d5ea59bd32be87074b243c` | 阿炭 2 魂，候选 |
| U04_MGR_AC_S3 | `characters/mgr_ac_s3.png` | `af95761311e86b025239cffde5e9780b319d629f281761bad393e13470a3b61e` | 阿炭 3 魂，候选 |
| U04_MGR_AJ_BOARD_023 | `characters/mgr_aj_board_023.png` | `f2aa9290fd7c2dff11fae0acf2c4e9aa26750be3a6ea4ce2ea40a0ccc7473de9` | 阿角同尺度审阅板 |
| U04_MGR_AC_BOARD_023 | `characters/mgr_ac_board_023.png` | `de94b261da665e5f59ca7971fff7457bec2bafaae697aac3c198e35aee5eb82e` | 阿炭同尺度审阅板 |
| U04_MGR_AJ_PSD_023 | `psd/mgr_aj_board_023.psd` | `9a3eb8051622b43d1bbddd53e95cdb50be33fe4eebe81f78493830eadc2a24f4` | 四层可编辑阶段母版 |
| U04_MGR_AC_PSD_023 | `psd/mgr_ac_board_023.psd` | `0f6f550ae1e59c2d30adf4014336a207496019d9c28154e4b1d8f927126ff8c3` | 四层可编辑阶段母版 |

四位沿用候选：孟桃 `v0.1/characters/mgr_mt_board_023.png`，阿棠 `mgr_at_board_023.png`，阿灯 `mgr_ad_board_023.png`，小锦 `mgr_xj_board_023.png`；这四张及其阶段 PNG/PSD 均未复制、未重画，也未获本轮具体图版批准。完整 v0.1 历史 SHA 见 v0.1 清单。

客户端正式路径：**计划未定**；Creator 导入 UUID：**未生成**；状态 `USER_REVIEW_CANDIDATE / NOT_IMPORTED`。PSD/板不作为运行纹理导入。显著 alpha≥32 包围盒及同尺度排版坐标见 `source_build/board_build_report.json`；完整来源和提示词见 `PROMPT_LOG.md`、`RIGHTS_AND_SOURCE.md`。
