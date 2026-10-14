# 并发内容保护检查

## 修改前证据

本任务开始前对已有未提交文件做完整备份和 SHA-256 登记，见 [`pre_change/FILE_HASHES.json`](pre_change/FILE_HASHES.json) 及 `pre_change/apps/client/` 副本。`apps/client/package.json` 当前与修改前副本 SHA-256 一致：`3382ee4d451fe205b37501db2fc4b4d0735c2cc9fc5b783cc3abf447d5e21b2a`。

## Gallery 中保留的非目标功能

`UnitSampleGallery.ts` 相对修改前副本的受控差异仅为：增加共享 v0.3 环境加载接线；更新 U01 菜单说明；为避免把并发U05接口改动混入本任务，在Gallery本文件加入窄适配：优先调用仓库基线的 `setExitHandler(handler)`，若运行中的U05类型提供公开 `onExit` 则回退赋值；原epoch守护、Profiler恢复和返回菜单逻辑原样保留；删除 U04 中不存在声明和读取的 `u04PanelWidth = 1` 死赋值。U05 import、实例字段、Profiler 生命周期、菜单卡片、页面创建和 U04 的 `u04PanelSizeIndex` 调节路径均保留。改动仅限Gallery接线，未改U05源文件。最终类型检查无错误，详见 `evidence/tsc-unit-entry.log`。

## U05 并发文件

U05 的 `U05NineSlicePlate`、`U05BitmapText` 拆分到单组件文件由并发 U05 工作完成，Master 已为共享 UnitSamples 入口修复给出必要授权；本 Client 没有编辑 U05 玩法、脚本或资源；Gallery中的退出adapter是唯一U05兼容接线差异。最终 Creator 构建对应的 U05 主脚本和两个 helper 文件 SHA 在 `evidence/BUILD_MANIFEST.json` 中与隔离源副本一致；新增 `.meta` 的真实导入 UUID 由最终 Creator 工程读取。此次仅Gallery adapter区别HEAD的 `setExitHandler(handler)` 与当前并发U05的公开 `onExit` 属性，按存在优先方法、否则属性回退；处理函数和U05源文件未改。U05 资源、配置与玩法数据不在本任务改动范围。

## 文件隔离

U01 原有修改前数据与源码、`package.json`、Prefab、场景均有 `pre_change` 副本；U05 并发代码未复制成业务分支，也没有用旧快照覆盖当前共享工程。仅在最终 build source identity 中记录实际构建快照。
