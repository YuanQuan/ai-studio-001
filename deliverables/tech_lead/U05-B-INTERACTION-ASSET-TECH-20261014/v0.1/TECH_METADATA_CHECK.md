# U05 交互资源阶段性技术元数据核验

结论：**BLOCKED，代表净底未通过，不存在 FULL 成品**。此核验只读 Art 已产元数据与实际文件，不是美术效果复审或用户 Gate2。REP-01、REP-02 和 MANUAL-01 均有同批 Art/Tech 制作预签；前两轮自动修补与唯一手工候选均按失败停止，不能把局部元数据 PASS 转成正式资源 PASS。

实文件核对：REP-02 `STATIC_BARE_CLEAN.png` 为 1024×1536 RGB，SHA `2160dd5789174154304e49d3a6fd4230a095bcf1e3777caf4db1f939d3e179c9`；MANUAL-01 候选为 1024×1536 RGB，SHA `54d0d41b06de0ecb509475b246a3f81236ba30a169bed551ef6e062fe789556a`；人工 Mask 为 1024×1536 L，SHA `bd5148f8369939fde38260461d844ec1f91ff5fad40c68ecfab8edf4f2d5e1b4`。逐像素重算 Mask 为 1600 像素，REP-02→MANUAL-01 的 Mask 内改动 1600、Mask 外 RGB 改动 0。`MASK_REVIEW.json` 的同源 donor SHA 与预签一致。技术保护区检查通过，但 Art 四倍实图自查仍见幽灵淡尾、杯沿椭圆及玻璃线，故净底失败。

`REPRESENTATIVE_METRICS.json` 记录顾客身体/脸统一 332×301、源左上 (309,484)、共同脚点 (475,785)、anchor (0.5,0)，中性重组与原角色 RGBA 差异 0、脸编辑 Mask 外差异 0。代表 GIF 实文件 SHA `c59abd0edd2996d2d1e940b5063f8e5813d715a20187087f6167e7936662c903`，尺寸 360×640，Pillow 读取为 12 个存储帧；元数据表列 13 个采样时刻，可能因相同视觉帧合并，不能把 13 个时刻误述为 13 个实存帧。脸时序、-381 源像素完整离场只获得独立预览证据，Cocos Mask/柜台遮挡尚未运行核验。FACE_SQUASH 与 FACE_EXPAND_MID 是补间，不计新情绪状态。

当前 `CUT_MANIFEST.json` 明确 `PARTIAL_BLOCKED_NOT_GATE2_READY`：只有身体、中性、闭眼、开心及辅助片的代表局部；失落脸、新多层 PSD、最终净底、全组件同尺度重组和全动作 GIF 未产。Client 正式路径为 `PLANNED_NOT_IMPORTED`、UUID 为 null。无 FULL 文字复签、无具体切片 Gate2、无 Creator/Web 或目标设备运行。因此停止于阶段性技术记录，不释放完整资产给 Client。
