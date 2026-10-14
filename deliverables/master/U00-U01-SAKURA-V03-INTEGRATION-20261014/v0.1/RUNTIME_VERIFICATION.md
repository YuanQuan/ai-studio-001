# 新环境接入运行验证 v0.1

U00、U01 已共用获批樱花 v0.3 的18张 PNG、43个初始环境实例，六个既有店铺及游客独立保留。原图字节未改；本次零生图，使用冻结母版导出。街道栏杆采用石柱铁链，桥脚衔接沿用已批准版本。

## 真实运行证据

最终 Creator 3.8.8 构建显式启动 UnitSamples（01e65005-5a46-45a1-9a16-820ac4b919ae），输出733文件，日志 Finished in 4 s。最终 assets/main/index.js SHA256 为 b55009bedc500471d5b75d1c7939129a487a5d4216d782b921499ccef0c66227；Master核对8787实际HTTP字节相同。16份构建输入身份匹配，身份及文件哈希见 FINAL_IDENTITY.json 与 Client BUILD_MANIFEST.json。外层退出36在 Finished 后发生，日志明确记录构建完成及清理，不能仅凭外层码判成功。

Master在内置浏览器实际操作：U00横向移动、左右边界、缩放上限、重置、图层开关、游客数量及实体参数；U01树/精灵/莲叶/倒影添加、选中、拖动、缩放、镜像、删除、重置、图层末页43/43、相机模式、导出、返回与重新进入；新构建最后再核 U00/U01画面、U01导出和U05退出。U02/U03/U04/U05完成进入或返回烟测，U04角色表情可切换，未把烟测声明为完整功能QA。

最终实图：evidence/u00_exit_compat_final.jpg、u01_exit_compat_final.jpg、u01_exit_compat_panorama.jpg；最终导出 u01_exit_compat_export.json 为18原型、43环境、6店，全部54个原型UUID非空且符合导入登记。最终浏览器 warning/error=[]。

运行中查出并修复错误启动场景、SpriteFrame自动trim导致两端硬边、动态图集导致导出texture UUID为空，以及Gallery退出接口兼容。加载中的空帧 u01_final_post_retirement_initial_loading.jpg 仅作为过程记录，不是通过证据。先前功能操作证据均保留；退出接口窄改动后另做定向验证，无需重复不相关操作。

## 旧资源退役与限制

核对原始SHA和引用后，退役35个旧活动文件及1个空目录；其中旧47个资源UUID活动引用为零。母版、历史版本及审批记录保留。目录meta单独退役有记录，不冒充图像资源。

18张PNG合计8,606,267字节（约8.2MiB）；RGBA8展开面积约31.45MiB为估算，不是设备显存实测。U01既有横屏控制面板遮挡部分画布，本次主要按竖屏编辑视口验证。原生、小游戏与目标设备性能未测；单元示例按Owner验证，不扩展正式QA。
