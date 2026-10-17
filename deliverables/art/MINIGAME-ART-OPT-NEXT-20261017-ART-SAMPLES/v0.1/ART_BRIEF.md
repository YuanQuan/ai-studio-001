# 六代表无损压缩样本实际制作简报 v0.1

状态：六件已产并完成文件级与 1:1 静态自核；当前资源均为候选，尚待具体版本用户 Gate2。正式客户端接入、Cocos 导入、目标设备运行、GPU/纹理指标均为 `NOT_TESTED`。

## 授权与对象

- 用户已批准六件无损压缩制作方案 Gate1，确切身份见 `deliverables/master/MINIGAME-ART-OPT-NEXT-20261017/v0.1/USER_AUTHORIZATION.json`。
- 首图前 Art 和 Tech Lead 对 `BATCH_PLAN.json` 的 SHA-256 `a6bc70139a292edfa241235a3cf28666fc2174e3d7e7a08e8e475f83b9c1ef23` 分别完成文字预签。Master 以 `FIRST_SAMPLE_AUTHORIZATION.json` 授权首批天空、灯笼店招牌、游客三件；随后以 `REMAINING_SAMPLE_AUTHORIZATION.json` 引用同批技术扩展确认，授权人物基底、店铺主体和字体图集。
- 只对已获批的现有 PNG 做确定性重新编码。维持原画布、像素尺寸、构图、色彩解释、straight alpha、透明隐藏 RGB、原 UV/裁框/支点及 PSD 图层映射。没有新参考、生成式图片、重绘、降采样或有损候选。
- 正式源、PSD、meta、FNT、客户端工程均只读。本批输出均在当前 `v0.1/samples/` 下，原 UUID 仅作来源记录，新候选尚无客户端 UUID。

## 制作方法与锚点

六源原 PNG 均只有 `IHDR/IDAT/IEND`，无 ICC/gAMA/sRGB chunk。本轮固定按 sRGB 解释，不注入或转换 ICC。PNG 候选由 Pillow 11.3.0 以 RGBA8、`optimize=True`、`compress_level=9` 输出；WebP 候选由 cwebp 1.5.0 以 `-lossless -exact -q 100 -m 6 -metadata icc` 输出。Pillow 与 dwebp 1.5.0 `-pam` 两路读取 WebP RGBA8。完整 RGBA 逐通道与原 PNG 对比，含 alpha=0 的隐藏 RGB；任何差异均不得记无损通过。

每个候选提供原 PNG 只读副本、候选、全 RGBA 差异图、原尺寸 1:1 并排以及同浅灰/深灰背景对照。天空重点看渐变和拼接边，招牌看“花灯”字形与透明边，游客看轮廓和基准帧。全 RGBA 零差可以确认上述静态像素未变；不能代替 Creator 采样、GPU 或目标设备运行结论。同背景、同视窗、同尺度源码投影及其未验证范围另见用户包与像素核验记录。

## 六件结果

| 资产 | 原 PNG | 新 PNG | WebP lossless | 全 RGBA |
| --- | ---: | ---: | ---: | --- |
| 天空 `tex_sakura_rr_sky_r` | 1,737,963 B | 1,599,548 B（省 7.9642%） | 1,200,052 B（省 30.9507%） | 双路线零差 |
| 招牌 `tex_u03_shop_05_sign` | 100,820 B | 96,452 B（省 4.3325%） | 71,186 B（省 29.3930%） | 双路线零差 |
| 游客 `UG_GHOST_01_HAPPY_00` | 112,883 B | 106,000 B（省 6.0975%） | 71,340 B（省 36.8018%） | 双路线零差 |
| 人物基底 `tex_u04_at_s3_base` | 996,683 B | 931,082 B（省 6.5819%） | 619,712 B（省 37.8226%） | 双路线零差 |
| 店铺主体 `tex_u03_shop_05_body` | 851,634 B | 808,111 B（省 5.1105%） | 628,964 B（省 26.1462%） | 双路线零差 |
| 字体图集 `U05_ART_FONT` | 474,372 B | 467,239 B（省 1.5037%） | 282,986 B（省 40.3451%） | 双路线零差 |

本批共 6 参考、12 无损候选，0 生图调用、0 外部付费、0 有损候选；没有失败候选或返工。六源文件共 4,274,355 B，新 PNG 共 4,008,432 B，减少 265,923 B（6.2214%）；WebP lossless 共 2,874,240 B，减少 1,400,115 B（32.7562%）。这些只是六件文件字节，不是 native 包、下载量或运行内存收益。

首批编码/诊断脚本墙钟 UTC `2026-10-17T09:09:44.113633` 至 `09:10:19.520600`，余三件 UTC `09:15:51.109858` 至 `09:16:32.098193`；这不是总人分钟或算力费用。只读准备及文档整理另记录，未精确测量者标 `UNKNOWN`。实际输出 SHA、每项耗时和完整像素指标以 `EXECUTION_LEDGER.json`、`PIXEL_VERIFICATION.json` 为准。
