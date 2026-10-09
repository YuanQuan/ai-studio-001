# U00 现有资源复用核查 v0.1

核查对象为本地 `apps/client/assets` 当前文件与 `.meta`，路径均为工程相对路径；UUID 为当前导入记录，不代表 U00 已接入。资源保持原字节与现有 `.meta`；实施前重新核对哈希、引用及审批版本。

| 组 | 当前工程资源 | Prefab UUID | 已批资源与当前实施状态 |
|---|---|---|---|
| U01 背景 | `apps/client/assets/units/background/prefabs/pf_street_base_01.prefab` | `2d697fb3-01f0-4330-a180-a9c162310bf8` | 五层重绘资源 v0.6 `USER_APPROVED`；U01 Client v0.1 `USER_REVIEW` |
| U02 顾客 | `apps/client/assets/units/ghost-customer/UG_GHOST_01.prefab` | `e94ff176-13d1-4691-b958-61765f95cd89` | VFX 40 帧 v0.2 `USER_APPROVED`；U02 Client v0.3-R2 `USER_REVIEW` |
| U03 奶茶 | `apps/client/assets/units/shops/milk_tea/prefabs/pf_mt_shop_01.prefab` | `fcda6688-f33b-458a-8fe9-96c619c8eb09` | 六店 Gate2 v0.4 `USER_APPROVED`；U03 Client v0.1/R3 `USER_APPROVED`，示例 QA 线已取消，Owner 自检 |
| U03 糖画 | `apps/client/assets/units/shops/sugar_art/prefabs/pf_shop_02.prefab` | `9292333f-8d61-471a-ad72-7f3e7cdd1921` | 同上 |
| U03 炭烤 | `apps/client/assets/units/shops/charcoal_grill/prefabs/pf_shop_03.prefab` | `9a6dabaf-8b71-4eb8-99d0-9b318a3d66bc` | 同上 |
| U03 理发 | `apps/client/assets/units/shops/barber/prefabs/pf_shop_04.prefab` | `6e542de1-ffe7-4b03-bfa8-eb0efc242301` | 同上 |
| U03 花灯 | `apps/client/assets/units/shops/lantern/prefabs/pf_shop_05.prefab` | `b27473c3-9aad-49be-afed-a856881a5bd6` | 同上 |
| U03 投壶 | `apps/client/assets/units/shops/pitch_pot/prefabs/pf_shop_06.prefab` | `50b148c0-c848-41c9-9af5-ef9b0eb3172c` | 同上 |

引用链：`UnitSamples.scene` 的 `UnitSampleGallery` 持有背景、顾客、六店 Prefab 和 U02 三份 JSON 与帧数组；`UnitSampleGallery.ts` 使用 `Scene1CameraController`、`TouristStateController`、`ApprovedTouristAdapter`、`TouristView`、`SHOP_IDS/SHOP_PREFAB_NAMES`。五层 Prefab 子节点为 `L01_Sky`、`L02_Mountains`、`L03_Ground`、`L04_WaterBridge`、`L05_WaterGrass`。六店现有定义顺序为奶茶、糖画、炭烤、理发、花灯、投壶；桥是 U01 背景地标，U00 在炭烤和理发之间留桥位，不修改六店 ID 顺序。

源纹理校验锚点：U01 五张 `apps/client/assets/units/background/textures/tex_street_base_01_l0*.png` 当前 SHA-256 依次为 `7a6d0edb296e09b3135f797039c3927dc48f037f5cb7efd86d338e24b19e05e8`、`4c6a688cf3a9eeb2f524adf29e8db3ee8496a8b7662de5ea045e9424edc2eac8`、`001ec0f30475c98b4bd7a9d424cc5a299101bff0add97fadec7667a62c69229d`、`7305e1185280f6349149e8902b01f6c5c983fc1348ef046a7b11a9a343c63de1`、`f0597e3c9d5dea2b1e81ec86d94fdfb7c54144c235ff23665f39a4d01049b1d5`。U02 当前帧清单 `apps/client/assets/units/ghost-customer/frames/ug_ghost_01_frame_manifest.json` 为 `U02-VFX-A/v0.2`、40 帧、四动作各 10 帧、SHA-256 `7247eea22edee10ebcd87e3d96a060b86ad4809cb90b88c94894334d207de191`；每帧源文件哈希见该清单及 `data/ug_ghost_01_asset_map.json`。U03 六店 12 张纹理来源/版本与哈希以获批 `deliverables/art/U03-SHOP-ASSET-001/v0.1/SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json` 为准，批准清单 SHA-256 `C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191`；实施时逐个核当前工程纹理与此清单对应关系。

审批事实源：`tasks/U01-FIVE-LAYER-REDRAW-ASSET-001/ARTIFACT_APPROVAL.json`、`tasks/U01-FIVE-LAYER-CLIENT-REPLACE-001/ARTIFACT_APPROVAL.json`、`tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json`、`tasks/U02-TOURIST-CLIENT-INTEGRATION-001/ARTIFACT_APPROVAL.json`、`tasks/U03-SHOP-ASSET-001/ARTIFACT_APPROVAL.json`、`tasks/U03-SHOP-CLIENT-IMPLEMENT-001/ARTIFACT_APPROVAL.json`。本审计不增加或改变资源、UUID、Prefab 层级及美术版本。
