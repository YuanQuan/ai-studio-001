# U00 用户参数基线修订概要 v0.5

## 范围

按用户提交的 `U00_ENTITY_LAYOUT_FEEDBACK_V0_3` JSON 更新 U00 六家店铺脚点及逐店 baseline scale；顾客数量保持 3、每名初始 scale 为 0.28。调整仍为临时预览，恢复和离开后重进均采用本次 baseline。

## 复用与影响

只复用并修改 `UnitSampleGallery` 现有常量和 baseline 数组。店铺 ID/顺序、既有顾客适配、调整控件、资源、场景、Prefab、网络/API和正式玩法均不扩展；不新增依赖。

## 验证范围

静态核对用户 JSON 与源码、TypeScript 检查、Creator 3.8.8 构建及 HTTP/IAB 两视口运行。Creator管理员启动在本轮受 Windows 启动错误阻塞；该部分保留 NOT_TESTED/BLOCKED，不用旧 v0.4 运行证据替代。
