# U04 对话资源计划清单 v0.1

本表全为 `PLANNED / 未生产 / 未导入`；下表“批准来源”是既有静态图，不是本任务新分层成品。精确源文件 SHA-256 以 `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.3/APPROVED_COMBINATION_MANIFEST.json` 为准。计划美术路径相对本目录，新 PSD 与 PNG 的具体版本、SHA-256、Client 导入后 UUID 均待生产；计划客户端根目录 `apps/client/assets/units/dialogue/`，真实路径和 UUID 待 Client 按统一命名规则登记。

| 店长/批准版 | 0魂来源与新基底ID | 2魂来源与新基底ID | 3魂来源与新基底ID |
|---|---|---|---|
| 孟桃 MT / v0.1 | `characters/mgr_mt_s0.png` → `U04_PORTRAIT_MT_S0_BASE` | `characters/mgr_mt_s2.png` → `U04_PORTRAIT_MT_S2_BASE` | `characters/mgr_mt_s3.png` → `U04_PORTRAIT_MT_S3_BASE` |
| 阿棠 AT / v0.1 | `characters/mgr_at_s0.png` → `U04_PORTRAIT_AT_S0_BASE` | `characters/mgr_at_s2.png` → `U04_PORTRAIT_AT_S2_BASE` | `characters/mgr_at_s3.png` → `U04_PORTRAIT_AT_S3_BASE` |
| 阿炭 AC / v0.3 | `characters/mgr_ac_s0.png` → `U04_PORTRAIT_AC_S0_BASE` | `characters/mgr_ac_s2.png` → `U04_PORTRAIT_AC_S2_BASE` | `characters/mgr_ac_s3.png` → `U04_PORTRAIT_AC_S3_BASE` |
| 阿角 AJ / v0.3 | `characters/mgr_aj_s0.png` → `U04_PORTRAIT_AJ_S0_BASE` | `characters/mgr_aj_s2.png` → `U04_PORTRAIT_AJ_S2_BASE` | `characters/mgr_aj_s3.png` → `U04_PORTRAIT_AJ_S3_BASE` |
| 阿灯 AD / v0.1 | `characters/mgr_ad_s0.png` → `U04_PORTRAIT_AD_S0_BASE` | `characters/mgr_ad_s2.png` → `U04_PORTRAIT_AD_S2_BASE` | `characters/mgr_ad_s3.png` → `U04_PORTRAIT_AD_S3_BASE` |
| 小锦 XJ / v0.1 | `characters/mgr_xj_s0.png` → `U04_PORTRAIT_XJ_S0_BASE` | `characters/mgr_xj_s2.png` → `U04_PORTRAIT_XJ_S2_BASE` | `characters/mgr_xj_s3.png` → `U04_PORTRAIT_XJ_S3_BASE` |

来源路径前缀为 `deliverables/art/U04-MANAGER-PORTRAITS-001/<批准版>/`。上述 18 组每组计划：`source/u04_<小写代号>_s<魂>_dialogue.psd`，`exports/u04_<小写代号>_s<魂>_base.png`，五张 `exports/u04_<小写代号>_s<魂>_face_<小写表情>.png`；必要时 `exports/u04_<小写代号>_s<魂>_front.png`。文件名代号为 `mt/at/ac/aj/ad/xj`，表情文件后缀为 `happy/surprised/sad/smile/angry`；稳定 ID 使用对应大写 `MT/AT/AC/AJ/AD/XJ` 和 `HAPPY/SURPRISED/SAD/SMILE/ANGRY`。五张表达资产 ID 为 `U04_FACE_<大写代号>_S<魂>_<大写表情>`。这给出 18 个基底 ID、18×5=90 个局部脸部图 ID，也给出逐项组合键 `(店长代号,魂,表情后缀)`；每键恰取本行同阶段基底、同键脸图和可选前发。`HAPPY`/`SMILE` 各有独立 PNG，绝不共用同一状态。计划前发 ID `U04_FRONT_<大写代号>_S<魂>`，最多 18 项，按实际遮挡决定。

| 独立对象/稳定 ID | 计划美术源 → 导出 | 类型/拟定规格 | 计划 Client 路径 | 状态 |
|---|---|---|---|---|
| `U04_DIALOGUE_PANEL_9S` | `source/u04_dialogue_panel_9s.psd` → `exports/u04_dialogue_panel_9s.png` | 透明九宫格，候选 512×256，Insets 48/48/48/48 px | `apps/client/assets/units/dialogue/ui/tex_u04_dialogue_panel_9s.png` | PLANNED；UUID 无 |
| `U04_DIALOGUE_CORNER_DECOR` | 同上 PSD 固定装饰层 → `exports/u04_dialogue_corner_decor.png` | 如角云纹跨切分线才单独导出；不拉伸 | `apps/client/assets/units/dialogue/ui/tex_u04_dialogue_corner_decor.png` | 条件计划；UUID 无 |
| `U04_PORTRAIT_<大写代号>_S<魂>_BASE` | 逐阶段 PSD → base PNG | 透明半身，预算候选 ≤768×1024 | `apps/client/assets/units/dialogue/portraits/tex_u04_<小写代号>_s<魂>_base.png` | 18 项 PLANNED；UUID 无 |
| `U04_FACE_<大写代号>_S<魂>_<大写表情>` | PSD 的眉/眼/嘴独立层 → 局部覆盖 PNG | 透明局部片，预算候选 ≤256×256；同阶段统一画布/pivot 或明确 offset | `apps/client/assets/units/dialogue/faces/tex_u04_<小写代号>_s<魂>_face_<小写表情>.png` | 90 项 PLANNED；UUID 无 |
| `U04_FRONT_<大写代号>_S<魂>` | PSD 前发/镜框层 → 局部覆盖 PNG | 仅实际需要的阶段导出 | `apps/client/assets/units/dialogue/portraits/tex_u04_<小写代号>_s<魂>_front.png` | 0–18 项 PLANNED；UUID 无 |

U00 实际背景沿用已导入的 `STREET_BASE_01_L01`–`L05`，美术源为 `deliverables/art/SCENE-CLARITY-REDRAW-ASSET-20261010/v0.3/exports/tex_street_base_01_l0{1..5}_*.png`，实际 Client 路径、SHA 与 UUID 见 `project/ASSET_HANDOFF_REGISTRY.md` 第 285–295 行；六店使用当前工程 `apps/client/assets/units/shops/`。U04 不复制或改写这批背景。`current_shops_on_v03_scene.png` 只是同尺度静态重组审图，不是运行截图；v0.2 对话预览更不能当纹理源。

生产后将 PSD/PNG 逐个完整实际路径、SHA-256、图层至导出映射、rect/offset/pivot、九宫格四边值、Client 正式路径及导入后真实 UUID 回填到同一份项目交接登记。未导入一律写 `PLANNED / UUID 未生成`。
