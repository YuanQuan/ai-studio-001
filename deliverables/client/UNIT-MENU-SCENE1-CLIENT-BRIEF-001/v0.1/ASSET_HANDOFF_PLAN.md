# 单元示例1｜美术到 Creator 资源交接计划 v0.1

依据 Gate2 用户批准包 `UNIT-MENU-FOUR-LAYER-CUT-001 v0.3` 和 Tech 资源规范 `UNIT-MENU-SCENE1-TECH-RUNTIME-001 v0.2`。此计划供 Client 开工包审核。资源登记事实源是 [项目资源交接登记表](../../../../project/ASSET_HANDOFF_REGISTRY.md)；本附件逐项列清 S01 使用的四张图。工程资源仍未导入。

## 1. 交付与身份映射

根美术目录：`deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/`。Creator 正式目录和文件名均为**计划值**，适用统一小写 ASCII `snake_case` 与 `tex_` 类型前缀。PNG 须从批准目录逐字节复制，工程 hash 与美术源 hash 一致。四张均应保持原始 2172×724 全画布、原点 `(0,0)`，不按透明边裁切；同尺寸、居中锚点与顺序由 Prefab 计划锁定。

| 稳定资源 ID | 资源描述/显示顺序 | 美术实际目录 | 美术文件名 | 版本/hash | 计划 Creator 目录 | 计划 Creator 文件名 | 当前导入状态/UUID |
|---|---|---|---|---|---|---|---|
| `STREET_BASE_01_L01` | 后层1：天空、月亮、云、星；水平系数 0.3 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `01_01_94477409.png` | Gate2 v0.3；`fbc51da7c1c40ca72bc158e88c3b378d01ba98cf0e3440d4bb8af17b0862cfa1` | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l01_sky.png` | `PLANNED_NOT_IMPORTED`；所有 UUID 空缺 |
| `STREET_BASE_01_L02` | 后层2：山峦、远方建筑；水平系数 0.8 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `02_02_933386cf.png` | Gate2 v0.3；`3ff0afcb980f460a4455ef2ecb6b2c1b85a894f30b9bf1d5b086bc54292db478` | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l02_mountains.png` | `PLANNED_NOT_IMPORTED`；所有 UUID 空缺 |
| `STREET_BASE_01_L03` | 后层3：地面、树木、右侧走廊；水平系数 1.0 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `03_03_23db4183.png` | Gate2 v0.3；`af07fc566d7461acc314e2805b4a1419c44f5d64a7f15da8c5d489be2a29fb1d` | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l03_ground.png` | `PLANNED_NOT_IMPORTED`；所有 UUID 空缺 |
| `STREET_BASE_01_L04` | 前层4：桥、栏杆、河水、前景；水平系数 1.0 | `deliverables/art/moonlit_psd_20261005_v2_raw/psd_full_canvas_layers/` | `04_04_c82fb659.png` | Gate2 v0.3；`8a715d77b09fcf004cd6eecf20f913f6650b257220535eff55be58ddf7bdde5b` | `apps/client/assets/units/background/textures/` | `tex_street_base_01_l04_foreground.png` | `PLANNED_NOT_IMPORTED`；所有 UUID 空缺 |

Prefab 计划身份：稳定逻辑 ID `STREET_BASE_01`，描述“四层固定场景背景，示例1及未来第7项共用”；计划 Creator 目录 `apps/client/assets/units/background/prefabs/`，文件名 `pf_street_base_01.prefab`，状态 `PLANNED_NOT_CREATED`，Prefab UUID 未生成。四层 PNG 的image 主 UUID、Texture2D 子 UUID、SpriteFrame 子 UUID均未生成；Scene 对应实例与引用 UUID未生成。不能在文档草案中创建/编造 UUID。

## 2. 仅用于溯源、不导入的文件

| 稳定记录 ID | 美术目录 | 文件名 | 描述/hash | Creator 状态 |
|---|---|---|---|---|
| `STREET_BASE_01_MASTER` | `deliverables/art/moonlit_psd_20261005_v2_raw/` | `moonlit_four_layers.psd` | 可编辑母版；`428a7b1cbee4fb775d90d84401f4558f12fb93b0e3d60f57067d574ce969d6ed` | `DO_NOT_IMPORT`，只供版本追溯 |
| `STREET_BASE_01_REVIEW` | `deliverables/art/moonlit_psd_20261005_v2_raw/` | `overall_from_psd.png` | Gate2 同尺度重组核图；`8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd` | `DO_NOT_IMPORT`，不作为背景纹理 |

用户批准的是上述 PSD、PNG 与重组效果组成的具体 Gate2 v0.3，不等于批准 Client Brief 的镜头体验候选或 Creator 运行结果。没有需要 Client 执行的像素修改；Client 不修边、裁切、调色、补画、压缩替换或另切。

## 3. Creator 实际导入后的回填字段

四张图各自记录：实际工程目录、实际文件名、导入后文件 SHA-256、Creator 精确版本、导入 commit、PNG `.meta` 路径；分别记录 image 主 UUID、`subMetas` 的 Texture2D 子 UUID 与 SpriteFrame 子 UUID、对应键名。另记像素尺寸、Sprite trim/offset/pivot、过滤/alpha、mipmap、压缩配置与目标 Web 构建的实际格式。image 主 UUID 不能代替两个子资源 UUID。

Prefab 记录实际工程目录/文件名、`.prefab.meta` 主 UUID、四层实际 UUID 依赖与节点引用；Scene 记录实际场景路径、`STREET_BASE_01` 实例、Prefab UUID 与允许覆盖字段。实际目录/文件与计划不一致时先更新本登记并说明 Tech 评审，不让计划路径冒充事实。

导入追踪链：`Gate2 PNG path+SHA-256 → Creator image 主 UUID / Texture2D UUID / SpriteFrame UUID → Prefab UUID → Scene 实例 → Git commit / Creator build`。运行画面和测试矩阵证据由实施/QA 任务回填，不以导入记录代替运行 PASS。资源替换保留旧行和 hash，说明受影响引用、审批版本与复验状态；稳定 ID 不用于不同图像内容。
