# 第一街 v0.6｜参考与生成审计

日期：2026-10-02｜任务：ART-DIRECTION-FIRST-STREET-001｜Artifact v0.3。当前已补最终A/B真实尺寸、SHA256、全部实际提示词及逐图目视结果；不以预计图冒充实物。本审计为概念初筛，不是最终版权/商标检索。

## 本轮输入与来源

| 输入 | 实际路径/来源 | 权利状态与用途 |
|---|---|---|
| 最终A v0.5 | `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/scenes/night-market-v0.5-original.png` | 项目内生成概念，2172×724 RGB PNG，SHA256 `4B52A331B549649BC9229D65791F804B217CD0C98C1A821BDFE21BB7A874DAEA`；作为本轮A编辑目标，v0.2未获整版批准，本轮为追加范围修订 |
| 桥近景历史参考 | 原始 `C:/Users/admin/AppData/Local/Temp/codex-clipboard-9078f7a8-74ee-42c5-bf8c-f2f4086fa60d.png`，归档 `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/bridge-reference.png` | 用户提供，作者/许可未知，仅研究；466×377 RGB PNG，SHA256 `860370924B79BC418497FFE056511235AA1D5A0FFA9B4D807CC9E46738A08CC7`；不直接裁用 |
| 牌匾历史参考 | 原始 `C:/Users/admin/AppData/Local/Temp/codex-clipboard-1d848654-02ce-44d0-a98f-a2b176fd55b3.png`，归档 `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/plaque-reference.png` | 用户提供，作者/许可未知，仅研究；2172×724 RGB PNG，SHA256 `3ACB7D36B8E2F34B5E496C5BC21BC56B04B92B44FC7DBD4D2E95AC9057E64A28`；只抽一般纸木类别牌形式 |
| 新装饰 | 用户本轮文字授权：可爱鬼灯、牛头马面小石雕、彼岸花 | 无新增外部图片；抽象常见文化题材，自行设计圆润轮廓/表情/材料/组合，不复制已存在游戏/IP造型，不增加NPC玩法 |
| 已采纳方向与角色连续性 | `project/art_reference/misc/BAIGUI_NIGHT_MARKET_STYLE_STUDY_v0.3.png`、`deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.4/` | v0.3布局/画风已采纳，孟桃独立候选未由本轮代批准；棕发绿橙衣装、仅腰牌孟字继续 |

本轮仅用项目最终A作图像编辑源，历史桥/牌匾参考作为文档依据留存。完整具体输入机制与每次实际prompt由Master记录到同目录 `GENERATION_PROMPT.md`；A请求适度加长约4:1横景且保留原竖向camera尺度，B使用实际完成A的宽高比，实际图不能按请求预报尺寸。如果实际调用另传参考，须按真实调用补记，不能假定未使用。

## 出图前美术签认

Art五文件、Task、REVISION_BRIEF和同版本方向已读，`ART_PREFLIGHT.json`批准仅本轮概念出图；Tech签认需在实际出图前通过。重点是全部桌椅收栏杆休息带、两桥落脚区/水口留空、六经营面横向加宽、装饰少量原创可爱且不侵入通路。A/B仍供用户选择，不提前替换画风。

## 字形、相似与生产边界

牌匾生成字形只是概念表达，没有导入字体文件；后续人工校字并核验使用、嵌入、分发和修改许可。腰部被柜台遮挡时不强行补孟字，更不能把孟牌移到柜台。历史参考不得裁用、逐像素临摹、换色或微调为生产资源；新装饰亦需原创源与具体可识别相似风险复核。

没有分层母版、独立装饰源、骨骼、单页图集或Creator资源；相似部件不证明实际母版复用。每动态骨骼对象附件一页、旅客四方向、Art+Tech生产前尺寸/动作外扩/页数/采样/内存/材质/合批签认保留。通路和加宽店面只是视觉方案，未证明导航、碰撞、点击或设备性能。

## 实际生成与目视结果

Master实际使用内置image_gen完成四次调用，均transparent_background=false：首轮A通路/店宽/装饰；第2次移除柜台小牌；第3次加强后四店宽度；第4次从最终A转换B。每次完整实际prompt在GENERATION_PROMPT.md，旧候选保留，Art实际检查及退回证据保留。

### 首轮A实图检查

Art实际view_image查看首轮A候选：六组桌椅已经靠栏杆休息带摆放，凳椅收拢，店前至休息带之间连续留白，中央桥两端和水口没有家具封堵。两盏圆笑脸鬼灯、一对左殿附近Q版牛头马面装饰石雕、彼岸花已加入，没有恐怖元素，装饰未遮牌匾和主要设备。奶茶柜台出现不属于人物腰带的小牌，已CHANGES_REQUESTED，须定点移除；Review见 `reviews/ART_REVIEW_A_FIRST.json`。

实际返回仍2172×724、约3:1，没有实现提示词请求的约4:1画幅，不能宣称横向画幅扩展20～25%。六店经营面整体舒展，奶茶/糖画宽轮廓改善明显，其余宽度变化较小；未逐店进行生产尺寸测量。最终版本按实际经营面/比例观感审查，不把请求比例冒充实测结果。

- `scenes/candidates/original-counter-badge-rejected.png`：2172×724，RGB PNG；SHA256 `DABBAC59539F1C81B4FF4320D0580FB01A4E2DC20252C4EB6F55F6F2C32D877E`。

### A定点修正与最终检查

第2次image_gen移除柜台错误小牌，修后中间稿保存在 `scenes/candidates/original-width-refinement-input.png`。Art指出首轮后三至四店横向变化不充分；Master第3次定向加宽炭烤/理发/花灯/投壶并重新布置横向间距。最终A落盘 `scenes/night-market-v0.6-original.png`，Art已实际view_image检查：长烤台/宽理发瓦屋/宽竹木灯架/横向开放投壶面均明显舒展，奶茶/糖画沿已加宽轮廓；六店和两桥殿互不遮挡。奶茶柜台恢复无字连续木板，孟桃绿橙/棕发候选保留，腰部被台遮住不补字；六类别牌、小杯吸管、设备和纸盒陈列延续。

六组休息桌椅全部靠栏杆内侧收拢，店面到休息带之间可见连续铺地和行走幽灵；桥两端接街和水口未放家具。理发工作椅属于经营设备，仍在店内，不属于沿栏杆摆放的休息椅。完整石拱与支流通河、两侧断栏保持。两盏圆笑脸鬼灯和左殿旁Q版牛头马面石雕为次要装饰，无恐怖造型。实际花朵约5小簇（前景两角及地标/店侧花盆），多于初始候选1～2，仍限边缘少量点缀、同一装饰类型，无新玩法；据实记录数量差异，不冒充目标1～2。

实际仍2172×724约3:1，没有实现请求4:1；六店宽经营面通过可见比例/物件排列改善，不声明全部正好加宽20～25%或生产锚点已测量。所有实际调用逐字保存在 `GENERATION_PROMPT.md`；本摘要不替代完整提示词。

- `scenes/candidates/original-width-refinement-input.png`：2172×724，RGB PNG；SHA256 `4A2E316A7CB909E6A3730271272BB87D34FA02CA8660934C7E913522170DA84B`。

- `scenes/night-market-v0.6-original.png`：2172×724，RGB PNG；SHA256 `FF2A44BAA0ADF8609D796A8814875812EC1F63C2A1243BA3D8548CA3E5001598`。

### 最终B实图与比较

Art实际使用view_image查看最终B：六组休息桌椅仍在栏杆带，宽通行带、两桥落脚区和水口留空；宽台/宽瓦屋/宽灯架与开放投壶面、六类别牌、小杯吸管、纸盒、孟桃候选、两盏鬼灯/石雕pair/边缘花簇和纸船均保留，没有奶茶柜台身份牌。B在瓦、石、树、月、角色和水面出现真实统一的小方块色簇与阶梯边缘，A保留手绘柔和阴影；风格差异明确，不是只改颜色。B表情和光色/局部背景有生成重绘，保持主布局关键内容而非逐像素同图。实际B也是2172×724约3:1，未实现请求4:1；手机采样/生产网格尚未验证。

- `scenes/night-market-v0.6-pixel.png`：2172×724，RGB PNG；SHA256 `71E1F0580C227B947D7D99F667A6AA99A8B0BFCB336E78A3C966362DD4ECA1D5`。
