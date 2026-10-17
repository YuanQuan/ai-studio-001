# 六件压缩样本 Art 制作预案 v0.1

Gate1已批准，本交付细化执行参数，不重写已批方案、不新增同方案用户审批。适用 rules/visual_production_contract.md 与 rules/visual_fidelity_compute_contract.md v0.1。

保持所有轮廓、脸/身份、招牌笔画、天空渐变/拼接、游客透明光晕/脚点、字体字形/描边/坐标。仅确定性文件编码，不修图、不重画、不改尺寸/裁框/PSD/客户端。PSD均只读保留，字体图集为独立栅格源，不声称其恢复原生文字层。

BATCH_PLAN.json 是本批同SHA预签唯一机器清单，包含本轮实际源SHA、RGBA尺寸、alpha bbox、PSD身份、原映射、已批四文件身份、字体TTF/OFL、冻结源码/截图、完整工具参数与预算。旧审批保留历史文字，当前授权来自Root新记录。

静态比较固定DPR1、720×1280与320×568、源1:1、straight-alpha线性采样phase0.5、灰底#D3D3D3/#202020；再用清单绑定的原截图作场景背景/定位参照。U01 camera reset拟合3072×1024、U03灯笼店完整1024画布与cropRect、U02 happy00基准512画布/foot按冻结源码公式投影；不可把裁后PNG拉伸充满原画布。截图JPEG只作背景与定位，零差目标比较原PNG解码数据。源候选应用完全相同公式和裁切，视觉差异不得用平均相似率掩盖。

源代码推导静态投影不是运行实测。人物AT S3具体状态/portraitMask最终投影、字体目标label/axes尚未完整取证；这两项可做全RGBA和1:1诊断，实际尺度视觉通过保持NOT_TESTED，完整效果提交前须补齐事实，不能用任意缩略比例替代。游客公式已锁但未实测投影；动画邻接/回放保持NOT_TESTED。所有WebP导入/平台解码/GPU及新候选运行均NOT_TESTED。

首批天空/招牌/游客；代表成功再扩其余三。Pillow11.3.0 PNG无损、cwebp1.5.0 -lossless -exact，固定无ICC按sRGB解释、不清透明RGB。quality95支线未满足兼容条件，本轮锁住。上限18候选+6参考/150人分钟/0生成调用/0外部付费，每问题最多2轮且不重置预算；本次文档产图0。

原PSD层映射本轮核文件及原登记，ImageMagick只读ping确认shop05两层、tourist8层、人物18层、scene43层实际存在，未进行PSD重新渲染，不能称母版像素重组PASS。原生成工具完整商业凭证未逐件重取；沿用已批项目源、无新增外部参考。字体TTF及OFL实际SHA已重核，正式分发是否带许可交后续核验。

Art仅签本文字预案；Tech须对相同BATCH_PLAN SHA签名后才可产首图。制作后按自产路径直接呈实际样本、同尺度证据及版本清单给用户Gate2，当前不代表新图获批、正式接入或QA通过。

工具最终统一：WebP使用 `-metadata icc`，六输入均untagged；不使用all。人物AT_S3与U05字体已补冻结源码公式和原metrics，但状态/label/axes未完整证实，依旧NOT_TESTED。
