## 奶茶小游戏配置字段

原始工作簿：`project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx`。原产品说明：`deliverables/product/MILK-TEA-MINIGAME-SPEC-20261012/v0.1/CONFIG_SPEC.md`。产品规则与首版数值已获用户批准；原工作簿仍保留逐行 `DRAFT`、`export_enabled=false`，技术审查、正式导出和运行发布待完成。归档副本：`project/config/archive/2026-10-12-config-audit/MILK_TEA_MINIGAME_v0.1.xlsx`。

### 难度阶段

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `stage_id` | 字符串 | 阶段唯一 ID。 |
| `tier_id` | 枚举 | 难度档 ID，引用解锁条件.tier_id；EASY/MEDIUM/HARD/HELL/NIGHTMARE。 |
| `stage_no` | 整数 | 档内阶段序号，获批首版为 1 或 2。 |
| `xp_from` | 非负整数，累计熟练度 | 进入本阶段的累计熟练度起点；阶段1不另成解锁条件。 |
| `recipe_dims` | 整数，维度数 | 本阶段配方维度数；获批首版按五档为3/4/5/5/5。 |
| `orders_target` | 正整数，杯/局 | 本局正确订单目标数量。 |
| `time_sec` | 正整数，秒；简单档留空 | 一局时限；简单不限时，中等以上填正数。 |
| `options_per_dim` | 整数，项/维度 | 每维可选原料数量；获批首版为2–4且不超过可用原料数。 |
| `xp_reward` | 非负整数，熟练度/通关 | 通关所得熟练度；首版数值已获用户批准，技术审查与发布待完成。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，技术审查与运行发布待完成。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 解锁条件

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `tier_id` | 枚举 | 难度档唯一 ID。 |
| `prev_tier_id` | 枚举，可空 | 前一难度档 ID；简单档留空，其余引用上一档。 |
| `initial_open` | 布尔 | 是否初始开放；获批首版仅简单档为 true。 |
| `xp_enabled` | 布尔 | 是否启用累计熟练度解锁门槛。 |
| `xp_min` | 非负整数，累计熟练度 | 熟练度最低门槛；开关关闭时不参与判断。 |
| `level_enabled` | 布尔 | 是否启用店长等级门槛。 |
| `level_min` | 非负整数，等级 | 最低等级；开关关闭时为占位。 |
| `soul_enabled` | 布尔 | 是否启用魂数门槛。 |
| `soul_min` | 非负整数，魂数 | 魂数最低门槛；获批首版范围0–3，关闭时为占位。 |
| `spirit_enabled` | 布尔 | 是否启用魄数门槛。 |
| `spirit_min` | 非负整数，魄数 | 魄数最低门槛；获批首版范围0–7，关闭时为占位。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，技术审查与运行发布待完成。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 原料

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `ingredient_id` | 字符串 | 原料唯一 ID，供配方引用。 |
| `dimension` | 枚举 | 原料维度，TEA/MILK/TOPPING/SWEET/ICE。 |
| `name` | 字符串 | 用户可读原料名。 |
| `sort_order` | 整数，顺序 | 同维度备选项基础排序；首版数值已获用户批准，技术审查与发布待完成。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，技术审查与运行发布待完成。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 配方

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `recipe_id` | 字符串 | 配方唯一 ID。 |
| `tier_id` | 枚举 | 所属难度档，引用解锁条件.tier_id。 |
| `min_stage_no` | 整数，阶段 | 开始可出题的最低阶段，获批首版为1或2。 |
| `drink_name` | 字符串 | 订单展示名称；不可用作配方引用键。 |
| `tea_id` | 字符串，原料ID | 茶底，引用原料.ingredient_id，维度TEA。 |
| `milk_id` | 字符串，原料ID | 奶类，引用原料.ingredient_id，维度MILK。 |
| `topping_id` | 字符串，原料ID | 小料，引用原料.ingredient_id，维度TOPPING。 |
| `sweet_id` | 字符串，可空，原料ID | 甜度，引用SWEET；简单档留空。 |
| `ice_id` | 字符串，可空，原料ID | 冰量，引用ICE；简单和中等档留空。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，技术审查与运行发布待完成。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |
