# U01 温和地府元素｜计划资源登记 v0.1

**状态：方案；新增内容、修订 PSD 和新导出图均未制作。** 既有正式四层及真实 Client UUID 见 `project/ASSET_HANDOFF_REGISTRY.md`。本表登记未来修订范围，不将计划路径或计划 ID 冒充已存在资源。小装饰合入现有四层，不独立生成第五张贴图、Prefab 或程序对象。

| 稳定资源 ID / 内部局部 ID | 描述与用途 | 当前实际美术文件 | 计划修订源/导出 | 当前 Client 文件与状态 |
|---|---|---|---|---|
| `STREET_BASE_01_MASTER` | 四层整体可编辑母版；保留已批原件 | `deliverables/art/moonlit_psd_20261005_v2_raw/moonlit_four_layers.psd`，2172×724，Gate2 v0.3，哈希见本方案制作计划 | **计划**：`deliverables/art/U01-GENTLE-UNDERWORLD-ART-PLAN-001/<获批后版本>/scenes/u01_gentle_underworld_four_layers.psd`；新版本另存、旧原件不覆盖 | PSD 不接入工程；新源未制作。 |
| `STREET_BASE_01_L01` | 天空/月云；0.3 视差 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/01_01_94477409.png` | 计划沿用同内容、2172×724、RGBA；本轮不修改 | `apps/client/assets/units/background/textures/tex_street_base_01_l01_sky.png` 已按旧版导入；本轮不修改。 |
| `STREET_BASE_01_L02` | 远山/楼；0.8 视差 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/02_02_933386cf.png` | 计划沿用同内容、2172×724、RGBA；本轮不修改 | `apps/client/assets/units/background/textures/tex_street_base_01_l02_mountains.png` 已按旧版导入；本轮不修改。 |
| `STREET_BASE_01_L03` | 地面/柳树/牌楼；包含 GU-01a/b、GU-03、GU-04 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/03_03_23db4183.png` | **计划**：获批后由修订 PSD 导出 `.../scenes/tex_street_base_01_l03_ground.png`，2172×724、RGBA、原点 (0,0)；当前无文件/新哈希 | 旧版 `apps/client/assets/units/background/textures/tex_street_base_01_l03_ground.png` 已导入；新版本尚未导入，未来真实 UUID 待 Client 核对。 |
| `STREET_BASE_01_L04` | 桥栏/河/前景；包含 GU-02 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/04_04_c82fb659.png` | **计划**：获批后由修订 PSD 导出 `.../scenes/tex_street_base_01_l04_foreground.png`，2172×724、RGBA、原点 (0,0)；当前无文件/新哈希 | 旧版 `apps/client/assets/units/background/textures/tex_street_base_01_l04_foreground.png` 已导入；新版本尚未导入，未来真实 UUID 待 Client 核对。 |
| `GU-01a/b`、`GU-02`、`GU-03`、`GU-04` | PSD 内部局部修改标签；分别为桥边花、桥心纹、左端景石、右端匾字 | 无独立文件 | 计划保存在修订 PSD 的命名工作子层，并合入 L03/L04；非单独贴图 | 无独立 Client 路径/UUID；不新增程序对象。 |

新 PSD、四层导出与同尺度重组图的具体路径、SHA-256、图层映射及审批编号只在**实际制作后**按真实文件登记；旧版的 Gate2 v0.3 与客户端 v0.2 身份继续独立保留。Art 完成文件、Tech/Client 核新旧层身份与导出兼容，用户批准具体新切图版本后，才由 Client 决定工程接入及 UUID 保留方式。本阶段不更新项目登记中的旧资源身份。
