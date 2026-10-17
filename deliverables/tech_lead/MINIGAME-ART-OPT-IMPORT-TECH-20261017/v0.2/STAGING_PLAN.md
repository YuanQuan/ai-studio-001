# 同一Client阶段的可复现本地Bundle发布输入 v0.2

本版保留v0.1交接及其真实Importer证据，只纠正同阶段门禁解释并明确不移动原工程的staging方案。正式输入为用户已批TECH_DESIGN、UI/LAYOUT、76具体资源及7旧样本准确映射；原完整实现/本地分包授权仍覆盖。runtime reset是已批fallback验证，不是新视觉或新接口路线。framework与当前页面属于同一Client实现内部代码，可继续复用、修订和与资源接入聚合；Task拆分本身不制造中间用户门禁。内部Review不冒充用户批准，也不作为QA或其他正式阶段已批上游。最终准确全部Client交付仍经Tech Review→USER_REVIEW及适用QA。本版不改Studio规则。

## 单一源快照与生成目录

Client以独立临时工程生成发布输入，不移动、重写或清理原apps/client，不改当前其他任务dirty文件。原工程路径保持可追溯事实源；所有变换只写Task指定staging目录。输入清单锁定本轮代码/Scene/Prefab/配置/必要原资源及83批准导出的准确SHA，记录批准依据、原路径、原UUID、canonical目的路径与bundle归属；生成开始和完成各核一次身份，变化即停止该批。不得为了方便复制其他活跃工作未确认的新状态；若某必需文件来自其他活跃修改，先由Master冻结确切输入版本，不能擅自回退或静默采用。

生成器与输入manifest均可重跑：从空staging生成相同逻辑工程，输出generated manifest（origin path/hash、transform ID、generated path/hash、UUID、bundle、derivative frame metadata）。不使用固定/tmp历史产物当新结果，不运行Git历史改写。复现比较工程文件/资产身份与构建输入；Creator生成缓存、构建时间字段不要求字节相同，实际产物另记hash。

## 仅staging内的资产归属和引用转换

每个现有UUID及其subMeta UUID在staging只能有一个物理源。canonical destination采用v0.1 BUNDLE_REFERENCE_MAP的world/tourist/shops/dialogue/milk-tea计划，每件同时复制原meta保持UUID；不同时保留原resources路径的同UUID副本。旧原图被获批裁片替代时只把准确裁片字节放在canonical路径，原图/PSD/旧10历史留原交付目录，不作为运行输入。185未裁资源若仍被引用，保持原像素和特殊元数据，不从候选/未批新资产补齐。素材权利未闭环不得借迁移变成新生产授权。

Scene/Prefab引用按UUID转换而非猜文件名：在生成工程解除启动口的40帧/4配件/6店Prefab等非启动必要硬引用，以批准的模块稳定ID/manifest引用替代，保留必要Controller/Canvas/Scene身份。生成Scene对象删除/重排必须重映射全部__id__及PrefabInfo/override关系，再做静态引用完整性和Creator导入回读。正式原Scene/Prefab不改；canonical staging路径通过同一manifest回溯原路径。

原resources.load与硬编码路径不能仅靠移动图片工作。Client在staging实现明确的稳定ID→本地bundle/path resolver及已有已批ModuleAssets契约，代码转换为受控、可审查生成步骤，禁止无边界字符串全仓替换。每个调用点列出原逻辑路径、模块依赖、生成后加载路径，找不到映射就停止。框架源码可以是同阶段当前实现，但其准确变换/最终代码也进入最终Client Review，不得以“仅生成物”为由免审。

Importer已证明不保存外部裁片原画布字段。因此derived frame在加载后、赋Sprite前使用public reset注入原W/H/offset/rect；SIMPLE/CUSTOM/trim=false与原UITransform/anchor/节点位置保持。不要给PNG补透明边、重新导出或修改已批像素；不私改library或共享缓存frame。生成manifest记录source→import UUID→runtime derivative geometry链。释放按既有租约，先清Sprite和销毁derived，再释放最后底层owner；10组同字节仅候选canonical别名，动作ID/时长/方向不合并。

## 共享、本地包和发布排除

world为U00/U01/U04唯一共享源；tourist供U00/U02/U05，shops供U00/U01/U03/U04，dialogue与milk-tea显式依赖共享模块。每件物理源只归一个bundle；不能把world图片复制进dialogue或milk-tea。依赖先acquire、失败逆序release，与已批租约契约一致。先完成普通独立纹理路线；无收益不强塞图集，运行图集需单独实测页≤2048、空洞/padding/过滤/采样且不改变已批像素。

Web AssetBundle目录不等于微信/抖音真实本地分包。Client须在相应Creator目标中生成本地分包配置、检查启动递归可达边/实际物理落包/跨包依赖以及当前平台限制；未有相应环境证据就NOT_TESTED，不用CDN或缩图兜底。本文不授权新远程服务或降画质。

发布输入排除历史build、temp、library、deliverables内PSD/对照/试验工程、旧publish输出及未选启动场景。历史源仍原地保留，发布staging仅有输入manifest选中的源和生成物；服务只指向本次BUILD_MANIFEST的output_dir，记录入口/config/hash，旧预览不混用。删除staging冗余副本不等于删除原始批准源。

## 必需证据和停止点

先代表shop/tourist/scene真实导入、UUID与frame reset几何/实际运行，再按模块扩到83；比较同背景、同视窗、同尺度、镜像/挂点/眼光/河面/U05组层。Art具体版本已批准，不重做Gate2；若像素或视觉语义要变先交Master走适用差异门禁。新增实现/生成器提交Tech Code Review，最终Client准确版本一次USER_REVIEW后才交正式下游。

必须交：输入/生成/输出manifest、唯一UUID扫描、所有引用可达/依赖图、重复别名表、真实import/readback、Creator CLI日志及输出身份、实际HTTP/IAB、平台与GPU未测清单、原工程前后hash保护证据。手工meta、CPU几何或Web bundle存在均不能冒充实际目标平台/GPU通过。输入漂移、缺批准源、重复UUID、丢引用、运行视觉/采样差、平台超限或超已批合同立即停受影响模块，不静默扩大范围。
