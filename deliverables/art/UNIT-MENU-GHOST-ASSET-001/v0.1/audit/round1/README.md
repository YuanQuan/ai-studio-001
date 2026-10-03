# 第二轮出图审计：方向修订后图集尺寸测算

2026-10-03 依 `ART_PREFLIGHT_REV1.json` / `TECH_PREFLIGHT_REV1.json` 双签，重新绘制右向三分之四脸并导出 23 张帧、板凳、1024×1024 atlas 与预览。本目录保留**第二轮原件**，不随下一次重打包覆盖。

- `source/ghost_master.svg` SHA256：`9f160728f28827f83aaa1ae6929a923c35a3c3805ecbaf8c6c37a8d0d488c972`；亦见本目录 `frames/FRAME_MANIFEST.json` 的 `source.ghostMasterSha256`。
- `sprites/ghost_atlas.png` SHA256：`51d69e34cb41c36cb8a6de0911aa2a9ca99aa56814155de89d143987a3085f91`，PNG 文件 152,027 B，RGBA8 基础量 4,194,304 B。
- `preview/contact_sheet.png` SHA256：`4c16de69e014e6a9cdb2c6bec8de3592fe98ac7621a2fdb1b5c745fa11c56814`。左/右五态预览的近远眼、鼻口与手势方向均明显异于首轮；目标设备小屏判定仍 `NOT_TESTED`。
- 23 帧 SHA256 均唯一，最大 alpha bbox `112×152`。从本目录 `FRAME_MANIFEST.json` 的 `paddedRect` 复算，图集最右 `x=981`，最下 `y=477`；已含每个 frame 四周 4 px padding。逐帧 bbox 面积合计 `328,970 px²`，可见非零 alpha 像素合计 `223,430 px²`。

由上可见 1024×512 足以容纳当前**完全相同的** frame rect（右侧余 43 px、下方余 35 px），RGBA8 基础量可降至 2,097,152 B（2 MiB）。尺寸变更不得凭此审计直接导出，先履行 `PREFLIGHT_REVISION_02.md` 双签。首轮正面脸问题仍保存在 `audit/round0/`；两轮都不是已用户批准、已 Creator 导入的资源。
