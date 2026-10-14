# U05交互与顾客动画修订方案流程 v0.1

- 用户要求选料先摆台面，点“确认”才合成；缩小订单目标杯；顾客完整移动进出，并对成功/失败作脸部表情动画。Master方向见`deliverables/master/U05-B-INTERACTION-REVISION-20261014/v0.1/USER_DIRECTION.md`。原Client/父试玩v0.1仍REVISION；旧15文件SHA清单保留。
- UI五件文字/状态规格、Art五件生产方案与同版Art视觉Review、Tech三件方案核对及中文用户审阅包已实存。当前仅方案；新正式图片、动画回放、客户端修订代码和新运行均NOT_TESTED。
- 统一参数：台面三槽[345,1150,90,84]/[467,1150,90,84]/[589,1150,90,84]；窗口保守mask[260,278,490,505]，完整离场位移381px；订单杯0.78倍、确认后约650ms合成。原三类/五档/奖励语义维持。
- Art新脸层与局部净底须独立Gate1制作方案用户批准，首图前同批Art/Tech预签，实际新资源另经Gate2。UI方案与Art Gate1均需本轮准确版用户审核；Tech仅AUTO内部评审，不凭旧Client运行通过结论认新动画通过。
- Continuity：Owner方案已实际产出，待Master同版Review与Producer SHA绑定后送USER_REVIEW；新图/代码必须等适用门禁与Master正式分派。

## 同版方案送审

- 2026-10-14 12:41:44 +08:00 Producer核UI 5、Art 5、Tech 3及Master方向/审阅包/技术Review 3文件，共16文件；逐SHA清单`APPROVAL_HASHES.json` SHA `b33e7236bdbeeaaebc08aad8d752c535946268fc97a9d15e863b95d01f0d498f`。UI与Art方案Task均USER_REVIEW，Tech方案支持AUTO DONE。
- 本轮Art生产方案包含未来新脸部与局部净底Gate1预算，仍待用户批准；Art/Tech首图前同批预签、实际新资源Gate2和新版Client运行均未发生。原Client及父试玩v0.1保持REVISION；已批准底板v0.2、字图与45旧片不倒退。
- Continuity：三个专业方案均有实际交付和评审；所有当前可授权的方案工作已推进至用户审阅门禁。下一步需用户对准确UI/Art方案作决定，未批前不启动正式新图或客户端正式接入。
