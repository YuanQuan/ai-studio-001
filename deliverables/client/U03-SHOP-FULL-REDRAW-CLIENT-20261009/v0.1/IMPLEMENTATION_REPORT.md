# U03 六店整体重绘资源替换实施记录 v0.1

## 实施范围

按用户批准的美术 Artifact `U03-SHOP-FULL-REDRAW-20261009 v0.2` 将六店 body/sign 共 12 张图替换到既有 U03 正式路径。消费的 `CUT_MANIFEST.json` SHA-256 为 `F7B62B6A77B16FA5B10934ED112BE39A07DF7A4AFE6D99B952C735D97931D5ED`。五家店沿用获批 v0.1 导出，理发店使用正面建筑视角修正版 v0.2。12 个目标 SHA 与批准清单逐件一致。

替换前备份了 12 张旧 PNG；备份 SHA 与替换前目标 SHA 相同。12 份 `.meta` 替换前后字节哈希一致，image、Texture2D、SpriteFrame UUID、六个 Prefab、Scene 引用、脚点与稳定店铺 ID 保持不变。源、旧图、新图、备份、UUID、Prefab 和 Scene 证据见 `ASSET_REPLACEMENT_MANIFEST.json`、`RESOURCE_IDENTITY_AND_UUID.json` 与 `PREFAB_REFERENCE_CHECK.json`。美术实际路径、版本、哈希与 Creator 三类真实 UUID 已登记到 `project/ASSET_HANDOFF_REGISTRY.md`。

U00 的现有 `UnitSampleGallery.shopPrefabs` 直接实例化同一六个正式 Prefab，替换同路径 PNG 后自然显示相同获批贴图。此任务未修改 `UnitSampleGallery.ts`、Scene 或布局。构建快照记录该文件 SHA-256 `3CE9BF4185EE176053E2A7508B7B286FC62D848236BEEF43407D7651C4889E4C` 和既有 `cocos-service.json` SHA-256 `FAA1CF0E78E0093C325D141C8893BDC3E1C19C9E446FFA9CBF8B991EA5724D32`；工程工作区中并行存在的 U00 修改未被覆盖或回滚。

## 验证

| 核验项 | 结果 | 证据 |
|---|---|---|
| 获批来源与 12 张目标 PNG SHA | PASS | `ASSET_REPLACEMENT_MANIFEST.json`；12/12 源、替换后目标及备份 SHA 相符 |
| `.meta` 与 Creator 资源 UUID 保留 | PASS | 12/12 `.meta` 前后 SHA 相同；image/Texture2D/SpriteFrame UUID 见 `RESOURCE_IDENTITY_AND_UUID.json` |
| 六 Prefab、两片 SpriteFrame 和 Scene 引用 | PASS | `PREFAB_REFERENCE_CHECK.json`；六 Prefab 绑定 UUID 未变 |
| Creator 3.8.8 AssetDB 导入 | PASS | 隔离快照 12 张图 `imported=true`；Library PNG 均与正式目标字节一致；构建日志及产物清单见 `evidence/` |
| Creator Web Mobile 构建 | PASS | Windows 管理员令牌已在 RunAs helper 实查为 true；Creator exit code 36 且当前任务日志包含 `Finished`。149 个文件、27,155,048 bytes；SHA 见 `evidence/BUILD_OUTPUT_MANIFEST.json` |
| 构建中的 12 张正式店图 | PASS | `assets/main/native/<uuid前两位>/<image UUID>.png` 的 12 张图片均与目标 PNG 逐字节相同 |
| HTTP 实际产物 | PASS | `http://127.0.0.1:8789/` 返回 200；只绑定 loopback。服务 PID、index SHA 见 `evidence/http-server-record.json` |
| U03/U00 双视窗运行与基础回归 | PASS | Master 在同一新构建上用 Codex 内置浏览器检查 390×844、720×1280。两视窗均依次查看 01–06 六店新图和 body/sign 对位；390 Previous 06→05、返回菜单再进入恢复 01；720 Next 06→01 循环。两视窗 U00 显示新 01/02 贴图，720 店铺隐藏后恢复正常。18 张截图及 `runtime_console.json`（warn/error 均 0）见 `evidence/RUNTIME_EVIDENCE_MANIFEST.json`；截图格式为 JPEG/JFIF，已使用 `.jpg` 扩展名 |
| 真实触控、目标设备和性能 | NOT_TESTED | 本任务未执行真机、小游戏容器或性能采样 |

首轮普通沙箱启动在 0.2 秒内返回 `-1`，未生成构建日志或新产物。按项目 `apps/client/CREATOR_BUILD_RUNBOOK.md` 已记录的权限恢复方式，仅执行一次隐藏 RunAs helper；其 `admin=true`，同隔离快照随后构建成功。没有修改 ACL/系统安全设置，没有终止其他 Creator 进程。构建日志含与既往成功 U00 构建相同的 `build-script` SIGTERM debug 记录，之后完整执行 onAfterBuild 并写出当前 Task 的 Finished 标记；退出码、标记、新输出及图像哈希共同确认本次构建通过。日志另有压缩配置回退提示，Creator 按默认 `merge_dep` 继续完成构建。

## 性能、复用与状态

变更只更新既有 1024×1024 纹理字节，不增加节点、Prefab、脚本、运行时加载逻辑或第三方依赖。U00 复用既有 Prefab 和正式贴图来源；无新增运行时开销设计。真机纹理内存、DrawCall、加载耗时与平台兼容仍待正式验证。

同版 Tech 与 Master Review 均已 `APPROVED`，Producer 已将 Client v0.1 推进到 `USER_REVIEW`。用户此前批准 Art v0.2 美术成品并授权替换；该决定不代替 Client 实施 Artifact 的用户确认。本交付等待用户对准确 v0.1 实施产物作决定，期间不标 `DONE`。此类单元示例不分派 QA Agent，本文的 Owner 自检不代表正式 QA 结论。
