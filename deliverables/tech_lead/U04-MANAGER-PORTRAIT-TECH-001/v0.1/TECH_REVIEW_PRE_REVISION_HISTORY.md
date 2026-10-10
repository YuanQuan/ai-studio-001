# 首次六板静态核验快照（已被定向修订覆盖）

2026-10-10 首次六板及六 PSD 落盘时，Tech 核 18 独立 PNG 均为 `1024×1536 RGBA`，6 板均为 `3584×1792`；6 PSD 均可解码为复合图加 4 个层。逐份 PSD 复合图与对应板 PNG 的 ImageMagick `compare -metric AE` 结果均为 0；6 份构建 manifest 的 0／2／3 魂完整人物层未缩放，显著 alpha 主体脚底均对齐板上 y=1650。

随后 Master 对孟桃 3 魂姿态与阿角 2 魂发型提出定向修订，因此本快照**不构成最终 Tech Review**。修订前相关文件 SHA-256：

| 文件 | SHA-256 |
|---|---|
| `characters/mgr_mt_s3.png` | `4e39650f90f5c4cb2353285f0544490d825a9d3a7ec72608b66736a9fce4c337` |
| `characters/mgr_mt_board_023.png` | `a189a495ce5eaf0a1d18398c368380bdb0987e2b32082a6c9c8e36de75b289c1` |
| `psd/mgr_mt_board_023.psd` | `afb3b3378d31269eb7c3d33506680ee0d2527a7b6e48c5e53a8ec435f902d5e7` |
| `characters/mgr_aj_s2.png` | `c6d664c0b34e2713fac9e6bc5e3b86fe60a98974c5ab8c90835b51609f336bf2` |
| `characters/mgr_aj_board_023.png` | `884b0b48498dd2a82cbad8c9b2ac491ad8bfbe1eaaffccff0b0bb9f9e27e6909` |
| `psd/mgr_aj_board_023.psd` | `bb4ba666bcfe0001e8cbbca828fdc6a7a6270a515a6b22c65d090ca1c22c0d22` |

旧二进制是否仍保留由 Art 来源登记说明；此处仅保留核验结果和哈希，不把旧版当当前用户审阅图版。
