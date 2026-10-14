# U00/U01 樱花 v0.3 客户端实现报告

状态：核心实施、Creator 导入、Master 修复版 IAB 初验与旧环境退役已完成；退役后最终构建已生成并交 Master 做重入/导出复核。资源接入、退役后IAB、Gallery兼容版新构建及Tech最终Review均通过；当前提交用户Review，不标记DONE。

## 实现与资源身份

已批准的18张 v0.3 PNG 以原字节放在唯一客户端目录 `apps/client/assets/resources/sakura_v03/`，合计 8,606,267 bytes。`sakura_v03_layout.ts` 保存18原型及43个稳定编号环境实例，按 CUT_MANIFEST 全序记录原源坐标、尺寸、镜像、motion 和层序。Creator 3.8.8 实际导入后获得的 image、Texture2D、SpriteFrame UUID均登记在 `RESOURCE_IMPORT_MANIFEST.json`，与真实 `.meta` 对应。

U00 与 U04 继续消费 UUID 不变的 `pf_street_base_01`（`2d697fb3-01f0-4330-a180-a9c162310bf8`）及其五层直接子节点。两个消费者与 U01 共用同一份布局及PNG资源；实体层插在桥后、街栏链前。保留六个店铺、游客、U00已有控件和U04对话/遮罩行为。

U01 保留既有布局编辑器及六店参考对象，支持43环境实例选择分页、A/B树/灵焰/莲花/倒影新增、拖动、缩放、镜像、删除、层序调整、相机操作、重置、导出和返回重入。导出为明确 v0.3 schema/sourceVersion，并含49初始实例（43环境+6店）及18原型资源身份。Dynamic Atlas 运行时 SpriteFrame texture UUID 曾出现空值，现导出稳定读取从 Creator `.meta` 核验的原型 Texture2D UUID。Master对8787重新导出的18个 image/texture/SpriteFrame UUID均确认非空。

Creator 对16个SpriteFrame应用了 alpha trim。实测 `rect` 小于 PNG 原始尺寸，特别是 `fore_left` raw宽768而trim宽678、offsetX=-45；按原顺序设置 content size 会造成可见边缘露水。本次U00共享装配和U01节点创建都改为先设 Sprite `CUSTOM`/`trim=false`，赋 frame 后再设置完整原始实例尺寸。Master在修复版实际确认左右极限露边消失，并检查最大缩放、复位、店铺/游客显隐和390×844视口。

天空/远景保留已批准幅度并根据真实viewport边界裁剪偏移；4个`flame_float`按批准节奏轻动，编辑/导出的基准坐标不包含动画位移。性能只记录估算：18 PNG共8,606,267静态字节，RGBA8全图面约31.45 MiB；43背景Sprite节点可能增加渲染调用，DrawCall、图集、GPU驻留、目标机帧率/内存均未实测。

## 入口兼容、旧资源和构建

为恢复UnitSamples真实入口，仅做Master授权的必要修复：隔离profile明确 `startScene=UnitSamples.scene` UUID `01e65005-5a46-45a1-9a16-820ac4b919ae`；为符合Creator每脚本一个Component，将并发U05原有两个helper类拆成独立脚本并保留类/方法；Gallery 的 U05 返回菜单接线只在本文件使用窄兼容适配器：若组件公开 `setExitHandler` 就调用它（仓库基线接口），否则设置工作树中的公开 `onExit` 属性；同一 epoch 守护、Profiler 恢复与返回菜单回调保持不变。另删除无效面板字段赋值。U05组件文件本身未纳入本任务差异。U05其它行为/资产与并发数据修改不属于本任务；准确源身份差异见最终BUILD_MANIFEST。

Master对trim修复版初验通过后，旧五层背景、旧U01专属资源和旧manifest精确34文件按原始SHA复验后退役；无活动UUID引用。历史PSD、审批记录、改前快照、六店游客与稳定Prefab保留。

旧资源退役后首次使用Cocos Creator 3.8.8完成显式UnitSamples构建（5秒）；Master对该版退役后U01重入/编辑与导出、U04首帧和其他样例入口复核通过。之后为适配Git HEAD与并发工作树接口，Gallery仅添加窄兼容adapter并重新构建。当前最新版Creator任务Finished in 4秒，外层CLI返回36并有SIGTERM退出清理记录；TypeScript 5.8.2静态检查exit 0，HTTP 8787返回200。最新输出的`assets/main/index.js` SHA与源码身份见 `evidence/BUILD_MANIFEST.json`。当前这次adapter变更仍待Master定向复核U05返回及U00/U01入口画面，并待Tech增量Review。

静态检查、类型检查和逐步视觉/运行证据分别见 `evidence/STATIC_VALIDATION.json`、`evidence/tsc-unit-entry.log`、`RUN_VERIFICATION.md` 与Master integration evidence。单元示例由Owner记录运行验证，不作为正式QA或发布通过。
