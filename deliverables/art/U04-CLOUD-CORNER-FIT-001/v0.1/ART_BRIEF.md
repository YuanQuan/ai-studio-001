# U04 祥云角花贴合九宫格：静态候选 v0.1

## 目标与范围

以当前 U04 运行截图为底图，仅调整对话框左下、右上两处祥云角花，使暗金细线与九宫格边框自然相接。左下云纹沿底边向内铺开；右上小云沿上边与右边转角相接。深蓝填色取自面板，卷云轮廓保持稀疏，避免第二条厚金 L 形线、悬空线端或复杂纹样。背景、肖像、对白、所有按钮与控件、面板布局均保持原状。

## 输入与来源

- 编辑底图：`deliverables/client/U04-DIALOGUE-CLIENT-001/v0.3/evidence/runtime_corner_default.jpg`，当前 U04 本地运行截图，1280×720。
- 祥云形态参考：用户在本轮提供的图片 `/var/folders/cf/03jww3lx7b3ggg3l_9sh64x00000gn/T/codex-clipboard-de8fff54-9a62-41c6-ada7-e52c874a6f7d.png`。仅提取通用的稀疏卷云、暗金细线和深蓝填色语言。参考图的授权范围尚未核明，因此本轮只用于静态候选，不作为正式生产素材或切片。

## 图像工具与提示词

使用内置 `image_gen` 编辑，底图为 Image 1，用户图为 Image 2 形态参考，非布局底图。提示词：

> Use case: precise-object-edit. Asset type: static in-game UI candidate preview. Image 1 is the exact 1280x720 current U04 runtime screenshot and is the EDIT TARGET. Image 2 is a user-provided visual REFERENCE for the sparse gold-outline curling cloud ornament, not the layout target. Edit Image 1 extremely locally: ONLY the lower-left and upper-right decorative cloud corners of the large dark navy dialogue panel that occupies the bottom quarter. Preserve absolutely everything else in Image 1 at the same placement and appearance, including night-market background, portrait, text, all buttons/tabs, small-panel and large-panel controls, dimensions, borders, colors, typography, dialogue panel layout, and all objects. At upper right, remove the existing thick doubled gold L-shaped line and replace with one small, simple curling auspicious cloud contour joining the thin horizontal top gold panel border tangentially and continuing into the thin vertical right border, with no floating endpoint, no second heavy L, no stacked complicated motifs. At lower left, reshape the cloud ornament to spread inward along the thin bottom border, joining that border tangentially; compact, sparse cloud curls, dark navy fill matching panel, thin muted-gold single-line outline matching border. Gold line weight uniform, low-key. Two corners should feel naturally integrated into the existing nine-slice panel frame. No new text. Do not modify either reference image's other content.

## 状态与局限

`cloud_corner_fit_preview.png` 为内置图像工具生成的静态候选效果图。工具虽然以当前截图为编辑底图，但把整幅界面重新绘制为 1672×941，人物、背景、控件尺寸和位置与原始 1280×720 运行图有明显差异。因此本图只能审阅祥云形态与边框衔接方向，不能作为“除角花外像素保持原样”的证据，也不能证明九宫格缩放、切片、PSD 图层、客户端接入或真实运行效果。若用户认可方向，正式资源仍须按美术制作方案与具体切片审批门禁另行推进。
