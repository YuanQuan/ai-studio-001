# 全批首图前技术复签工作记录 v0.1

状态：输入核查已开始；尚待Art真实BATCH_PREPRODUCTION_PLAN与同版Art预签，不签未来图像PASS。

本轮已重读Tech角色五文件、Task、Master本批USER_AUTHORIZATION与BASELINE_CHECK。用户批准10样本Gate2，并授权整体方案下全批范围复签与不依赖新切片的技术/UI实现。当前源基线687项未变的Master记录不是未来变化后的自动通过。

已批技术路线允许以当前已批图独立实现ViewportAdapter/Mapper、逻辑像素safe/capsule与revision、U00—U05 UI布局和ModuleAssets租约。新全批PNG/meta/UUID接入仍锁Gate2。原画布恢复只采用originalSize+offset+CUSTOM/trim=false；U04手工sourceRect、九宫格及lantern完整UV必须排除通用裁剪。

复用入口：apps/client/tools/serve-unit-build.mjs；U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/audit-creator-import.mjs、finalize-creator-build.mjs、write-build-manifest.mjs；既有milk_tea_state.check.js。Gallery的U04 inflight/refCount与generation逻辑可作为迁移来源，但不得和新ModuleAssets形成双重资源所有者。Creator版本3.8.8；旧构建证据不能证明新实现。

后续核对完整scope/来源批准/特殊UV与sourceRect/PSD逐层链/透明RGB及采样/实际预算，再绑定Art同版SHA复签。Client Brief实际存在后技术对齐；代码审查仍待真实代码、测试、当前Creator构建和HTTP运行证据，平台与性能缺证保持NOT_TESTED。自产切图不新增切后效果Review。

## 跨端API独立核验补录

本机Creator3.8.8 engine/pal/minigame/wechat.ts:104–116有getWindowInfo缺失时回退getSystemInfoSync；219–231以窗口资料safeArea为主。bytedance.ts:108–122以tt.getSystemInfoSync读取safeArea，注明landscape-left FIX_ME，iOS横屏做旋转处理。不能将两平台safeArea无条件解释成当前窗口。适配器须能力检测，登记坐标来源、screen/window原点和旋转；无法确认的目标方向保留诊断并NOT_TESTED，不把Cocos旧fallback当平台正确性证明。

本轮微信官方getWindowInfo/胶囊页面工具不可访问，未把失败页面当通过依据。Master已补核[抖音小游戏JS官方系统信息](https://developer.open-douyin.com/docs/resource/zh-CN/mini-game/develop/api/javascript-api/foundation/system/system-information/tt-get-system-info-sync)：windowWidth/Height、pixelRatio为逻辑像素，safeArea按竖屏正方向（最低1.51.0），deviceOrientation最低3.66.0。Client应锁实际SDK能力并核旋转转换，不能把mini-app文档当小游戏支持。Web与纯逻辑可实施，目标平台运行保持NOT_TESTED。

## Client轻Brief技术对齐

CLIENT_BRIEF_REVIEW.json已APPROVED，绑定Brief SHA-256 `e9ad048785a285d4ef04a8f4a6655658223a27c2e7e49f94e0bccf06008d7caf`，明确Canvas/letterbox与触点域、租约Owner身份与取消/迟到、U04单池迁移、tt旋转safe/capsule、resize状态保留。当前没有代码Review结论。

## 73件原预案核查与采样诊断

原73件预案SHA `690c07d91e696ad67c04b8310e6ba9e31de39f7554ebe01dc9eb44ef1c6ac875` 尚未由Tech签认。独立73件源SHA、alpha bbox+2裁框、offset与原manifest包含的SHA、原批准USER_APPROVED均通过，证据BATCH_INPUT_VERIFICATION.json。scene14均普通Sprite实例：sakura_v03_environment.ts与layout_editor使用CUSTOM/trim=false，河面组为节点位移，不手改纹理UV；眼光sourceRect属于独立补丁不纳入。U05 CUP已有trim=false，但LOCK和BTN_CONFIRM_TEXT未来接入须同原画布恢复，不能裁完直接按原UITransform填满；保持原杯叠放、按钮字样定位与锁状态语义，字体图集及九宫格排除。13PSD为非运行资源库，槽位须保留各原尺寸并在生产后真实读回核边界，不能当运行图集。

只读旧10样本采样诊断在PILOT_SAMPLING_DIAGNOSTIC.json：以straight RGBA双线性9个亚像素相位(0.25/0.5/0.75组合)，再source-over合成，body/sign/flame最大8bit RGB差63.126/63.188/62.692；裁框内隐藏RGB变化10844/360/564像素；游客7件全0。这是CPU数值风险证据，不是Creator/GPU实测。源与旧切片alpha相同，黑灰白背景合成差相同；静态可见零差不能外推采样无损。

Master已据实接受诊断，授权另路径v0.2增加3件修订，使新制作76件；旧v0.1样本/批准与原73预案保持。Tech不签旧73版本，待Art真实v0.2范围和同SHA预签后继续。透明RGB仅允许从同件获批源同坐标回填alpha=0，真实PSD层alpha及alpha>0 RGB保持；最终裁框全RGBA零差再验证同相位采样。真实导入/运行/平台性能仍NOT_TESTED，不增加切后专业效果Review。

## v0.2正式首图前技术复签

APPROVED，唯一对象SHA `fe1221f4069c0f062e80af8b385ef3f638084f9d84025f04f402e3a2d408f083`，scope SHA `ffcb38f0d1816517196743f4f189f7177c97c6c11b65839883f2fea326a00a26`。Art同版同SHA已APPROVED。原73源与坐标未改，新增3修订独立确认同旧批准源/裁框/offset/pivot，详BATCH_V02_DELTA_VERIFICATION.json。14PSD/76层槽位计划可容纳；真实源→PSD层→独立原画布→裁片链须生产后实际核。透明RGB只在alpha0从准确源同坐标回填，全RGBA及9相位straight-alpha线性采样静态目标零差；旧10不覆盖。预算0生成/2轮/90+45总135分钟。预签是计划支持，GPU/平台/实际导入与运行NOT_TESTED。自产切片直接用户Gate2；Client已授权TS修改不属于Art源PNG漂移，代码Review另待真实实现。
