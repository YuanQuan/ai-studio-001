# v0.5 桥造型与切片效果 — 用户具体版本审核

这次仅改中央桥：参照您给的原图，将 v0.4 较宽、规则石拱改为更高且收窄的单圆拱，桥脚改为不规则苔石接地；四盏暖灯改为短厚石座，中央换为**一个旋涡圆章**。栏杆和灯在前景，拱、桥面与脚在后景。制作使用了已批准的唯一第 16 次局部生成候选，累计 16/16、没有重试；v0.4 旧版保留。

请优先看 `review/reference_before_after_bridge.png`（参考／v0.4／本版同坐标并排，左栏仅供视觉对照）、`review/reassembled_from_exports.png`（3072×1024 本版全景）与 `review/occlusion_demo.png`（彩色几何占位示意 body→实体→front，非正式角色资源）。`exports/` 内有本次**四张实际桥切片**：左右 body、左右 front；`source/scene_sakura_reuse_master.psd` 为 45 层完整母版，ZIP `package/SCENE_SAKURA_BRIDGE_SHAPE_GATE2_v0.5.zip` 收录本版审核文件和资源，**不包含 reference/ 原件与裁片**；参考资料仍在项目内留存。`CUT_MANIFEST.json` 给出每张图的尺寸、裁框、真实位置和 SHA，中央圆章不镜像重复。

实际 21 张环境 PNG 重组与 PSD 静态预览 RGB 0 差，17 张非桥 PNG 与 v0.4 字节 SHA 不变；批准 ROI 外 RGBA 0 差。局部新桥依您的视觉判断进入 Gate2，**请对这版实际桥造型、切片和同尺度效果作审核**。目前未接入 Client；游客/店脚实际遮挡、运行缩放和目标机性能未测试，静态图不代表运行通过。
