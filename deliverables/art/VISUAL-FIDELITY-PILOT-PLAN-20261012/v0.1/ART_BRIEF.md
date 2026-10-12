# AT_S0 效果继承最小样本｜Art Brief v0.1

本方案仅针对阿棠 0 魂（AT_S0）一份已批准人形对话立绘，用于独立工艺 pilot，不作为新的正式 Client 接入。目标是在同一资源上验证真实分层重组、一个嘴部细节、一个短动作的序列帧路线和适用的刚性骨骼路线，不扩到其他店长、魂阶段或表情。`project/DECISIONS.md` 的 `DEC-U04-HUMAN-REVISION-20261010` 明确覆盖旧非人方向的当前适用性；现有对话立绘的准确版本已获 Gate2 批准。通用规范已批准，但本批新嘴形、短动作和 pilot 范围仍待 Gate1 用户批准。

身份与来源：上游已批准完整人物 `deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_at_s0.png`，SHA-256 `84521286b2119dee7d11256c289cdf389a114bf831feebce92d532ce63b13811`，与现有 `U04-DIALOGUE-LAYERED-ASSET-001/v0.1/source/approved_original_at_s0.png` 同字节。当前 Gate2 批准的是 `source/u04_at_s0_dialogue.psd`（SHA-256 `e0b3e0569024ad33cb724e69e0188d5b5c87c8a6359b29ba25276b6f6ae168cc`）及同版切片，批准记录见 `tasks/U04-DIALOGUE-LAYERED-ASSET-001/ARTIFACT_APPROVAL.json`。不可把上游原概念与当前已调整的微笑表情视为逐像素同版。

来源为项目内内置 imagegen 的原创候选，`U04-MANAGER-PORTRAITS-001/v0.1/ART_BRIEF.md` 和 `PROMPT_LOG.md` 记载未输入外部角色图；`v0.3/RIGHTS_AND_SOURCE.md` 对旧 v0.1 来源延续初筛，未证明所有平台的分发许可或穷尽外观检索。本方案沿用已批准内部源，不引入外部图片、商标、字体或新购买许可；开工前 Art 再核实际平台条款与外观相似风险，若无法确认正式用途则停止正式资源制作并交 Master 处理。

视觉限制：据冻结原图与现行微笑 PSD 预览，固定暖棕色卷短发及额前刘海、侧边浅色花饰与垂饰、浅棕/奶油色衣装、双手持物的可见轮廓、脸部比例、既有暖色明暗与前发遮挡；持物用途和产品语义以已批准上游资料为准，不从图片猜测。局部试验只允许在当前微笑态嘴部既有 256×256 脸片内部做轻微闭合/张开过渡，并覆盖必要的相邻肤色清理；不改变身份、服装、持物、商业语义。短序列动作只含轻微说话；刚性骨骼实验另允许独立眉附件在原坐标上下 2 像素以内轻抬并回位。基准帧须回到批准的微笑静态效果；不新增视角、全身位移、眨眼或夸张变形。

现有 PSD 为 1024×1536、18 个栅格层；一层锁定原图参考，基底和前发，以及五态各眉/眼/嘴独立 alpha 栅格层。它支持局部五官与前发刚性附件实验，不提供天然可编辑的身体、手臂、衣片或变形网格。源清单 `source/at_s0_layer_manifest.json` SHA-256 `fa52d12ec076560714662dd841c6ee91efdad38e3ac3841a1812ce56419557f9`。
