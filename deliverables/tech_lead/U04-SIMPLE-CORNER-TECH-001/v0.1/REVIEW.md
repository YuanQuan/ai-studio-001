# U04 极简角饰技术预签 v0.1

**结论：同批首图前技术预签通过。** 核对对象是 Art `PRODUCTION_NOTE.md`（SHA-256 `1eca7a6889207689a5131f62a8b25a0aedb296b7073984485a267537c4a89aa3`）和 `ART_PRESIGN.json`（SHA-256 `54e190d9d9c7647a01ed3e18f1c1a582e8594f6944aca70a75b8acdf0b1f0aad`）。原图 SHA-256 为 `821f0420d989d1914560a78569fe4cb570f319f1d37be90cc75f5f200e71e043`，与已批 v0.3 图一致。

两角分区互不重叠，统一按 `70/293` 等比缩小并放入各 128×96 真透明画布，左下与右上分别角锚。PSD 需保留完整画布参考层和两个原位区域层。两张 RGBA8 画布理论展开量合计 96 KiB；图集、驻留、DrawCall 均待实际导入和运行核验。

现有客户端贴图路径及 `.meta` 均保留：左下 UUID `fbcb6ab4-7018-4428-90d5-72ad32897175`，右上 UUID `75064b51-dd6c-4960-83c4-2fd6b959fd9f`。固定角节点仍为 128×96，不调整面板及人物层级。Art 交实际 PNG、PSD 和 `EXPORT_MAP` 后核尺寸、alpha、源像素关系及 SHA；Client 接入后再核导入、构建和真实运行画面。本预签不把这些未来检查记为通过。

## 实图及静态接入复核

Art 两张 PNG 与客户端正式路径 SHA 逐字节一致：左下 `d23f33279807d0e34d951d9e7504d35574aee07a9bf4530378bfd2863415da4b`，右上 `6b0998e92425499ee78c791d5a8f3ba8cab3eacfeb3df6d05425c69bf269216f`。均为 128×96 RGBA；alpha bbox 分别为 `[0,26,85,96)` 与 `[62,0,128,53)`。两个全画布源层合成后与批准原图在 alpha≥2 的全部像素一致，仅舍弃 21 个 alpha=1 离散点。客户端 `.meta` 未改，保留上述 UUID。代码差异仅把两角 Sprite 设为 `CUSTOM`，并以 `bottom+48` 和 `bottom+panelHeight-48` 锁定真实面板两角；九宫格与人物布局逻辑未改。Creator 构建与内置浏览器运行结果见下节。

## 构建与运行终审

本版 `UnitSampleGallery.ts` SHA-256 为 `1cebecc0e108c7e76e8253855eecd26df885b56dfe31c2e0415a68ddba47ad09`。Creator 3.8.8 `web-mobile` 构建日志有 `build Task (web-mobile) Finished in (7 s)`，CLI 退出码 36；当前 `index.html` SHA 为 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`，dialogue config SHA 为 `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`。129 项资源图像 SHA 与交接清单一致，工作区 dialogue 资源差异仅两张角饰 PNG。

Master 的同版 HTTP/IAB 观察见 `deliverables/client/U04-DIALOGUE-CLIENT-001/v0.3/evidence/MASTER_RUNTIME_OBSERVATIONS.json`：默认与竖屏角饰贴合正确，384×192、768×256、1024×384 三档面板无角饰拉伸，九宫格四边 48 保持；90/90 组合零失败，三轴保留、8 次连切、返回重入及当前控制台记录通过。我复看默认、竖屏和 384×192 截图，未见角饰裁断或漂移。目标设备、SDK、GPU 驻留、DrawCall 与压力性能仍为 `NOT_TESTED`；6624 ms 仅为 90 组合巡检耗时，不是性能基准。
