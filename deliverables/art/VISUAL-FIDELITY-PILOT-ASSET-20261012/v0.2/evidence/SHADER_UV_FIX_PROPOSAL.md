# 灯笼 UV V 坐标单变量修正提案

状态：`PROPOSAL_ONLY_NOT_APPLIED_NOT_AUTHORIZED`

记录时间：2026-10-12 22:06:42 +08:00
目标文件：`apps/client/assets/labs/lantern-pilot-v02/lantern_lighting.effect`
绑定当前源 SHA-256：`e86347bec50486ebbd40366870c25eb4619db984d4b7a146a75385b1e9a82f0b`
依据评审：`evidence/SHADER_EXCEPTION_TECH_REVIEW.md`，SHA-256 `ea574b5faaa3cde76e5f82352adf644f004bd824bc7572ee07def5655622bef3`
截图差异证据：`evidence/build/runtime-screen-difference.json`，SHA-256 `a053662c517a53170ded38b95c66658405a5b0958b38ad16b3d06fc2ef3b66e8`

## 实测问题

当前 effect 已在 Creator 3.8.8 重导入，三个片元变体均含匿名 `Constant` 块及直接 `strength` 成员访问。绑定该源 SHA 的第二次 Editor 构建在 2026-10-12 21:45:07 完成，实际 HTTP/浏览器产物已加载店铺和控件。固定 1280×720 视窗中，播放亮度约 0.93 时店铺裁剪有 929 个 RGB 像素变化，最大通道差 30，变化框为 `[527,255,561,289]`，位于目标灯笼上方屋檐区域；暂停与复位相对同一基准截图均为 0 个可见 RGB 像素变化。因此动态目标 ROI 判 `REVISE`，整体运行不通过。以上证据不证明 alpha 与源像素完全相同。

同版 Creator 3.8.8 SpriteFrame 未旋转全幅 UV 定义和当前变化位置共同支持 V 方向可能反转的诊断。候选补丁只将 `bodyPx.y` 从 `(1.0 - uv0.y) * 1024.0` 改为 `uv0.y * 1024.0`，保持 x 映射、mask UV、采样、颜色、alpha、动画、Scene、TS 和图片不变。该候选只允许验证一个变量；屏幕变化还可能受到实际 UV 角点、纹理方向、trim/atlas、缩放和采样等影响，**不能保证只改这一行即可让动态 ROI 通过，或清除全部差异**。Tech 明确要求依实际 frame UV 和输出定位点再核。

补丁见同目录 `SHADER_UV_FIX_PROPOSAL.patch`，SHA-256 为 `d78a5c2af2a78e213c45494d149785d24fed11d93af0843550af049964213a8e`。它以当前 effect SHA 为基准，已由 `git apply --check` 只读检查通过；补丁未应用、未编译、未构建。

## 权限与预算

用户授权的语法修正例外已使用，累计修正预算为 `3/3`。这份候选不属于原语法授权，也不会自动获得当前预算。只有 Master 提交该单行具体提案、用户明确授权新的修正预算，并完成受影响 Art/Tech 续签后，才可考虑应用；授权前不得修改 effect 或重跑源码修正。静态 `git apply --check` 仅说明补丁可匹配当前源文件，不是用户批准、编译结果或运行通过。

## 后续检查边界

若日后获批执行，只能应用此补丁所列一行作为一个新修正轮次。应基于新的源 SHA 重新导入/构建和检查实际画面，比较已批准灯笼 ROI、mask 外区域及可见 RGB；暂停/复位仍与同次基准比较。若动态变化仍在屋檐、超出 mask，或出现新的源码缺陷，停止并报告，不在本提案中叠加第二项修改。Draw Call、mask 实际 GPU 格式/内存、CPU/GPU 计时和 alpha 均保持独立验收；现有截图与评审没有测量它们。
