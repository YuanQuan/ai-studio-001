# 栏杆已批切片接入概要 v0.1

## 目标与范围
将用户已批准的左右栏杆 front PNG 原位替换进 Sakura v03 示例工程，保留稳定路径、PNG 尺寸、现有 `.meta`/UUID、`trimType: none`、实例布局与所有业务逻辑。只为 U01 导出正确性更新 `sakura_v03_layout.ts` 两个 front 原型各自的 `sha256` 与 `artPath` 四个来源字符串；不改其他字段或资源。

## 复用与结构
复用既有 `sakura_v03_layout.ts` 资产原型、U01 布局导出器、共享 U00/U04 场景及 Creator 3.8.8 `web-mobile` UnitSamples 构建入口。无新增组件、Prefab、依赖或运行逻辑。

## 协议、平台与性能
不涉及网络/API/服务端或平台 SDK。仅替换既有两张 225×177 纹理，不新增节点、DrawCall、动画、Update/Timer 或运行时分配；保持资源加载与释放路径不变。本轮不做目标设备性能测量。

## 验证与风险
备份原 PNG 与 meta 并记录范围 SHA；核替换图与已批 Art PNG 字节相同，meta UUID/尺寸/trimType 不变，源码差异仅四个授权字符串。将当前工程 assets/settings/profiles/package.json 复制到新的 `/tmp` 隔离项目，以 Creator 3.8.8 构建当前 `web-mobile` 输出并经 loopback HTTP 提供实际产物。Client 负责来源、导入与构建证据；Master 在 Codex 内置浏览器检查 U00 栏杆边缘/遮挡、U01 导出/重置重入与 U04 共享场景，实际运行效果仍待用户审阅。Tech Lead 复核资源身份、来源登记例外、构建和导出一致性。
