# VISUAL-FIDELITY-COMPUTE-20261012｜候选规则同步与审批边界

状态：`USER_REVIEW`；版本 `v0.1`；当前游戏与 Studio 主层、标准模板均只登记候选，批准前不生效。

## 范围与准确版本

- 用户目标：已通过效果的分层、局部修改、序列帧及骨骼动画须可检查地还原，并控制无效算力消耗。本轮仅制定通用流程，不生产图片或动画；美术生成调用 0。
- 候选规则：`rules/visual_fidelity_compute_contract.md`，SHA-256 `ce99d03f4f0a79812d9b711e655d2412658c3f46bdef2f88aad6e86513d32b9d`。
- Art 制作方案复用模板：`agents/art/VISUAL_FIDELITY_PACKET_TEMPLATE.md`，SHA-256 `7ca4f438cf95e81c254557eae7e92e90315091c1e5ecbccabe02907c9c578a9c`。
- 跨角色提案：`governance/capability_changes/CAP-20261012-VISUAL-FIDELITY-COMPUTE.json`，SHA-256 `c61dc93a42c39031ba3de75b962e5b1adaa33accfcab18fd9b089be92b3c7a66`；状态 `PROPOSED`、用户批准 `PENDING`。
- 用户审阅包：`deliverables/master/VISUAL-FIDELITY-COMPUTE-20261012/v0.1/USER_REVIEW_PACKET.md`；Art、Tech、Master 独立 Review 均 `APPROVED`，见同目录 `ART_REVIEW.json`、`TECH_REVIEW.json`、`MASTER_REVIEW.json`。`VALIDATION.json` 当前记录 12 项文档/Schema/引用/同版及 Producer packet 检查 PASS；送审前初核为 11 项，真实 PSD、动画、引擎运行及节省比例均 `NOT_TESTED`。

## 同步与门禁

当前游戏与 Studio 主层的三份候选文件字节相同；标准模板 `templates/game/PROJECT_TEMPLATE_MANIFEST.yaml` 与空状态 `project/ART_GUIDE.md`、`project/ASSET_MANIFEST.md` 已加入待批准引用。Game 与 Studio 原有 `AGENTS.md`、`rules/visual_production_contract.md` 有历史差异，本轮仅作候选加法索引，没有全量覆盖或升级 `.studio-lock.json`。Studio 本地 HEAD `e4cc747f30ec08ec0187eaf419a2d01c9af23d3c`，远端 main `9ee34fa80c9c96a1999849175242ef077b78741d` 领先 1 个提交；依据 `AGENTS.md` §12 停止模板自动提交/推送，不自行快进、合并或变基。候选文件仅本地同版，模板未发布，提交号待获授权并实际形成后补记。Game HEAD 与远端 main 在只读初查时均为 `c44548e10aa0061f9696c9087163f96a1f230e05`；其他会话先提交 `6e08d70`。本轮仅本任务 23 文件、556 行提交 `1114b537b94daf90755a273ca9596a411318e156`，共享文档仅暂存本任务标记块，普通推送成功，实时远端 main 已核同 SHA；先行提交未混入本任务暂存。`.studio-lock.json` 保持旧基线；文件同步不表示模板发布或用户批准。

本次审批对象是通用规范 v0.1，审批记录 `tasks/VISUAL-FIDELITY-COMPUTE-20261012/ARTIFACT_APPROVAL.json` 为 `USER_REVIEW`、`decided_at=null`。现行资源制作方案 Gate1、切图与重组效果 Gate2、自行切图直交用户、正式 QA 边界继续执行。用户同意目标不等于已批准本版规范，更不等于具体资产获批；其他已存在游戏保持 pinned。用户批准后才可启用准确版本，并按进行中任务的安全交接点处理差异。

## 结果与后续

Task `tasks/VISUAL-FIDELITY-COMPUTE-20261012/TASK.json` 已到 `USER_REVIEW`，非 `DONE`。Required 10/10 路径实存，交付索引 16/16 实存，5 项验收与 Task 原文同序 PASS。Producer 流程状态、节点、审批及复盘分别见 `project/WORKFLOW_STATUS.md`、`project/MILESTONE_LOG.md`、`project/APPROVAL_LOG.md`、`project/WORK_RETROSPECTIVE_LOG.md`。下一步由 Master 呈现准确 v0.1 供用户批准或退回。

模板九文件候选备份与基于已核远端的重放补丁已准备，补丁在临时远端内容副本上通过 `git apply --check --unidiff-zero`；本地模板未执行恢复/快进/重放。具体操作与独立授权范围见 `VISUAL-FIDELITY-COMPUTE-20261012-TEMPLATE-SYNC-PLAN.md`，实际增量见 `VISUAL-FIDELITY-COMPUTE-20261012-TEMPLATE-SYNC.patch`。
