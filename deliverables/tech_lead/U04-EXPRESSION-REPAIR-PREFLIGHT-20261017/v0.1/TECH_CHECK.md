# U04 表情修复 Tech 当前技术核验（v0.1）

本文件是正式 Task Required Artifact 当前入口。原根目录 BLOCKED/NOT_TESTED 版本逐字保存在 `history_before_resume/`；`TECH_PRESIGN.json` 与冻结六样绑定、六样签认及三十态矩阵均未改动。

## 当前结论

- 首图前 Tech 对获批 v0.2 同批预案的原预签持续有效；原 `TECH_PRESIGN.json` 不因恢复而重签。
- 六张代表样的实际 PSD、切片、同尺度 U00 与源坐标已在同版绑定下通过；根 `SAMPLE_TECH_REVIEW.json` 与 `BATCH_EXPANSION_PRESIGN.json` 现引用恢复时冻结的六样签认。扩余24态的签认是当时 8/48 的内部生产放行历史，不把历史计数改写成当前计数。
- 六角色三十态已落盘并完成独立静态技术核验：各态 PSD 实际可见层互斥，语义层 alpha/非透明 RGB 对源层零差；对应 native 三层、ROI 外与真实 U00 映射逐态通过。AC/AJ 原生 base 是裁片，仅在该裁片矩形内证明三层对 source RGBA 零差，矩形外源像素有预期遗漏。PSD 缓存对自身预览零差，预览对独立合成源可有 1–3/255 舍入，两种比较对象已分开记录。
- Master 在真实同尺度盲辨中先答后核，三十态 30/30；这属于 Master 视觉证据，不由 Tech 取代 Art/用户判断。
- MT/AT 前四次原先漏记事前调用时间为 MINOR 过程偏差，原 UNKNOWN 快照保留。Master 现从本任务工具会话恢复四个唯一调用的可观察发出至完成包络，配对输入/prompt/候选 SHA；服务内部开始、GPU/计费时间仍未知，不能用包络冒充 GPU 耗时。
- 当前生产报告 32/48、repair 2/12；本 Tech 静态审查未独立审计图像服务用量。Gate2 具体切片用户审批、Client 正式导入/UUID、目标机运行均 `NOT_TESTED`。本 Task 不做 QA，也不增加自产切片专业效果复审门禁。

## 精确证据绑定

- presign: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/TECH_PRESIGN.json`，SHA-256 `90d7e43212c600da656de4d1aeb20d947880cafaa3ea2da2e8c5e377be675c41`
- sample_binding: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/resume_20261017/SIX_SAMPLE_BINDING.json`，SHA-256 `94e03d6ee614f8f186dee2a8ab75e408835023fd9717abd5753085c37e125e56`
- sample_details: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/resume_20261017/SIX_SAMPLE_TECH_CHECK.md`，SHA-256 `d797a03e7fe0f4d8889a28207454d6e19c3b82b1e5ddb2cefc25e2e2907712b9`
- sample_review: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/SAMPLE_TECH_REVIEW.json`，SHA-256 `4d26f514bf70ed9ef83789fd54ea130c1db34d1e7c1d9d997c5d605ee5c2d50f`
- expansion_presign: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/BATCH_EXPANSION_PRESIGN.json`，SHA-256 `abbd1c31d97de8043d0950f68cd75a4f452a3a5bd9b701eea9ca3a115370fed7`
- matrix: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/resume_20261017/FINAL_STATIC_30_TECH_MATRIX.json`，SHA-256 `d824677d78b0e5739fae202740b30dfccd95881960f0a07014ef3b3452fe919c`
- final_review: `deliverables/tech_lead/U04-EXPRESSION-REPAIR-PREFLIGHT-20261017/v0.1/resume_20261017/FINAL_STATIC_30_TECH_REVIEW.json`，SHA-256 `063312acdb4d687bbd45b6bf8ff0f9eae04ad49618ce90b9eb8caee213d9ff02`
- master_visual: `deliverables/master/U04-EXPRESSION-REPAIR-RESUME-20261017/v0.1/THIRTY_STATE_MASTER_VISUAL_CHECK.json`，SHA-256 `019c897ec57ec8096edda6328b5d879ce45bdc957d862ccf2536c3052f29e16c`
- time_recovery: `deliverables/master/U04-EXPRESSION-REPAIR-RESUME-20261017/v0.1/MTAT_TIME_RECOVERY.json`，SHA-256 `c3e6a470ec67253cdd844ff11ee7d3832c6acd16dfc107fa0c355dbb628d45ac`
- time_review: `deliverables/master/U04-EXPRESSION-REPAIR-RESUME-20261017/v0.1/MTAT_TIME_RECOVERY_REVIEW.json`，SHA-256 `9f7de3ffa0b6a0c5069066f2ae46211559016dec1df8c904eeb42ccd8b99c02f`

## 验收边界

本 Task 原三条验收依序为 PASS，详见根 `DELIVERABLE.json`。上述 PASS 仅证明预签、六样扩批复签与静态技术证据；用户 Gate2 批准和正式运行仍按既有门禁办理。
