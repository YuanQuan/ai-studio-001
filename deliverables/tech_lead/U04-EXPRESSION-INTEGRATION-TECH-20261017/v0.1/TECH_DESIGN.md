# U04 v0.3 接入技术设计（仅批准的六阶段）

本轮按用户 2026-10-17“好的批准接入”执行。唯一生产 PNG 输入是 Art v0.3 `ASSET_MANIFEST.json`（SHA256 `4bb0fc9474634d35c98bf2088d7751a26a302d41de56e68854bbaab93b21b83d`）列明的 native `base`、`front` 与五态 `face`；`LAYER_EXPORT_MAP.json` 与用户 packet 的批准 SHA 见 Master `USER_APPROVAL_AND_HANDOFF.json`。不得由高分辨率 PSD 重新导出或修改 PNG 像素。六阶段共 6×(1 base+1 front+5 face)=42 张，分别覆写 `apps/client/assets/units/dialogue/portraits/tex_u04_<stage>_{base,front}.png` 与 `faces/tex_u04_<stage>_face_<state>.png` 的现有稳定文件，原 `.meta` 和 UUID 保留；其他十二阶段六十态及其他单元不动。

现有 `apps/client/assets/units/dialogue/u04_layer_export_map.json` 的 `handoff_normalized` 已给定稳定运行几何，六组均与 Art v0.3 原切片尺寸和 source rect 相符。接入仅更新六组资源来源/哈希/审批溯源，不扩展状态表或修改 Gallery/framework 的现有脏代码。逐组几何如下；偏移均是导出 base 左上角内的整数坐标，合成顺序固定 `base → 恰一态 face → front`。

|阶段|base 尺寸|face 尺寸/offset|front 尺寸/offset|source→export|
|---|---:|---:|---:|---:|
|MT_S2|651×1024|256×256 / (142,100)|51×122 / (292,97)|1|
|AT_S0|503×1024|256×256 / (133,180)|175×75 / (148,177)|1|
|AC_S0|454×1024|256×256 / (48,95)|170×148 / (72,140)|1|
|AJ_S2|594×1024|256×256 / (120,130)|186×155 / (149,170)|1|
|AD_S0|768×768|192×192 / (232,139)|192×192 / (232,139)|0.75|
|XJ_S0|768×768|192×192 / (248,167)|192×192 / (248,167)|0.75|

AD 的旧 1024 full PSD 和 native base 存在已披露的局部重采样非等价；接入严格使用已批准的 native PNG。Art v0.3 的五态 768 native PSD 是准确三层编辑参照，但本轮不把 PSD 输入 Creator。前景共享层影响五态，运行需检查九个用户圈态、AD/XJ 的其余共享态、30 个新态与完整 90 态加载/切换。

Client 先记录 42 个目标文件和 `.meta` 的前置身份、现有目录的未授权差异；逐文件原字节复制并校验目标 SHA 与 Art manifest 源 SHA 完全一致。更新现有 importmap 的六组来源与 hash/版本；后续 Creator 3.8.8 隔离当前工程快照构建，核 42 张资源的导入 UUID/尺寸/构建产物身份。Master 在同一构建版本的 loopback HTTP/Web 内置浏览器检查目标尺度画面与切换。Web 静态/运行结果不等于微信、抖音或目标设备性能实测；本任务是单元示例 Owner 自证，不设 QA Agent 或额外用户审批门槛。

运行几何复核：`UnitSampleGallery.ts` 的 `applyU04Geometry` 实际从 `handoff_normalized.base_source_rect_xyxy`、`face_source_rect_xyxy/face_source_pivot_xy` 以及原 `front_hair/front_occlusion.source_rect_xyxy` 设置节点的 source 空间尺寸与位置；AD/XJ 的 native192 图片由 SpriteFrame 在源画布视窗中显示为256范围，符合原0.75导出比例。该函数的旧几何目前无需改代码；保留其本轮开始前已有的外轮次差异。运行版需以实画面再核遮挡，而不以坐标表代替视觉结果。

接入中的有界来源例外：旧 `handoff_normalized.base/front` 字符串继续保留其原版几何来源路径，实际运行仅消费该对象的坐标/比例，不以这两个字符串加载图像。本轮生产源以同阶段当前 `base/front` 字段、`integration_provenance` 及 Client 的 42 项 `RESOURCE_IMPORT_MAP` 为准。隔离 Creator 构建已开始，故不为更改展示性历史路径中断或重建；最终审查须同时核该解释与实际导入字节，不能把历史字符串当作当前 PNG 源。

## v1 实际运行反证与唯一恢复边界

首次隔离构建的42张dialogue图片/UUID虽均正确，IAB仍在进入U04时报告 `assets/world/index.js` Error4928；输出仅有 `internal/main/dialogue` 三bundle。根因是复用的构建配置指向 `assets/bundles/{world,tourist,shops,milk_tea}`，v1隔离快照却没有这些目录。world所需街道prefab与Sakura图片在当前工程不同根目录，单改一个bundle root不能保留现有加载路径。构建成功码36因此仅证明构建流程结束，不能判运行可用。

已存在的完整v0.8优化stage含四个bundle树及原优化Scene；只读核对其全部31个TypeScript源文件与当前工程逐字节一致，六组U04 handoff几何逐项一致。获批的一次恢复应从该成熟stage复制新的隔离副本，覆写当前完整dialogue资源树（含42生产PNG、meta、mapping及其余60态），验证Art/客户端SHA、源代码和新build配置身份后再构建；原stage和正式apps非本轮文件不改。新输出仍须实际IAB复核，不凭配置推断成功。
