# U05 B 前端最终技术审查 v0.1

结论：**技术审查通过，未发现未解决 MAJOR**。范围为 U05 单元示例三维配置/状态、B 工作台、资源组件和 Creator 3.8.8 Web Mobile v4 构建。静态代码、构建身份与 Master/Owner 实际浏览器证据分别核对；本结论不代替用户对最终实现的接受或正式功能 QA。

## 版本身份

- Art v0.2 `tasks/U05-B-COMPONENT-ASSETS-20261014/ARTIFACT_APPROVAL_v0.2.json` 为 `USER_APPROVED`。共用底板 SHA `75d72dc94a6da071ca6a2a387ef66c823ce2572bc55d01f8bb3848eb6d287d82`，字图/FNT 与客户端导入清单一致。
- Client `evidence/BUILD_IDENTITY.json` 记录隔离副本 `/private/tmp/u05-b-client-build-20261014/client`、v4 产物 `/private/tmp/u05-b-client-build-20261014/output-final-review/web-mobile`。我独立核算四份 U05 TypeScript SHA 均与构建输入一致，产物 `assets/main/index.js` SHA `ce640e70c3c40b9c5cc26e95595a55cd9d7ef8288046638f638b4e9ba2588c9b`、`assets/resources/config.json` SHA `d7e68d1998c21fd93dcd77f3143906ce9ae4739ddaa0d3aa741906fcd5f20fef` 与 Master 浏览器报告相同。Creator 日志记载 11:46:14 +08:00 构建 Finished；本机退出码 36 结合日志和产物判定。
- 当前共享工作树 `UnitSampleGallery.ts` 有另一线程后续差异；v4 构建记录其当时输入 SHA `d8ac917233fc1a901a78e3ea8be47f865bd257cdf07158d4514cb2962a8e0111`。本审查不把整仓库当前状态冒充 v4 输入，也不审另一线程变更。

## 代码与配置

- 新三维生成器与旧五维路径分离。Client `STATE_AND_CONFIG_CHECK.md` 记录批准源表逐字段核对，仅放行获批 READY/export 状态晋升；正式客户端配置 SHA `9d46e76e6cf942cd513a8c5f35e5dfaafc6188146e767a5eeb1b31dbcce479dc`。十阶段题池依次 8/12、18/27、27/36、36/45、45/54，均无超出开放原料的题。未改服务端业务实现，历史 server.json 保留字节。
- `Run.selectionOrder` 把同类重选移到最近，错误杯/新杯清空；撤销移除仍有效的最近选项。`settled` 防重复结算。Master/Owner 在 v2/v3 浏览器已走通错杯、最近撤销、简单档三杯 XP10 与限时流程；该状态脚本 SHA 在最终 v4 未变。v4 另复核刷新后 XP10/通关 1/5、普通模式退出不给经验及最终界面。
- 图片异步回调受 `destroyed`/`pendingFramePaths` 闸门约束，销毁后停止回写并释放待完成帧；配置和字体回调也检查组件有效性。长时间压力与驻留测试未做。

## 资源与同源画面

- 共用 123×45 九宫格先以源尺寸 SLICED/inset 18/18/12/12，再将节点统一缩放。Creator 3.8.8 `sliced.ts` 的 mesh 直接用 inset 与 UITransform 宽高计算；此实现修正旧版角宽比例失真。
- Creator 对 CUP PNG 自动裁切。当前 `showAsset()` 对 `CUP_` 明确设 `sprite.trim=false`；Creator 3.8.8 `simple.ts` 的 false 分支按 `originalSize`、`trimmedBorder` 保留原 183×233 透明画布位置，订单杯缩整画布为 151×180。Master/Owner 在 v4 Web 复核杯内小料位于杯底；旧版拉满杯截图仅保留为失败历史。
- 资源在 `assets/resources/u05_milk_tea/u05_b`，v4 `assets/resources/config.json` 有底板 SpriteFrame、BMFont 和图集路径。Client 记录 45 个保留 PNG UUID 及新增获批资源 UUID 入包。动态字由同源 BMFont 渲染并显式报告缺字；Master/Owner v4 Web 复核标签、顶栏、帮助和「确认」。系统字只用于资源错误态，不计艺术字通过。
- 热区扩至对象与名牌联合范围，最小尺寸按 canvas CSS 宽和 root fit 换算。Master/Owner 360×640 实际操作高难度 3/3/6 选料、正确交杯和退出。更极端尺寸尚未测。

## 证据边界

Master `deliverables/master/U05-B-FRONTEND-LANDING-20261014/v0.1/BROWSER_RUNTIME_REPORT.md` 区分版本：v2/v3 在 8876 实际走通三杯、错杯、最近撤销与限时流程，且状态脚本 SHA 到 v4 保持一致；最终 v4 复核帮助字级、两杯内容视觉、正常存档刷新、普通模式退出无经验及当前页 warn/error 为空。早期截图只支持其对应操作，不当作 v4 最终视觉证据。Client `IMPLEMENTATION_REPORT.md` 和 `STATE_AND_CONFIG_CHECK.md` 是 Owner 记录，浏览器实际结果以 Master 报告为准。

未测实体手机触控、微信/抖音包、原生平台、长期 GPU/帧率及正式 QA。此任务是单元示例，按 AGENTS.md 不由 QA Agent 参加；升级正式功能后应走相应门禁。
