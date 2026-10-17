# 表情局部合成支持工具 Brief

版本：v0.1；状态：执行中。对应 Task：`U04-EXPRESSION-REPAIR-PIPELINE-20261017`。

## 范围与边界

实现资产生产用确定性参考裁切、单态候选尺寸归一、Art 提供遮罩后的 ROI 合成、旧 base/face/front 重组、原坐标脸片导出和像素差检查。脚本只放本交付的 `pipeline/`。不修改 `apps/client`、历史资源或源 PSD，不生成候选图、不判断视觉 PASS、不扩批。

## 已核输入

Art/Tech 首图前同批预签及 Gate1 已通过，依据见 Art `ART_PRODUCTION_PRESIGN.json`（SHA-256 `6c52cb9edd7906ddceea2340c1711695c0d3ad1692fab6414377487916ec4eeb`）和 Tech `TECH_PRESIGN.json`（`APPROVED`）。Art 批次限定六代表样张；后续扩 24 态须等待 Master/Art/Tech 通过并复签。

六样源由 Art 预签列出的 `approved_identity_reference.path`、`face_source_rect_xyxy`、现行 base/face/front 构成。所有坐标使用批准源画布坐标；对输出 256x256 或 192x192 的缩放只用于显示参考，原生参考保留 256x256 源像素裁切。0.75 导出图的原生 192px 版本亦单独登记。

## 接口意图

工具接受阶段/ROI、一个候选 PNG、Art 明确给定的 RGBA 语义遮罩、原生坐标 base、旧 face、front、映射缩放和输出位置；候选全图只做均匀缩放归一，不移动五官。工具负责防止遮罩外像素变化、导出 base/face/front 合成与 mask 外 RGBA 差异、输入输出 SHA 和处理参数记录。候选视觉身份和表情是否通过由 Art 判断；漂移须拒用。PSD 适配只复用既有 hidden-layer adapter，报告 Pillow 合成可读与显隐检查，不能据此声称原生绘画层可编辑。

## 已开始产出

本文件是 Required Artifact 的首个实际产出。六样参考裁切已授权写入 Art 任务 `inputs/`，Client 目录只保存工具及说明、检查、交付记录。
