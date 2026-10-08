# U03 用例结果 v0.1

R3 builder1791356044228 / Gate2v0.4。BLOCKED表示无法执行必要操作；NOT_TESTED表示完整用例存在未测子项。部分鼠标观察与静帧不升级为完整PASS。

| ID | 结果 | 实际证据与缺口 |
|---|---|---|
| C01 | NOT_TESTED | 既有菜单/返回、Master10次入退正常；无连续录屏及全部入口边界证据。 |
| C02 | NOT_TESTED | 两尺寸01静帧单店；首入加载中性/禁用过程未取证。 |
| C03 | NOT_TESTED | Master从03后10次入退均01，首/末图归档；实例/旧回调动态未核。 |
| C04 | NOT_TESTED | 既有正向六步循环、Master反向01→06→05→04→03→02→01逐张取证；限定鼠标双向观察PASS，连续录屏/每次事件去重未全证。 |
| C05 | NOT_TESTED | 双向边界各一次可见；要求的两轮边界未独立重复。 |
| C06 | NOT_TESTED | 12静帧单显/图牌名一致；无逐帧/节点原子状态证据。 |
| C07 | NOT_TESTED | 20下一店最终03实图正确；没有02延迟与下一/上一撤销注入。 |
| C08 | NOT_TESTED | generation/pageEpoch源码存在；无受控乱序。 |
| C09 | NOT_TESTED | 10次重入01正常；同项实例/加载中返回旧回调及计数未测。 |
| C10 | BLOCKED | 缺受控缺图/解码故障及定向重试注入能力。 |
| C11 | BLOCKED | 无首图故障/超时注入及恢复证据。 |
| C12 | NOT_TESTED | QA实际查看两尺寸六店图，图牌名/屋顶/冷暖限定静帧PASS；局部、量测、完整视觉未完。 |
| C13 | NOT_TESTED | 静帧无遮挡；safe area/真实触摸/命中去重/输入穿透未测。 |
| C14 | NOT_TESTED | 12静帧仅单店、无经营UI；缺全页连续操作证据。 |
| C15 | PASS | 12切片Art→Client→R3 nativeSHA一致；107构建/3源一致；UUID沿同版登记与独立Tech导入Review核验；01唯一运行名MT_SHOP_01。 |
| C16 | NOT_TESTED | 既有U01四层/放大/重置冒烟；完整拖动/入退/输入隔离与本轮UUID独立回归未完。 |
| C17 | NOT_TESTED | 既有U02游客/walk/穿卸；Master菜单入退已支持U03；U02完整进退未独立复测。 |

17条：PASS1、BLOCKED2、NOT_TESTED14、FAIL0。无总体功能PASS。轮次Q1；R1/R2历史失败未计入R3通过。
