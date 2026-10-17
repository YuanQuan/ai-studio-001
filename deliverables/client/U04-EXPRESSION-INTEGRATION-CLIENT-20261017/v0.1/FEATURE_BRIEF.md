# U04 v0.3 六阶段表情接入概要

## 范围与复用
只将获批的 MT_S2、AT_S0、AC_S0、AJ_S2、AD_S0、XJ_S0 六组的 30 张 face 及各自 base/front 共 42 张 Art v0.3 manifest 指定 PNG 原字节覆盖到现有稳定路径。沿用现有 dialogue bundle、图像 `.meta`、Image/SpriteFrame/Texture UUID、`u04_layer_export_map.json` handoff_normalized 几何和 `UnitSampleGallery.applyU04Geometry`，不改 Gallery、framework、场景逻辑或其他单元资源。

## 几何与结构
每组保持 `base → 恰一态 face → front`。face/front source rect、pivot、offset、base export 尺寸和缩放沿用当前 handoff_normalized；Tech Lead 已逐组六组复核兼容。AD/XJ 使用已批准 native 192 图，依现有 0.75 几何显示，不从 PSD 重导。

## 构建与验证
使用本机锁定 Creator 3.8.8 CLI 和现有 web-mobile 构建配置，新建隔离的当前工程快照与独立 buildPath；记录快照文件/hash、命令、日志、Creator 结束码、输出身份及 loopback HTTP 入口。Client 留出运行待核项，由 Master 在 Codex 内置浏览器完成目标态、30 态及 90 态巡检和连续切换。

## 风险与边界
保留既有工作区脏改，快照纳入实际构建所需当前源码/场景/配置并登记身份。此单元示例不进入 QA Agent 流程；Web 运行不代表目标设备性能或其他平台验证。
