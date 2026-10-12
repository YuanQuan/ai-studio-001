# 奶茶小游戏配置生成器技术设计 v0.2

## 相对 v0.1 的修订

v0.1 独立 Tech Review 的结论为 `CHANGES_REQUESTED`（记录见 `../v0.1/INDEPENDENT_TECH_REVIEW.json`）：生成器会将既有目标目录移到 `.previous` 并递归删除旧目录，任意路径可造成无关数据覆盖；两个目录重命名之间还会出现目标缺失空窗。v0.2 移除备份、删除和替换旧目录的逻辑，使用不可变候选目录：只在目标不存在时将完整临时包一次性落位；若目标已存在，仅当目录恰好包含三份预期文件且每份字节均与本次确定性生成结果相同才无写入成功返回，否则拒绝并要求使用新版本目录。失败或进程中断不会删除或替换已有候选。

v0.2 将样本输出改为 `samples/candidate-<source SHA 前缀>/`，不覆盖 v0.1 的历史样本。v0.1 目录保留为未获批准的历史版本；本次 Review 针对 v0.2。

## 目标与边界

只消费已获用户批准的稳定候选工作簿，生成服务端权威全量 JSON 与客户端展示投影 JSON。输入必须匹配固定 Product `v0.1` 审批记录路径、`RESOURCE_INDEX.approval_ref`、审批记录中的源 SHA-256、索引中的 candidate 路径与 SHA；索引仍须保持 `active_path=null`、`current_formal_resources=[]`。历史 DRAFT 源、未批准工作簿、部分 READY 行或部分导出行一律整包失败。

工具只允许在本任务 v0.2 的 `samples/` 目录树下创建候选输出。现有目标目录不完全匹配本次三个预期文件时拒绝操作，额外文件也会导致拒绝。不会更新资源索引、正式配置入口或运行代码。

## 实现与校验

源码：`tooling/config/milk_tea_config_generator.py`，仅依赖 Python 标准库，直接解析 XLSX ZIP/XML 并保留单元格类型，不需安装第三方依赖。校验覆盖四表与表头/行数、字段类型、审批哈希、READY/true 全包门禁、ID 唯一、档位/阶段结构、五档维度 3/4/5/5/5、简单不限时和其他档限时、订单数、XP/奖励规则、前档通关及四个独立解锁开关、原料类型/排序、配方池及引用和各阶段前 N 可选项。

服务端 JSON 包含所有阶段权威规则、解锁阈值与开关、全量原料、配方和 `MT_SHOP_01` 固定店铺映射。客户端投影只提供显示档位/阶段、每阶段选项、带 `min_stage_no` 的配方提示；不含解锁阈值、奖励结算字段或订单随机顺序。双方绑定相同源 SHA、审批版本和配置版本。

生成先在临时目录写全三个文件（服务端 JSON、客户端 JSON、SHA-256 清单），完成后仅当目标尚不存在时将完整目录重命名到目标。若已有目录内容完全相同则不修改并直接返回；内容不同、存在额外文件、目标为非目录或目标不在 v0.2 样本树时立即拒绝。代码不再递归删除任何既有目标，也不创建/清理 `.previous`。

## 样本和源码指纹

- 服务端样本：`samples/candidate-a0372ae44144/milk_tea_minigame.server.json`
- 客户端样本：`samples/candidate-a0372ae44144/milk_tea_minigame.client.json`
- 输入与输出 SHA：`samples/candidate-a0372ae44144/SHA256SUMS.json`
- 输入源 SHA-256：`a0372ae4414471d57c2e9a621b538e80cee4d1482455088afe7bcb72630a1c76`
- 生成器源码 SHA-256：`24c5979d55a3258f7a82c868412fd5e7e08b23eab27d4536ffb7d633e51de1e0`

从仓库根目录运行：

```sh
python3 tooling/config/milk_tea_config_generator.py \
  --output-dir deliverables/tech_lead/MILK-TEA-MINIGAME-CONFIG-GENERATOR-20261012/v0.2/samples/candidate-a0372ae44144
```

该目录若已存在，只有三份输出逐字节与新生成结果一致时才会无写入成功返回。需要变更时应另用新的候选目录名。
