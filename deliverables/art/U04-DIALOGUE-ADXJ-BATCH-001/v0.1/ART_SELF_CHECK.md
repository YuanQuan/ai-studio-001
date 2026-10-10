# 阿灯／小锦六阶段 Art 自检 v0.1

审图与核验记录：2026-10-10T18:14:05+08:00。范围为内部制作批次，主 Art 还需独立实视检并整合统一 Gate2。

| 锚点 | 结果 | 实图/数据证据 |
|---|---|---|
| 批准源与身份成长 | PASS（静态） | 六源哈希见 `PRODUCTION_NOTES.md`，六阶段同尺度 `review/six_stage_u00_smile_board.png`。阿灯三种灯笼与手势、小锦 0/2 镜框及 3 魂无镜保留。 |
| 干净脸底与前遮挡 | PASS（静态视觉） | `source/*_clean_full.png`、`source/*_feature_mask.png`、`source/*_front_occlusion.png`；鼻位逐阶段修正，小锦S3旧嘴失败版在 `review/rejected_v3_nose_and_mouth/`。 |
| 五态目标尺度辨识 | PASS（静态视觉） | 六张 `review/*_five_state_board.png` 和30张 `review/*_u00_static.png`；高兴张口、惊讶 O 口、悲伤下垂嘴、默认微笑和生气细抿嘴在相同尺度分辨。小锦S0眨眼默认态保留。 |
| 分层与映射 | PASS（结构） | 六 PSD 实解析均18层/13隐藏、隐藏层 alpha 非零，SMILE缓存与PNG预览差0；6基底、30脸片、90眉眼嘴源层、6前遮挡均实存并列 SHA。 |
| 导出重组 | PASS（像素） | `COMBINATION_CHECK.json` 逐态记录30组导出重组；从三源层独立再合成与导出组合逐通道差0。 |
| 正式客户端导入与运行 | NOT_TESTED | 尚待具体切片 Gate2 与后续 Tech/Client/QA；当前只提供同尺度静态效果，不给 UUID/运行结论。 |

## 可编辑范围与审图限制

PSD 保留原批准源隐藏参考层、实像素眉眼嘴层、局部皮肤重建基底及前发／镜框栅格层；可移动和修订这些栅格层，不能恢复原平面图中未天然分层的笔触。`review/rejected_v3_nose_and_mouth/` 是失败证据，不进入 `exports/`。

阿灯S2灯笼附近原图职业道具自带发光保留；外轮廓软晕在导出 alpha 中做低值清理。当前静态审图仍需主 Art 用真实图片独立判断，数字校验不能代替视觉接受。
