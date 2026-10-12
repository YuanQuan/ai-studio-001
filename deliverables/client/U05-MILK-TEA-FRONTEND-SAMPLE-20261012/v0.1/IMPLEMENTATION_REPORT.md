# U05 奶茶小游戏客户端实现报告 v0.1

## 实现内容
- 在现有单元示例 Gallery 菜单增加 U05 奶茶小游戏入口，其余五店文字标明“待讨论”。U05 内容由独立 `labs/u05` 模块承担，不把玩法代码继续塞入主 Gallery。
- 玩法数据唯一来自获批生成器 v0.2 的完整 server JSON 等字节副本，放入 `assets/resources/u05_milk_tea/config.json`，Creator 运行时通过 `resources.load<JsonAsset>` 读取。复制 SHA 与获批文件相同：`bcb757797059e1e022b67609ec4ba8bdbfa40829febe49055fee4a35322a4cb8`。该全量候选仅供隔离 Lab 本地模拟，不是服务端运行接入。
- 支持五档、每档两阶段、阶段锁定、点选原料、撤销、查看配方、缺项禁交、错杯清空并重做当前单、三杯通关、限时失败、重试和返回。选档锁与升级条件读取 `unlock_conditions` 和阶段 `xp_from/xp_reward`，阶段维度与选项数从同一配置读取；解锁记录永久保留。
- 示例设置能查看档位/阶段与成长输入，并在清楚标示的验证模式中访问高档。验证局进度仅保留在当前会话；正常 localStorage 进度使用 `u05.milk-tea.lab.v1`，设置使用独立 `u05.milk-tea.lab.validation.v1`，不碰主体/生产存档。损坏数据恢复为默认进度并显示提示。
- 视觉使用现有深蓝卡片、Graphics、Label 和系统字体，另用少量 Graphics 绘制杯身、奶茶层与吸管；没有新图像/字体依赖。

## 文件与复用
复用 Gallery 的单元菜单、程序绘制风格与 Cocos Creator 3.8.8 工程。主文件只做 U05 import、组件引用、菜单卡片和 Lab 页面宿主的必要接线；U05 状态、交互与配置处理在独立模块。Gallery 操作前基线 SHA 为 `655303582a108e115e1081801de7fc24714778fc5f687ad17661a645ec7b986c`，原字节副本已在 `evidence/UnitSampleGallery.baseline.ts` 校验恢复。项目中其他 U01 编辑差异保留。

## 验证
- 纯状态逻辑检查：PASS。命令 `node deliverables/client/U05-MILK-TEA-FRONTEND-SAMPLE-20261012/v0.1/evidence/milk_tea_state.check.js`。覆盖五档/两阶段维度与选项池、阶段阈值、初始仅简单、缺项拒绝、撤销、错杯同单、三杯通关、经验只结算一次、失败/退出不给经验、截止前/截止时边界、所有启用门槛、永久解锁和坏存档结构。
- Creator TypeScript quick check：针对 U05 与 Gallery 接线筛选后没有 U05 错误。Creator 3.8.8 声明文件在独立 `tsc` 中有项目既存引擎定义/旧 Gallery 问题，因此以 Creator 的正式 CLI 编译/构建为主。
- Creator 3.8.8 隔离 `web-mobile` 最终构建：PASS，进程退出码 36；23:27:20 出现 `build Task (web-mobile) Finished`。22:50 默认沙箱启动曾在 macOS 应用注册阶段 SIGABRT，已保存诊断摘录；之后使用授权的正式进程权限重试同一隔离命令成功。23:27最后一轮移除Gallery销毁页面时Lab对root的重复destroy。工程副本 `/private/tmp/u05-milk-tea-build-src/client`，使用本任务独立 profile，场景 UUID `01e65005-5a46-45a1-9a16-820ac4b919ae`。
- 最终布局于23:01构建后由Master在360×640内置浏览器复核通过；23:27构建仅调整退出时销毁生命周期。Master已在该构建强制刷新并实测返回菜单、重入正常；新时间窗控制台error/warn为空。操作记录与截图见 `evidence/BROWSER_RUNTIME_REPORT.md`。

产物静态身份：PASS。最终 Main bundle SHA-256 为 `03223ce4badce291f08c61aba93fd90781fbf0e6f2883b6e280dc7bd9df64c47`，包含 `U05MilkTeaLab` 与 U05 菜单文案；Resources bundle 存在配置 UUID `f6ef8a72-5d14-44fe-ae4d-76dcbcb8c1dd`、路径 `u05_milk_tea/config`。当前 Web 地址 `http://127.0.0.1:8791/`，最后构建复用同一路径与 loopback HTTP 服务（PID 38730），浏览器已强制刷新并实测23:27构建。沙箱内 curl 连接被系统拒绝；Master已完成内置浏览器运行验证，完整步骤、视口、控制台与限制见 `BROWSER_RUNTIME_REPORT.md` 及所引用截图。此前 22:19:26 构建因 Creator loose 模式 Set 展开兼容问题出现运行错误，详细旧日志在 `evidence/history/`；已用 `Array.from(new Set(...))` 修复。最终小屏反馈后，选档杯预览下移50逻辑像素、解锁提示独立换行；制作页行文字/配方正文至少24逻辑字号，按钮文字提高到最多28逻辑字号。

## 性能与风险
页面最多显示 5 个维度、每维不超过配置选项数的按钮；不加载图片、Prefab、粒子、Shader 或第三方库。`Component.update` 每帧只检查单调时钟 deadline，秒值变化时局部更新一个 Label；UI 只在状态变化后重建并销毁旧子节点。退出/返回销毁 Lab 组件与页面，解绑输入和 viewport 事件，并释放 Resources bundle 中唯一配置资源引用。未测真机、原生平台、设备帧率/内存与长时压力；本地 XP 与解锁都只是示例模拟，不能作为服务端可信结算或正式 QA 结论。
