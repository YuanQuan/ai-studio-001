# 客户端实现报告：U00与U01用户布局参数更新

状态：REVIEW。Root已在同一构建上完成Codex内置浏览器检查。U01初始、临时调整/重置、返回重入三份实际导出与冻结53实例/21原型JSON完全相等；U00初始、恢复、重入三份六店导出均有5个目标字段逐店完全相等。U00新增树、桥、花灯区域和旧U04共享背景已实看，warnings/errors为空。完整证据见Master `IAB_VERIFICATION.json`、`HTTP_IDENTITY.json`及Client运行比较；保持REVIEW等待Master/Producer流程收口。

## 实现结果
新增 `apps/client/assets/labs/u01/sakura_user_layout.ts`，从Master冻结JSON生成53实例profile并保留完整的用户字段；增加的 `layer` 只用于匹配现有五层背景结构。新增数据模块拥有Creator `.meta`。U01布局编辑器从profile创建环境和六店实例，按 `orderBottomToTop` 排列，沿用原有编辑、导出、重置和离开重入流程。页面分页按47个环境实例生成，末页范围为41–47。

`populateSakuraV03`增加可选profile。U00 overview传入冻结环境profile，将位置、缩放、镜像和层序投影到已有背景层；缺省调用保留原默认参数。UnitSampleGallery中的U04对话入口仍为无profile调用。U00六店沿用既有Prefab和实际 `ground_contact`，初始脚点由冻结top-left、尺寸、scale和接触点换算；镜像与次序采用冻结值，面板导出增加 `mirror` 与 `orderBottomToTop` 便于核对。

## 变更与资源范围
源码限于 `UnitSampleGallery.ts`、U01 `sakura_v03_environment.ts`、`sakura_layout_editor.ts`，以及新增 `sakura_user_layout.ts`/`.meta`。未修改共享 `sakura_v03_layout.ts`、Scene/Prefab、图片、既有meta、UUID或第三方依赖；21张冻结原型的图片字节、image/texture/spriteFrame UUID均逐项核对通过。详细参数映射见 `evidence/PARAMETER_STATIC_VALIDATION.json`，资源范围见 `evidence/RESOURCE_SCOPE_VALIDATION.json`。

## 验证
冻结输入 `USER_LAYOUT.json` SHA-256为 `094365e576c948009a04ffdd0c20a9829171c45f642ffaa5ff80a6366842537d`。静态检查覆盖53个唯一实例、21个原型、全部冻结参数、Cocos中心坐标投影、两棵新增树的 `L03_Ground` 映射及六店脚点，结果PASS。Creator捆绑TypeScript 5.8.2 `tsc` exit 0。

Creator 3.8.8隔离工程只含本次当前assets、settings、profiles及Library，明确构建 `db://assets/UnitSamples.scene` / UUID `01e65005-5a46-45a1-9a16-820ac4b919ae`。本次有效 `web-mobile`构建的官方结束标记为 `build Task (U00-U01-USER-LAYOUT-CLIENT-20261015-v0.1) Finished in (28 s)ms`，exit 36；结束标记、CLI输出/退出码、源码同步身份、config SHA及六个入口文件SHA见 `evidence/BUILD_MANIFEST.json`。初次普通沙箱调用在构建前退出-6且没有输出，Recovery日志和不可靠墙钟时差说明独立保存；不把该失败调用计为有效构建。

本次实际产物在验证期间由loopback HTTP `http://127.0.0.1:60440/`提供；Root确认IAB/HTTP后，Client已停止本任务启动的临时服务。服务PID、目录和停止记录见 `evidence/HTTP_SERVER.json`。Root已通过内置浏览器在同一产物执行U01三阶段、U00三次六店导出及U04共享默认兼容检查；IAB和HTTP身份记录均为PASS、warnings/errors为空。Client独立比较结果见 `evidence/RUNTIME_EXPORT_COMPARISON.json`，Master原始证据见 `deliverables/master/U00-U01-USER-LAYOUT-20261015/v0.1/IAB_VERIFICATION.json` 与 `HTTP_IDENTITY.json`。未测试目标设备、GPU或小游戏平台性能，不把Web运行等同这些平台结论。

## 性能影响与限制
新增profile查找及Node创建只在原有U00/U01页面初始化流程中执行，不增加图片、资源加载种类、循环更新或第三方库。U04保持默认调用路径。浏览器运行结果待Root补充后，Client交付进入最终Review。
