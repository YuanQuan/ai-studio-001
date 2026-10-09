# U02 VFX v0.2 → Client v0.3 技术兼容审查

结论：**可依据已获 Gate2 批准的 VFX v0.2 启动 Client v0.3 正式接入任务；不能把新 PNG 原位复制进旧工程后沿用现行 20 帧合同。** 接入前须由 Master 将下列跨角色合同差异记为本次受影响规格的修订，并交 Client、UI、QA 按同一获批版本执行。本文只作只读技术审查，未改 Client、Scene、Prefab、图片或 `.meta`，也未验证 Creator 运行。

## 审查基线与已获授权语义

- 用户 Gate2 记录：`tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json`，对象为 `deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/preview/recomposition.png`，具体 40 帧与同尺度重组版本已获批准；此批准不表示旧 Client 构建、性能或 QA 已通过。
- 新正式输入：`v0.2/frames/FRAME_MANIFEST.json` 与 `v0.2/mounts/FRAME_MOUNT_MANIFEST.json`，`schemaVersion=2`，四动作各 10 帧、共 40 个身份文件，固定 512×512、`foot=(256,440)`、原向右；walk/run 对应帧字节相同，run 帧时长为 walk 一半；happy/sad 也为 `loop`，不保留末帧。walk/run/happy/sad 的单帧时长分别是 `400/3`、`200/3`、`140`、`280` ms。导入时保留有理时长或浮点累积，不能整数截断后永久漂移。
- Product PRD 允许 run 与 walk 通过节奏差异可辨，允许 happy/sad 循环；UI Spec 也为情绪循环预留 `播放中`。旧 Tech Design §2 所写“走、跑分别有独立循环和可辨姿态，不把同一序列仅加速冒充跑步”与本次明确批准的同姿态双倍速冲突。**应在本次 Tech 合同修订中明确以已批准 VFX v0.2 的同姿态、双倍速为 U02 当前实图基线**，保留“可辨节奏”运行验收，不静默解释为旧技术规格已满足。

## Client 必改项

1. **资源身份与清单迁移**：`apps/client/assets/labs/u02/tourist_adapter.ts` 目前硬编码 20 张、`6/6/4/4` 和 `mountVersion='U02-FULL-A/formal-v0.1'`，当前 `frames/ug_ghost_01_frame_manifest.json`、`data/ug_ghost_01_mounts.json`、资产映射仍是旧 `schemaVersion=1`。以 v0.2 正式 40 帧和挂点清单为同版来源，校验每动作连续 `00..09`、文件 SHA、同名挂点帧、时长、共同画布与 foot；把版本身份、清单映射和批准引用改到 VFX v0.2。旧 20 个帧路径的替换需保留并核 `.meta` UUID 链，新增 20 个帧需登记新 UUID；在 `project/ASSET_HANDOFF_REGISTRY.md` 留旧/新 SHA、正式路径、SpriteFrame/Texture2D UUID、Prefab/Scene 引用。不能混用旧帧和新挂点，也不能凭同名推定已引用新字节。
2. **播放和 UI 阶段**：当前 `tourist_state.ts` 已支持从 manifest 读取 `loop`，控制器的 `holding` 只在 `once_hold` 触发，故可沿用单时钟、动作快切、generation、原子 commit、初态 walk00 静帧、重置/重入规则。新 happy/sad 必须完整循环并在运行状态一直为 `playing`；`UnitSampleGallery.ts` 应显示“播放中”，不能在第 09 帧后显示旧“保持中”。相关 UI 说明、Client 报告和 QA 用例中以旧 happy/sad 末帧保持为成功条件的断言需修订；重复点击当前动作不叠加主体和挂件。
3. **逐帧附件变换**：新挂点每帧给出 `head/face/wristNear/wristFar` 的位置、`visible/valid`、`localAffine` 和 `rotationDeg`；离线获批重组按局部仿射矩阵绘制配件。现行 `tourist_view.ts` 仅用挂点位置、枢轴和平移，把配件保持轴对齐，**不能证明与获批重组一致**。Client 应为当前帧的独立帽、镜、手环前后片应用可核验的旋转/缩放/剪切或等效变换，分别保持同一件的前后片接触；若 Creator 节点只能表达旋转+非均匀缩放而不能重现所需剪切，应先量残差与视觉影响，交 Art/Tech/Master 评审，不能自行丢弃 `localAffine`。`MirrorRoot` 仍只整体 `scaleX=-1`，不得对 JSON 坐标二次反号；附件层序为 `AccessoryBack → BodySprite → AccessoryFront`，不烘焙主体。
4. **附件越界和视窗**：`v0.2/ACCESSORY_BOUNDS_AUDIT.json` 的 160 项中仅 `UG_GHOST_01_HAPPY_03` 独立帽保守上缘 `y=-4.81px`，已批准的补充图展示原画布外完整帽顶。Client 须确认 BodySprite 的 512 矩形、MirrorRoot、展示区 Mask/裁剪、不同竖屏视口及缩放不会截去这约 5px；不能通过 trim、下移全部主体或缩帽偷偷改变已批效果。其余状态也需运行复核完整帽、脸、双腕和控件不遮挡。世界地影/UI 不在镜像根下。
5. **纹理预算与结果边界**：40 个文件的 RGBA8 基础展开量约 40 MiB，walk/run 真正共享 GPU 纹理后才可按 30 MiB 基础量估算；PNG 总字节数和文件 SHA 不证明纹理共用。Client 应记录 Creator 3.8.8 导入的主/子 UUID、SpriteFrame rect/offset/pivot、atlas 页/压缩/mipmap、纹理引用复用、构建身份、DrawCall、峰值或代理内存和固定 Web 视口帧时间；无目标平台实测不得报目标机 PASS。不得以减帧/缩图/更换表情消减预算而不走视觉变更。

## 兼容范围与交接门槛

- 稳定主体 ID `UG_GHOST_01`、三件独立附件 ID、单原向、固定 foot、三槽、单实例、中心预览、无世界横向位移、U01 路由和重置语义可沿用。Product 四动作、每动作不超过 10 帧及左右预览边界未扩展。此结论不引入新玩法或第五动作。
- 新 manifest 的 `schemaVersion=2`、`durationFractionMs`、`visualFoot`、`localAffine` 是正式接入必须识别或明示处理的字段；`visualFoot` 仅说明主体局部位移，**不得替代固定 foot**。如保留 schema1 运行结构，须提供可复核的无损转换及原始 v0.2 清单和哈希追溯，不能把旧清单字段值保留下来。
- Client 在 Gate2 已批准前提下可开始实现。提交接入 Review 前至少核四动作×左右×无装扮/单帽/单镜/单环/三类同时的 40 组关键状态和四动作全帧、09→00 接缝、快切/卸下/重置/重入、happy03 帽顶及 sad 全帧脸边；同时复验 U01。Creator 导入、HTTP 实际 Web 构建、运行层树/资源引用和性能分别留证，QA 按修订后的适用规格独立判定。旧 v0.2/R5 的 `holding` 画面与 20 帧运行证据不能充当新版本验证。

本审查给出的合同修订范围由 Master 编排、Producer 追踪审批版本。若其他已批准项目级决策明确禁止同姿态走跑或要求情绪保持，须先完成受影响规格的 Change Proposal 再解锁对应实现；当前所读 Product/UI 文件本身已允许这两种经批准的表现。
