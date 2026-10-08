# U03 R3 Web 运行记录

构建身份：Creator 3.8.8 Editor builder task `1791356044228`，2026-10-07 14:54:04–14:54:24 +08:00，状态 success；输出 `apps/client/build/u03-shop-client-r3-web-mobile/`，107 文件逐件 SHA-256 与构建日志 SHA 见 `evidence/R3_BUILD_MANIFEST.json`。本地 HTTP `http://127.0.0.1:8776/` 返回 200。浏览器检查由 Master 在 Codex 内置浏览器完成。现已保存 16 张截图及控制台记录到 `evidence/r3_iab/`；逐件尺寸、字节数和 SHA-256 见 `evidence/R3_IAB_EVIDENCE_MANIFEST.json`。

截图索引：`390_shop_01.jpg` 至 `390_shop_06.jpg` 为 390×844 六店；`720_shop_01.jpg` 至 `720_shop_06.jpg` 为 720×1280 六店；`390_menu.jpg`、`390_u01.jpg`、`390_u02.jpg`、`390_u03_reenter_01.jpg` 记录菜单、回归及重入。这些截图现以 `.jpg` 命名，文件头为 JPEG/JFIF；改名未改像素或二进制内容。

| 视口 | 实际操作与观察 | 结果 |
|---|---|---|
| 390×844 | U03 入口可用；初入 01 奶茶店的店体、牌匾、身份同屏可见；连续下一店依次 02、03、04、05、06、01，每步仅一店并与身份相符；返回菜单再进入复位 01 | 限定鼠标/视觉冒烟 PASS |
| 720×1280 | 01 和 04 店体、牌匾可见；从 04 快速三次“下一店”最终为 01，实图和身份相符 | 限定鼠标/视觉冒烟 PASS |
| Console | `console_logs.json` 共 110 条，按 R3 端口 `8776` 过滤为 102 条：log 3、info 99、warn/error 0；`U03_SHOP request/commit/presented frame` 各 33 条 | PASS（该日志集合内） |

R1 构建后入口“资源未就绪”，R2 构建后状态切换但店图空白，均是已修复的历史失败，不并入 R3 通过范围。R3 没有执行真实触摸、触摸与兼容鼠标同手势去重、失败注入/定向重试、加载乱序、六店逐件牌匾尺寸量测、录屏、固定帧时/DrawCall/纹理占用、完整目标设备或小游戏平台测试。这些保持 `NOT_TESTED`，需 Tech/UI/QA 按获批计划独立验证。`presentedFrameAt` 日志已有触发证据，但未用同一时钟做正式冷/热加载与阈值统计。
