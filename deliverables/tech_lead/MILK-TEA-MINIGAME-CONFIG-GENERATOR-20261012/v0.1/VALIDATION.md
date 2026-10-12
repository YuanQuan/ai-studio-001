# 验收与验证记录 v0.1

## 运行证据

执行命令：

```sh
python3 -m unittest tests/config/test_milk_tea_config_generator.py -v
python3 tooling/config/milk_tea_config_generator.py --output-dir deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.1/samples
```

结果：4 项测试通过。覆盖完整配置生成、同输入两次生成字节一致、客户端不含解锁阈值/奖励、各阶段选项数与本阶段配置一致、配方提示保留 `min_stage_no` 供界面阶段过滤、任一行非 READY 时整包失败且不覆盖已有输出、错误跨表原料引用失败、拒绝把仓库根作为输出目录。

生成记录（SHA-256）：

- 输入源：`a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76`
- 服务端全量 JSON：`bcb757797059e1e022b67609ec4ba8bdbfa40829febe49055fee4a35322a4cb8`
- 客户端展示投影 JSON：`526812f601f883f48d8cc28f3e23ad229c12133082ad6a7efec0f61673d800fe`

逐项验收：

| 验收标准 | 结果 | 证据 |
|---|---|---|
| 仅接受与 Product v0.1 批准哈希一致的完整四表源，错误或非 READY/true 整包失败 | PASS | 生成器输入门禁；测试覆盖非 READY 行整包失败；样本 SHA 与审批/索引登记一致 |
| 服务端全量权威配置与客户端展示投影同源同版本 | PASS | `samples/SHA256SUMS.json`；两 JSON 元数据均含相同源 SHA、审批版本、配置版本 |
| 限时、维度、两阶段、独立门槛开关和前档条件按已批准规则校验 | PASS | `_validate_business`；通过源表全量生成；Tech Review 记录 |
| 生成确定、失败不留半包，记录输入与双输出 SHA | PASS | 4 项单元测试；SHA 清单与重复运行一致性断言 |
| 只交付候选工具与样本，不发布运行入口或接入代码 | PASS | 输出仅在本交付版本目录；`RESOURCE_INDEX`、Client/Server 运行代码未由本任务修改 |

## 未验证事项

没有运行游戏客户端、服务端或发布流程，也没有改写 `RESOURCE_INDEX`。生成物不是正式运行资源；正式入口发布与运行接入仍需单独任务及审批。
