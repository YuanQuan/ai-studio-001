# Client 功能概要：83 项已批资源接入与本地模块化加载

任务：`MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017`；版本 v0.1；Owner Client。此 Brief 承接同一 Client 实现阶段内的已批准资源/技术/UI契约，不构成新用户审批门禁。当前框架实现属于同阶段内部代码，不作为独立已批准上游。

## 1. 目标与范围

将已获 Gate2 批准的精确 83 项资源接入运行工程：73 项新增、3 项采样修订、7 项已批样本引用。保留原画布尺寸、裁切 bbox、offset、pivot、镜像/脚点/顺序和 U05 构图；由公开 SpriteFrame 派生帧元数据恢复完整原画布，共享重复图像，拆分启动输入与本地 Bundle，按页面生命周期获取/释放。

不移动、覆盖或删除源图及其他任务的工作树差异；不改批准像素、降采样、旋转贴图、CDN、新依赖、产品语义或玩法时序。Gallery、U01、U05 暂由主 Client 持有，本 Owner 先做可独立接入的生成器与派生帧模块；等待 Master 明确交接后才改页面调用点。

正式输入包括 Gate2 对 Art v0.2 76 项及同尺度效果的批准、7 项既有批准样本、`APPROVED_ASSET_HANDOFF_MAP.json`（83项）和已批 Tech/UI 规格。映射分布为 73 NEW_BATCH、3 SAMPLING_REVISION、7 APPROVED_PILOT_REUSE；Art身份见同版 `ART_IDENTITY.json`，不得用探测 UUID 替代正式 UUID。

## 2. 现有能力复用

复用当前 Creator 3.8.8、项目本地 TypeScript、已批资源 handoff map、现有资源 importer/Bundle、现有 gallery 模块生命周期和 Tech 指定的 `ModuleAssets` 租约入口。实现前检查工程现有入口和模块所有权；不造第二套 Bundle manager 或重复世界资源。

Tech正在核对可复现发布 staging 工程路线。生成 staging 输入时使用隔离目录/副本和文件清单，保留原始项目、源图、母版及其他 dirty 文件；同一正式 UUID 在候选工程中仅保留一个实际归属副本。

## 3. 结构设计

先实现独立发布输入生成器：读取批准 map 和资产身份，逐项校验导出 hash、原尺寸、裁切矩形、offset/pivot、正式路径和 UUID，生成确定性导入清单及启动包可达性报告。新增独立派生 SpriteFrame 工具，通过 Creator 公开 API 依据原始 full-canvas 与裁片 rect 建帧，重复像素由稳定资产映射共享同一底层 Image/Texture，保持 frame 各自 rect/originalSize/offset/pivot。

模块划分沿用批准 Tech/UI：启动菜单壳仅保留启动必需输入；world（共享街景）、tourist、shops、dialogue、milk-tea 各自本地 Bundle，跨模块共享以显式依赖/租约表达。页面进入按 generation acquire，完整后原子显示；离开取消迟到绑定、先清 SpriteFrame/Prefab 引用再释放 lease，失败可重试，重复释放幂等。当前框架代码只按契约集成与检验，不宣称已有独立批准。

## 4. 协议与平台影响

不改网络/API/玩法数据契约。Bundle、本地路径和调用入口必须符合已批 Tech 设计；启动 Scene/入口不再序列化持有模块资源。发布平台限制以实际 Creator 目标配置和平台官方当前限制为准，本 Brief 不承诺仅拆 Bundle 即满足包体上限。

## 5. 性能影响

不改变批准 PNG 分辨率或像素。重点测量源文件与构建物理包体（含图集空洞、padding、独立大纹理），记录相同图像共享与 Bundle 递归依赖。加载避免重复纹理/重复 inflight、无界预载和页面持续查找；离开释放只释放零租约资源。测试进入/退出循环中的计数、资源与 GPU 观测；Creator/Web数字不等同目标设备性能。

## 6. 日志与调试

保持稳定模块ID、asset ID、UUID、bundle ID和generation；错误说明用中文并包含模块/路径/失败步骤。生成器输出逐项可重跑的校验报告；Creator导入回读真实 UUID/原画布 frame 字段；Bundle和生命周期报告输出所有者与租约计数，不以猜测替代运行诊断。

## 7. 测试与验证

先做生成器确定性、路径/哈希/UUID唯一性、bbox与offset、共享关系和依赖DAG可执行核验；Creator导入后回读真实 SpriteFrame 字段及 UUID。随后使用版本相容 Creator CLI 构建，检查启动包递归引用、Bundle落点与物理包体；本地HTTP实际Web产物检查同背景同尺度对照、页面加载/离开/重入及20次生命周期稳定性。未执行项标记 `NOT_TESTED`。微信/抖音/原生平台限制只在实际平台工具可用时验证，不以Web结果替代。

## 8. Tech Lead 对齐请求与主要风险

请 Tech Lead 对同一版概要核对：隔离 staging 输入如何确保原项目 dirty 状态不被复制/污染；Creator公开 `SpriteFrame.reset` 参数与导入回读方式；正式 UUID在工程唯一归属和重复共享图像路径；菜单入口递归依赖如何证明模块资产未被硬引用；Bundle及租约契约的实际Owner边界；包体超限的升级处理。

主要风险为 Creator 导入对 frame offset/originalSize 的重算、重复资源UUID路径归属、Gallery当前代码交接冲突、共享模块异步取消和平台分包阈值。任一风险若需改批准资源、用户语义、公共接口或画质，先向 Master 提交变更请求；先完成生成器与派生帧模块，再按 Master 明确交接进入页面调用点。
