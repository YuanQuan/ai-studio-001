# 第一街｜美术资产清单 v0.2

日期：2026-10-02。当前是方向文档与整景概念，Art/Tech/Master专业评审通过（仅概念提交），USER_REVIEW；不是可集成资产，未获用户批准。候选生产ID用于讨论拆分，不宣布图片已导出。实际主图尺寸及目视结果见 `REFERENCE_AUDIT.md`。

## 当前实物

| ID | 类型/路径 | 格式 | 状态 | 用途 |
|---|---|---|---|---|
| ART-FIRST-STREET-DIRECTION-02 | `ART_DIRECTION.md`及Brief/理由/审计 | Markdown | 修订待审 | 八条原则延续和双风格待选范围 |
| REF-FIRST-STREET-BRIDGE-02 | `references/bridge-reference.png` | PNG | 参考/权利未知 | 石拱、坡道、支流通河的一般构造 |
| REF-FIRST-STREET-PLAQUE-02 | `references/plaque-reference.png` | PNG | 参考/权利未知 | 牌框、纸底、类别文字的一般形式 |
| CONCEPT-FIRST-STREET-05A | `scenes/night-market-v0.5-original.png` | PNG 2172×724 RGB | 专业评审通过，USER_REVIEW | 桥河与牌匾修订全景 |
| CONCEPT-FIRST-STREET-05B | `scenes/night-market-v0.5-pixel.png` | PNG 2172×724 RGB | 专业评审通过，USER_REVIEW，待选择 | 同内容画风比较，不自动成为基线 |

## 拟生产拆分（本轮没有制作）

| 候选ID家族 | 资产与复用范围 | 独有件/限制 |
|---|---|---|
| MOD-TIMBER/TILE/BRICK | 木柱、木板、瓦檐段、砖基；奶茶/理发同源模块 | 01/04的整店开口、宽高和工作区独立组装 |
| MOD-STONE/RAIL/PAVING | 地面、河岸、低栏杆和桥栏石件 | 完整石拱与两坡、支流通河接口独立；前岸栏杆需以水口断开；桥与殿不是经营店 |
| MOD-LANTERN/FURNITURE | 普通灯笼、桌椅、基础器皿 | 功能花灯或身份家具独立，不混用商品与装饰语义 |
| SHOP01-FRONT-KIT | 类别牌匾和一份小杯+吸管标识母版及应用，封口/摇杯设备、纸盒陈列 | 品牌/字体复核；纸盒不是logo，不定义商品 |
| SHOP02-FRONT-KIT | 纸伞、木轮车、糖画展示/糖板 | 不复制附件糖画造型和精确排列 |
| SHOP03-FRONT-KIT | 布棚裁片、烤炉与串签 | 布件/烟如需动态拆独立骨骼/VFX对象 |
| SHOP04-FRONT-KIT | 剪刀图形、镜子、理发椅及工具 | 专属店长未定稿；不用孟桃或顾客资源代替 |
| SHOP05-FRONT-KIT | 竹木架、商品花灯形态 | 小品类形态待生产原画确认，不能借参考增加品项规则 |
| SHOP06-FRONT-KIT | 壶、箭束与宽活动面 | 不是套圈；投掷/命中动作独立规格 |
| LANDMARK-YANLUO/BRIDGES | 阎罗殿、街市桥、奈何桥轮廓 | 地标独立ID，位置/动线以Product批准版为准 |
| BG-SKY/MOUNTAIN/WILLOW | 背景分层、柳树母版、低对比远景 | 树若动态采用骨骼，动作附件一个对象一页 |
| PROP-WISHBOAT | 折纸小船母版、蜡烛/烛火 | 烛火VFX触发与性能另审 |
| CHAR-MANAGER/GHOST | 六店长专属、通用旅客部件 | 孟桃候选连续性；其它店长未画定稿；四方向单元仍保留 |
| UI-COMPONENT | 按钮/提示/状态/图标母版 | UI规格、字体许可和视觉Review另审 |

每个支持动态的对象按骨骼方案设计，所有附件一页图集。通用母版可以分别导出到对象图集；同源图片并不要求共图集，也不能证明一次Draw Call。实际导出尺寸、对象边界、单页草排和分段可见必须经Art+Tech生产前签认。独立单元与主体引用同一源/Prefab/配置，不能截取概念图后复制维护。

统一牌框/纸底维护母版；六组文字为独立类别ID，可通过获许可字体渲染或经许可原创制作。当前图中字是生成概念，未制作或导入字体文件。两风格共用语义ID，用户选择后才生产一套统一表现，不预先扩大为两套完整生产资产。
