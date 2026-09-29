# 游戏公共配置

人工维护的源表使用 `.xlsx`，存于 `source/`；字段字典与校验契约存于 `schema/`。配置目录见 `CONFIG_CATALOG.md`。

## 职责
- Product 主导配置目录、业务表结构、字段语义、可调参数、业务 ID 与关联规则、平衡目标和数值内容，并维护人工源表及字段字典。
- Tech Lead 评审字段类型、稳定 ID 与引用完整性、约束可执行性、客户端／服务端可见范围及兼容性，负责生成与技术校验规则；发现问题应提交评审意见，不自行改写产品语义。
- Client/Server 消费经批准并校验的配置，不自行增加字段语义。
- 本轮顾客配置是草案，详见 `schema/CUSTOMER_CONFIG.md`；发布须在用户批准具体产品规则后完成技术评审和校验。

## Per-Table Data Dictionary
For each table document:
- unique ID
- field/stable abbreviation where useful
- type
- business meaning
- default/null policy
- enum/range/unique rules
- references/FKs
- Client-only / Server-only / Shared
- hot-update eligibility if later supported
- compatibility/deprecation policy

## Validation
At minimum validate unique IDs, references, types/ranges, required values, deprecated ID/field reuse, and accidental exposure of sensitive server-only fields to Client.

Do not create speculative tables just because the template exists. Add actual `.xlsx` files only when the project has a real requirement.
