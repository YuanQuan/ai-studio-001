# 旧环境引用审计与退役记录

审计与退役时间：2026-10-14。检查范围为 `apps/client/assets` 的 Creator 场景、Prefab、脚本及 JSON。退役前按候选清单逐项复验文件大小与 SHA-256，并扫描待删 UUID 对其他 assets 文件的引用；外部引用结果为零。随后按 `RETIREMENT_CANDIDATES.json` 精确清理34个旧资源文件；随后确认旧目录为空、UUID/路径无引用，再移除该空目录及其169字节 directory meta（SHA见清单）。共退役35个文件及1个空目录。

| 旧资源组 | 活动引用审计 | 退役结果 |
|---|---|---|
| 旧五层背景 PNG 与 `.meta`（5组） | 旧 image/Texture2D/SpriteFrame UUID 不再被活动场景、Prefab、脚本或 JSON 引用；U00/U04继续使用同一 `pf_street_base_01`，运行时填充获批新版资源 | 已退役 10 个文件；稳定 Prefab 和五层节点保留 |
| 旧 U01 专属 `resources/u01_sakura/` PNG 与 `.meta`（10组） | U01运行时仅加载 `resources/sakura_v03/`；旧UUID无外部引用 | 已退役 20 个文件；空目录及无引用 directory meta 也已清理 |
| 旧 U01 manifest 脚本及 `.meta` | 运行代码无 import；旧路径仅自包含在待退役定义 | 已退役 4 个文件 |

Master 在最终清理前对 8787 修复版实际 IAB 初验通过：U00 左右边缘无硬边，最大缩放/复位、街景/店铺/游客显隐、游客数量变化、店铺调整、390×844 显示通过；U01 trim 修复基线完整，重新导出的18个原型 image/Texture2D/SpriteFrame UUID均非空；U04店长/表情流程通过。退役后 Creator 3.8.8 再构建 UnitSamples，最终地址仍为 `http://127.0.0.1:8787/`，构建输出与哈希见 `evidence/BUILD_MANIFEST.json`。Master已完成退役后重入与导出复查；U01最终JSON为18原型/49实例且资源身份全非空，Tech独立核对零差。Tech Review=APPROVED。

保留项：`pf_street_base_01` 稳定 UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`、原五层节点、六店与游客资源、PSD 母版、审批记录、修改前快照及历史交付。具体旧文件路径/原始SHA见 `evidence/RETIREMENT_CANDIDATES.json`。
