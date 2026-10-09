# U03 性能证据 v0.1

按已批TECH_THRESHOLD_PROPOSALv0.1，整体BLOCKED；不降低阈值。

| 指标 | 结果 | 原始证据/缺口 |
|---|---|---|
| RGBA8源/构建文件面积 | PASS限定静态 | RESOURCE_AND_BUILD_AUDIT：12张1024²PNG，各4194304字节，总50331648字节=48MiB＜128MiB。12件SHA命中构建native。 |
| 运行图集/最大纹理/GPU驻留 | NOT_TESTED | 静态文件面积不等于GPU驻留，不排除运行图集、解码副本。 |
| 六店帧时60秒×3轮 | BLOCKED | 无逐帧原始序列，无法算p50/p95/p99/>50ms比率。 |
| FPS≥50 | NOT_TESTED | 无可靠刷新率/前台节流证明及完整采样。 |
| 冷/热各3次≤5/2秒 | BLOCKED | 未证缓存条件及输入到可操作完整帧同钟时间。 |
| 切换≤1秒、20连按末次≤2秒 | NOT_TESTED | 20次最终03实图正确，但缺统一输入/目标/完整帧时间戳，不能判时限。 |
| DrawCall平均/峰值/p95 | NOT_TESTED | 缺运行计数器。 |
| 10入退实例/监听/资源引用 | NOT_TESTED | Master10次均显示01，但没有节点/监听/缓存计数，不证明清理/无泄漏。 |

环境：Master只读canvas记录CSS/backing390×844；DPR/userAgent受限，无可靠DPR，不能推断。GPU/驱动/刷新率/电源/缩放/safe area/visibleSize缺失。218条控制台warn/error0只支持该集合，无完整Object字段，不是性能序列。720仅视觉，不与主阈值混判。恢复计数能力后按原已批采样量完整测量。
