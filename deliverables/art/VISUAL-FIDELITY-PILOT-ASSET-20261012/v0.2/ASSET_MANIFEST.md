# 灯笼首样资源清单 v0.2

本批已输出一个 `MT_SHOP_01_LANTERN_MASK_V02` 候选：`exports/tex_mt_shop_01_lantern_mask_v02.png`，128×256、8-bit 灰度 PNG，SHA-256 `f9a67671a0e1d4f03974f62b3fdf8de1131e4e99adc7aad4fecd13095fba7b9f`。源图对应的有效非零范围为 `[200,533,249,598]`，2431 像素；额外原始纹理量 32,768 字节。现有 body、sign 与四区域 PSD 均只读，路径和 SHA-256 见同目录 `ASSET_MANIFEST.json`。

可审阅的实际对照有 `evidence/lantern_full_083s.png`（同背景全景、0.83 秒）与 `evidence/lantern_static_contact.png`（同坐标灯笼细节、最暗 0.90），完整曲线可在 `preview/index.html` 调节和播放。它们都是 CPU 算法参考；实际 Cocos CLI 在本机启动失败，未取得运行画面，见 `evidence/RUNTIME_REPORT.md`。客户端在隔离 pilot 复制的 mask 路径为 `apps/client/assets/labs/lantern-pilot-v02/lantern_mask_v02.png`，字节哈希与 Art 输出一致；其 `.meta` 声明 UUID `a220bd47-9a72-4770-aa50-6143122443ef`，但 Creator 导入未实测，故正式“导入后真实 UUID”仍记未知，不能把静态 meta 或计划路径称为已验证正式资源。

Gate1 已批准的是 `VISUAL-FIDELITY-PILOT-PLAN-20261012/v0.2` 文字方案。此处具体遮罩和动态首样仍待用户单独审核，未获批准前不正式接入。
