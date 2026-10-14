# 运行验证：U00/U01 樱花桥 v0.5

## 已执行检查

- 批准版本身份：v0.5 `CUT_MANIFEST.json`、`USER_AUTHORIZATION.json` 与 Art Gate2 `ARTIFACT_APPROVAL.json` 已核对。禁止新增生图；本任务没有调用生图。
- 资源：21 张 Art PNG 的 SHA-256 与批准清单一致；45 个环境实例已写入布局。17 个非桥 PNG 保留原图像、纹理和 SpriteFrame UUID。四个新增桥切片有独立 Creator 导入元数据与实际 UUID。
- 排序：共享背景桥身归入 L03；U01 布局编辑顺序为 L03 环境 → 六店 → L04 桥前元素 → L05 前景。L04 中两片前栏杆在桥身和店铺之后、街栏链之前。
- U01：编辑、拖动、缩放、镜像、删除、新增树与精灵/莲花倒影、末层实例选择、镜头拖缩/复位、导出及重置/返回均已由Root在内置浏览器实际操作。最终重入导出文本与初始导出完全相同；统计为21 prototypes、45 environment instances、6 shops。
- U00/U04：最终浏览器复载可见新桥和U04共享环境。退役前U00 pan/zoom/reset、游客数量及三组显隐，U04共享环境/表情/返回均已通过。桥顶暗线与批准源图细节一致；未修改图片、未生图。该判断为目视核对，不声称逐像素相等。
- 旧桥：在退役前U00/U01/U04实际浏览检查通过后，旧 `tex_sakura_rr_bridge_half.png` 与 `.meta` 已按原字节备份并从正式客户端及隔离构建源删除，Art v0.3历史母版保留。正式源、隔离源和最终构建旧路径/UUID引用均为0；文件SHA见 `evidence/retirement-backup/` 及 `evidence/final-build/RETIREMENT_CANDIDATES.json`。
- TypeScript：Creator 3.8.8 自带 TypeScript 5.8.2 执行 `tsc -p tsconfig.json --noEmit --skipLibCheck --target ES2021 --lib ES2021,DOM`，退出码0；日志在 `evidence/final-build/typescript-check.log`。
- Creator最终构建：旧桥退役后，Cocos Creator 3.8.8隔离副本实际导入并构建 `web-mobile`。唯一启动入口 `db://assets/UnitSamples.scene` / `01e65005-5a46-45a1-9a16-820ac4b919ae`；日志含 `build Task ... Finished`，官方成功退出码36。路径、源码和输出哈希见 `evidence/final-build/BUILD_MANIFEST.json`、`OUTPUT_FILES_SHA256.json`。
- 最终内置浏览器：Root已在退役后最终构建重新载入 `http://127.0.0.1:8788/`。菜单、U00新桥、U01全景、U04共享背景通过；最终U01导出与初始文本完全相同；warnings/errors为空。最终源快照与运行隔离副本逐项对比67个文件，差异0。六个关键HTTP文件均200且响应哈希与最终构建manifest一致。证据：`deliverables/master/U00-U01-BRIDGE-V05-INTEGRATION-20261014/v0.1/FINAL_IAB_VERIFICATION.json`、`FINAL_HTTP_IDENTITY.json`及相邻截图/导出JSON。

## 测试限制

未测试目标设备、GPU、小游戏平台性能；编辑器操作证据覆盖720×1280视口，既有横屏编辑限制保留。单元示例Owner自验，不安排QA。
