# U01/U02 回归记录

- U01 与 U02 在本轮开工前均有并行未提交改动。本轮未更改 U01 镜头控制器、U02 状态/Adapter/View、原有 Scene 引用和图片。
- `UnitSampleGallery.ts` 在既有 U01/U02 菜单上增加 U03 入口；菜单仍用同一 `activateMenuEntry`，进入时清空菜单项，避免同一物理输入在全局鼠标与节点触控两路重复打开。
- R3 Creator Web 包 `apps/client/build/u03-shop-client-r3-web-mobile/`（builder task `1791356044228`）在 390×844/720×1280 限定浏览器冒烟中：U01 四层场景可见，放大和重置按钮有响应；U02 游客可见，walk 与帽子穿卸有响应。U03 返回菜单和重入 01 已见。
- 可追溯静帧为 `evidence/r3_iab/390_menu.jpg`、`390_u01.jpg`、`390_u02.jpg`、`390_u03_reenter_01.jpg`；文件扩展名现为 `.jpg`，与 JPEG/JFIF 编码一致。尺寸、SHA-256 与字节数见 `evidence/R3_IAB_EVIDENCE_MANIFEST.json`。静帧可证明呈现状态，不能单独证明按钮响应时序。
- U01 缩小边界、拖动全程/手势隔离、U02 四动作/三槽全组合、短屏滚动、真实触控、兼容鼠标去重与高 DPR 均未完整复核，保持 `NOT_TESTED`，不能以本次冒烟判完整回归 PASS。
