# 功能概要：U00与U01用户布局参数更新

## 范围与输入
以 `deliverables/master/U00-U01-USER-LAYOUT-20261015/v0.1/USER_LAYOUT.json` 为唯一布局参数源，SHA-256 `094365e576c948009a04ffdd0c20a9829171c45f642ffaa5ff80a6366842537d`，覆盖环境47实例、店铺6实例及原型21项。U01初次打开、重置和离开重入都采用冻结53项；U00 overview入口采用相同环境和六店参数；U04对话页继续使用既有默认环境与店铺参数。完整保留top-left、scale、mirror、order和ID等数值；不触碰图片字节、资源UUID、U04默认值，不生图。

## 实现与复用
新增U01用户布局数据模块作为53项共享profile。复用现有 `SAKURA_V03_LAYOUT` 的资源原型与五层场景接口；`populateSakuraV03`增加可选profile，默认调用不变以保证U04。U01编辑器直接从profile构造初始实例，保留现有编辑、重置、重入及导出流程。U00 overview的店铺实例继续使用现有Prefab和 `ground_contact`，由冻结的top-left框、尺寸、缩放换算脚点并设置镜像与同层顺序。

## 模块与风险
修改范围限于 `sakura_v03_environment.ts`、`sakura_layout_editor.ts`、`UnitSampleGallery.ts`，新增用户布局数据模块与必要meta。本地查表只在页面构建时读取；不增加资源加载、场景Prefab、依赖或Update循环。浮点数直接读取冻结值，禁止从中心坐标反算。环境的五层分组与U04无profile路径保持既有行为。

## 验收与验证
静态逐字段核对用户53项到U01 profile/editor模型、U00环境投影与六店脚点，确认新增树、mirror、scale、层序均映射；确认原型/UUID/图片及U04路径保持。使用Creator 3.8.8隔离工程TypeScript检查及UnitSamples `web-mobile`构建；报告构建日志、退出码、输出目录和hash。Root负责内置浏览器实际运行检查。本Client任务不声称QA或目标设备性能通过。
