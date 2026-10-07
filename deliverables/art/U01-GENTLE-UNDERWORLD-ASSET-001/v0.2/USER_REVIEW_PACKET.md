# U01 场景增加温和地府线索｜实际美术资源 v0.2

本版在现有四层夜景上定向增加两簇小彼岸花、桥心三瓣莲水纹、左端低矮园景石和原木匾手绘“忘川”。石桥、柳树、月夜、河灯与暖灯的构图和主次保持。请按**本版实际图片**审核整体氛围与四处细节；这是独立的 Gate2 资源效果审批，程序尚未接入。

## 直接看图

- [四层同尺度整体重组](review/overall_from_psd.png)：2172×724；看新元素是否自然融入，中心桥与暖灯是否仍是主角。
- [四处局部细节板](review/local_detail_board.png)：只从本版正式重组图裁取并放大标注 GU-01 花、GU-02 桥刻、GU-03 景石、GU-04 匾字；没有另画细节或改变正式画面。
- [五种竖屏比例静态投影总览](review/portrait_viewports.png)：9:16、9:18、9:19.5、9:20、9:21，各有中心/左右极限 × 倍率 1/1.8，共 30 张；单张原尺寸在 `review/viewports/`。**此图按现有四层视差与镜头公式制作，没画悬浮控件，不是 Cocos/Creator 运行截图。**

## 本版具体文件

| 资源 | 实际文件与身份 |
|---|---|
| 可编辑母版 | [九栅格层 PSD](psd/u01_gentle_underworld_four_layers.psd)，2172×724，SHA-256 `7694777c98d4ae3bbf1cc87aaef97f83c9cda89e2bd60837c064cca4e39cee73`；四个旧层原位保留，五新增对象可独立开关/移动；旁存五份可编辑 SVG 路径笔触。PSD 内没有原生矢量/文字对象，见 [可编辑范围](PSD_EDITABILITY_REPORT.md)。 |
| 四张正式候选切片 | [L01 天空](exports/tex_street_base_01_l01_sky.png)、[L02 远山](exports/tex_street_base_01_l02_mountains.png)、[L03 地面/牌楼](exports/tex_street_base_01_l03_ground.png)、[L04 桥栏/河水](exports/tex_street_base_01_l04_foreground.png)，全部 2172×724 RGBA、同原点、不 trim。L01/L02 与旧版文件 SHA 完全一致；L03/L04 仅五处已批局部有像素变化，L04 四边 RGBA 保留。 |
| 追溯与检查 | [切图清单](CUT_MANIFEST.json)、[来源与修改记录](SOURCE_AND_EDIT_RECORD.md)、[逐锚点检查](VISUAL_ANCHOR_CHECK.md)、[Art/Tech/Client 切图协作](CUT_COLLABORATION_RECORD.md)。 |

## 版本与未测项

v0.1 因试制时 SVG 栅格化工具未列入当时首图前预签，已标为 `HISTORICAL_TRIAL_NOT_FOR_GATE2`。本 v0.2 先对列有 Node/sharp 的新预案完成 Art/Tech 同 SHA 预签，再从已批旧 PSD 和锁定的原创 SVG 路径**重新生成**；生成前时间/版本日志在 `source_build/runtime_before_render.json`。因输入和脚本完全相同，v0.2 的部分文件 SHA 与 v0.1 同值，但不沿用 v0.1 的门禁状态。

本版四张切片重组与 PSD 内嵌平面仅在五处局部有 8 位透明合成舍入差，最大每色道 1 值（561 个色道值不等）；未批准区域没有差异。30 张静态艺术投影的合成 alpha 全为 255，没有透明露底。悬浮返回/减/重置/加控件**未渲染，实际遮挡 NOT_TESTED**；Creator 导入、运行、触控、目标手机内存、Draw Call 和帧时也 `NOT_TESTED`。这些需在用户批准本版资源并由 Client 正式接入后核验。

来源已登记用户对原图及商用改编权的声明；本轮新增笔触和“忘川”字形为原创 SVG 路径，无外部图片/字体或新 imagegen 输入。公开服务条款与本地生产工具许可已记录，特定账户合同与第三方权利没有独立法律核定。

**请求用户明确批准或退回这组 v0.2 PSD、四张切片及其整体/竖屏实际效果。**此前 Gate1 方案批准不代替本次 Gate2；批准前不交 Client 正式接入。
