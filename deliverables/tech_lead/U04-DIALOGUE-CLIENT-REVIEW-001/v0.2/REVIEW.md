# U04 客户端版式技术评审 v0.2

**结论：已完成的第 1、3 项布局修订通过技术评审；三项用户反馈的整包仍未完成。** 本次对象为 `UnitSampleGallery.ts` SHA-256 `7b1c92c291f33a83a6851898154eb6ef69da32b006141bcd125df8285d8d29bb` 和同版 Creator 3.8.8 Web-Mobile 构建。角花仍是已批准旧资源，仅用于验证布局；新角花处于 Art 制作方案 `USER_REVIEW`，尚无可接入的具体资源版本。

## 源码与结构

`U04WaistCrop` 现在是 `U04DialoguePanel` 的子节点。`U04BaseLayer`、`U04FaceLayer`、`U04FrontLayer` 同属 `U04Portrait`，整体经该 Mask 绘制在面板 Sprite 之上；旧角花和文字仍位于场景的更高兄弟层级。脸片继续用共享 1024×1536 源画布的 `face_source_pivot_xy` 定位，前遮挡继续用源矩形定位。调整未改 90 组合的索引、三轴选择或请求代次逻辑。

`layoutDialogue` 以面板局部坐标定位肖像裁切框：横向为面板左边加肖像宽度一半，纵向为面板底边加 `10*portraitFactor` 与肖像高度一半。面板尺寸及视窗改变时，肖像比例和坐标重新计算。姓名、演示对白均设置 `Label.HorizontalAlign.LEFT`，节点几何左边界共用 `textLeft`；该列从肖像实际占宽后起算。384×192 窄面板的名字与对白在实际画面中仍各自可读。

## 构建与运行证据

Client 当前构建记录显示 Creator 3.8.8 `web-mobile` 任务有 `Finished` 标记，当前入口 SHA-256 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，`dialogue/config.json` SHA-256 `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`，HTTP 均返回 200。Master 在 Codex 内置浏览器操作同版实际 Web 产物，记录于 Client `evidence/MASTER_RUNTIME_OBSERVATIONS.json`。我独立核对该记录的七张截图 SHA-256 均与文件一致，并查看默认宽屏、651×898 和 384×192 画面。默认及 384×192、768×256、1024×384 三档面板中，肖像位于面板前方并贴合左下，名称与对白同左边线；当前 90/90 组合巡检零失败，耗时 6757ms；返回并在原生 651×898 视窗重入通过，浏览器记录的警告和错误列表为空。

这批运行证据只判第 1、3 项。横屏返回后的菜单沿用项目原竖屏布局，本次在恢复原生视窗后完成重入，不构成横屏菜单适配结论。目标设备、原生、微信/抖音 SDK、GPU/驻留内存和冷网络压力未测；6757ms 仅是 Web 巡检耗时。单元示例按任务约定无 QA，若升级为正式功能须重新进入适用 QA 与审批门禁。

## 验收与后续

1. 编码前简报：**PASS**。`BRIEF_REVIEW.json` 已核复用、坐标、面板与文字布局、旧资源边界，并要求同版构建及浏览器证据。
2. 资源与状态：**PASS，限本次变更影响**。本轮未改 v0.1 已核的 129 PNG、meta、SpriteFrame、四边 48 Insets 或资源路径；当前 Bundle config 哈希一致，三层实际运行与 90/90 组合通过。第 2 项新角花资源未制作，不在本结论内。
3. 当前构建与运行：**PASS，限 Web 版式**。当前源码、构建、HTTP 和实际 Web 画面互相对应；未测平台与性能已区分。

Review Action：Art 新角花完成制作方案用户审批、同批预签和具体切片审批后，再由 Client 接入并做同版运行对照；Master 不应将本次第 1、3 项的技术通过写成三项用户反馈全部完成。`UnitSampleGallery` 继续膨胀，若 U04 从单元示例转正式功能，Client 应评估抽出独立页面控制器。
