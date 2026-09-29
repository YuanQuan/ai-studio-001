# 顾客配置逻辑结构与样例

版本：v0.1｜日期：2026-09-28｜Product 草案；字段与枚举为逻辑建议，待评审和用户审批。

目标：顾客作为独立经营对象，支持一个顾客由多种机制出现、出现后触发特殊互动，并引用后续事件／任务。用户已明确：店员辅助经营；顾客分普通与特殊；特殊顾客支持定时触发、数值参数触发，能与特殊店长、特殊装扮店铺互动，产生特殊对话或任务。行为进度、组合条件与事件信号属于产品建议。本轮不确定概率、阈值、经济奖励与具体剧情。

## 1. 关系与共同约定

`Customer 1—N CustomerTrigger 1—N CustomerCondition`；`Customer 1—N CustomerInteraction 1—N CustomerContentRef`。Trigger 可选择一个 Interaction；所选互动必须属于同一顾客。

共同字段：`id:string` 必填、表内唯一、发布后不可改；`enabled:boolean` 默认 false；`status:enum` 为 DRAFT/READY/DEPRECATED，默认 DRAFT；`note:string?` 仅编辑备注。只有 READY 且 enabled=true 的行可发布，废弃 ID 禁止复用。以下“可空”均指逻辑允许空，未写可空即必填。

类型建议：string 为文本；int 为整数；decimal 为十进制数；boolean 为布尔；enum 为受控枚举。ID 保留文本避免表格截断。跨表引用必须校验，中文名称只供阅读。

## 2. 顾客主表 Customer

| 字段 | 类型／空值 | 含义与约束 |
|---|---|---|
| id | string | 顾客类型／角色配置 ID，不是一次到访实例 ID |
| display_name | string | 显示名称；样例名不视为角色定稿 |
| customer_kind | enum | NORMAL/SPECIAL；类别不隐含概率或奖励倍率 |
| description | string，可空 | 产品定位说明 |
| presentation_ref | string，可空 | 美术／展示资源引用；正式显示前必须解析，当前可待定 |
| preference_note | string，可空 | 偏好说明，仅供设计阅读；实际条件必须写入条件表 |

顾客实时位置、此次订单、好感进度、冷却截止时间属于运行状态，不放入静态主表。是否存在好感系统尚未提出，本结构不引入该玩法。

## 3. 触发表 CustomerTrigger

| 字段 | 类型／空值 | 含义与约束 |
|---|---|---|
| id | string | 一条独立触发规则 ID |
| customer_id | FK Customer.id | 目标顾客 |
| trigger_kind | enum | NATURAL_FLOW/TIMED/NUMERIC/CONDITION_MET/EVENT_SIGNAL/TASK_SIGNAL；TIMED、NUMERIC 对应用户明确方向，其余为候选扩展 |
| signal_ref | string，可空 | EVENT_SIGNAL/TASK_SIGNAL 时必填，引用对应事件／任务信号；其他类型留空 |
| signal_reference_status | enum，可空 | signal_ref 非空时必填 PLANNED/RESOLVED；发布必须 RESOLVED |
| schedule_ref | string，可空 | TIMED 时必填时间计划引用；具体周期、时区、有效窗口待定 |
| priority | int，可空于草稿 | 同一顾客同时命中规则时的选择优先级；越大越优先，发布必填 |
| chance | decimal，可空于草稿 | 条件满足后的出现概率，范围[0,1]；发布必填，不默认随机权重 |
| cooldown_seconds | int，可空于草稿 | 同一玩家、同一顾客两次成功出现的最短间隔，>=0；发布必填 |
| interaction_id | FK CustomerInteraction.id，可空 | 成功出现后关联的特殊互动；普通顾客可空 |

明确方向：TIMED 按时间计划触发，NUMERIC 按指标比较触发；前者必须有可解析 schedule_ref，后者必须至少有数值条件。候选扩展：自然客流、组合条件、事件与任务信号入口。店员辅助如果影响顾客，应通过已定义条件或效果关联，不能把所有到访强制绑定店员。

建议去重：一次判定中同一顾客命中多条规则只选优先级最高者；同优先级按规则 ID 升序保证可复现；该规则概率失败时本轮不回退尝试低优先级规则。冷却按玩家×顾客统一约束，避免多入口重复生成；已有该顾客实例时是否允许再到访及自然客流的并发上限尚待玩法确认。以上为待审建议，不可直接当最终生成算法。

## 4. 条件表 CustomerCondition

| 字段 | 类型／空值 | 含义与约束 |
|---|---|---|
| id | string | 条件行 ID |
| trigger_id | FK CustomerTrigger.id，可空 | 所属触发规则；与 interaction_id 二选一必填 |
| group_no | int | >=1；同组 AND，组间 OR |
| condition_kind | enum | SHOP_STATE/THEME_STATE/PROGRESS_STATE/STAFF_EFFECT/METRIC_VALUE/STAFF_PRESENT/SHOP_DECORATION；其中 STAFF_PRESENT 专指有名店长在岗，普通店员辅助效果由 STAFF_EFFECT 表示；按实际需求扩展 |
| interaction_id | FK CustomerInteraction.id，可空 | 用于特殊互动的条件；与 trigger_id 二选一必填，避免把互动资格误当出现资格 |
| target_ref | string | 条件对象或产品指标引用，类型由 condition_kind 决定 |
| operator | enum | EQ/GTE/HAS；允许组合需逐类校验，不支持任意脚本 |
| value_type | enum | STRING/INTEGER/DECIMAL/BOOLEAN，与目标定义匹配 |
| expected_value | 对应类型，可空于草稿 | 比较目标值；发布必填，禁止把文字“待定”写进数值字段 |
| reference_status | enum | PLANNED/RESOLVED；发布只允许 RESOLVED |

草稿示例：主题已满足可用 THEME_STATE + HAS；主线已完成可用 PROGRESS_STATE + EQ。具体指标、对象表和比较单位必须先在对应字典定义。NATURAL_FLOW 可无条件行；其他触发类型是否允许无条件由正式规则明确。STAFF_EFFECT 仅表示辅助条件候选，不承诺招募、收费或特定加成玩法。

## 5. 互动表 CustomerInteraction

| 字段 | 类型／空值 | 含义与约束 |
|---|---|---|
| id | string | 特殊互动 ID |
| customer_id | FK Customer.id | 所属顾客 |
| interaction_kind | enum | SPECIAL_ORDER/DIALOGUE/EVENT/TASK；候选类型 |
| title | string | 用户可读互动名称 |
| occurrence_policy | enum，可空于草稿 | ONCE/REPEATABLE；作用域为玩家×互动，发布必填 |
| description | string，可空 | 互动意图，不充当事件脚本 |

互动内容和奖励在对应订单／事件／任务规范定义，顾客表只引用。触发状态、完成状态与领取状态分开由后续状态规格定义，不能把“出现”当成“完成”。

## 6. 内容引用表 CustomerContentRef

| 字段 | 类型／空值 | 含义与约束 |
|---|---|---|
| id | string | 引用记录 ID |
| interaction_id | FK CustomerInteraction.id | 所属互动 |
| content_type | enum | ORDER/EVENT/TASK/DIALOGUE |
| content_id | string | 目标类型下的内容 ID，不放脚本文本或任务全文 |
| purpose | enum | ENTRY/FOLLOW_UP；入口或后续内容 |
| reference_status | enum | PLANNED/RESOLVED；发布只允许 RESOLVED |

每个启用互动必须有且仅有一个 ENTRY 引用；FOLLOW_UP 是候选关联清单，执行时机与顺序由内容规则决定，不按表格行号自动执行。跨引用不得形成无终止触发环。内容不存在或未获批时不启用。

## 7. 顾客样表数据（均为非运行草稿）

以下 ID 仅用于说明结构，所有行 status=DRAFT、enabled=false；中文备注不承担程序语义。两个示例顾客不是新增正式角色。

| Customer.id | display_name | customer_kind | preference_note |
|---|---|---|---|
| customer_demo_normal | 普通顾客样例 | NORMAL | 基础经营客流 |
| customer_demo_special | 特殊顾客样例 | SPECIAL | 以定时与数值入口示意多触发结构 |

| Trigger.id | customer_id | trigger_kind | schedule_ref | interaction_id |
|---|---|---|---|---|
| trigger_demo_flow | customer_demo_normal | NATURAL_FLOW | 空 | 空 |
| trigger_demo_timed | customer_demo_special | TIMED | 空，待定义 | interaction_demo_dialogue |
| trigger_demo_numeric | customer_demo_special | NUMERIC | 空 | interaction_demo_task |

三行 priority/chance/cooldown_seconds 均空且待定，禁止发布。定时计划未定义、数值指标与阈值未确定；不得把“待定”写入运行数值。特殊对话的互动条件使用 STAFF_PRESENT 指向特殊店长、SHOP_DECORATION 指向特殊装扮店铺，并以相同 group_no 表达组合条件。

| Condition.id | trigger_id | interaction_id | group_no | condition_kind | target_ref | expected_value |
|---|---|---|---|---|---|---|
| condition_demo_numeric | trigger_demo_numeric | 空 | 1 | METRIC_VALUE | 空，待定义 | 空，待定 |
| condition_demo_staff | 空 | interaction_demo_dialogue | 1 | STAFF_PRESENT | 空，待定义 | 空，待定 |
| condition_demo_decor | 空 | interaction_demo_dialogue | 1 | SHOP_DECORATION | 空，待定义 | 空，待定 |

| Interaction.id | customer_id | interaction_kind | title | occurrence_policy |
|---|---|---|---|---|
| interaction_demo_dialogue | customer_demo_special | DIALOGUE | 特殊对话样例 | 空，待定 |
| interaction_demo_task | customer_demo_special | TASK | 特殊任务样例 | 空，待定 |

| ContentRef.id | interaction_id | content_type | content_id | purpose | reference_status |
|---|---|---|---|---|---|
| ref_demo_dialogue | interaction_demo_dialogue | DIALOGUE | dialogue_demo | ENTRY | PLANNED |
| ref_demo_task | interaction_demo_task | TASK | task_demo | ENTRY | PLANNED |

## 8. 发布校验与待定项

校验：ID 唯一／不复用；字段类型和必填；外键存在；顾客与互动归属一致；条件组合法；比较值类型与单位匹配；概率与冷却范围；启用行引用不得指向禁用／废弃／未解析对象；互动入口唯一；触发去重及循环引用；草稿示例排除在发布集外。

尚待用户分析：首批顾客类型、实际多触发机制、条件类别、概率与频次、优先级、并发规则、互动是否重复、事件／任务实际内容、店员如何辅助。技术评审待定：跨端字段分发、权威判定位置、导出格式、热更新能力和兼容迁移。上述未定项应阻止发布，不阻止本轮讨论与填样表。


## 9. 技术评审补充的发布门禁

- NUMERIC 规则的每个 OR 分组都必须至少包含一条 METRIC_VALUE 数值比较条件；不能用另一组纯装扮／店员条件绕过数值门槛。所有组均按此前 AND/OR 语义校验。
- 同一次到访若存在多个符合资格的特殊互动，选择一个、依序执行还是并行开放仍待产品确认。此项未确定前，涉及多互动命中的配置不得发布；样例保持禁用。
- 定时计划必须明确时区、有效窗口及跨日解释；未建立计划定义和引用解析前 TIMED 不得发布。

## 10. v0.4概要对应的逻辑扩展（未同步XLSX）

**v0.4历史记录，已被v0.6覆盖：**当时顾客按喜好选摊，一次进入至离开访问1至多个摊位，每次驻足有时间；摊位容量初始1、升级增加至上限N待定；未接待者排队，等久生气离开；闹事未及时处理可驱离某摊位全部顾客。以下仅结构候选，不改变前述现有样例工作簿与既有字段契约，启用前须新版本审批。

### 静态配置候选

| 逻辑对象 | 字段候选与类型建议 | 业务意义及约束 |
|---|---|---|
| CustomerPreference | id:string、customer_id:FK、target_kind:enum、target_ref:string、preference_value:decimal? | 指向摊位／商品／主题等偏好对象，实际类别与评分选取算法待定；不得用名称做外键 |
| CustomerVisitRule | id:string、customer_id:FK、max_visit_count:int?、dwell_seconds:decimal? | 最多访问数、驻足时长待定，非空须正值；1至多摊为正常过程方向。排队久等不触发反感离开 |
| ShopCapacity | shop_id:FK、level_ref:FK、concurrent_capacity:int | 初始容量1、升级增加；后续值及上限N待定，容量为正整数；具体结构应与店铺升级字典合并评审，避免双份事实源 |
| DisturbanceEvent | id:string、actor_ref:string?、response_rule_ref:string?、response_window_seconds:decimal?、effect_ref:string?、penalty_chance:decimal? | 闹事角色、应对、窗口及效果引用；数值待定，概率若采用须[0,1]；“未处理是否必罚”也须明确 |

闹事者可以是独立夜市事件角色，不自动归入普通／特殊消费顾客，不强制拥有消费偏好。其与Customer身份是否复用待定。effect_ref 可描述驱离当前摊位顾客的行为；具体包含排队／服务／驻足哪些集合，以及中断订单的处理待定，不额外创造资产扣除或战斗。

### 运行状态边界（不建静态表）

- **到访实例**：一次从进入到离开的会话，关联customer_id，记录当前流程、已访问摊位等运行事实；实例ID不同于静态Customer.id。
- **摊位访问段**：到访实例内一次选摊、到达驻足、排队或接待、结束的片段；与到访实例是一对多关系。是否可重复同摊、访问计数时点待定。
- **摊位运行状态**：当前服务占位、队列、当前容量；队列长度不是静态容量字段。升级时占位如何变更、排队优先级待定。
- **闹事事件实例**：发生对象、应对截止、处理结果与受影响顾客集合；不把实时截止时刻或剩余队列写入配置。

概要流转：进入→按喜好选摊→到达驻足→有容量接待／无容量排队→接待完成→下次选摊或离开；排队可转接待，久等不会造成顾客反感离开，闹事可中断访问。驻足时间是否覆盖排队和服务、事件离开整个夜市还是当前摊位待定。

### 发布门禁与世界范围

新增配置在偏好算法、访问边界、驻足／服务计时、排队效率与收益关系、容量等级映射、闹事应对与驱离范围未明确时不得发布。资源与顾客结算须防重复结算，具体实现交技术评审。

玩家可见范围是单一共享世界，暂无多区服；这不意味着单一物理进程、顾客全世界唯一或所有玩家必须同屏。世界限量资源遵循同一逻辑世界语义；顾客在何种场景范围生成、可见与持有状态仍待技术及产品细化。

### v0.6 语义覆盖

用户最新指令覆盖本节开头“排队等久生气离开”的历史依据。现行方向为排队久等不导致顾客反感离开，等待只影响整体收益效率；本节已撤销对应耐心离开字段候选。闹事事件的顾客驱离仍单独保留。现有工作簿样例未包含新访问字段，本次不修改。
