# 街桥代表样张 Art 自审（候选 1）

结论：`REVISE`，不得据候选 1 扩批。候选真实原生 `source/native/bridge_initial_native.png`（2172×724，SHA-256 `ee35f57fcf98ab77768467815bad26a6ce9259e8e4aac1ae23c9d7589a94dd60`）；经 `source/sample_bridge.py` 确定性等比 0.5 投影并只复用新绘直街条，左半 1536×512 输出 `exports/tex_sakura_rr_bridge_half.png`（SHA-256 `970452aaa5f6ec25c3b51ff606d6bf3431f6bfd4f831272f882e79a5d075999d`）。原生不是 3072 细节；原件及输出均保留。

同尺度证据：`review/bridge_sample_neutral_3072x1024.png`、`review/bridge_sample_with_existing_shops_3072x1024.png`、`review/bridge_reference_vs_sample_1to1.png`（左右各 3072×1024 未缩放）及 `review/bridge_roi_reference_vs_sample_1to1.png`（对应 x1060–2012/y440–950，左右原像素 1:1）。六店由当前 `apps/client/assets/units/shops/` body/sign 重组，来源及 SHA-256 见 `SAMPLE_SOURCE_MANIFEST.json`，不取旧场景截图。深靛中性背景只用于看透明边和脚点，其它环境尚未绘。

| 锚点 | 观察 | 结论 |
|---|---|---|
| 单拱/镜像 | 左半镜像确实成为单个连续圆洞，没有双尖拱和中缝；桥洞透明。 | `PASS` |
| 桥宽/桥高 | 当前可见桥体比参考外宽约 510 源像素更宽，拱洞亦偏大；桥灯顶部比参考偏低且小。 | `REVISE` |
| 街/六店脚点 | 镜像后直街贯通，现行六店 0.34 位置稳定，脚点落在街面，店铺未重绘；但可见铺砖通行带只有较窄一带，正立石墙占比过大，参考的店前街面更深。 | `REVISE` |
| 桥心标记/材质/灯光 | 参考桥心有醒目的旋纹圆石饰，当前缺失；石块与砖缝更规整、硬边更强，暖灯偏细小。 | `REVISE` |
| 后景/水栏/前河 | 本候选仅街桥，尚无其它新环境层；中性背景不能判最终空间/遮挡。 | `NOT_TESTED` |

诊断：仅将整个候选等比缩小可以减小桥宽，但会进一步缩短现已偏矮的桥灯及桥冠，也不能加入旋纹；非等比缩放会扁化圆洞。单独拉伸直街的现有窄铺砖条会把石块纹理拉长、接缝失真，且桥侧过渡仍留高墙；这不足以满足目标。下一步只针对本源组使用一次带参考的生成修正：把候选原生图作为要编辑的独立透明桥，把冻结参考图作为风格/比例参照，不复制参考像素、不生成六店或完整场景；保持约 510 源像素桥宽与六店脚点，补新绘桥心旋纹、加深店前铺砖、降低正立石墙占比，柔化不规则手绘石块并抬高暖灯。计同问题修正第 1 轮，总调用第 2 次。修正后再次等尺核验，若仍失配最多再一轮而后停桥支线诊断。

工具实际返回 1 张原生 RGBA 图，`image_gen.imagegen` 调用成功；服务端请求 ID、费用与 GPU 时数未提供，均记未知。静态样张并非 Cocos 实际运行；40 MiB/12 batch 均 `NOT_TESTED`。

## 修正 01 与确定性街面投影（候选 2）

状态修订：本段最初由 Art 误判为代表样张 `PASS`；Master 同尺度独立实看后指出，纵向行反射在整条街生成明显镜面对称花纹和重复金色菱形光斑。Art 复看接受，撤回该 PASS，实际结论为 `REVISE`，不得提交 Tech 通过或扩批。候选 2 原生 `source/native/bridge_correction_01_native.png`（2172×724，SHA-256 `ae69201fc7cab504ddc0418c3dbfe620265272863d6047f5121530a61faccf51`）由内置 `image_gen.imagegen` 用候选 1 与完整冻结参考作双图定向修正，仍是新绘独立透明对象，原图像素没有作为切片。此次生成修正记同问题第 1 轮、总第 2 调用；两张候选均保留。

修正图已有桥心新绘圆形旋纹、四盏更可读暖灯、单拱圆洞，桥宽投影与参考约 x1280–1790 的主体范围接近。候选 2 原样等比 0.45 时街面仍窄，遂仅把该新绘图的两侧直街素材做确定性行反射复用：保留中央 x1300–1772 桥主体每个像素；两侧把已新绘铺砖前缘由约 y755 延至 y810，岸墙裁成 y810–850 的短面，过渡区 x1070–1300 / x1772–2002 混合。`source/reflect_street.py` 与 `SAMPLE_STREET_REFLECTION_MANIFEST.json` 记录源到导出的精确变换；这是源图复用，不增加生成调用，不取参考图像素。未采用等比纵向拉伸试片，因 `review/bridge_correction_01_street_projected/bridge_roi_reference_vs_sample_1to1.png` 可见砖块被拉长和软化。

反射试片源 `source/bridge_correction_01_street_reflected.png`（SHA-256 `3c968655a79c2f8fb8358dedd9c5b01f3988cfb1dc3e8b9ac9439e8d4a6708ea`），半幅 `exports/tex_sakura_rr_bridge_correction_01_street_reflected_half.png`（1536×512，SHA-256 `02fd840a4e9dfcbfe57783c39093bed6232938ca12f451226b375b8bd7d110b4`）仅保留为退回证据。`review/bridge_correction_01_street_reflected/bridge_sample_neutral_3072x1024.png` 直接可见纵向反射条带；它虽然满足几何尺寸和桥心像素不变，但视觉上出现未经批准的机械纹样，不能作为正式街桥源。下轮使用剩余同问题第 2 轮生成，在 r1 完整新桥保持不变的前提下新绘两侧约 y690–810 的连续不规则铺砖与 y810–850 的矮岸墙。禁止纵向镜像、规则金色菱形重复。若第 2 轮仍不达标，停止本桥支线交诊断，由 Master 判断其他独立源组是否继续。

六店只读参与脚点检查；最新用户范围 `USER_SCOPE_NO_SHOP_OUTPUT.md`（SHA-256 `954b3a3f1fe260fc7fb2d2f90423b1290e623cb4f1df9935293dc1c9313ba67b`）明确最终 PSD、PNG、环境预览及切片重组均不输出六店。先前带店样张仅内部历史证据，不进入正式交付清单。此决定已在同批 Art 预签附记，五份 Gate1 冻结输入不改写。

## 修正 02：新绘直街补片与最终代表样张

Art 结论：`PASS`（仅代表样张）。同问题第 2 轮、总第 3 次生成得到单独新绘的空直街原生 `source/native/street_patch_correction_02_native.png`（2172×724，SHA-256 `cb67764abbeb7f042743677476d20bebfb7045b63061e3f9f50a0e13fb5e3594`）。使用候选 r1 和完整冻结参考作为风格/几何输入，输出不含桥和六店，原图没有被裁为生产像素。`source/combine_street_patch.py` 从这张新绘直街取独立铺砖与岸墙语义带，投影铺砖到 y690–810、矮墙到 y810–850；只在两侧直街与 r1 桥身的过渡处按 x 混合，中央桥 x1280–1792 的源像素已验证完全不变。`SAMPLE_CORRECTION_02_SOURCE_MANIFEST.json` 记录准确裁框与源/导出 hash。没有纵向镜像、无复制金色菱形条带；仅最终按用户方案从完整合成图切左半、右半水平镜像。

本次选定完整新绘组合 `source/bridge_correction_02_full_work.png`（SHA-256 `12005774ff7f16815f7564d831f544587ff27739028527610b383690bbb49404`），左半 `exports/tex_sakura_rr_bridge_correction_02_half.png`（1536×512，RGBA，alpha bbox `(0,34,1536,338)`，SHA-256 `4168180e2d02b7ad897e4cc5fa74c20c00c32f353d65dfe2088bfb88f2c66f0a`）。同尺寸无店透明镜像样张 `review/bridge_correction_02/bridge_sample_mirrored_transparent_3072x1024.png`（SHA-256 `68b8a1a2f356cc40fd7960036f35a85c54583b4e4b8124199f09b52f0d9777bc`），中性底同尺寸 `bridge_sample_neutral_3072x1024.png`（SHA-256 `e1007c41219083f5c0b81cb776d555837904d6f505df5fcf3e3133ec159b6142`），完整参考并排和桥区 1:1 图在同目录。只读六店脚点检查图 `bridge_sample_with_existing_shops_3072x1024.png`（SHA-256 `846207f68709d5e23d1f4e1baaef72bae9b857f2371dcac046161a0fb7017853`）是历史内部检查，不作正式交付。

逐锚点：单连续圆拱、桥心新绘旋纹、四暖灯、约 510 源像素中央桥视觉范围 `PASS`；六店脚点保持约 y745–760，铺砖到约 y810、低墙至约 y850，河面与栏仍待其他层，街宽 `PASS`；石材仍与参考有原创笔触差异，未出现先前纵向镜面重复，样桥视觉 `PASS`。全景山、树、河、遮挡、PSD 与引擎画面仍 `NOT_TESTED`；本样张通过不批准余 10 组，须 Tech 对实际半幅/alpha/面积复核及 Art/Tech 全批续签。
