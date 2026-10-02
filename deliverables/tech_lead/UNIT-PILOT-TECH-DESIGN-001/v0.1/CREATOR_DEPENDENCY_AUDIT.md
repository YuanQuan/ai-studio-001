# 孟桃单元 Creator 与骨骼依赖实查 v0.1

任务：`UNIT-PILOT-TECH-DESIGN-001`；检查日期：2026-10-02。输入：Product v0.1、Art v0.5 的正式审批记录均为 `USER_APPROVED`。本报告只区分仓库配置、当前机器、官方文档和未测项。

## 仓库与旧入口

| 核查项 | 实际证据 | 判断 |
|---|---|---|
| Creator | `apps/client/package.json` 的 `creator.version=3.8.8`；项目设计分辨率在 `settings/v2/packages/project.json` 为720×1280 | 已钉版本；未因此证明当前机器可打开编辑器 |
| 2D骨骼运行时 | `settings/v2/packages/engine.json` 中 `spine=true`、`_option=spine-3.8`、`includeModules` 含 `spine-3.8`，4.2关闭 | 引擎配置已开启；本样例导入/播放尚未验证 |
| 当前单元 | `assets/UnitSamples.scene` + `assets/UnitSampleGallery.ts`；脚本集中建立菜单/地图/输入/UI/特效/密度演示，源文件为618行、PowerShell `Measure-Object -Line` 为574非空行 | U01–U09并非独立Creator单元；不能复用其Demo表现为孟桃成品 |
| 旧资源 | `assets/demo/` 的21张PNG、9个Prefab；`UnitSamples.scene` 的21帧UUID均来自该目录，见Art v0.5 `RESTART_AUDIT.md`明细 | 新孟桃没有Scene、Prefab、Spine数据或同源双入口证据 |
| 骨骼源 | 在 `apps/client/assets` 搜索未见 `.skel`/`.atlas` 或孟桃骨骼JSON；旧场景未见`sp.Skeleton` | 零实装；不能宣称骨骼工作流已跑通 |
| 当前机器编辑器 | `Get-Command Spine/Spine.exe/CocosCreator/CocosCreator.exe`、常见 Program Files 与 Local Programs 目录、卸载注册表项目未检到Spine或Creator安装项；仅见 Roaming/CocosCreator 配置目录 | 搜查范围内未发现可执行编辑器；不推断其它盘、便携安装或授权状态 |

## 官方依赖与版本风险

- [Cocos Creator 3.8 Spine资源文档](https://docs.cocos.com/creator/3.8/manual/en/asset/spine.html)要求 `.json/.skel` 骨骼数据、`.png` 图集纹理和 `.txt/.atlas` 描述，并将Creator 3.x对应Spine 3.8；文档另注明Spine编辑器3.8.75对原生平台不支持。仓库仅有运行时开关，缺三类本样例导出文件。导入前应记录精确编辑器版本、导出格式、atlas页数，并在3.8.8真实编辑器里预览、Web构建及微信/抖音目标构建；若后续扩至原生平台，不能忽略该3.8.75限制。
- [Creator 3.8 `sp.Skeleton` API](https://docs.cocos.com/creator/3.8/api/en/class/sp.Skeleton)列支持低于3.8.99的Spine版本。故以3.8系列兼容导出为候选，**不能把最新Spine编辑器的默认导出直接当作兼容证据**；实际文件头与导入日志必须核对。
- [Spine官方版本指南](https://esotericsoftware.com/spine-versioning)说明较新编辑器保存的工程不保证旧版可开，跨大/小版本降级导出可能损失动画数据。生产原始`.spine`工程应与导出版本同存并锁版本；不在4.x编辑后凭修改JSON版本号当作3.8生产方案。
- [Spine编辑器许可协议](https://esotericsoftware.com/spine-editor-license)要求与所选许可类型匹配的授权使用。本机未发现编辑器及许可凭证；Art/制作方需登记实际作者工具、版本、可商用许可、使用人和可交付源文件范围。仓库启用Spine运行时不等于具有Spine编辑器席位。
- [Creator Prefab文档](https://docs.cocos.com/creator/3.8/manual/en/asset/prefab.html)说明场景实例默认同步Prefab，实例覆盖属性会留在场景并阻断相应变更。因此同UUID只是必要条件，仍需审计覆盖清单。

上述官方资料于2026-10-02读取。没有启动Creator、Spine，也没有新样例运行日志、Web/微信/抖音构建或手机测试；安装搜索是有限范围的环境核查。
