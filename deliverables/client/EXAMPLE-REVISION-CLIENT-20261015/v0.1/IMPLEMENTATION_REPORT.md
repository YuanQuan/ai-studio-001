# 示例调整客户端实现报告 v0.1

## 实现范围

按 `APPROVED_PLAN.md` 更新 U00/U01 樱花河面运动与 U05 奶茶顾客表现。U00/U01 共享 `SakuraV03Motion`，天空和远景不再自动平移；运动只绑定源布局识别出的 7 组河面灵焰、莲花、倒影，交错方向以 24 源像素/秒水平单向循环，组员共享偏移且 y 不变。标记为 `flame_float` 的空中装饰不再上下动。旧 `motion` 字段兼容读取，但不驱动垂直浮动。

U01 编辑器的运行偏移不写回布局参数，命中框按实际显示节点计算，选中描边跟随运动节点，拖动锚点从显示位置开始。编辑后整组基线重新捕获；`reorder()` 仅改 sibling 顺序。r1 内置浏览器验证曾发现六个店铺 prefab 重叠，因为原先排序过程中隐式调用的 `applyItem()` 在改为 sibling-only 后不再执行。修复在 prefab 实例加入后显式应用对应基础布局，r2 实测六店位置正确；失败截图保留在 Master 证据目录。

U05 复用 Gallery 已加载的 UG_GHOST_01 prefab、动作帧、frame/mount/accessory manifests、`TouristView` 与 `ApprovedTouristAdapter`。Gallery 在未激活 host 上完成 Lab 添加与资源注入后再激活；资源缺失时提供返回入口。等待采用静态初始帧，进出采用 walk，动作帧时长从 manifest 读取，按表现阶段开始时间计算。happy/sad 分别完整播放 1400ms/2800ms。超时先走既有业务结算并使旧事务失效，表现结束回调只清理视觉事务，不结算或发奖。

新眼睛、街面和桥切片仍待 Gate2，未导入、未绑定，不改变正式资源身份或右街引用。目标设备性能和小游戏平台专项未测试。

## 复用与影响

无网络、API、存档字段或玩法规则变更。顾客资源无复制或新 bundle；共用运动仅持有固定节点组并做数值更新。新增 `sakura_water_motion_math.ts` 用于三件组识别、共享位移数学及编辑基线调整。Creator Asset DB 已登记 `db://assets/labs/u01/sakura_water_motion_math.ts`，UUID 为 `c64f9c9e-14c7-4152-b491-a875fb8f099e`。

## 静态与逻辑验证

Creator 自带 TypeScript 5.8.2 项目检查通过，退出码 0；原始日志 `evidence/typescript-check-r2.log` 存在且为空（无编译诊断），结构化记录为 `evidence/TYPESCRIPT_CHECK.json`。9 项纯逻辑/源码断言通过，覆盖 53 实例七组识别与交错方向、24px/s、整组偏移和 y 固定、长时间多次循环、编辑基线更新、happy/sad 完整边界、超时覆盖及完成回调无重复结算。

## 构建与实际运行

最终 Creator 3.8.8 Web Mobile 构建是 r2：退出码 36，成功结束标记 5 秒，输出 766 文件。656 个正式 assets 与隔离构建副本字节一致，树 SHA-256 相同；源代码、配置、关键产物和构建日志见 `evidence/BUILD_MANIFEST.json`。初始沙箱启动失败及 Root 按批准权限恢复过程均保留为历史证据；未将旧任务构建当作本任务结果。

Root 使用 Codex 内置浏览器对真实 HTTP 构建完成 U00、U01、U05 操作，另完成 U04 冒烟；r1/r2 warning/error 均为 0。U01 初始、重置、重入导出的 53 实例完整 JSON 三份都与冻结用户 JSON SHA 完全一致；编辑实例 037 仅将其 X 改变 10 像素。U05 实测错单 sad、成功 happy 与顾客进出、三杯完成只提示一次奖励、计时归零失败不发奖励、退出和重入清理。详细步骤与截图入口见 Master IAB 文件。离散截图只核关键帧；完整 1.4 秒/2.8 秒时长由 manifest 累加与纯逻辑断言确认。

最终审核预览由本任务启动的 loopback HTTP 服务提供：`http://127.0.0.1:8882/`，服务根目录为 r2 Web Mobile 输出。Root 已关闭过渡版 8881 服务，8882 保持监听供用户审核。

## 未测范围

目标设备性能、原生/小游戏平台、所有方向越界的逐帧录像、新资源导入与动画，以及临近 0 秒浏览器提交竞争分支仍为 `NOT_TESTED` 或待 Gate2。此实现报告和内置浏览器结果不是正式 QA 或用户批准。
