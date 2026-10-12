# 灯笼 Shader 例外执行与运行结果

状态：`CREATOR_IMPORT_BUILD_PASS_DYNAMIC_ROI_REVISE`

## 语法修正与 Creator 导入

本批唯一授权的语法修正已于 2026-10-12 21:29:14 +08:00 应用一次。当前 Effect `apps/client/assets/labs/lantern-pilot-v02/lantern_lighting.effect` SHA-256 为 `e86347bec50486ebbd40366870c25eb4619db984d4b7a146a75385b1e9a82f0b`；修正前副本 `lantern_lighting.effect.original_before_shader_exception_20261012` 保留原 SHA `ba0dbf42329a025d38831440ef667c337b27543862c92fbb2d1d1cf64a105069`。

Creator 3.8.8 对该 SHA 完成正常重导入。库载荷 SHA 为 `3ab7e5d6b7cef0632d43c14df9bda330861475f4969dc93f8d33e0fc19c0b4c0`，核到三个片元变体均使用匿名 `Constant` 块和直接 `strength` 成员访问，无 `cc_lantern`。因此这项语法修正的导入/片元编译证据为 `PASS`。

正常重导入使 Effect `.meta` 从 `imported=false`、无已导入 `.json` 文件变为 `imported=true`、`files=[".json"]`。导入前记录的 `.meta` SHA 为 `3a91e3e0648fb5cae8a55c755fae9826e1ed00a518782b576979da6867c84dbd`；最新 `.meta` SHA 为 `37b411ba0e401e00a355939d2b29c4c84ac622f503495063f797c4df5e4e707a`，UUID 仍为 `e334c0c0-4d86-4bc0-9edf-a44cc80dd8da`。这是 Creator 导入产生的元数据变化，单独记录，不视为未变。

## 构建与实际画面

首次 Editor 构建虽然显示 Finished，但其浏览器启动请求 Effect import JSON 返回 404，故该次运行 `BLOCKED`。第二次同一隔离配置的 Editor 构建于 21:45:07 完成；记录的任务 ID 为 `1791812092559`，构建包内含当前语法修正的 Effect，HTTP 地址 `http://127.0.0.1:8788/` 实际加载店铺和控件。第二次导航记录到场景加载成功且当前导航控制台错误为 0；旧首构建的 404 保留为历史错误，不混算为第二次导航错误。临时 build/cache 和该运行 tab 已由 Master 按独立记录清理。

固定 1280×720 截图与店铺裁剪 `[490,210,770,430]` 的像素比较结果：

- 播放强度约 `0.93` 时，裁剪内有 929 个 RGB 像素变化，最大通道差 30，变化框 `[527,255,561,289]` 落在屋檐/屋顶区域，未落在目标灯笼。
- 暂停和复位各自相对同次静态基准均为 0 个可见 RGB 像素变化，最大通道差 0。这只证明该截图区域的可见 RGB 一致，不证明源 alpha 或解码像素完全一致。

因此目标动态 ROI 为 `REVISE`，不能将完整效果判为 `PASS`。Draw Call 增量、mask 实际 GPU 格式和常驻内存、目标设备 CPU/GPU 时间、alpha 逐像素一致性仍为 `NOT_TESTED`。

## 未授权的 UV 候选

Tech 的只读评审结合 Creator 3.8.8 frame UV 定义和实际变化位置，认为当前 `(1.0 - uv0.y) * 1024.0` 可能纵向反转。已准备 `SHADER_UV_FIX_PROPOSAL.md` 与 `.patch`：补丁仅将 `bodyPx.y` 改为 `uv0.y * 1024.0`，绑定当前 Effect SHA `e86347bec50486ebbd40366870c25eb4619db984d4b7a146a75385b1e9a82f0b`。补丁通过只读 `git apply --check`，**没有应用，也没有重新编译或运行**。它只用于之后验证一个变量，不能保证单行调整可解决全部位置/采样差异。

语法修正例外已经用完，累计预算为 `3/3`。UV 提案不属于原批准范围，也没有获得新的用户授权或 Art/Tech 续签；不得据此修改 Effect。若用户另行批准并完成所需续签，后续最多按获批范围验证该单变量；发现其他缺陷或目标 ROI 仍错误时停止并报告。

详细时间、源/产物哈希、导入前后 `.meta` 身份及各证据状态见 `SHADER_EXCEPTION_EXECUTION_LEDGER.json`。历史 `EXECUTION_LEDGER.json` 和原 Art/Tech 预签保持只读。
