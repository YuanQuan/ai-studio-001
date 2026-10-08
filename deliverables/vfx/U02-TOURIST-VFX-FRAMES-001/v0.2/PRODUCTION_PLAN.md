# U02 四动作序列帧制作方案 v0.2

本批编号 `U02-VFX-A`。用户于 2026-10-08 确认四动作样张，并明确授权替换正式 U02 动作资源；本方案继承该方向和制作授权，具体输出 PNG 仍待 Gate2 审核。首张正式导出前须由 Art、Tech Lead 对本方案同批预签。

## v0.2 定向修复

v0.1四代表帧中sad05脸层矩形边界出现细暗缝，Owner实图核对为REVISE，未扩批。原因是脸孔洞与脸层的互补透明覆盖经过独立旋转和LINEAR采样后，再以source-over叠加，使边缘半覆盖变为约0.75而非完整覆盖；实际内缝alpha由原253降至190..194。

v0.2只把sad独立脸层最终Canvas合成改为 `globalCompositeOperation='lighter'`，互补预乘颜色和覆盖相加，之后恢复source-over。源图、Shader、网格、脸部刚体矩阵、颈部过渡、全部姿态和节奏不变；walk/run/happy不受影响。旧v0.1与失败证据保留。本版诊断PNG只写diagnostics，不进入frames，不可Client消费；正式v0.2仍需Art/Tech确切字节复签、代表实图核对和具体PNG用户Gate2。

## 来源与边界

读取 `deliverables/art/U02-TOURIST-ASSET-001/v0.1/source/psd_work/` 下 `walk_00`、`happy_00`、`sad_00` 的五层透明源图；对应现存正式 PSD 为 `batches/U02-FULL-A/formal/source/tourist_body_master.psd`、`tourist_happy_keypose.psd`、`tourist_sad_keypose.psd`。原型 `motion.js` 与 `emotions.js` 为动作基线；保留原文件，只在独立导出服务中注入只读缓存暴露接口。不得使用旧 `run_00` 的不同姿态源。来源与版权沿用已批准 Art 来源记录，无新增图像、字体或外部参考。

保持主体轮廓、视角、材质、明暗、色彩与表情。Art 仅提供静态图和动效描述，VFX 负责动作。沮丧脸层使用完整刚体旋转和平移，五官不进入柔性网格。帽、眼镜、手环继续使用独立配件，不烘焙进主体。

## 工具与输出

使用与已确认原型完全相同的浏览器 WebGL Shader：移动 8px 网格、情绪 4px 网格；保留 LINEAR 采样、premultipliedAlpha 和 Canvas PNG 输出。独立本地服务仅监听 `127.0.0.1`，正式写入限制为本目录 `frames/ug_ghost_01_<action>_<00..09>.png`。保存使用排他创建，拒绝覆盖已有输出。图像全 512×512 RGBA 透明、不 trim、不缩放、不加背景、不居中重排。

每动作10帧，总40个身份文件；walk/run共用完全相同的10个像素姿态，run只缩短帧时长至一半。walk周期4000/3ms、run2000/3ms、happy1400ms、sad2800ms。源、原型、旧正式资源与 Client 目录在制作前后比对 SHA。

## 挂点与重组

以获批 `FRAME_MOUNT_MANIFEST.json` 的 walk_00/happy_00/sad_00 静态挂点作为源坐标。逐帧使用同一 Shader 的三角网格顶点变换与重心插值，输出 head、face、wristNear、wristFar；run采用walk源点与变换，不沿用旧run挂点。foot=(256,440)是固定逻辑地面锚点，不能随跳起下移，否则会抵消跳跃；另记主体变换脚参考点以说明视觉位移。保留原向右、左向整组镜像、帽/眼镜front、手环back_and_front合同。输出挂点局部旋转/缩放作为新增可选资料；Client消费变换需后续技术接线验证。

交付40帧接触表和512px同尺度主体/独立配件重组代表帧；后者不修改主体PNG。核alpha边界、无画布裁切、walk/run哈希一致、挂点alpha及脸部刚体数学证据。预估原始RGBA 40MiB（walk/run复用后30MiB），无mipmap；PNG实测体积与实际Creator纹理/合批/设备性能后续测量。低端机优先复用walk/run纹理，不擅自减帧或改变动作。

## 门禁和限制

Art/Tech按确切工具字节预签后，第一阶段只导出walk00、run00、happy04、sad05四张代表PNG。VFX运行 `finalize-export.mjs --representatives`，解析实PNG颜色类型/alpha/边界/挂点，生成静态源、确认GIF与实帧同画布对照，以及黑/灰/白背景、左右镜像独立配件重组；VFX查看实图并在REPRESENTATIVE_CHECK.json记录视觉核对后才允许第二阶段续导其余36张。服务在每张非代表帧写入前核代表核对PASS，缺证据拒绝扩批。全批完成后运行finalize生成正式清单与重组。该代表核对是Owner内部制作验证，不新增用户或切图效果专业审批门禁。

Agent自行导出提供清单与重组后直接交用户Gate2审核，不设置额外切图效果专业复审门禁。VFX_REVIEW为文件与动作合同核对，不是用户批准。Client资源导入、Prefab/Scene接线、实际Web运行与正式QA均属后续任务，标为NOT_TESTED。
