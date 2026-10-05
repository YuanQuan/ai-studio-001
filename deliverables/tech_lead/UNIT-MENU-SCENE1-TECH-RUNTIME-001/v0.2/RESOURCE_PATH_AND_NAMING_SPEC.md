# 单元示例1｜美术交付与 Creator 正式资源路径、命名规范 v0.2

任务：`UNIT-MENU-SCENE1-TECH-RUNTIME-001`。本文件回应用户对 v0.1 的补充要求，是待同版审核的技术方案。逐件事实源为 `project/ASSET_HANDOFF_REGISTRY.md`；已批准切图仍以 `UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` 为准。本版不创建 Creator 资源。

## 1. 两个目录各管什么

| 阶段 | 根目录与职责 | 本批内容 | 事实状态 |
|---|---|---|---|
| 美术交付 | `deliverables/art/moonlit_psd_20261005_v2_raw/` 保存可编辑母版、审核图和按 PSD 原点导出的正式 PNG；保留原文件名与 hash | `moonlit_four_layers.psd`、`overall_from_psd.png`、`psd_full_canvas_layers/` 四张 PNG | 文件已存在；四张 PNG 与 PSD/重组效果获 Gate2 v0.3 用户批准 |
| Creator 正式资源 | `apps/client/assets/units/background/textures/` 保存实际导入的四张 PNG；`apps/client/assets/units/background/prefabs/` 保存唯一背景 Prefab | 计划 `tex_street_base_01_l01_sky.png` 至 `l04_foreground.png`，以及 `pf_street_base_01.prefab` | 路径和文件名为本版提案；文件、`.meta`、UUID、场景引用均尚未创建 |

正式交接只复制四张 **2172×724 全画布** PNG 的原字节；不从 `layer_sources/` 拿天空的 2171 像素源，也不导入 PSD、整体审核合成图或旧 Demo 图。登记表对每张 PNG 分列美术目录/文件名与计划 Creator 目录/文件名，实际导入后再分列回填实际 Creator 目录/文件名。美术交付文件不因 Creator 改名或目录调整而改名。Client 导入后对照四个源/目标 SHA-256，相同才可标为“已导入待运行核验”；若为兼容性需重导出、压缩或拆片，先形成新版美术/技术影响与用户决定，不能静默以不同像素替换。

## 2. 稳定身份与计划路径

`STREET_BASE_01` 是该背景 Prefab 的既有逻辑对象 ID；四层子资产分别用 `STREET_BASE_01_L01`、`L02`、`L03`、`L04`，从后到前，不以文件名或 UUID 代替。此逻辑位置曾有旧空景候选；旧 `UNIT-MENU-BASE-ASSET-001` 已取消，不能把其 PNG/Prefab 当本批资源，也不能复用未确认的旧 UUID。

| 稳定 ID | 语义与层序 | 计划 Creator 正式路径 |
|---|---|---|
| `STREET_BASE_01_L01` | 第 1 层：天空、月亮、云、星；视差 0.3 | `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png` |
| `STREET_BASE_01_L02` | 第 2 层：山峦、远建筑；视差 0.8 | `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png` |
| `STREET_BASE_01_L03` | 第 3 层：地面、树木、右廊；视差 1.0 | `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png` |
| `STREET_BASE_01_L04` | 第 4 层：桥、栏杆、河水与前景；视差 1.0 | `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png` |
| `STREET_BASE_01` | 四层统一原点、同尺度的唯一正式 Prefab；示例 1/7 共用 | `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab` |

既有获批 `UNIT-MENU-TECH-DESIGN-001 v0.2` 把 `apps/client/assets/units/background/StreetBase.prefab` 列为**候选**目标路径；本版提议统一为上表的 `pf_street_base_01.prefab`，不改背景对象 ID 或单 Prefab 复用原则。仓库内当前不存在本批正式 Prefab 或四张正式 PNG，故不存在本次搬移的已用 UUID；本版获批后，Client 在自身开工包写明实际路径并实施。若实施时已有其他同名资产或引用，先给 Tech 变更映射和影响，不直接覆盖。

## 3. 工程命名最小约定

- 正式资源放在 `apps/client/assets/units/<对象类别>/<资源类型>/`，例如 `background/textures/`、`background/prefabs/`。同一对象的独立 Lab、组合 Lab 和未来主体共用正式路径与 UUID；Lab 场景和调试资源留在 `labs/menu/`，不复制正式贴图。当前只锁定本批背景路径，其他对象在各自 Artifact 中按同一规则登记，不批量改既有资源。
- 文件名用小写 ASCII `snake_case`，仅 `a-z`、`0-9`、下划线；格式 `类型前缀_稳定对象id_可选层序或用途.扩展名`。当前类型前缀：`tex_` 为图像纹理，`pf_` 为 Prefab，`scn_` 为 Scene，`mat_` 为 Material，`anim_` 为 AnimationClip。只在实际使用该类型时建文件，不预建占位资源。逻辑 ID 在登记表中保持大写，映射到文件名时用小写。
- 同一根目录内路径大小写必须唯一，禁止只靠大小写区分；文件名不嵌审阅版本号、日期、随机 hash 或临时状态词。版本与校验值记在登记表和 Git/Artifact 记录中。层序 `l01` 等固定两位并与前后关系一致；语义后缀帮助人识别，不承担身份键。
- Creator 创建 PNG `.meta` 后由 Client 分别记录 image 主 UUID、`subMetas` 中 Texture2D UUID 和 SpriteFrame UUID，连同各自键名、`.meta` 路径和实际依赖；三者不能混写，尤其不能把 image 主 UUID 当作纹理或 SpriteFrame UUID。Prefab 的 `.prefab.meta` 主 UUID 与四层依赖也单独记录。不手填或预分配 UUID。复制或替换资源时保持 `.meta` 的稳定性并比较 hash；若 UUID 变动，逐项列出受影响的 Prefab、Scene、独立/组合引用并复验，不以相同文件名宣称同源。
- 相同逻辑对象更新图片时沿用稳定资产 ID，登记“旧 hash → 新 hash”、批准版本、更新原因和受影响引用；已审旧文件仍在美术交付版本中追溯。不同内容不能共用同一 ID/路径冒充已审版本。需要更换语义或拆分对象时另立 ID，走相应 Art/Tech/用户审批。

## 4. 接入时的核对与回填

Art 核交付目录/文件名、描述、层序、源 hash 和审核版本；Client 核实际 Creator 目录/文件名、导入参数、目标 hash、image 主 UUID、Texture2D/SpriteFrame 子资源 UUID、Prefab UUID 与场景引用；Tech 核两端映射、命名冲突、单 Prefab 同源和迁移影响。每条登记表先保留 `PLANNED_NOT_IMPORTED`，待 Client 提交工程 commit 与证据后再由责任角色改为实际状态。未见工程文件、UUID、构建和运行证据时不能标“已接入”或运行 `PASS`。
