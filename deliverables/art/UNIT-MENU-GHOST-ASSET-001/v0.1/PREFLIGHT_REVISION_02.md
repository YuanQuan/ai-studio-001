# 本批第三次出图前修订签认｜图集由 1024×1024 改 1024×512

任务 `UNIT-MENU-GHOST-ASSET-001`，v0.1 修订签认 02；2026-10-03。第二轮首个右向三分之四脸母版及所有输出已冻结在 `audit/round1/`。原始双签与 REV1 双签分别见对应 `ART/TECH_PREFLIGHT*.json`；本次只签**下一次真实图集重打包**。

## 真实尺寸证据与预估收益

第二轮 `audit/round1/frames/FRAME_MANIFEST.json` 登记 23 帧、各自实际 alpha bbox 与 4px padding 后矩形。按脚本当前 shelf 排列，`max(paddedRect.x+paddedRect.width)=981`，`max(paddedRect.y+paddedRect.height)=477`。因此直接沿用相同矩形和坐标，一张 `1024×512` RGBA8 可容纳全部 23 帧，右边剩 43 px、底边剩 35 px；不会因高度裁帧。最大单帧 bbox `112×152`。逐帧 bbox 总面积 `328,970 px²`，新图集面积 `524,288 px²`，bbox 面积比约 62.7%；可见 alpha 像素 `223,430 px²`，约 42.6%。压缩 PNG 文件大小不能代表 GPU 占用。

RGBA8 基础量从 `1024×1024×4=4,194,304 B (4 MiB)` 降至 `1024×512×4=2,097,152 B (2 MiB)`；节约 2 MiB 基础纹理量。真实 GPU 占用还受 mipmap、压缩、回退、上传副本/解码源、平台纹理限制影响，Creator 3.8.8 与目标机均 `NOT_TESTED`。一页仍不保证一 DrawCall。

## 变更边界与再次核验

- **只修改**导出脚本图集高度常量与相应 atlas 元数据/清单计算；源 SVG、逐帧动作参数、23 张原方向 PNG 的像素/哈希、板凳与座点、预览的视觉内容、Node/sharp/libvips、普通透明材质、4px padding、源/授权范围均保持第二轮原状。重跑可能使相同 PNG 再写出，但需逐 SHA256 与第二轮封存帧相等。
- 导出后确认新 `sprites/ghost_atlas.png` 元数据为 `1024×512`、atlas rect/trimOffset 与 `audit/round1` 完全一致，23 帧逐一 hash 相等，padding 无邻帧污染；GIF/十格仍逐项复看。若任何 frame rect 超出新页或输入像素改变，停止并重新签认。
- `ART_PREFLIGHT_REV2.json` 与 `TECH_PREFLIGHT_REV2.json` 均 `APPROVED` 之前，不更改脚本或运行导出；旧 PRE/REV1 签字不自动覆盖纹理尺寸变化。最终使用纹理上限/格式、DrawCall、帧时间、左右方向在小屏辨识与正式 Creator 导入仍需后续测量。
