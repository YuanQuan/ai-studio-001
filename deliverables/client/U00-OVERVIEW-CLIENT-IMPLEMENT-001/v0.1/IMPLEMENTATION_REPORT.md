# U00 夜市总览客户端实施报告 v0.1（实现草稿）

## 实施范围

在 `apps/client/assets/UnitSampleGallery.ts` 新增 U00 菜单入口和总览页，保留 U01、U02、U03 原入口与独立页面。总览页复用 Scene 已绑定的五层背景、U02 顾客 Prefab/40 帧/挂点与配件资源、六个 U03 店铺 Prefab；运行时各顾客独立创建 `TouristStateController`、`TouristView` 和 `ApprovedTouristAdapter`。没有增删或修改 Scene、Prefab、图片、字体及既有 `.meta`。

在 `apps/client/assets/labs/menu/scene1_camera_controller.ts` 增加可选 `synchronizedNodes`、`uiCaptureNodes` 与 `resetCameraX`。前者只驱动指定组合根节点，采用与 L03/L04 相同的 1.0 镜头比例；`layers` 仍严格保持五层背景。控件按真实按钮节点捕获输入，U00 没有用全屏根节点吞掉场景手势。`resetCameraX` 会被当前视口合法边界夹紧；U00 设为 -1050，U01 不配置，仍默认0。

U00 默认街景、三位顾客和六店全显；顾客、店铺、街景开关分别控制各自组，显隐状态独立保存。顾客数可设为 0–8，新增实例遵循当前显隐状态。顾客动作在 walk/run/happy/sad 间调度；walk/run 沿桥两侧路段移动，源坐标速度分别为 60/120 px/s，移动段持续 2–4 秒并在边界即时转向。happy/sad 停止位移，按获批 manifest 中对应的 `totalDurationMs` 播完一轮后才重选；四个获批动作实际均为 loop，因此由 U00 调度器计时完成周期，不修改 U02 Controller 或 manifest。

店铺沿用奶茶、糖画、炭烤、理发、花灯、投壶顺序，桥留在中间。六个 Prefab 的 `ground_contact.position.y` 均为 -388；以缩放 0.4 将店铺脚点放到源坐标 y=-225。店位相邻间距约 370 源像素；已读店铺主体 PNG Alpha 可见范围，最大宽度 822px，缩放后约 329px。顾客 Prefab 运行时额外缩放 0.28，目标脚点按顾客视图内部脚点偏移布置在道路/栏杆之间；行走边界位于桥洞外侧 ±240 源像素。上述落点和尺寸仍需实际浏览器截图复核。

首轮运行检查发现小屏初始构图只显示桥且性能面板遮挡数量控件；修正 U00 复位中心为 `cameraX=-1050`，并保存/隐藏/按原状态恢复 profiler。R2 验收又发现四卡菜单首卡与标题重叠，最终将菜单标题到首卡偏移从105调为155。R3 已通过 Tech 构建及 Master 两视口复验；U01/U02/U03 的调试面板行为和菜单语义保持不变。

## 静态核验

- Creator 3.8.8 随附 `@cocos/typescript` 编译器执行 `--noEmit --strict false --target es2019 --skipLibCheck -p apps/client/tsconfig.json`，退出码 0。
- 首次误以 `apps/client/temp/tsconfig.cocos.json` 为项目入口，类型声明相对路径因此无法解析；改用工程入口 `apps/client/tsconfig.json` 后通过。另一次直接使用 engine 普通 TypeScript 声明包触发引擎声明缺项；改用 Creator 随附的 `@cocos/typescript` 并跳过引擎库诊断后通过。两次诊断均未修改源码或资源。
- `RESOURCE_INTEGRITY_CHECK.json` 覆盖 `apps/client/assets` 全部198个 Git 跟踪文件。两份获授权 TS 单独记录；其余196项（包括 JSON manifest、UUID/meta、图片、Prefab、Scene、字体及其他代码）逐字节与开工前 Git HEAD 比较，196/196 未变，PASS。此静态核对不替代 Creator AssetDB/Library 逐 UUID 回读。
- 最终两份 TypeScript SHA-256：`UnitSampleGallery.ts` `17dbbcff503796dd2031baf8bc97da14987e320c17a7414307470cdee96c2ee4`；`scene1_camera_controller.ts` `1bf7a59c3accecd2ce4efa85813a6d4c27033e7af15c699225e0f06648625f81`。R3 构建清单和运行清单均绑定该源码身份。

## 构建、运行和性能

R3 使用 Creator 3.8.8 在同源隔离副本构建通过，HTTP 200 的实际构建产物及内置浏览器检查由 Master 完成，具体证据见 `BUILD_AND_RUNTIME_RECORD.md` 与 `evidence/RUNTIME_R3_MANIFEST.json`。390×844 和720×1280两种视口的页面入口、控件、店铺、顾客、镜头交互和返回重进均通过。桌面 Web 截图可见动作姿态；情绪动作原地不动由源码分支保证，截图不是逐帧运动测量。

最多八份顾客实例各有一个状态控制器和四十帧适配器；每帧最多更新八个控制器与八个位置，复用已有 SpriteFrame，不增加纹理或第三方依赖。帧率、DrawCall、目标设备内存和真机触控尚未实测。

## 当前结论

源码静态编译、全量跟踪资产完整性核验、Creator R3 Web-Mobile 构建和 Master 两视口桌面 Web 检查均已完成。真机触控/性能基准及逐 UUID Library 回读未执行；本报告提交专业评审及用户审核，不据此替代正式 QA 或用户审批。
