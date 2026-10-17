# 栏杆已批切片接入实现报告 v0.1

## 变更
- 原位替换 `apps/client/assets/resources/sakura_v03/tex_sakura_rr_bridge_front_l.png` 和 `front_r.png`；两张工程 PNG 分别与已批准 Art 导出字节相同，尺寸均为 225×177 RGBA。
- 两个 `.meta` 保持原字节、image/texture/SpriteFrame UUID、尺寸和 `trimType: none`；原始 PNG 与 meta 的可恢复副本、修改前 SHA 在 `evidence/backups/`。
- 仅按 Master 的来源登记授权，把 `sakura_v03_layout.ts` 中左右 front 原型的 `sha256` 与 `artPath` 共四个字符串更新为本批获批身份。差异检查显示只有这四个值变化；其他布局字段和 55 个实例未改。
- 没有改业务代码、运行逻辑、UI、布局或其他源资源，也没有新增代码测试。

## 构建与资源包
以当前工程 `assets/`、`settings/`、`profiles/` 和 `package.json` 建立新的 `/private/tmp/bridge-railing-integration-client-20261016-isolated-project`，使用已安装 Creator 3.8.8 和 UnitSamples `web-mobile` 配置构建到 `/private/tmp/bridge-railing-integration-client-20261016-build/bridge-railing-integration-client-20261016-web-mobile`。规范调用的 Creator 日志含 Finished 标记，实际退出码 36。完整日志、配置 SHA、源/隔离源 SHA、核心输出 SHA 与两个 PNG 的资源打包路径见 `BUILD_MANIFEST.json`。输出共 781 个文件。

实际产物由 `http://127.0.0.1:8890/` 提供，HTTP HEAD 返回 200，服务 PID 86189，绑定 loopback 并保持运行供 Master IAB 检查。当前构建 bundle 已带入两项新 SHA 与 Art 路径；现有 image/texture/SpriteFrame UUID 保持，打包 PNG 与获批源图 SHA 相同。

## 验证状态与限制
静态资源/来源核验 PASS，Creator 导入和 `web-mobile` 构建 PASS，HTTP 入口 PASS。Master 已通过内置浏览器完成本构建检查：U00 左右桥的新图清边、暖光/顶线及桥身/水面层级可见；U01 23 原型、55 实例在 initial/reset/reentry 相同，临时移动店铺至桥上可见栏杆遮挡，重置恢复，且与旧基线仅两 front 的四项来源登记不同；U04 共享场景、阿炭微笑与返回菜单通过，console warnings/errors 为空。证据见 `deliverables/master/BRIDGE-RAILING-INTEGRATION-20261016/v0.1/IAB_VERIFICATION.json`、`U01_EXACT_COMPARE.json` 与 `HTTP_IDENTITY.json`。运行效果仍待用户确认，不代表用户批准。目标设备性能未测，本单元示例无 QA 门禁。

首次 CLI shell 调用将参数中的分号误作命令分隔符，因此不能从那次 shell 状态读取 Creator 退出码；该次状态未用于 PASS。随即使用正确引用参数在同一隔离输入上重建，取得 exit 36 与 Finished 日志，后续验证均基于该当前产物。
