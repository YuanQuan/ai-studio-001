# U04 表情v0.3批准与接入流程

- 用户于2026-10-17T08:50:51.219833Z“好的批准接入”，Master `deliverables/master/U04-EXPRESSION-INTEGRATION-20261017/v0.1/USER_APPROVAL_AND_HANDOFF.json`绑定准确Art v0.3审核包SHA `062b2b7730b1f39ab44e07b2ab38d227a78ab79a3787d5dc4353d7dcbd02c587`、Manifest SHA `4bb0fc9474634d35c98bf2088d7751a26a302d41de56e68854bbaab93b21b83d`。Art Approval v0.3 USER_APPROVED、Task DONE；v0.2 REJECTED与v0.3 USER_REVIEW前快照保留。
- 仅六阶段30态及对应base/front正式接入解锁；native PNG原字节、稳定路径/UUID、其他60态/其他单元不改。AD旧高分源PSD差异已披露，接入只用获批native PNG，不重导。
- Client/Tech接入Task READY，待首Required实际产出再记录IN_PROGRESS；Producer已实写首Required，本Task IN_PROGRESS。目标Creator3.8.8实际导入/新构建、loopback HTTP与内置浏览器真实Web证据；单元示例无QA，Client成果仍须用户审核后才DONE。
- Tech首Required `deliverables/tech_lead/U04-EXPRESSION-INTEGRATION-TECH-20261017/v0.1/TECH_DESIGN.md` 实存，Task READY→IN_PROGRESS；已核六阶段42 PNG与旧importmap几何一致，待Client真实导入/新构建后继续。
- Client首Required `deliverables/client/U04-EXPRESSION-INTEGRATION-CLIENT-20261017/v0.1/FEATURE_BRIEF.md` 实存，42目标PNG hash/备份/复制已实际执行，Creator3.8.8路径已核；Task READY→IN_PROGRESS。隔离当前快照新Web构建及运行尚待，不称通过。
- Client RESOURCE_IMPORT_MAP.json已登记42资源稳定ID/来源SHA/客户端路径/UUID/几何；42/42原生PNG字节、meta/UUID与几何静态一致。构建/运行仍NOT_TESTED。
- Client `BUILD_CHECK.json`记录Creator3.8.8隔离722文件快照真实web-mobile构建PASS，输出index SHA `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，loopback HTTP `http://127.0.0.1:8765/`运行；`RUNTIME_CHECK.json`当前所有浏览器检查仍NOT_TESTED，待Master内置浏览器。
- **真实运行失败**：Master内置浏览器打开当前HTTP构建时世界bundle `assets/world/index.js`加载4928，导致映射/装饰失败；截图与console记录在Master本轮runtime。Client/Tech正在诊断bundle缺失，至多一次有证据恢复；Client仍IN_PROGRESS且有实际构建/诊断证据，不称运行PASS。另Client意外改历史v0.4 RESOURCE_IMPORT_MAP，Master按起始干净HEAD受控恢复并记录，此改动不应进入本轮提交。
- **一次恢复路线已Tech独立核可**：旧成熟stage与当前31 TS全SHA同、六组geometry同；v1隔离快照缺既有bundle整理/Scene优化导致world缺失，不是获批美术PNG错误。Master `deliverables/master/U04-EXPRESSION-INTEGRATION-20261017/v0.1/BUILD_RECOVERY_BOUNDARY.json`限定v2隔离复制成熟stage、不改旧stage，只覆盖获批42PNG+map并新构建；旧失败IAB证据保留。恢复尚待构建/运行证实。
- 一次恢复v2构建已实完成：Client BUILD_CHECK现选`v2_recovery`、`PASS_BUILD`，隔离输出manifest SHA `7758c3fdee91371e059652d3d1d83c0cb84869f4973af77c278d1ca87acce626`，42目标native SHA匹配，loopback HTTP仍运行；v1失败证据移至`evidence/build-v1-failure/BUILD_CHECK.json`。Master同版内置浏览器运行仍待，不提前判运行PASS。
- Master v2同版IAB实际运行已进入分项证据：Client `RUNTIME_CHECK.json`现`IN_PROGRESS_MASTER_RUNTIME_EVIDENCE_PARTIAL`；30/30新增态实际画布切换/截图PASS，90/90整体巡检0失败；九处目标/共享层视觉仍IN_PROGRESS，快速切换、返回重入和窄屏最终记录待齐。不能将部分证据当整项完成。
- Tech本轮四Required齐、独立REVIEW APPROVED、DELIVERABLE READY_FOR_REVIEW且三验收原文同序；Task转REVIEW待Master内部接受。TECH_CHECK SHA `a5be901fbcadff6a49a740d4ed01dc3fc1322d41ab1642467db096ce0b57169f`；v1失败留档。
- Master最终 `deliverables/master/U04-EXPRESSION-INTEGRATION-20261017/v0.1/RUNTIME_VERIFICATION.json` 已落：52截图SHA与v2源/settings/output manifest绑定；同版IAB九圈/共享层、30新态、90/90零失败7042ms、三轴/快速AJ2 sad稳定、返回重入、390AD/XJ surprised切换、v2 console错误0均PASS。浏览器default override已reset，服务PID3333留作用户验收。Client七Required最终包与Tech内部接受待落盘，暂不扩大测试矩阵。

## 本轮送审状态（2026-10-17T09:17:16Z）
- Master `TECH_SUPPORT_ACCEPTANCE.json`接受Tech四Required内部支持，Tech DONE/PROFESSIONAL_REVIEW；`CLIENT_INTEGRATION_REVIEW.json`接受Client七Required、四验收原文同序PASS，Client准确v0.1 USER_REVIEW/用户决定空。最终v2 Web同版浏览器证据见Master `RUNTIME_VERIFICATION.json`；v1失败与一次恢复历史保留。
- 42资源稳定ID/获批来源SHA/Client真实路径/UUID/几何见Client `RESOURCE_IMPORT_MAP.json`；原PNG字节、meta UUID均保持。服务`http://127.0.0.1:8765/` PID3333为用户审核保留，用户尚未批准Client运行成果，不能DONE。
