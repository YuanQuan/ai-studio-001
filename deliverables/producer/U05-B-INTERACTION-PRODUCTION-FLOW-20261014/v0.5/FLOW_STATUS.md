# U05标签源统一与母版合成对齐流程 v0.5

- 用户于2026-10-15T01:04:44Z明确批准 `U05-B-LABEL-SOURCE-ALIGNMENT-PLAN-20261015/v0.1`，Producer逐项复核三待审文件SHA与当前审批记录一致，`APPROVED_PLAN_HASHES.json`锁定批准对象。此前v0.4的72层PSD可读但合成差57,225像素、按停止条件失败，旧PNG/GIF/PSD留档；本版不覆盖v0.1–v0.4。
- 本次仅授权在新Art v0.2目录把12块标签统一为已获批组件v0.2源，并修“小料”标题与柜台前沿330像素区域叠放顺序；其余茶/奶/小料、角色、订单杯、按钮、字体、净底和动作语义不变。一次确定性候选，无新绘图、无imagegen；先中性代表图与PSD合成RGB零差，再扩原44时间线采样项（旧GIF实际解码39帧）并补清单。允许变化仅12标签及330像素遮挡区；任何越界或合成不零差即停。预算累计代表70不变、FULL15→21、总85→91分钟，旧耗不重置；Art/Tech同批首图前预签与余额释放仍必需。
- Master正式新建Art `U05-B-LABEL-ALIGNMENT-ASSETS-20261015` 与Tech `U05-B-LABEL-ALIGNMENT-ASSET-TECH-20261015`。Art v0.2 `PRODUCTION_PLAN.md`、`ART_PRESIGN.json`、`SOURCE_AUDIT.json` 已实存；Art自01:06:55Z起纯等待不计制作。Tech同批 `TECH_PRESIGN.json` 和 `BUDGET_RELEASE.json` 后续实存：首图前FULL保守上界951.527秒、总5106.471秒，放行唯一候选制作检查240秒硬线+60秒整理缓冲。签认与预算放行不等于具体资源通过。
- Art于2026-10-15 01:10:21–01:11:49 UTC用88秒产出唯一中性代表 `review/reconstructed.png` SHA256 `ef101b99caa8511d0cb6a19f91bd183ea83570bcb0303baa784cbb9f946ee947` 和可读1024×1536、72层 `source/workspace_b_master.psd` SHA256 `382ecfffc8036bf15164eee4dccdfbd11c158fd9db8e5abcdc6b4fd80d9304ca`。Art `FIRST_NEUTRAL_REVIEW.json` 实测PSD预览与中性重组差5,660 RGB像素，bbox[169,1464,580,1504]，全部在底部“查看配方/撤销”按钮文字处；上半、柜台、台面差异为0。原因是把复合 `TEXT_LABELS_HEADER` 整层前移以修“小料”遮挡时，底部按钮文字也被各按钮底板遮住。未达到本方案的首图零差条件，Owner按规则REVISE_STOP；不静默拆层、不放行第二候选。
- 旧v0.1与当前v0.2失败候选均保留；新GIF、44采样项扩产、完整组件表/正式清单、Gate2及Client导入均未发生。Art/AssetTech/Client真实BLOCKED，旧Web8876不变。用户批准的是**制作方案**，本次停在具体资源审核之前。
- Continuity：已授权唯一代表候选已实产并触发零差停止条件；当前没有可继续的本方案扩产工作，需Master据按钮文字与标题复合层的冲突形成新的具体处置决定。Producer v0.5只记录真实失败，不把方案批准冒作资源批准。
