# 同一客户端实现阶段继续接入

2026-10-17，Master依据用户76件具体Gate2批准继续原整体计划。Producer核AGENTS第7节及approval_protocol规则1，Tech独立核同一结论：已批准的TECH_DESIGN、UI与83件资源映射是本次正式输入；runtime reset探针验证既有fallback，没有增加契约。先拆出并行适配Task，不自动产生新的用户审批阶段。

Viewport、ModuleAssets、页面适配、已批切片、重复图共享和本地Bundle均属于同一Client专业实现阶段。内部代码可以组合，不能把尚未批准的单独代码报告说成已批准上游，也不能在最终实现获批前向QA或其他正式下游消费。最终准确聚合代码仍须Tech Review、用户确认及适用QA，规则未改变。

IMPORT-TECH v0.1及Master旧交接中的“先单独批准适配实现才接入”保留为历史解释，当前由本决定纠正同阶段边界；不要求用户重复批准既有方案或切片。Tech在v0.2保留旧交接并给发布输入细节。

新执行任务：`tasks/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/TASK.json`。Client先产Brief、与Tech沟通后实施。优先生成可复现Cocos发布输入，保留当前源图与其他任务未提交内容，构建输入内单份UUID/模块归属。主页面源码由现Owner完成当前修复和复测后明确交接，避免并发写。没有授权新增内容、降画质、CDN、Git分支或历史操作。
