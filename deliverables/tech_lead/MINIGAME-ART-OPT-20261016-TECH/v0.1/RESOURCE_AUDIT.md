# 资源审计 v0.1

首产：2026-10-16，本文件以实际写入时刻作为执行证据。范围为冻结268张PNG及导入、当前Scene/Prefab、动态源码和最新构建，仅方案准备。

冻结清单为Master v0.1/evidence/ASSET_INVENTORY.json，源身份BASELINE_IDENTITY.json；v0.2/RESUME_BASELINE_CHECK.json于17:26:37+08:00复核687项无变。PNG文件合计44,890,115字节，原尺寸RGBA8估算225,832,052字节，alpha>0 bbox面积估算136,963,684字节。bbox不含保护边、图集空洞、对齐；不是收益承诺。文件压缩字节、HTTP下载、GPU驻留是不同量纲，RGBA估算不含mipmap、引擎对象或中间缓冲。

|组|张数|PNG字节|RGBA8字节|bbox估算字节|
|---|---:|---:|---:|---:|
|sakura_v03|26|10906383|42513408|36114652|
|u05_milk_tea|56|4934620|24833644|20243980|
|dialogue faces|90|1836636|20152320|7895844|
|dialogue portraits|36|12203957|45130248|39890300|
|dialogue ui|3|23033|622592|565800|
|ghost accessories|4|29868|174080|78184|
|ghost frames|40|5793640|41943040|18511816|
|六店body/sign|12|9160679|50331648|13532036|
|lantern lab mask|1|1299|131072|131072|

本轮268张PNG重新计算hash全部一致（AUDIT_EVIDENCE.json），完整逐图宽高、hash、UUID、trim/rawWidth/offset/pivot/过滤与packable见冻结清单。不得将全部目录内容认定活动资源；重复walk/run十对hash相同只是可复用候选，不授权删除或改动画语义。

最新构建：BRIDGE-RAILING-INTEGRATION-CLIENT-20261016/v0.1/BUILD_MANIFEST.json，Creator3.8.8 web-mobile；781文件/52,923,569字节；resources16,115,444、dialogue14,395,378、main15,633,451、internal302,951字节。不是微信/抖音构建，不使用旧r6作为当前基线。

UnitSampleGallery.ts:74—84序列化streetBasePrefab、touristPrefab、touristBodyFrames、touristAccessoryFrames及shopPrefabs。店铺Prefab又直接引用body/sign，启动依赖不能靠搬PNG自动切断。Scene/Prefab完整直接UUID边附AUDIT_EVIDENCE.json；后续必须验证递归可达图与构建依赖。

动态路径：sakura_v03_environment.ts:15—28按原型resources.load、模块级Promise缓存；失败重置但无页面租约释放。sakura_layout_editor.ts:73—75过期generation回调直接返回，迟到资源归属需统一。UnitSampleGallery.ts:796加载dialogue bundle、825载manifest，849—925具局部引用计数、selection/page generation、清空Sprite后release。milk_tea_lab.ts:176—197载配置/字体，290—302合并inflight，243—246退出释放。局部逻辑不证明跨页面共享资源释放安全；销毁后迟到回调仍需租约处理。

未发现统一模块预加载调度，load不等于preload；静态持有Prefab/帧不会因销毁页面节点自动解除。packages/platform-sdk及client-core没有文件，不能称现成Adapter或资源池。

裁剪：TouristView.apply:87固定512²，sprite构造仅CUSTOM且默认trim=true。六店Prefab全部12个Sprite实际_isTrimmedMode=true、_sizeMode=1；场景同类序列化须在后续导入与运行逐项核验。sakura环境已trim=false。对话按sourceRect定位，禁止重复补偿；九宫格保持边界。裁剪唯一接入约束见TECH_DESIGN。

实际GPU驻留、DrawCall、冷启动下载、小游戏包大小、平台IDE/真机本轮均NOT_TESTED；静态/现有Web数据不能替代。
