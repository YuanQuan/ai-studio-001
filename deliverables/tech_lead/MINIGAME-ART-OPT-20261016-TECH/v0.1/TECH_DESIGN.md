# 资源与适配技术方案 v0.1（Draft，Gate1前）

本方案受rules/visual_production_contract.md及rules/visual_fidelity_compute_contract.md v0.1约束。用户已授权总体实施，本阶段按门禁先交具体方案；本轮不产图、不改meta/场景/业务代码。图片全部保持当前像素尺寸与视觉语义，不缩放、不重绘。后续资源制作先获具体方案Gate1用户批准及同批Art/Tech预签，具体切片Gate2用户批准后才可正式接入。文档专业Review不替代这些门禁。

## 唯一小型适配接口

拟新增apps/client/assets/framework/viewport内ViewportAdapter（当前无实现），由现有Cocos assets TypeScript导入链直接相对导入；当前没有packages外部源码导入配置，不扩展monorepo构建配置，仅三种实现WebViewportAdapter、WeChatViewportAdapter、DouyinViewportAdapter。业务和资源生命周期模块不访问wx/tt/window。类型约定：

```ts
type Rect = {x:number;y:number;width:number;height:number};
type ViewportSnapshot = {
 revision:number; width:number; height:number; dpr:number;
 safe:Rect; capsule:Rect|null; orientation:'portrait'|'landscape';
};
interface ViewportAdapter {
 read():ViewportSnapshot;
 subscribe(fn:(v:ViewportSnapshot)=>void):()=>void;
}
```

全部Rect与width/height为当前窗口左上原点、向右/向下的逻辑像素，不是物理像素。wx/tt各自在Adapter内读取可用窗口/安全区/胶囊和方向、窗口变化事件；提供方若给屏幕坐标，先扣当前窗口原点，再裁到窗口范围。胶囊不可得返回null，不伪造矩形；安全区缺失回退窗口并记诊断。Web以实际CSS视窗及设备比率、可用safe-area数据读取；事件合并到一帧一次，销毁取消订阅。实现前核当前SDK可用API与坐标语义；不猜跨版本相同。

同一framework/viewport仅增加ViewportMapper，输入snapshot与Cocos实际Canvas内容矩形（逻辑像素、含letterbox偏移L/T）和visibleSize；输出相交安全Rect与胶囊排除Rect的UI坐标：xUI=(x-L)/contentWidth*visibleWidth-visibleWidth/2，yUI=visibleHeight/2-(y-T)/contentHeight*visibleHeight。四角分别转换后取包围矩形。DPR只控制backbuffer，不再乘入UI坐标。触点同用该逆映射；布局保留既有对话横屏，世界层和安全UI层分别适配，不因安全区压缩已确认场景。方向变化按新revision重算，不重新拉伸图片。临时0宽高/失焦保留最近有效值，直到有效resize。

## 唯一裁剪坐标约定

采用Sprite原画布恢复，禁止另建一套手工bbox坐标补偿。每帧登记原画布W/H、bbox(x0,y0,x1,y1，左上坐标)、保护边、原pivot与来源hash。存储裁片仅去alpha=0外沿，禁止阈值删半透明；rect含保护边，originalSize仍W/H；offsetX=(x0+x1-W)/2，offsetY=(H-y0-y1)/2（包含保护边后的实际rect），pivot与原版相同，旋转初期关闭。禁止仅改meta rawWidth而让导入重算覆盖；后续验证Creator3.8.8导入后真实SpriteFrame.originalSize/offset/rect/UV，必要用已审查的运行构造帧保留元数据。任一字段不能稳定落地则停止该裁剪候选，保持当前PNG。

受影响SIMPLE Sprite统一CUSTOM、trim=false，UITransform保持原逻辑尺寸/anchor/位置/scale。Tourist body固定512²保持，原脚底/配饰挂点不改；accessory使用原size，不能重复偏移。Shop body/sign原1024²与ground_contact保持，各Prefab由_isTrimmedMode=true迁移false后逐个对照；Scene静态Prefab同查，sakura环境已有trim=false也核导入字段。对话sourceRect层已在原画布内手工定位，禁止叠加本通用补偿；九宫格保持原边界、不通用裁剪。UV仅从rect/图集位置生成，不能手改原挂点。原图与重组同背景、同视窗、同尺度比较；动画所有帧脚底、镜像、遮挡和配饰不漂移。Master v0.2/ENGINE_TRIM_INSPECTION.json记录本机引擎仅trim=false使用originalSize的依据。

## 平台分包与图集

唯一方向为平台本地分包，不使用CDN。启动包只保留菜单壳、必要字体/基础配置；world（共享街景）、tourist、shops、dialogue、milk-tea模块按实际依赖拆本地Asset Bundle。启动Scene去除这些模块的序列化Prefab/Frame硬引用，改稳定资产ID到bundle/path清单；此变更等待Gate批准与正式Client任务。world为共享依赖，overview/对话等显式先acquire world，模块不能隐式复制world到自身图集。构建报告检查启动递归可达边、跨包共享资源实际落点，禁止只凭目录判断分包成功。

图集按模块及同时驻留集合打包，每边≤2048；过滤linear、mipmap none沿用当前，2px透明保护边；如需边缘扩展只允许在新增alpha=0保护边内处理RGB，alpha和全部可见源像素保持不变，否则停止，避免串色，禁止旋转、缩放或跨模块巨图集。大于图集可容纳尺寸的原图保持独立纹理，不拆画面或降尺寸。估算必须计图集页空洞、padding及新增独立纹理；图集不能当作DrawCall或内存必降证据。重复像素仅经逐ID/语义/引用映射审核后共享，不删除历史源。平台实际主包、单分包、总包限制由实现时官方规则与IDE确认，不能承诺仅分包必达；超限停止并交Master取舍，不自行CDN/降画质。

## 加载、共享租约与释放

拟在apps/client/assets/framework/module-assets增加ModuleAssets，唯一入口acquire(moduleId, ownerGeneration):Promise<Lease>，Lease提供get(assetId)、idempotent release()；调用方不直接bundle.release。key=(bundle,path,type,revision)，一个inflight Promise聚合所有等待者，每个Owner占独立租约计数，错误清除inflight且回滚预占计数，可显式重试。模块先取得依赖租约，再载本模块；失败逆序释放。清单校验循环依赖禁止构建。world只加载一次，多页面共享计数。

进入页面增加generation，开始载下一屏所需最小集合，资源全齐再原子切换可见树；当前页保持或显示明确失败重试。预取只用小型下一页集合且持可取消租约，不预热所有角色/帧。退出先使generation失效、停动画及输入、清空所有SpriteFrame/Prefab实例引用并destroy节点，再release模块及依赖租约。迟到成功若generation过期不绑定节点，释放该等待者租约；其他有效Owner仍持有同key时不得释放底层资源。失败/取消/重复释放不产生负计数。

计数为0且inflight完成后才释放资源及无引用依赖；先清frame后释放共享纹理，禁止releaseAll/releaseUnusedAssets全局扫除。移除bundle仅当资源/依赖/预取/在途租约均0；与release底层资产分开。20次进入退出须核租约、GPU资源及计数稳定；当前对话局部池只能作为迁移来源，不能与新池双重拥有。退后台暂停预取，回前台以revision核布局和有效资源。平台下载缓存驻盘与运行引用释放独立统计，不把磁盘缓存当泄漏。

## 失败与回滚

按模块逐批替换，不全仓同时变更。保留旧PNG/meta/路径/hash和映射表；任一像素/挂点/UV/包依赖/生命周期检查失败即回到该批旧资源与旧映射，不删除历史审批证据。不自动改变产品规则、触控或动画数量。正式构建与平台测试缺失时状态NOT_TESTED，禁止报告性能已通过。
