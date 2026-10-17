# 五张代表样当前版本技术检查（第六张 AJ 待产）

本记录核实际落盘文件，不改变原预签和Gate2门禁。PSD用 ImageMagick 读取真实层可见标志/层几何，并用 Pillow 读取PSD内嵌合成与各自预览逐像素比较；RGBA检查按实际源画布与报告绑定路径重新计算。Art视觉判断仍由Art/Master记录。当前五张只是各自代表态，**尚未形成六样整体通过或余24态扩批复签**。

| 样张 | 当前PSD SHA-256 | 实际层和尺寸 | 当前样张静态结论 |
|---|---|---|---|
| AT_S0 sad | `8f864a57b42ccda169431ee279bb5288918cc64faea005521a23bce24b86a556` | 1024×1536；旧五态15层隐藏；新sad六语义层、base、front可见；face 256×256 RGBA | 原脸源框 `[380,180,636,436]` 外现行显示基准RGBA 0差；新oneface/前发静态检查通过；PSD内嵌合成与预览RGB逐像素0差。送核快照见 `sample_snapshots/AT_S0_SAD_20261017/`。 |
| MT_S2 surprised | `89b11d7a31befbdfb835cbf4c6409aac74fc06d69ad89bf0db5b4b28f73717dd` | 1024×1536；旧五态15层隐藏；新surprised六语义层、base、front可见；face 256×256 RGBA | 源框 `[360,100,616,356]` 外原base/front现行可见RGBA和alpha 0差；front沿用原版，未做额外擦除；PSD合成与预览0差。已看 `review/u04_mt_s2_surprised_recomposed.png` 同尺度图。 |
| AC_S0 angry | `6a337e0d4e182a079e88e48cf92f0f9e309e496de790a1a3cd2806e619a5f98f` | 1024×1536；旧五态15层隐藏；新angry六语义层、base、front可见；face 256×256 RGBA | v06基础修补定义 SHA `dcee069e82e8509d7f0c9fef5311ab6801657df581eada7448669bd43ae74319`；原base/front对派生图在源框 `[350,95,606,351]` 外原始RGBA各0差；feature_extract_02语义重组/Art mask外差均0；PSD合成与预览0差。`review/u04_ac_s0_angry_u00_same_scale_1280x720.png` 才是本项同视窗图，早期fullbody概览不作为同尺度证据。 |
| AD_S0 happy final02 | `df6a9d958ed856c984c364b3caffd7c075d6225a518faa4f564b889342473880` | 1024×1536；旧五态15层隐藏；新happy五语义层、base、front可见；base 768×768、face/front 192×192 RGBA | 基础修补base/front在源框 `[310,185,566,441]` 外原始RGBA各0差；导出offset `[232,139]`，沿用0.75缩放；PSD合成与预览0差。已看U00 1280×720图，未见面部接缝。 |
| XJ_S0 happy final03 | `787cf54c93a859453275f7ee8f7e1e14c135e3975e8386f5d2911200a75bf7df` | 1024×1536；旧五态15层及历史front隐藏；新happy四语义层、base、唯一新front可见；base 768×768、face/front 192×192 RGBA | 基础修补base/front在源框 `[330,223,586,479]` 外原始RGBA各0差；offset `[248,167]`、缩放0.75；PSD合成与预览0差。镜片环和前发只在唯一front显示，详见下段。 |

以上PSD合成核验针对五个当前文件的**当前可见层**。五个新态全量完成后仍须逐态切换验证PSD互斥；不能把旧15层隐藏和本张新层显示推断为未来全五态已通过。PSD预览与内嵌合成RGB最大差0，不说明与其他缩放/重组路径最大差2/255的来源；后者可能是重采样或舍入，需按相同解码和尺寸另核。

## ROI、接口与小锦镜片

MT、AD、XJ的新源画布与原base/front叠图在各自脸源框外比较：alpha改变0，所有alpha可见像素RGBA改变0；零alpha隐藏RGB可能因合成时归零，不把其当作可见画面改变。AD/XJ基础修补原输入base及front与派生文件在框外原始RGBA分别0差。AT此前已独立重建现行旧显示基准，脸源框外原始RGBA0差。AC v06原base/front与派生图在框外原始RGBA各0差。五份均仍保持base→oneface→front；AD/XJ原生脸源256导出192，未将256纹理误作客户端导出。

小锦 `review/final02/xj_s0_front_only_03.png`、`xj_s0_base_face_no_front_03.png`、`xj_s0_base_front_no_face_03.png`、`xj_s0_optics_annulus_isolated_03.png` 已逐张打开，并与获批 `inputs/xj_s0_approved_face_256.png` 对照。front单层中央眼窗透明；瞳孔/眼睑来自base+当前oneface一侧，去face后眼窗无旧眼形。左镜内上沿暗斑及右外沿灰线位于获批原图同位置的镜片折射环，隔离annulus仍保留，不能仅凭深色认作残留瞳孔。front02→final03实际仅18个mask内像素alpha改变，RGB不变，mask外RGBA0差；这18个旧肤色碎点已经定点清除。当前 happy 可独立显示，后续四态需各自新眼形与同一唯一front重组核验，不能沿用本张眨眼形。

AD/XJ 的U00图不只是1280×720像素规格：已向负责Art核实并对照既有 `deliverables/art/U04-DIALOGUE-LAYERED-ASSET-001/v0.1/source/pipeline/validate_batch.py` 第46–75行。既有阿灯/小锦路径把当前768×768原生三层合成整体缩至570×570，贴于 `(10,150)`；背景取 `current_shops_on_v03_scene.png` 的 `[360,0,2180,1024]` 并缩至1280×720，九宫格对话框在 `(0,525)`。这与两张final U00图的肖像位置、比例相符；与MT/AT使用1024源图裁剪到614×510的路径不同，属于各自既有显示映射。静态图仍不等于Client运行截图。

## 未完成边界

AJ_S2 happy 实图、PSD、正式切片及U00同尺度尚未齐，记 `NOT_TESTED`；五张结果不代替六样总通过。所有样张的Client正式导入、目标机性能、DrawCall仍 `NOT_TESTED`，需Gate2具体切图版本用户批准后按适用流程处理。本轮不签余24态扩批。
