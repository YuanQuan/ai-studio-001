# U05交互资源生产流程 v0.1

- 用户明确“批准方案，开始制作”（call_ea48571cbb1a4ee78f43a207f85d3bec）。Producer 2026-10-14 13:41:05 +08:00登记，用户消息精确到达秒未知。原16/16送审文件SHA一致；UI/Art方案准确v0.1 USER_APPROVED，旧待审快照保留，Master接受两方案Task DONE。`APPROVED_PLAN_HASHES.json`记录批准链和预算。
- Art新资源Task与Tech同批生产支持Task已由Master创建。当前未见首份Required实产，两线维持READY；只读源核与首图文字可先行，首张正式图片前Art/Tech须同一批次预签。代表通过后FULL复签再扩。
- Gate1计划预算：制作活动最多75分钟（代表45、扩批30），全批局部生图最多3次含失败/重试，同问题最多2轮；当前本批实际调用0。预算是上限非工期承诺，实耗待Owner账本。
- 新脸层、局部净底、真实进出动作和具体切片尚未产出；自产切片完成后直接用户Gate2，不新增效果专业复审。新图Gate2前Client禁止正式接入，旧已批底板v0.2/字图/45片保持。新运行NOT_TESTED。
- Continuity：已批准制作方向并建Art/Tech执行Task，Owner实际首件后记录IN_PROGRESS；本FLOW本轮有真实批准和哈希产出。后续不应以READY/IN_PROGRESS占位停止在下一次用户门禁之前。

## REP-01首图同批预签与实际开工

- 2026-10-14 13:52:58 +08:00 Producer核Art `ART_BRIEF.md`、`ART_PRESIGN.json`与Tech `TECH_PRESIGN.json`首份Required实存，批号同为`U05-B-INTERACTION-ASSETS-20261014/v0.1/REP-01`，Tech绑定Art Brief SHA一致、四主源身份与批准方案核对。Art/Tech任务由READY→IN_PROGRESS；签认只放行代表首图，FULL扩批与Gate2另待。实际代表图/PSD/GIF尚未据此验收。
- Client新Task `FEATURE_BRIEF.md`首份Required实存，亦READY→IN_PROGRESS；当前可做独立表现状态与通用代码，新图Gate2前不得正式导入或覆盖旧Web8876。
- Continuity：三Owner均有当前产出，Art下一真实节点为代表净底/中性脸/开心完整离场实图与同尺度回放，Tech待实物核格式/支点/预算后FULL复签。

## 净底失败、受控方法提案待用户决定

- Art代表REP-01、REP-02两次自动确定性净底及一次获授权MANUAL-01手工Mask候选，实图均`REVISE`：仍见幽灵淡尾、旧杯沿和玻璃残线。MANUAL-01遮罩1600像素、框外RGB变化0也不能代替视觉通过；正式PSD/全组件重组/失落脸/完整动画未产，Gate2未到。此三次均非imagegen，生成工具调用0/3。
- `PRODUCTION_LEDGER.json`仅记录历史05:51:00–06:46:11 UTC墙钟55分11秒包络，含Tech/Master等待，不是净制作活动；MANUAL-01命令0.814秒，执行加视觉检查≤1分54秒。实际活动累计与75分钟剩余UNKNOWN；用户等待不继续扣预算。原同问题自动修正2/2及唯一MANUAL-01已失败，无当前授权第四候选。
- Art、AssetTech、Client任务均`BLOCKED`：Art净底不合格且未FULL，Tech资源审查BLOCKED，Client仅独立代码准备、无新图Gate2，不能正式导入/构建新版。旧Web8876仍为退回的旧试玩。静态CodeTech三Required+Master Review APPROVED，AUTO支持DONE，仅代码审查。
- Master方法变更Task`USER_REVIEW`：`REVIEW_PACKET.md`、Art `REGION_REUSE_PROPOSAL.md`、Tech `PATCH03_FEASIBILITY.md`三文件逐SHA冻结于其`APPROVAL_HASHES.json`。只申请额外唯一轮次、三片区同源donor整体复用和代表/FULL活动预算45/30→65/10；总75分钟不变。框内材质/接缝可见风险和框外残影风险已明示。用户未批PATCH-03，不预签、不制作第四候选；若获批还需先核实际活动余额。
- Continuity：已授权的三次候选、静态代码与只读诊断均有实际产出并按失败记录；当前生产/Client有真实方法和Gate2依赖阻塞，不空挂IN_PROGRESS。可继续的待审方案已达用户门禁，本轮Producer支持交Master AUTO接受。
