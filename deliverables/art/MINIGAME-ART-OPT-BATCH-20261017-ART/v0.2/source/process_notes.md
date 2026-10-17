# image2psd 原像素转换记录 v0.2

本批调用 `/Users/yuanquan/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py assemble`，由项目内已获批准的76件原尺寸 RGBA8 PNG 分模块建立14个 PSD、76个独立实层。未使用 imagegen、颜色聚类、去白底、inpaint、重绘、缩放或不透明合并。各模块输入 manifest 在 `source/psd_manifests/`，PSD 在 `source/psd/`，预览在 `review/psd_previews/`。没有生成全画布单层PNG或ZIP；本批真实 PSD 层经 ImageMagick 帧读取、按库位置反向还原，再按已签框导出 `exports/`，完整帧号及映射见 `PSD_LAYER_EXPORT_MAP.md`。

旧六店、樱花和 U05 原生 PSD 只读；游客静态原生 PSD 在旧记录路径当前缺失，VFX正式帧为获批逐帧 PNG。新母版不冒称恢复旧 PSD 的笔触、遮挡背面、动态图文或动画绑定，编辑范围为每件独立栅格像素与摆放位置。每个新 PSD 是美术资源库画布，**不是运行纹理/图集**。试点10件原文件全数保留；本批仅新增shop01 body/sign及spirit_a_flame的采样修订候选，不覆盖旧批准版本。

PSD读回的 alpha 与 alpha>0 RGB 对原批准源逐像素零差。由于转换路径可能清零 alpha=0 的隐藏 RGB，导出阶段仅在裁框 alpha=0 像素用同件已批准源同坐标 RGB 回填，累计297,322像素；alpha>0 通道始终来自真实 PSD 层。每件裁框完整 RGBA 与批准源全等，原尺寸回置可见 RGBA 零差，黑/灰/白及9相位 CPU 直通双线性合成差为0。具体数值和旧3件控制见 `review/COMPARISON_REPORT.json`。PSD通过脚本生成、ImageMagick逐层可读验证；Photoshop/Photopea交互编辑和Creator/GPU运行仍 `NOT_TESTED`。

无外部新素材、字体或额外版权来源；仅处理项目原版本已获用户批准的图片。审阅图的缩放仅为联系表预览或批准场景实例显示尺度，正式裁片原像素无缩放。当前用户尚未批准本批76件具体切片；接入待Gate2。
