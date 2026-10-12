# 灯笼首样资源制作规格 v0.2

本批精确参数以 `preflight/MASK_SPEC.json` 为准。导出一张 128×256、8-bit 灰度 L 的局部遮罩 PNG，原点对应 body 原坐标 `(178,505)`，有效内容仅位于灯面内层，其余 texel 为 0；线性采样、无 mipmap、边缘 clamp。未导入前客户端路径和 UUID 均为计划。新增原始纹理 32,768 字节（0.03125 MiB），低于 0.25 MiB 硬上限；实际 GPU 占用须以引擎导入格式核查。

使用现有 Python/Pillow 对源 RGBA 逐像素读值并按固定公式输出 mask；首样预览以相同 8-bit sRGB 解码和直通 alpha 比较源图、强度 1.0、最低 0.90、过渡点和完整循环。只准一个候选；同一可检查缺陷累计至多两轮修正；实际制作起止以首张输出前和完成时记录，4 小时为硬上限，新增费用 0 元、生成调用 0 次。达到硬上限、出现零差失败或需要扩遮罩时停止并上报。

同批 Art/Tech 预签均须引用同一份 `MASK_SPEC.json` 的 SHA-256，且 Gate1 `USER_APPROVED` 已登记后才准首次输出 PNG 或新预览。Client 独立 pilot 的小型单实例 Effect 负责真实 UV/trim/atlas/dynamic batching 映射及材质隔离；静态计算图不能代替实际 Cocos 运行通过。正式 body/sign/PSD/meta 均只读保留。

实际执行：同批双签后于 2026-10-12 15:24:21 +08:00 开始唯一候选制作，按预签参数生成 `exports/tex_mt_shop_01_lantern_mask_v02.png`（SHA-256 `f9a67671a0e1d4f03974f62b3fdf8de1131e4e99adc7aad4fecd13095fba7b9f`）。网页预览最初整图每帧复制，已在同一候选第 1 轮修正为首帧绘制全图一次、每帧仅复用并更新 102×165 ROI 的 67,320 字节 RGBA 缓冲；同轮将暂停改成停止并复位 1.0。mask 字节、源图、曲线与候选数量未变。网页效率不代表 Cocos 的 Draw Call、GPU 内存或设备耗时；这些指标因 Creator 启动失败保持 `NOT_TESTED`，详见运行诊断。
