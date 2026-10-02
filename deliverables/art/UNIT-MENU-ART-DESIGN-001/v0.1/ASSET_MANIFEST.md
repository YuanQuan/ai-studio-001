# 美术资产登记 v0.1

| ID | 类型/名称 | 实际文件或母版候选 | 规格 | 状态 |
|---|---|---|---|---|
| UC_BASE_CONCEPT_01 | 空背景概念 | scenes/empty-scene-concept.png | RGB 2172×724 | 概念待审，非实际分层 |
| UC_GHOST_BENCH_CONCEPT_01 | 右向幽灵5态与板凳概念板 | characters/ghost-customer-concept.png | RGBA 1536×1024 | 概念待审，软晕非生产边 |
| UC_ELEMENTS_CONCEPT_01 | 树花灯3类概念板 | props/toggle-elements-concept.png | RGBA 1536×1024 | 概念待审，软晕非生产边 |
| UB_SKY / UB_DISTANCE | 天空/月/固定蓝远景 | art-source/units/background/ | 真实源未有 | 生产候选；低蓝山/林影固定，不等同TREE |
| UB_GROUND / UB_BANK / UB_WATER | 石地/岸/河面基础层 | 同一背景母版分组 | 真实源未有 | 生产候选 |
| UB_BRIDGE_BACK / FRONT | 石桥后部/前栏遮挡 | 同一背景母版分组 | 真实源未有 | 生产候选 |
| UB_RAIL_BACK / FRONT | 栏杆/石岸前后片 | 同一背景母版分组 | 真实源未有 | 生产候选 |
| UG_GHOST_01 | 原右向幽灵Skeleton | art-source/units/ghost-customer/ | 单页1024²草排起点 | 生产候选；左向仅同源翻转 |
| BENCH_01 | 独立静态木板凳 | art-source/units/bench/ | 同母版座板/腿分层，尺寸待签 | 生产候选 |
| UE_TREE_01 | 柳树Skeleton | art-source/units/tree/ | 单页1024²草排起点 | 生产候选 |
| UE_GRASS_01 | 花草簇Skeleton | art-source/units/flower-grass/ | 单页512²草排起点 | 生产候选 |
| UE_LANTERN_01 | 灯笼Skeleton | art-source/units/lantern/ | 单页512²草排起点 | 生产候选 |

上述新对象ID与Tech同步；目录为候选，Creator输出拟apps/client/assets/units/同名目录，需正式Tech Design批准。实际可编辑源、交换分层副本、导出JSON/atlas/PNG、导出工具/许可与UUID目前均未交付；不把概念路径填作生产母版路径。

已批准而本版**不修改**：MT_CHAR_01孟桃、MT_SHOP_STATIC_01店后/前柜、MT_SHOP_MOTION_01短帘；参考位置deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.5/。每类当前一候选，不预造其他店/店长/顾客，不加角色剧情/经营规则。

来源/全提示词见REFERENCE_AUDIT及GENERATION_PROMPT。没有字体文件输入，不能由此声明字体许可通过；光影运行素材另依VFX/Art/Tech正式分层契约，不烘进背景或可翻原向附件。
