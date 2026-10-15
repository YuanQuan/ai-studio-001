# 临时补丁与干运行独立核查

结论：**临时干运行的四份预览内容通过路径和历史事实检查；尚不能把这份脚本或预览原样提交正式目录。** 本审查未执行脚本，也未写 Art 或正式资源文件。

`/private/tmp/u05_final_doc_fix_preflight.py` 的显式写入只有 `/private/tmp/u05_final_doc_fix_preflight/` 下四份预览；对项目目录的调用均为读取，未见 `os.replace`、`write_bytes` 或其他正式目录写入。正式四文件仍保持冻结 SHA：CUT `6bcbec86…`、ASSET `9a7d6f78…`、LEDGER `88e4de97…`、DELIVERABLE `19d3cd9b…`。其 `files.items()` 读法修正了上一轮映射错误，未沿用旧硬编码 START；但它本身是**预览生成器**，没有正式提交、回滚、当轮计时或最终全轮账本闭合逻辑。

四份临时预览实际 SHA：CUT `c493493d8f695794ad30005b0d9a95a4c9a3142344aee7e25936b7cf9a1a1718`；ASSET `9ce9f560516571d199a7819942ca47bade4fbefd8ff25b80fb40a91f20b641a8`；LEDGER `d4569c446d839b787de989471f59c7ab834fef4f3242cda710affacc6762b96a`；DELIVERABLE `02f0bec410f541502f369049758ca1592ec3d1c67661c0645d749a055569ef7f`。CUT 中 54 个运行 PNG 路径全部改为已核 `apps/client/assets/resources/u05_milk_tea/u05_b/<实际文件名>`，四个历史/PSD 专用项为 null；FNT 路径准确为 `.../U05_ART_FONT.fnt`。Markdown 新前缀 55 次、旧前缀 0 次。DELIVERABLE 预算准则 `FAIL`，Gate2 与运行 `NOT_TESTED`；LEDGER 记原约256秒/超16秒未追认，以及本次152秒失败、累计1956.148/6111.092、Gate2 PENDING。预览里的资源身份和路径未见新增错误。

正式执行前尚需补足以下检查与内容：

1. `check_frozen()` 读取 `lock['source_dir'] / rel`，目前受冻结清单 SHA 支持，但代码没有显式限制相对路径 `..` 逸出；应静态断言每个解析后路径仍在预期 v0.3 目录。四份源文件和冻结10件已核 SHA，但脚本只核 58 的数量/运行计数，不逐项核所有 `art_path` 的 SHA、尺寸、alpha、FNT 字节/哈希或 ID 唯一；正式提交前须做完整身份核验或绑定本次 Tech 已实核的源 SHA，并再次核所有引用。
2. 预览 LEDGER 的 `correction_preflight.mode=DRY_RUN_ONLY`、`next_run_elapsed_seconds=UNKNOWN_UNTIL_EXECUTED`，原顶层 `status=READY_FOR_USER_GATE2_NOT_CLIENT_IMPORTED` 也未调整。它是临时预览，不应原样作为正式账本。正式版须按真实新轮开始、最终结束、保守全轮活动、累计上界和是否触本轮硬线闭合；完成后才判 Gate2 可呈交。DELIVERABLE 的风险也应随最终活动结果更新。
3. `validate_deliverable()` 是手写 schema 子集；目前预览按所检查的字段合格，但未逐条覆盖 schema 的每个类型条件。正式提交前应以完整 schema 验证并核四文档相互引用、55 路径及正式目录原四 SHA 未变化。四文件逐一替换非整体事务，失败需记录各文件替换/回滚 SHA，保持 BLOCKED。

最低风险下一步：在用户批准新方案且 Art/Tech 同批补签并核预算后，Art 基于此临时预览做**只读完整预检**，再生成含真实当轮计时的四份正式候选；正式写入前逐项核输入与候选、冻结10件和硬线，最多一次受控提交。预检失败即停，不为了完成而重复执行。具体资源 Gate2 与 Client 接入仍未放行。
