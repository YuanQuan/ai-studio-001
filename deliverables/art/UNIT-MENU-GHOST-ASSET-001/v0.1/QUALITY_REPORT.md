# 幽灵顾客与板凳｜第三轮正式候选出图质量报告 v0.1

2026-10-03；任务 `UNIT-MENU-GHOST-ASSET-001`。本报告只评价**本批实际源与导出**。Product B04/C/D 的 Creator、真机与未来主体入口验收另由 Client/QA 留证，不借静态预览判运行通过。

## 签认与迭代轨迹

1. `ART_PREFLIGHT.json` + `TECH_PREFLIGHT.json` 在首次绘制/出图前对 23 帧、逻辑画布、板凳、候选图集、来源和工具双签。首轮输出冻结于 `audit/round0/`；Art 发现正面脸难以区分左右，不作为用户审阅候选。
2. `PREFLIGHT_REVISION_01.md` + Art/Tech REV1 双签后，母版变成轻微右向三分之四脸、近远眼/手差与鼻口偏向；第二轮 23 帧与 1024×1024 atlas 冻结于 `audit/round1/`。左右关键帧可分辨，但小屏正式运行尚未测。
3. 第二轮真实 `paddedRect` 最大右界 `981`、下界 `477`；`PREFLIGHT_REVISION_02.md` + Art/Tech REV2 双签后仅将 atlas 高度改为 `512`，第三轮完整导出为当前文件。与 `audit/round1/FRAME_MANIFEST.json` 对照，**23 条完整帧记录、两份 SVG 源 hash 全同**；bench、contact sheet、frame sheet、GIF 文件 hash 全同，只有 atlas 尺寸/PNG/hash/索引与导出脚本改变。

## 实际结果

| 核验项 | 实际证据与判定 |
|---|---|
| 帧真实性 | `move 6 + run 6 + happy 3 + sad 3 + sit 5 = 23` 张透明 PNG，23 个不同 SHA256；每帧 `160×192`，唯一原方向右。并非旧概念板裁图、两帧补间或五态共 4–6 帧。左向只由预览中的 flip 复用同一文件。`frames/FRAME_MANIFEST.json` 含每张状态、序号、时长、原点、alpha bbox、裁切偏移及 atlas rect。 |
| 循环 | `loop_preview.gif` 元数据实测 23 页，每页 `320×192`，循环播放。只读像素差统计中 move 末→首差值/相邻差中位数 `0.519`，run 为 `0.558`，未出现明显数值大跳；Art 查看帧表与 GIF，跑动轮廓变化明显，移动的逐帧动感**较轻**。23 个唯一 hash 仅证明确有像素差，不能证明小屏动画可读；移动/跑动区别、节拍与首尾自然度须在 Creator 和目标机播放时实测。 |
| 左右五态 | `preview/contact_sheet.png` 为左/右两列×五态五行；第二轮之后近/远眼、鼻口、近/远手和头身倾向可见方向差。happy/sad 情绪可分，sit 包含接近、下落、接触、稳坐、主动离座。左右**游戏运行十格**、目标机缩小辨识、切态和坐姿转向仍 `NOT_TESTED`，不得将这张图冒充 QA 十段录像。 |
| 板凳与遮挡 | `BENCH_01` 与角色源/PNG 分离，`bench_back.png` 和 `bench_front.png` 可置顾客后/前。预览以两向座点 `(76,56)` / `(180,56)` 对齐角色 `seatContact=(80,146)`，前沿遮挡坐姿底部；角色移动脚点 `(80,168)`。Creator 遮挡与实际交互尚 `NOT_TESTED`。 |
| 图集与透明边 | 当前实际 `1024×512` **1 页**，PNG `149,994 B`、RGBA8 基础量 `2,097,152 B (2 MiB)`，不同于压缩文件大小。23 帧最大 alpha bbox `112×152`；总 bbox 面积 `328,970 px²`、可见 alpha 像素 `223,430`。padding 均 ≥4 px，paddedRect 无相互交叠或越界；最右 `981`、最下 `477`。源逻辑画布 alpha 最小上界 `y=1`，没有检测到触边裁切，但新增更高头饰/动作须重新检查并双签。纹理 mipmap、压缩/回退、GPU 副本和冷加载峰值未测。 |
| 合批 | 图集同页可减少纹理切换机会，但板凳前后片、世界光、遮挡和 UI 可能断批；**没有声称一页就是一个 DrawCall**。Creator Profiler 的 DrawCall/帧时间/显存 `NOT_TESTED`。 |
| 可重复性 | `source/*.svg`、`tools/export_assets.js`、`frames/FRAME_MANIFEST.json`、`sprites/*.png/json` 和审阅预览均在仓库路径；Node v22.12.0、sharp 0.35.4、libvips 8.18.6。运行：在已安装 `sharp` 且已设置 `NODE_PATH` 的 Node 环境执行 `node deliverables/art/UNIT-MENU-GHOST-ASSET-001/v0.1/tools/export_assets.js`；验证：同目录 `tools/verify_assets.js`。导出脚本检查全部三轮 Art/Tech preflight `APPROVED`。当前脚本 SHA256 及 atlas hash 见 `ASSET_MANIFEST.md`。 |
| 权利/相似 | 本批母版自行矢量绘制，无外部图像、字体、品牌。用户参考许可 `UNKNOWN`，只作高层风格研究；Art 自检未发现一比一裁图/描摹，完整记录见 `RIGHTS_AND_SOURCE.md` 与 `project/art_reference/`。非穷尽法律保证。 |

只读校验脚本运行返回 `PASS_STATIC_EXPORT_CHECKS`：23 帧 hash/逻辑画布、atlas尺寸/hash、4px padding、rect 不交叠、GIF 页数均通过。本批 `ART_REVIEW.json` 与 `TECH_REVIEW.json` 均已通过，待 Master Review 与用户审批。**Creator 3.8.8 导入、SpriteFrame pivot 与双入口复用、目标机纹理上限/小屏可读性、实际 alpha 采样边/DrawCall/帧时间、未来主体三入口均 NOT_TESTED。**
