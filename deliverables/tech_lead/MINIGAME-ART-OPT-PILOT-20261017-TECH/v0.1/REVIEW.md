# 10件无损代表首图前技术预签 v0.1

结论：APPROVED，仅为同批制作预案技术支持。未生产或签认任何新图像效果，正式导入、运行、性能均 NOT_TESTED。

预签对象：`deliverables/art/MINIGAME-ART-OPT-PILOT-20261017-ART/v0.1/PREPRODUCTION_PLAN.md`，SHA-256 `e2a2c7a74830c9929d7989964dc302537d198bafe5f5f96af4e7fde088312294`，与 ART_PRESIGN.json 绑定相同。首产本 Review 及 INPUT_VERIFICATION.json 后提交 Master；Master 内部接受前 Owner 保持 REVIEW。

## 独立输入检查

本轮重新计算34项批准文件、687项源基线，无 SHA 差异；10件当前工程 PNG 与各确切原 PNG SHA 全匹配，逐件解码 alpha>0 bbox、四边2px保护边、裁框、尺寸与 offset 均一致。准确逐件证据在 INPUT_VERIFICATION.json。奶茶及火焰 Gate2 凭据路径实存；火焰 Gate2_v0.3 明确 USER_APPROVED。walk/run00字节相同，但不合并动作ID、时长或UUID。

Pillow11.3.0只读原PSD结构：奶茶1024²有04_sign、03_roof_and_upper、02_structure_and_interior、01_front_and_ground四层；原三张body层PNG在内存合成，对当前body alpha最大差0、可见RGB变化像素0；sign源同SHA。樱花3072×1024母版有四个spirit_a_flame实例层，实例已变换，不能声称对应160²源纹理原生层。游客旧PSD缺失按已批准方案以原PNG建完整栅格层可执行；无需追索不存在的原生源。既有PSD只读，新版单独路径。

## 可执行约束

10件均按已核裁框无损裁取。保留原画布originalSize、pivot=(0.5,0.5)，offsetX=(l+r-W)/2、offsetY=(H-t-b)/2；唯一原画布恢复路线须未来Client设置CUSTOM/trim=false，不能另加手工bbox位置补偿或仅改meta宣称成功。本轮不碰工程，不把未来导入UUID写成已生成。

3072×2048新PSD是多资产资源库母版，10层位置互不重叠，最大边界不超过画布；每层须从源PNG原像素进入PSD，再从真实PSD层反向平移恢复独立原画布并导出裁片。仅保存整图参考或绕过PSD直接裁源PNG不能证明源→PSD→导出链。现有assemble代码可加载RGBA图层、fit=none、整数x/y、normal混合，不能依赖未实现隐藏组；新PSD是否零差须生产后Owner如实核验，当前NOT_TESTED。未安装psd_tools不构成阻塞，不新增依赖。

cmp-v1采用Pillow11.3.0、RGBA8直通alpha、保留sRGB值、不ICC转换；alpha独立核，alpha=0 RGB归零后核可见RGB，原透明RGB变化另列。黑/灰/白source-over按整数round-half-up；源尺寸1:1；最大alpha差、可见RGB差、变化像素均0。当前10源PNG未见ICC/gamma元数据。PNG只裁alpha=0外边，保留2px透明纹理边，不削弱半透明；本批未产图集，未来页边padding/采样、linear/mipmap及串色须实际核，不把透明2px当真实运行已通过。

生成0调用、制作60分钟+静态核验30分钟总90分钟、同问题最多2轮纠错为人工执行上限；hash漂移、需补洞/生图、任何可见差异、坐标无法保持、超预算立即停受影响支线报Master。不得因换工具重置轮次。

## 下游与证据限制

Owner后续记录真实PSD层→裁片映射、原尺寸重组、同背景同视窗同显示尺度对照及账本；缺现行场景尺度/背景证据时如实NOT_TESTED，静态投影不能冒充引擎运行。自产切图直接交用户Gate2，不设切后Art/Tech效果Review或浏览器/Creator额外前置环境。具体版本未获Gate2前Client不得接入，静态像素与本预签均不替代用户效果审批。
