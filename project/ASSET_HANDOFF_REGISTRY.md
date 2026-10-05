# 美术交付与 Cocos Creator 正式资源交接登记

当前登记版本：`UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.2`（已批准）。2026-10-05 Client 实施时已将四张获批 PNG 按字节复制至下表计划路径并复核 SHA-256；Creator 3.8.8 启动遇到 ProgramData engine cache `EPERM`，编辑器未完成索引，未生成 `.meta`。因此四项均为“文件已复制、Creator 未导入/阻塞”，下表工程路径仍为目标路径，不能据此称正式资源已导入。此表记录美术实际交付和 Creator 实际状态；更新需注明来源 Artifact、版本、责任人和变更原因；具体命名约定见 `deliverables/tech_lead/UNIT-MENU-SCENE1-TECH-RUNTIME-001/v0.2/RESOURCE_PATH_AND_NAMING_SPEC.md`。

## 示例1四层背景｜已批准美术交付，工程未导入

美术批准范围：`UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` Gate2；四张 PNG 均为 `2172×724 RGBA`、左上原点 `(0,0)`、从后到前排列。下列 SHA-256 来自 `deliverables/art/UNIT-MENU-FOUR-LAYER-CUT-001/v0.1/CUT_MANIFEST.json`，用于每次交接逐件核对；旧清单中的候选状态不覆盖 v0.3 的用户批准记录。

| 稳定资产 ID | 美术交付目录 | 美术文件名 | 用途、层序与水平位移 | 美术 SHA-256 / 版本 | 计划 Creator 正式目录 | 计划 Creator 文件名 | 工程实际状态 |
|---|---|---|---|---|---|---|---|
| `STREET_BASE_01_L01` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `01_01_94477409.png` | 背景第 1 层：天空、月亮、云、星；后景；0.3 | `fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l01_sky.png` | `COPIED_HASH_VERIFIED_CREATOR_IMPORT_BLOCKED`；目标字节已复核；无 `.meta`/UUID，待 Creator 索引后回填 |
| `STREET_BASE_01_L02` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `02_02_933386cf.png` | 背景第 2 层：山峦、远建筑；0.8 | `3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l02_mountains.png` | `COPIED_HASH_VERIFIED_CREATOR_IMPORT_BLOCKED`；目标字节已复核；无 `.meta`/UUID，待 Creator 索引后回填 |
| `STREET_BASE_01_L03` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `03_03_23db4183.png` | 背景第 3 层：地面、树木、右廊；1.0 | `af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l03_ground.png` | `COPIED_HASH_VERIFIED_CREATOR_IMPORT_BLOCKED`；目标字节已复核；无 `.meta`/UUID，待 Creator 索引后回填 |
| `STREET_BASE_01_L04` | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `04_04_c82fb659.png` | 背景第 4 层：桥、栏杆、河水与前景；1.0 | `8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b`；Gate2 v0.3 | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l04_foreground.png` | `COPIED_HASH_VERIFIED_CREATOR_IMPORT_BLOCKED`；目标字节已复核；无 `.meta`/UUID，待 Creator 索引后回填 |

| 关联对象 | 美术路径与描述 | SHA-256 / 审核用途 | Cocos 接入状态 |
|---|---|---|---|
| `STREET_BASE_01_MASTER` | `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`；可编辑四层母版 | `428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed`；Gate2 v0.3 溯源 | **不接入**；不能作为运行纹理 |
| `STREET_BASE_01_REVIEW` | `deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png`；同尺度重组审核图 | `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd`；Gate2 v0.3 画面核对 | **不接入**；不能代替四层运行纹理 |
| `STREET_BASE_01` | 四层共同组成的背景对象；无额外美术贴图 | 既有逻辑对象 ID；独立入口与未来组合入口共用一套资源 | **计划** `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab`；Prefab 文件/`.meta`/UUID 尚不存在 |

原 `UNIT-MENU-TECH-DESIGN-001 v0.2` 的 `apps/client/assets/units/background/StreetBase.prefab` 只是候选路径。本轮为统一文件命名提议 `background/prefabs/pf_street_base_01.prefab`；两个路径都不代表已导入。旧 `UNIT-MENU-BASE-ASSET-001` 空景候选已取消，不能用其源文件或资源身份填本批状态。

## Client 实际导入时回填

对每个 `STREET_BASE_01_Lxx` 分列回填**实际工程目录**、**实际工程文件名**及 SHA-256、Creator 精确版本、导入 commit，并从 PNG 的 `.meta` 区分记录 image 主 UUID、`subMetas` 下 Texture2D UUID、`subMetas` 下 SpriteFrame UUID（记录对应键及真实值，不将 image 主 UUID 冒充纹理 UUID），再记录尺寸、trim/offset/pivot、过滤/alpha/mipmap/压缩与 Web 实际格式。对 `STREET_BASE_01` 记录 Prefab 实际目录、文件名及其 `.prefab.meta` 主 UUID、四层实际依赖 UUID、示例 1 和组合入口的 Scene 实例及允许的覆盖字段。Art 复核源图对应和视觉，Tech 复核身份链，QA 在获批矩阵下验证运行。上述数据在真实导入前一律留空，不填虚构 UUID、截图或 `PASS`。

资源替换时追加记录：日期、源与新 Artifact 版本、旧/新 SHA-256、是否保持 `.meta` UUID、受影响的 Prefab/Scene、专业和用户审批及复验结果；旧记录保留追溯。其他单元资源未来按同一字段增加条目，不复用本批 ID。
