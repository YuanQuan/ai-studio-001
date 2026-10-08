# U03 效果忠实重制｜奶茶首样技术预签

批次 `U03-SHOP-FAITHFUL-REDRAW-V03`；正式任务 `U03-SHOP-VISUAL-FIDELITY-003`。技术预签范围仅 01 奶茶代表样张；**已生效**：Producer 已将本轮授权及确切 v0.3 方案登记为既有 Gate1 `USER_APPROVED`（`tasks/U03-SHOP-VISUAL-FIDELITY-003/ARTIFACT_APPROVAL_GATE1.json`，登记时刻 2026-10-08T23:35:38+08:00），Art `ART_PRODUCTION_PRESIGN.json` 与本技术预签同批、同方案 SHA。01 正式代表样张可按本预案制作，不另设审批门禁；改变工具、源格式、画幅、输出范围或视觉语义时须按原规则复签/处理受影响审批。

## 冻结输入

- `deliverables/art/U03-SHOP-ASSET-001/v0.3/PRODUCTION_PLAN.md` SHA-256 `2830BC2DFEAD18A37952E46E1D87AD426097186F67D54858EBDBD2EB5615026E`。
- `deliverables/art/U03-SHOP-ASSET-001/v0.3/VISUAL_ANCHORS.md` SHA-256 `98FD35F7D35ABBB886C11FC8FECBE4CC12B737478BAB3E3B7F764B2CDB67EA53`。
- 本地六店参考 `deliverables/art/U03-SHOP-ASSET-001/v0.1/preview/mixed_signs_v04/six_shop_mixed_signs_overview.png`，1536×1024，SHA-256 `FF3D931CB8D61728197B950B7E5BE42707685848AA9D9F8E31074DC24D43B125`。单店目标仅数百像素宽，约 462 px 级；**不能直接裁切并放大为 1024 正式贴图**。新母版是高分辨率重建，应记录裁框、抠黑不确定边界、生成原图、被舍弃稿及哪些细节由重建补足，不能将原参考看不清的微纹理当作原图事实。

## 技术契约与预算

01 仍为 1024×1024 RGBA 全画布、脚点 `(512,900)`；最终 `body` 与 `sign` 两片同原点同尺度，sign 在牌的前景，不通过移动 Prefab 节点改牌位。Art 从完整源画制作可追溯语义层，多层 PSD 应保留源画、层源、遮挡/补洞说明、实际可编辑程度及层到两片的映射。`bggg-creator-image2psd` 组装须核 PSD 可见合成与 body/sign 重组一致；单图切分不声称具备隐藏背面。

一店两张 1024² RGBA 未压缩像素容量上限约 **8 MiB**，六店 12 张约 **48 MiB**；仅是源面积估算，不是文件尺寸、Creator 驻留、图集页数、DrawCall 或目标机结果。01 重建可能扩大 alpha、灯晕及透明包围盒；应在样张实图测 bbox/边距、牌与屋檐/灯/窗口的前后序、黑边/光晕、目标视窗投影像素，再判断实际预算。预算冲突给出面积和显示代价，由 Master 组织取舍，不以压回 v0.2 硬边旧风格解决。

首样比较须将目标归一化稿、v0.2 旧实片、v0.3 PSD 重组放在同一深蓝背景、同一 1024 画幅、对象实心 bbox、脚点和 390×844/720×1280 显示尺度下；以蓝瓦卷角、四段奶白布帘、瓶罐/锅具、双灯、右小杯牌、材质厚度及冷暖光为目标。约 3% 画幅 bbox 容差是几何检查，不代替 Art 对体积、光影和身份可读性的逐锚点判断。静态视窗不是运行画面。

原 Prefab/Scene/`.meta` UUID 留作稳定接入身份，**本阶段不改 Client**。最终六店实际切片获 Gate2 用户批准后才替换贴图；Creator 3.8.8 的新包导入、构建与 Web 运行另行核验。构建进程须使用可持有的 `Start-Process` handle 等待 GUI 进程真正退出，并核本轮日志和输出，不能从 PowerShell 空 `$LASTEXITCODE` 判成功。现在新 PSD、alpha、合批、运行与性能均 `NOT_TESTED`。
