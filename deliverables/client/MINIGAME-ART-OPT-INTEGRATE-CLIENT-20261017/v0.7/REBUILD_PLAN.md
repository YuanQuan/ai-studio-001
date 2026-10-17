# v0.7 U01拖动后按钮状态修复重建计划

根因与边界见 `deliverables/master/MINIGAME-ART-OPT-BATCH-20261017/v0.1/U01_DRAG_LIFECYCLE_FAILURE.md`。本次只改变U01 button helper在触摸结束/取消时的指针和drag状态清理；Gallery 源继续SHA `e403e97715f2f4fd7dfba60482fd39a62fac9a9017c7050b70803dac100214b3`。U01新候选SHA `ee3bf82a3a0426f72881f496c35c3bddaf8f7d9a0c0fac2d62da96c9480f8042`，Galleryv0.5 manifest SHA `db9ebf650c2ea0835fee9c6b9a636b8e49a88c49570f28a7cea9b2bebd378eac`。

## v0.6事实保留

v0.6三平台CLI、八个真实原生分包、菜单/游客/U01方向/U00双向拖动+关闭、U05正确流程2/3及退出均保留此前实证。U01在调节面板拖动后直接点击关闭失败，v0.6整体验收保留FAIL。错标的U00图实际为U01，只有 `U00-panel-real-up-drag-320.jpg` 与 `U00-panel-after-close-320.jpg` 代表U00。

## 已生成v0.7候选

Staging为 `/private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix`，STAGING_INPUT_MANIFEST SHA `a9e9b81a641e544ac859e9aadf22d3cdf7fb90305224f4dd5b839ab4248bbc24`，OWNER_SOURCE_OVERRIDES SHA `d8e81b9c4ed88c89ac479589aef4052c20e5470d73077c78ced3e1dced4ee332`。必须传第二个参数显式绑定该override：

```sh
node apps/client/tools/asset-integration/build_staging.cjs \
  /private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix \
  /Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/client/MINIGAME-ART-OPT-INTEGRATE-CLIENT-20261017/v0.7/OWNER_SOURCE_OVERRIDES.json
node apps/client/tools/asset-integration/generate_build_configs.cjs /private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix
node tests/client/asset-integration/asset_integration.test.cjs /private/tmp/minigame-art-opt-integration-staging-v0.7-u01fix
node deliverables/client/MINIGAME-ART-OPT-INTEGRATE-GALLERY-20261017-CLIENT/v0.5/tests/u01_button_gesture_probe.cjs
node deliverables/client/MINIGAME-ART-OPT-INTEGRATE-GALLERY-20261017-CLIENT/v0.5/tests/scroll_direction_probe.cjs
```

上述命令均通过。Root将staging复制到 `/private/tmp/minigame-art-opt-integration-final-v0.7-u01fix`，复制后重生build configs，再按各平台configPath构建Web、微信、抖音。IAB验收至少覆盖：拖动后直接点关闭应成功；拖动末尾不触发按钮；TOUCH_CANCEL后END不触发；下一次新tap恢复正常。页面其他验证不得仅凭v0.6推断通过，v0.7未执行项写NOT_TESTED。