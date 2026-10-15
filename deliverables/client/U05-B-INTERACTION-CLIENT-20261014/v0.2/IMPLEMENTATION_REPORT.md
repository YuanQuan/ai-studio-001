# U05 台面选料与顾客反馈客户端实现报告 v0.2

## 实现

在已通过 Tech Brief Review 的事务式交互代码上，正式接入用户 Gate2 批准的 v0.3 资源。资源核验清单见 `evidence/RESOURCE_IMPORT_RECORD.json`：72 项冻结哈希已逐项核对，其中新增 9 张 PNG 放入 U05 专属目录，保留资源 45 张 SHA 未变；新增资源 UUID 与 Creator 生成的 resources bundle 配置路径一致。新脸图和顾客身体保留 332×301 整画布，绑定时设置 `Sprite.trim=false`。

背景局部净底、顾客身体及 neutral/blink/happy/disappointed/squash/expand_mid 状态已接入；确认按钮改用获批按钮图。`milk_tea_state.ts` 保持原 SHA256，业务提交、倒计时、奖励与存档未改。表现继续通过独立 presentation transaction、不可变提交快照和 epoch 取消旧事务；三槽选择期间隐藏工作杯，点击确认才合成最终杯表现。

## 验证

TypeScript 检查及纯状态用例通过，覆盖首次入场、四阶段表情、正确/错误、截止打断、离屏处理、胜利气泡隐藏与输入锁。Creator 3.8.8 在独立项目副本中产出 769 文件 Web-Mobile 构建，生成的资源 bundle 路径解析到全部 9 个新增 UUID；单独服务固定在 `http://127.0.0.1:8878/`，根目录及构建身份见 `evidence/BUILD_IDENTITY.json`。

构建日志以 `build Task (web-mobile) Finished` 收尾；Creator 进程退出码为 36，并在旧 profile 迁移阶段出现 TypeError，故记录为带警告的已生成构建，不记作零退出码干净构建。输出目录仍可由隔离 HTTP 服务访问。Root 实际浏览器报告见 `deliverables/master/U05-B-INTERACTION-RUNTIME-20261015/v0.1/BROWSER_RUNTIME_REPORT.md`：进入 U05 并以简单难度完成主要三杯流程，验证选料期间台面与杯状态、确认合成、正确推进、错误保持同单可重做、第三杯结算与顾客初次入场；控制台 errors/warnings 均为空。Root 保存 `selected_8878.png`、`finish_8878.png`、`entry_8878.png`。该轮发现“正确，下一杯!”低对比提示遗留到下一单；成功/失落脸与完整离场因帧时序较短未逐帧核证。8878 版本及其报告保留为修正前基线，没有被后续构建覆盖。

## 尚未证实

浏览器已验证选料/合成、正确推进、错误保持订单并重做、第三杯通关与本地结算。成功/失落脸动画和完整离场因帧时序较短未逐帧核证；超时、退出流程及 Mask/边界遮挡也未逐项实测。状态提示残留缺陷留待 v0.3 局部修正验证。此任务为单元示例 Owner 自检，不构成正式 QA。历史 Gate2 预算结果仍登记为 `FAIL_HISTORICAL_VIOLATION_NOT_WAIVED`。
