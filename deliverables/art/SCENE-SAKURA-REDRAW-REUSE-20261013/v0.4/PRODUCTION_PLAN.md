# v0.4 桥栏杆前景无损拆层制作方案

批次 `SCENE-SAKURA-REDRAW-REUSE-20261013/v0.4`。用户本轮指令即此局部改动的 Gate1 范围授权，见 `USER_REVISION_SCOPE.json`；Art/Tech 在首张正式图片或 PSD 输出前对本方案同批预签。本方案遵守 `rules/visual_production_contract.md` 与已批准 `rules/visual_fidelity_compute_contract.md` v0.1，延续 v0.3 已冻结效果。实际切片须另送用户 Gate2；之前不进入 Client 正式工程。

## 基线、范围和预算

- 冻结 v0.3 PSD `source/scene_sakura_reuse_master.psd`，SHA-256 `f4d01b7c7048c1ad3f5aeeb58af6801e99992728dcb60bfd3c7ca5f236e3252e`；原桥半幅 `exports/tex_sakura_rr_bridge_half.png`，1536×512，SHA-256 `4168180e2d02b7ad897e4cc5fa74c20c00c32f353d65dfe2088bfb88f2c66f0a`。冻结全景与 PSD 在 v0.3；本批独立写入 v0.4，不回写旧版。
- 零 imagegen，沿用总预算 15/15。只对原桥半幅的桥上栏杆、附属灯柱和原有暖光作人工点选遮罩。桥面/街道/桥拱/桥脚以及水、岸石、街栏链条和其余 17 PNG 不动。用户参考只定语义边界，不成为生产像素。
- 原桥半幅左实例 `(0,512)`，右实例 `(1536,512)` 且水平镜像。栏杆预计限定原半幅 `x≈1235..1535, y≈34..286`；此为遮罩操作上限而非矩形裁切线。前景 PNG 的最终紧裁框由人工 mask 的实际非零 alpha 自动求出，并在 `CUT_MANIFEST.json` 记精确半幅 bbox `[x0,y0,x1,y1)`、裁后尺寸、左实例位置 `(x0,512+y0)`、右实例位置 `(1536+(1536-x1),512+y0)`、镜像方式。若真实轮廓需超出上述预计区，先回到本预案复核。

## 切层和前后顺序

1. 在原桥半幅原分辨率上沿**桥上栏杆和灯柱的实际轮廓**人工布点。分别圈定低处压住桥面边缘的栏杆、随拱形起伏的饰板、圆顶柱、两盏灯及暖光外缘；灯笼 glow 保留原 alpha 与 RGB，不重算、不抹平。栏杆内侧的可见桥面不选前景；前景下边沿随石材缝和遮挡线走，不用一条水平线切过桥面。桥拱的券石、拱洞、桥脚花石、桥面原层留 body。
2. 使用二值语义 mask 分配既有 RGBA：front 为原像素乘 0/1 mask，body 为原像素乘其补集；同一非透明源像素只归一层。mask 边界只沿原半透明像素的外沿走，避免二次插值、发光叠加或黑缝。两层在原位按 body→front 重组须逐像素 RGBA 等于 v0.3 桥半幅，连 RGB 的透明像素差异也单独记录。
3. body 仍用原桥两个实例 ID 和原偏移/镜像，在 L03 保留桥实体；front 用独立资产 ID，左右两实例置于游客/店脚之后、街栏链条及其它已定前景顺序按遮挡目标核对。L04 仅放桥栏杆前景；沿岸 `stone_chain_rail_l/r` 继续从 v0.3 PSD 原层复用，不另放入 front。避免链条双描和镜像中线接缝。
4. 原 PSD 全画布 `bridge_l/r` 各替换为 `bridge_body_l/r` 与 `bridge_front_l/r`，front 在原位、全画布，完整母版仍为 3072×1024。正式运行 PNG 仅紧裁 front；body 保持 1536×512（源偏移不变）。其它 PSD 层与 v0.3 字节一致。以 `bggg-creator-image2psd` 的 `assemble` 在本 v0.4 目录输出 PSD 与预览；所有源层/切片/合成都在本目录留档。该 PSD 是现有栅格拆层的可编辑母版，不宣称被遮住桥面的独立内容已恢复。

## 可复核门槛与交付

- 检查原桥半幅与 body+front 的 decoded RGBA 0 差、body/front 非零 alpha 交集 0；v0.3 全景与 v0.4 无游客重组 decoded RGBA 0 差；PSD 预览与切片重组同尺度画面 0 差。17 张未变 PNG SHA 逐个一致。
- 核前景独立图不含桥面、券石、拱洞或桥脚；灯笼 bloom 不被硬切；圆标章、石柱、灯、桥中心镜像接缝在同尺度全景与局部特写均不破损。用标明“游客/店脚占位”的几何矩形分别示意 body→实体→front 前后关系；只栏杆区域因实体遮挡顺序可变化，静态空场景应零差。
- 交付实际 body/front PNG、全画布 PSD、图层源、`CUT_MANIFEST.json`、`PSD_MANIFEST.json`、`FILE_VERIFICATION.json`、完整环境重组、桥局部特写、遮挡示意、ZIP 和中文用户审核说明。导出/打包路径、哈希、验收及限制写入交付 JSON。静态验证不构成 Cocos 实际运行/性能/QA 通过。

原 v0.3 平面源并未绘出被栏杆遮住的桥面：front 被游客遮挡或前移时，原本隐藏的道路像素不可能凭拆层得到。本批不补画、不重绘该区域；若实际游客移动暴露空洞，记录并由后续获批方案处理。当前没有六店，示意矩形不视为正式资源。
