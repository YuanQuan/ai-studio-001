# 第一街｜美术资产清单 v0.1

日期：2026-10-02。当前是方向文档与整景概念，不是可集成资产。候选生产ID用于讨论拆分，不宣布图片已导出。实际主图尺寸及目视结果见 `REFERENCE_AUDIT.md`。

## 当前实物

| ID | 类型/路径 | 格式 | 状态 | 用途 |
|---|---|---|---|---|
| ART-FIRST-STREET-DIRECTION-01 | `ART_DIRECTION.md`及Brief/理由/审计 | Markdown | 待审 | 美术基线与制作边界 |
| REF-FIRST-STREET-BUILDING-01 | `references/user-building-reference.png` | PNG 2172×724 | 参考/权利未知 | 通用建筑构造抽取；不得裁用生产 |
| CONCEPT-FIRST-STREET-04 | `scenes/night-market-v0.4.png` | PNG，实际尺寸见审计 | 概念待审 | 横向全景、建筑类型和冷暖关系 |

## 拟生产拆分（本轮没有制作）

| 候选ID家族 | 资产与复用范围 | 独有件/限制 |
|---|---|---|
| MOD-TIMBER/TILE/BRICK | 木柱、木板、瓦檐段、砖基；奶茶/理发同源模块 | 01/04的整店开口、宽高和工作区独立组装 |
| MOD-STONE/RAIL/PAVING | 地面、河岸、低栏杆和桥栏石件 | 桥入口出口/地理接口独立；桥与殿不是经营店 |
| MOD-LANTERN/FURNITURE | 普通灯笼、桌椅、基础器皿 | 功能花灯或身份家具独立，不混用商品与装饰语义 |
| SHOP01-FRONT-KIT | 一份杯+吸管标识母版及应用，封口/摇杯设备、纸盒陈列 | 品牌/字体复核；纸盒不是logo，不定义商品 |
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
