# U04 祥云内部纹样修订：静态候选 v0.4

## 用户纠正与锁定边界

v0.3 扩大了角花外围轮廓，违反用户希望只改内部祥云的意思。本轮恢复 v0.2 作为唯一编辑底图，严格锁定左下与右上两角原有外轮廓、占位宽高、位置、与金边的连续接点，以及既有金线宽度和亮度。不新增外部云瓣、云头、尾线，不扩大角花，不调整人物遮挡、对白、控件或其他画面。视觉核对以 v0.2 同画幅对照为准；如生成式编辑仍改外缘，本版不能记为满足此项。

仅在 v0.2 原有深蓝云体的内部，以细金线布置清楚、圆润的如意卷纹：每个主云一个回卷核、最多两条层叠辅内弧。保留云体深蓝底色，内部线条不跨过或挤压外轮廓，不画琐碎小钩。

## 输入与来源

- 唯一编辑目标：`deliverables/art/U04-CLOUD-CORNER-FIT-001/v0.2/cloud_corner_fit_preview.png`，1672×941 静态候选；以它的两角外缘为唯一轮廓基准。
- 祥云语言的历史参考为用户提供的图片，来源与权利状态见 v0.2 `ART_BRIEF.md`。本轮图像工具不再输入该参考图；它不作为正式生产素材。

## 图像工具与实际提示词

使用内置 `image_gen` 编辑，输入仅为 v0.2 候选。提交提示词：

> Use case: precise-object-edit. Asset type: static game UI revision. Image 1 is the sole edit target, the v0.2 U04 candidate at 1672x941. The previous revision incorrectly changed the exterior cloud shapes. This time ONLY ADD/REPLACE INTERNAL GOLD PATTERN INSIDE EXISTING CLOUD SILHOUETTES; all exterior contour pixels are locked; never change cloud silhouette. Preserve the complete input image as closely as possible. In particular, keep the exact outer gold outlines of BOTH existing corner clouds, their bounding width/height, positions, area, curves, edge-to-frame tangent connections, gold line width and brightness, panel border, dark navy fill, portrait overlap, all controls, text, background, and layout. Do not extend any cloud outside its current outline, add outer lobes, enlarge cloud heads, add an outside tail, or redraw the gold frame. Only inside the current dark navy cloud body at the lower-left corner and inside the current dark navy cloud body at the upper-right corner, draw restrained fine warm-gold traditional ruyi interior scrollwork: one clear rounded inward curl for each main cloud and no more than two gently layered short inner arcs. Keep internal strokes thinner than or visually subordinate to the unchanged existing outer contour; round all line ends, create deliberate breathing space, and avoid tiny messy hooks, sharp snake turns, flowers, extra curls, or bright highlights. Keep the current cloud body shape exactly as it is. No other changes and no new text.

首轮图像生成未达约束：它在右下角新增了云纹，右上内部几乎未形成修改。该轮原始输出仅留于工具历史，不作为候选交付。随后仍以 v0.2 为底图进行一次限定位置的修复重试，实际提示词：

> Precise localized edit of the provided 1672×941 image. Preserve the image composition and pixels everywhere except INSIDE the two pre-existing dark-blue cloud ornaments of the dialogue frame. The ALLOWED EDIT REGIONS are narrowly limited to (A) lower-left cloud interior, approximately x=15..105, y=850..900, and (B) UPPER-right cloud interior, approximately x=1610..1650, y=685..735. These coordinates are descriptive of the existing clouds; keep a safe margin INSIDE their already drawn gold outer contours. All outer gold contour strokes and all panel frame strokes are LOCKED. DO NOT redraw, extend, thicken, brighten, shift, or reshape either cloud silhouette or any border. Never make ANY change at the LOWER-right corner (x>1500, y>790); there is no cloud there. Never move the upper-right cloud to the lower-right. Add only one short, rounded warm-gold inward ruyi curl and at most two short subsidiary curved strokes within EACH existing deep-blue cloud body, visually subordinate to the unchanged outlines. Do not add a new cloud, new lobe, tail, exterior stroke, spiral outside the original silhouette, text, or other ornament. Keep every button, character, background, text and layout visually unchanged. If an internal mark cannot fit while preserving the original cloud outline, omit that internal mark instead of changing any outline.

## 状态与生成局限

修复重试输出 `cloud_corner_fit_preview.png` 为 1672×941，SHA-256 `9fc3c8e4312975516d8ca84431cd937b1407fc32215c3ef8b0954dfe57b0d593`。Master 与 Art 对照 v0.2 目视：右下保持空白圆角，两角原占位、大外形与接框保持，原有云体内增添回卷。生成式编辑仍可能造成外缘或其他画面的细微像素偏差，此目视结论不等于像素一致。本轮只做静态方向候选，没有 PSD、正式切片、客户端接入或真实运行验证。
