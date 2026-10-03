# 本批正式候选资源的来源与权利记录 v0.1

适用 `UG_GHOST_01` 与 `BENCH_01`；2026-10-03。此表跟随本批源文件、帧图、图集及板凳，供用户、Art、Tech 和未来 Client 接入复核。它是生产来源记录与初筛，**不是第三方图片授权证明或法律意见**。

| 条目 | 来源、许可/使用边界、处理 |
|---|---|
| 用户选定的第一街图 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png`，由用户作为视觉参考提供；原作者及可商业使用/改造/分发授权 `UNKNOWN`。仅抽取“非像素、平视可爱中式夜市、冷夜蓝与暖橙、木质材料”方向，不嵌入像素，不裁切、描摹、换色或机械拼贴其具体幽灵/板凳。细节见 `project/art_reference/characters/UG_GHOST_01_v0.1.md` 与 `project/art_reference/props/BENCH_01_v0.1.md`。 |
| 旧 Demo、Art v0.1 概念图 | 仅作为历史排除项，没有任何帧、板凳、图层或贴图来源；不得重命名/裁切后导入新菜单。 |
| 幽灵与板凳母版 | 本任务 Art Agent 从空白 SVG 绘制 `source/ghost_master.svg` 和 `source/bench_master.svg`；图形路径、颜色、分件及 23 帧动作参数可在源和 `tools/export_assets.js` 复核。没有外部位图、图标、纹理库或第三方角色模型。 |
| 字体、文字、Logo | 本批不含字体、字形、品牌、包装或任何可镜像文字，未使用系统字体或美术字体。未来店牌、UI 与“孟”腰牌另按各自任务检查商业使用、嵌入、分发和改造许可。 |
| 图像制作工具 | 本地 Node v22.12.0 和 sharp v0.35.4 / libvips 8.18.6 用于栅格化、打包和预览。安装包 `sharp/package.json` 的 `license` 字段为 Apache-2.0；这些工具不是游戏运行依赖，也不随 Sprite 图片/JSON 分发。若后续构建链要分发工具本身，需单独核其完整依赖许可与 NOTICE，不据本批结论自动放行。 |
| 最终输出 | 当前第三轮 SVG/23 PNG、`1024×512` atlas 与 GIF 的 SHA256 由 `frames/FRAME_MANIFEST.json` / `ASSET_MANIFEST.md` 记录；首轮正面脸问题与第二轮 1024² 图集分别保留于 `audit/round0/`、`audit/round1/`，均不作为最终候选。第三轮只改变 atlas 页高，23 帧与第二轮 hash 相同；详见 `QUALITY_REPORT.md`。 |

## 可识别近似风险检查

- **已检查**：本批没有第三方图像或字体字形进入 SVG；没有品牌符号、标志性服装/挂件或用户图逐像素拷贝。白色小幽灵、木板凳是通用类型，最终成品需结合卷形飘絮、云形下摆、右向三分之四脸、木凳比例/纹理的整体表达复查。
- **未断言**：未对全球已有角色/作品完成穷尽相似性检索；不作“绝无版权风险”保证。发现强可识别近似时停止集成、保留证据并交项目进一步审查。
- **输出前门禁**：本批原始出图、方向修订和图集缩高分别有出图前 Art/Tech 双签，实际输出后的 Art/Tech 专业 Review 亦已通过；未来每次源形体、图片尺寸或参考输入改变仍须重新签认。用户附件仍只作为权利状态 `UNKNOWN` 的研究参考。正式资源还待 Master 与用户审批，获批后再由 Client 建立 Creator 正式引用并做运行验收。
