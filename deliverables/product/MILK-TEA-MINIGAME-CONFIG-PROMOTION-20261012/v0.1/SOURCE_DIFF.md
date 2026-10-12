# 奶茶源表候选差异审计

版本 v0.1。比较对象为已获批原始人工源 `project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx` 与无版本候选 `project/config/source/MILK_TEA_MINIGAME.xlsx`；对 Excel 四表逐行逐列读取后按表名、行序、表头和单元格值比较。

| 对象 | SHA-256 |
|---|---|
| 已批旧源 | `cdad804b8ba7974ce4ac6835ee02f7863be6f577a3919fd4baa8c90a73fa1cfa` |
| 原有旧源归档 | `cdad804b8ba7974ce4ac6835ee02f7863be6f577a3919fd4baa8c90a73fa1cfa` |
| 新候选 | `a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76` |

| 表 | 数据行 | 列 | `status` 变化 | `export_enabled` 变化 | 其他字段变化 |
|---|---:|---:|---:|---:|---:|
| 难度阶段 | 10 | 11 | 10 行 DRAFT→READY | 10 行 false→true | 0 |
| 解锁条件 | 5 | 13 | 5 行 DRAFT→READY | 5 行 false→true | 0 |
| 原料 | 20 | 6 | 20 行 DRAFT→READY | 20 行 false→true | 0 |
| 配方 | 15 | 11 | 15 行 DRAFT→READY | 15 行 false→true | 0 |

共 100 个受控单元格变化；表名、表头、数据行数与全部其他业务值一致。比较使用只读工作簿解析，不以新工作簿文件 SHA 必然相同作为逐格相同的证据。旧奶茶字段说明 SHA-256 为 `fcd1b4f2725ee9042bc3a1713326470abce3dcc916023ea043d5c279d6107652`，新同版奶茶段 SHA-256 为 `90cd9721b88bea5f587f8bd6209a57d55311ba7aa5f21cdd8b7c915e9bfd5d85`；`project/config/FIELD_GUIDE.md` 的奶茶以外内容逐字未变。
