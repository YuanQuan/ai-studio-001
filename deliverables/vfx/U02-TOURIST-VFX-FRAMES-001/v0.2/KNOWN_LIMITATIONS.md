# v0.2 审核与接入限制

- 本版正式主体为40张512×512透明PNG，具体版本待用户Gate2；VFX文件核对不是用户批准。Client、Prefab/Scene、Creator导入、Web实际运行、图集、设备性能和正式QA均未执行。
- happy03的独立帽保守非透明bbox上缘为y=-4.81px。帽PNG本身未裁切，独立Sprite可超出主体512画布；512审核canvas会裁约5px帽顶。`preview/happy03-accessory-overflow.png` 在不缩放主体和配件的前提下增加上下16px余量，细框表示原512画布，供用户看完整效果。Client需保持独立配件越过BodySprite矩形时可见，不能仅用主体画布裁切整个MirrorRoot。其余159项配件bbox处于512范围。
- 挂点localAffine为离线同Shader网格推导，Client消费旋转/缩放时仍需核Creator真实画面、镜像和前后层序；不能以本离线重组替代运行验证。
- sad05跨浏览器刷新后的独立导出与诊断有一个颜色通道差1；已记录精确像素于REPRESENTATIVE_CHECK。不能声称跨GPU或会话逐字节可复现。walk/run在本批内直接共享缓存，十组PNG逐字节一致。
- 全40身份PNG实测5,793,640字节；RGBA8基础展开40MiB，只有Creator实际复用walk/run十张贴图后才可按30MiB估算。尚无mipmap、图集、峰值内存或DrawCall实测。
- happy/sad本版10帧loop与旧Client 4帧once_hold及旧时长不同。正式接入前Master须组织Client/UI/QA按获批本版迁移时序与保持态合同；本VFX交付不修改玩法触发语义。
