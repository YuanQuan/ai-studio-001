# U05 交互独立代码技术审查

结论：**APPROVED（仅静态代码准备）**。审查的三份脚本 SHA 与 Client `BUILD_IDENTITY.json` 一致：`milk_tea_lab.ts` 为 `9ba2027e...650f8646`，`u05_interaction_presentation.ts` 为 `f5b8d0d1...19900f5`，未改业务状态 `milk_tea_state.ts` 为 `bb981d66...539f2f43aea6`。没有发现未解决的主要源码缺陷。新资源仍待用户 Gate2，故本结论不证明新版可玩或视觉达标。

确认处理先用 `freezeCupSnapshot` 复制订单索引、配方 ID 和已选原料，再取同一 `nowMs` 在唯一调用点执行一次 `submitCup`。`settleWin` 仅在业务返回 `won` 后执行；原业务状态脚本字节未变。动画只消费快照，业务状态推进后仍可画旧订单。`presentationEpoch` 在启动、取消、销毁和超时中断时更新，旧事务不应继续写入当前表现。活动事务只采样并修改已建顾客、气泡和杯料节点；节点重建发生在交互或阶段边界，未见每帧重建整棵 root 的路径。

采样器覆盖首次 450ms 入场、确认后 650ms 合成、错误留客、正确换客、末杯胜利离场、主动退出和超时中断。超时从当前采样 X 开始离场，已到 x=-72 的顾客直接完成；末杯 `won` 的气泡在结束后仍隐藏。`run.status === playing` 才执行超时检查，已在期限内确认的末杯胜利不会因表现延迟被改判。错杯仍由原 `Run` 保持当前订单。客户端保留 `setExitHandler` 与 `onExit` 两个接口。

Client 的 TypeScript 5.8.2 检查和纯 helper 断言报告为 PASS；本轮 Tech 核对了测试源、报告、构建身份和实际脚本 SHA。测试脚本需要编译后的 helper 路径参数，直接单独运行 `.cjs` 不是该报告中的执行命令，因此不将其误记为 Tech 独立复跑。纯逻辑证据不覆盖 Cocos 引擎场景、Mask 裁剪和设备性能。

脸图尚未绑定。现有 `facePose`/`faceProgress` 只是采样接口，当前顾客仍绘制旧 `CUSTOMER_GHOST`。Gate2 后应按获批清单绑定同画布 332×301 的四脸及必要补间，保持 `Sprite.trim=false`，核实际锚点和表情时序。局部净底、脸图及辅助帧尚未正式导入；当前 Web 构建身份为 `NOT_BUILT`，Creator 导入、真实浏览器与目标平台均 `NOT_TESTED`。后续资源接入和运行复核应另出证据，不沿用旧 8876 版本证明新交互。
