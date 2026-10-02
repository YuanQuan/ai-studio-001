# 第一街双风格 v0.5｜参考与生成审计

日期：2026-10-02｜任务：ART-DIRECTION-FIRST-STREET-001｜Artifact v0.2。A/B均已实际生成，Art分别实际目视检查并重查B修正版。本审计是概念初筛，不是最终版权/商标检索。

## 输入来源

| 输入 | 原始/归档实际路径 | 来源与权利状态 | 本轮用途 |
|---|---|---|---|
| 原全景v0.4 | `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.1/scenes/night-market-v0.4.png` | 项目内生成概念；v0.1被用户退回修订，未获整版批准 | A编辑目标，保留已采纳横向布局及六店构造 |
| 桥近景参考 | `C:/Users/admin/AppData/Local/Temp/codex-clipboard-9078f7a8-74ee-42c5-bf8c-f2f4086fa60d.png` → `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/bridge-reference.png` | 用户提供，作者及许可未知，仅研究 | 完整石拱、两侧坡道、支流通河一般构造，不直接裁用 |
| 牌匾参考 | `C:/Users/admin/AppData/Local/Temp/codex-clipboard-1d848654-02ce-44d0-a98f-a2b176fd55b3.png` → `D:/work/ai-studio-template/ai-studio-001/deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.2/references/plaque-reference.png` | 用户提供，作者及许可未知，仅研究；与前轮建筑图内容相同 | 木框浅纸底、类别横/竖牌的一般形式；重设计框、字形和组合，不复制角色/装饰/店序 |
| 用户红圈注释全景 | 本轮对话附图，无独立本地路径；作为指示问题范围 | 用户指示中央桥与屋顶奶茶标识位置 | 不当作生产图源，不复制红色标记 |
| 历史布局/画风与角色候选 | `project/art_reference/misc/BAIGUI_NIGHT_MARKET_STYLE_STUDY_v0.3.png`；`deliverables/art/UNIT-PILOT-ART-CONCEPT-001/v0.4/` | v0.3布局/画风已采纳；孟桃独立候选审批不被全景替代 | 稳定镜头、店序、棕发绿橙身份；仅腰牌孟字 |

Art已实际查看两归档参考：桥口前是开放水面，岸石只收在两边；牌匾为常见纸/木底类别横竖牌。具体石拱比例、灯具、字形、角色和装饰组合必须重新设计。本轮不导入现成字体文件、第三方logo或游戏生产资产；生成汉字只为概念说明，不能证明字形准确或使用/嵌入/分发/修改许可。生产前人工校字并核验字体或原创字形权利，修改字体不等于取得许可。

## 归档参考完整性

- `references/bridge-reference.png`：466×377，RGB PNG；SHA256 `860370924B79BC418497FFE056511235AA1D5A0FFA9B4D807CC9E46738A08CC7`。
- `references/plaque-reference.png`：2172×724，RGB PNG；SHA256 `3ACB7D36B8E2F34B5E496C5BC21BC56B04B92B44FC7DBD4D2E95AC9057E64A28`。

## 实际生成与目视结果

工具：内置 `image_gen`，Master执行。A以v0.4主图和桥/牌匾参考作定向编辑；首轮中央桥河正确，左端牌匾类别错位，候选留存在 `scenes/candidates/original-signs-rejected.png`，不作为交付。第二次仅纠正左端三牌位置与类别，形成最终A。完整实际提示词逐字留存在 `GENERATION_PROMPT.md`，含首轮、纠正及B定向转换，不能以本摘要替代。第三次B以最终A为输入；Art发现奶茶柜台新增孟牌，违反仅人物腰牌要求并记录 `reviews/ART_REVIEW_B_FIRST.json`（CHANGES_REQUESTED）。第四次仅移除柜台孟牌，恢复木纹，形成最终B；首轮B保留 `scenes/candidates/pixel-counter-badge-rejected.png`，不作为交付。所有调用 `transparent_background=false`，没有导入外部字体。

## 生产门禁

两版全景仅构图与表现方式比较，不是分层母版、骨骼、图集或Creator工程。相似灯笼/石/木没有证明实际同源；像素全景没有证明严格生产网格或手机采样稳定。每动态骨骼对象全部附件一页，旅客四方向要求不撤销。正式图源生产前Art+Tech联签尺寸、采样、动作外扩、页数、内存、材质、遮挡和批次；未知许可参考不得进入正式资产，正式源须原创重设计并复核可识别近似风险。

### A实际目视检查

Art已使用view_image实际查看最终A：中央完整石拱可读，两坡分别接左/右主街；桥下蓝水向前景河流连续连接，两边石岸与栏杆在水口分别终止，无铺地、链条或栏杆跨越封口。阎罗殿没有误挂经营牌；六牌依次奶茶、糖画、炭烤、理发、花灯、投壶，全部对应各自店体。奶茶杯与剪刀均缩到牌匾侧的小标识。奶茶/理发瓦房、糖画伞车、炭烤布棚、花灯竹木架和开放投壶保持不同轮廓；六店门面和经营设备可读。孟桃绿橙衣装与棕发延续、宽通路/桌椅/纸船/暖灯冷夜保持。其腰牌在全景中过小，不能证明“孟”字生产可读，留给角色近景校字。

- `scenes/night-market-v0.5-original.png`：2172×724，RGB PNG；SHA256 `4B52A331B549649BC9229D65791F804B217CD0C98C1A821BDFE21BB7A874DAEA`。

- `scenes/candidates/original-signs-rejected.png`：2172×724，RGB PNG；SHA256 `758013C68AB4FBC038E3342682BB2692BE738F5EED2360DB77302050546CE3FF`。

### B实际目视检查与对比

Art先看首轮B，发现孟字方牌挂在奶茶柜台前板，明确退回；再用view_image重查修正版B，柜台已恢复木纹，不再有孟字牌。孟桃腰部被柜台遮挡，因此全景不强行补可读腰牌，角色特写后续校字。两版均有六店正确类别牌匾、小杯吸管与剪刀侧标、开放桥水口、纸船烛火和桌椅。B在瓦檐、石拱、岸石、树叶、角色轮廓与水面反光出现可见方块色簇、阶梯边缘与有限色阶，A仍柔和手绘阴影；差别不是只改变颜色。B有局部背景和幽灵轮廓重绘、略有光色变化，保持总体布局/关键内容与蓝夜暖灯关系，不能声称所有坐标、亮度或像素一一对应。严格生产网格、采样与手机视口未验证。

- `scenes/night-market-v0.5-pixel.png`：2172×724，RGB PNG；SHA256 `8306A4069193D9028E2368A0129EEAC1CECEF4C68C7EF67193ADD4AE4FB8D8C2`。

- `scenes/candidates/pixel-counter-badge-rejected.png`：2172×724，RGB PNG；SHA256 `76D637A3C212A4AF9164482A2B9F66C4D71A18D23263552F9350701925C36105`。
