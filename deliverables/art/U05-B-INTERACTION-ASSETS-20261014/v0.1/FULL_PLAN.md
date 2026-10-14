# U05-B 交互美术 FULL 扩批制作预案

批次 `U05-B-INTERACTION-ASSETS-20261014/v0.1/FULL`；此前 PATCH-04 代表净底 Art 自查通过，仅为 FULL 输入，不等于 Gate2。用户已批准的原 Art `PRODUCTION_PLAN.md`、UI `UI_SPEC.md` 及完整旧杯 PATCH-04 方案限定本批范围；不得更改产品语义、视觉锚点或另做全身/整场景重绘。

## 冻结源与最小新增

`STATIC_BARE_PATCH04.png` 1024×1536 RGB8 SHA-256 `b5872329cb7cbf083c6e2f167c294ab8c7064f650f065f1a8706ed482c3772b9` 是最终净底候选。v0.2 多层母版 `deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.2/source/workspace_b_master.psd` SHA-256 `edc39b807dc6f83f104730407493f86c6a96ad7ed6492dd60f31b1de13d776eb` 唯一只读母版。现有 `CUSTOMER_BODY` `8e6df8b0…d9d81a`、`FACE_NEUTRAL` `126d2748…36b2f7`、`FACE_BLINK` `843be71b…ff1`、`FACE_HAPPY` `971157af…4d303c`、辅助 `FACE_SQUASH` `874890e5…59e50` 与 `FACE_EXPAND_MID` `daa4e43c…2c07c923f` 复用原工作切片，实际完整 SHA 见同批 Art 预签。共同脸/身体 RGBA 画布 332×301，不 trim，源左上 `(309,484)`、支点 `(475,785)`。中性身体+脸在停靠位对冻结角色逐像素复现；脸变化只在获批 FaceROI 的眉/眼/口及必要眼周。

仅新增 `FACE_DISAPPOINTED`，以及如实际回放必需的失落局部补间；补间标辅助，不新增第五情绪。通过旧脸画布上局部修改眼/眉/口形成可辨识失落，脸/身体其它像素与源零差。先在空窗净底复核 neutral，再核 happy/disappointed 目标极值、脸随身体移动、底部 2 源像素柜台遮挡。若真脸/窗口保真失败，停止诊断，不整图重画。

## 完整动作与界面重组

窗口 mask `[260,278,490,505]`；角色停靠 `[309,484,332,301]`，左端 x=`-72`，实际位移 381 源像素。入场 450ms ease-out、离场 450ms ease-in；气泡 `[467,288,375,235]` 在入场结束后才出现，离场开始即收。0–80ms 压眼、80–150ms 闭眼、150–300ms 展开到 happy/disappointed；失落恢复中性使用逆向局部补间，不能硬切两张全身。

同版 UI 要求：目标杯整容器 0.78，中心 `(653,416)`；三槽分别 `[345,1150,90,84]`、`[467,1150,90,84]`、`[589,1150,90,84]`。复用 v0.2 已批 12 原料、原标签/艺术字、工作杯前后壁、杯内容与“确认”按钮；台面选料只放三件，未选留空，三类选齐后点击确认才在 650ms 合成。最终 `reconstructed.png`、`component_sheet.png` 和 `animation_preview.gif` 必须展示货架/标签/台面三件/缩小目标杯的完整同尺度画面，不能以空货架代表片充数。

GIF 覆盖初客入场；正确 `650–950ms` 开心、`950–1400ms` 离场、`1400–1850ms` 下一客入场；错误 `650–1000ms` 失落并恢复中性留窗；超时 `0–300ms` 失落、`300–750ms` 离场；主动退出中性 450ms 离场。使用原 UI 状态语义，GIF 分段标签标明演示分支，不伪称真实 Client 运行。

## 产物和验收

用已读 `bggg-creator-image2psd` 工作流在新 v0.1 复制完整 1024×1536 多层 PSD：旧 v0.2 PSD 只读，保留原有非修改层、静底原件/修订层与可编辑范围记录；不以整张参考图遮盖原独立层。导出实际切片、同尺度 `reconstructed.png`、`component_sheet.png`、可播放 `animation_preview.gif`；更新 `CUT_MANIFEST.json`、`ASSET_MANIFEST.md`、`PRODUCTION_LEDGER.json`、`DELIVERABLE.json`，写实际 SHA、PSD 图层事实、Client 路径计划/UUID 未导入。源素材仅来自本项目已批资源，字体沿用已批艺术字图，不引入新字体。

测试逐项记录：中性与旧像素重合、保护区零差、四脸同画布及局部 mask、位移/气泡时序/底部遮挡、三槽与 650ms/杯缩放、PSD 可打开的层事实、GIF 帧/时序、完整 UI 同尺度静态。已有通过项只复用证据，只重算失效项。FULL 制作活动上限 10 分钟，累计代表≤70/总≤80 分钟，旧耗不重置；预留至少 60 秒收尾。0 图像生成调用。Art 与 Tech 对本同一 FULL 批次文字预签前不开始新图或 PSD/GIF 输出；超时或关键视觉失败就停并记 `NOT_TESTED/REVISE`。自产资源完成后直接交用户具体资源 Gate2，用户批准前 Client 不正式接入。
