# U03 奶茶样张明暗基准变更｜同批技术复签

批次 `U03-SHOP-FAITHFUL-REDRAW-V03`。用户查看 3072×1024 三面板附件 `codex-clipboard-036dfc20-ee0b-4a2a-9b7d-3f98ab76f018.png`（据 Master 核对，其内容对应本地 `preview/shop_01_sample/shop_01_target_v02_v03_same_canvas_r1.png`，该本地文件已核尺寸 3072×1024、SHA-256 `B388976A59692BA78827D4EA9218FAE82DC460E110E8CBAAD5D47AD3F5BBA081`）后明确选择**中间 v0.2 的店体风格与明暗**；左侧目标小图和右侧 v0.3 r2 的阴影均过深。此具体视觉选择优先于先前“整店高保真重建”的方法倾向。Art `LIGHTING_AND_STYLE_CORRECTION.md` SHA-256 `04239BFC37616ED90AA8C1E8DF767D4EDF440855CDB39865723882400ED89D1E` 已把变化限定在来源与明暗基准；原 `PRODUCTION_PLAN.md` SHA `2830BC2D…` 和 `VISUAL_ANCHORS.md` SHA `98FD35F7…` 保留历史不改。

**Tech 对 01 下一张样张的生产方法复签通过。** 可优先继承中间 v0.2 的现有 PSD/body 主体、木瓦和经营物明暗，只对右檐小牌高清修订并处理必要的牌后遮挡；若牌仍无法与主体光色融合，局部编辑受影响对象。无需为了沿用 r2 重绘流程而再次整体替换店体。选中中间重组图 `deliverables/art/U03-SHOP-ASSET-001/v0.2/preview/sign_revision_v02_final/shop_01_recomposed.png` 已核 SHA-256 `8C24719BE4D461024A5139973BD418B4093803E3D48F17A539BAD35515248466`；对应可编辑 v0.2 PSD `shop_01_milk_tea_r2_sign_revision_v02.psd` SHA `7362E9B8…`。v0.3 r2 PSD/切片保留为 `REVISE` 历史候选，技术合成误差为零不转成视觉 `PASS`。

规格不变：每店 1024×1024 RGBA、foot `(512,900)`、body/sign 两张同画布同原点，现有客户端资源身份与 UUID 保留。01 两片未压缩源像素估算约 8 MiB；下一张实际 alpha 范围、牌与檐/灯/窗口遮挡、层映射、画布边距和显示像素待实图测。若新 body 沿用旧字节，应核 SHA；若有局部改动，登记遮罩与变化范围，不把“零像素差异”设成视觉验收目标。

Art 本补充同批签认后制作新 01 可编辑样张；在同一蓝底、1024 画幅、主体 bbox/脚点、390×844 与 720×1280 视窗中直接对比选中的中间风格与新 PSD 重组，逐锚点核店体暗部通透度、木瓦高光、牌与主体融合及奶茶身份。Art 的视觉结论先于 Tech 实图生产后验；任一关键项 `REVISE` 则继续修 01，不扩 02–06。新 PSD、切片、Creator 运行、性能现在均 `NOT_TESTED`。全量扩批须按实际首样复签；六店自行切图完成后仍直接交用户 Gate2 审核，批准前不替换 Client 贴图。
