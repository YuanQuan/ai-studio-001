# U01 六件挂件｜计划资源清单 v0.2

**状态：仅方案，以下新版文件都尚不存在。**稳定候选 ID 用于追溯；交付时另列真实文件、SHA、alpha 盒、PSD 层、导入状态。原四张 PNG 和原 PSD 见既有已批登记，不因本方案改名或改 UUID。

| 候选资产 ID | 挂件 / 独立性 | 计划 PSD 层与透明输出 | 当前 Client 状态 |
|---|---|---|---|
| `U01_PROP_LANTERN_A` | 孔明灯 A；纸罩、光、尾可在组内分调 | 独立组 `prop_lantern_a`；计划 `props/u01_prop_lantern_a.png`，2172×724、同原点 RGBA | 未制作、未导入、无 UUID；接入路径待 Tech/Client 定。 |
| `U01_PROP_LANTERN_B` | 孔明灯 B；不与 A 镜像合图 | 独立组 `prop_lantern_b`；计划 `props/u01_prop_lantern_b.png`，同规格 | 同上。 |
| `U01_PROP_SOUL_BANNER` | 短月白引魂幡；杆、布、结可分调 | 独立组 `prop_soul_banner`；计划 `props/u01_prop_soul_banner.png`，同规格 | 同上。 |
| `U01_PROP_BRIDGE_SIGN` | “奈何桥”桥牌；牌、系带、三字可分调 | 独立组 `prop_bridge_sign`；计划 `props/u01_prop_bridge_sign.png`，同规格 | 同上。 |
| `U01_PROP_ROAD_SIGN` | “黄泉路→”路牌；杆、面、字、箭头可分调 | 独立组 `prop_road_sign`；计划 `props/u01_prop_road_sign.png`，同规格 | 同上。 |
| `U01_PROP_FENGDU_LETTERS` | “酆都城”右牌楼字片；三字可分别微调 | 独立组 `prop_fengdu_letters`；计划 `props/u01_prop_fengdu_letters.png`，同规格 | 同上，旧木匾未修改。 |

计划 PSD 路径为后续**资源任务获批开工时**的 `deliverables/art/U01-GENTLE-UNDERWORLD-ASSET-001/<新版本>/psd/u01_gentle_underworld_props.psd`，六张图归同任务版本的 `props/`；这里没有提前创建它们。另附清单记录每图局部 alpha bbox、初始画布坐标、pivot、预览顺序以及整景重组。新增图可能增加纹理页/内存/Draw Call；首图前 Tech 估算，Client 接入后实测。当前客户端只有四场景节点，程序单独移动六件还需独立接入任务。本方案阶段不改变 `project/ASSET_HANDOFF_REGISTRY.md` 中原正式资源身份。
