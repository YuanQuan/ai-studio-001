# U05 奶茶小游戏客户端 Review Packet v0.1

## 本版审查范围
- U05 在现有单元示例中的菜单接线与独立模块边界。
- 获批完整配置副本的字节/哈希、Creator `resources.load` 可达性和本地示例存档隔离。
- 状态机：档位/阶段选择、必选项、撤销、配方查看、交杯、错杯、单次通关结算、失败/退出、精确截止边界、永久解锁。
- Cocos 生命周期、倒计时更新、实际 Web 构建与浏览器交互证据。

## 输入与身份
- Product PRD：`deliverables/product/MILK-TEA-MINIGAME-SPEC-20261012/v0.1/PRD.md`（用户批准见任务目录）。
- 唯一运行数据副本：`apps/client/assets/resources/u05_milk_tea/config.json`，SHA-256 `bcb757797059e1e022b67609ec4ba8bdbfa40829febe49055fee4a35322a4cb8`；与获批生成器 v0.2 的 server 全量候选字节一致。
- Gallery 最初基线 SHA：`655303582a108e115e1081801de7fc24714778fc5f687ad17661a645ec7b986c`。
- 最终构建来源、资源 UUID、bundle SHA 与 URL：见 `evidence/BUILD_AND_RESOURCE_IDENTITY.json`；最终 Creator 完整日志见 `evidence/CREATOR_BUILD_FINAL.log`（23:27:20 Finished，退出码36）；此前沙箱启动SIGABRT诊断在 `evidence/history/CREATOR_BUILD_20261012_2250_ABORT.md`。

## 已有 Owner 检查
纯逻辑检查 PASS；Creator 3.8.8 Web Mobile 最终构建 PASS（23:27:20 Finished，退出码36）；静态检查确认 U05 脚本和配置资源进入各自 bundle。Master 已完成最终浏览器操作并冻结 `evidence/BROWSER_RUNTIME_REPORT.md`；23:27版返回/重入无error/warn，结果截图 `evidence/browser-final-release-reentry.jpg`。设备、原生、性能专项与正式 QA 不属于本单元示例范围。

## 请求 Tech Lead 复核
请核配置字段映射、ID/引用和阶段选项池；限时精确截止与页面销毁；正常/验证存档隔离和永久解锁；Gallery 最小接线、静态资源导入与本轮 Creator CLI 构建证据。仅为本 Lab 评审，不代表正式服务端实现、正式发布、QA 通过或用户批准本版本。

## Master 最终运行证据
此前内置浏览器已验证：真实点击单次输入、缺项禁交、错杯同单清空、撤销、正确订单推进、噩梦二阶段五维四选项、配方期间deadline继续、背景原料点击被modal拦截、超时失败及重试。23:01构建完成预览下移、解锁说明换行及字号调整，并通过360×640实测；23:27构建只修复Lab root与Gallery页面重复销毁。Master强制刷新后实测进入→返回→重入，正常存档仍为XP10/通关1/5/仅简单开放，控制台新时间窗 error/warn 为空。截图和未覆盖范围见 `evidence/BROWSER_RUNTIME_REPORT.md`。
