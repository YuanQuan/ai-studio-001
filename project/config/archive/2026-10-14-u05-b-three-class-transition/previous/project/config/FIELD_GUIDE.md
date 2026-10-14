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

## 奶茶小游戏候选配置字段

当前候选：`project/config/source/MILK_TEA_MINIGAME.xlsx`；来源获批源表：`project/config/source/MILK_TEA_MINIGAME_v0.1.xlsx`；旧字节归档：`project/config/archive/2026-10-12-config-audit/MILK_TEA_MINIGAME_v0.1.xlsx`。本候选仅将四表逐行 `status` 从 `DRAFT` 提为 `READY`、`export_enabled` 从 `false` 提为 `true`。`READY` 表示 Product 已提交整本候选供审核，不表示当前可运行；资源索引的 `active_path` 仍为空，正式资源列表仍空。除特别写明外，字段无运行默认值，缺值拒绝；技术存储类型、导出与跨端可见性以 Tech 审查为准。

### 难度阶段

| 原字段名 | 类型与单位 | 取值、空值、默认、引用与适用范围 |
|---|---|---|
| `stage_id` | 非空字符串，稳定阶段ID | 唯一，格式 `MG01_<tier_id>_<stage_no>`；不可空，无默认；本表主键，仅 MG01。 |
| `tier_id` | 枚举，难度档ID | EASY/MEDIUM/HARD/HELL/NIGHTMARE；不可空，无默认；引用解锁条件.`tier_id`，五档各两阶段。 |
| `stage_no` | 整数，档内阶段序号 | 仅 1、2；不可空，无默认；与 `tier_id` 组成五档各两阶段。 |
| `xp_from` | 非负整数，累计熟练度XP | 不可空，无默认；阶段2大于同档阶段1；阶段1是低XP兜底，不另成解锁门槛。 |
| `recipe_dims` | 整数，配方维度/杯 | 简单到噩梦为 3/4/5/5/5；不可空，无默认；仅当前档位启用的维度参与选料。 |
| `orders_target` | 正整数，杯/局 | 获批首版各行均为 3；不可空，无默认；正确交杯数达标过关，与配方记录数无关。 |
| `time_sec` | 正整数或真空值，秒/局 | 简单必须真空值、表示不限时；其他四档必须大于 0；无默认，0 或文本 `null` 不能代替空值。 |
| `options_per_dim` | 整数，选项/已启用维度 | 2–4；不可空，无默认；不超过各启用维度的原料数，按原料 `sort_order` 取前 N。 |
| `xp_reward` | 非负整数，熟练度XP/次通关 | 不可空，无默认；同档两阶段相同，五档严格递增；重复通关也按本值结算。 |
| `status` | 枚举，记录审核状态 | 候选逐行为 `READY`；不可空，无默认；仅表内容待审批，不能单凭本值运行。 |
| `export_enabled` | 布尔，业务导出开关 | 候选逐行为 `true`；不可空，无默认；独立于解锁条件开关，运行仍受整本审批、技术审查与正式索引门禁约束。 |

### 解锁条件

| 原字段名 | 类型与单位 | 取值、空值、默认、引用与适用范围 |
|---|---|---|
| `tier_id` | 枚举，难度档ID | EASY/MEDIUM/HARD/HELL/NIGHTMARE 各一条；不可空，无默认；本表主键。 |
| `prev_tier_id` | 枚举或真空值，前一档ID | 简单必须真空值，其余依次引用紧邻上一档；无默认；上一档通关始终必需。 |
| `initial_open` | 布尔，初始开放 | 仅简单 `true`，其余 `false`；不可空，无默认；已解锁档永久可选。 |
| `xp_enabled` | 布尔，熟练度门槛开关 | true/false；不可空，无默认；关闭时忽略 `xp_min`，不丢弃本行。 |
| `xp_min` | 非负整数，累计熟练度XP | 不可空，无默认；开关开启时作为解锁门槛，关闭时为合法占位；不消耗XP。 |
| `level_enabled` | 布尔，店长等级门槛开关 | true/false；不可空，无默认；关闭时忽略 `level_min`。 |
| `level_min` | 非负整数，店长等级 | 不可空，无默认；开关开启时检查外部店长等级，关闭时为合法占位。 |
| `soul_enabled` | 布尔，魂数门槛开关 | true/false；不可空，无默认；关闭时忽略 `soul_min`。 |
| `soul_min` | 整数，已找回魂数 | 0–3；不可空，无默认；开关开启时单独检查，关闭时为合法占位，不与魄数合并。 |
| `spirit_enabled` | 布尔，魄数门槛开关 | true/false；不可空，无默认；关闭时忽略 `spirit_min`。 |
| `spirit_min` | 整数，已找回魄数 | 0–7；不可空，无默认；开关开启时单独检查，关闭时为合法占位。 |
| `status` | 枚举，记录审核状态 | 候选逐行为 `READY`；不可空，无默认；与档位开放状态不同。 |
| `export_enabled` | 布尔，业务导出开关 | 候选逐行为 `true`；不可空，无默认；与上方四个门槛开关独立，不能据此判定档位解锁。 |

上一档通关与所有**已启用**的熟练度、店长等级、魂数、魄数条件同时满足才解锁；四个开关全部关闭时只需上一档通关。简单为初始开放例外。

### 原料

| 原字段名 | 类型与单位 | 取值、空值、默认、引用与适用范围 |
|---|---|---|
| `ingredient_id` | 非空字符串，稳定原料ID | 全表唯一；不可空，无默认；供配方五维字段引用，不以名称作键。 |
| `dimension` | 枚举，原料维度 | TEA/MILK/TOPPING/SWEET/ICE；不可空，无默认；每维至少四条，分别对应茶底、奶类、小料、甜度、冰量。 |
| `name` | 非空字符串，展示名称 | 不可空，无默认；只用于展示，不能当引用键。 |
| `sort_order` | 正整数，同维备选顺序 | 同一 `dimension` 内唯一；不可空，无默认；每阶段按前 `options_per_dim` 项构造选池。 |
| `status` | 枚举，记录审核状态 | 候选逐行为 `READY`；不可空，无默认；仅原料记录审核状态。 |
| `export_enabled` | 布尔，业务导出开关 | 候选逐行为 `true`；不可空，无默认；整表发布门禁仍需另过。 |

### 配方

| 原字段名 | 类型与单位 | 取值、空值、默认、引用与适用范围 |
|---|---|---|
| `recipe_id` | 非空字符串，稳定配方ID | 全表唯一；不可空，无默认；本表主键，不用饮品名替代。 |
| `tier_id` | 枚举，难度档ID | 五档之一；不可空，无默认；引用解锁条件.`tier_id`，只在所属档出题。 |
| `min_stage_no` | 整数，起始阶段 | 1 或 2；不可空，无默认；当前阶段不低于该值时可出题，每档阶段1两条、阶段2新增一条。 |
| `drink_name` | 非空字符串，饮品展示名 | 不可空，无默认；用于订单提示，不解析为配方。 |
| `tea_id` | 非空原料ID，茶底 | 不可空，无默认；引用原料.`ingredient_id`，维度必须 TEA，正确项须在本阶段选池。 |
| `milk_id` | 非空原料ID，奶类 | 不可空，无默认；引用原料，维度必须 MILK，正确项须在本阶段选池。 |
| `topping_id` | 非空原料ID，小料 | 不可空，无默认；引用原料，维度必须 TOPPING，每杯只选一项，正确项须在选池。 |
| `sweet_id` | 原料ID或真空值，甜度 | 简单必须空；中等以上必须引用 SWEET；无默认，正确项须在选池。 |
| `ice_id` | 原料ID或真空值，冰量 | 简单和中等必须空；困难以上必须引用 ICE；无默认，正确项须在选池。 |
| `status` | 枚举，记录审核状态 | 候选逐行为 `READY`；不可空，无默认；不代表订单完成状态。 |
| `export_enabled` | 布尔，业务导出开关 | 候选逐行为 `true`；不可空，无默认；整本配置未批准前不能进入运行资源。 |

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
