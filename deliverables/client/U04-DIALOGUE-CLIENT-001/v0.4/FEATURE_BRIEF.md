# U04 对话客户端接入概要 v0.4

## 1. 目标与范围

Master 已静态接受 Art 资源 `U04-CLOUD-CORNER-ASSET-001` v0.1。依据用户确认的内部祥云 v0.4 同源两张 128×96 PNG 替换 U04 左下、右上角饰。保持两条稳定客户端资源路径和现有 `.meta` UUID；保持九宫格四边 48、角饰 128×96 固定显示及 v0.3 已验证的面板接角映射。本版只更新客户端实现版号，Art 资源版本仍为 v0.1。

本版只替换两张角饰 PNG，不改人物 PNG、代码、Scene/Prefab、九宫格、依赖或其他 SCENE 资源。两张 v0.3 旧图已在替换前按原 SHA 留存为可恢复副本。

## 2. 现有能力复用

复用 `apps/client/assets/units/dialogue/ui/` 的两个稳定 PNG 路径、既有 `.meta` 与 UUID，以及 `UnitSampleGallery` 当前资源加载、固定尺寸和角点布局。复用 v0.3 的完整 129 条资源映射，仅更新本交付 `RESOURCE_IMPORT_MAP.json` 和 `project/ASSET_HANDOFF_REGISTRY.md` 中两条角饰登记；登记中的其他本轮差异保持不动。

## 3. 结构设计

不新增节点、组件、服务、加载流程或依赖。左下、右上角饰仍分别距面板对应两边 64/48 设计单位，Sprite 保持 `CUSTOM` 与 128×96；面板仍为 `SLICED`，四边 inset 48。两角资源接入前需有 Master 对 Art 静态交付的明确接受记录；该静态接受是本版资源复制和构建的前置条件。

## 4. 协议与平台影响

不涉及 API、服务端协议、平台适配或产品语义变更。按 Creator 3.8.8 原有 dialogue bundle 路径导入。

## 5. 性能影响

替换现有两张同尺寸图，不增加资源数、纹理尺寸、节点、DrawCall、Update/Timer、GC 分配或持续计算。沿用现有加载、缓存、释放与返回入口生命周期。

## 6. 日志与调试

不新增日志或调试入口；沿用 U04 现有演示入口。Creator CLI 日志按项目规则显式保留并记录构建来源。

## 7. 测试与验证

已保留旧 PNG 并替换两角；客户端源、Creator 3.8.8 `web-mobile` CLI 完成标记、退出码36、输出哈希及两角 native SHA 已记录。HTTP 8765 按约复用当前服务，Master 负责内置浏览器的实际交互和截图观察；当前视图相关检查仍标 `NOT_TESTED`，待收到 Master 同版观察后逐项回填 Runtime Check 与验收。目标设备/SDK/GPU/压力专项如未执行则明确 `NOT_TESTED`。

## 8. 风险与 Tech Lead Review

主要风险是未被接受的 Art 静态资源、来源 SHA 或切片映射与预期不符；在静态接受前不接入。Tech Lead 可在资源接受后依据同版构建和实际运行证据 Review。v0.4 是 Client 实现版号，不代表美术资源新版自身版本。
