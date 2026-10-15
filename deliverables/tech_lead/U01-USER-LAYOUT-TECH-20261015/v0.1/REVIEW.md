# U01 用户布局参数技术评审

结论：已复核 U01 实际运行的初始、重置、离开重入三份完整导出，均与用户冻结的 `USER_LAYOUT.json` 精确相等；21 个原型、51 个实例的资产 ID、UUID、顺序、位置与缩放均一致。复核结果见 `IAB_EXACT_COMPARE.json`，其 `issues=[]`。冻结输入 SHA-256 为 `f34af020733b3ad095c7845d028f8acdfcf5a00fee30ea7a01c547bfac02a364`。

## 最小实现与范围

客户端只在 `apps/client/assets/labs/u01/sakura_layout_editor.ts` 使用 U01 私有实例 ID 覆盖表，字段仅为 `left/top/scale`。九个实例的授权变动包括左树 A、六店位置与店 2／店 6 缩放、左右前景位置。店 2 `scale=0.334`、店 6 `scale=0.333`，左前景 `left=-1.1368683772161603e-13`、`top=640.0000000000001` 均保留用户原值。初始、重置、重入共用同一默认数据创建逻辑；实际三次导出精确相等。

共享 `sakura_v03_layout.ts`、`sakura_v03_environment.ts`、`UnitSampleGallery.ts` 与 `UnitSamples.scene` 均与 HEAD 字节一致。客户端范围核验还表明 21 个 PNG 的字节及 UUID 不变，隔离 Creator 项目 631 个资产与当前源一致。因此 U00/U04 所消费的共享数据未改；本轮未将此静态结论冒称为 U00/U04 再次运行测试。

## 构建与运行证据

客户端使用 Creator 3.8.8 构建 `web-mobile`；CLI 退出码 36、末行报告 `build Task Finished`，TypeScript 检查退出码 0，产物共 739 文件。Tech 独立复算构建清单所列六个关键文件 SHA-256，均与 `BUILD_MANIFEST.json` 一致。主 bundle SHA-256 为 `16f586288b6b56620fe203b5a3eeb54ef207291af9b9a17e17b946571d97f17f`。

Root 在内置浏览器实际进入 U01、对店 2 作临时位置与缩放编辑后重置、离开后重入；三份实际导出存于 `deliverables/master/U01-USER-LAYOUT-20261015/v0.1/evidence/`，与冻结用户 JSON 完全相等。临时编辑画面显示店 2 的 X 为 555、缩放为 0.37；重置及重入均恢复冻结值。浏览器警告和错误记录为空数组。`deliverables/master/U01-USER-LAYOUT-20261015/v0.1/HTTP_IDENTITY.json` 记录六个实际 HTTP 文件均返回 200，SHA-256 均与构建清单一致；`IAB_VERIFICATION.json` 汇总实际浏览器操作与证据。

目标设备的帧率、DrawCall、内存和 GPU 性能均未测试；此评审不作目标设备性能通过结论。该工作属于单元示例自验，不替代正式 QA 或后续用户评审。
