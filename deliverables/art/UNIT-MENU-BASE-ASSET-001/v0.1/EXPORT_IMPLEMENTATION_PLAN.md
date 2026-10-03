# 空背景分层导出实现草图（出图前文字说明）

与 `PREFLIGHT_PLAN.md` 同版，供 Art/Tech 审核制作可行性；**此文件不是图片，也不越过 Tech 出图门禁。**

1. `source/street_base_master.svg` 采用一个 `3072×1024` 可编辑 SVG。公共渐层、石材、云形、水纹及每张拟导出静态纹理都在 `<defs>` 中定义有名 `symbol`，完整场景布局通过这些 symbol 的 `<use>` 组成。桥后/前和栏杆后/前使用不同 symbol，保证独立图像。一个 symbol 只代表一份真正像素源；街面的重复在布局与 `LAYER_MANIFEST.json` 中用 placement 记录，不重复烘焙相同纹理。
2. `tools/export_layers.js` 首先核同批 `ART_PREFLIGHT.json`、`TECH_PREFLIGHT.json` 的 Task ID 与 `APPROVED`，随后从母版中选择对应 symbol 在其原生尺寸单独栅格化为 `layers/<ID>.png`，透明层保留 alpha，天空底色为完整不透明渐层。工具固定 Node v22.12.0 + sharp v0.35.4 / libvips 8.18.6；不从旧概念图读取像素。
3. 16 个唯一纹理 ID：`sky_gradient`、`moon`、`cloud_a/b`、`distance_a/b/c`、`ground_full/half`、`water_river`、`water_branch`、`bank`、`bridge_back/front`、`rail_back/front`。各原生尺寸严格按 `PREFLIGHT_PLAN.md` 候选表；纹理总 RGBA8 基础量 8.4375 MiB。若 symbol 实际宽高与签认表不一致，脚本直接报错而不继续导出。
4. `layers/LAYER_MANIFEST.json` 是运行组装清单：每张唯一纹理的 `assetId`、源 SVG hash、文件 SHA256、`width/height`、`alphaBBox`、世界坐标和裁切 `sourceRect`、复用次数、遮挡层序、参考 anchor。布局从左/中/右等 placement 重用同一个纹理文件；半块石地用独立源，河岸/栏杆遇桥口可由 SpriteFrame sourceRect 裁成半段，不能用遮住通水口的整段贴图。
5. `preview/empty_scene.png` 必须从**实际导出的 16 张 PNG 与清单 placement**重新合成，而不是直接另画一张概念效果图；这样预览检查与未来 Client 层组装同源。`preview/layer_occlusion.png` 在同一画面中半透明强调桥后/前、栏后/前区而不新增游戏资产；可另输出 portrait 左/中/右极限镜头裁图做静态边界佐证。
6. 导出后校验 SVG/PNG SHA256、实际 alpha bbox、接缝、单孔拱透明、支流与前河连通、铺地图案重复痕、16 张尺寸/总 RGBA8；不满足即进入 Art/Tech 重评。Cocos Creator 3.8.8 实际 SpriteFrame/Prefab 和目标设备镜头、性能、运行遮挡由后续 Client/QA 完成，仍标 `NOT_TESTED`。
