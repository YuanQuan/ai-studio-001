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

## 奶茶小游戏配置（MG01 v0.1）

版本 v0.1，对应当前稳定人工源 `project/config/source/MILK_TEA_MINIGAME.xlsx`，四表 41 个字段全部列出。该版本通过 Product、Tech 与用户审批；所有 201 行均为 `READY` 且 `export_enabled=true`，通过三类生成器校验后仅发布客户端 JSON，供 U05 前端示例使用。旧服务端 JSON 保留在稳定路径供追溯，标为历史非当前运行资源；本次未生成新的服务端输出。字符串 ID 大小写敏感、不可改义复用；整数均用实际数值单元格。

### 难度阶段（13 字段，10 行）

| 字段 | 中文含义与范围／空值 |
|---|---|
| `stage_id` | 阶段唯一稳定 ID，例 `MG01_EASY_1`，非空；每档两阶段。 |
| `tier_id` | 所属难度 ID，`EASY/MEDIUM/HARD/HELL/NIGHTMARE`，引用解锁条件。 |
| `stage_no` | 档内阶段序号，仅 1 或 2；同档不得重复。 |
| `xp_from` | 进入本档该阶段的累计熟练度起点，非负整数；门槛关闭且 XP 低于阶段 1 起点时仍取阶段 1。 |
| `recipe_dims` | 每杯应选类别数，本版固定 3，即茶／奶／小料各一。 |
| `orders_target` | 一局正确交杯目标，固定 3 杯；不随配方行数变化。 |
| `time_sec` | 从开始制作至本局截止的秒数；简单两行留空表示不限时，其他行须正整数，0 不代表不限时。 |
| `tea_options` | 茶类开放数量，取茶原料按 `sort_order` 前 N 项，整数 1～3；本版按已批开放表。 |
| `milk_options` | 奶类开放数量，取奶原料按 `sort_order` 前 N 项，整数 1～3。 |
| `topping_options` | 小料开放数量，取小料原料按 `sort_order` 前 N 项，整数 1～6。 |
| `xp_reward` | 本档成功通关一次所得经验，正整数；重打成功同值，失败退出不给。 |
| `status` | 行候选状态，正式行固定 `READY`；单独的 READY 不代表运行发布，当前客户端示例需同时满足获批源表、技术校验和客户端生成清单。 |
| `export_enabled` | 独立发布许可，正式行固定 `true`；与经验门槛 `xp_enabled` 无关。 |

旧统一 `options_per_dim` 被三个逐类计数字段取代。阶段数值为简单 `0/20 XP、无时限、10 XP 奖励`，中等 `50/75、150/135 秒、15`，困难 `120/150、135/120 秒、22`，地狱 `220/260、120/105 秒、30`，噩梦 `360/410、105/90 秒、40`；所有阶段均三杯。阶段开放数详见工作簿，不得把 `xp_from` 当作解锁开关关闭时的隐藏条件。

### 解锁条件（13 字段，5 行）

| 字段 | 中文含义与范围／空值 |
|---|---|
| `tier_id` | 本档 ID，五档唯一，与难度阶段、配方的同名字段关联。 |
| `prev_tier_id` | 必须先通关的上一档 ID；仅简单为空，其余引用本表 `tier_id`。 |
| `initial_open` | 初始是否开放，仅简单为 `true`，高档为 `false`。 |
| `xp_enabled` | 是否启用累计熟练度解锁门槛；与 `export_enabled` 不同。 |
| `xp_min` | 熟练度门槛，非负整数，关闭时保留合法占位值但不判定。 |
| `level_enabled` | 是否启用店长等级门槛。 |
| `level_min` | 店长等级下限，正整数，关闭时仍校验范围但不判定。 |
| `soul_enabled` | 是否启用魂数门槛。 |
| `soul_min` | 魂数下限，非负整数，关闭时仍校验范围但不判定。 |
| `spirit_enabled` | 是否启用魄数门槛。 |
| `spirit_min` | 魄数下限，非负整数，关闭时仍校验范围但不判定。 |
| `status` | 正式行固定 `READY`。 |
| `export_enabled` | 正式行固定 `true`，不因任一解锁开关变化。 |

除初始简单外，解锁需上一档 clear 且所有**启用**门槛同时满足；全部门槛关闭时仅检查上一档 clear。解锁后永久可选，累计 XP 不消耗。本版五档开关、阈值与旧表逐格相同。

### 原料（6 字段，12 行）

| 字段 | 中文含义与范围／空值 |
|---|---|
| `ingredient_id` | 幻想原料稳定唯一 ID；由已批 `CONTENT_PLAN.md` 十二项定义，不复用现实原料 ID。 |
| `dimension` | 类别枚举，仅 `TEA`（茶）、`MILK`（奶）、`TOPPING`（小料）。 |
| `name` | 中文品种名称，非空；玩家可见文案的来源，订单气泡仍不显示配方文字。 |
| `sort_order` | 本类别开放次序，茶／奶各 1～3、小料 1～6，类内连续且唯一；阶段按前 N 项开放。 |
| `status` | 正式行固定 `READY`。 |
| `export_enabled` | 正式行固定 `true`。 |

### 配方（9 字段，174 行）

| 字段 | 中文含义与范围／空值 |
|---|---|
| `recipe_id` | 配方唯一稳定 ID，形如 `MG01_EASY_R001`；同档三元组唯一，不从旧五维 ID 复用。 |
| `tier_id` | 所属难度，引用解锁条件；不同档可有相同三元组。 |
| `min_stage_no` | 配方开始可出题的档内阶段，1 或 2，等于三项原料首次共同开放的阶段；阶段 2 沿用阶段 1 配方。 |
| `drink_name` | 三个幻想原料名称合成的配置审阅名，非空；不在顾客气泡中显示。 |
| `tea_id` | 本杯唯一茶 ID，引用 `dimension=TEA` 原料，须在该阶段茶开放池中。 |
| `milk_id` | 本杯唯一奶 ID，引用 `dimension=MILK` 原料，须在该阶段奶开放池中。 |
| `topping_id` | 本杯唯一小料 ID，引用 `dimension=TOPPING` 原料，须在该阶段小料开放池中。 |
| `status` | 正式行固定 `READY`。 |
| `export_enabled` | 正式行固定 `true`。 |

旧 `sweet_id`、`ice_id` 两列随甜度／冰量玩法取消而废止，不以空列进入新版配方。配方池覆盖每档阶段 2 最大开放池的全部合法三元组；阶段 1 只筛 `min_stage_no<=1`。订单图引用对应三元组的同源茶层、奶层、小料层，最高档阶段 2 可表示 54 种成品；工作簿不定义美术资源路径或图层技术格式。

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
