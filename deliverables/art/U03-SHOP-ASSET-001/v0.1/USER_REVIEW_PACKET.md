# U03 六店切片 Gate2 v0.4 审阅包（待用户审批）

当前候选组合：**01 奶茶近正面整体重绘 v0.4；02 糖画、03 炭烤、05 花灯、06 投壶 B 快乐体 92% 字效 v0.3；04 理发近正面整体重绘 v0.3**。确切六店 PSD、12 张 `body/sign` 切片、逐店重组、390×844 与 720×1280 全视口、同尺度总览的路径和 SHA-256，均以 [`SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json`](SIX_SHOP_GATE2_CANDIDATE_MANIFEST_V04.json) 为准；该清单 SHA-256 `C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191`。同尺度总览为 [`preview/milk_tea_full_redraw_v04/six_shop_same_scale_overview.png`](preview/milk_tea_full_redraw_v04/six_shop_same_scale_overview.png)，SHA-256 `B73D5DC08037F8D37881BDC0FA01B3B3270E5FB9077D5E3E1DE57B9522C08B78`。

Art 对六店合版的 [验收记录](SIX_SHOP_GATE2_ART_ACCEPTANCE_V04.md) 结论 `PASS`，SHA-256 `1ADCED8DA54F1BFA5E752B14932DBEF13CE98C5FFCF046D465D8020A5AF4783C`。Tech 对同一清单的 [最终候选包后验](SIX_SHOP_GATE2_TECH_ACCEPTANCE_V04.json) 结论 `APPROVED`：43 项引用逐一匹配 SHA，6 张 PSD 与 12 张 1024×1024 RGBA 切片实存，六店双视口投影和总览一致。01/04 近正面角度与牌匾差异、经营物可辨由同尺度目视判读；侧墙比例暂无可复核几何测线。

候选清单内的 `CANDIDATE_PENDING_TECH_POSTCHECK_AND_USER_GATE2` 是锁定清单时的状态快照；随后 Tech 已针对该**相同 SHA** 后验通过，现仅待用户 Gate2。为保持已审文件的 SHA，不回写清单状态字段。

旧 01 B92 v0.3 PSD/切片、旧 04 局部角度版本只作历史，不在当前六店候选包。字体只保留固定牌文栅格像素；站酷官网原 TTF 与随附声明尚未取得/比对，TTF 不随 PSD、仓库或游戏包分发。Creator 纹理页、真机显存/帧时、安全区和实际字体边缘仍未测试；Client 正式路径与 UUID 仍是计划。六店 Gate2 对当前具体切片与同尺度效果的用户明确批准前，Client 不得正式接入，QA 不开展本版运行验收。

**送审状态：Art/Tech 对当前具体候选包均已通过，文件清单、交接登记及固定交付索引已完成；由 Master/Producer 按审批流程提交用户 Gate2。本文件不代表用户已批准 Gate2。**
