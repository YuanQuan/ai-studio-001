# U03 状态、输入与资源接入计划 v0.1

## 六项身份与引用

| 顺序 | 当前标签 | 唯一正式顶层 ID | 计划 Prefab 路径；均未创建 |
|---|---|---|---|
| 01 | 奶茶店 | `MT_SHOP_01` | `apps/client/assets/units/shops/milk_tea/prefabs/pf_mt_shop_01.prefab` |
| 02 | 糖画摊 | `SHOP_02` | `apps/client/assets/units/shops/sugar_art/prefabs/pf_shop_02.prefab` |
| 03 | 炭烤摊 | `SHOP_03` | `apps/client/assets/units/shops/charcoal_grill/prefabs/pf_shop_03.prefab` |
| 04 | 理发店 | `SHOP_04` | `apps/client/assets/units/shops/barber/prefabs/pf_shop_04.prefab` |
| 05 | 花灯铺 | `SHOP_05` | `apps/client/assets/units/shops/lantern/prefabs/pf_shop_05.prefab` |
| 06 | 投壶铺 | `SHOP_06` | `apps/client/assets/units/shops/pitch_pot/prefabs/pf_shop_06.prefab` |

六店 Prefab 各自含需要的 `rear/body/interior/sign/light/front/ground_contact` 静态层；可按获批切图合并贴图，不强制七层七张。店体、牌匾、阴影同一顶层实例、同一 `ShopDefinition`。`MT_SHOP_01` 不与 Art 的 `U03_SHOP_01_MASTER/VISUAL` 建平行可运行对象；它们是一店的正式 Prefab 与源/导出登记映射。未来主体游戏引用同一 Prefab/同源图像，而 U03 只持有展示位置和控件。正式 UUID 只能从 Creator `.meta` 与 Scene/Prefab 实际引用回填。

## 状态事务

内部序号为 `0..5`，展示为 `01..06`；`wrap(i)=(i+6)%6`。进入 U03：新会话 `generation++`，`presentedIndex=null`、`desiredIndex=0`、`failedTarget=null`，进入 `LOADING(01)`，仅返回可用。01 完整 Prefab/身份检验成功后提交为 `READY(01)`。首次无资源时显示中性错误面板，绝不显示其他店代替。

已有 `presentedIndex` 时，按下一店/上一店从 `desiredIndex` 分别 `+1/-1` 递推，每次有效变化先 `generation++`。例如可见 01，连点下一店为目标 02→03；下一店再上一店为 02→01。目标等于已呈现店时让旧代次失效、取消未完成请求，保留旧完整实例和其标签，不重复建立 01。仅最新 `generation` 与仍开启的会话可提交；失效回调释放临时实例/句柄并退出。重复点当前项不叠加任务。

请求期间 `presentedIndex` 的店与其牌匾、阴影和身份栏保持可见；“正在切换至 XX”只由 `desiredIndex` 驱动。目标资源 ready 后，在非活动容器实例化并校验稳定 ID、必需牌匾和脚点/层结构；若校验失败走错误分支。提交点一次性替换：旧实例停用并从内容区移除，激活新完整实例，设置 `presentedIndex=desiredIndex=target`，更新 `01/06` 身份栏与状态字，销毁/回收旧实例。不得先改身份文字再等待图像，也不得让旧店专属层遗留。公共底景仅在独立获批且与六店无相邻店像素时维持。

`requestShop(target,generation)` 是强引用与异步加载的共用结果边界：返回 `{target,generation,prefab,sourceVersion}` 或带稳定错误类别的失败。强引用可同步取到 Prefab，但仍经同一结果交付/提交门；异步路径收到资源回调后同样先比较代次。正式构建直接交付真实结果。仅获批测试构建开启确定性适配：用例脚本按 `target/generation` 指定延迟毫秒、完成顺序和 `MISSING/DECODE/STRUCTURE/TIMEOUT` 失败，测试调度器可在 02 未完成时先交付 03；对结构故障注入返回“校验失败”结果，不篡改 Prefab 层或 ID。模拟 `DECODE` 只核失败分支，不等于引擎真实解码器验证。配置固定种子/顺序并记录于证据，测试后恢复真实交付；离页取消所有待定测试调度与真实回调。不得通过临时删除或重写正式图像、`.meta`、UUID、Prefab/Scene 引用造错。

目标缺失、解码/加载失败或结构身份不一致时，旧完整店维持；写 `failedTarget=target`、`desiredIndex=presentedIndex`，提示“XX 暂不可用，仍显示 YY”，重试按钮只对 `failedTarget` 发新 `generation` 请求。此后若按前后，从可见店递推并清旧失败提示。首次 01 失败则无店、显示中性错误与返回/重试。失败日志用稳定错误类别，不能把另一店贴图改名充当成功。返回菜单时 `generation++`、取消本页监听和待处理句柄、销毁实例并使状态 CLOSED；重进建立新会话，从 01 开始，旧回调不可能写回。

诊断日志使用 `U03_SHOP` 与同一单调时钟，至少记录 `inputAt/requestAt/readyAt/validatedAt/commitAt/presentedFrameAt`，并带构建 hash、Gate2/源/工程资源版本、`targetId/presentedId/desiredIndex/generation`、缓存冷热、错误类别及测试注入配置。`presentedFrameAt` 取新店图、牌匾、身份栏与阴影完成同一提交后的首个可操作渲染帧；菜单入页到 01 以该帧结算，已缓存切换与快切从对应输入或末次输入结算，不能用旧店仍可见时间代替。测试采样需要原始逐帧时刻、实际 DrawCall 可得计数、实例/监听/待处理请求基线；不可采集的计数明确 `NOT_TESTED`。详细采样仅测试构建开启，记录其开销并在性能测量时关闭非必要录屏/叠层。

## MOUSE_UP / TOUCH_END 一次输入

当前 Gallery 菜单有全局 `MOUSE_DOWN/UP` 命中 `menuEntry`，按钮又有 `TOUCH_END`，在 Web 触控模拟上存在同一物理操作被两路触发的风险。实施应为每个菜单项统一一条激活入口：同一次按下/抬起在同一控件命中后仅调用一次 `activate(entryId)`，触控流发生时抑制对应兼容鼠标抬起，或只保留一套 Cocos Button/节点事件处理；不能靠短时间节流掩盖两个事件来源。命中需同时确认按下和抬起同一有效项，禁用项无回调。U03 上一/下一/返回同样用一次激活入口，`TOUCH_END` 阻止传播；U01 镜头全局输入只在 U01 页面活跃，控件透明间隙继续可拖动。真实浏览器分别以鼠标和触控模式核每次序号仅变一格，控件外/拖动离开不触发，不穿透到 U01 镜头。

## 资源与验证门禁

| 阶段 | 可执行事项 | 不可误报事项 |
|---|---|---|
| 当前四份上游规格已批、Gate2 未批 | 本纯文本 Brief、只读审计、与 Art/Tech/QA 讨论切图及验证 | 不复制用户附件、SVG 或旧概念为 Cocos 正式贴图；不导入六店 Prefab |
| 本 Brief 与 QA Plan 获用户批准；Gate2 仍未批 | 完善只读实施清单、与 Art/Tech/QA 讨论实际切图和测量条件 | 本 Task 的验收明确要求两道门禁均通过后才正式编码；不能先改菜单或状态代码 |
| Gate2 具体 PSD 导出切片及同尺度重组版本获用户批准，且本 Brief/QA Plan 已批、Master 解锁实施 Task | 对照 Art 源/PSD/导出 SHA 和层映射，按已批目录导入真实 PNG/Prefab 并实现菜单/状态/控件 | 计划路径、拟定 ID、猜测 UUID 不能当实际导入 |
| Creator 实际导入与运行后 | 回填 `project/ASSET_HANDOFF_REGISTRY.md`：稳定 ID、Art 实际路径/版本/hash、Client 正式路径/hash、image 主 UUID、Texture2D/SpriteFrame 子 UUID、Prefab UUID、Scene 引用与导入设置；留构建/浏览器/视口证据 | 实际画面、性能、QA 未测不能写 PASS |

Creator 3.8.8 首选六个序列化 Prefab 强引用，保持明确依赖和完整性检查；若实测首载/内存不可接受，Tech/Client 按获批变更改为明确路径的异步载入与有限缓存，仍用上面的 `generation` 丢弃旧回调。正式加载策略和纹理释放以实测资源规模及 Creator 引用计数定案，不能释放主体或其他页面共用资产。
