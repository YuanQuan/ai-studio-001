# U01 五层重绘｜工具与失败证据审计 v0.3

日期：2026-10-08。上游 Gate1 `U01-FIVE-LAYER-REDRAW-PLAN-001 v0.3` 的审批记录为 `USER_APPROVED`，批准画布3840×1024及新构图、五层边界；本审计不把方案批准当作具体图片 Gate2 批准。

| 证据 | 实际结论 | 对本轮方法的影响 |
|---|---|---|
| `v0.2/source/sample_complete_s01.png` | 原始 2172×724 RGB；SHA-256 `3cc1e03883cb1712282aea4ada33ec4576b770e46514f9b526abb4953b295b52` | 旧2172×724参考下，整图未达到目标原生画幅。只留失败历史。 |
| `v0.2/source/sample_complete_s02.png` | 原始 2172×724 RGB；SHA-256 `918fc25a0d9231a60bda7e6c8ff65e6a0288c62f9d0c4e392172b3556358e73f` | 输入已是3840×1024透明宽参考仍返回2172×724；重复要求整图尺寸缺新依据。 |
| `v0.2/evidence/TOOL_TEST_REPORT.json` | 指定 bggg 原版 `assemble` 用旧图临时测试写出3840×1024四栅格层PSD；Pillow回读尺寸/层记录通过。测试曾用 `stretch`，仅证明文件能力。 | 本版只用 `fit:none`、原生分区原位放置；不把试验拉伸结果作资源。五层真实PSD、Photoshop GUI和运行均待检。 |
| 当前 `imagegen` skill 与工具接口 | 内置工具可生成/编辑图像，接口无尺寸参数；默认输出存于 `$CODEX_HOME/generated_images/`，须复制入项目并核原图。CLI/API备用路线需用户明确选择。 | 仅用内置工具进行本次S03/S04试产；不读密钥、不转CLI/API、不降模型。两次尺寸样本不证明2172×724恒定；S03仍须读实际尺寸。 |
| 当前 `bggg-creator-image2psd/scripts/image2psd.py` | 原版 `fit:none` 保留源尺寸，`place_on_canvas` 按x/y原位alpha叠放；指定脚本 SHA-256 `af7217e0f3dad1edaf7eb4017c717cc49c6ce45d35be88a00c0d2f284b390ebd`；MIT LICENSE已核。 | 可作为分区临时拼接/最终栅格PSD组装器；不会自动消接缝、补洞或创造高频细节。禁止把粗拆层冒充原生可编辑笔触。 |

本版生产假设：原生 2172×724 分区可通过“局部窗口”提示词获得新绘细节，五个窗口以 1:1 覆盖3840×1024；接缝依赖内置图像编辑与实图审查。**目前未实证该假设成立**。S03先验尺寸、构图和细节，S04再验一处真实接边；失败即停。所有临时分区、合成预览与正式五层在文件名和交付状态上分开。
