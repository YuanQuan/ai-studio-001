# 配置中文说明与项目进度页调整

依据：用户于 2026-10-12 直接声明配置表、历史归档和项目进度页的新要求。本轮按非功能维护落实，未修改三本工作簿的数据、玩法或已有审批记录。

## 已完成的结构

- 当前游戏与 Studio 模板同步 `rules/config_resource_contract.md`、`AGENTS.md`、`rules/artifact_contract.md` 及能力变更记录；标准小游戏模板增设独立中文字段说明、资源索引、历史归档空目录和中文进度空态。
- 当前项目由 Product 核对三本业务工作簿共十张工作表、99个表头，建立 `project/config/FIELD_GUIDE.md`、`CONFIG_RESOURCES.md` 和 `RESOURCE_INDEX.json`，将原文件等字节副本及同批说明/索引归档。已有版本路径保持原样以保留审批引用。
- 三本现有表均未取得对应准确版本的正式使用批准：顾客为禁用示例，奶茶为 DRAFT 且 `export_enabled=false`，U00 六店位置旧基线仍待用户确认。因此索引中现行正式配置为0，尚未创建无版本的正式使用文件。今后正式获批且通过技术校验时，建立稳定无版本入口，并在更新前归档旧内容。
- 进度页改为精简中文快照；完整旧版存入本次 Client 交付历史，当前任务、待确认事项、日志以及三本草案可点击，正式配置区按索引显示当前真实数量。

## 复核状态

- Product 提交 `deliverables/product/CONFIG-DICTIONARY-20261012/v0.1/DELIVERABLE.json`；Tech Lead 独立复核见 `deliverables/tech_lead/CONFIG-TECH-REVIEW-20261012/v0.1/REVIEW.json`。
- 链接、JSON 结构、归档哈希与浏览器页面验证见 `VALIDATION.json` 及 Client 实施报告。
- 本轮规则由用户明确授权生效；三本草案仍遵守各自既有用户审批和运行校验门禁。
