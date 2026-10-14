# U05 B 前端实现报告

状态：实现、隔离构建和 Master 最终浏览器复核完成；交付进入 USER_REVIEW，等待用户审批及 Master 最终接受。  
实现范围：已批准前端配置与 B 制作者工作区；未改动服务端运行资源。

实现包括三类 12 原料、174 个三元配方、五档难度各两阶段；保留既有存档并提供阶段选择、三杯订单、计时、撤销、结算、经验与解锁状态。杯体以已登记原料图片和对应杯层素材分别绘制，目标杯不显示配方；选料高亮复用已批准选择切片。选择页与制作页分别绘制顾客、柜台、订单和三类标签，选择页底部入口已移入画布安全范围；空订单气泡覆盖背景残留的旧气泡尾部。

通用组件独立为 `u05_nine_slice_plate.ts` 和 `u05_bitmap_text.ts`。12 个标签使用获批 v0.2 小圆角底板九宫格，按 123×45 源图尺寸与四边 inset 18/18/12/12 绘制，再统一缩放以保持角宽；中文标签、三项主要操作和顶部信息绑定获批 719 字 BMFont，按深棕或屋顶浅色着色。组件对缺字会显式报告，合法换行控制字符不视为缺字。确认、撤销等动作维持独立命中区域；选料区域按屏幕实际缩放确保至少 48 CSS 像素。异步资源加载在组件销毁后停止回调并释放待处理资源。

按 Master 试玩反馈修正：杯内容 Sprite 对 183×233 原始透明画布明确关闭 trim，避免裁剪后 alpha 外接框被拉伸到整杯；主要 CTA 字号提升到约 37 源图像素等效，禁用态只调暗底图、不缩小按钮；选择页恢复顾客与柜台绘制，并调整开始、返回、验证设置入口位置，避免窄屏底部裁切。制作反馈移至源图坐标 (512,1380) 的工作台留白处，使用 28 源像素深棕字；新增 U05 面板与描边改为色彩系统中的暖木棕与暖木边线。准备页将阶段和原料开放数两行收进空订单泡，使用居中深棕文字；制作页移除覆盖杯口的重复选料文字，选中框与配方帮助继续展示选择内容。兼容 `setExitHandler(handler)` 与 `onExit` 两种退出回调接口。

配置生成只输出客户端可读包；正式生成器对批准源表与稳定源表逐单元校验，唯一允许差异是获批 READY/export 状态晋升。旧 `config/generated/server.json` 字节内容保留并标记为历史生成资源；本任务没有重建或发布服务端配置。正式资源只放在 `resources/u05_milk_tea/u05_b`，资源 UUID、源文件路径和已审批版本登记在 `project/ASSET_HANDOFF_REGISTRY.md` 与 `evidence/ASSET_IMPORT_MANIFEST.json`。

实际构建使用 Creator 3.8.8 的独立副本 `/private/tmp/u05-b-client-build-20261014/client`，产物仅写入 `/private/tmp/u05-b-client-build-20261014/output-final-review/web-mobile`。Creator 日志报告 web-mobile 构建 Finished，正常退出码为 36；同一构建包含 `UnitSamples.scene` 启动场景并保留工程中已有的 LanternPilot 场景。独立 HTTP 服务地址为 `http://127.0.0.1:8876/`。构建日志、输入散列、产物散列、mtime 与路径记录在 `evidence/BUILD_IDENTITY.json`。

验证结果见 `evidence/STATE_AND_CONFIG_CHECK.md` 和 Master 最终实际浏览器记录 `deliverables/master/U05-B-FRONTEND-LANDING-20261014/v0.1/BROWSER_RUNTIME_REPORT.md`。在 v4 同源 8876 浏览器中，Master 确认三杯通关、错杯反馈、最近选项撤销与刷新后存档（XP 10、通关1/5）；在 360×640 噩梦第二阶段确认 3/3/6、查看配方时倒计时继续、90秒超时失败、重试和正确单杯交付；帮助正文至少14 CSS px可读、计时失败标题为“时间到，本局失败”。最终普通模式复核确认退出验证流程不发奖励，XP 10及1/5进度保持；viewport已复原，验证模式关闭、阶段1，当前工作台选择月雾茶、云魄乳、梦纹冻且未交付，浏览器 warn/error 均为空。最终证据包括 `browser-v4-exit-no-reward.jpg`、`browser-v4-normal-persisted.jpg`、`browser-v4-final-workstation.jpg`。历史缺陷截图和旧版本证据仍单独标记，不作为最终视觉结果。本交付没有正式 QA Agent 结论，也未验证实体触控、原生包或长期性能；不以单元示例运行结果宣称这些质量属性。Master 报告指出 Gallery 在 v4 构建后由其他线程修改，本任务未改 Gallery；完整隔离输入身份见 `evidence/BUILD_IDENTITY.json`。
