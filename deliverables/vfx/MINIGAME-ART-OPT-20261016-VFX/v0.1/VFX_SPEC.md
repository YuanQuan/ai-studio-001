# 现有特效审计与精确改动约束 v0.1

状态：制作中；首次实际文档产出 2026-10-16T17:36:04.361092+08:00。仅文档审计，不作为正式Client输入。

## 范围、证据与门禁

仅审计与精确改动约束；不生产图片、不改代码/meta、不执行构建。已读本轮Task、角色五文件及共享Cocos CLI skill。受 visual_production_contract、visual_fidelity_compute_contract v0.1约束；本稿供同批UI/VFX/Art/Tech联合Review，不是下游正式输入。任何资源裁剪/图集/共享实施仍须具体方案Gate1、同批预签和具体版本Gate2。

## 实际对象与分类

|对象|实际证据与保留合同|
|---|---|
|游客序列帧|`deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/frames/FRAME_MANIFEST.json`：UG_GHOST_01 / U02-VFX-A，40张512²透明帧，四动作各10张；walk每帧400/3ms、run200/3ms、happy140ms、sad280ms。walk/run同姿态而2倍速；不减帧、不改顺序/节奏/形态。40源文件SHA全部与manifest一致。|
|游客挂点与配件|同版 `mounts/FRAME_MOUNT_MANIFEST.json`；运行 `apps/client/assets/labs/u02/tourist_view.ts` 按foot定位512²主体，头/脸/腕的localAffine分解旋转、缩放、UISkew，镜像主体及配件一起。层序AccessoryBack→BodySprite→AccessoryFront；手环前后两片，帽/眼镜前层。实际配件4张：帽192×128、眼镜160×80、手环前后各64×48，来源映射见工程data/ug_ghost_01_accessories.json。不得把配饰烘入主体或用静态旧挂点。|
|眼睛程序动画|`apps/client/assets/labs/u01/sakura_v03_environment.ts` attachSakuraV03EyeGlow / SakuraV03Motion：独立eye_glow图层；alpha=round(48+207×(1+cos(elapsed×π/2))/2)，4秒周期，255起始、2秒48、4秒255。只改透明度，不换帧、不改颜色/空间形状。|
|河面程序动画|同文件及sakura_water_motion_math.ts：每组reflection/lotus/flame三实例同偏移、保持各自y/z；按同left/top且top≥700匹配完整三元组，组间交替方向，24设计单位/秒，包裹周期3072+groupWidth。三实例不是三张序列帧；高处火焰保持静止。不因旧motion标签给静态图加动画。|
|奶茶交互|`apps/client/assets/labs/u05/u05_interaction_presentation.ts`与milk_tea_lab.ts：程序采样交互+游客序列帧+现有杯/配料Sprite，不新增粒子或特效图。详见时序。|
|独立灯笼试验|`apps/client/assets/labs/lantern-pilot-v02/`：lantern_lighting.effect + 128×256 mask，原1024²完整body UV映射遮罩区域(178,505,128,256)，材质strength限制0.9..1，2秒曲线。普通src_alpha/one_minus_src_alpha混合，关闭深度测试/写入；不是加法光晕。当前Web构建assets/main/index.js含lantern代码，仅证明包含代码；未证明独立场景/遮罩纹理被打包或执行，不将独立试验等同当前街景眼睛效果。|

## 触发、结束、中断、重入

游客控制以tourist_state.ts为准：attach先detach，初始显示walk00但action=null；选择新动作从00清计时；重复选择当前动作不重启。manifest四动作loop；tick最多追10步后清剩余，不能凭时钟推断后台全周期重放。reset清计时/装扮/朝向回初始；detach失效generation并清SpriteFrame。Gallery切页与销毁detach；重入新建controller。奶茶happy/sad例外按动作总长钳末帧，walk循环，不能强行把奶茶情绪改成永久loop。

环境configureWater清elapsed重建组；有效正dt驱动，节点销毁onDestroy清组和眼睛引用。没有独立眼睛/河面结束事件，随环境存活；组件暂停期间无update，恢复继续累计，重新configure从周期0开始。不可另增异步tween/计时器跨页面遗留。

奶茶arrival 450ms：x=-72→309，完成后显示气泡。正确/胜利：合成650ms→happy默认1400ms→depart450ms；correct再arrive450ms，won结束于离场。wrong：合成650ms→sad默认2800ms→complete留原位；expired：sad→depart450ms（已离场则直接complete）；exited仅depart450ms。情绪前80ms squash、80..150 blink、150..225 expand_mid，随后目标表情；实际游客帧总长由资源计算可覆盖默认。TEA/MILK/TOPPING移动窗口分别80..420、220..540、360..650ms。超时以当前采样x和新epoch替换非胜利事务；事务存在锁输入。销毁清事务、epoch递增、撤输入/resize监听并释放非在途帧；重入创建新事务，不接上次迟到资源。当前源码在途资源回调与生命周期应由Tech专项核验，不宣称泄漏已通过。

灯笼按播放从elapsed=0、strength=1开始；暂停、复位、onDisable均停止并恢复1。它不改变当前街景灯笼方案。

## 多分辨率与精确可改边界

联合Review以本批TECH_DESIGN.md v0.1唯一接口为准：ViewportSnapshot逻辑像素、左上原点，Mapper扣Canvas内容矩形L/T后映射Cocos；DPR只影响backbuffer。触点同一逆映射，安全UI与世界层独立，revision变更重算。禁止按截图坐标直接扩大热区，禁止非等比拉伸人物/河面/挂点。0尺寸保留最近有效值。

主体固定512²、foot及挂点不变；透明裁剪只去alpha=0外沿，按Tech的originalSize/offset/rect恢复原画布，保留半透明及保护边。当前View为CUSTOM但未显式trim=false，未来实施须按Tech统一迁移并验证，不能认为本稿已修复。配件沿原size，不能重复补偿。happy03帽历史审核画布上缘溢出约5px，真实独立配件必须完整显示，不能随主体画布裁掉。图集关闭旋转、保留滤波、mipmap与每边≤2048等本批约束；独立lantern依赖完整UV，禁止未经专项Review纳入裁剪/图集。

## 透明叠加、复用与测量

眼睛额外透明层、游客主体/配件、河面反射与火焰及奶茶移动层均可能增加覆盖与批次；图片alpha=0面积仍可能消耗片元。层序与混合保持现有配置，不能因过绘把反射/眼光/配件合掉或加亮。游客40身份展开RGBA理论40MiB、walk/run同姿态30MiB只属离线下界；图集空洞、padding、纹理压缩、驱动拷贝、同时驻留均须实测。逐ID、hash、挂点、引用审查后才能共享纹理，身份/时序不去重。尺寸和文件字节不能证明性能达标；不新增视觉降级。

后续每批固定构建hash、平台、机型、DPR、视窗，拍同背景/视窗/尺度的00/04/09及完整周期录像，对齐脚底、镜像、遮挡、眼光0/2/4秒、河面包裹接缝、奶茶每阶段边界前后1帧。记录frame time中位/P95/P99、DrawCall、纹理/GPU内存峰值与稳态、启动/切页耗时、透明覆盖/过绘及20次进入退出后的租约/资源计数。由Tech/Owner先锁性能预算再判定，不能本稿发明阈值；当前所有小游戏构建、真机、性能、多分辨率运行结果均NOT_TESTED。

发现挂点漂移、帽裁切、半透明边丢失、UV错位、视觉层级/动作时长差异、迟到回调绑旧页面、资源计数增长或超预算，停止该批替换、回当前已批准资源与映射，向Master提交差异，不自动缩图、减帧、降低透明或改动作。

## 来源与批准追踪的实际限制

审批 `tasks/U02-TOURIST-VFX-FRAMES-001/ARTIFACT_APPROVAL.json`为v0.2 USER_APPROVED；实际recomposition.png SHA为4a76eaeb64270be2914c41e0ca648a38e2dd4542696d3ead4d363edce76c027a，与批准记录相符。manifest内USER_REVIEW以及旧export audit内PENDING是制作时历史快照，不覆盖后续正式批准记录。

40帧现存且可复核；manifest记录静态母版 `deliverables/art/U02-TOURIST-ASSET-001/v0.1/batches/U02-FULL-A/formal/source/tourist_body_master.psd` SHA b0c27861b0b62f8d85a927185b84c34e95005e0fd22224c9f7ed33e3c826de50，但当前该路径与psd_work层源均不存在。逐帧PSD从未承诺存在；不能以当前客户端PNG反称PSD可编辑源已恢复。配件正式工程4 PNG存在，approved-source/ACCESSORY_SOURCE_MANIFEST.json有来源映射，但原Art目录当前缺失，4配件源hash及其独立批准尚不能由本次定位闭环，交Master/Art追溯；不虚构unknown为已批准。

### 当前工程配件文件身份（只读实算）

- `apps/client/assets/units/ghost-customer/accessories/tex_ug_acc_glasses_01_front.png` SHA-256 `5ee38053d2684fbda3c42f6c8142f2d835ef9c710a1aba7407160071eaca7473`。
- `apps/client/assets/units/ghost-customer/accessories/tex_ug_acc_hat_01_front.png` SHA-256 `bb0d744400da2d7024adfc37592d35d64ffcf24c86eeb7afc930bde3dafbd403`。
- `apps/client/assets/units/ghost-customer/accessories/tex_ug_acc_wristband_01_back.png` SHA-256 `e70abb72b62b7eb7762ee563776952c7c9e5784ae3830602d23d42e7ce33bf3a`。
- `apps/client/assets/units/ghost-customer/accessories/tex_ug_acc_wristband_01_front.png` SHA-256 `24759d16f36c9fe5be4a7592532603d24e61934e1371e2e82703b155356a02b3`。

工程 `apps/client/assets/units/ghost-customer/frames/tex_ug_ghost_01_{walk,run,happy,sad}_{00..09}.png` 40个实际文件逐一与正式v0.2 manifest SHA匹配40/40；这是当前工程与已批帧同源的静态证据，不代替运行。
