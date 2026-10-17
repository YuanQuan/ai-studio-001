# 压缩批次与QA计划技术评审 v0.1

结论：APPROVED，当前技术任务交Master内部接受。完成工具事实、同SHA首图前预签、首三件技术扩余三确认、QA v0.2计划评审及授权隔离导入诊断。不是样本效果批准、正式接入、正式QA执行或平台发布通过。

## 首图前与生产范围

TECH_PRESIGN绑定Art唯一BATCH_PLAN SHA `a6bc70139a292edfa241235a3cf28666fc2174e3d7e7a08e8e475f83b9c1ef23`，Art同SHA签名已核，用户Gate1批准链完整。6源/PSD文件/decodedRGBA/源码及字体权利文件SHA独立核一致；只读存在性核查不等于PSD重组重新渲染。

Pillow11.3.0 PNG optimize/compress_level9，cwebp1.5.0 lossless/exact/m6/q100/metadata icc，dwebp1.5.0 PAM与Pillow WebP双解码；六源untagged、不注入profile/不转换、全RGBA含alpha0零差。人物/字体最终实际尺度投影仍NOT_TESTED，不能记完整效果PASS。沿用6件/12当前无损候选/最多18+6参考、150人分钟、0生成、2轮约束；quality95平台透明管线条件未满足，不解锁。

首三件天空、招牌、游客的6候选已独立核SHA、尺寸、全RGBA、ICC与字节，均零差且省字节，BATCH_EXTENSION_CONFIRMATION允许同批余三继续。此为技术事实确认，不是切图效果专业复审；新样本由用户对具体版本Gate2后才可正式接入。

## QA具体计划

QA v0.1 CHANGES_REQUESTED历史保留；v0.2四文件及4个实际受控脚本SHA已核，QA_PLAN_REVIEW_v0.2.json为APPROVED。18用例覆盖冻结v08，F05正确区分U00 cover非预期露底与U01获批contain留白；受控TS、真实compiled+stub及真实Web证据不混淆，入口/命令/冻结副本绑定和性能缺接口明确。

FUNCTIONAL本地Web与RELEASE平台/设备/DPR分离；DEMO001未批55FPS/p95/5秒不套用，资源20循环五项归零按既定目标。其他性能缺指标或预算不判达标，不把它虚构成整体功能隐形阻塞。QA v0.2具体计划仍需用户批准，当前没有正式QA执行/TEST_REPORT，不沿用旧Owner PASS冒充QA。

## 授权Importer/native诊断

严格按Master IMPORT_DIAGNOSTIC_AUTHORIZATION在两个普通临时副本中仅替换3PNG或将3PNG换为同UUID/meta的WebP；未改正式工程、原stage/final、源PSD或客户端代码。项目和完整记录见IMPORT_PROBE_SETUP/IMPORT_DIAGNOSTIC。

Creator3.8.8两个副本各Web、微信、抖音共6次调用，均exit36且实际日志Finished；18条native文件检查均命中准确UUID与SpriteFrame路径，字节/SHA与相应候选一致。PNG三端均PNG magic，WebP三端均RIFF/WEBP，没有重编码为PNG。meta image/frame UUID与library的rect/offset/originalSize/rotated/capInsets同现行导入baseline；原始导入仍裁片尺寸/零offset，不能说已持久保留原画布；既有派生reset路线不变。

|仅3件替换后的物理目录字节|PNG|WebP|
|---|---:|---:|
|Web|38,521,124|38,061,702|
|微信|38,557,767|38,098,345|
|抖音|38,532,113|38,072,691|

只记录真实3件文件及目录收益，不外推全库、不宣称20MB/MiB达标、上传或GPU收益。诊断墙钟2026-10-17 09:15:35至09:19:58 UTC，约4分22秒；不是整批人工制作耗时。原方案Tech35分钟内，未安装依赖、未制作新编码候选。

工具噪声如实保留：PNG-TT启动stdout出现用户全局Editor layout.json暂时JSON读取错误；WebP-WX builder debug记录子进程SIGTERM。均有完整Finished/36及实际文件身份验证，不报零错误；未打开/修改原工程或修用户偏好。日志原件已归档，不用旧产物冒充。

## 未测与下一门禁

本次未HTTP/IAB运行新候选，未正式接入、未执行QA；小游戏基础库最低版本、DevTools/账号上传、真机解码/颜色透明采样、DPR/GPU/性能均NOT_TESTED。Creator桌面Importer和三端打包通过不能推出这些通过，也不解锁有损诊断。隔离诊断不是送样本前的新预览门槛。

Master可接受本Task技术交付并呈用户QA v0.2具体计划；样本按原Gate2流程送审。人物/字体投影补证需真实版本化，重大方法差异复签，不新增用户预案Gate。Task交REVIEW，不提前DONE。
