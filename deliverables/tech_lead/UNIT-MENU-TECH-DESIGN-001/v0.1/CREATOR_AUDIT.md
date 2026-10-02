# 七项菜单 Creator 现状与依赖审计 v0.1

检查日期：2026-10-02；方式：仓库与有限机器路径只读检查，没有启动编辑器或构建。产品七项 `UNIT-MENU-PRODUCT-001 v0.1` 已 `USER_APPROVED`；本审计不代表工程已实现。

## 1. 实查结果

| 项目 | 文件/命令证据 | 结论 |
|---|---|---|
| 工程版本 | `apps/client/package.json` 中 `creator.version=3.8.8` | 仓库钉 Creator 3.8.8，未证明本机已安装编辑器 |
| 屏幕设计 | `apps/client/settings/v2/packages/project.json`：720×1280，`fitWidth`、`fitHeight` 均 true | 现工程按竖屏设计；长幅概念图不能直接替代摄像机/屏幕契约 |
| 骨骼运行配置 | `settings/v2/packages/engine.json` 指向 `spine-3.8`，4.2关闭 | 引擎模块配置启用；实际导入、播放、构建均未测 |
| 旧菜单 | `assets/UnitSamples.scene`、`assets/UnitSampleGallery.ts`，后者 `UnitId=0..9`，`openUnit` 的 `case 1..9` 对应 U01–U09 | 旧九项集中在一个脚本，不满足新七项独立 Scene/Prefab/同源装配 |
| 旧资产 | `assets/demo/` 下21 PNG、9 Prefab；`assets/` 有2 Scene、1 TS、1 TMX | 新幽灵、孟桃正式骨骼、动态店件、空底板分层均没有可验收成品 |
| 新骨骼文件 | `rg --files apps/client/assets -g '*.skel' -g '*.atlas' -g '*.spine' -g '*Ghost*' -g '*Mengtao*'` 无输出 | 现有运行目录未发现新骨骼源/导出；本版只设计生产线 |
| 本机作者/编辑器工具 | `Get-Command CocosCreator.exe/Creator.exe/Spine.exe` 和常见 `Program Files`、`AppData/Local/Programs` 目录检查无结果 | 有限路径未找到可执行文件；不推断其他盘/便携版/团队工作站或许可状态 |

旧脚本含瓦片、占格、四方向占位、效果、UI、性能混合逻辑；不能将旧U04/U05资源或占位绘图当作新平视左右顾客。产品已取消旧九项任务线。迁移以新增七项 Scene 和唯一源 Prefab 为主，旧场景保留历史只读；Client后续实施前另取审批。当前 `apps/client/assets/` 中没有本技术设计表列出的 Scene/Prefab；路径与 ID 为待批准目标，不伪称已存在。

## 2. 官方兼容与权利核对

- [Cocos 3.8 Spine资源说明](https://docs.cocos.com/creator/3.8/manual/en/asset/spine.html)列骨骼数据 `.json/.skel`、atlas描述 `.txt/.atlas`、纹理 `.png` 等导入组成；仓库的 `spine-3.8` 是运行支持配置，不能替代这些文件或作者工具。技术制作候选为与3.8运行时匹配的Spine 3.8系列导出，并记录实际精确版本、文件头和Creator导入日志。
- [Spine官方版本说明](https://esotericsoftware.com/spine-versioning)提示编辑器与运行时版本兼容和较新工程降级风险；不把4.x工程仅改版本号当成3.8导出。
- [Spine编辑器许可条款](https://esotericsoftware.com/spine-editor-license)需核验实际作者、席位与交付权利。当前只读机器检查没有找到工具，也没有许可凭证；先由有合法席位的作者工作站登记精确版本与许可再制作，或者先采购/取得合法授权。绝不以运行时存在推断已具备生产许可。
- [Cocos 3.8 Prefab说明](https://docs.cocos.com/creator/3.8/manual/en/asset/prefab.html)指出实例属性可覆盖源 Prefab；将来同源验证须比对UUID、实例覆盖和源资产哈希。
- [Cocos 3.8纹理压缩说明](https://docs.cocos.com/creator/3.8/manual/en/asset/compress-texture.html)涉及目标平台支持与格式差异；Web预览或小游戏开发工具不代替微信/抖音真机压缩纹理与alpha边缘取证。

官方链接于2026-10-02核对。若精确Spine版本或工具授权无法确认，Art可继续概念/分件母版，但不得把骨骼导出标为正式生产资源。

## 3. 迁移验收清单

1. 新导航只含1–7顶层项，3含3A/3B；从旧 `openUnit` 进入的九项不会被误认为新菜单。
2. 入口1和7场景引用同一 `STREET_BASE_01` UUID与相机配置；1中动态可切换对象实例数为零。
3. 入口2/3/4/5/6各自从唯一源 Prefab 加载；入口7只实例化相同 UUID，不复制正式图、状态机、UI/VFX。
4. 每类 Scene 在 Creator 可独立打开，Prefab可独立编辑；重新导入后 `.meta` UUID稳定，覆盖报告没有资源/行为覆盖分叉。
5. 用依赖扫描证明正式新入口不引用 `assets/demo/` 的21 PNG及9 Prefab；若Lab暂用占位，必须明确标记不可作正式验收并在生产接入前移除。
6. 骨骼导出三件套、单页、工具版本与许可、Creator导入和目标平台构建逐项留证；目前全部 `NOT_TESTED`。

未作 `npm`、Creator、Web、微信、抖音运行，也未取帧率/DrawCall/内存。有限机器安装检查不是“软件不存在”的全盘结论。
