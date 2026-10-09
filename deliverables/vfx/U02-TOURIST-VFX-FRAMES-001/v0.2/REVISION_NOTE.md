# v0.2 脸层接缝修订说明

v0.1在同批Art/Tech R2预签后实际导出walk00、run00、happy04、sad05；Owner查看512px静态源/实PNG/确认GIF对照及黑灰白左右配件重组时发现sad05矩形暗缝，记录REVISE并停止其余36帧。失败版本保留在v0.1，未作为用户已批准资源或Client正式资源。

问题是透明覆盖合成：body脸孔洞和face为互补切片，分别经同一刚体旋转、LINEAR采样后，source-over把边界半覆盖合成为约0.75；实际内缝alpha190..194，而邻接完整脸区域约253。

修订仅在离线sad脸层最终Canvas叠加时用lighter合成互补预乘RGB和覆盖，随后恢复source-over；原型文件、Art源、PSD、Shader、网格、五官刚体矩阵、颈部、姿态、时序与其他三动作都保持。服务只读注入一处合成语句，诊断输出与正式frames分目录；诊断不具备正式资源身份。

实诊断见 `diagnostics/sad05-lighter.png`、`diagnostics/sad-seam-before-after.png` 与 `DIAGNOSTIC_AUDIT.json`。Owner已亲自查看黑/灰/白三底前后图，接缝消失，未见新增亮边和色偏。364像素发生变化，opaque区域最大RGB通道差1，未出现>1的内区域色差；五官样点完全一致。内缝(317,194)alpha194→253、(320,194)190→253、(316,197)199→253。此诊断结论不代替正式代表PNG核对、完整全批核验或用户Gate2。

冻结输入及工具SHA见 `TOOL_FREEZE.json`；v0.2仍须Art/Tech确切字节预签、4张正式代表实图核对后再扩36张。正式接入、Creator、运行与QA均未测试。
