# 灯笼 Shader 例外后技术运行评审

核查时刻：2026-10-12 21:54:25 +08:00。仅只读核当前源码、Creator 库与第二次构建产物、同批浏览器截图/像素差异；未操作 Editor、浏览器、构建或 Git，未更改 Shader、UV、mask、曲线与任何图片。

## 已有结果及边界

- 用户批准的语法补丁已应用一次：当前 `lantern_lighting.effect` SHA-256 `e86347bec50486ebbd40366870c25eb4619db984d4b7a146a75385b1e9a82f0b`，与例外预期相同。Creator 重新导入后 `.meta` 为 `imported=true`、`files=[".json"]`、UUID `e334c0c0-4d86-4bc0-9edf-a44cc80dd8da`；库内载荷 SHA-256 `3ab7e5d6b7cef0632d43c14df9bda330861475f4969dc93f8d33e0fc19c0b4c0` 的 3 种片元变体均使用裸 `strength`，无 `cc_lantern`。
- 第一次 Editor 构建虽在 21:34:58 显示 Finished，浏览器实际请求 Effect import JSON 返回 404，启动停滞；这次输出仍是失败的运行证据，不能改判 PASS。第二次同配置构建日志 `apps/client/temp/builder/log/web-mobile10-12-2026 21-34.log` 记录 21:45:07 `build Task (web-mobile-001) Finished`；当前构建包 `assets/main/import/0a/0aa55be6f.json` 修改时间 21:45:06、SHA-256 `73f200ecc305aed972c19e2a2c70be92f6fdbce4eded589457b9a9961b3517fe`，包含该 Effect UUID、无实例名的 `strength` 及现有 `(1.0 - uv0.y) * 1024.0` 映射。当前包被 HTTP 加载、店铺/控件/Profiler 实际出现，说明语法与导入依赖的这一步已跨过；完整效果仍未通过。
- 第二构建的独立留档 `build/editor-reimport-build-result.json` 锁同一任务 ID `1791812092559`、当前 Effect SHA、21:45:07 UI 成功提示、`index.html` / `src/settings.json` / Effect import 产物的时间与哈希；`build/creator-editor-reimport-build.log` SHA-256 `9523a038da7e22d2d5c956f3d09b8a91ffc9e64e1a17410fd1d25e2c6fd368bc` 也含该 Finished 行。日志中的子构建脚本 `SIGTERM` 诊断不应被隐藏，因此结论仍以当前产物及实际加载交叉核对。`build/runtime-console-after-reimport.json` 包含历史首构建 13:39:55 UTC 的 404；第二次导航从 13:46:39.616 UTC 开始，13:46:41.313 出现 `[LanternPilot] runtime frame`，13:46:41.314 场景加载成功。历史 404 不能混作第二次导航的新报错；当前导航也不证明动态 ROI 正确。
- 1280×720 固定视窗、固定店铺裁剪 `[490,210,770,430]` 的 `runtime-screen-difference.json` 和四张截图已逐像素复核：播放强度约 0.93 时，店铺 RGB 变化 929 像素、最大通道差 30、屏幕 bbox `[527,255,561,289]`；暂停及复位各与同次静态基准 0 像素差。播放变化落在屋檐/屋顶，目标左灯笼中心约 `[549,306]`。因此暂停/复位回基准的这一项有当前画面证据，**动态 ROI 为 `REVISE`，整体运行不可判 PASS**。截图只验证可见 RGB，不能证明源像素和 alpha 完全回源。

## UV 定位与最小可检查建议

当前源码和构建包均以 `bodyPx.y=(1.0-uv0.y)*1024.0` 计算源图 y。本机 Creator 3.8.8 `cocos/2d/assets/sprite-frame.ts` 的未旋转 `_calculateUV()` 对全幅 rect 设 `t=rect.y/texh=0`、`b=(rect.y+height)/texh=1`，`cocos/2d/assembler/sprite/simple.ts` 将 frame UV 写入顶点；这与屏幕变化位于目标上方的实测一致，形成纵向反转的强证据。候选最小方向是先以实际 frame 四角 UV、纹理方向与原图灯笼两个以上定位点核查，再比较将源图 y 映射为 `uv0.y*1024.0` 的**单一变量**效果；同时核 mask 贴图尺寸/格式、采样边缘、trim/atlas、画面缩放。当前变化 bbox 比仅按已知非零 mask bbox 简单投影更大，故不能保证只改这一行就足够，也不能在本评审中把推断当实测修复。

本批额外语法修正已经使用，累计修正预算为 `3/3`；用户只授权 Constant 的两处补丁。任何 UV 或其他源码改动均超出这次授权，须停止该支线并由 Master 提交具体差异供用户决定，不得静默扩补丁、按缺陷重置预算或改旧账本。若只做现有证据的进一步只读定位，可继续但不能宣称动态通过。

构建配置收尾已核：`build/editor-profile-after-reimport-build.json` 中同一独立任务使用 `/private/tmp/lantern-pilot-v02-build` 和唯一 LanternPilot Scene；`build/editor-profile-reimport-restoration.json` 记录先关闭面板、仅清除本任务临时缓存。当前磁盘 `apps/client/profiles/v2/packages/builder.json` SHA-256 `657f680d65891f9488f588e1433c701e27e1b97595b14f5e6ec79bfe5c79f4e3` 与构建前快照一致，正式 `apps/client/settings/v2/packages/builder.json` SHA-256 `a3e1a8df580b6ebec15ad16c9bbef785806567bfbc093821852bb3606028e702` 不变；这只证明磁盘字节恢复，Editor 进程内构建配置缓存未核。Master 报告本批浏览器标签与 HTTP 服务已由其关闭；Tech 未操作这些进程。

Draw Call：截图中 Profiler 显示计数，但没有相同场景/条件下的可复核基线与播放增量测量，故硬限 `≤1` 仍 `NOT_TESTED`。mask 实际 GPU 格式、额外常驻纹理 `≤0.25 MiB` 也无独立测量；CPU/GPU 各 0.1 ms/帧为参考目标，当前无目标设备、采样精度和误差记录，均 `NOT_TESTED`。原 Gate2 对 mask 与同尺度 CPU 视觉候选的批准不等于当前 Cocos 动态效果批准或正式接入。
