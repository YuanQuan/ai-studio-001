# U04 极简角饰 PSD 转换记录

- 使用 `bggg-creator-image2psd/scripts/image2psd.py assemble` 将项目内源图及两张原位透明区域图写成 1672×940、3 层 PSD。项目文件均保存在本交付目录，没有写入 skill 安装目录。
- 底层 `Original reference - hidden` 保留批准的 v0.3 原图完整像素；其上的 `Bottom left - original pixels` 和 `Top right - original pixels` 仅按裁区复制原像素，仍在原画布位置。制作脚本将底层设为 PSD 隐藏层，并用两个可见区域层写合成预览。无生图、重画、补洞或字体处理。
- 两角内部保持栅格像素，能独立移动、显隐，但不能在 PSD 中作为矢量路径修改形状。源图另存 `original_reference.png`，逐字节 SHA 与 v0.3 一致。裁区外只有 21 个 alpha=1 离散噪点未进入可见区域层；无 alpha≥2 像素被遗漏。
- `PSD_VALIDATION.json` 记录 Pillow 可读、图层数与隐藏标志、预览比较：PSD 合成与预览逐像素相同；同白底源图相比，仅上述 21 个像素有最大 1 级通道差。未在 Photoshop/Photopea 中实际打开，故其软件兼容性标记 `NOT_TESTED`。
- `EXPORT_MAP.json` 记录裁区、统一等比系数、尺寸、锚点、导出 SHA 和计划客户端路径。`preview/display_scale_pair.png` 仅将两张 128×96 真切片按原尺寸放在深色背景上展示，不能代表客户端实际运行。
