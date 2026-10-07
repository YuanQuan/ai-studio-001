# U01 场景增加温和地府线索｜实际美术资源 v0.1

**HISTORICAL_TRIAL_NOT_FOR_GATE2：本包已撤回，仅作工具预签偏差的历史试制证据，不提交用户正式审核。** 原预签漏列实际 Node/sharp SVG 栅格化工具，详见 [技术偏差记录](PROCESS_DEVIATION.md)。正式候选将按 v0.2 同版新预案双签后重新制作。

本版根据已批准的制作方案，直接在原四层夜景上定向增加：桥两侧各一小簇柔和彼岸花、桥心三瓣莲水纹、左端低矮园景石、右端原木匾手绘“忘川”。石桥、柳树、夜山、月亮、六盏河灯与暖灯主次保持。**请审本版实际画面与四张切片的效果。**这是独立 Gate2 审核；本批未接入程序。

## 看图

| 画面 | 文件 | 审阅重点 |
|---|---|---|
| 四层同尺度重组 | [整体画面](review/overall_from_psd.png) | 夜景整体疏密、桥与暖灯焦点、四处新增元素是否自然。 |
| 竖屏静态投影总览 | [五种比例 × 六个镜头状态](review/portrait_viewports.png) | 9:16、9:18、9:19.5、9:20、9:21；各有中心、左端、右端 × 倍率 1/1.8。每张原尺寸图在 `review/viewports/`。**这是按 Client v0.2 控制器参数模拟的艺术投影，无悬浮控件，不是 Creator 运行截图。** |
| 花、桥纹、景石、匾字 | [左花](review/second_pass_flower_left_new.png)、[右花](review/second_pass_flower_right_new.png)、[桥刻](review/second_pass_bridge_new.png)、[景石](review/second_pass_waystone_new.png)、[匾字](review/second_pass_plaque_new.png) | 原图局部放大检查；景石已从第一轮直立形态改成低矮园石，桥纹已改成清晰三瓣莲。 |

## 本次具体文件

- [可编辑 PSD 母版](psd/u01_gentle_underworld_four_layers.psd)，2172×724、九个独立栅格层，SHA-256 `7694777c98d4ae3bbf1cc87aaef97f83c9cda89e2bd60837c064cca4e39cee73`。四个旧层原位保留，五个新对象独立；对象的可编辑 SVG 路径源在 `source_build/editable_strokes/`。PSD 原生矢量/文字对象未制作，细节见 [可编辑范围](PSD_EDITABILITY_REPORT.md)。
- [L01 天空](exports/tex_street_base_01_l01_sky.png)、[L02 远山](exports/tex_street_base_01_l02_mountains.png)、[L03 地面牌楼](exports/tex_street_base_01_l03_ground.png)、[L04 桥栏河水](exports/tex_street_base_01_l04_foreground.png)，四张均 2172×724 RGBA、原点相同、不裁边。L01/L02 与获批旧 PNG 连文件 SHA 都相同；L03/L04 只在五处已批局部变化。逐文件哈希、层映射与透明边见 [切图清单](CUT_MANIFEST.json)。
- [来源与修改记录](SOURCE_AND_EDIT_RECORD.md)、[逐锚点检查](VISUAL_ANCHOR_CHECK.md)、[三方切图协作记录](CUT_COLLABORATION_RECORD.md) 保留制作和核查依据。

## 已知限制与审批范围

- 四张语义图重组与 PSD 内嵌平面因 8 位透明混合舍入次序，局部最多差 1 个色道值；该差异不在未批准区域，详见 `CUT_MANIFEST.json`。30 张静态投影没有透明露底。
- 静态投影没有绘制返回、减/重置/加控件，实际遮挡与触控未验证；Creator 导入、手机运行、纹理格式、内存、Draw Call、帧时均 `NOT_TESTED`。用户批准本版视觉资源后，才由 Client 按现有四资源 ID 与 `.meta` 身份接入并作运行验证。
- 已记录用户对原图及商用改编权的声明；本轮新增笔触和“忘川”字形为原创路径，未引入外部图片/字体。公开服务条款与本地 bggg MIT 许可已核，特定账户合同及第三方权利没有独立法律核定。

本版请求用户对**上述 PSD、四张 PNG 及其整体/竖屏效果**明确批准或提出局部返工意见；此前 Gate1 制作方案的批准不代替本次资源效果审批。
