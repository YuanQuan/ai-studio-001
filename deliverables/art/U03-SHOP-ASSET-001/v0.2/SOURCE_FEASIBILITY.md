# U03 六店牌匾源文件可行性检查 v0.2

检查日：2026-10-08。检查为只读：核对原 Gate2 候选清单、六张现有 PSD 的既有可见性报告、六份对应 manifest 及其全画布图层 PNG 存在性、01/04 构建源脚本与预览说明；未写入、转换或导出任何正式图片。`v0.1/source/`、`source/psd_work/`、历史 PSD 均有后续修订价值，应原样保留。

## 可复用事实

原候选索引 `../v0.1/SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json` 固定六张 PSD、各店 body/sign PNG、重组/静态视窗路径和 SHA；Art 旧清单只记录当时计划导入状态。后续客户端**已经正式导入旧版 12 张 PNG**，见 `../../../tech_lead/U03-SHOP-SIGN-REVISION-001/v0.1/TECH_PREFLIGHT.md` 对现有工程与 `../../../client/U03-SHOP-CLIENT-IMPLEMENT-001/v0.1/RESOURCE_IDENTITY_AND_UUID.md` 的只读核查。六个 Prefab 均有 body/sign/ground_contact，前两节点同坐标、同缩放，不能靠移动 sign 节点修正单店牌位。当前 `.meta`/UUID 与实际贴图 SHA 实施时仍需重读工程核对。各 `source/psd_work/shop_XX/<variant>/manifest.json` 所列图层源文件逐件存在，缺失数为 0。对应 `PSD_VISIBILITY_REPORT.json` 记载 `reference_source` 隐藏、其余工作层可见、合成与源预览像素一致；**未在本轮打开 Photoshop/Photopea 实测编辑、保存与再导出**。

| 店与本轮应继承 PSD | 已存语义层/可直接利用的部分 | 局部修订难点 |
|---|---|---|
| 01 `../v0.1/psd/shop_01_milk_tea_full_redraw_v04.psd` | 10 层；`sign_hardware/sign_board/sign_glyph` 可分别撤换，`body_roof/body_facade/interior/front/light/ground_contact` 可保留。`source/psd_work/shop_01/full_redraw_v04/` 与 `source/shop_01/build_milk_tea_full_redraw_v04.py` 存在。 | **直接查看旧 body PNG，居中横匾位置为明显矩形透明缺口**，故撤旧牌不能只换 sign，须在现有店体语义层内定向补檐口/帘幕等暴露像素，并将 body 变动纳入用户实际切片审批。右檐新牌挂点必须避开右灯与窗口。不能声称店体对象都具有可移动后的完整背面。 |
| 02 `../v0.1/psd/shop_02_sugar_art_zcool_b92_v03.psd` | 8 层；伞、经营物、光、地影与三层牌分开；`source/psd_work/shop_02/zcool_b92_v03/` 可继承。**直接查看旧 body PNG，旧右侧竖牌不在 body。**原 `sign_glyph` 含可单独定位抽取的“糖”字。 | 旧右侧大竖牌撤去后优先保持 body 字节不变；仅在确有可见缺口时限定补画并登记。新牌在车前偏右，需压住适当车体但不能遮轮、糖画，且须验证画布右下边界与地面接触区。 |
| 03 `../v0.1/psd/shop_03_charcoal_grill_zcool_b92_v03.psd` | 10 层；`sign_glyph` 与牌板/五金分离，炉、篷、烟和灯为可保留层；对应 `source/psd_work/shop_03/zcool_b92_v03/` 可继承。 | 牌文需从“炭烤”改“现烤”；新字来源许可与原字效匹配是主要门槛，不能截概念图文字。 |
| 04 `../v0.1/psd/shop_04_barber_full_redraw_v03.psd` | 10 层；三层牌独立，屋顶、店面、室内、前景、灯分区；`source/psd_work/shop_04/full_redraw_v03/` 与 `source/shop_04/build_barber_full_redraw_v03.py` 可继承。 | 剪梳图形替换字层可行；若要调整牌面，旧板也是整体生成图局部分割，无完整隐藏背面，需限定局部。 |
| 05 `../v0.1/psd/shop_05_lantern_zcool_b92_v03.psd` | 9 层；横牌三层独立，灯群、竹架、店体与灯光分离；对应 `source/psd_work/shop_05/zcool_b92_v03/` 可继承。 | 当前“花灯”横牌与目标大体吻合；优先保留原层，避免无谓重制。 |
| 06 `../v0.1/psd/shop_06_pitch_pot_zcool_b92_v03.psd` | 9 层；竖牌三层独立，壶箭/竹架/灯光分离；对应 `source/psd_work/shop_06/zcool_b92_v03/` 可继承。 | 当前“投壶”竖牌与目标大体吻合；优先保留原层，注意真实场景尺寸的字辨认。 |

01/04 的 `build_*full_redraw*.py` 明确写有“互斥语义 RGBA 区域”和隐藏原参考层，01 还单独绘两段短挂件；它们是**可编辑局部层**，不是每件物体都已补齐被挡背面。02/03/05/06 的 `sign_*` 源层也并不能自动解决移牌后的遮挡缺口。由此判断：现有源足以开展定向修改，但 01、02 的撤旧牌和新位置需先做可编辑样张与局部补洞验证；不得仅把新牌覆在旧字上。

## 字体与技术预签需要的信息

- 字形：02 的“糖”可从原 PSD `sign_glyph` 定向抽取，03 的“烤”可先检查原字层；新“现”仍需来源核验。`../v0.1/source/font_candidates/wordshub_requested/FONT_LICENSE_AUDIT.json` 记录 `wordshub/free-font` 收录文件、SHA 和字表，**不等于官方 TTF 与旧文件同源的验证**。已核 [Google Fonts 官方上游 `OFL.txt`](https://github.com/googlefonts/zcool-kuaile/blob/main/OFL.txt) 载明 SIL OFL 1.1，且 [`fonts/ttf/`](https://github.com/googlefonts/zcool-kuaile/tree/main/fonts/ttf) 有 `ZCOOLKuaiLe-Regular.ttf`；生产前须取得/核对官方文件 SHA、名称、字形覆盖和与现有 `wordshub` 文件的关系，记录最终字层来源。若同源性或使用条件有实质疑点，转向源稿可追溯的原创字形；05/06 可沿用原层，若后续权利证据否定原用途则停用复审。
- 图形：已获授权的生成式方向图中 01 杯标、02 糖勺糖浆、04 剪梳可按对象抽取原像素到全画布透明层；须保留两张预览原图、取像素范围、alpha/边缘清理与局部补绘记录。该方法忠实继承已选视觉，不等于允许裁切整店替换旧 PSD。
- Tech Lead 已有 `../../../tech_lead/U03-SHOP-SIGN-REVISION-001/v0.1/TECH_PREFLIGHT.md` **条件预签**，其中确认旧 Prefab 两片全画布同坐标、02 旧字 bbox 约 x816–907/y479–701、六店原始像素上限约 48 MiB；这些不证明新牌几何、实际内存或运行达标。首张样张前仍需 Art/Tech 对本方案同批次版本作正式文字签认，并核现有六 PSD 与图层源继承、1024² RGBA/脚点、两片层序、01/02 新旧 alpha bbox、画布边距、目标视窗读数、局部补洞、图集/合批及输出范围。未经实图测量的数字只写估算。
- Client 切图讨论需确认：稳定资产 ID 与**现有正式路径/UUID**、SpriteFrame/Prefab 前后顺序，以及哪些 body 字节不变。用户第二次批准前不得替换当前已导入贴图；后续只替换确有变化的 PNG，保留 `.meta`/UUID 与 Prefab/Scene 身份。
- `bggg-creator-image2psd` 可用于将**当前已有全画布分层 PNG**重新组装为版本化 PSD，保留源图和预览；若采取单图语义拆层，需记录每层像素来源、局部补洞和可编辑限制。转换不授权借预览重画整店。原版和本轮新版本不可相互覆盖。

## 当前结论

技术可行性：`FEASIBLE_WITH_LOCAL_REPAIR_AND_RIGHTS_GATE`。图层源齐全，六店均有独立牌层；01 **必须**补旧牌下 body 缺口，02 优先复用原“糖”字且只换 sign，并实图核车前遮挡；03 的新“现”字须完成官方来源与许可核验。新正式 PSD、PNG、实际 alpha/内存和运行效果均未产生或测试。本结论只支持提交制作方案审批和 Art/Tech/Client 预签准备，不是出图、切片或接入批准。
