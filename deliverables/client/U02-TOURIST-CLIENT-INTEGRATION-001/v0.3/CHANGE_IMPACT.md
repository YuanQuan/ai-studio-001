# U02 正式序列帧替换：Client 只读影响审计

日期：2026-10-08  
范围：准备将 U02 当前 20 帧（walk/run/happy/sad = 6/6/4/4）替换为 VFX 正在制作的 40 帧（10/10/10/10）。本文件是只读技术影响审计；本轮未改客户端源码、PNG、Prefab、Scene、登记表或任务状态。具体 PNG Gate2 尚未批准，Client 不得接入。

## 结论

这次替换不只是追加 20 个 SpriteFrame：当前适配器把总帧数 20、各动作帧数 6/6/4/4、所有帧脚点 `(256,440)`、挂点版本 `U02-FULL-A/formal-v0.1` 都写成了有效性条件。新数据必须带完整 40 帧的逐帧脚点与四类挂点，并重新构建帧 manifest、mounts、Creator Scene 绑定与正式资源登记。旧批的 `happy/sad=once_hold` 与新样张预期 loop 有播放语义变化；需要以经批准的 VFX manifest 和现有产品/逻辑契约落实，不得由 Client 静默设定。

## 可恢复旧版基线

权威旧版证据是 `deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.2/RESOURCE_AND_FRAME_AUDIT.json` 与 `evidence/R5_BUILD_MANIFEST.json`。v0.2 自报的关键源身份如下：

| 资源 | v0.2 / R5 记录的 SHA-256 | 恢复说明 |
|---|---|---|
| `apps/client/assets/UnitSamples.scene` | `E8D052751125F49895CF79C0C4B4CEFC2C6BB6118A03F38D6F7F3D3A6B127E94` | R5 绑定了 U02 Prefab、3 份 JsonAsset、20+4 SpriteFrame；保留 U01 prefab UUID `2d697fb3-01f0-4330-a180-a9c162310bf8`。 |
| `apps/client/assets/units/ghost-customer/UG_GHOST_01.prefab` | `19750FA4F70144C348965CCED01AE4B3582EED6B12B94B2A28A6F60E98A1FCBF` | UUID `e94ff176-13d1-4691-b958-61765f95cd89`。运行时 `TouristView` 创建 MirrorRoot 和 Back/Body/Front 层。 |
| `apps/client/assets/units/ghost-customer/data/ug_ghost_01_asset_map.json` | `BA093DD594F432A9CF4E1D3C30200CE3854804AC3C9DFB8EDD85F3A1113DE725` | 当前 map 登记旧 Art/Client 资源版本。 |
| R5 构建 | builder task `1791350947808`；build log `5EECA6DB510254649A9CE543D5F79E5837099CD358A6465F0AABB8DE50312765` | `evidence/R5_BUILD_MANIFEST.json` 记录 83 文件 SHA；用于保留旧运行结果身份。 |

审计时只读计算到的工作树 SHA：Prefab 与 asset map 与上述记录一致；Scene 为 `FB3084C097B2055A13EFC4AD8166461058344146D98C85A152487B4AD8D39EBB`，帧 manifest 为 `120F5A49DA36CB7BB09301B5BD2DE6186FB20817D7B6CBF278E1EDF856574AA9`，mounts 为 `0F18D501F735F6B217CF8B757208B92C`，Adapter 为 `262D83CFBE5A999E60E3253FF30CBA785F929CC6DEDD06C96F9B337BFC922735`。Master 已只读核实 Scene SHA 差异来源：当前 `HEAD` 的 Scene 最后提交为 `0fda026`（2026-10-08 21:21 +08，U03 六店 UnitSamples 集成），当前 Scene 工作树无未提交改动；v0.2/R5 hash 早于该 U03 集成。因此它是合法后续基线，后续 U02 改动必须以当前 HEAD 为底保留 U03 内容，不能用 v0.2 Scene 回滚覆盖。旧 R5 Artifact/构建身份仍是 U02 旧运行结果的历史恢复依据。

## 逐项影响与建议执行顺序

| 对象 | 当前事实 / 影响 | 获 Gate2 后的具体操作 |
|---|---|---|
| VFX 输入合同 | VFX Task 定义 4 动作、每动作不超过 10 帧、原画布 512×512、独立附件和逐帧 `head/face/wristNear/wristFar/foot`；具体导出 PNG 尚未批准。 | 锁定同一份已批准的 `FRAME_MANIFEST.json`、`FRAME_MOUNT_MANIFEST.json`、实际 PNG、contact sheet、recomposition、源/导出 SHA 与审批记录；核对正好 40 唯一 frameId、每动作 index 连续 0–9、文件与哈希完整。 |
| 帧/动作 manifest | Creator 当前 `frames/ug_ghost_01_frame_manifest.json` 和 mounts JSON 表示旧 20 帧；动作 frameCount 为 6/6/4/4。Adapter `frameCount()` 直接读取它。 | 复制已批数据到正式 schema；更新总数、逐动作数量、文件路径、逐帧 duration/playback、初始帧和来源版本。保留稳定动作名与 `walk_00` 初态，校验索引无空洞/重复、duration 为正且 mounts 与帧一一对应。更新两份 `.meta` 仅在 Creator 重导入按规则产生变化时；已有 UUID 应保持。 |
| Adapter 硬编码 | `tourist_adapter.ts` 的 `validate()` 要求 `frames.length===20`、mounts/bodySprites/frame maps 均为 20，并要求 `expected={walk:6,run:6,happy:4,sad:4}`；注释称 20 approved frames；每个 frame 的 `mountVersion` 固定为旧批。 | 以 manifest 中声明的合法数量作为唯一校验源，要求 body/mount/manifest 的 40 条记录一致，动作数各 10、index 连续、每帧 duration 一致，并用获批资源版本标记 mountVersion；移除旧数量常量与误导注释。保持已有 1–10 状态控制上限。 |
| 脚点/挂点与附件层 | `tourist_view.ts` 根据每帧 `data.foot` 和 mounts 做附件坐标换算；Adapter 当前逐帧校验 `foot=(256,440)`。帽/眼镜 front、手环 back+front；body 左右镜像同一 MirrorRoot。 | 若新 VFX manifest 继续全帧同脚点，仍逐项验 40 条；若不同，使用各帧 manifest 值且复核漂移/接地。禁止把旧 mounts 复制到新增帧。检查每帧 mount `visible/valid`、动作遮挡、左右镜像、手环双层与附件 pivot/尺寸兼容；超过允许漂移或合同缺失时回 VFX/Art 澄清。 |
| 播放语义 / duration | `TouristStateController.tick()` 累加每帧 duration，末帧 `once_hold` 会停在末帧进入 `holding`，`loop` 则回到 0。旧 manifest 的 walk/run 为 loop、happy/sad 为 once_hold；用户已确认的新四动作样张为 loop 方向。 | 以已批 VFX playback/duration 为准更新 manifest，逐动作算总循环时间与帧率；happy/sad 改 loop 会影响“保持中”状态文案、切动作及复位验收。确认产品是否仍要求一次播放/保持；如 VFX 成品明确 loop，记录并让 Logic/UI/QA 按该语义校验。不可单由 Client 改状态机含义。 |
| Creator PNG/meta/UUID | 当前 20 PNG 各有 Creator `.meta` 和 SpriteFrame UUID；R5 Scene 显式绑定 20 body+4 accessory SpriteFrame，Prefab UUID 稳定。新 PNG 导入会产生新 UUID。 | 获批后按命名规则放入 `apps/client/assets/units/ghost-customer/frames/`，不覆盖历史来源副本；Creator 3.8.8 导入生成 `.meta`，记录 image/Texture2D/SpriteFrame UUID、导入尺寸/trim/full-canvas 和 PNG SHA。检查旧帧的处置与引用解绑，旧审批档案保留。 |
| Scene/Prefab | Prefab 自身是单根资源且运行节点由 `TouristView` 动态创建；Scene 序列化 Gallery 组件持有帧数组/JSON 引用。只替换帧通常无需变更 Prefab 根或 UUID，但新序列帧数组要求 Scene 绑定变化。 | Scene 更新为新 manifest/mounts JsonAsset、40 SpriteFrame（附件仍 4）完整映射；保持 `UG_GHOST_01` Prefab UUID、U01 引用和一实例结构。用 Creator 受控脚本/API更新并做磁盘重载静态引用审计；只有实际需要才改 Prefab，保持 UUID 和节点结构。 |
| 资源登记 | `project/ASSET_HANDOFF_REGISTRY.md` 记有旧 24 条资源、PNG SHA 和 Creator 三层 UUID；`data/ug_ghost_01_asset_map.json` 是 Scene/Adapter 资源映射；Art 侧 `project/ASSET_MANIFEST.md` 引用生产版本。 | 在同一个新集成 Artifact 版本中新增 20 帧登记（稳定 asset/frame ID、Art 源路径/version/SHA、客户端路径/SHA、SpriteFrame UUID、状态、manifest/mount版本）；给替换下线的旧帧标明历史/取消活动引用，不删除审批归档。同步 asset map、handoff registry 和适用索引；未入库 UUID 写计划态。 |
| QA/交付 | R5 为限定鼠标/UI 冒烟；旧 QA 明确全帧、40 组、真实触控、全帧镜像、节点层序/实例、Web/设备性能为 NOT_TESTED。 | 本集成版本需要新静态 audit、Creator 导入重载、构建 manifest 和实际 HTTP/IAB 运行证据；测试四动作 40 帧全覆盖/循环边界、左右×动作×装扮组合（目标矩阵 40 组需按 QA Plan 定义）、所有挂点遮挡/脚点、重入/切换/重置、完整 U01 回归、屏幕适配及性能。由 QA 按正式计划执行并独立提交 TEST_REPORT；不得沿用 R5 限定冒烟作为通过。 |

## 需上游提供后才能实施的输入

1. 实际 40 张正式 PNG 与明确的 Gate2 `USER_APPROVED` 版本/记录，逐图 SHA、命名和客户端目标路径。
2. 同版完整 frame manifest 与 mount manifest：40 帧 ID/index/duration/playback、原点/脚点、四挂点坐标/valid/visible、逐帧遮挡、朝向与画布；附件独立性与原有附件资产兼容说明。
3. 已批准重组图/contact sheet 与 VFX/Art/Tech 对实际帧的专业 Review 结论；不可从“样张已确认”推定导出 PNG 已批。
4. 新 `happy/sad` loop 与产品一次播放/保持行为之间的确认结论（若产品已批准规则约束 VFX，则提交对应引用）。
5. Producer/Master 对 Scene 当前 SHA 不等于 v0.2 记录的基线解释，及正式新版本/Task 输入和修改授权；正式接入应按新 Artifact 版本提交，不改写 v0.2 R5 历史证据。

## 后续实施与验证清单

1. Gate2 到位后，对批准 PNG、manifest、mounts、recomposition 与注册信息逐项 hash/结构核验；拒收缺帧、重复 ID、坐标/时长缺失或审批版本不匹配的包。
2. 先更新数据适配与合同校验，再由 Creator 导入；保留 PNG 字节不变，检查 40 SpriteFrame UUID/尺寸/裁剪元数据。
3. 更新 Scene 引用及 asset map/登记表；重载工程核 UUID 和嵌套关系，确认 Prefab UUID、U01 UUID、序列化引用无意外变化。
4. 使用项目当前 Creator 3.8.8 的受控脚本/CLI执行定向 TypeScript 检查、静态 Scene 链接审计、正式 Web 构建并记录构建身份；通过 loopback HTTP 与 Codex 内置浏览器观察真实构建。
5. 由 Client 记录动作切换、末帧到首帧、happy/sad loop、左右翻转、40 帧挂点/脚点与装扮层序运行证据；再由 QA 执行批准矩阵、输入、U01 回归与性能阈值，分别记录 PASS/FAIL/NOT_TESTED。

## 风险提示（只针对实施准备）

- **高：播放语义不一致。** 新 loop 与旧 once_hold 的 UI phase 和验收语义不同。
- **高：挂点沿用。** 新动画姿态改变四类挂点；复制旧坐标会造成穿插、漂移或附件贴错部位。
- **高：基线歧义。** 当前 Scene SHA 与 v0.2 R5 记录不一致，需要先辨明来源，确保可恢复。
- **中：UUID/Scene 绑定遗漏。** 仅更新 manifest 而未把新增 20 SpriteFrame 绑定进 Scene 会导致 adapter 无资源或整体 invalid。
- **中：资源成本上升。** 活跃主体帧从 20 增至 40（2 倍）；全 512² RGBA8 原始像素内存理论值由约 20 MiB 增至约 40 MiB（未计纹理压缩、引擎缓存、附件/构建开销）。需按批准 QA 阈值测量，当前不推断实机结果。

## 本轮边界与验证结果

本轮仅读取旧 Artifact、源码、Scene/Prefab、登记文档并计算 SHA-256。未导入新资源、未运行 Creator 构建、未运行游戏或 QA；无新资源 runtime 证据。正式实现仍需新 Task/版本、获批 PNG Gate2 与上述完整输入。
