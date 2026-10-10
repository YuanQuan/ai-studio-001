# U04 分层对话客户端接入报告 v0.1

## 实现结果

在既有 `UnitSampleGallery` 菜单接入 U04 对话页，支持6位店长、0/2/3魂阶段与5种表情的独立选择。三个Sprite以同一1024×1536源画布坐标原子呈现；各stage读取获批 `LAYER_EXPORT_MAP.json` 的源裁切矩形、导出比例与支点，AD/XJ按0.75导出比例还原。半身可见区按各stage配置调整轮廓宽度与腰线裁切，人物只按stage比例缩放，窄横屏响应缩放由裁切父节点统一承担。

背景复用Gallery U00真实五层Prefab及六个店铺Prefab。店铺仍使用原U00 footpoint坐标，并逐Prefab读取 `ground_contact.position.y`，按缩放值还原根节点位置；背景视窗变化时更新U04场景尺寸，触发既有U00镜头控制器重算。U04拥有独立页面节点和清理生命周期，没有改写其他单元。

九宫格面板采用唯一批准SpriteFrame、`Sprite.Type.SLICED`、四边48 Insets与`Sprite.SizeMode.CUSTOM`。默认尺寸1280×195，并提供384×192、768×256、1024×384三档自检伸缩；角饰独立Sprite，标题、对白、状态Label独立布局，小面板中文字限于内容安全区。尺寸控件绘制在面板上层，并与角色轴控件分开布置。

## 资源与运行时

获批129张PNG均保留源SHA字节，Creator 3.8.8 Asset Bundle `dialogue`构建索引核对通过：129个SpriteFrame路径以及对应ImageAsset、Texture2D UUID逐项一致。导入登记与源/客户端路径见 [`RESOURCE_IMPORT_MAP.json`](RESOURCE_IMPORT_MAP.json) 和获授权更新的 [`ASSET_HANDOFF_REGISTRY.md`](../../../../project/ASSET_HANDOFF_REGISTRY.md)。角色与表情资源按当前选择异步加载，三层同代次后才一起显示；旧选择回调被代次拦截。离开页面会释放selection/page引用；Bundle config复用，避免跨页重复加载。

运行中只读快照 `globalThis.__U04_RUNTIME__` 暴露当前组合、加载引用、页面代次、ready与90组合巡检计数，不提供引擎对象操作入口。

## 构建身份

- Creator：3.8.8，目标`web-mobile`，2026-10-10 21:02:04（本地时区）。
- CLI退出码36；日志明确记录`build Task (web-mobile) Finished in (5 s)`。Creator日志中`build-script` SIGTERM诊断发生在主构建任务结束前，但最终日志、输出文件更新时间和当前实际HTTP响应共同确认本次产物已完成。构建参数`debug`与`mainBundleCompressionType`回退到Creator默认值，诊断见构建stderr。
- 源码SHA-256：`3186b8ff463be0d0121b37a59789cb422662447b34f53304ca821efaab096ee4`。
- Bundle config SHA-256：`294ef69a30270c091cd3e404f4a5274c52dbce61662580bd78c0c47d46e6da8c`；计数129 SpriteFrame。
- HTTP：`http://127.0.0.1:8765/`；最终核验index与dialogue config均返回200，响应Last-Modified为21:02:04。
- 日志：[`U04_CREATOR_BUILD_FINAL10_STDOUT.log`](evidence/U04_CREATOR_BUILD_FINAL10_STDOUT.log)、[`U04_CREATOR_BUILD_FINAL10_STDERR.log`](evidence/U04_CREATOR_BUILD_FINAL10_STDERR.log)。

## 源码保护与范围

实施前源码快照已保存于 `evidence/UnitSampleGallery.ts.source-before-U04`、相应`.meta`及`UnitSamples.scene.source-before-U04`。已有其它单元、场景与原先dirty的`package.json`、`settings/v2/packages/information.json`未改；未修改Task、流程状态或Git。客户端本轮改动限定于`apps/client/`；正式登记仅更新U04 v0.1区块。

## 当前验证状态

Master在最终Final10 HTTP构建（源码SHA `3186b8ff463be0d0121b37a59789cb422662447b34f53304ca821efaab096ee4`）完成运行检查：默认U00五层/六店布局可见，菜单返回后重入人物脸层及比例正常；6×3×5巡检为90/90、0失败、6432ms。该耗时只代表巡检流程完成时间，不是帧率或设备性能数据。Final10另实测三轴切换MT3生气→MT2生气→MT2惊讶，姓名和未操作轴同步/保留；三档九宫格384×192、768×256、1024×384均保持MT2惊讶且文字/角饰正常。证据见 `runtime_final10_*.jpg`，审核主图为 `runtime_final10_user_preview.jpg`。

Final10还复测960×540横屏和连续8次快速切换（最终XJ 2魂惊讶、无旧画面），均通过；对应 `runtime_final10_960x540.jpg` 与 `runtime_final10_continuous_switch.jpg`。Profiler隐藏恢复此前已在Final7检查，最终画面未见回归。未执行目标设备、原生或SDK测试、GPU/FPS测量及冷网络并发压力测试，均不宣称通过。Tech已在 `deliverables/tech_lead/U04-DIALOGUE-CLIENT-REVIEW-001/v0.1/REVIEW.json` 对该SHA给出 `APPROVED`；状态与证据逐项见 [`RUNTIME_CHECK.json`](RUNTIME_CHECK.json)。
