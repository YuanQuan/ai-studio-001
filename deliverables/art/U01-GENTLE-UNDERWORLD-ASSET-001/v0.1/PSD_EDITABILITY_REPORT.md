# U01 温和地府元素｜PSD 可编辑范围核验 v0.1

母版：`psd/u01_gentle_underworld_four_layers.psd`，SHA-256 `7694777c98d4ae3bbf1cc87aaef97f83c9cda89e2bd60837c064cca4e39cee73`，2172×724、RGB8 + alpha 栅格层、normal 混合。它来自已批 PSD 独立回读的原四层和五个定向新增透明层；没有把整张平面图重画或做颜色聚类粗拆。

| PSD 底到顶顺序 | 层名 | 真实编辑能力 | 输出语义 |
|---|---|---|---|
| 1 | `L01 approved sky` | 旧 PSD 层像素保留，可独立隐藏/移动/栅格编辑；源宽 2171，画布末列历史透明 | L01 |
| 2 | `L02 approved mountains` | 同上 | L02 |
| 3 | `L03 approved ground` | 同上 | L03 底 |
| 4–7 | `GU01a original flower`、`GU01b original flower`、`GU03 original waystone`、`GU04 original hand-lettering` | 四个独立局部**栅格**层，可单独隐藏/移动；逐笔 SVG 路径源保存在 `source_build/editable_strokes/`，可按源文件改笔触后重新渲染 | 合入 L03 |
| 8 | `L04 approved foreground` | 旧 PSD 层像素保留，位于花/石/字前，保留遮挡 | L04 底 |
| 9 | `GU02 original bridge carving` | 独立局部栅格层；旁存可编辑 SVG 路径 | 合入 L04 |

验证方式：`source_build/build_psd_and_exports.py` 独立解析旧/新 PSD 的层记录和 raw RGBA 通道，旧四层与已批导出逐像素一致；新 PSD 九层及名称、顺序、尺寸、alpha 内容按 `source_build/bggg_summary.json` 和 `build_validation.json` 回读。脚本再从**新 PSD**回读九层生成四张正式候选导出。四张完整画布无裁边，L01/L02 连 PNG 文件 SHA 都与旧版相同；L03/L04 的差异盒、边缘 alpha 见 `CUT_MANIFEST.json`。`review/assembly_preview.png` 为 bggg 组装时预览，`review/psd_stored_preview.png` 为新 PSD 内嵌平面，`review/overall_from_psd.png` 为四张语义 PNG 同尺度重组。后两者仅在局部透明混合的 8 位舍入有最多 1 色道值差异。

**编辑限制：**此 PSD 没有原生 Photoshop 路径、形状层、智能对象或可编辑文字对象。新增的可编辑路径在独立 SVG 源文件中；PSD 内对应对象为可独立调整的栅格层。原四层也是获批源的栅格层，不是对象级细分。尚未在 Photoshop/Photopea GUI 打开并手工编辑验证；本报告仅证明文件结构、层通道独立读取和源文件可改，不声称 GUI 操作已通过。若接收方软件打开出现不同的混合/色彩处理，需要按同尺度预览比对后记录，而非静默改图。
