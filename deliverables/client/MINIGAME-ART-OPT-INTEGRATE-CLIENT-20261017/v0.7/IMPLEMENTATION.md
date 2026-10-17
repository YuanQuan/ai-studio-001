# Client 实现记录 v0.7

本版仅接入 U01 通用 button helper 的拖动结束与取消状态修正。修复前 v0.6 实测拖动 U01 调节面板后，下一次直接点关闭失效：子按钮 TOUCH_END stopPropagation 使 scroll view 漏收结束事件，panelScrollY/gesture 留存。故障报告 SHA-256 fc394dd994fc7b68aa98dbc9fa876452a4ecfb2aa2f290dcfb9bb601e23b955b，失败截图 SHA-256 1ff547bb3256045e66f1651497094272106b1b2b040cc935969700baad761443。

Gallery Owner v0.5 仅变更 `apps/client/assets/labs/u01/sakura_layout_editor.ts`，其新SHA-256 `ee3bf82a3a0426f72881f496c35c3bddaf8f7d9a0c0fac2d62da96c9480f8042`；Gallery `UnitSampleGallery.ts` 继续使用 `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`，不发生源改动。U01 helper 回调序列与滚动方向/取消探针通过。

新的隔离 staging 为 `/private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix`，输入manifest SHA-256 `a9e9b81a641e544ac859e9aadf22d3cdf7fb90305224f4dd5b839ab4248bbc24`，覆盖文件SHA-256 `d8e81b9c4ed88c89ac479589aef4052c20e5470d73077c78ced3e1dced4ee332`。419生产路径覆盖5个Bundle根、83条资源记录、72张派生图、858个UUID身份计数；stage/config生成、资源集成回归、Owner U01真实helper序列与方向探针通过。三平台v0.7 final构建及IAB U01实际关闭/取消/重tap尚待Root执行。

v0.6已通过的三平台CLI、八个native分包、320x568菜单/游客方向、U01方向本身、真实U00双向拖动+关闭、U05配方提交2/3与退出继续作为上一版本证据；但U01“拖动后直接关闭”在v0.6整体失败。误标的 `U00-panel-drag-bottom-320.jpg` 实际为U01画面，不计入U00。真正U00证据为 `U00-panel-real-up-drag-320.jpg` 和 `U00-panel-after-close-320.jpg`。本版不能从这些历史事实推断全运行矩阵通过。