# U05 B 资源登记 v0.1

正式美术源为 `source/workspace_b_master.psd`（61 个语义层）；61 层与源文件 SHA-256 见 `source/LAYER_MANIFEST.json`，57 个实际导出 PNG 的稳定 ID、Art 路径／哈希／尺寸／alpha 边界／支点、Client **计划**路径与未导入 UUID 见 `CUT_MANIFEST.json`。当前所有客户端路径均为 `PLANNED`、UUID 为 `null`；Gate2 前不进入客户端工程。`exports/STATIC_BARE.png` 是清底店面，不是覆盖对象的原概念图。

|组别|稳定 ID 与对象|实存资源|
|---|---|---|
|茶 3|`U05_B_T01` 幽灯茶、`T02` 月雾茶、`T03` 冥霞茶|各自透明壶体；各自空格／米白名牌独立|
|奶 3|`U05_B_M01` 云魄乳、`M02` 霜铃乳、`M03` 萤绢乳|各自透明壶体；名牌误字已从静底清除|
|小料 6|`U05_B_P01` 鬼火珠、`P02` 梦纹冻、`P03` 灯芯脆、`P04` 影鳞片、`P05` 魂铃籽、`P06` 夜羽酥|各自透明碗体，不携名牌／柜框|
|共用杯内容|`CUP_TEA_T01..T03`、`CUP_MILK_M01..M03`、`CUP_TOP_P01..P06`|12 张同一 183×233 透明画布，订单／工作杯复用；坐标和层级见 `CUT_MANIFEST.json`|
|场景与状态|`CUSTOMER_GHOST`、`ORDER_BUBBLE_EMPTY`、`ORDER_CUP_BACK/FRONT`、`ORDER_STRAW`、`WORK_CUP_BACK/FRONT`、`COUNTER_FRONT`、`LABEL_PLATE_*`、`SELECT_*`、`LOCK_*`、`BTN_*`|各自透明；选中亮框从静底剥离，锁态是可选遮罩|

动态类别、12 名字、顶栏计数／计时、三按钮字的样式示例见 `source/layers/TEXT_SAMPLE_DYNAMIC_full.png`；运行时文本应按 Product/UI 状态重排。字体与 OFL 许可完整副本在 `source/font/`，哈希见 `CUT_MANIFEST.json`。所有切片源为当前 PSD 同批图层，不使用 `concept_B.png` 作为运行时整图盖顶。图源授权／相似性核对见 `REFERENCE_AND_RIGHTS.md`。
