# 美术交付与 Cocos Creator 正式资源交接登记

当前登记版本：`UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.2`（已批准）。2026-10-05 Creator 3.8.8 已为四张获批 PNG 与镜头控制脚本生成 `.meta`，AssetDB Library 已重导。四张 PNG 的内容哈希与美术源文件一致；四份 SpriteFrame `.meta` 均为 `trimType=none`，对应 Library JSON 均为 `rect=2172×724`、`originalSize=2172×724`、`offset=(0,0)`，贴图 UUID 指向各自真实 Texture2D 子 UUID。身份与全画布几何映射已静态核验。当前仍无可交互 Editor 窗口、Prefab/Scene 和构建/运行证据。此表记录美术实际交付和 Creator 实际状态；更新需注明来源 Artifact、版本、责任人和变更原因；具体命名约定见 `deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/RESOURCE_PATH_AND_NAMING_SPEC.md`.

## 示例1四层背景｜已批准美术交付，Creator身份与全画布导入已核验

美术批准范围：`UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` Gate2；四张 PNG 均为 `2172×724 RGBA`、左上原点 `(0,0)`、从后到前排列。下列 SHA-256 来自 `deliverables/art/UNIT-MENU-FOUR-LAYER-CUT-001/v0.1/CUT_MANIFEST.json`，用于每次交接逐件核对；旧清单中的候选状态不覆盖 v0.3 的用户批准记录。

| 稳定资产 ID | 美术交付目录 | 美术文件名 | 用途、层序与水平位移 | 美术 SHA-256 / 版本 | 计划 Creator 正式目录 | 计划 Creator 文件名 | 工程实际状态 |
|---|---|---|---|---|---|---|---|
| `STREET_BASE_01_L01` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `01_01_94477409.png` | 背景第 1 层：天空、月亮、云、星；后景；0.3 | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l01_sky.png` | `CREATOR_META_AND_LIBRARY_VERIFIED`；hash一致；真实UUID已登记；trimType=none；Library 2172×724、offset=(0,0) |
| `STREET_BASE_01_L02` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `02_02_933386cf.png` | 背景第 2 层：山峦、远建筑；0.8 | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l02_mountains.png` | `CREATOR_META_AND_LIBRARY_VERIFIED`；hash一致；trimType=none；Library 2172×724、offset=(0,0) |
| `STREET_BASE_01_L03` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `03_03_23db4183.png` | 背景第 3 层：地面、树木、右廊；1.0 | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l03_ground.png` | `CREATOR_META_AND_LIBRARY_VERIFIED`；hash一致；trimType=none；Library 2172×724、offset=(0,0) |
| `STREET_BASE_01_L04` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `04_04_c82fb659.png` | 背景第 4 层：桥、栏杆、河水与前景；1.0 | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l04_foreground.png` | `CREATOR_META_AND_LIBRARY_VERIFIED`；hash一致；trimType=none；Library 2172×724、offset=(0,0) |

### Creator 首次导入身份记录

以下 UUID 来自 Creator 3.8.8 实际生成的 `.meta` 文件；`6c48a` 是 Texture2D 子资源键，`f9941` 是 SpriteFrame 子资源键。SHA-256 对应 Creator 工程 PNG，与各自行的美术源 hash 相同。所有 SpriteFrame 为 `pivot=(0.5,0.5)`、`packable=true`；Texture2D 设置为 `wrapModeS/T=clamp-to-edge`、`minfilter/magfilter=linear`、`mipfilter=none`。四份 `.meta` 与对应 Library SpriteFrame JSON 已交叉核对：`trimType=none`、完整 `2172×724` rect/originalSize，offset为0。

| 稳定资产 ID | Creator 实际工程文件 | SHA-256 | image 主 UUID | Texture2D UUID | SpriteFrame UUID | 当前 Library SpriteFrame 数据 | Creator 状态 |
|---|---|---|---|---|---|---|---|
| `STREET_BASE_01_L01` | `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png` | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` | `7108d512-5f6f-42d1-9411-c6f48de13939` | `7108d512-5f6f-42d1-9411-c6f48de13939@6c48a` | `7108d512-5f6f-42d1-9411-c6f48de13939@f9941` | `rect=2172×724; originalSize=2172×724; offset=(0,0); trimType=none` | `.meta + Library JSON一致` |
| `STREET_BASE_01_L02` | `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png` | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` | `c788f23d-127c-48a9-890c-36679d56dce4` | `c788f23d-127c-48a9-890c-36679d56dce4@6c48a` | `c788f23d-127c-48a9-890c-36679d56dce4@f9941` | `rect=2172×724; originalSize=2172×724; offset=(0,0); trimType=none` | `.meta + Library JSON一致` |
| `STREET_BASE_01_L03` | `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png` | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` | `8fae7865-9c46-46f6-8484-849ebe8a6634` | `8fae7865-9c46-46f6-8484-849ebe8a6634@6c48a` | `8fae7865-9c46-46f6-8484-849ebe8a6634@f9941` | `rect=2172×724; originalSize=2172×724; offset=(0,0); trimType=none` | `.meta + Library JSON一致` |
| `STREET_BASE_01_L04` | `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png` | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` | `685d480f-3b1a-4f77-b796-79b9ec5de834` | `685d480f-3b1a-4f77-b796-79b9ec5de834@6c48a` | `685d480f-3b1a-4f77-b796-79b9ec5de834@f9941` | `rect=2172×724; originalSize=2172×724; offset=(0,0); trimType=none` | `.meta + Library JSON一致` |

镜头控制脚本首次导入 `.meta`：`apps/client/assets/labs/menu/scene1_camera_controller.ts`，Creator 生成 TypeScript 主 UUID `9ceb8fd6-3853-4688-aeb0-c736616a614e`。该脚本资源身份真实，但当前没有 Creator 生成的 Prefab、独立 Scene 或其 UUID。

| 关联对象 | 美术路径与描述 | SHA-256 / 审核用途 | Cocos 接入状态 |
|---|---|---|---|
| `STREET_BASE_01_MASTER` | `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`；可编辑四层母版 | `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`；Gate2 v0.3 溯源 | **不接入**；不能作为运行纹理 |
| `STREET_BASE_01_REVIEW` | `deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png`；同尺度重组审核图 | `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd`；Gate2 v0.3 画面核对 | **不接入**；不能代替四层运行纹理 |
| `STREET_BASE_01` | 四层共同组成的背景对象；无额外美术贴图 | 既有逻辑对象 ID；独立入口与未来组合入口共用一套资源 | `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab` Creator 源 JSON 与 .meta 均已存在；importer=prefab、imported=true，主 UUID=`2d697fb3-01f0-4330-a180-a9c162310bf8`；四层 SpriteFrame 依赖已写入 Prefab 并逐项静态核对 |

原 `UNIT-MENU-TECH-DESIGN-001 v0.2` 的 `apps/client/assets/units/background/StreetBase.prefab` 只是候选路径。本轮为统一文件命名提议 `background/prefabs/pf_street_base_01.prefab`；两个路径都不代表已导入。旧 `UNIT-MENU-BASE-ASSET-001` 空景候选已取消，不能用其源文件或资源身份填本批状态。

## 后续Prefab/Scene与运行证据回填

四张 PNG 的 Creator 实际工程目录、文件名、SHA-256、image 主 UUID、Texture2D 子 UUID、SpriteFrame 子 UUID及子资源键已在上表登记；四份 Library JSON 均显示完整rect/originalSize为2172×724、offset=(0,0)，`.meta trimType=none`与Library几何相符。Creator版本为3.8.8；导入commit、Prefab源文件路径已确定，四层 SpriteFrame UUID 已填入源 JSON；Creator `.prefab.meta`主 UUID `2d697fb3-01f0-4330-a180-a9c162310bf8` 已登记；UnitSamples.scene 的 streetBasePrefab 已序列化该 Prefab UUID。Creator 编辑器运行画面与交互证据仍待验证。Art复核源图对应和视觉，Tech复核身份链，QA在后续获批矩阵下验证运行。Prefab/Scene和运行引用字段仍待补，不填虚构UUID、截图或`PASS`。

资源替换时追加记录：日期、源与新 Artifact 版本、旧/新 SHA-256、是否保持 `.meta` UUID、受影响的 Prefab/Scene、专业和用户审批及复验结果；旧记录保留追溯。其他单元资源未来按同一字段增加条目，不复用本批 ID。
