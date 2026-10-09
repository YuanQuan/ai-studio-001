# U03 六店 Gate2 v0.4 质量报告

审核输入：`SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json`，SHA-256 `C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191`。本批恰为六张 PSD 和十二张 1024² RGBA `body/sign`；01 使用近正面 v0.4，04 使用近正面 v0.3，其余四店使用 B92% 字层 v0.3，旧 01/04 不在当前包。

| 检查项 | 结果 | 证据与边界 |
|---|---|---|
| 六店文件及指纹 | PASS | `ART_FILE_CHECK.json` 实核 6 PSD、12 切片及全部候选引用现存且 SHA 匹配；Tech 最终候选包后验 `SIX_SHOP_GATE2_TECH_ACCEPTANCE_V04.json` APPROVED。 |
| 分层和两片重组 | PASS | 五店/01/04 构建报告及 Tech 独立后验；PSD 可见层与 `body+sign` 最多 1/255 通道舍入。 |
| 六店视觉与文字 | PASS | `SIX_SHOP_GATE2_ART_ACCEPTANCE_V04.md`；六店同尺度总览；12 个简体字准确、B92% 效果，01/04 屋顶无大 LOGO。 |
| 390/720 静态投影、四底 alpha | PASS | 候选清单逐店全视口与四底路径；Tech 最终包后验逐项核 12 张视口投影。 |
| 01/04 近正面侧墙比 `≤0.12` | NOT_TESTED | 同尺度视觉为近正面，但未有可复核的正面/侧墙几何测线，不能称数值阈值已实测。 |
| Photoshop/Photopea 交互开存、Creator 真机/性能/安全区 | NOT_TESTED | PSD 有独立层与解析器核验；交互编辑及运行留待 Gate2 后 Client/QA。十二张 1024² RGBA8 裸展开约 48 MiB，不代表实际显存峰值。 |
| 字体软件分发 | PASS | 候选包仅含固定牌文栅格字层，TTF 只在本地；官方原 TTF/声明原件未获取及比对，若条款出现用途限制须停用复核。 |

Art/Tech 生产后验通过仅表示可提交**当前具体版本**用户 Gate2 审核。用户明确批准前 Client 计划路径保持 `PLANNED_NOT_IMPORTED`、UUID 空，不接入正式工程。
