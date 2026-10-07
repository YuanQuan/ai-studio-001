# U01 美术资源 v0.1｜工具预签偏差与历史冻结

**状态：HISTORICAL_TRIAL_NOT_FOR_GATE2。** v0.1 的五个 SVG 路径通过本地 Node/sharp 渲染成透明层，再用 bggg 脚本组装 PSD。但首图前获 Art/Tech 同版预签的 `PREFLIGHT_PLAN.md` 仅明确了 bggg PSD 组装，未列出 Node/sharp SVG 栅格化这一独立生产工具及版本/许可。Tech 于本轮发现后判断不能追溯补签；Master 接受该判断。v0.1 的 PSD、PNG、SVG、哈希及真实检查结果全部保留为试制过程证据，**不送用户正式 Gate2、不交 Client 接入**。

本地事后只读核到 bundled Node 当前为 `v24.19.0`、sharp `0.35.4`（本地 `sharp/package.json` 标 `Apache-2.0` 且有 `LICENSE`）、sharp 当前报告 libvips `8.18.6`、librsvg `2.62.91`。v0.1 首轮执行没有预先保存精确运行时版本日志，因此这些当前检测值**不能冒充当时已预签或当时完整日志**。已记录的 v0.1 像素/alpha/视窗核验仍是真实试制结果，但其技术合格不能代替首图前门禁。

修复：在同一正式 Task 的 `v0.2/PREFLIGHT_PLAN.md` 中先锁定原 PSD、五份原创 SVG 与绘制脚本 SHA、Node/sharp/libvips/librsvg、许可来源、bggg 及输出/核验方法；Art/Tech 对新 SHA 在**下一次新图生成前**分别预签。之后仅从获批旧 PSD 四层与 SVG 路径重新渲染 v0.2，并记录实际执行时版本、新 PSD/PNG 哈希和差异。不直接复制 v0.1 PNG/PSD 冒充重新生产。Gate1 已批的画面内容与对象范围不变，故无新用户设计取舍。
