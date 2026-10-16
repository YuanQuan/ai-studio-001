# 静态、导入与运行验证

- PNG身份：五张资源 SHA-256 与获批 Art CUT_MANIFEST 一致；Creator 3.8.8 导入生成的 `.meta` 含 image、texture、SpriteFrame UUID，见 `evidence/ASSET_UUID_MANIFEST.json`。
- TypeScript：PASS，Creator bundled TypeScript `tsc -p apps/client/tsconfig.json --noEmit --skipLibCheck --target ES2021 --lib ES2021,DOM`，exit 0；日志 `evidence/typescript-check-r6.log`。
- Creator：r2 运行时加载旧资源的失败记录见 `evidence/R2_RUNTIME_FAILURE.md`。r3/r4 眼睛差分框记录于 `evidence/EYE_PIXEL_DIFF_INVESTIGATION.md`，随后r6运行诊断证明节点 contentSize 为99×54，差分框不作为节点尺寸错误结论。最终r6 Creator 3.8.8 诊断构建成功，exit 36，输出781文件；正式与隔离源码哈希一致，详情见 `evidence/BUILD_MANIFEST.json`。
- 运行资源核对：Master 已确认五张获批资源的实际 SpriteFrame UUID。r6浏览器日志在配置完成与首帧各确认一次 overlay contentSize 99×54、scale 1×1；父层1536×720、scale 1×1；SpriteFrame UUID/rect/originalSize正确，sizeMode=CUSTOM且trim=false，详见 Master `evidence/r6-eye-diagnostics.json`。Master固定视窗差异分析确认背景变化仅在双眼区域。
- U01基线：静态 PASS，冻结 USER_LAYOUT.json 的53个实例 geometry/ID字段逐项一致；仅新增左右街面静态实例，合计55。眼睛运行 alpha 保存在父节点子层，不进入实例坐标。
- IAB：PASS，Master在720×1280实际运行 r6；五张资源UUID匹配；桥面左右街道遮挡/镜像正确；两眼局部亮暗变化，U01初始/重置/重入导出JSON逐字节一致且各55项；U05进入、开始和顾客入场布局保留；console warning/error为空。证据见 `deliverables/master/EXAMPLE-INTEGRATION-20261016/v0.1/IAB_VERIFICATION.json` 及其 `evidence/` 截图和数据。
- 目标设备/小游戏平台性能：NOT_TESTED。
