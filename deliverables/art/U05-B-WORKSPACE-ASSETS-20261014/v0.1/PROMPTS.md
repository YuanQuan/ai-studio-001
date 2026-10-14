# U05 B 图像局部补绘实际提示｜v0.1

本批实际使用内置 `image_gen` 编辑模式 4 次，均以冻结 `concept_B.png` 为编辑目标（1024×1536）。以下提示文字直接从本任务真实本地调用记录提取，不是事后改写；记录中的 `call_id` 是 Codex 工具调用标识，不冒称图像服务请求 ID。生成结果仅作为签认 ROI 的局部补底候选，未整图替换源。图像原件已复制到本 Task `source/`。

调用记录：`/Users/yuanquan/.codex/sessions/2026/10/13/rollout-2026-10-13T13-33-01-01a133bf-fa72-7292-84ba-08f369066778.jsonl`（只读本地会话记录）；其余作品的源文件与哈希见 `BUDGET_LEDGER.md`。

## 代表补柜候选1

- 工具调用：`call_83a97140ee2747939169c8d83228ce31`；本地记录行：`1008`。
- 输入图：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png`（编辑目标）；`transparent_background=false`。
- 工具缓存原件：`/Users/yuanquan/.codex/generated_images/01a133bf-fa72-7292-84ba-08f369066778/exec-63b06465-c552-44b0-8d17-49f6237e9feb.png`。
- 项目候选：`source/representative/repair_candidate_v1.png`；SHA-256 `eabc2b52c218cbe2e737f2ab566ec7dd93e642ec166d836641f6ac5c3a2d3e07`。
- 实际提示（原文）：

```text
Edit the referenced selected milk-tea game UI image with an extremely localized repair only. Preserve the entire 1024×1536 maker-side scene, its camera, linework, colors, lighting, Chinese labels, ghost, bubble, all other ingredients and buttons pixel-for-pixel as far as possible. In the upper-left tea shelf first cell, remove ONLY the amber teapot and reconstruct the empty recessed warm dark-wood alcove with its continuous inner amber rim. In the center topping grid top-left cell, remove ONLY the cyan ghost-fire pearls and their bowl and reconstruct an empty recessed dark-wood slot; remove the cyan glow residue there. Keep the separate existing nameplate text below each slot and all shelf frames. Do not redesign, recolor, add objects, or modify other cells. This image is repair input only; the two repaired regions will be locally composited into the original frozen reference, all other generated pixels discarded.
```

## 代表补柜候选2

- 工具调用：`call_e1c21d4335f44451829e5058954a624e`；本地记录行：`1019`。
- 输入图：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png`（编辑目标）；`transparent_background=false`。
- 工具缓存原件：`/Users/yuanquan/.codex/generated_images/01a133bf-fa72-7292-84ba-08f369066778/exec-18d42689-63ad-40b1-91e9-f90f458bfa16.png`。
- 项目候选：`source/representative/repair_candidate_v2.png`；SHA-256 `ab3a8a4f00f180eca15207c0b656c1b93a64439bee9b8b3bd71db09b97937872`。
- 实际提示（原文）：

```text
Localized repair of the attached U05 B milk tea game UI, 1024×1536 portrait. Preserve the source composition and every object outside two signed regions. Remove the amber teapot only from the first upper-left tea alcove, leaving a believable empty dark warm-wood recessed cabinet backing and unbroken amber inner rim. Remove the cyan fire pearls and bowl only from the top-left of the central topping grid, leaving a believable empty dark-wood inset with no blue fire residue. Keep original labels, frames, all other ingredients, customer, bubble, work cup and buttons. No redesign or additional objects. This generated output will be used only as a local patch for the two empty slots; all other pixels discarded.
```

## 12格隐底候选

- 工具调用：`call_c7daad970e5448719a7550d22b0d7019`；本地记录行：`1309`。
- 输入图：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png`（编辑目标）；`transparent_background=false`。
- 工具缓存原件：`/Users/yuanquan/.codex/generated_images/01a133bf-fa72-7292-84ba-08f369066778/exec-fbc7948e-5a66-4568-a190-da8fd04fa048.png`。
- 项目候选：`source/repair_all_slots_candidate.png`；SHA-256 `6475921d0574c6de7cf020932882fb764caaf248cc5b7bdfc61c35f5be2dfb23`。
- 实际提示（原文）：

```text
Localized restoration pass for the referenced 1024×1536 U05 B illustrated milk-tea game UI. Reconstruct ONLY the twelve ingredient shelf inset backgrounds after removing the ingredient vessels/bowls and the three permanently lit selection glows: the 3 teapots in the left vertical tea shelf, 3 milk jars in the right vertical milk shelf, and 6 topping bowls in the center 2×3 grid. Keep the wooden shelf frames, their 12 separate cream nameplate bases and their positions, blue roof, valance, lanterns, ghost customer, order bubble with finished cup, near work cup and buttons exactly as in the reference. Each vacated niche should be a believable empty recessed warm dark-wood cubby, consistent with the previously approved B art style. There must be NO silhouettes, no ingredient residue, no blue flames, no jar glass, no permanent yellow selection outline. Do not add content, redraw the UI, alter labels, or change any other area. The output is patch source only: solely the named 12 slot interiors will be pasted back into the frozen reference.
```

## 场景隐底候选

- 工具调用：`call_282719dfb39f4c9d8953b6b67c97c52d`；本地记录行：`1423`。
- 输入图：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U05-MILK-TEA-WORKSPACE-CONCEPT-20261013/v0.3/concept_B.png`（编辑目标）；`transparent_background=false`。
- 工具缓存原件：`/Users/yuanquan/.codex/generated_images/01a133bf-fa72-7292-84ba-08f369066778/exec-71c73c1b-9992-48c9-99c7-8b72aab3afd7.png`。
- 项目候选：`source/repair_scene_candidate.png`；SHA-256 `4062dfb0dc46cf17dea20b93478e9712ded98c057d8246c0f6c5221318b5c6af`。
- 实际提示（原文）：

```text
Local clean-background restoration for the referenced 1024×1536 maker-side milk-tea shop illustration. Remove ONLY these foreground/dynamic items: (1) the white friendly ghost customer visible in the open window, revealing the same softly blurred lantern-lit night street behind it; (2) the large white speech bubble and its finished drink above the ghost, revealing the matching night street/window background behind it; (3) the single clear empty work cup on the near wooden preparation counter, revealing the same engraved wood board and ring beneath; (4) the three separate cream/orange action buttons at the very bottom, revealing a continuation of the warm brown counter/plank beneath. Preserve the blue roof, wood frame, hanging valances, lanterns, all 12 ingredient shelves and labels, all other decoration, perspective and lighting. Do not change any area outside those four local masks. No replacement customer, bubble, cups, buttons or text. This output is only a hidden-background source; it will be pasted into the frozen reference under separate semantic foreground layers, never used as an entire regenerated scene.
```
