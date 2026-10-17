# U04 v0.3 六阶段表情接入审核包

已按用户批准的 Art v0.3 接入 MT_S2、AT_S0、AC_S0、AJ_S2、AD_S0、XJ_S0 六组，共 30 个表情及对应 base/front。42 张目标 PNG 与 Art manifest 源 SHA 一致，稳定路径和 UUID 保持；其余 60 个表情不在本轮修改范围。

Creator 3.8.8 v2 web-mobile 新构建输出五个所需 bundle，42 张资源均以原 UUID 和原字节进入 dialogue bundle。构建索引 SHA-256：`02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d`（以 `BUILD_CHECK.json` 当前记录为准）。

实际运行入口：<http://127.0.0.1:8765/>。Master已完成实际Web验证：30新态逐态切换、九处圈选/共享层检查、90/90整体巡检0失败（7042ms）、三轴保留、快速切换、一次返回重入、390×844窄屏检查，且v2 reload后warning/error为0。Master完整运行结论及52张截图SHA见 `deliverables/master/U04-EXPRESSION-INTEGRATION-20261017/v0.1/RUNTIME_VERIFICATION.json`；本交付运行索引见 `RUNTIME_CHECK.json`。

已知边界：当前只构建并检查 web-mobile；未测试小游戏平台、原生平台或目标设备性能。v1 首轮构建的 bundle 路径错误及失败证据保留于 `evidence/build-v1-failure/`；当前审核目标是独立 v2 恢复构建。
