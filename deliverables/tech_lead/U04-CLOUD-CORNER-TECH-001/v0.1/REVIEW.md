# U04 内部祥云资源技术评审 v0.1

结论：**技术评审通过**。本结论覆盖获批 v0.4 图的同源切片、既有 U04 两角资源替换、Creator 3.8.8 当前 Web 构建和同版内置浏览器画面。正式 Artifact 用户审批仍由 Master/Producer 按流程记录。

## 来源与首图前预签

- 获批源图 `deliverables/art/U04-CLOUD-CORNER-FIT-001/v0.4/cloud_corner_fit_preview.png` SHA-256 为 `9fc3c8e4312975516d8ca84431cd937b1407fc32215c3ef8b0954dfe57b0d593`。首图前 `TECH_PRESIGN.json` 锁定 Art `PRODUCTION_NOTE.md` SHA `d8b1645afc837edce37cb07f16cd94eaa5032475747052be0a1f3d7dbbe192fe`、`ART_PRESIGN.json` SHA `5df391e6c74add2d46e3773689389e0ec48f21ab8213ff404ed6a958f1fad38c`。
- 仅保留源图可见的金线、内部卷纹、金线围合的深蓝云体及短接框段；左下人物遮挡处透明、不补画，右上排除“放大面板”按钮。源窗口各 167×125，按 1672→1280 显示比例导出 128×96。窗口、遮罩语义、工具、尺寸或范围若变化，需重新预签。

## 实图与资源身份

- 两张导出图均为 128×96 RGBA：左下 SHA `4ef91cb8a1cdd4b81a8a3862d4fd6ad95430a7d91fcc1e0327deb1f1e4dd2174`，右上 SHA `e3e79754e8f7f970c2262310e01487e51db6d99258b16df849f8189f8d23a62d`。独立核对全尺寸角花层中所有 alpha 非零像素的 RGB 与获批源图同坐标逐像素相同；右上 alpha 从源窗口 x=85 起，未混入左侧按钮，左下 alpha 范围避开人物。`EXPORT_MAP.json` 与 `source/mask_metrics.json` 中哈希、裁切和 alpha 范围对应实图。
- PSD 为 1672×941 三层，隐藏的完整参考层 flag=2，两角为可见独立栅格层；ImageMagick 可读。它保留源像素与图层编辑能力，遮挡下内容不可恢复；本轮未在 Photoshop 中打开。
- Client 两张正式 PNG 与 Art 导出字节哈希相同，既有 `.meta` 未改，原 image/sprite-frame/texture UUID 保持。左下 UUID `fbcb6ab4-7018-4428-90d5-72ad32897175`，右上 `75064b51-dd6c-4960-83c4-2fd6b959fd9f`。SpriteFrame 仍为 128×96 全画布、四边 inset 0；面板九宫格与人物资源未在本任务改动。

## 当前构建与运行

- Creator 3.8.8 `web-mobile` CLI 当前任务日志于 2026-10-11 13:19:56 +08:00 记录 Finished；成功通道的 CLI 退出码为 36。当前 `apps/client/build/web-mobile` 中两个 native PNG 哈希与 Art/Client 实图相同；`index.html` SHA `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`、dialogue bundle config SHA `294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`，与 Client 本轮构建记录一致。首次沙箱启动在构建前异常退出，未作为成功依据。
- `deliverables/client/U04-DIALOGUE-CLIENT-001/v0.4/evidence/HTTP_RESOURCE_IDENTITY.json` 记录同一 HTTP 服务直连 `index.html`、bundle config 和两张 native PNG 全部返回 200，响应 SHA 分别与上述当前构建和 Art 导出一致；这把 IAB 所访问的资源身份与本轮构建连接起来。
- Master 对该构建的 HTTP/IAB 观察记录在 `deliverables/client/U04-DIALOGUE-CLIENT-001/v0.4/evidence/MASTER_RUNTIME_OBSERVATIONS.json`，实际截图在同目录 `runtime_cloud_*.jpg`。我复核默认画面及 1024×384、384×192 面板截图：两角朝向、固定形状与短接框可见，人物前景在角花上方，面板伸缩时角花未被拉长。记录显示 1280×720 画布、90/90 资源组合无失败、三轴切换与连续八次切换、三档面板尺寸及返回重入通过，控制台 warn/error 为空。90 组合耗时是切换流程用时，不能解释为帧率或 GPU 性能。

## 限制与后续

- 目标设备、原生平台、GPU 驻留、FPS、内存与长时压力为 `NOT_TESTED`；没有据静态哈希或 Web 构建推断这些指标通过。
- 源图是不透明平面图，边缘 RGB 含原背景的抗锯齿混色；其分层精度低于原生透明母版。当前同尺度面板重组与实际 Web 截图可核视觉结果；若用户指出可见差距，沿已批视觉语义修订资源并重新核同版运行。
- 本次技术 Review 无必须阻断接入的 Action；正式版本仍待用户对本轮交付物的流程审批。
