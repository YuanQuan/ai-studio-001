# 奶茶小游戏配置生成器技术设计 v0.1

## 目标与边界

生成器只消费已获用户批准的稳定候选工作簿，并生成一份服务端权威全量 JSON 和一份客户端展示投影 JSON。输入必须同时匹配固定 Product `v0.1` 审批记录路径、`RESOURCE_INDEX.approval_ref`、审批记录中的源 SHA-256、索引登记的 candidate 路径与 SHA，且索引仍保持 `active_path=null`、`current_formal_resources=[]`。历史 DRAFT 源、未批准工作簿、部分 READY 行或部分导出行一律整包失败。

本交付是候选工具和样本。生成器要求显式输出目录，拒绝与仓库根、源表、审批文件或资源索引路径重叠；不会更新索引、正式配置入口或运行代码。样本目录位于本版本 Artifact 下。

## 实现

实现位于 `tooling/config/milk_tea_config_generator.py`，仅依赖 Python 标准库。脚本直接解析 XLSX ZIP/XML，保留字符串、数值、布尔和空单元格的区别，不需要安装 `openpyxl` 或新增项目依赖。输入四表名称、表头顺序和数据行数均精确校验；整数、布尔、字符串和允许空值的字段按 Tech 规范逐项检查。

结构校验覆盖完整四表、五档两阶段、ID 唯一、状态及导出门禁、难度维度、简单不限时/其余限时、正数杯数、阶段 XP 递增与奖励规则、四个解锁开关独立、前档顺序、原料维度与同维排序、配方计数、ID/维度引用和正确原料落在每个适用阶段的前 N 选项内。业务数值只从获批工作簿读取；代码仅验证，不调整。

服务端 JSON 包含全部阶段权威规则、解锁门槛开关与阈值、全量原料、完整配方和固定店铺映射 `MT_SHOP_01`。客户端投影只提供显示用档位与阶段值、按阶段裁切的可见原料选项和饮品提示；提示保留 `min_stage_no` 供界面按当前阶段过滤，不包含解锁阈值、奖励结算字段或订单随机顺序。两个 JSON 同带 `source_sha256`、`approval_version`、`config_version`。

生成采用临时目录先完整写出两个 JSON 与 SHA 清单，验证结束后以目录重命名替换目标目录；任何源校验失败都在开始写入前终止，不会产生半包。该机制只用于候选目录的整体替换，不提供运行发布、回滚治理或服务器加载功能。

## 样本

- 服务端全量候选：`samples/milk_tea_minigame.server.json`
- 客户端展示投影候选：`samples/milk_tea_minigame.client.json`
- 输入及两个输出 SHA-256：`samples/SHA256SUMS.json`
- 精确输入：`project/config/source/MILK_TEA_MINIGAME.xlsx`，SHA-256 `a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76`

## 使用

从仓库根目录运行：

```sh
python3 tooling/config/milk_tea_config_generator.py \
  --output-dir deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.1/samples
```

输出目录必须是明确指定的候选位置；禁止把样本路径改指向 `project/config/generated/` 或其他运行入口。通过校验后，命令会打印输入与两份输出 SHA-256。
