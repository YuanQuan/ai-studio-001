# 03 烧烤竖牌“现烤”双字候选源 v0.4

## 用法与边界

- 主候选 `sign_glyph_xiankao_candidate_v04.png` 是 1024×1024 全画布透明 RGBA 的**一个独立双字栅格层**。主 Art 在正式 PSD 中应隐藏 v0.3 的旧“现”和旧“烤”两层，把本层置于原 `sign_board_reused` 和 `sign_hardware_reused` 之上；不要叠入旧字像素。
- 原左竖牌、挂件、店体、烟、炉与布棚未加工。候选预览只在内存里将 v0.3 原 body、原牌板、原挂件与新字层叠合；本目录不输出正式 sign 切片或 PSD。
- `sign_xiankao_v03_vs_candidate_v04_1x.png` 左旧右新，按相同蓝底、相同画布坐标裁 `(65,465,225,770)`，两侧都是原始像素尺度。`shop_03_v03_vs_candidate_v04_390x844.png` 左旧右新，两个完整店体均用 316 px 店图宽、脚点 y=530、相同 390×844 蓝底视窗。

## 字源、制作和视觉差异

- 两字**同一**官方 ZCOOL KuaiLe 字体文件 `../v0.2/source/rights/ZCOOLKuaiLe-Regular.ttf`，同一 `FontSize=124`、同一 `0.92` 比例、同一字面加粗 3px 滤镜、同一窄边 5px 滤镜、同一右下 `(3,3)` 浅棕体积。先以各字真实字形边界裁切，再用相同比例缩放并分别按中线 x=138、中心 y=562/696 排列。自然字形使最终两字宽高有约 1px 差异；未对两字各自独立强拉伸。具体字形 bbox、颜色、路径和 SHA-256 全见 `SOURCE_MANIFEST.json`。
- 字面从左上浅暖金 `#FFD790` 温和过渡到底右金棕 `#DD9550`；边为 `#C07741`，右下体积为浅棕 `#975F38`，左上给少量细高光。笔孔保留。相对 v0.3 的深棕字面和橙线框，本版两字的色材、轮廓和字号共同处理，朝用户所选 [mixed_signs_v04 原方向](../../../v0.1/preview/mixed_signs_v04/six_shop_mixed_signs_overview.png) 的浅暖金方向靠拢；该小预览只作视觉方向，没有裁字或放大像素。
- 字体上游为 `https://github.com/googlefonts/zcool-kuaile`，本地 TTF SHA 为 `812A6FC1…007CB71D`，SIL OFL 1.1 文本 SHA 为 `53807846…1D6D703D`；完整值、路径和参考源 SHA 均在清单。此目录仅交栅格 PNG，不复制、嵌入或分发 TTF。字层在 PSD 中可独立显隐或换图，但不是 Photoshop 原生文字对象。

## 检查与状态

- 脚本 `build_xiankao_candidate.py` 可按清单源重新生成；运行前断言已批准制作方案、TTF 和 OFL 文本的 SHA。局部与 390 完整店体对照可供主 Art 实看筛选。源牌板、挂件、body、旧 PSD 均只读。
- 当前仅为 `ART_CANDIDATE_NOT_VISUAL_PASS_NOT_GATE2`。是否与同批其余店的明暗、卡通画法和完整 PSD 匹配，由主 Art 组装后在六店同尺度、390/720 视窗检查；具体切片统一进入父任务 Gate2 用户审核。未做 Cocos 接入或真实运行验证。
