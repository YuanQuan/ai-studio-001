# 验收与验证记录 v0.2

## 运行结果

执行：

```sh
python3 -m unittest tests/config/test_milk_tea_config_generator.py -v
python3 tooling/config/milk_tea_config_generator.py --output-dir deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples/candidate-a0372ae44144
```

5 项测试通过：完整双端投影和确定性；已存在的相同三文件包重复运行不改字节；两个全新目录输出一致；已有额外文件时拒绝并保留原件；非 READY 行与错误跨表引用整包失败；仓库外/越界输出拒绝。

样本 SHA-256：

- 输入源：`a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76`
- 服务端全量 JSON：`bcb757797059e1e022b67609ec4ba8bdbfa40829febe49055fee4a35322a4cb8`
- 客户端展示投影 JSON：`526812f601f883f48d8cc28f3e23ad229c12133082ad6a7efec0f61673d800fe`
- 当前生成器源码：`24c5979d55a3258f7a82c868412fd5e7e08b23eab27d4536ffb7d633e51de1e0`

## Task 验收

| 验收标准 | 结果 | 证据 |
|---|---|---|
| 精确绑定获批源哈希、完整四表和 READY/true 全包门禁 | PASS | 固定审批路径/索引引用门禁；READY 与错误引用负向测试；SHA 清单 |
| 服务端全量与客户端展示投影同源同版本 | PASS | 样本两 JSON 与 `SHA256SUMS.json` |
| 限时、难度、两阶段、独立门槛和前档条件 | PASS | 业务约束校验；源表完整生成；五档维度数组及阶段选项断言 |
| 确定性、失败保护与源/双输出 SHA 记录 | PASS | 5 项测试；`SHA256SUMS.json` |
| 不发布运行入口、不改索引或 Client/Server 运行代码 | PASS | 样本留在本任务 v0.2 目录；生成器没有索引写入或运行端入口 |

## 未覆盖

未执行游戏运行、资源正式发布或客户端/服务端接入。生成物仍是候选 Artifact，不能作为正式运行资源。
