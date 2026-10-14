# U05 B 资源登记（部分，`BLOCKED`）

本表按获批 `PRODUCTION_PLAN.md` 的稳定语义 ID 对应现有工作文件；存在路径不等于可正式接入。全部实际图片均位于本目录 `exports/`，为本项目 v0.2 旧角色/静底的确定性局部衍生，未使用新外部图片或字体。共同角色画布 332×301 RGBA，源左上 `(309,484)`、源支点 `(475,785)`、归一锚点 `(0.5,0)`；脸不 trim。Client 正式路径均为**计划**，导入 UUID 尚无。

| 稳定 ID | 工作文件与 SHA-256 | 现状 |
|---|---|---|
| `CUSTOMER_BODY_BASE` | `exports/CUSTOMER_BODY.png` · `8e6df8b02697d51fda76fde3c1c083ffc485dd1f9ba2602b25d2845dd2d9d81a` | REP-02 代表局部已测；Gate2 未就绪。 |
| `FACE_NEUTRAL` | `exports/FACE_NEUTRAL.png` · `126d2748eafc49dd737afdf99eba4e9d3514d7370bf1755b1fe24181cf36b2f7` | 与身体合成复现旧角色 RGBA 零差异；Gate2 未就绪。 |
| `FACE_BLINK` | `exports/FACE_BLINK.png` · `843be71ba3405f4ff22390da293948cb66d8a30b8fa835a1913bc0d68ad08ff1` | 局部闭眼代表；Gate2 未就绪。 |
| `FACE_HAPPY` | `exports/FACE_HAPPY.png` · `971157afd6bcd9d97709736b2eb399c9112775d303c26fc04455ca34035268aa` | 局部开心代表；Gate2 未就绪。 |
| `FACE_DISAPPOINTED` | 无 | 未制作；`NOT_TESTED`。 |
| `STATIC_BARE_LOCAL_CLEAR` | `exports/STATIC_BARE_CLEAN.png` · `2160dd5789174154304e49d3a6fd4230a095bcf1e3777caf4db1f939d3e179c9`（REP-02）；`exports/STATIC_BARE_MANUAL01.png` · `54d0d41b06de0ecb509475b246a3f81236ba30a169bed551ef6e062fe789556a`（MANUAL-01） | 两版均残影可见，`REVISE`，**无合格正式映射**。 |

补间辅助片 `exports/FACE_SQUASH.png` SHA `874890e53f1a07b58f10bda8dd906fd08923a23be3b5148849f1592465d91e50` 与 `exports/FACE_EXPAND_MID.png` SHA `daa4e43c97535af98ca8d850a1c5f158e8bffd3e200b46147c8a9bd2c07c923f` 只服务 0–80ms 压眼及 150–300ms 展开，**不是**第五/第六情绪状态。代表 `review/animation_representative.gif` 仍基于 REP-02 失败底图，不作为最终资源。新版 `source/workspace_b_master.psd`、最终切片、全动作 GIF、`reconstructed.png` 与 `component_sheet.png` 未产；正式 Client 目录/UUID 不得从本表臆造。来源与保护区见 `ART_BRIEF.md`、`source/MASK_REVIEW.json`。
