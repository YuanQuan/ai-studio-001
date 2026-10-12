# Client Feature Brief：灯笼局部亮度 Pilot v0.2

任务：`VISUAL-FIDELITY-PILOT-ASSET-20261012`。本简报仅定义隔离样例实现边界；Art/Tech 同批首样预签完整前不实现、不导出新材质/Effect/Scene，也不渲染候选。

## 范围与复用

在 `apps/client/assets/labs/lantern-pilot-v02/` 新建仅供本次试验的 Scene、控制组件、Effect 和资源元数据。只引用获批的 body/sign 原图及 Art 的 `MASK_SPEC.json` 所指定 128×256 mask；不复制 4 MiB body，不改正式 PNG、meta、Prefab、Gallery 或入口。页面仅提供原画、播放、暂停、复位等直观控制，可选只读状态用于核对。

基准复用 body 原 SpriteFrame 的几何和原图字节；正式 prefab/组件体系没有可复用的局部灯光 Effect。pilot 的材质必须为唯一 Sprite 实例独占，不能写共享材质状态，也不能通过动态合批与别的 Sprite 共用实例。

## UV 与资源隔离方案（待 Tech 同批签认）

原 SpriteFrame meta 显示 1024×1024、`trimType=none`、`atlasUuid=""`、未旋转、整图 UV，但 `packable=true`。为避免依赖未冻结的图集/动态合批布局，采用 Creator 3.8.8 运行时 API 在独立 pilot 中创建新的 `SpriteFrame` 实例：将原 body SpriteFrame 的同一个 Texture2D 赋给新实例，设 `packable=false`，并明确完整 1024×1024 rect/originalSize 与未裁切偏移；不生成新 SpriteFrame 元数据、不复制 PNG，也不修改正式 SpriteFrame/meta。Tech 已核 `SpriteFrame` 构造、`texture` 与 `packable` setter 为本机 3.8.8 实际接口。首次渲染前、导入/构建和运行时仍需核实际 Texture2D、SpriteFrame UV/rect/trim/atlas及动态图集状态；如不能证明新实例采样原纹理且未被动态图集改写，停止并把诊断交 Master，不静默改采样假设。

Mask texel `(u,v)` 对应 body 像素 `(178+u,505+v)`。在已核实的完整原图纹理上，fragment 以 SpriteFrame 实际 UV 反算/映射 body 局部像素中心，再映射至 mask UV `((x-178+0.5)/128,(y-505+0.5)/256)`，按 MASK_SPEC 的 top-down 约定处理 V 方向。不得把 Sprite 原始 UV 当作构建后的 GPU UV；需要用 Creator 导入/实际运行证据确认方向、滤波及边界采样。

## 实现行为

单个 Sprite 实例、单个独立材质和小型 Effect。强度基准 1.0 时 fragment 直接保留原采样 RGB 与 alpha；仅通过 mask × `(1-strength)` 局部乘亮度，不改变色相、几何、alpha、sign 或其他区域。动画使用 MASK_SPEC 的 2 秒关键点与平滑分段插值，并使周期端点值/斜率连续。重复播放复用同一动画状态；暂停、隐藏、禁用或复位时停止并恢复 1.0，重新开始从 phase 0 进入。

首样新增 Draw Call 硬上限 +1，mask 原始纹理预算 32 KiB（0.03125 MiB），禁止复制整张 body。CPU/GPU 各 0.1 ms/帧仅参考值，若没有可信目标设备测量则记 `NOT_TESTED`。不引入依赖、不改全局 builder/package settings。

## 验证与风险

预签后仅做一个候选。Creator 3.8.8 CLI 指定只构建 pilot Scene，输出到本轮独立目录；记录命令配置、任务结束日志、合理退出码、源码与输出身份。只在 loopback 空闲端口提供实际构建结果，并由 Master 用 Codex 内置浏览器核验。保留强度 1.0、0.90 极值、完整循环、接缝、暂停/隐藏/复位证据；验证 mask 外 RGB 零差、全图 alpha 不变、sign 不变、单实例隔离和 Draw Call 上限。缺少真实引擎或性能证据项逐项标 `NOT_TESTED`，静态预览不当作 Cocos 通过。

主要风险是 packable/dynamic atlas 对实际采样 UV 的影响、Cocos Effect 对纹理坐标/色彩与 alpha 路径的处理，以及 CLI/浏览器可用权限。先验证实际版本接口与独立 SpriteFrame 导入结果；遇到权限拒绝按正式流程处理，只允许一次有证据的恢复。
