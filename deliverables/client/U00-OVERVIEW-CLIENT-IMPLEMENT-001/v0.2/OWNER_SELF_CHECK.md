# U00 Client Owner 自检 v0.2（R2）

| 核查项 | 当前结果 | 证据或说明 |
|---|---|---|
| 菜单顺序U00、U01、U02、U03 | PASS | 390视口R2实际截图确认四卡顺序及入口显示，见`evidence/iab/r2-menu-390.jpg`。 |
| 顶栏调店开关与折叠/控件输入隔离 | PASS | 两视口打开调店面板；折叠后390视口街景拖动/缩放可用，见`r2-adjust-open-*`、`r2-collapsed-pan-zoom-390.jpg`。 |
| 六店选择、店名、脚点坐标和聚焦 | PASS | 390视口奶茶调至(-1311,-265)，糖画(-900,-225)；720视口选至投壶并调为(1270,-175)，店铺可见，导出JSON确认值。 |
| 步长1/10/50及X/Y四向微调 | PASS | 390截图/导出文件显示步长和坐标正确；见`r2-step1-390.jpg`、`r2-step50-390.jpg`及导出JSON。 |
| 恢复六店基线 | PASS | R2触发恢复后导出基线值；见`r2-restored-all-390.json`。 |
| 整组参数JSON和用户可复制文本 | PASS | 导出JSON含6个稳定ID/名称/脚点/scale；面板弹出可选只读文本框。真实手动Super+C后`clipboard.readText`为855字符，与DOM导出全文一致；见`r2-manual-copied-390.json`。 |
| Clipboard API拒绝/失败专门分支 | NOT_TESTED | 未强制诱发浏览器写入拒绝；源码在成功和失败时都会呈现JSON文本框，失败提示手动复制。 |
| 临时预览和重进恢复基线 | PASS | 390返回重进恢复六店基线与步长10；见`r2-reenter-baseline-390.jpg`。 |
| 相机重置、手势和店铺坐标独立 | PASS | 390实测重置镜头不覆盖脚点修改；拖动/缩放与折叠面板场景交互通过。 |
| 原U00显隐、顾客数和街景控制 | PASS | R2实测三组独立显隐、0→1及8上限；店铺隐藏/街景隐藏画面见`r2-hidden-count-street-hidden-390.jpg`。 |
| 图片/Prefab/Scene/字体/meta/其他资产完整性 | PASS | `RESOURCE_INTEGRITY_CHECK.json`覆盖198 tracked files；两份获授权TS外196/196不变。 |
| TypeScript静态编译 | PASS | Creator 3.8.8随附`@cocos/typescript`，exit 0。 |
| Creator Web-Mobile构建和HTTP | PASS | R2 exit36/Finished，149文件/25,935,211 bytes；4174 HTTP 200，index哈希一致。 |
| 内置浏览器两视口及console | PASS | 390、720视口R2检查通过；console warn/error为空；`evidence/RUNTIME_R2_MANIFEST.json`绑定最终源码SHA并收录25份证据哈希，具体交互证据见`evidence/iab/`。 |
| 真机触控、性能及Library逐UUID回读 | NOT_TESTED | 不从桌面Web推断。 |

结论：R2构建、HTTP及两视口桌面Web自检完成；当前交Tech/Master专业评审和用户审核。Clipboard拒绝分支、真机专项及逐UUID回读未测试；本自检不代表正式QA或任务DONE。
