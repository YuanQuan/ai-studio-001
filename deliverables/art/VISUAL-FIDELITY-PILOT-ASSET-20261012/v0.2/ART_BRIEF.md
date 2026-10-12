# 奶茶店左檐红灯笼局部光照｜Art Brief v0.2

本批只制作一个已批准方案下的具体首样候选。冻结输入是 `MT_SHOP_01` 的 1024×1024 RGBA body、独立 sign 和四区域 PSD；本批仅新增局部灯面遮罩，不改原图、母版、meta、店体造型、灯罩位置或原有烘焙光照。来源、实际哈希和逐像素坐标记录在 `preflight/MASK_SPEC.json`。

目视核对现有实图后，左檐灯面内层约落在源坐标 x=200–248、y=533–597。遮罩使用贴合灯体内面的椭圆、4 像素向内羽化和源图亮度/alpha 守卫相乘；可变像素小于定位用最大框 `[178,505,280,670]`。红灯罩外轮廓、挂钩、下方流苏、蓝瓦、室内小灯和右奶茶杯牌全部排除。木柱上现有暖光在轻微 0.90–1.00 变暗幅度下无需新遮罩，避免把木面误当成灯体呼吸。

首样强度 1.0 必须逐通道复现原 body；其余强度只把局部已亮灯面轻微压暗，alpha 和 mask 外 RGB 不变。完整 2 秒单实例平滑曲线与暂停/隐藏/重复触发复位依同批 `VFX_SPEC.md` 和 `MASK_SPEC.json`。静态计算对照用于锁几何与数值，实际 Cocos Effect、材质实例隔离与运行画面须由 Client 在独立 pilot 中验证；未观察实际画面前，运行视觉结论为 `NOT_TESTED`。

本批不新增参考素材、字体或生成图片。来源权利沿已批准的店面生产记录，遮罩从既有获批 body 确定性计算，生成式图像调用为 0。具体动画效果和遮罩 PNG 尚未获得用户成品批准，不能正式接入。

## 本批实际视觉核对

首样遮罩实际 SHA-256 为 `f9a67671a0e1d4f03974f62b3fdf8de1131e4e99adc7aad4fecd13095fba7b9f`，非零 2431 像素，仅 x=200–248、y=533–597。静态算法参考在强度 1.0 全图 RGB/alpha 零差，0.90 时最大 RGB 通道差 24/255，遮罩外 RGB 与全图 alpha 零差。证据详见 `evidence/VISUAL_VALIDATION.json`。这些结果不代表 Cocos 渲染零差。

Art 目视检查 `evidence/lantern_full_083s.png` 的同背景、同尺度全景与 `evidence/lantern_static_contact.png` 的同坐标 2 倍细节：灯面中心随曲线轻微压暗；红灯罩外缘、挂钩、流苏、邻近木柱、室内小灯和右杯牌保持原图；灯罩红色分瓣与暖黄中心仍可辨。静态视觉锚点结论为 `PASS_CPU_REFERENCE`。在 Codex 内置浏览器用本地 HTTP 打开 `preview/index.html`，确认 0.85 秒显示 0.900，播放时相位推进，打断和暂停均回 0 秒、1.000；该网页只是可编辑的算法预览。

Client 已将 mask 作为隔离 pilot 实验输入并写出 Effect/Scene 候选，但 Creator 3.8.8 CLI 首次启动在 macOS `NSApplication` 阶段 SIGABRT，唯一一次 LaunchServices 恢复返回 `kLSNoExecutableErr`，未有构建或真实 Cocos 画面。故运行时灯面、UV/方向、alpha、循环/复位与性能的 Art 结论均为 `NOT_TESTED`；静态 `PASS` 不代替实际画面 Review。精确诊断与限制见 `evidence/RUNTIME_REPORT.md`，本资源仍为候选待用户看具体效果。
