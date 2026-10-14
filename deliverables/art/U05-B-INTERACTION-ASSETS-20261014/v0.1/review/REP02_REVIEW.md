# REP-02 第二轮代表实图 Art 自查与停止诊断

状态：`REVISE / STOP_AUTOMATIC_REPAIR`。此轮已获同 `REP-02` Art 与 Tech 文字预签，仅按修订界再次制作局部净底、表情代表 GIF/拼图。不会据此进入 FULL，也不会交用户 Gate2 冒充成品。

源：v0.2 `STATIC_BARE` SHA `f0aada4dc35c80930a034a14f228a6012e59b783f93f342899ccf00251af4c34`、同项目历史净底候选 SHA `4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af`、旧角色 332×301 SHA `9689d44f31aa6e6b20c938543a785a9ec0a07c450d0fa42342092b23dfc3b1a2`。结果：`exports/STATIC_BARE_CLEAN.png` SHA `2160dd5789174154304e49d3a6fd4230a095bcf1e3777caf4db1f939d3e179c9`；`review/animation_representative.gif` SHA `c59abd0edd2996d2d1e940b5063f8e5813d715a20187087f6167e7936662c903`。完整参数见 `review/REPRESENTATIVE_METRICS.json`。

| 锚点 | 结论 | 证据 |
|---|---|---|
| 新遮罩以外冻结静底 | `PASS`（像素） | 1024×1536 RGB8/sRGB 原像素比较；20,662 像素精细遮罩外变化数 0。 |
| 三处残影完全消失，木纹/夜景连续 | `REVISE` | 实图 4 倍核验 `STATIC_BARE_CLEAN.png` 的 x600–711/y690–783 仍有窗口右下淡色尾影，x418–603/y1090–1130 仍有浅色杯沿椭圆，玻璃区也有轻微轮廓。此轮阈值 12、细遮罩内复制历史同源候选；结果对候选的最大残差分别 11/10/10 通道级，窗口尾区 3,813 像素、杯沿 312 像素、玻璃 466 像素为每像素最大通道差 4–11。其值小但在放大核验仍呈物体轮廓，不能用区域外零差异或阈值合格代替视觉无残影。 |
| 原角色中性与未改身体 | `PASS`（像素） | `CUSTOMER_BODY + FACE_NEUTRAL` 与旧角色完整 RGBA 差异像素 0；脸遮罩外 RGBA 差异 0。 |
| 开心局部脸与时序 | `PASS`（独立预览） | `review/animation_representative.gif`：0ms 中性、40ms 压眼、80ms 闭眼、150ms 展开起、225ms 展开中、300ms 开心极值；`FACE_SQUASH`/`FACE_EXPAND_MID` 是局部辅助补间，并非新增两种情绪状态。实际 Cocos 回放仍 `NOT_TESTED`。 |
| 完整离窗、气泡和订单杯 | `PASS`（独立预览） | 400–850ms x309→−72，共 −381 源像素、450ms；离场起点气泡收，末帧角色完全越过 x260 窗左界。目标杯同源杯层以中心 `(653,416)` 整组 0.78；GIF 是 360×640 contain，13 帧。实际窗 Mask/柜台前缘与 Cocos 运行仍 `NOT_TESTED`。 |
| 完整组件场景/PSD/Gate2 | `NOT_TESTED` | 尚无带12原料架/标签/台面三件的最终组件重组；新版多层 PSD、正式切片、Client 导入及目标平台性能均未完成。 |

REP-01 与 REP-02 已用满同一净底问题默认两轮自动修正，累计内置 image_gen 调用 0/3，未超过制作活动 45+30 分钟上限。Art 在此停止自动修补和 FULL 扩批，不自行把差异阈值降到 4、整框贴历史图、扩大遮罩、重绘夜街或重置轮次。可复核的下一步假设是对已批准物件轮廓手工描出低对比残影、只在签认界内用同源净底逐像素修补；这需要 Master 对失败证据与是否继续这项局部方法作决定，并按受影响制作参数组织 Art/Tech 复签。若其结果仍不理想，再比较局部生成候选或新的视觉方案，不先行执行。
