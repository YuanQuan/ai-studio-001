# 实现报告：U01用户布局参数落地

状态：REVIEW，交付待用户审阅；未标为DONE。

本次只修改 `apps/client/assets/labs/u01/sakura_layout_editor.ts`。在U01编辑器私有作用域内加入按稳定实例ID查找的`left`、`top`、`scale`局部覆盖表，环境实例和六个游客店铺在初始化时分别读取。保持共享 `sakura_v03_layout.ts`、`sakura_v03_environment.ts`、Gallery、Scene、图像与meta不变；不新增脚本/序列化字段、资源、第三方依赖或图片。用户要求的浮点值按原值字面量保存，不舍入，包括左前景接近零的epsilon坐标。

覆盖实例为 `SAK-V03-005`、`ORIGINAL-SHOP-1`至`ORIGINAL-SHOP-6`、`SAK-V03-021`、`SAK-V03-022`。初始、重置和返回重入都沿用现有初始化流程，因此加载同一组默认值。导出schema、实例ID/order、原型身份均保持兼容。

验证：静态模型按编辑器真实层组/店铺插入顺序逐字段核对冻结JSON，0差异；Root在Codex内置浏览器对初次进入、临时移动/缩放后重置、返回重入三次完整导出分别与用户JSON深度相等，均为21原型/51实例。浏览器warning/error为空，六个关键HTTP文件返回200且SHA与构建一致。Creator 3.8.8隔离单UnitSamples `web-mobile`构建官方exit 36且含Finished日志；TypeScript 5.8.2检查exit 0。证据路径见RUN_VERIFICATION.md。

性能影响仅为初始生成时按实例ID本地查表，不增加节点、图片、资源加载或绘制层。未测目标设备/GPU/小游戏平台性能。
