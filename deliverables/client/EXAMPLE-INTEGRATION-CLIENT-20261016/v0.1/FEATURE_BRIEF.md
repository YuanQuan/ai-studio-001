# Gate2 获批切片客户端接入概要

用户已批准 Art Gate2 `EXAMPLE-REVISION-ART-20261015/v0.1` 五张 PNG。按 CUT_MANIFEST 在 `sakura_v03` 导入原字节：暗态 far_l 基底替换旧远景图，眼睛亮层作为 far_l 的子层；两张清理桥身替换同位置旧桥身；石板街面母图在 (0,598) 和镜像实例 (1900,598)。保留前层桥栏杆/栏杆层级，让它们继续压在桥身和街面上。

U01 的用户基准不因眼睛 alpha 动画而改变。眼睛亮层挂在 far_l 实例节点，跟随其缩放/镜像；共用 4 秒平滑透明度循环仅修改 Sprite 表现属性，不进入 item 的 left/top/scale/mirror 或导出 JSON。运行时建立与销毁跟随场景根节点；编辑器重置和离开重入重新从冻结布局创建节点。街面左右实例作为新增静态布局条目纳入基础导出/重置，既有 53 条目几何与河面组保持原值。

复用现有 `populateSakuraV03`、`SAKURA_V03_LAYOUT`、`USER_LAYOUT_PROFILE`、`U01SakuraLayoutEditor` 和 `SakuraV03Motion`。不引入新组件框架、不改业务流程；将检查五个切片字节/hash、Creator 实际 UUID、桥前栏杆层级、眼睛周期与用户布局导出隔离，随后 Creator 3.8.8 构建及 HTTP/IAB 核验。持续循环仅更新两眼 overlay 的 opacity，无逐帧分配；设备性能不由 Web 结果推断。
