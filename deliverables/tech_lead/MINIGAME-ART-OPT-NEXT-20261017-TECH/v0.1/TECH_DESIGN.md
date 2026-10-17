# 六代表压缩批次技术事实与执行约束 v0.1

本文件为首产工具事实，尚非同批首图预签。已读取角色五文件、新Task、Master USER_AUTHORIZATION/SCOPE及获批压缩方案。用户已批准本六代表方案Gate1，无需新增预案用户门禁；待Art实际BATCH_PLAN后核准确SHA与执行细节再签。不得在预签前制作候选。本轮仅只读命令、源PNG解码和引擎/文档核验，未编码、未产图、未安装依赖、未修改正式工程。

## 真实可用工具

事实原件见 `TOOL_FACTS.json`、`CWEBP_LONGHELP.txt`。

|能力|本机事实|结论边界|
|---|---|---|
|PNG确定性重编码|Python3.9.6、Pillow11.3.0，zlib 1.3.1.zlib-ng；PNG writer含compress_level；ImageMagick7.1.2-0有libpng1.6.50读写|无需新依赖可走Pillow RGBA8、optimize=True/compress_level=9。尚未执行实际编码或承诺比源小。|
|WebP无损/透明精确|cwebp/dwebp1.5.0；Pillow libwebp1.5.0，writer含exact/icc_profile；ImageMagick有WebP读写|cwebp明确-exact默认关闭，必须显式启用。桌面工具可用不等于Creator/平台可用。|
|专用PNG优化器|PATH未发现oxipng、optipng、pngcrush、pngquant|不安装，不把pngquant当零损路线；已有工具足够完成获批诊断。|

可计划参数为 PNG `RGBA` 不改尺寸、`optimize=True, compress_level=9`；WebP `-lossless -exact -q 100 -m 6 -metadata icc`。lossless下q控制编码力度，不是允许像素损失。不得启用near_lossless、palette量化、resize、alpha清洗、sharpen或GPU纹理压缩。参数最终由Art同批计划锁定，真实命令、版本、输入/输出SHA均记账。Pillow如作为WebP编码器同样要lossless=True、exact=True、显式profile策略；不混用工具以重置轮数/预算。

## 六输入与完整RGBA/色彩

`SOURCE_FACTS.json` 已独立核六源SHA、实际尺寸、RGBA解码和PNG chunk：人物768×1024、天空1536×1024、店身773×741、招牌375×140、游客327×367、字体1024×1024，均RGBA8。六源仅IHDR/IDAT/IEND，**无ICC、gAMA、sRGB chunk**。固定解释为同一untagged样本链，候选保持无profile状态；不得擅自注入新ICC或执行颜色转换。若未来输入有ICC，逐字节保存profile并记录其SHA，固定同一解码/色彩解释，不能用去profile制造收益。

源/候选逐像素全RGBA零差，含alpha=0隐藏RGB。先以同Pillow版本原始RGBA8解码比较，再用dwebp或Pillow WebP解码器作独立解码诊断；dwebp解码图未携原ICC不能被误作profile丢失已可接受，WebP容器ICCP须另检查。alpha0/alpha>0变化数、各通道最大差、ICC有无/字节均单列。任何差异仅可诊断，不能记无损通过。之后同straight-alpha、线性采样、缩放相位及黑/灰/白/实际背景比较边缘；不通过归一隐藏RGB掩盖风险。

[Google cwebp官方文档](https://developers.google.com/speed/webp/docs/cwebp)说明lossless仍须exact保存透明RGB；[API文档](https://developers.google.com/speed/webp/docs/api)同样要求WebPConfig.exact。原默认不会自动满足本项目约束。本轮未制作合成PNG/WebP来冒充六源候选验证。

## Creator与小游戏兼容边界

锁定本机Creator3.8.8，引擎原文件SHA见 `ENGINE_EVIDENCE.json`。downloader.ts含`.webp: downloadImage`，parser.ts含`.webp: parseImage`；微信wrapper调用wx.createImage并设premultiplyAlpha=false，抖音wrapper调用tt.createImage。**这只能证明有委托加载路径，不能证明Editor导入器、目标打包、基础库或设备解码已通过。**

[Cocos3.8压缩纹理官方资料](https://docs.cocos.com/creator/3.8/manual/zh/asset/compress-texture.html)列出WebP能力，同时平台覆盖支持表与通用表口径不同；PNG/JPG/WebP是文件压缩，不等于GPU压缩或降低解码驻留。不得由通用“小游戏支持”推断本项目Mac Editor直接WebP导入与微信/抖音基础库最小版本。官方微信createImage页本次工具non-retryable无法读取，抖音尝试的准确小游戏createImage页不可达；未取得最低基础库证据，记NOT_TESTED。搜索到的mini-app `<image webp>`版本不属于小游戏API，不用于结论。

当前可预签**PNG与WebP lossless技术样本制作**，WebP标记兼容待测；不以真机未测阻断静态诊断，不因桌面编码成功允许正式接入。quality95有损诊断的既定条件“Tech确认目标平台/Cocos透明管线支持”当前未满足，暂不解锁该支线，不必为凑18件制作。

若Master要求本阶段验证Importer，建议另授权一个最小隔离Creator3.8.8探针工程，仅消费Art预签后已产代表候选，导入回读PNG/WebP的meta/library、真实UUID、SpriteFrame/Texture尺寸、native格式；构建后检查是否原WebP或重编码PNG、profile/alpha及包字节，再HTTP/IAB。原工程不改。目标平台最低基础库、上传与真机仍需对应环境，隔离构建不替代。新候选具体Gate2前不正式接入，本工具事实也不是接入授权。

## 预算、证据和后续

沿用获批6件、最多18候选+6参考、0生成式调用、150人分钟、每问题最多2轮且总候选上限不增。首批天空/招牌/游客优先，失败不扩全库；无收益如实保留，不承诺20MB。来源/尺寸/UV/色彩/alpha漂移、未知权利、无支持/无收益、预算上限均按方案停止相应件/支线报Master。源PNG、候选文件、Creator实际native文件、总包字节分别计量，差额双单位，不从样本节省外推全包或GPU。

等待Art实际同批计划：核6输入/输出计划、上限、账本、工具参数/metadata、尺度/背景及比较配置，同SHA签TECH_PRESIGN。当前仅TECH_DESIGN和事实文件已形成；不预填预签或QA评审PASS。

QA Owner随后正式TEST_PLAN需技术审查并由用户批准后才执行正式QA。本阶段工具盘点不是QA执行，不追溯虚构此前示例的正式QA。后续样本直接按现行自产路径送用户具体Gate2，不新增切图效果专业复审或额外预览环境门槛。

QA计划分FUNCTIONAL本地Web与RELEASE平台验证：平台/DPR/真机未测不自动阻断本轮FUNCTIONAL，但不得改写成RELEASE通过。现有 `PERFORMANCE_BUDGET.md` v0.1仍为DEMO-001待批候选，55FPS/p95≤20ms/5秒不能套作当前U00–U05已批硬门槛。本轮资源目标沿用已批20循环引用归零/无持续增长；其余Web性能可列测量方案及原始值，无已批预算时不作达标判断。若需预算提案，纳入本次具体QA计划一同用户审批，不另设Gate。
