# 六PNG技术评审 v0.1（生产输入首阶段）

当前结论：方案可行；代码仍在制作，以下为首轮可操作审查，不是最终接入或QA通过。使用本轮授权的 gpt-6.1-sol low 进行文档与只读技术审查。已读取角色五文件及共享 cocos-cli-browser Skill。

## 独立输入核验

实查时间：2026-10-17T13:16:30.368363+00:00

| 稳定ID | 工作区尺寸 | 冻结v08 stage尺寸 | stage=reference SHA | candidate SHA吻合 | image UUID吻合 |
|---|---|---|---|---|---|
| `tex_sakura_rr_sky_r` | 1536×1024 | 1536×1024 | True | True | True |
| `tex_u03_shop_05_sign` | 1024×1024 | 375×140 | True | True | True |
| `UG_GHOST_01_HAPPY_00` | 512×512 | 327×367 | True | True | True |
| `tex_u04_at_s3_base` | 768×1024 | 768×1024 | True | True | True |
| `tex_u03_shop_05_body` | 1024×1024 | 773×741 | True | True | True |
| `U05_ART_FONT` | 1024×1024 | 1024×1024 | True | True | True |

三张legacy原画布不能直接换裁剪PNG；正式生成阶段已按83项批准映射导出裁片，并由 derived registry 恢复原始几何及偏移。旧画布SHA与裁剪reference不同不构成冲突。三张完整画布可在身份及meta保护核实后换编码字节。六项candidate均独立核对FILE_IDENTITY中的png_lossless路径/SHA。当前identity文件SHA为 `19e840c2bbe61ba51e6bf56d484edf603367b1f9a03c0972efc90bf18ba148db`；旧gate2字段由后续Master USER_AUTHORIZATION授权补足，不篡改旧证据。

## 方案与首轮Review Action

支持稳定独立六项override表及显式 --candidate-overrides 入口。保留旧默认保证冻结v08复现，当前正式命令必须显式应用六PNG。不能把临时stage手工换图当作长期生产输入。ROOT下已批Artifact与sourceRoot下冻结工程副本各司其职，避免从不受控工作区混入资源。

1. 必要：生成工具读取sourceIdentityPath并校验已冻结identity SHA，将每项稳定ID、源/候选路径及SHA、尺寸、UUID、几何绑定该身份文件。当前loadApprovedPngOverrides仅信任可变override表的候选SHA，sourceIdentityPath/sourceIdentitySha256尚未被消费；3个不在generated rows的图缺少上游源表SHA绑定。
2. 必要：STAGING_INPUT_MANIFEST记录override清单实际路径/SHA、identity实际SHA和授权路径；不能仅嵌入assets后丢失批准身份。
3. 交付时核验：逐项stage PNG尺寸/字节、image/frame UUID、meta前后无变化；三crop与冻结meta相同，derived registry几何仅沿用，不以Art原画布crop字段重算。
4. 交付时核验：registry revision如按编码SHA代表当前资源，应更新本轮相关项；生成重跑不得恢复旧SHA。三非generated图也必须逐项进入实际manifest/native字节审计，不能仅依赖generatedAssets计数。

以上请求仅提交Master协调，未直接指挥Client，未改其文件。

## 后续最终Review边界

Client完成后独立检查三端本轮Creator日志、退出码36及实际输出身份；逐项核native PNG字节与批准候选一致，比较前后meta、UUID、原始几何。Web仅调试，检查实际HTTP产物/IAB证据，不替代WX/TT运行或发布判断。QA目前执行原冻结v08，不能作为六PNG候选运行通过证据；需在明确适用范围内分别归属。目标平台SDK/真机/性能无实测仍NOT_TESTED。当前最终CLI/native/IAB及QA结果尚未提交，本评审不预判。
