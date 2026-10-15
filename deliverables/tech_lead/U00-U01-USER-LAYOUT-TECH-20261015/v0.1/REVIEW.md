# U00/U01 用户布局参数技术复核 v0.1

## 输入与范围

- 冻结输入：`deliverables/master/U00-U01-USER-LAYOUT-20261015/v0.1/USER_LAYOUT.json`，SHA-256 `094365e576c948009a04ffdd0c20a9829171c45f642ffaa5ff80a6366842537d`。
- 输入校验：同目录 `INPUT_VALIDATION.json` 为 53 个唯一实例、21 个原型、47 个环境实例（其中 6 棵树）及 6 个店铺，坐标算式误差阈值 `1e-10` 内无问题。
- 评审对象：U01 初始、重置、重入及 U00 总览入口的参数投影；U04 沿用既有默认环境；正式图片、meta UUID 和目标设备性能不在本轮变更范围。

## 方案预审

Client 拟新增用户冻结 profile；`populateSakuraV03` 仅在显式传入 profile 时投影该布局，无参路径保留 U04 既有默认；U01 编辑器以同一 profile 初始化 53 个实例；U00 总览入口传 profile，六店从左上角盒和各自 scale 换算到 `ground_contact` 脚点。`UnitSampleGallery.ts` 另一个 `populateSakuraV03` 调用位于 U04 对话页，应维持无参。这个边界可接受，待实际代码与构建证据复核。

复核重点：逐项保留冻结浮点、稳定 `instanceId`、镜像和 `orderBottomToTop`，包括新增两棵树的 6.1/7.1；U00 节点实际应用 scale/mirror，而非只修改坐标；`ground_contact` 当前局部 Y 为 -388，脚点换算需要与 3072×1024 原点一致；U04 无参路径不变。

## 源码与静态复核

我独立读取新增 `sakura_user_layout.ts` 并按 JSON 解析：21 原型及 schema、canvas、counts 与冻结输入相等；53 实例逐字段精确相等，唯一增加的 `layer` 字段均能从原场景同实例或同资产层映射，6 店归 `U00_Shops`。两棵新增树保留 ID、镜像与 6.1/7.1。此检查是源码静态核对，不是引擎运行结论。

`sakura_v03_environment.ts` 的有参路径依冻结 `left/top/sourceSize/scale/mirror/orderBottomToTop` 构建环境节点；无参路径仍取 `SAKURA_V03_LAYOUT.instances`。`UnitSampleGallery.ts` 仅 U00 总览入口传 profile；U04 对话页继续无参调用，独立六店固定参数保持。U00 六店脚点算式逐项与冻结 `shopFootpoint.footX/footY` 差 0，并由 `ground_contact` 实际局部 Y 补偿节点位置；各店 scale/mirror 进入节点设置。五层结构以 L03 背景、六店实体、L04 前景的父节点顺序表达店铺的遮挡关系。

Client `PARAMETER_STATIC_VALIDATION.json` 亦记录了 53/21、树层序、六店脚点及 U04 隔离，和上述独立检查相符。U01 编辑器分页末组已使用 47 个环境实例显示为 41–47。目标设备帧率、DrawCall、内存和 GPU 性能本轮不测。

资源侧另逐件核对 21 张客户端 PNG 的 SHA-256 与冻结原型值一致；每张 `.meta` 的 image、texture、spriteFrame UUID 与冻结值一致，47 个环境实例的 UUID 均指向对应原型。没有发现本次修改图片或既有元数据。

## 构建身份与运行状态

Creator 3.8.8 首次构建退出 -6，无输出，该次不计通过。Client 在隔离工程完成一次恢复构建，保存 CLI 标准输出、错误输出和构建日志；日志含 `build Task (U00-U01-USER-LAYOUT-CLIENT-20261015-v0.1) Finished in (28 s)ms`，退出码 36，TypeScript 检查退出码 0。`BUILD_MANIFEST.json` 记录 `web-mobile` 的 UnitSamples 入口、当前 766 个输出文件及源码与产物哈希。我独立复算其中 5 项源码与 6 项输出哈希全部一致。隔离工程与当前源码身份相符，构建判 `PASS`。

Master `HTTP_IDENTITY.json` 记录本地 HTTP 6 个核心文件均为 200，SHA-256 与上述当前构建逐项一致。`IAB_VERIFICATION.json` 记录 Codex 内置浏览器 720×1280 实际操作：U01 初始、编辑后重置、离开重入三份导出；U00 初始、编辑后重置、离开重入三份导出；U00 分段拖动画面及 U04 打开返回。我的独立 JSON 比较确认 U01 三份均与冻结输入整对象精确相等；U00 三份整对象相等，六店脚点、scale、mirror、order 与冻结输入逐值一致。截图显示 U01 全景和末页 41–47、U00 左树/桥/右树与店铺、U04 原有对话背景与店铺；浏览器警告/错误为空。

U04 此处为兼容冒烟，未做完整状态回归。目标设备帧率、DrawCall、内存、GPU，微信/抖音运行均 `NOT_TESTED`。本结论仅为本次单元示例在当前 Web 构建上的技术审核，不代替正式功能/正式资源接入审批。

## Review 结论

`APPROVED`：53 实例与 21 原型参数、U00 六店脚点、U04 默认隔离、构建身份和当前 HTTP/IAB 样例证据满足本 Task 两项验收。无必须返工的技术问题。
