# 配置资源目录

统一字段说明：[业务配置字段中文说明](FIELD_GUIDE.md)。机器索引：[RESOURCE_INDEX.json](RESOURCE_INDEX.json)。

| 资源 | 状态 | 稳定源表 | 当前客户端生成资源 | 审批与历史 |
|---|---|---|---|---|
| 顾客配置样例 | 草案；不可正式使用 | [CUSTOMER_CONFIG_v0.1.xlsx](source/CUSTOMER_CONFIG_v0.1.xlsx) | 无 | [字段说明](FIELD_GUIDE.md)；[历史快照](archive/2026-10-12-config-audit/CUSTOMER_CONFIG_v0.1.xlsx) |
| 奶茶小游戏三类配置（MG01 v0.1） | 已批准；用于 U05 前端单元示例 | [MILK_TEA_MINIGAME.xlsx](source/MILK_TEA_MINIGAME.xlsx) | [客户端 JSON](generated/milk_tea_minigame.client.json)；[SHA/来源清单](generated/milk_tea_minigame.manifest.json) | [Product 审批](../../tasks/U05-B-CONFIG-SOURCE-20261014/ARTIFACT_APPROVAL_v0.1.json)；[Tech 审批](../../tasks/U05-B-CONFIG-TECH-REVIEW-20261014/ARTIFACT_APPROVAL_v0.1.json)；[中文字段说明](FIELD_GUIDE.md)；[旧源及生成归档](archive/2026-10-14-u05-b-three-class-transition/MANIFEST.json) |
| U00六店位置待审基线 | 草案；不可正式使用 | [U00_SHOP_LAYOUT.xlsx](../../deliverables/product/U00-SHOP-LAYOUT-CONFIG-001/v0.1/U00_SHOP_LAYOUT.xlsx) | 无 | [字段说明](FIELD_GUIDE.md)；[历史快照](archive/2026-10-12-config-audit/U00_SHOP_LAYOUT_v0.1.xlsx) |

奶茶配置只由当前单元示例读取客户端 JSON；归档中的五维源和 JSON 仅供追溯，不能作为当前入口。
