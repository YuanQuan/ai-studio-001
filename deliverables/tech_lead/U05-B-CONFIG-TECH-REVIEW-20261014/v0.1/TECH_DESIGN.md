# U05 B 三类配置技术输入 v0.1

状态：Product v0.1 隔离草案的专业评审，具体配置版本仍待用户批准。本轮不改工作簿、生成器、客户端或正式资源。

新源固定四表41字段。整数用实际数值单元格并排除布尔伪装；开关为布尔单元格；简单档 `time_sec` 真空，其余档正整数；ID和名称非空且大小写敏感。新运行 schema 须有独立版本身份，固定 `DIMENSIONS=[TEA,MILK,TOPPING]`，阶段使用 `tea_options/milk_options/topping_options`，配方只含三外键。旧五维 reader 不能只因 `recipe_dims=3` 就视为兼容：旧资源仍有甜/冰字段、统一 `options_per_dim` 和15条预设配方。

生成器先提供**不写文件的 dry-check**，可读隔离 DRAFT 源，验证表名/头行/类型、10/5/12/174规模、状态、唯一ID、类别与类内连续顺序、解锁前档链、逐档两阶段、逐类开放数、174三元组、每条最早出题阶段及两阶段正确项全覆盖。仅输出诊断和源SHA；`DRAFT/false` 可通过草案检查，但绝不产生运行JSON。正式 production-filter 须绑定该具体版本的源路径/hash、用户批准记录与资源索引，并要求**全部201行**同时 `READY/true`，缺任一整包拒绝；不能只过滤 READY 行导致题池缺项。正式导出前后复核每档题池非空、全部组合与正确项在池，先写隔离候选包，履行归档/索引门禁后再提升稳定无版本资源。

现有 `tooling/config/milk_tea_config_generator.py` 固定旧 `HEADERS/EXPECTED_ROWS/DIMENSIONS/options_per_dim`、15配方、审批和源路径，并在读表前检查旧批准身份。后续应做版本化三维 profile 或新入口，保留旧五维生成的可复验行为；正式JSON带源hash、批准版本及schema/config版本，Client只消费获批正式资源，不手写业务值。

现有客户端 `u05.milk-tea.lab.v1` 存档仅存 `{version:1,xp,cleared,unlocked}`；当前 `run/selected/orders` 留在内存，未持久化。加载三维配置时保留合法的旧XP、已通关和永久解锁，按新配置重新调和解锁；旧现实原料ID及甜/冰临时选择不迁入新答案。配置切换/重进须丢弃旧半局并重新开单，已结算XP不得重复奖励；若局状态与配置版本不一致，显式拒绝续局。五档计时、每局三杯、XP奖励及解锁数值沿用新源中核对一致的字段，真实构建仍须验证。最高档54种是三元组合，以共用3茶色、3奶纹、6小料层绘制两杯位，不输出54整杯或未经Gate2批准的资源路径。
