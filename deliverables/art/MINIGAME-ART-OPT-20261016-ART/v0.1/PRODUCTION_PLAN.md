# 无损裁剪与保真制作方案 v0.1

## 状态与输入冻结
本版仅文档，引用 rules/visual_fidelity_compute_contract.md v0.1及visual_production_contract.md。总体评估计划已获准，本精确制作方案尚待同版专业Review→用户Gate1；之后Art/Tech同批预签才能出首张代表。自产切片按现行例外提交真实切片、版本清单与同尺度重组后直接给用户Gate2，不新增切图效果专业复审或预览环境前置门禁。代表成功后扩批仍须复签；具体样本、全批与正式接入各自版本的批准不可相互代替。Client只能在确切资源Gate2后正式接入。

冻结输入为Master v0.1/evidence/ASSET_INVENTORY.json、BASELINE_IDENTITY.json与v0.2/RESUME_BASELINE_CHECK.json；后者687文件无变化。268项源SHA/UUID见本版SOURCE_APPROVAL_MAP。同名旧栏杆批准只对应旧SHA；当前已替换新栏杆不回退。与Tech Draft并行用于本批Review，非Client正式输入。

## 精确范围及数学
样本严格取ASSET_MANIFEST的10项：奶茶body/sign两件；游客walk/run00两件，加happy01、happy03、sad04/05/06五个全序列边界极值帧；spirit_a_flame一件。walk/run00同SHA，只能共享图像字节候选，不合并动作、时长、资源ID或UUID。全40帧不是本轮出图范围；未来扩批前复签。

bbox按解码alpha>0取[x0,y0,x1,y1)，不以alpha阈值1/255排除弱光。裁框[l,t,r,b]=[max(0,x0−2),max(0,y0−2),min(W,x1+2),min(H,y1+2)]。保留原样RGBA8，不旋转、不缩放、不改变透明柔边。每件准确数值见清单，奶茶body749×624、sign93×200，原1024²；游客原512²；火焰原160²。静态复原把切片左上置于原画布(l,t)，其余RGBA透明。不把裁后中心当原中心。

Cocos原点中心且y向上，offsetX=(l+r−W)/2，offsetY=(H−t−b)/2；originalSize保留(W,H)，原pivot由当前SpriteFrame取值（本批均0.5,0.5），节点anchor/scale/position及脚点语义保持。游客CUSTOM512²当前未设Sprite.trim=false；Creator3.8.8 simple汇编器需trim=false才恢复originalSize/trimmedBorder。唯一采用deliverables/tech_lead/MINIGAME-ART-OPT-20261016-TECH/v0.1/TECH_DESIGN.md规定的原画布恢复路线：Client未来必须按Tech验证设置originalSize、offset及trim=false，不能只改.meta宣称自动对齐；本轮不改工程。导入后必须核实际SpriteFrame originalSize/rect/offset、翻转、动作接缝、遮挡与真实运行，当前NOT_TESTED。

## 母版与可编辑范围
优先SOURCE_APPROVAL_MAP中同字节源所属现行PSD，在图层清单内绑定stable_asset_id→源层/合并层→原画布→计划裁框→新输出。PSD候选目录关系不等于已核映射；游客未匹配源的项目先追查，不猜造原生PSD。生产前逐件确定唯一现行母版与版本，未明确者停止该件。

若无合适PSD但确切源与权利批准可核，可按已批准转换路线，用image2psd保留当前原像素建立多层栅格母版；执行时先读对应skill。本轮不调用转换。计划optimization_pilot_master.psd，按店铺body/sign、游客各状态帧、场景火焰分别分组；隐藏只读整图参考层不参与重组。可编辑范围仅独立栅格层、位置与透明裁边；不恢复隐藏内容、笔触、被遮挡物，不新增补洞或原生动画绑定。每个导出来自对应实际层，不能用顶层参考图盖住失败分层。现有母版只读保留，新版另路径，不覆盖历史。

## 已视读锚点与同尺度核验
已只读查看当前奶茶body、游客walk00、火焰PNG：奶茶蓝瓦金边、暖灯与木柜、右悬杯及招牌的相对位置；游客奶白轮廓、深蓝描边/椭圆眼、粉腮、尾部渐变；火焰青蓝柔光、眼睛、莲座与水波。它们是现行文件观察，不替代原批准溯源。各锚点保留像素、比例、颜色、边缘、光照与前后层序；不准重画或改变文字/身份/动作。

未来静态核验先在各原尺寸画布重组，比较冻结原图与重组图；再在相同实际场景背景、同视窗同节点变换/显示尺度下并排和叠加。店铺body/sign共同核；游客看00、极值与完整循环接缝，动作时长/方向/循环继承现行规格；火焰连同原莲座关系核。实际显示尺度由Tech/Client从当前运行记录实取，未取前标NOT_TESTED，不能凭160/512/1024源尺寸冒充游戏尺度。

像素归一配置计划cmp-v1：Pillow11.3.0解码，RGBA8，保留源sRGB编码值，不应用ICC转换；输入有不同ICC/gamma时停止并由Tech锁定统一转换版本。直通alpha，比较alpha及alpha>0区域RGB；alpha=0 RGB归零后比较，另记原始透明RGB变化。源尺寸1:1、最近邻且无缩放，source-over分别合成在#000000、#808080、#FFFFFF和同版实际背景；固定整数舍入策略round-half-up。记录比较对象SHA、工具版本、配置、区域、alpha最大差、可见RGB最大差和变化像素数，静态目标全部为0。运行采样/压缩的容差未批准，当前运行NOT_TESTED，不以平均相似度掩盖眼睛/字形/弱光缺损。未来实际执行须保存配置JSON，不冒称现有自动比较器已经实现。

## 预算、停止与交付
本轮零生成调用、零候选图片、零PSD/切片；后续代表计划确定性处理0生成调用、每件1初版，最多2轮纠错（同问题累计不因换工具清零）；代表制作墙钟上限60分钟，静态核对30分钟，总90分钟，人工约束而非已装拦截器。全批不在此时间/范围授权内。费用遥测未知；零生成路线不授权购买。制作运行收益仅估算，RGBA面积不等于GPU实测。

来源/原批准/母版映射未核、输入hash变化、需补洞或生成、任一可见像素差非0、支点无法保持、两轮纠错后仍失败或达到90分钟任一条件即停受影响支线，保存诊断并交Master，不自动重绘、扩批、放宽阈值。账本记录开始/结束、输入hash、工具/配置、实际输出路径/hash、调用数0、轮次、失败与余量；目前只有文档审计，生产账本NOT_STARTED。

交付顺序：本方案Gate1→来源核清及同批Art/Tech预签→10件代表源/切片/映射/重组与差异→具体代表Gate2→全批范围复签及输出→全批具体Gate2→Client正式接入与实际运行核验。未来Client提交真实UUID与登记回填，适用正式QA仍按任务性质办理；本轮文档不宣称运行、性能或QA通过。

## 本批代表来源复核补录
奶茶body/sign准确原批准为tasks/U03-SHOP-FULL-REDRAW-20261009/ARTIFACT_APPROVAL_GATE2.json，v0.2清单shop_01继承v0.1同字节；唯一原母版v0.1/psd/shop_01_full_redraw_v01.psd。火焰为SCENE-SAKURA-REDRAW-REUSE-20261013/v0.3获批PNG及同版scene_sakura_reuse_master.psd。游客7代表来自VFX U02-TOURIST-VFX-FRAMES-001/v0.2，40/40工程/源/manifest SHA匹配，正式批准记录覆盖v0.2实帧。旧tourist_body_master.psd当前缺失，使用本方案计划的原像素逐帧栅格转换，不声称原生编辑能力恢复。确切源/原批准已解，不要求用户重找；新方案Gate1仍待批。正式ID采用原manifest的U03_SHOP_01_BODY/SIGN、UG_GHOST_01_*，文件stem只作inventory key；未核全量ID不冒称新正式ID。
