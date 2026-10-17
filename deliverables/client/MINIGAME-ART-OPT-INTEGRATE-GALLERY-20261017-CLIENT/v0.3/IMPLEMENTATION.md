# Gallery U04 请求重入修复 v0.3

本版针对真实 Web v0.4 再入 U04 时出现的 `[ModuleAssets] U04人物三层加载失败 Object` 日志。修复聚焦 U04 页内请求去重、过期请求隔离和真实错误序列化；不改变布局、玩法、资源或时间顺序。

`openDialogue()` 已经启动当前对话选择请求时，`ensureU04Manifest()` 不再在已持有映射时重复触发选择刷新。映射、装饰及三层选择的异步完成/失败回调均核对页面代次和当前请求身份；退出页面先使代次失效并取消请求，因此迟到取消不会覆盖新页状态或记录成资源失败。当前有效请求若真实失败仍会更新状态并输出含资源键、表达、代次及错误名称/消息的 JSON 日志。成功结果取资源发生错误时先释放对应租约再走当前错误处理。

真实失败证据保留在 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/browser-integration-v04/CONSOLE_ALL_BEFORE_U04_FIX.json`，SHA-256 `ff62ca907c88fe8cfb10ca997aabd2ee4a7b084f2886d47357625fa450c62b94`。v0.2候选及本次修复前源码保存在 `evidence/prechange/`，其中 Gallery SHA-256 为 `425f1ae683961bd25b5d0fa67a43c55639bfff36551b3146d1ce77ac90098efe`。

## 验证

- Creator 3.8.8 随附 TypeScript 4.9.5 全项目语义检查通过，命令记录在 `OWNER_VERIFICATION.json`。
- `u04_request_reentry_probe.cjs` 对真实 Gallery TypeScript 方法转译后执行：重复刷新仅保留最新选择、旧请求取消不产生误报或覆盖状态、当前真实失败保留可读错误、已有映射不再重复刷新、页面退出时映射/装饰取消不误报。通过。
- `gallery_asset_session_probe.cjs` 继续通过，覆盖此前的session竞争、派生租约释放及20轮有效方法测试。
- 本版尚未重建Creator Web，也未做新构建IAB实测；需Root对新候选重新构建及验证，并重新执行实际20轮循环。本交付不将v0.4旧运行结果记作本版通过。

## 逐项验收状态

五条正式验收原文及状态见 `DELIVERABLE.json`。当前范围的源码和有效方法验证已完成；依赖新统一构建及实际运行的条目仍列为未测试，等待父Task执行。
