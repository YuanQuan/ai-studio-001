# 单元示例 1｜现有四层切图 Gate2 只读核验预案 v0.1

日期：2026-10-05。Task：`UNIT-MENU-FOUR-LAYER-CUT-001`。此预案只覆盖**当前已存在**的 PSD、原 PNG、全画布层 PNG 与 PSD 回读重组图。用户已明确批准本图组 `UNIT-MENU-FOUR-LAYER-PRODUCTION-PLAN-001 v0.1` 的 Gate1，并明确要求**不改动美术资源**、不要求桥与月亮首屏同见。旧 `UNIT-MENU-BASE-ASSET-001` 空底板任务已取消；其历史 Gate1 不继承到本批。当前 Gate2 具体切图及效果尚未获批。

## 1. 唯一输入与批次锁定

路径前缀：`deliverables/art/moonlit_psd_20261005_v2_raw/`。以下 SHA-256 为本次只读复核的**文件字节哈希**；各 PNG 的字节哈希不同不等于像素不同。`layer_sources/` 为用户选定四张原 PNG 的逐字节拷贝，来源链与用户原图及商用改编权声明见已批准方案的 `RIGHTS_AND_SOURCE.md`。本预签不声称已取得生成服务条款快照或独立完成第三方相似性检索。

| 类型 / 后→前 | 相对路径 | 尺寸与模式 | SHA-256 |
|---|---|---|---|
| PSD 母版 | `moonlit_four_layers.psd` | 2172×724；四层 | `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed` |
| 01 天空原 PNG | `layer_sources/exec-94477409-2d97-4ffe-94ac-7ed6b13aa590.png` | 2171×724；RGB | `15b14530b2d8b3c18e80669fc444e23103244a7bfe9ad7d1e2a9646c8db5d73e` |
| 02 山峦原 PNG | `layer_sources/exec-933386cf-d4a2-473b-a3d8-e9c943399806.png` | 2172×724；RGBA | `a7d0d0c187563dc64e980e07e694c2e1013e8f8151ebe50623d031ca85f6f632` |
| 03 地面原 PNG | `layer_sources/exec-23db4183-120a-4142-8aea-afcbf4370303.png` | 2172×724；RGBA | `a033353e150ab50be3666af996cb9373e558283b272b72462bc4539b09b0e2cb` |
| 04 桥栏原 PNG | `layer_sources/exec-c82fb659-2bf7-414a-a322-2e532ea7a749.png` | 2172×724；RGBA | `de8815750090ffe8f056b109a5baf401a8ed5eae6ad7483ce554f25b8822fff5` |
| 01 天空全画布层 | `psd_full_canvas_layers/01_01_94477409.png` | 2172×724；RGBA | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` |
| 02 山峦全画布层 | `psd_full_canvas_layers/02_02_933386cf.png` | 2172×724；RGBA | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` |
| 03 地面全画布层 | `psd_full_canvas_layers/03_03_23db4183.png` | 2172×724；RGBA | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` |
| 04 桥栏全画布层 | `psd_full_canvas_layers/04_04_c82fb659.png` | 2172×724；RGBA | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` |
| PSD 回读重组图 | `overall_from_psd.png` | 2172×724；RGB | `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd` |
| 既有组装预览 | `assembly_preview.png` | 2172×724；RGB | `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd` |

PSD 与四张全画布层图统一以画布左上角 `(0,0)` 为原点，`fit:none`、未去背、普通混合、不透明度 1。后→前层序为天空月云星 → 山峦远建筑 → 地面树木右廊 → 桥栏杆前方景物；横向移动倍率对应 `0.3 → 0.8 → 1 → 1`，四层统一缩放。天空原图仅 2171 列；全画布层与 PSD 的最右第 2172 列透明，并非已补画的天空。`validation.json` 记录 PSD 回读合成与现有组装预览逐像素一致；正式 Gate2 仍要重新只读核验交接文件，不能直接把历史验证记录当成本轮 Art/Tech 实图结论。最初 `original_reference.png` 不是当前四层 PSD 的逐像素验收目标。

## 2. 只读核验与证据范围

在 **Art 与 Tech 对本文件同版签认之后**，只读取和计算现有文件：重新核 SHA-256、PNG 宽高/通道、PSD 四层顺序与 `(0,0)` 原点；比对四张全画布 PNG 和 PSD 回读层的可见 RGB、alpha、半透明像素与边界；按普通 alpha 合成核现有 `overall_from_psd.png`。单列缺口、透明像素隐藏的 RGB、纹理过滤时可能造成的颜色泄漏须单列记录，不以整体 RGB 相同掩盖。已知 PSD 回读记录中各层 alpha 范围为 0–255；天空有效界限 `(0,0,2171,724)`，桥栏层 `(0,79,2172,724)`；这些是历史记录，尚非本批动态画面 PASS。

允许为**审阅证据**捕获既有 PSD/PNG 在查看器中的截图、现有隔离网页的竖屏截图与拖缩录屏，不覆盖源文件，不作为新的正式切片或修改版。目标视口是 **720×1280**，另测 **390×844**；每个视口含桥区初始、左端、右端、候选缩放 `1.00×` 与 `1.80×` 的组合，以及连续拖动、缩放往返。倍率仍为候选，正式运行范围待后续决定。网页/数学验证与 Creator、目标设备运行分开记录，后两项尚为 `NOT_TESTED`。如截图/录屏工具会修改 PSD、PNG 或正式导出设置，停止该方式。

Art 视觉观察逐项依据已批准 `VISUAL_ANCHORS.md`：桥/栏杆与细链、前方河面纸船和烛光，树冠/柳叶孔隙与右廊门洞，山缘/远建筑，月云星与天空；重点看桥灯、右廊灯的暖晕及半透明边在冷蓝背景和移动采样下有无背景色脏边、断裂、抖动或露空。光晕应保持现有视觉，不以抹边作为默认修复。静态图只能证明静态画面；连续运动中的可见质量需相应视频证据，未取到则标 `NOT_TESTED`。

## 3. 面积、预算与 Tech 待签项

四张全画布层 PNG 各 `2172×724 = 1,572,528` 像素，合计 `6,290,112` 画布像素；若四张均解码为 RGBA8、各一份、不计 mipmap/对齐/缓存，约 `25,160,448` 字节，即 **23.995 MiB**。按三张 2172 列加天空原图 2171 列的原始内容宽度计算则为 `6,289,388` 像素、`25,157,552` 字节，即约 **23.992 MiB**；两者相差透明列的 2,896 字节。此数字只是 CPU 侧简单像素面积估算，不是实际显存、压缩大小、峰值内存或性能 PASS。2172px 宽超过 2048px 纹理限制的设备能力假设，目标设备支持、SpriteFrame trim/offset/pivot、过滤与颜色空间、压缩回退、图集、DrawCall、过绘和帧时间均待 Tech 与 Client 实测/讨论。不得为适配而自行降采样、裁切、分片、填天空列或改 alpha/RGB。

## 4. 预签边界与停止条件

Art 本次只签认上述**已有文件的只读审查范围、视觉锚点与取证方法**，等待 Tech Lead 对同一 `PREFLIGHT_PLAN.md` 哈希独立签认。Tech 签认之前不进入本批切图实图审查，不提交 `CUT_MANIFEST.json`、最终 `ART_REVIEW.json` 或 `DELIVERABLE.json`，不把现有候选层图称为 Gate2 PASS。Art/Tech 双签后，仍须实图逐锚点 Art Review、真实贴图技术 Review、Client 切图讨论及 Master 独立看图；四方证据通过后才可呈用户 Gate2。Gate2 获用户批准前不得正式接入 Creator。

若核验发现需要改变任何 PSD/PNG 像素、透明边、尺寸或输出方式，立刻停止并向 Master 说明具体图层、坐标、原因、预期效果及竖屏/性能影响，先向用户说明并获新决定；当前用户的“不改动美术资源”始终有效。
