# U03 技术验证矩阵与门禁 v0.1

本矩阵区分技术稿已检查的**文档覆盖**和未来运行证据。当前正式六店资产未生成，以下运行/资源核验一律 `NOT_TESTED`；任何专业自评 `APPROVED` 都不等于运行通过。

| ID | 验证对象与方法 | 最低证据 / 负责人 | 当前 |
|---|---|---|---|
| V-01 | 01–06 唯一 ID；奶茶 `MT_SHOP_01` 与 Art 候选 ID 一对一，六个 Prefab 同源供 U03/主体复用 | Art/Tech/Client 三方资源登记、真实 `.meta`/Prefab 引用与哈希；Tech 复核 | `NOT_TESTED`：仅有本版计划映射 |
| V-02 | 六份独立 PSD、切片、牌匾、前后件与同尺度重组；奶茶/理发屋顶补画 | Gate2 实图与版本清单、逐件 SHA-256、Art 核对、用户审批 | `NOT_TESTED`：Gate1 只是方案 |
| V-03 | 初入 01、返回再入 01、同屏唯一店、六项可达及 01/06 循环 | Client 运行录屏、节点检查；QA 按已批用例复核 | `NOT_TESTED` |
| V-04 | 快切末次有效请求；店体、牌匾、名称、阴影原子一致，失败可见且不冒用他店 | 人工快切/故障注入录屏，日志含请求序号和当前 ID | `NOT_TESTED` |
| V-05 | U01 原镜头功能、U02 实际获批范围与 U03 菜单集成；旧九入口不复活 | 菜单构建截图/录屏及审批版本索引 | `NOT_TESTED` |
| V-06 | `720×1280` 及 `390×844` 候选模拟视口：完整店体、地线、字牌投影、安全区 | 两视口×六店同尺度截图、CSS视口/DPR/safe area/逻辑可见区、牌匾笔画记录 | `NOT_TESTED` |
| V-07 | alpha 裕量、trim/offset/pivot、遮挡顺序与静态灯光无接缝/黑边 | PSD/导出几何与 Creator SpriteFrame 数据、实际运行截图 | `NOT_TESTED` |
| V-08 | 纹理格式/页数、加载延迟、峰值内存、帧时、DrawCall；阈值来源可追溯 | 已批 QA 性能预算、Creator 构建和 Web 测量记录；适用平台另列 | `NOT_TESTED` |
| V-09 | 权利与审批链：附件商用改编、字体/原创字稿来源、首图预签、Gate2、UI/Tech/Client/QA 用户决定 | `RIGHTS_AND_SOURCE.md` 更新、签认、Approval Log 与具体版本 | 部分：Product/Gate1 已批；其余未满足 |

## 执行顺序与责任

1. 本 Tech v0.1 与 UI v0.1 分别完成专业 Review、用户审批；本稿未获批前不作为 Client 结构定案。
2. Art 在正式首图前解决附件商用改编权、字体/手写字来源与外来素材权限，并与 Tech 对同批来源、PSD 格式、画布/脚点、透明边、层/输出、纹理预算作文字预签。权利仍 `UNKNOWN` 时暂停正式图/PSD，不用试做样张绕过。
3. 代表样张实际出图后 Art/Tech 基于实图复核，按规则复签全量；六店 PSD 和切片完成后依组织自行切图等实际路径提交 Gate2。组织 Agent 自行切图时，执行 Agent 核文件与同尺度重组，直接交用户审核，不增加切图效果专业复审或额外预览环境门禁。
4. Gate2 对具体切片/重组获 `USER_APPROVED`，且 Tech/UI/Client 必需输入各自获批后，Client 才把同源正式资源接入 Cocos，回填真实路径、哈希、`.meta`/UUID 和 Scene/Prefab 引用。
5. Client 通过版本相容脚本/API与 Creator CLI 构建，核 `web-mobile/index.html` 和脚本/资源构建结果；由本地 HTTP 提供实际产物，Codex 内置浏览器检查真实 UI 操作与两模拟视口。Editor/目标平台与 QA 所需证据按获批范围继续，不以 CLI 构建或静态检查替代。
6. QA 用已批计划区分功能、视觉、加载/性能与未测平台；TEST_REPORT 获用户确认后 Master 才可据完整验收考虑 U03 最终完成。

本版文档自评只可对技术方案覆盖写 `PASS`；V-01–V-09 的资源、运行或审批未完成处保持原状态。
