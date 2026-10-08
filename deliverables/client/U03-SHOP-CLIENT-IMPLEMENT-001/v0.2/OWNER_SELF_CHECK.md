# U03 单元示例 Owner 自检 v0.2

Owner：Client。对象为用户已批准的 `U03-SHOP-CLIENT-IMPLEMENT-001 v0.1/R3`；本稿只补运行自检，不修改获批代码或 12 张正式 PNG。输入 Gate2 v0.4 清单 SHA-256 为 `C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191`，R3 Creator 3.8.8 builder task `1791356044228` 于 2026-10-07 14:54:24 +08:00 成功。构建日志 SHA-256 `265D4EA7DA4926D22C6111A9B325492336F6223A88CA9220553060C4E146C607`。本轮重新核对 R3 的 107/107 构建文件与 17/17 原始 IAB 文件 SHA，无不匹配；索引见 `../v0.1/evidence/R3_BUILD_MANIFEST.json`、`../v0.1/evidence/R3_IAB_EVIDENCE_MANIFEST.json`。

## 自检结果

| 项目 | 结论 | 可复核证据与边界 |
|---|---|---|
| 六店资源身份 | PASS（静态/导入） | 12 张 Art→Client PNG SHA 一致；Creator 六 Prefab 与 image/Texture2D/SpriteFrame UUID、Scene 强引用见 `../v0.1/RESOURCE_IDENTITY_AND_UUID.md` 和 `project/ASSET_HANDOFF_REGISTRY.md`。R3 正式资源未替换。 |
| 默认 01、单店/牌匾/身份 | PASS（限定静帧） | `../v0.1/evidence/r3_iab/390_shop_01.jpg` 至 `390_shop_06.jpg`、`720_shop_01.jpg` 至 `720_shop_06.jpg` 共 12 图；逐图可见一店，01–06 身份与各自店体/牌匾一致，候选画面未见常驻控件遮挡。静帧不证明逐帧原子切换。 |
| 正向与反向六店 | PASS（限定鼠标操作） | R3 390×844 记录正向 01→02→03→04→05→06→01；本版 `evidence/390_reverse_06.jpg` 至 `390_reverse_01.jpg` 为反向 01→06→05→04→03→02→01 的节点静帧。没有连续录屏或每次物理输入去重计数。 |
| 20 次连续下一店 | PASS（最终目标限定） | Master 在 R3 Web 页面执行 20 次“下一店”，最终 `evidence/390_twenty_next_final_03.jpg` 显示 03 炭烤摊，与 01 起点按 20 次的循环目标一致。单张终态图不证明中间所有帧无错牌、旧回调隔离或时限。 |
| 10 次返回重入 | PASS（初末态限定） | Master 在 R3 Web 页面执行 10 次退出/重入，`evidence/390_reenter_cycle_01.jpg` 与 `390_reenter_cycle_10.jpg` 均显示默认 01 奶茶店；无每轮实例/监听/资源引用计数。 |
| U01/U02 有限回归 | PASS（限定鼠标冒烟） | `../v0.1/evidence/r3_iab/390_u01.jpg` 见 U01 四层画面，Master 观察放大/重置响应；`390_u02.jpg` 见游客，Master 观察 walk 和帽子穿卸响应。拖动全边界、U02 全动作/槽位、真实触控和输入隔离未覆盖。 |
| 控制台与画布 | PASS（已捕获集合） | `../v0.1/evidence/r3_iab/console_logs.json` 中 R3 端口 `8776` 的 102 条无 warn/error，request/commit/presented frame 各 33 条。本版复用的 `evidence/r3_qa_console_logs.json` 共 218 条，其中 R3 端口 210 条为 log 3、info 207、warn/error 0；两个日志集合的采样窗口不同。`evidence/r3_390_canvas.json` 只记录 CSS/backing 均 390×844；不能据此推出 DPR 或安全区。 |
| 运行性能与内存 | NOT_TESTED | 12×1024²×4 仅给出静态 RGBA8 页面等效 48 MiB，不等于 GPU 驻留。没有同钟冷/热各三次、60 秒×3×六店逐帧序列、FPS/DrawCall、20连按耗时、10次重入节点/监听/引用计数。`presentedFrameAt` 日志存在，不构成阈值统计。 |
| 真实触摸/故障/目标平台 | NOT_TESTED | 无真机触摸、兼容鼠标同手势去重、DPR/UA/设备安全区的完整环境记录，也无受控乱序、缺图/解码/结构/超时与定向重试注入、微信/目标平台测试。 |

## 原始材料与结论边界

本版 `evidence/` 保存 9 张补充 JPEG 静帧、`r3_qa_console_logs.json` 和 `r3_390_canvas.json` 的逐字节副本；`evidence/OWNER_EVIDENCE_MANIFEST.json` 登记来源路径、字节数、SHA-256 和 9 图的 390×844 尺寸。只复用原始材料，不继承已取消示例 QA 任务的判定、用例状态或 TEST_REPORT 结论。R3 两视口六店图及菜单/U01/U02/重入图仍以 Client v0.1 的 16 张 JPEG 原件为准。

Owner 自检支持：六店正式资源身份、候选双竖屏静态画面、限定鼠标双向循环、20连按最终目标、10次重入默认 01 及 U01/U02 基本冒烟均有可核证据。逐帧原子性、故障恢复、真实触摸、运行性能和目标平台仍未测，不写为 PASS。此单元示例按最新 `AGENTS.md` 由 Owner 留证；本稿不改变 v0.1/R3 的既有用户批准，也不把已取消 QA 草稿当成正式 QA。最终接受仍由 Master 依当前示例规则和本稿证据判断。
