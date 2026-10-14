# v0.5 桥局部资产清单

首图前预案在上表原样保留；以下记录本次实产。画布沿用 v0.4 的 3072×1024 母版。像素格式为 PNG RGBA8，PSD 为 45 层栅格。源参考、现行环境及唯一候选的实际路径/哈希见 `EXECUTION_LEDGER.json`。

| 稳定语义 ID | 计划路径 | 内容与层级 | 状态 |
|---|---|---|---|
| `sakura.bridge.body` | `exports/tex_sakura_rr_bridge_body_half.png` 或按技术签认更名 | 新拱圈、桥面、桥脚及旧桥露底必要补洞；实体后景；旧 body 版本保留 | 计划 |
| `sakura.bridge.front` | `exports/tex_sakura_rr_bridge_front_half.png` 或按技术签认更名 | 新栏杆、灯座/灯及必要光晕，位于实体前景；中央圆章只一枚 | 计划 |
| `sakura.scene.master` | `source/scene_sakura_reuse_master.psd` | 完整 3072×1024，多层栅格母版；新桥层与原 17 非桥环境层关系可追溯 | 计划 |

实际选择 **左右独立、均不镜像** 的两组 body/front，因中央单个旋涡跨原中线，半幅镜像会复制或翻转图案。四张真实桥 PNG 为 `exports/tex_sakura_rr_bridge_body_l.png`、`body_r.png`、`front_l.png`、`front_r.png`；精确裁框、尺寸、SHA 与实例偏移由 `CUT_MANIFEST.json` 唯一登记。两张 body 分别紧裁为 1536×270、1536×271；两张 front 各 225×177。总矩形面积 910,626 px，RGBA8 未压缩预算 3,642,504 字节。旧桥露底的必要水路渐变融入 body 栅格；`source/bridge_union_mask.png` 和 `source/bridge_front_mask.png` 保留可检边界，未宣称恢复原生笔画或被遮住的全部隐藏内容。

其他 17 张非桥环境 PNG 复用 v0.4 原文件，逐个字节 SHA 不变；六店资源不在此批。新图由本组织 Agent 自行切图，提交真实切片和同尺度重组供用户 Gate2 审核；未导入 Client，UUID 为计划。Tech 的实际面积取舍见其 `RESOURCE_OPTIONS.md`，不能把本地静态预算说成运行性能通过。
