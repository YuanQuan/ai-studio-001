# U04 表情脸缘局部返修：技术诊断 v0.1

## 输入和结论

用户于 2026-10-17 退回六阶段30态 Gate2 v0.1，授权只修 MT_S2 happy 右颊/发丝、AJ_S2 happy/sad/smile/angry 右眉额发与颊缘、AD_S0 surprised/sad/angry 眉额发交界、XJ_S0 surprised 左额发眉缘，并核同类缺陷。输入为 `deliverables/master/U04-EXPRESSION-EDGE-REVISION-20261017/v0.1/USER_REVISION_AUTHORIZATION.json` 与原 30 态实际尺度总板；原 PSD、切片及清单 v0.1 只读。

诊断为源脸片/feature 蒙版和遮挡边的局部合成污染，不能将问题仅归于总板缩小采样。AJ_S2 happy 原始 256×256 face PNG 在眉、额发、颊缘已经含皮色与头发，alpha 1–254 的像素达 8,595 个；这在显示前就已存在。`resume_20261017/make_expansion_masks.py` 第 32 行对 4 倍掩码做 `GaussianBlur(8)` 再 Lanczos 缩至 256，产生约 2 个 face 像素量级的软过渡，若多边形逼近发丝/眉缘会把候选皮色混入原边。此脚本直接覆盖 AJ 四态扩展，happy 的既有定义也须单独核同一原理。旧 base/front 的残色或软边仍需按各态实际合成核查，不可只改 feature 就推断全部解决。

AJ_S2 `front_repair.png` 为 186×155，alpha 1–254 像素 1,384 个，alpha 最大 253；脸区多数像素 alpha=0，虽然 RGB 缓存旧脸，正常 straight-alpha 合成不会显示。示例坐标 (90,50)、(90,80)、(130,80) alpha 均为 0；因此不能因图像查看器展示隐藏 RGB 而认定整脸 front 覆盖。可见发丝边缘仍应逐像素检查，并核导出/运行管线是否误用透明 RGB、预乘方式或过滤采样。base 全图 alpha 最大也为 253，单凭文件查看不能判定实际可见重影。

## 同批局部技术方法

1. 保持 1024×1536 母版、各阶段现有 face 原矩形/偏移/支点与 `base → 单态 face → front` 顺序。禁止改脸、身体、服装、道具身份及扩批。
2. 在当前 PSD 内将受影响 feature 皮色蒙版收回眉发/颊线内；用已有原像素恢复发丝和眉缘轮廓。对 base/front 仅在证实有可见旧色或擦除软边的 ROI 局部修补；透明区 RGB 不作为视觉缺陷。先做一处代表样张，0 次生成调用，最多两轮局部修订。
3. 记录每个实际改动的 ROI 与受影响层；只导出变化层。按统一解码、直通 alpha 规范化和原有合成设置比较，ROI 外 alpha 与可见 RGB 应逐像素零差异；完全透明 RGB 独立记录，不混入视觉差异。先比原生三层合成，再比 PSD 可见结果和真实 U00 同背景同视窗同尺度画面。30 态扫同类缺陷，未授权扩大的修改须先上报。
4. 留存 v0.1 原 hash 与 v0.2 新 hash、具体差异图、局部放大和实际尺度总板。静态通过不代表 Client 导入或目标机采样通过；Gate2 由用户审核具体切片/重组版本。自产切图直接送用户，不增成品效果专业复审门槛。

当前是开工诊断，不宣称 v0.2 已制作或最终视觉通过。

## 先验 ROI 映射核正（首样前补充）

原 `U04_30_STATE_NAMED_ACTUAL_SCALE.json` 明载总板每格为原 U00 的 172×172 直裁；MT/AJ 的 source→U00 使用 `(-55,210)+0.6×source`。故 `board_point → U00_point = crop_origin +(board_point-board_origin)`，再 `source=(U00-(-55,210))/0.6`，`native=source-face_source_rect_origin`。按用户圈图中心的近似读点，AJ happy 总板约 `(237,785)`、该格 board 原点 `(110,668)`、U00 crop 原点 `(155,279)`，得 native 约 `(197,180)`；MT happy 总板约 `(235,185)`、board 原点 `(110,53)`、U00 crop 原点 `(152,261)`，得 native 约 `(193,205)`。圈线边界须以原标注图复核，此中心仅用于核先验允许范围不能遗漏。

Art 首版 `ALLOWED_ROI_BEFORE_EDIT.json` 的 AJ 颊缘 y94–152、MT 颊缘 y67–171 均未覆盖上述圈中心，需在首张修图前按真实圈区修订先验 ROI。它是授权区的坐标纠偏，不等于可大面积涂改；新区域仍限可见污染窄边。修订后的 ROI 路径和 hash 应纳入首样检查，结果 diffmask 不得反向定义授权区。

圈区中心是坐标覆盖检查，不是该处必有 feature 污染的证据。Art 复核 AJ 下颊中心 face alpha=0、base 与批准参考可见 RGB 差 1–7；此点须按底层原像素/旧残色/合成链单独判断。由 Master 原圈图可视估算的 AJ happy 下颊 native 外接框约 x165–230、y143–220（左上邻嘴角软边），MT happy 下颊约 x149–244、y168–247。两框用于先验允许范围的保守包络，真正修改只限框内经证实的污染点；逐点分别归因 feature alpha、base/front 可见像素或采样，不能把整框一律归为 feature 羽化。原标注附件无本地文件路径，上述边界为可视近似，坐标换算本身依原板 JSON 可复算。
