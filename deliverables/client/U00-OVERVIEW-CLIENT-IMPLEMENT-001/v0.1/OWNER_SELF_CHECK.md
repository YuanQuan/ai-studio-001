# U00 Client Owner 自检 v0.1

| 核查项 | 结果 | 证据/说明 |
|---|---|---|
| U00 菜单入口加入，U01/U02/U03 原入口保留 | PASS | R3 内置浏览器实际进入U00并验证原三入口可加载；证据见运行清单。 |
| 三组默认显现、独立显隐 | PASS | 390×844实际验证三组独立隐藏；隐藏后顾客数量增减保持隐藏。 |
| 顾客数量0–8、初始3人 | PASS | 390×844实测3→8且继续点击保持8；减至0后再增至1；返回重进恢复3人。 |
| 六店顺序与桥两侧布局 | PASS | 720×1280左右拖动可见奶茶、糖画、炭烤、桥、理发、花灯、投壶顺序；落脚与桥位通过。 |
| 店铺 ground_contact 对齐与遮挡 | PASS | 六Prefab ground_contact y=-388，scale0.4，脚点目标y=-225；R3运行画面复核落地。 |
| 顾客位置和桥洞避让 | PASS | 左右路径边界[-1450,-240]与[240,1450]；R3运行观察顾客位于道路/栏杆后，桥洞保持通行空白。 |
| 四动作、移动转向、情绪一轮后切换 | PASS（源码+运行可见） | manifest实际四动作均loop；U00按totalDurationMs调度一整轮。R3可见走动、开心与沮丧姿态；情绪阶段位移0由源码分支保证，未作逐帧位移测量。 |
| 镜头拖动/缩放/重置同步街景实体，控件捕获 | PASS | R3实际拖动、缩放、重置通过；同步前景与层数组5层。 |
| U00 初始/重置构图包含左侧街区 | PASS | R3 390×844初始/重置检查通过；resetCameraX=-1050，U01默认0且原U01重置通过。 |
| U00 性能面板隐藏与退出恢复 | PASS | R3进入后控件可见且可点；统计面板只按进入前状态恢复。 |
| 返回/离页后状态与计时解绑 | PASS | R3返回重进恢复3位顾客及全显示，离页调用各实例detach。 |
| 全量 Git 跟踪资产保持原样 | PASS | `RESOURCE_INTEGRITY_CHECK.json`：198总项；两份授权TS分列，其余196/196与任务起始HEAD一致，包含manifest/UUID/meta。 |
| Creator 3.8.8 TypeScript 静态检查 | PASS | Creator随附 `@cocos/typescript`，exit 0。 |
| Creator 3.8.8 Web-Mobile 构建 | PASS | R3，149文件、25,896,603 bytes，源码hash绑定；详见 `BUILD_AND_RUNTIME_RECORD.md` 与 `evidence/BUILD_R3_MANIFEST.json`。 |
| HTTP产物与内置浏览器两视口交互 | PASS | HTTP 200，390×844及720×1280；console warn/error均为[]；R3运行清单含证据hash。 |
| 真机触控、性能、逐UUID Library回读 | NOT_TESTED | 需要真机或Library专项回读，不从桌面Web推断。 |

结论：当前实现和桌面Web示例检查完成，提交 Tech/Master 评审及用户审核；未完成真机性能和逐UUID回读，不宣称正式QA通过或任务DONE。
