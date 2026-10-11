# U04 祥云角花形体修订：静态候选 v0.3

## 本轮方向

v0.2 的边缘连接已被用户认可，但云纹只表现为弱小弧线，缺少一眼可辨的传统祥云形体。本轮真正重构两角云形：以饱满的三瓣或五瓣如意云头作主体，辅以较小的层叠云瓣和一笔舒展的 S 形云尾。两到三组云团有主次和留白，避免花朵、蛇纹、只有螺旋、密集小钩。轮廓为线宽均匀、圆润且不过亮的暗暖金，云体为面板深蓝。保留已认可的左下沿底边、右上接上边与右边的连续贴合，不另叠厚金 L 形线。

左下云头须在实际显示尺度下露出人物遮挡以外的一部分，并沿底框向内伸展；右上云头须足够醒目，但避开“缩小面板”“放大面板”按钮。两角均不得挤占对白或改变控件。

## 输入、参考与权利状态

- 唯一编辑目标：`deliverables/art/U04-CLOUD-CORNER-FIT-001/v0.2/cloud_corner_fit_preview.png`，当前静态候选图。
- 视觉参考：用户提供的 `/var/folders/cf/03jww3lx7b3ggg3l_9sh64x00000gn/T/codex-clipboard-de8fff54-9a62-41c6-ada7-e52c874a6f7d.png`。参考其多层如意云头、滚动云瓣和金线接框的通用视觉语言，不直接复制画面布局。该图的正式生产授权范围未核明，候选仅供视觉方向审批。

## 内置图像工具提示词

使用内置 `image_gen` 图像编辑。Image 1 是 v0.2 编辑目标，Image 2 是用户提供的祥云结构参考；只生成一版，再目视检查。实际提交提示词：

> Use case: precise-object-edit. Asset type: static game UI visual candidate. Image 1 is the sole EDIT TARGET: the current v0.2 full-screen U04 dialogue candidate. Image 2 is a user-provided visual REFERENCE only for the traditional Chinese auspicious-cloud vocabulary; do not copy its overall composition, portrait, or UI. Keep Image 1's night-market background, portrait, dialogue panel, text, buttons, tabs, controls, layout, and already approved natural corner-to-frame connections as close as possible. Make a SUBSTANTIAL redesign of ONLY the two gold-outline cloud ornaments on the lower-left and upper-right corners of the large dark-navy dialogue panel. The v0.2 little arcs are too weak and abstract. Each corner must read unmistakably as a traditional Chinese ruyi auspicious cloud at normal display size: one prominent, plump three-lobed or five-lobed ruyi cloud head, a smaller layered supporting cloud petal, and a graceful flowing S-shaped cloud tail. Use only two or three clearly separated cloud masses per corner, with a strong large-to-small hierarchy and breathing space. Cloud forms are filled in the panel's deep navy and outlined with one smooth, uniform, restrained dark warm-gold line, visible without bright glare. Round every transition; no pointed snake-like bends, tiny hooks, dense spirals, floral-petal appearance, extra dots, or repeated mini-curls. Lower-left: let the main cloud head and tail extend inward along the bottom border and remain visibly distinct in front of or beside the portrait at the very bottom, without obscuring her face, hand, or dialogue. Upper-right: make a legible cloud head below the top border and along the right edge, with the tail joining the thin top/right frame tangentially; keep clear of both panel size buttons. Preserve the existing continuous frame joints at both corners, with no floating line ends or duplicate thick gold L. Do not change anything else and add no text.

## 状态与限制

输出文件 `cloud_corner_fit_preview.png` 为 1672×941，SHA-256 `c0eaab8f5c508942bd233e163842c00d2f7cf44ec935dd9a77af11542cd1dd74`。目视可见左下形成较大的层叠云头和沿底边延伸的辅云，右上形成云头及向下云尾；金线比 v0.2 略亮、略粗，右上云瓣仍可能产生花瓣联想，交用户判断。

本图仅是静态方向候选。生成式编辑可能改动非角花区域，不能声称背景、人物、文字或控件逐像素不变；也不能用它证明九宫格缩放、正式切片、PSD 图层、客户端接入或实际运行效果。若方向获批，正式制作仍遵守制作方案和具体资源审批。
