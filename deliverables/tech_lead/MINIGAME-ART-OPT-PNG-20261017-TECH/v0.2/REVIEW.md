# 六PNG技术评审 v0.2（进行中）

保留v0.1原始CHANGES_REQUESTED。本轮已复核生成工具身份绑定修订：固定identity及用户授权文件SHA，逐项绑定六稳定ID、源/候选路径及SHA、尺寸、UUID和geometry；该首轮核心发现关闭。

独立执行validator正例及七个负例，8/8符合预期，详见VALIDATOR_PROBE.json（仅临时JSON变异，不修改Client文件）。候选SHA、identity SHA、UUID、重复ID、尺寸、geometry、授权SHA篡改均被拒。

仍需Master协调：普通build(...,--candidate-overrides) report未记录override清单路径/SHA、identity/auth引用；新base-stage分支已记录，两个入口应保持一致。base-stage仅校验manifest文件SHA及六图/meta，不代表其余复制payload完整性已校验；最终须对实际输入和冻结inventory全量比对。旧prepare_isolated.py尚存在，路径逻辑与bundle裁片不相容，应明确废弃/未执行，最终以真实命令和结果为准。

当前三端CLI/native字节、IAB及QA交付仍待提交，本版本尚无最终技术批准。Web仅调试；WX/TT正式目标环境与性能证据不得由Web替代。QA冻结v08结果不自动覆盖六PNG候选。

## 新baseline完整生产输入比对

已独立比对新baseline `/private/tmp/minigame-art-opt-png-baseline-regenerated-20261017` 与旧v08 stage `/private/tmp/minigame-art-opt-integration-staging-v0.8-portable`，范围assets/**、settings/**、package.json，排除.DS_Store。两边均667文件，所有路径、原始SHA256及bytes一致，diff为空；无UUID/meta、运行脚本或新增生产文件差异。详见BASELINE_PAYLOAD_DIFF.json。此证明仅覆盖实际已存在输入，不预判新六PNG stage或CLI输出。
