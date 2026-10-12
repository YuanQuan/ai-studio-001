# 业务配置字段中文说明

本文件逐项解释当前发现的三本业务工作簿全部表头。状态以准确审批文件为准；字段解释用于阅读，不使草案成为运行配置。类型属于现有产品文档所述逻辑类型，最终存储类型、导出格式与跨端可见性待 Tech Lead 审查。未写明的默认值、空值和数值单位均标为待定。

## 顾客配置样例

原始工作簿：`project/config/source/CUSTOMER_CONFIG_v0.1.xlsx`。原产品说明：`project/config/schema/CUSTOMER_CONFIG.md`。状态：草案；归档副本：`project/config/archive/2026-10-12-config-audit/CUSTOMER_CONFIG_v0.1.xlsx`。

### Customer

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `id` | string | 顾客类型／角色配置 ID，不是一次到访实例 ID。 |
| `enabled` | boolean | 记录启用开关；样例均为 false，默认 false。 |
| `status` | enum | 记录状态，DRAFT/READY/DEPRECATED；样例为 DRAFT。 |
| `note` | string，可空 | 人工编辑备注，不承担运行语义。 |
| `display_name` | string | 显示名称；样例名不视为角色定稿。 |
| `customer_kind` | enum | NORMAL/SPECIAL；类别不隐含概率或奖励倍率。 |
| `description` | string，可空 | 产品定位说明。 |
| `presentation_ref` | string，可空 | 美术／展示资源引用；正式显示前必须解析，当前可待定。 |
| `preference_note` | string，可空 | 偏好说明，仅供设计阅读；实际条件必须写入条件表。 |

### CustomerTrigger

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `id` | string | 一条独立触发规则 ID。 |
| `enabled` | boolean | 记录启用开关；样例均为 false，默认 false。 |
| `status` | enum | 记录状态，DRAFT/READY/DEPRECATED；样例为 DRAFT。 |
| `note` | string，可空 | 人工编辑备注，不承担运行语义。 |
| `customer_id` | FK Customer.id | 目标顾客。 |
| `trigger_kind` | enum | NATURAL_FLOW/TIMED/NUMERIC/CONDITION_MET/EVENT_SIGNAL/TASK_SIGNAL；TIMED、NUMERIC 对应用户明确方向，其余为候选扩展。 |
| `signal_ref` | string，可空 | EVENT_SIGNAL/TASK_SIGNAL 时必填，引用对应事件／任务信号；其他类型留空。 |
| `signal_reference_status` | enum，可空 | signal_ref 非空时必填 PLANNED/RESOLVED；发布必须 RESOLVED。 |
| `schedule_ref` | string，可空 | TIMED 时必填时间计划引用；具体周期、时区、有效窗口待定。 |
| `priority` | int，可空于草稿 | 同一顾客同时命中规则时的选择优先级；越大越优先，发布必填。 |
| `chance` | decimal，可空于草稿 | 条件满足后的出现概率，范围[0,1]；发布必填，不默认随机权重。 |
| `cooldown_seconds` | int，可空于草稿 | 同一玩家、同一顾客两次成功出现的最短间隔，>=0；发布必填。 |
| `interaction_id` | FK CustomerInteraction.id，可空 | 成功出现后关联的特殊互动；普通顾客可空。 |

### CustomerCondition

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `id` | string | 条件行 ID。 |
| `enabled` | boolean | 记录启用开关；样例均为 false，默认 false。 |
| `status` | enum | 记录状态，DRAFT/READY/DEPRECATED；样例为 DRAFT。 |
| `note` | string，可空 | 人工编辑备注，不承担运行语义。 |
| `trigger_id` | FK CustomerTrigger.id，可空 | 所属触发规则；与 interaction_id 二选一必填。 |
| `interaction_id` | FK CustomerInteraction.id，可空 | 用于特殊互动的条件；与 trigger_id 二选一必填，避免把互动资格误当出现资格。 |
| `group_no` | int | >=1；同组 AND，组间 OR。 |
| `condition_kind` | enum | SHOP_STATE/THEME_STATE/PROGRESS_STATE/STAFF_EFFECT/METRIC_VALUE/STAFF_PRESENT/SHOP_DECORATION；其中 STAFF_PRESENT 专指有名店长在岗，普通店员辅助效果由 STAFF_EFFECT 表示；按实际需求扩展。 |
| `target_ref` | string | 条件对象或产品指标引用，类型由 condition_kind 决定。 |
| `operator` | enum | EQ/GTE/HAS；允许组合需逐类校验，不支持任意脚本。 |
| `value_type` | enum | STRING/INTEGER/DECIMAL/BOOLEAN，与目标定义匹配。 |
| `expected_value` | 对应类型，可空于草稿 | 比较目标值；发布必填，禁止把文字“待定”写进数值字段。 |
| `reference_status` | enum | PLANNED/RESOLVED；发布只允许 RESOLVED。 |

### CustomerInteraction

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `id` | string | 特殊互动 ID。 |
| `enabled` | boolean | 记录启用开关；样例均为 false，默认 false。 |
| `status` | enum | 记录状态，DRAFT/READY/DEPRECATED；样例为 DRAFT。 |
| `note` | string，可空 | 人工编辑备注，不承担运行语义。 |
| `customer_id` | FK Customer.id | 所属顾客。 |
| `interaction_kind` | enum | SPECIAL_ORDER/DIALOGUE/EVENT/TASK；候选类型。 |
| `title` | string | 用户可读互动名称。 |
| `occurrence_policy` | enum，可空于草稿 | ONCE/REPEATABLE；作用域为玩家×互动，发布必填。 |
| `description` | string，可空 | 互动意图，不充当事件脚本。 |

### CustomerContentRef

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `id` | string | 引用记录 ID。 |
| `enabled` | boolean | 记录启用开关；样例均为 false，默认 false。 |
| `status` | enum | 记录状态，DRAFT/READY/DEPRECATED；样例为 DRAFT。 |
| `note` | string，可空 | 人工编辑备注，不承担运行语义。 |
| `interaction_id` | FK CustomerInteraction.id | 所属互动。 |
| `content_type` | enum | ORDER/EVENT/TASK/DIALOGUE。 |
| `content_id` | string | 目标类型下的内容 ID，不放脚本文本或任务全文。 |
| `purpose` | enum | ENTRY/FOLLOW_UP；入口或后续内容。 |
| `reference_status` | enum | PLANNED/RESOLVED；发布只允许 RESOLVED。 |

## 奶茶小游戏配置草案

原始工作簿：`project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx`。原产品说明：`deliverables/product/MILK-TEA-MINIGAME-SPEC-20261012/v0.1/CONFIG_SPEC.md`。状态：草案；归档副本：`project/config/archive/2026-10-12-config-audit/MILK_TEA_MINIGAME_v0.1.xlsx`。

### 难度阶段

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `stage_id` | 字符串 | 阶段唯一 ID。 |
| `tier_id` | 枚举 | 难度档 ID，引用解锁条件.tier_id；EASY/MEDIUM/HARD/HELL/NIGHTMARE。 |
| `stage_no` | 整数 | 档内阶段序号，草案为 1 或 2。 |
| `xp_from` | 非负整数，累计熟练度 | 进入本阶段的累计熟练度起点；阶段1不另成解锁条件。 |
| `recipe_dims` | 整数，维度数 | 本阶段配方维度数；草案按五档为3/4/5/5/5。 |
| `orders_target` | 正整数，杯/局 | 本局正确订单目标数量。 |
| `time_sec` | 正整数，秒；简单档留空 | 一局时限；简单不限时，中等以上填正数。 |
| `options_per_dim` | 整数，项/维度 | 每维可选原料数量；草案为2–4且不超过可用原料数。 |
| `xp_reward` | 非负整数，熟练度/通关 | 通关所得熟练度；具体数值未获批准。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，未获正式使用批准。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 解锁条件

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `tier_id` | 枚举 | 难度档唯一 ID。 |
| `prev_tier_id` | 枚举，可空 | 前一难度档 ID；简单档留空，其余引用上一档。 |
| `initial_open` | 布尔 | 是否初始开放；草案仅简单档为 true。 |
| `xp_enabled` | 布尔 | 是否启用累计熟练度解锁门槛。 |
| `xp_min` | 非负整数，累计熟练度 | 熟练度最低门槛；开关关闭时不参与判断。 |
| `level_enabled` | 布尔 | 是否启用店长等级门槛。 |
| `level_min` | 非负整数，等级 | 最低等级；开关关闭时为占位。 |
| `soul_enabled` | 布尔 | 是否启用魂数门槛。 |
| `soul_min` | 非负整数，魂数 | 魂数最低门槛；草案范围0–3，关闭时为占位。 |
| `spirit_enabled` | 布尔 | 是否启用魄数门槛。 |
| `spirit_min` | 非负整数，魄数 | 魄数最低门槛；草案范围0–7，关闭时为占位。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，未获正式使用批准。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 原料

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `ingredient_id` | 字符串 | 原料唯一 ID，供配方引用。 |
| `dimension` | 枚举 | 原料维度，TEA/MILK/TOPPING/SWEET/ICE。 |
| `name` | 字符串 | 用户可读原料名。 |
| `sort_order` | 整数，顺序 | 同维度备选项基础排序；数值细节为草案。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，未获正式使用批准。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

### 配方

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `recipe_id` | 字符串 | 配方唯一 ID。 |
| `tier_id` | 枚举 | 所属难度档，引用解锁条件.tier_id。 |
| `min_stage_no` | 整数，阶段 | 开始可出题的最低阶段，草案为1或2。 |
| `drink_name` | 字符串 | 订单展示名称；不可用作配方引用键。 |
| `tea_id` | 字符串，原料ID | 茶底，引用原料.ingredient_id，维度TEA。 |
| `milk_id` | 字符串，原料ID | 奶类，引用原料.ingredient_id，维度MILK。 |
| `topping_id` | 字符串，原料ID | 小料，引用原料.ingredient_id，维度TOPPING。 |
| `sweet_id` | 字符串，可空，原料ID | 甜度，引用SWEET；简单档留空。 |
| `ice_id` | 字符串，可空，原料ID | 冰量，引用ICE；简单和中等档留空。 |
| `status` | 枚举 | 记录状态；当前所有行为 DRAFT，未获正式使用批准。 |
| `export_enabled` | 布尔 | 业务导出开关；当前所有行为 false，禁止导入运行配置。 |

## U00六店位置待审基线

原始工作簿：`deliverables/product/U00-SHOP-LAYOUT-CONFIG-001/v0.1/U00_SHOP_LAYOUT.xlsx`。原产品说明：`deliverables/product/U00-SHOP-LAYOUT-CONFIG-001/v0.1/CONFIG_SPEC.md`。状态：草案；归档副本：`project/config/archive/2026-10-12-config-audit/U00_SHOP_LAYOUT_v0.1.xlsx`。

### U00六店位置

| 原字段名 | 类型／单位／关联 | 中文含义、默认值与空值 |
|---|---|---|
| `沿街序位` | 整数，序位 | 六店沿街顺序1–6；对应 display_order，不定义解锁顺序。 |
| `店铺ID` | 字符串，店铺ID | 稳定店铺 ID；对应 shop_id，引用既有六店 SHOP_IDS。 |
| `店铺名称` | 字符串 | 人工核对名称；对应 shop_name，不作外键。 |
| `落脚点X` | 有限数值，源画布像素 | ground_contact 在场景中的横向目标坐标；中心原点，向右为正；当前旧R3基线，调整值未定。 |
| `落脚点Y` | 有限数值，源画布像素 | ground_contact 在场景中的纵向目标坐标；中心原点，向上为正；当前旧R3基线，调整值未定。 |
