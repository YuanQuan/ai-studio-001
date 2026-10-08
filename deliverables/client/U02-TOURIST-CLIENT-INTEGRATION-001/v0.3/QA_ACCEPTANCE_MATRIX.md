# U02 Client Integration v0.3｜QA 验收矩阵

状态：v0.3-R2 实现接入准备审查；下表“当前”指正式 QA 执行状态，尚未形成 `TEST_REPORT`。

## 版本与证据边界

- 受测交付：`U02-TOURIST-CLIENT-INTEGRATION-001 v0.3`；动画基线为已批准 `U02-TOURIST-VFX-FRAMES-001 v0.2` 与 `CP-U02-VFX-CLIENT-CONTRACT-20261008`。
- 原 QA Plan `U02-TOURIST-QA-PLAN-001 v0.1` 的环境、40 组矩阵和性能阈值继续适用；其“走跑不同姿态”和“喜悲末帧保持”断言由本次已批准合同覆盖。walk/run 同姿态、run 两倍速度；happy/sad 均循环。
- Client `RESOURCE_AND_FRAME_AUDIT.json` 报告 40 个源/工程 PNG 哈希一致、40 条挂点、160 个局部仿射矩阵静态重算。R2 Creator 3.8.8 导入审计 44 项 PASS；Web-Mobile 构建清单 147 文件、20,421,377 bytes，当前构建 ID `U02-TOURIST-CLIENT-INTEGRATION-001-v0.3-R2`，见 `evidence/retry-20261009-r2/`。构建父进程退出码为 null，结论依据 Creator 完成日志与新产物清单。
- R1 曾发现 happy03 帽顶与舞台辅助 caption 重叠。R2 只移除该 caption；R1 截图和旧 v0.2/R5 冒烟不继承为 R2 结论。R2 浏览器只读审计及人工鼠标操作可用于实现接入 Review；正式 QA 的性能窗口、真实触控和独立回归仍须另行执行。

## R2 实现接入准备证据

| 项目 | R2 已有证据 | 本阶段判断边界 |
|---|---|---|
| 帧与循环 | `runtime-full-equipped-390x844.json` 与 `runtime-full-coverage-390x667.json` 各观察 40/40 帧、四动作每个 10 帧；09→00 回绕在两视口四动作均大于 0 | 支持 Web 实现接入 Review；不是正式 QA 独立执行 |
| 40 组 | `runtime-40-combinations.json` 的 40 条状态均 pass；40 张同版组合截图可复核 | 仅代表该次鼠标操作和所见 Web 状态 |
| 挂点与镜像 | 160/160 运行挂点行，invalidRows=0；Tech 对附件节点变换和左右镜像作同版复核 | 视觉像素级对照及目标平台仍由正式流程判断 |
| 帽顶与布局 | R2 `happy-cycle` 左右、390×844/390×667 四张截图及全装扮图中辅助 caption 已消失，帽顶完整可见；覆盖记录包含 happy03 实际渲染节点 | 循环截图不是精确 happy03 定帧截图；不据此声称逐像素全帧通过 |
| 回归 | R2 U01 initial/zoom-drag/reset 和 U03 六店截图已留存，重置 JSON 为 initial/right/三槽空/ready=true | 限定同版鼠标冒烟，正式 U01/U03 回归待 QA 执行 |
| 性能与触控 | 有短时 Web smoke；无固定 60 秒×3 原始窗口与真实手指触控 | 对 Q08、Q10–Q12 仍记 NOT_TESTED |

## 必测项

| ID | 验收内容与判定方式 | 当前 | 所需证据 |
|---|---|---|---|
| Q01 | AssetDB 实导 40 个主体 SpriteFrame、4 个独立配件及 Scene/Prefab 引用；回读主/子 UUID、rect、offset、pivot，对照获批清单 | NOT_TESTED | Creator 导入日志、UUID 回读与构建资源身份 |
| Q02 | 四动作各 10 帧，连续序号、实际显示顺序、每帧时长及固定脚点 `(256,440)`；左右各至少扫一完整循环并核接缝 | NOT_TESTED | 锁定构建的逐帧截图/录屏、帧 ID 和时间戳 |
| Q03 | walk/run 使用对应同姿态帧，run 播放速率为 walk 的 2 倍；happy/sad 第 09 帧后回到第 00 帧并持续循环，UI 保持“播放中” | NOT_TESTED | 两轮以上循环录屏、时序日志、UI 状态 |
| Q04 | `4 动作 × 2 朝向 × 5 装扮` 共 40 组：none、hat、glasses、wrist、all；逐格核角色=1、动作/方向/槽位、主体身份和配件贴合 | NOT_TESTED | 40 格状态 ID、截图/录屏和结果表 |
| Q05 | 全帧核 `head/face/wristNear/wristFar`、visible、层序、透明边、独立帽/镜/手环、近远手腕及左右 `MirrorRoot`；核真实 UISkew/仿射渲染与获批同尺度重组 | NOT_TESTED | 左右逐帧对照、Art/Tech 运行 Review、实际矩阵或可复核画面 |
| Q06 | happy03 帽顶越主体画布约 4.81 px 的部分完整可见；390×844 与 390×667 两视口、三件同挂和动作切换时无主体/视窗裁切 | NOT_TESTED | 两视口实图、视口/DPR/安全区记录 |
| Q07 | 四动作快切、连点、换向、同类替换/卸下、重置、返回/重入、失败回滚；无旧帧/旧件/重复游客，控件只报已生效状态 | NOT_TESTED | 当前构建交互录屏、实例/监听/资源日志 |
| Q08 | 真手指触控和鼠标分别核单次激活、忙态去重、托盘滚动及上下边界、按钮间距、返回可达；输入不泄露 U01 镜头 | NOT_TESTED | 设备/输入方式、双视口录屏与事件日志 |
| Q09 | 同一 v0.3 构建核 U01 四层、镜头拖动/缩放/重置、返回重入及资源 UUID；核 U03 当前六店完整显示、入口与 U02 往返无污染 | NOT_TESTED | 当前构建 U01/U03 回归记录和截图 |
| Q10 | Web 性能：390×844、实际 DPR/环境记录，稳定 10 秒后 60 秒×3；每轮 p95 帧时≤33.3 ms、>50 ms 帧占比≤1%，满足前台及刷新率条件时 FPS≥50 | NOT_TESTED | 原始帧时序列、构建/浏览器/刷新率/采样开销 |
| Q11 | 同动作同朝向三件/无件 p95 DrawCall 增量≤8；图集 RGBA8 等效面积≤48 MiB，单页≤实查最大纹理；冷/热进入分别≤5/2 秒 | NOT_TESTED | 真实渲染计数、实际图集页/格式、同钟事件时间戳 |
| Q12 | 20 次快切、10 次入退后实例/计时器/监听回基线，资源引用不持续增长；可靠 GC 可用时核第 10 次较第 3 次堆增量≤10 MiB | NOT_TESTED | 生命周期计数与原始内存记录；不可可靠 GC 时堆子项保持 NOT_TESTED |

## 执行门禁与结论

R2 的 Creator 导入、`web-mobile` 构建和 Web 冒烟已作为当前 Client 实现接入准备证据保存。正式 QA 须在 Client Artifact 用户审批后锁定受测源码、资源、构建选项和产物哈希，通过 loopback HTTP 在 Codex 内置浏览器前台独立执行，并在真实触控环境核必要触控项。截图、录屏、控制台日志和测量原始数据必须绑定同一构建。上表 Q01–Q12 当前均未由 QA 正式执行，不把 Client/Master 冒烟填成 QA `PASS`；执行后另出 `TEST_REPORT.md`，分列功能、视觉、性能及缺测，并按流程提交用户确认。
