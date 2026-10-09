# U01 五层背景客户端接入报告 v0.1

已将获用户批准的 U01 v0.6 五张切片接入现有单元示例入口。资源审批 `USER_APPROVED` 绑定 `USER_REVIEW_PACKET.md` SHA-256 `477f05b9d2da82536018ede89c9c91b3f42199553224f40b2f07ecba83c15cd3`。五张 PNG 从批准的 v0.6 exports 同字节复制；Art 源与 Client 目标 SHA 全部相同。L01–L04 保留既有 Creator image/Texture2D/SpriteFrame UUID，L05 由 Creator 3.8.8 导入产生 UUID `54693964-2771-40f1-ab3e-f0baae0db797`。

`pf_street_base_01` 改为 `L01_Sky`、`L02_Mountains`、`L03_Ground`、`L04_WaterBridge`、`L05_WaterGrass` 五个节点；每层中心锚点和 3072×1024 画布一致，Sprite 不裁切。镜头源画幅调整为 3072×1024，视差为 `[0.3, 0.8, 1, 1, 1]`，保留原 1.0–1.8 缩放、拖动、重置与页面返回/重进逻辑。单元卡片文案同步为五层。U02/U03 逻辑与 Scene 文件未修改，Scene 仍以原 Prefab UUID 引用该共享 Prefab。

变更前四个源码/Prefab/登记文件的哈希和可恢复副本保存在本目录；旧四张 PNG 与 `.meta` 也作为历史恢复副本保留。旧 L04 路径已移除，原 UUID 只绑定新 `water_bridge` 路径。资产登记已回填批准源路径、SHA、客户端路径、image/Texture2D/SpriteFrame UUID 和 Library 几何信息。

静态对象图检查得到 Prefab 35 个序列化对象，所有 `__id__` 目标都在数组范围内，Scene 对象链接静态检查 `STATIC_PASS`（19 objects、26 references，Scene 的 Prefab UUID 存在）。五张 `.meta` 与 Creator Library SpriteFrame JSON 均核为完整 3072×1024 rect/originalSize、offset `(0,0)`、`trimType=none`；具体内容见 `evidence/OBJECT_GRAPH_AND_ASSET_IMPORT.json` 和 `evidence/SCENE_LINK_AUDIT.json`。

最终构建使用本机 Creator 3.8.8 Web-Mobile，结束日志 `CREATOR_FINAL_BUILD_LOG.txt` 显示 Build Assets success、Web-Mobile build task finished，进程返回码 36（该版本成功码）。日志含 Creator `build-script` 子进程 SIGTERM 诊断行；构建任务仍完成并生成当前 `apps/client/build/web-mobile` 输出，输出文件和五张构建 PNG 的 SHA 记录见 `evidence/BUILD_OUTPUT_SHA256.txt`。最终日志未检出 missing SpriteFrame/UUID。首轮仅用于触发 Creator 生成 L05 `.meta` 的引导构建曾因 Prefab 使用临时 UUID 报 missing；临时 UUID 随后已被真实 UUID 替换，不能把首轮当正式结果。

当前构建通过仅绑定 loopback 的 HTTP 服务提供：`http://127.0.0.1:4173/`，服务根目录为 `apps/client/build/web-mobile`，HTTP 实际响应的 `index.html` SHA-256 `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`。Master 随后使用 Codex 内置浏览器验证了五个桌面 CSS 视窗模拟（320×568、360×640、390×844、414×896、720×1280）的中心和左右拖动极限；390×844 验证缩放上限、左右拖动极限及重置，720×1280验证返回菜单与重进。20张截图及逐张SHA登记见 `BROWSER_RUNTIME_CHECK.md` 和 `evidence/BROWSER_SCREENSHOTS_SHA256.txt`。视窗为DPR1模拟，不是真实手机；单指拖动由浏览器鼠标模拟，实体双指触控未测。

Art与Tech已分别对本次接入出具 `APPROVED` Review（`ART_REVIEW.json`、`TECH_REVIEW.json`）；Master已在 `MASTER_ACCEPTANCE.md` 接受本次接入并送用户确认。截图可见范围内画面顺序、边缘、桥河连接及水前草符合获批重组，Art注明调试性能面板遮挡部分画面，结论限于可见截图状态。Tech保留一项 `MINOR`：CameraController `layers` Editor tooltip仍以四类描述层级，不影响Prefab、构建或运行；为保持已验证构建身份，本轮不改该提示文字。

五张PNG实际文件总量为 `8,466,168 bytes`（各层数据见对象图证据）；五张 3072×1024 RGBA8 的基础展开估算为 `62,914,560 bytes = 60 MiB`，这是纹理理论值，不是设备驻留内存或性能测量。目标设备性能与驻留内存、真实手机多视窗尚未测试；桌面DPR1五个CSS视窗的运行检查已完成并留有20张截图。

## 复核结果

- 获批版本、五张源/目标字节哈希：PASS。
- 五层 Prefab、镜头画幅/视差、稳定 UUID、新 L05 UUID、Scene 静态对象/活动 Prefab 引用：PASS。
- Creator 3.8.8 导入与 Web-Mobile 构建：PASS（以最终日志和真实新产物为依据；日志中的子进程诊断已如上记录）。
- HTTP 服务及实际构建入口响应：PASS。
- Codex 内置浏览器五视窗中心/边缘、缩放、重置、返回重进：PASS，见20张证据截图；仅覆盖DPR1桌面CSS模拟与鼠标手势。
- Art/Tech 接入后运行视觉与技术 Review：PASS，分别以本版APPROVED Review为证；结论受截图可见范围限制。
- 真实手机、双指触控、目标设备性能与纹理驻留内存：NOT_TESTED；浏览器面板的整工程瞬时值不作目标设备结论。
