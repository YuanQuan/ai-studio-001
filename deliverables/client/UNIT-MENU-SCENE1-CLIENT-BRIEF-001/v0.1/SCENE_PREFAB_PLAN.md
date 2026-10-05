# 单元示例1｜场景与 Prefab 计划 v0.1

本文是 Creator 实际改动前的结构计划，须随同版 Client Brief 审批。只计划示例1四层场景，不创建或修改 Creator 文件，不导入图片、不分配 UUID。

## 1. 入口与职责

当前 `apps/client/package.json` 记录 Creator `3.8.8`。工程已有 `assets/UnitSamples.scene` 与 `assets/UnitSampleGallery.ts`，用于独立单元菜单与输入行为参考；已有 U02 相机样例只处理小地图缩放/拖动，不复用其 0.7–2.0 倍率或地图边界作为四层产品参数。旧 `assets/DemoScene.scene`/`assets/demo/` 资源身份不同，不作为本场景背景来源。

本方案明确采用独立 Lab Scene：`apps/client/assets/labs/menu/scn_unit_menu_scene1.scene`。当前该路径文件**尚未创建**；仅在 Client Brief 与 QA Plan 分别通过专业 Review 并获用户批准后，才在后续实施任务中创建。独立场景承载四层背景与镜头控制；现有 `UnitSamples.scene`/`UnitSampleGallery.ts` 只增加导航入口及场景切换，不承载示例1画面和镜头运行逻辑，也不扩张为通用相机场景框架。独立场景的生命周期可单独复位/退出，且与现有 U01–U09 样例状态隔离。正式背景 Prefab 只含四张背景层 Sprite。菜单/Lab 场景负责按钮与测试导航；镜头控制组件负责 `{cameraX,z}`、视口边界和四层变换；输入控制把鼠标/浏览器模拟触控事件转为镜头命令。不得将 Lab 菜单节点放进正式背景 Prefab。

## 2. 计划节点结构

```text
Scene1Lab (独立入口/Lab)
├─ Canvas / ViewportRoot
│  ├─ SceneViewport (仅内容区，按有效视口裁剪/适配)
│  │  └─ STREET_BASE_01 (Prefab 实例；源画布中心对齐)
│  │     ├─ L01_Sky      SpriteFrame: STREET_BASE_01_L01, ratio 0.3
│  │     ├─ L02_Mountains SpriteFrame: STREET_BASE_01_L02, ratio 0.8
│  │     ├─ L03_Ground   SpriteFrame: STREET_BASE_01_L03, ratio 1.0
│  │     └─ L04_Foreground SpriteFrame: STREET_BASE_01_L04, ratio 1.0
│  └─ LabControls (覆盖在场景上层并优先捕获输入)
└─ Scene1CameraInputController (输入、镜头状态和生命周期边界)
```

以上节点名是可读计划名，不要求序列化文件逐字采用。Prefab 负责图片层级、逻辑 ID 和同尺寸/同原点；不持有独立镜头边界，不持有菜单或 Lab 控件。控制器在场景实例层引用四个层节点并用同一有效视口参数更新它们。S08 后续组合入口只能引用同一 `STREET_BASE_01` Prefab/资源 UUID，不复制贴图；本任务不创建组合入口。

## 3. 坐标与镜头候选

源画布 `W=2172,H=724`，视口为扣除适用安全区后的逻辑 `Vw×Vh`。按 Tech v0.2：

```text
sCover = max(Vw/W, Vh/H)
s = sCover × z
visibleSourceWidth = Vw/s
cameraXMin = -(W-visibleSourceWidth)/2
cameraXMax = +(W-visibleSourceWidth)/2
layerScreenX[i] = (Vw-W×s)/2 - cameraX×s×ratio[i]
layerScreenY[i] = (Vh-H×s)/2
```

层顺序由节点顺序固定为天空、远山、地面、桥前景；不能通过移动一个共用父相机替代不同水平系数。四层同 `s`、同源中心与同垂直中心。工程可用等价世界坐标实现，验收须记录换算结果。

当前提交给用户审核的镜头候选：

| 状态 | 参数 | 值 | 说明 |
|---|---|---:|---|
| 几何候选/Tech 约束 | `zMin` | `1.00` | 适高覆盖下界；`z<1` 可能上下露出未绘区域。要求各模拟视口满足 `visibleSourceWidth≤2172`，否则该视口下方案阻塞。 |
| 体验候选/待批准 | `zMax` | `1.80` | 先前隔离预览使用的探索值。四层同尺度放大，但要在 Creator 首帧/边缘视口进一步核主桥区裁切是否可接受。 |
| 初始状态候选/待批准 | `cameraX0` | `0` 源像素 | 以原画布水平中心构图；桥接近画布中心，桥区是否足够可辨仍需运行图核。 |
| 初始状态候选/待批准 | `z0` | `1.00` | 首帧覆盖较宽的竖屏画面；月亮无需与桥同时在首屏。 |

拖动仅改变 `cameraX`，垂直位置固定。缩放以有效视口中心为锚；改变 z 后用同一公式重算边界并夹取。拖动开始于有效场景内容且未命中 UI 时进入镜头；任一输入终止/取消、切换或重置时清基准；计划无惯性。输入具体事件、视口观察方式和取消行为见 Feature Brief。

## 4. 状态流与恢复

```text
进入场景 → 校验四张 SpriteFrame 引用 → 测有效竖屏视口 → 设置获批初始镜头
       → 接收输入/视口变化 → 更新 cameraX 或 z → 重算并 clamp → 显示四层
重置 ───────────────────────────────────────────────→ 清手势状态并恢复批准初始值
离开场景 → 取消输入/视口订阅、结束手势 → 释放本场景临时状态
```

缺失资源、尺寸不是预期全画布、hash/登记不符或视口计算出现非法边界时，应显示中文错误与稳定模块标签并停留在可诊断状态，不默默替换为旧 Demo 图。重新进入应回到相同批准的初始视图。视口变化期间如存在手势，先清除旧坐标基准再重算，避免跳变。

## 5. Lab 控件与正式场景隔离

Lab 提供最小的放大、缩小、重置和返回控件，用于调用镜头命令；它们不属于正式背景 Prefab。控件先捕获自身触控，不向场景冒泡为拖动；场景手势开始后不触发已有控件。正式背景资源身份与未来游戏使用路径不依赖 Lab 场景。当前不新增性能面板、录制器或通用 UI 系统。

## 6. 实施边界和回滚

本计划批准后才可进入 Creator 实施门禁，实施前还需同阶段 QA Plan 与此 Client Brief 均通过评审并获用户批准。实施时逐个导入 Gate2 v0.3 原 PNG 字节，按 `ASSET_HANDOFF_PLAN.md` 回填实际目录/文件名/hash、image 主 UUID、Texture2D/SpriteFrame 子 UUID、Prefab UUID 和 Scene 引用；`.meta` UUID 仅由 Creator 实际生成。回滚以 Git 还原本次新增场景/Prefabs/脚本和登记表本次导入记录，不删除或重写其他单元工程文件；已发 UUID 不复用或手工伪造。

本计划不解锁 Web 运行测试。Web 多模拟手机视口矩阵、浏览器与 DPR、性能采样和阈值在运行验收前另案审核；实体手机/小程序容器在本阶段保持 `NOT_TESTED`。
