# v0.2 环境资源编辑说明

画布 3072×1024。正式 PSD 为 43 个实际可编辑 RGBA 栅格层：原 v0.1 的 41 个环境语义层逐字节保留，另有 `street_rail_l` 与 `street_rail_r` 两层。它们来自本批已新绘的 `water_rail_half` 上部矮灯与绳栏，通过透明 alpha 拆层后置于桥街层上方；不是整图截图覆盖。六店图层、用户效果图覆盖层都不存在。

`exports/` 有 18 张正式 PNG：v0.1 的 17 张原字节保留，新增 `tex_sakura_rr_street_rail_half.png`（1536×344 透明半幅，实际可见区域约 x0–1285/y9–113），左右镜像复用。`CUT_MANIFEST.json` 登记坐标、层序、实际 SHA；`review/reassembled_from_exports.png` 与 `review/scene_environment.png` 同尺度基准重组。编辑时从对应语义 PNG 调整，不要将全景图片作为假装可编辑的遮盖层。

修改只在 `PRODUCTION_PLAN.md` 的四个矩形并集。v0.1 全景、PSD、切片仍在相邻 `v0.1/` 目录作为冻结/已退修历史；具体 v0.1 成品未获用户批准。左上树红点经用户澄清不修，树及其他景物全部保护。最终环境 ZIP 不含参考图、历史稿或六店。原效果图仅作视觉参考，且本次未调用新的图像生成。静态重组与保护区比对见 `FILE_VERIFICATION.json`。CPU 微动 HTML 是浏览器美术预览，Cocos 导入、实际显存、draw batch、目标机运行均未测。
