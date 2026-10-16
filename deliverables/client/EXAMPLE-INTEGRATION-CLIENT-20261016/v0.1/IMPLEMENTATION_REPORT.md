# 获批 Gate2 切片接入实施报告

已按 Art `EXAMPLE-REVISION-ART-20261015/v0.1` 接入五张批准 PNG，文件字节与 Art 导出逐项 SHA-256 完全一致。Creator 3.8.8 首次导入生成正式 `.meta`；实际 image、texture、SpriteFrame UUID 已写入客户端布局原型与 U01 用户布局派生档案。详细路径、哈希、尺寸和 UUID 在 `evidence/ASSET_UUID_MANIFEST.json`。

远景逻辑原型 `tex_sakura_rr_far_l` 指向获批暗态底图，保留原 SAK-V03-003 实例 ID 与用户几何；亮层挂在该节点下，局部位置按 far 图 1536×720 的 transform 计算，自动跟随编辑缩放和水平镜像。`SakuraV03Motion` 每帧只更新 `UIOpacity`，按4秒余弦从alpha255平滑到48再返回255，不写入实例布局数据。U01导出通过单独 `presentationOverlays` 描述该子层和循环，不把运行中的alpha/位移写回基础位置。重置/离开重入时子层随其父节点生命周期销毁并重新挂载。

左右清理桥身复用旧逻辑原型和实例 ID、位置、尺寸；新增两条静态街面：左 x=0，右 x=1900 且水平镜像（运行节点 scaleX=-1）。两条街面按 Art 层序绘制在对应桥身之前，前层栏杆仍保持于 L04_WaterBridge，继续高于 L03_Ground 的街面/桥身。原冻结53个实例几何、ID和水面分组参数均未变化；新增两个静态实例后为55条。

运行核验发现并保留了r2加载路径错误记录：旧 `path` 使实际 SpriteFrame UUID 指向原 PNG；修复后 Master 确认五张资源 UUID 正确。r3/r4眼睛差分框作为调查证据保留；r6实际诊断日志确认配置完成及首帧 overlay contentSize 均为99×54、scale1×1，父层1536×720、scale1×1，SpriteFrame元数据为获批亮层且sizeMode=CUSTOM、trim=false。最终Master IAB通过：在720×1280实测左右桥/街面及前栏杆层序、右街镜像、两眼区域亮暗变化、U01的55项初始/重置/重入导出一致、U05顾客入场和已批准布局保留；浏览器warning/error为空。r6 Creator 3.8.8隔离构建成功，exit36，输出781文件。完整构建身份、IAB和限制见 `evidence/BUILD_MANIFEST.json` 与 `deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/IAB_VERIFICATION.json`。

持续动画仅用单个场景驱动更新眼睛opacity；没有新增逐帧对象分配或图像资产之外的第三方依赖。性能目标机未测试。
