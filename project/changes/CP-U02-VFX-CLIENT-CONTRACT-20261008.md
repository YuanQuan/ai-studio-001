# CP-U02-VFX-CLIENT-CONTRACT-20261008｜U02 四动作正式帧接入合同修订

状态：`ACCEPTED`（用户已明确四动作表现并批准 U02-VFX-A v0.2 具体实图；Client 实现、运行和 QA 仍须另行验证与审批）。

## 决定与依据

U02 当前正式接入以 `tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json` 所记 `USER_APPROVED` 的 `deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/` 为唯一新动画来源。四动作 walk/run/happy/sad 各 10 张 512×512 透明帧；walk/run 使用相同姿态，run 以两倍速度播放；happy/sad 均循环播放。固定逻辑脚点 `(256,440)`，帽、眼镜、手环保持独立挂件，按该版逐帧挂点和局部变换挂载。用户先后明确这些动作及最终替换意图，并对实际 v0.2 PNG、同尺度重组效果作第二次批准。

本决定仅修订 U02 当前单元的技术实现基线。`deliverables/tech_lead/U02-TOURIST-TECH-DESIGN-001/v0.1/TECH_DESIGN.md` §2 中“走跑必须独立可辨姿态、不能仅加速同序列”的要求，在本版 U02 范围内由用户已批的同姿态两倍速覆盖；运行验收改为走跑节奏清楚可辨。旧 U02 Client v0.2/R5 的 `6/6/4/4`、happy/sad `once_hold`、旧挂点版本与 20 帧构建仅作历史，不作为新版资源验收。

## 受影响角色与同版执行

- Client：按 `tasks/U02-TOURIST-CLIENT-INTEGRATION-001/TASK.json` v0.3 接入 40 帧、时长、逐帧挂点与独立附件，保留当前 U03 六店场景和 U01；happy03 帽顶越主体画布约 4.81 像素，不能被主体边框或视窗裁切。
- Tech Lead：以 `deliverables/tech_lead/U02-TOURIST-VFX-CLIENT-IMPACT-001/v0.1/TECH_COMPATIBILITY_REVIEW.md` 为兼容检查清单，核新 schema、局部仿射或等效变换、UUID、纹理与运行证据。
- UI：happy/sad 循环期间显示“播放中”，不在第 09 帧后显示“保持中”；对新版画面和控件作同版评审。
- QA：修订旧 happy/sad 末帧保持的断言；按四动作全帧、40 组关键状态、挂件镜像与越界、U01 回归、运行和适用性能阈值独立测试。旧 R5 冒烟不继承。
- Producer：追踪新 v0.3 Artifact、各角色同版 Review、用户审批与后续 QA 门禁，不将 VFX Gate2 当作 Client/QA 通过。

## 边界

本决定不新增第五动作、游客世界移动、玩法或数据字段。VFX v0.2 文件的历史 `approval` 字段不改字节；审批状态以同版 `ARTIFACT_APPROVAL.json` 为准。客户端若无法忠实实现局部仿射或发现实图变化，交 Tech/Art 评审，不静默偏离获批重组。
