# U01 五层重绘｜工具链复核 v0.2

复核日期：2026-10-08。v0.1 的 BLOCKED 审计保留原状；其后 Master 从用户提供的 [`binggandata/bggg-skills`](https://github.com/binggandata/bggg-skills) 安装了 `bggg-creator-image2psd`。本版只更新当前可用性证据，不倒填 v0.1 的首图前预签或伪称已经出图。项目 Task/Artifact Contract 要求正式产物留在游戏仓库的版本交付目录，因此本批使用 skill 的原版脚本，但正式项目目录落在本任务 `v0.2/`，覆盖 skill 的通用 `projects/` 目录建议。

## 本机实际工具

| 工具 | 本次核验 | 用途与边界 |
|---|---|---|
| `bggg-creator-image2psd` | `/Users/yuanquan/.codex/skills/bggg-creator-image2psd/SKILL.md` 实存，SHA-256 `dbcac3129942b9f92086a7e19c6f2ec825b9c28944402cd041e901d824028992`；`scripts/image2psd.py` SHA-256 `af7217e0f3dad1edaf7eb4017c717cc49c6ce45d35be88a00c0d2f284b390ebd`；同目录 `LICENSE` 为 BGGG 2026 MIT。 | 原版 `assemble` 从多张同画布 RGBA 图片写有层名/alpha/预览的栅格 PSD，不依赖 Photoshop；脚本只用于本地制作，不进入游戏包。不能产生原生笔触、智能对象或天然补洞。 |
| Python 环境 | 系统 `python3` 3.9.6；Pillow 11.3.0、NumPy 1.26.4 已实测可导入。 | 运行 bggg、检查 PSD/PNG；不以自写 PSD 转换器替代指定 skill。 |
| 内置 `imagegen` | 已读取当前 `imagegen` skill；正式制作拟使用内置图像生成/编辑工具。 | 先重绘完整场景代表样张，再以同一新图作编辑目标，逐层提取、补底并保留图层原位。工具输出尺寸/alpha/风格一致性尚未实测，首图后必须核验；不能将平图直接冒充多图层 PSD。 |

## 3840×1024 临时能力测试

仅用旧已批四张 2172×724 PNG 作**临时工具测试**，在 `/private/tmp/u01_bggg_preflight_z8z8n90q/` 生成测试 manifest、PSD、预览和四张测试层图。测试 manifest 将旧图 `fit: stretch` 到 3840×1024，**仅为验证目标画布写入能力，拉伸图不是正式新画、不用于交付，也不能证明画质**。原版 `assemble` 退出码 0，摘要给出 3840×1024、4 层；Pillow 回读 PSD 格式及合成尺寸为 3840×1024；只读解析 PSD 层记录数为 4，另存四张全画布 RGBA 层均为 3840×1024。测试 PSD SHA-256 `e849954b8e9c6f9daca7ee3fdce9a7f40172a4022596d1fed6f98c7078a6ff72`。命令、摘要、回读和层 alpha 范围见本目录 `evidence/TOOL_TEST_REPORT.json`。

测试证明当前本机可调用指定 skill 写入并读回目标尺寸的多栅格层 PSD；没有用 Photoshop/Photopea GUI 打开验证，也未测试真实五张新图的合成、位置精度、透明安全或运行性能。正式资源首图前仍需 Art/Tech 对同一 `PREFLIGHT_PLAN.md` 预签。imagegen 输出若不能保留构图、清晰度、alpha 和层位置，应停在代表样张阶段修订预案，不以拉伸旧图或单平图补交。
