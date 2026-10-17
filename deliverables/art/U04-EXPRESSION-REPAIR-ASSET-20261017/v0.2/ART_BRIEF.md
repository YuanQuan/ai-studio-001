# U04 脸缘、发丝与眉缘局部修订 Brief（v0.2）

状态：局部修订预案，等待同批 Tech 预签后才输出代表样图。原 v0.1 为只读基线；本版只修用户圈出的低频皮色蒙版污染与30态同类项，保持人物身份、五官表情、姿态、服装、道具、画幅、坐标和 `base → 单态 face → front` 顺序。

## 范围与视觉锚点

- MT_S2 happy：画面右颊缘与发丝。
- AJ_S2 happy/sad/smile/angry：画面右眉额发、颊缘；happy 先作代表样。
- AD_S0 surprised/sad/angry：眉与额发交界。
- XJ_S0 surprised：画面左额发与眉缘。
- 其余21态逐态查看同类皮色覆盖；仅证实同类缺陷后纳入受影响清单。AT/AC 等无缺陷者沿用旧 hash。

源：v0.1 的 PSD、透明 face、base/front、特征遮罩与 U00 同尺度图。冻结效果和旧版路径见 `../v0.1/ASSET_MANIFEST.json`、`../v0.1/LAYER_EXPORT_MAP.json`。视觉重点为原发丝尖端、眉线锐度、脸缘洁净与表情可辨；不改变原画正确的软阴影。

## 制作方法及停止条件

先检查实际显示图、原 face alpha、特征遮罩与 base/front 原像素。只在确认的污染边界收紧 face/语义特征的透明度，或从旧原像素恢复被遮住的发丝/眉线；绝不对整脸锐化、重采样或重新生图。优先保留现有 PSD 语义层并同步其导出图。AJ happy 代表样须出局部前后对照、差异遮罩、同背景同视窗 U00；若仍明显模糊则再做至多一轮有假设的局部修订，未通过不扩批。

改动区以逐态像素差异遮罩及 bounding box 留证，区外 RGBA 零差异。输出仅失效 PSD/face/U00，总30态看板更新；未变项以原路径和 hash 引用。生成调用预算0，最多2轮确定性局部修订；如发现原像素缺失需要生成补洞，先报告 Master，并按授权与同批预签重新决定。费用与 GPU 时间未知，按实际调用数及墙钟记录。Gate2 仍待用户审核，Client 正式接入和运行 QA 不在本任务内。

来源与权利：本轮只复用现有项目资产与 PSD 原像素，不引入外部参考、字体或新受保护素材。沿用旧包 `SOURCE_REGISTRY.json` 的来源记录；不把局部导出解释为新的版权授权。

规则：`rules/visual_fidelity_compute_contract.md` v0.1 与 `rules/visual_production_contract.md`。本版修订承接已获用户批准的 `U04-EXPRESSION-REPAIR-PLAN-20261017/v0.2/PRODUCTION_PLAN.md` 和本轮用户退回授权。
