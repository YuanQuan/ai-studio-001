# 客户端实现报告（页面冻结评审稿）

任务：`MINIGAME-ART-OPT-BATCH-20261017-CLIENT`；版本：`v0.1`。本报告冻结 Gallery/U01 与框架提交 Tech 实码 Review。它不是全批完成或用户批准记录；U05 子任务仍在修订，集成构建及浏览器实际运行检查尚未完成。

## 当前源快照

本轮冻结源码：`apps/client/assets/UnitSampleGallery.ts`（SHA-256 `a434c2d40b792ee4e7c3265edd852899f3461d23aaf9a30708611f6c24513d47`）、`apps/client/assets/labs/u01/sakura_layout_editor.ts`（`f3c7fc6c1ee96cc15fd3c8ca8787d33e0998375088d72e34568d1147e2e6b0af`）与 viewport adapter 的类型修正（`173b56fa3e34e958bcb15eceb64ca74d3b7fa46d94a91c1073b3c249ddcdfb24`）。其它共享框架源和 `.meta` 哈希见 [SOURCE_CHANGE_MANIFEST.json](SOURCE_CHANGE_MANIFEST.json)。唯一改动过的既有页面 `.meta` 内容保持原字节；未触碰场景、Prefab、图片、用户参数或 U04 原有资源 UUID。

U05 当前接入源码来自独立子任务冻结快照，`milk_tea_lab.ts` SHA-256 `7da20f49e400fe8a202f9c91a08d3a4aec40aaaf3b93e963df3ed42771064d3f`，辅助源 SHA-256 `bbacc3aadee8695d3dd36194ef884dc323f45e1709515a229885fef68de0d761`，新增 helper meta UUID 为 `9a868daf-9e47-43ca-a0e7-8d127b9c1a65`。Tech 实码检查发现首屏代理选择分支引用未定义 `size`、`fit`、`safe`；Owner 正在修订。该快照不进入本次稳定页面 Review，也不作为最终合并构建输入。

## 按已批准 LAYOUT_SPEC 逐页核对

| 页面 | 已实现内容及源码落点 | 未覆盖/验证限制 |
|---|---|---|
| 入口 | `UnitSampleGallery.ts` 的 `menuCard`、`layoutScene`（约 530–565、2040–2080 行）以单列滚动卡片呈现 U00—U05；卡片按 safe 区宽度设置，入口最小48逻辑像素，保存 `menuScrollOffset`；按钮 generation 和滚动手势抑制重复提交。 | 卡片资源初始不可用时仍为禁用提示，尚未做到卡片内重试；动态错误原因/重试也未实现。卡片标题/说明明确设为 CLAMP，当前说明限两行显示，未按任意内容动态增高。无实际渲染测量。 |
| U00 夜市总览 | `layoutOverview`（约1917–2035行）按 safe bounds 排导航、相机、人数、开关；48逻辑像素热区通过 Mapper 的双轴保底换算。调节面板默认关闭，关闭/恢复/复制固定行、正文滚动且遮罩接管输入。短屏 `height<600` 将开关、人数收入面板首两组，仅保留相机常驻，反馈区在末尾。 | 低于阈值的实际短屏视觉尚未运行；CLAMP反馈区和长错误是否完整可达未验证。剪贴板平台行为未实测。世界组合与相机输入在真实浏览器尚无证据。 |
| U01 樱花场景布局 | `sakura_layout_editor.ts`：原3072×1024源画布与导出坐标保留；顶部 safe 导航、模式切换；底部48入口与状态；遮罩面板默认关闭，旧图层/调节按钮迁入滚动网格，按钮按48逻辑像素布局；面板手势阻止传给画布；resize 调 `fitCanvas`，不重置编辑数据；未改 `sakura_v03_layout.ts`。 | 状态栏使用 CLAMP，尚无滚动错误全文；导出参数使用浏览器 DOM 选择/复制回退，不满足小游戏无 DOM 平台的完整复制路径；资源失败列表/重试面板未新增。实际拖拽、滚动和覆盖层拦截未在 IAB 验证。 |
| U02 游客动作与装扮 | `layoutTourist`（约2175行起）将导航、世界舞台、底部托盘分别按 safe 区重排；舞台高度从剩余空间计算，最短屏可为0，不再固定240/200；托盘目标按safe高度45%夹在168–336，整体不足时降至120并滚动；游客主体使用舞台等比；动作时相和当前数据不因布局重置。 | 状态/装扮说明使用 CLAMP；实际字体映射、托盘末项可达及极短屏布局无屏幕证据。 |
| U03 六店店铺 | `layoutShops`（约2080–2160行）依据 safe bounds 分开导航、舞台、身份、状态、按钮；舞台高度无200最小值；失败状态区按需增至最多96，重试按钮位于独立48高行，避免与状态文字同点覆盖；按目标 generation 提交最新店铺，旧画面在新资源就绪前保留。 | 长错误文本是否在96高信息区完整阅读未验证；目前没有独立滚动错误阅读层。加载失败/快速切店及触屏命中尚无真实渲染运行证据。 |
| U04 店长对话 | `layoutDialogue`（约1247–1420行）：实际方向切换竖屏布局，安全导航；竖屏人物、对白和人物/表情覆盖层分开；覆盖面板默认关，管理者、魂级、表情、尺寸与90组巡检在弹层中按行列布置，48逻辑像素行高。横屏面板按原 `U04_PANEL_SIZES` 宽高同比例 fit，不单独 clamp 宽高，保持请求面板比例及九宫格、人物、角花关系；对白提供安全区内阅读覆盖层和滚动偏移；size变化只重新排版。 | 运行时长对白滚动和横屏构图未实际观察；阅读层行数以字符列数近似估算，不是字体排版测量。对白主面板依然 CLAMP，由阅读层提供完整文本访问，但实际底层触点相交尚未测。 |
| U05 奶茶 | 子任务已提供安全区 adapter 接线和覆盖层/分轴尺寸实现，交接快照与哈希见上文。 | 当前版本存在3个 `TS2304` 未定义标识符，已被 Tech 退修；待子 Owner 修订并独立评审。禁止将该源视为通过或纳入最终构建。 |

## 有效验证

`evidence/framework-contract-tests-v0.1.json` 为 Owner 受控契约测试：共享加载/引用、依赖逆序释放、失败回滚、取消和清理异常、重复释放、20次循环，及安全区/胶囊分支、读操作与resize通知竞态、零尺寸快照保留、Canvas负偏移投影、WeChat主API异常fallback、48逻辑像素双轴投影均 PASS。此为确定性代码测试，不代表 Cocos UI 渲染或设备矩阵。

使用 Creator 自带 TypeScript 4.9.5 和 Cocos 3.8.8 declarations 的额外语义检查记录在 `evidence/typescript-semantic-v0.1.log`。修复Gallery变量作用域错误以及 adapter 类型输入后，当前唯一报告项为 U05 首屏分支的 `size/fit/safe` 三个未定义名，符合独立 Tech Review 的发现；Creator CLI 的 transpile/build 成功不能掩盖该语义错误。

曾有统一隔离 Creator v0.5 CLI 构建退出码36，日志显示该 Build Task `Finished`，产物位于 `/private/tmp/minigame-art-opt-batch-20261017-build-v0.5/minigame-art-opt-batch-20261017-web-mobile-v0.5`，日志为 `evidence/creator-build-v0.5.log`。该历史构建包含上述 U05 无效源及随后修正前的 Gallery/类型快照，故不属于本报告冻结源的最终构建，不可作为整体构建或运行通过证据。IAB实际交互、六种竖屏、U04横屏和 DPR 矩阵均 NOT_TESTED。

## 资源与范围结论

U04既有 dialogue/path 保留，页面在途/owner代际交给唯一 `ModuleAssets`；没有搬资源或更改序列化引用。Gallery/场景现有硬引用仍然持有全帧/Prefab，因而不能据此宣称启动包、包体或完整生命周期驻留已减少。没有改PNG、现有meta UUID、Scene/Prefab硬引用或新增资源分包。
