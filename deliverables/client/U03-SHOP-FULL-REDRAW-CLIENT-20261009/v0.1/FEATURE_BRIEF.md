# U03 六店整体重绘资源替换概要

## 范围与复用

按已批准 `U03-SHOP-FULL-REDRAW-20261009 v0.2` 清单替换 U03 六店现有 12 张 body/sign PNG。清单中五店逐字节继承 v0.1，理发店采用正面视角修正版 v0.2。保留现有正式路径、`.meta`/UUID、Prefab、两片层级、脚点与稳定店铺 ID。

U00 已实例化同一组 `UnitSampleGallery.shopPrefabs`，直接引用这六个正式 Prefab 与相同 PNG；因此替换 PNG 后 U00 自然显示同一获批版本。此次不修改 U00/UnitSampleGallery 代码、场景或布局，不新增玩法逻辑、接口、依赖或资源。

## 实施与影响

先将旧 PNG 备份并记录源/旧/新 SHA-256 与现有 meta UUID，再按清单复制并核哈希。运行 Creator 3.8.8 Web Mobile 构建，随后由 Master 使用内置浏览器检查真实 HTTP 产物。文件仅改变既有贴图内容，尺寸沿用 1024×1024；不改变节点数或持续运行开销。目标设备性能不由 Web 构建推断。
