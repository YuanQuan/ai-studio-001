# 阿角、阿灯、小锦首批表情修正｜Art-B 执行 Brief v0.1

## 已批准输入与本单元范围

- Gate1：`deliverables/art/U04-EXPRESSION-REPAIR-PLAN-20261017/v0.2/PRODUCTION_PLAN.md`，SHA-256 `691699afcd70db3df4c82490cf7be27be1f3c055f72ac1a69907b2945e9e955a`；用户批准记录为 `deliverables/master/U04-EXPRESSION-REPAIR-PRODUCTION-20261017/v0.1/USER_APPROVAL.json`。
- 同批首图 Art 签在 `deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/ART_PRODUCTION_PRESIGN.json`；Tech 同批 `TECH_PRESIGN.json` 判定 APPROVED。Producer `FLOW_REPORT.md` 登记六代表样张可开工。
- 本单元仅做 AJ_S2 happy、AD_S0 happy、XJ_S0 happy 三张代表样张。总六样 Art/Master/Tech 看图通过且扩批复签前，不制作这三阶段其余十二态。

## 冻结项与制作方法

沿用各阶段已批准原图的身份、脸型、头向、视角、发型、衣装与二维笔触，现行 `base + oneface + front` 作为 ROI 外像素及 alpha 的冻结基准。以批准源脸框裁图进行内置 `image_gen` 逐态局部编辑，每次一态一候选。只调整眉眼嘴联动与必要相连皮肤阴影；不采用眼缩放、几何嘴拼贴或眉旋转。生成候选若不能保留锚点、配准与画风，拒用并登记差异。

| 阶段 | 源图脸框 xyxy | 脸片导出 | 特别锚点 |
| --- | --- | --- | --- |
| AJ_S2 happy | 365,130,621,386 | 256×256 | 原脸型、角/发与男性身份 |
| AD_S0 happy | 310,185,566,441 | 192×192 | 原视角、笑意的眼眉嘴联动 |
| XJ_S0 happy | 330,223,586,479 | 192×192 | 原圈纹高度近视镜单次显示；镜后眼透视与非镜像 |

候选实际尺寸若由工具返回为更大画幅，需经配准后归一到 256×256 源 ROI；AD/XJ 正式脸片按获批映射缩至 192×192。小锦圈纹不得全删，重复错位的圈须以分层合成判断。候选由本单元写入主 Art `candidates/` 的上述三阶段前缀路径；本单元账本、提示、目视 Review 只写本任务目录。后续脸片合成、遮罩、PSD 与实际显示尺寸重组依总 Art 单元与 pipeline 的 I/O 接口协作，保留来源、图层可编辑范围和效果核对。

## 本轮输入实核

2026-10-17，pipeline 已在主 Art `inputs/` 落三张批准脸框裁图。AJ `a372552aba7fe65a44b2c20f2e3a2db0de46089a8ac16a1358e3181c403bb5d0`、AD `70ce5b08bb3ab2ace7078f40eb324e914a5c7b741f047c5f9107abe71e6b394c`、XJ `693201498dd9da71384c478d00d3283562bf054df32879aea379052be9529df2`，均为 256×256；源图 SHA 匹配已签预案，逐图 RGBA 裁切与落盘输入零差。已实际目视获批源与旧重组：AJ 旧口张开过大且眼边破碎；AD 旧口形平板、局部脏边；XJ 获批一睁一眯眼及双镜圈纹清楚，旧镜片/眼周有白线与边缘污染。此处只是输入诊断，不能据此判定新图通过。

## 预算与停点

本单元最多 24 次内置调用：15 态首候选、必要时最多 3 底片/遮挡候选、最多 6 定向返修；并与总 Art 24 次合计不超过 48。失败或未知计入额度，同一问题至多两次返修。三张代表样张每完成一张即向总 Art 与 Master 报告实际路径和目视结论。六样及扩批复签门槛到来前本单元只交样张证据。实际图像的 Gate2 用户审批尚未获得，任何候选不能作为 Client 正式资源。
