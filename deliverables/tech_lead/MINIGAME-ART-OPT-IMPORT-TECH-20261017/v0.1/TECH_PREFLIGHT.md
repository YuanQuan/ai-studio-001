# 已批裁片导入技术核查 v0.1

状态：技术核查已实际开始。用户已批准Art v0.2的76件及同尺度效果，批准与250项身份来源为本Task明确Master输入。旧游客7样本仅按已批身份引用。首先核批准准确身份和逐件源→PSD→切片→计划Client映射，再在独立临时Creator3.8.8工程核代表shop/tourist/scene真实导入；不修改Main apps/client正式PNG、meta、Scene、Prefab或任何生产实现。

角色依据已按Tech五文件读取；本Task执行共享cocos-cli-browser及scene-and-assets/build-and-browser参考。只读现行工程作为引用事实，不把仍待用户审批的Client实现当正式上游。本机Creator3.8.8可用；Main候选CLI使用另一个隔离工程，本Task另目录，避免资产库争用。

待核首要问题：Importer是否持久保留SpriteFrame.originalSize/offset与原pivot；若导入归一覆盖字段，则依据已批TECH_DESIGN允许的运行时构造路线，核frame.reset元数据与CUSTOM/trim=false的几何公式。先做代表实际导入/UUID回读，输出真实路径和字段；无GPU/实际运行证据不写运行PASS。

本地Bundle交接将列明启动Scene序列化Prefab/全帧硬引用、resources隐式打包、world共享依赖、dialogue既有Bundle、各模块唯一归属、同字节别名不合并动作ID/时长、旧发布输入排除范围及下游迁移顺序。不把目录移动等同分包成功，不删除历史批准源，不引入CDN或自动降画质。任何接口/目录/视觉路线超已批合同先写差异交Master。

停止条件：批准或源SHA漂移、无法真实导入/回读、originalSize/offset/UUID不能稳定落实、需改变支点或业务语义、平台限额未知或跨包复制无法排除。后续Required IMPORT_PROBE/BUNDLE_REFERENCE_MAP/CLIENT_HANDOFF/REVIEW/DELIVERABLE将据实填写，未执行项保持NOT_TESTED。

## 实际核查结果与唯一推荐路线

250批准身份独立复算全一致，76切片SHA/尺寸与7旧游客样本引用逐项通过；83件交接表见APPROVED_ASSET_HANDOFF_MAP.json。旧风险3件仅留历史，当前接入候选采用本批批准修订，不重绘或重新裁图。

独立临时Creator工程 `/private/tmp/minigame-art-opt-import-tech-20261017-probe` 完成实际CLI，退出36且日志明确Finished。店身、walk01、far_l三类各以trimType none/custom共6件真实导入；手填的原尺寸/offset均被Importer重算为裁片尺寸/0，meta和library SpriteFrame回读一致。真实UUID、library路径/hash见IMPORT_PROBE.json。正式工程未改。首次沙箱内启动退出134无日志，正规升级权限后同一命令成功；未更改系统ACL或并用Main资产库。

故Client不能只改meta。唯一推荐沿已批TECH_DESIGN允许的运行构造路线：新建衍生SpriteFrame，通过public reset设置裁片纹理/rect、原尺寸、offset、非旋转；不修改共享缓存原frame，不写私有字段或library。SIMPLE/CUSTOM/trim=false、原UITransform逻辑尺寸/anchor与节点位置保留，无额外手工bbox位移。已执行本机原样SpriteFrame.reset、_calcTrimmedBorder与simple.updateVertexData函数体，三代表CPU顶点均与原画布裁框四角一致。UV更新只做调用占位，纹理/GPU/实际场景显示未执行，不能报告运行通过；这些限制在交接明确。

启动UnitSamples Scene仍序列化1 street prefab、1 tourist prefab、40 body frame、4 accessory frame、6 shop prefab及3 manifest；当前resources优先8、dialogue优先1为本地Bundle事实。未来只拆文件夹不解除这些硬引用，不会证明延迟加载或启动包缩减。计划world唯一共享、tourist/shops/dialogue/milk-tea本地模块与入口依赖见BUNDLE_REFERENCE_MAP，10组重复字节仅为候选别名，不合并动作身份/时长。旧build/temp/library和历史Art交付不能带入运行发布目录，历史批准证据不删除。所有目录标计划，尚未迁移或声称实际分包/GPU收益。

本核查是可执行技术交接，未消费待批Client交付作为正式实现上游；Master完成适用门禁后另派Client。实际导入行为使已批runtime fallback成为必要路线，不构成新玩法或视觉契约；若下游要改变特殊UV、九宫格、sourceRect、平台共享或资源生命周期接口，先报差异。当前本Task交付待Master Review，不以自述完成置DONE。
