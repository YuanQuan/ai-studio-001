# Art 视觉自检（v0.4）

结果：`PASS_STATIC_CANDIDATE / USER_GATE2_PENDING`。以 v0.3 桥半幅及 3072×1024 全景为同源、同尺度基线检查：左灯、右灯和原发光外晕进入 front；前后栏杆饰板、圆顶柱与中线圆标章连贯；桥面内路面、桥拱券石和桥脚花石留在 body。`review/bridge_layer_breakdown.png` 逐项展示原桥、body、front，`review/bridge_front_detail.png` 核全景桥局部，`review/reassembled_from_exports.png` 核整景。

空场景 front 放回原位置时，RGB/RGBA 与 v0.3 全景零差；左右镜像中线、灯光和纹理不增光。`review/occlusion_placeholder_demo.png` 仅以青色/橙色矩形标示“实体位于 body 后、front 前”的层序；它不是游客或六店资产，也不是 Cocos 运行截图。桥面被旧栏杆挡住的隐藏像素未恢复，真实游客脚步、店脚、缩放与采样效果留待用户批准后的 Client/Tech/QA 运行核验。

本地 mask 修正账本：初稿揭示底缘带入桥脚花石；第 1 轮收紧花石与下缘，第 2 轮把中段斜向券石还给 body，并在同轮分层核图中补入灯笼原有低 alpha 光晕散点。最终遮罩在原定包络内，无重绘、无额外 imagegen；完成本次静态核验后冻结，不用反复试错放宽语义。
