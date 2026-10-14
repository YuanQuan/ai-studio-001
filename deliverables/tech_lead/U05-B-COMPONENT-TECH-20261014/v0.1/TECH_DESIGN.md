# U05 B 标签与艺术字组件技术方案 v0.1

## 范围与输入

依据用户 2026-10-14 三项修订授权、既有 `CUT_MANIFEST.json`、U05 B UI v0.1 与 Cocos Creator 3.8.8 工程。仅将十二个名称牌底板复用为九宫格、同源艺术字做运行可用图集、按钮文案改为「确认」。场景、顾客、十二原料、杯内容及业务规则保持既有版本。新增切片需 Gate2 具体版本批准，才成为 Client 正式资源输入。

## 稳定接口

| 资产 ID | 计划交接路径 | 用法 |
|---|---|---|
| `LABEL_PLATE_9SLICE` | `deliverables/art/U05-B-COMPONENT-ASSETS-20261014/v0.1/exports/LABEL_PLATE_9SLICE.png` | 源自旧 `LABEL_PLATE_P01` 空名牌，123×45 RGBA；12 个牌共用。四角保持，左右 inset 各 18、上下各 12 源像素。运行宽 123/130/131，高 45 源像素。 |
| `U05_ART_FONT` | 同目录 `U05_ART_FONT.png` 与 `U05_ART_FONT.fnt` | ZCOOLKuaiLe-Regular.ttf 许可源生成的单页 BMFont 兼容图集；FNT 文本和 PNG 必须配对。记录每个 glyph 的 id、矩形、偏移、advance、行高和实际字符集。 |

上述是计划路径，非 Client 已导入路径。批准后 Client 稳定放入 `apps/client/assets/units/shops/milk_tea/textures/u05_b/`，保留同名文件并登记 Creator 实际 UUID。旧十二块 `LABEL_PLATE_*` 待确认引用解除后再由 Client 决定清理，不与新牌混用。

## Creator 3.8.8 接入契约

PNG 导入为 SpriteFrame；Sprite 的 `type=SLICED`，SpriteFrame border 对应 left/right=18、top/bottom=12。校验 18+18<123、12+12<45。九宫格目标宽在 123–131 间，高保持 45；纹理四角不能缩放，沿中心/边线拉伸。对比十二格源图位置及同尺度重组，不把文字烘在底板。

艺术字通过 Cocos Label 的 BitmapFont 资源设为 `Label.font`，`Label.string` 仍动态更新；不能将 FNT 当作普通字体或仅把 PNG 当 Sprite。确认 Creator 导入 FNT 后字符位置正确、无缺字方可接入。字符集覆盖当前 U05 的十二品种名、类别、按钮、订单、帮助、倒计时、弹层与结算等全部可见字符串，以及 `0–9`、冒号、斜线及 UI 实际用到的标点。制作交接给出字符串清单与码点集合，Client 对运行文本扫描；超集扩字需 Art 更新同源图集并重新校验，不静默回退系统字体。若 Creator 对动态字形组合不兼容，候选回退为已登记的固定字串图集，动态数字仍须同源字形覆盖；回退须记录差异并由 Art/Tech 核对。

文本字号以当前 1024×1536 B 设计画布的源像素标定，随整图 contain 比例统一缩放；不能将 host CSS px 和源图 px 混算。顶部留边模式的帮助板与退出控件使用 UI Spec 的 host 逻辑像素，文字最小 18/20 px；图内回退模式帮助正文为 34 源像素、必要时不低于 32。小窗口不能靠 Label `SHRINK` 静默缩字，应按 UI Spec 换行/列并实测可读性。12 名称牌以同源文字层居中，超宽先测 glyph advance、字距，再按 UI Spec 评审，不擅改底板比例。按钮显示「确认」，行为仍为三项齐备后交杯。

## 验证与边界

Art 交接须提供实际尺寸、alpha、inset、图集/FNT 文件 hash、码点/字符串覆盖、同尺度重组图、PSD 与源字体及许可登记。Tech 静态核对四边尺寸、FNT 坐标不越界、码点完整及路径；Client 再做 Creator 导入、Web 实际画面/交互与必要目标平台检查。图集文件数不构成 DrawCall、内存、帧率通过证据；当前均 `NOT_TESTED`。新切片 Gate2 未批前，相关接入保持计划。
