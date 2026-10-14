# U05 B 资源批预算与实耗

预算：代表样片生成调用≤2，全批累计≤6；同一缺陷自动修订最多2轮；制作活动代表≤6小时、全批≤16小时。内部费用／模型算力遥测不可得，记 `UNKNOWN`，不以等待时间冒充制作时间。

|阶段|方法/结果|调用累计|实际产物|
|---|---|---:|---|
|首轮代表|确定性遮罩；空槽残影与对象褐底污染，自审失败|0|`source/representative/` 首轮诊断（已由次轮覆盖的切片另有初诊图片）|
|代表局部补柜候选1|内置 imagegen，冻结 B 为唯一参考，局部移去两对象；未采用整图|1|`source/representative/repair_candidate_v1.png`，SHA-256 `eabc2b52c218cbe2e737f2ab566ec7dd93e642ec166d836641f6ac5c3a2d3e07`|
|代表局部补柜候选2|内置 imagegen，同两空槽；只在同批 ROI 内贴回清底|2|`source/representative/repair_candidate_v2.png`，SHA-256 `ab3a8a4f00f180eca15207c0b656c1b93a64439bee9b8b3bd71db09b97937872`|
|代表次轮|确定性重绘语义遮罩、清柜与无参考层重组；Art 自审及 Tech alpha/空柜实图核通过|2|`review/REPRESENTATIVE_REVIEW.md`、Tech `REPRESENTATIVE_TECH_CHECK.md`|
|全批柜格补绘|内置 imagegen 仅补 12 个对象原遮挡后的柜背；只采用签认格位内区域|3|`source/repair_all_slots_candidate.png`，SHA-256 `6475921d0574c6de7cf020932882fb764caaf248cc5b7bdfc61c35f5be2dfb23`|
|场景隐底补绘|内置 imagegen 仅补幽灵／气泡／工作杯／按钮移除后的局部隐底|4|`source/repair_scene_candidate.png`，SHA-256 `4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af`|
|全批确定性分层|按原图可见轮廓切 12 对象，重排字，局部修 2 杯，生成 PSD／导出与重组|4|`source/workspace_b_master.psd`、`review/reconstructed.png`、`review/resource_sheet.png`|

最终实耗 4/6 次，全批剩余 2 次未使用；代表 2/2 次。4 个候选原件均留源目录，未把生成的整画面作为正式背景。文字曾有静底旧字和褐色方补丁的首轮诊断，`review/history/text_pass1_*` 留存已存在的中间图；第二轮以米白名牌内芯清底和准确木牌字区修正，未增加 imagegen 调用。脚本产物与最终 SHA-256 见 `CUT_MANIFEST.json`。内部费用 `UNKNOWN`；可信的逐调用开始／结束时间未自动记录，记 `UNKNOWN`，不据文件修改时间估算制作耗时。
