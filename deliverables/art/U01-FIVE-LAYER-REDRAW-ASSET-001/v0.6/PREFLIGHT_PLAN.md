# U01 3072×1024 五层正式资源｜同源导出预案 v0.6

用户已明确“采用3072×1024方案吧”，见 `project/DECISIONS.md` 的 `DEC-U01-CANVAS-3072-013`；历史 Gate1 v0.3 的五层、河前街后、天空/街/水占比等视觉语义继续适用，原3840宽由最新决定覆盖。本轮**不重新生图、不做两翼、不补新物件**。源是 v0.5 `review/candidate_3072_five_layers.psd`（SHA-256 `cb6dd00c99a2082d59d2ea0e4dd494185c768b15190dde29e5eec966cb49ccac`）、其五张 `candidate_3072_layers/` PNG、`candidate_3072_overall.png`（SHA `b619206178157ea86bbadfa1ed33b59e5d478852dd3431a38c556ae557ee51da`）及 `candidate_3072_manifest.json`。原始中心生图尺寸/提示词/来源在 v0.5 `source/GENERATION_LOG.md`，本版只复制同字节为正式命名，不修改像素。

导出前 Art、Tech 对本预案及工具审计**同一SHA**预签。签后：将已核候选 PSD 复制到 `source/u01_five_layer_master.psd`，五张同尺寸 PNG 按 L01–L05 映射复制到 `exports/tex_street_base_01_l0*.png`，候选总览同字节复制为 `review/overall_from_psd.png`。PSD的五层为独立栅格图层，顺序天空→山→柳/后岸街/右牌楼→桥/河/栏/船→河前近草；候选视差0.3/0.8/1/1/1由客户端接入后核。全层共同坐标3072×1024、中心锚点，禁止裁框后居中。原四层的未知遮挡区域全部保留，不做无证明透明优化。五张RGBA8基础展开量3072×1024×4×5=62,914,560字节=60MiB；实际打包/运行待Client/Tech测。

Art核正式文件的字节hash=对应候选、各图3072×1024 RGBA、PSD回读五层、图层映射、L04隐去L05时水岸连续、L05只含水前草。以正式五PNG重组的同尺度画面与原候选总览逐像素/实图核；手机静态竖屏中心及两端裁窗只作**图像视窗证据**，不能冒充Creator运行。记录源/正式路径、hash、母版可编辑范围、视觉锚点和Client正式路径计划，未导入UUID标计划。组织自行切图，实图及清单齐备后**直接交用户 Gate2 审核**；Gate2通过前Client不接入。单元示例不分派QA。
