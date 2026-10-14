# 运行验证记录

## 当前状态

Client静态验证通过，退役后资源与前一版UnitSamples构建的Master IAB和Tech Review已通过。为同时支持Git HEAD的 `setExitHandler` 与并发工作树的公开 `onExit`，本轮仅在Gallery加入窄兼容适配；Creator内置TypeScript 5.8.2（`--skipLibCheck --target ES2021 --lib ES2021,DOM`）检查退出码0，Creator 3.8.8新构建已Finished，HTTP `http://127.0.0.1:8787/` 返回200。Master已在该新build完成定向IAB并明确PASS：重载菜单正常、U05进入/返回正常、U01完整画面和18原型/43环境/6店导出字段非空、U00新build入口画面正确；浏览器warning/error日志为空。Tech已对新adapter版完成最终Review并批准。当前提交用户审阅；正式发布QA不属于单元示例范围。

## Owner静态与构建证据

- `evidence/STATIC_VALIDATION.json`：批准资源18/18 bytes和SHA、43实例顺序/坐标/尺寸/镜像/稳定ID、五层桶、实际Creator UUID、Prefab五层与U00/U04共享消费者检查通过。
- `evidence/SPRITEFRAME_TRIM_AUDIT.json`：18个Creator实际frame rect/raw尺寸审计；16个自动trim。U00和U01都在assign frame后恢复原始完整UI尺寸。
- `evidence/tsc-unit-entry.log`：Creator自带TypeScript编译器 `--noEmit` 退出码0。
- `evidence/final-build/creator-gallery-adapter-stdout.log`：最新Gallery适配器版Creator 3.8.8 Web构建日志，明确Finished in 4s；最终输出目录、入口UUID、源身份和哈希在 `evidence/BUILD_MANIFEST.json`。Creator任务4秒完成；外层CLI exit 36伴随build-script SIGTERM退出清理记录。旧空目录与无引用meta已在本次最终构建前清理；latest BUILD_MANIFEST记录适配器构建源码身份。
- 最终loopback HTTP HEAD于2026-10-14返回200。
- 此前Tech最终Review：`deliverables/tech_lead/U00-U01-SAKURA-V03-TECH-20261014/v0.1/REVIEW.json`，结论APPROVED；最新Gallery API窄适配已由Tech增量Review批准。

## Master实际运行检查

- U00：在720×1280检查左右相机极限、连续最大缩放及复位、街景/店铺/游客显隐、游客数量变化、店铺位置与缩放调节；390×844视口也实际检查。trim露边修正后无硬边。修复版已实际检查边缘/缩放/显隐/游客/店铺调节与窄视口；最新adapter build首屏证据 `u00_exit_compat_final.jpg` 与前述已通过资源画面相同。
- U01：修复版与退役后均有全画幅基线。Master复核添加A/B树/灵焰/莲花/倒影、拖动、缩放、镜像、删除、重置、41–43分页、相机拖缩复位、返回重入。退役后 `u01_final_post_retirement_export.json` 为18原型、49实例（43环境+6店），image/Texture2D/SpriteFrame UUID各18/18非空；Tech将SHA/UUID、实例顺序与坐标独立逐项对照，零差。最终画面与编辑检查用 `u01_final_panorama.jpg`、`u01_final_edit_smoke.jpg`；早期 `u01_final_post_retirement_initial_loading.jpg` 是加载空帧，不作通过证据。
- U04：店长/表情流程与退役后首帧 `u04_final_post_retirement.jpg` 检查通过。U02/U03入口smoke为 `u02_entry_smoke.jpg`、`u03_next_shop_smoke.jpg`；最新adapter build的U05进入/返回证据为 `u05_exit_compat_entry.jpg`、`u05_exit_compat_return_menu.jpg`。最新浏览器日志 `exit_compat_browser_log.json` 为空列表。
- U01既有横屏编辑器布局会遮挡部分画布（`u01_landscape_existing_layout_limit.jpg`）；本轮主要交互按竖屏设计视口验证，未宣称全面横屏适配。

旧环境退役文件和引用扫描结果见 `evidence/LEGACY_RETIREMENT_AUDIT.md` 及 `evidence/RETIREMENT_CANDIDATES.json`。Tech设计/Review见对应Tech交付目录。

## 未测试指标

DrawCall、动态合图、GPU驻留、目标机FPS/内存、原生与小游戏平台均未实测。RGBA8源图全图面估算约31.45 MiB仅为估算，不是性能PASS；IAB中观察的App总体内存/帧率不得归因于本套背景。