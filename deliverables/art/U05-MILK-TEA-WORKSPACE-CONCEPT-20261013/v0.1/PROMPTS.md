# U05 三版概念图生成提示与执行记录

工具：内置 `image_gen`；三版各独立生成一次，A 有一次局部纠错编辑。图像工具未返回请求 ID 或可核费用信息；费用／内部算力未知。原始工具结果默认路径按下列记录保留，项目内正式候选为 `concept_A/B/C.png`。

## A 初稿（已归档）

输出：`history/concept_A_initial.png`；SHA-256 `688bf407f19cff68dfcc2b8bf148309a444ebaa7b8eaaa391c2879b88f65eaa8`。初稿显示未获批的备选原料，故只作历史，不提交用户选择。

```text
Use case: ui-mockup
Asset type: independent portrait mobile game interface concept art, variant A of three
Primary request: Show the player standing INSIDE a cute Chinese night-market milk-tea shop, looking from the maker's side toward their own workbench. A front-facing, slightly top-down view of a broad pale-wood work counter. A single clear milk tea cup under preparation is the largest central focal point. The player sees the INSIDE of the counter, never the customer-facing exterior.
Scene/backdrop: softly lit wooden interior, shallow upper shelves and warm paper lantern glow, only a narrow dark-blue night glimpse beyond the serving opening. Warm wood and pale paper dominate.
Composition/framing: full 2:3 portrait game screen, edge-to-edge, no phone frame. Top 18%: legible order slip at upper left and timer at upper right; show difficulty 困难, cup progress 2/3, time 01:48, order name 标准甜标准冰珍珠红茶奶. Center 50%: central cup and five physically believable grouped selectable ingredient containers on countertop, visibly differentiated: 茶底 tea jars, 奶类 milk bottles, 小料 topping bowls, 甜度 sugar containers, 冰量 ice bin. Arrange tea and milk to left/right, toppings and sugar/ice toward near front edge. Each group has a clear pale-paper label and small rounded choice tokens; highlight one selected choice in each: 红茶, 鲜奶, 珍珠, 标准甜, 标准冰. Bottom 22%: a compact pale-paper action strip with readable controls 查看配方, 撤销, 确认交杯. All controls must be within frame and separated enough to tap. Show an actual welcoming maker's workspace, not a generic blue form.
Style/medium: polished original smooth 2D cute Chinese game illustration; rounded confident line art, simple soft shadows, tactile wood grain, paper tags, porcelain and glass; non-pixel art. Warm amber lamp lighting, quiet cool navy only outside. Mature, production-quality illustration concept but clearly a UI mockup.
Text: keep ONLY these key Simplified Chinese labels when possible: 困难, 2/3, 01:48, 标准甜标准冰珍珠红茶奶, 茶底, 奶类, 小料, 甜度, 冰量, 红茶, 鲜奶, 珍珠, 标准甜, 标准冰, 查看配方, 撤销, 确认交杯.
Constraints: five selectable recipe dimensions only; no open recipe answer panel; no stirring/pouring/sealing minigame; utensils may be decoration only. No customer, person, mascot, new shopkeeper design, logo, brand, watermark, phone bezel, triptych, exterior storefront, pixel art, Western cafe.
```

## A 定向纠错（当前候选）

输入：`history/concept_A_initial.png`，编辑目标。输出：`concept_A.png`；SHA-256 `0caba5b6b760729de6a7354b4b1a6bcaa3ce61b42bcc9d78e6f96a8b8a509a08`。与初稿同构图，修正奶类、小料、甜度与冰量标签，小料碗内容也对应布丁和仙草。

```text
Use case: precise-object-edit
Asset type: U05 milk tea game UI concept A correction
Input image role: edit target, existing original concept_A_initial.png.
Primary request: Change ONLY the eleven incorrect small ingredient option labels and their immediately corresponding container contents where needed. Keep the whole composition, camera, all placements, cup, order, timer, bottom buttons, wood/paper/lantern material, lighting, colors, line art, and all other pixels visually unchanged. Do not redesign or recompose this image.
Exact required text replacements on the existing five ingredient groups:
1 茶底 group keep selected 红茶 at center; left should read 绿茶, right 乌龙茶 (already correct, preserve).
2 奶类 group, left label 纯牛奶 -> 燕麦奶, center highlighted 鲜奶 unchanged, right label 奶盖 -> 椰奶. The milk bottles can remain milk-like but no cream topping.
3 小料 group, left highlighted 珍珠 unchanged. Center label 红豆 -> 布丁 and change only that center bowl's contents to yellow custard pudding pieces. Right label 椰果 -> 仙草 and change only that right bowl's contents to dark grass jelly cubes.
4 甜度 group, left label 少糖 -> 少甜, center highlighted 标准甜 unchanged, right label 多糖 -> 半糖. Sugar containers otherwise remain unchanged.
5 冰量 group, left label 少冰 unchanged, center highlighted 标准冰 unchanged, right label 多冰 -> 去冰. Ice bin composition otherwise unchanged.
The order header must remain 困难, 2/3, 01:48, 标准甜标准冰珍珠红茶奶. Bottom buttons must remain 查看配方, 撤销, 确认交杯.
Constraints: exact Simplified Chinese functional labels, no extra options, no new decorations, no crop, no border, no logo, no alternate view. Strict targeted local correction; preserve the reference image everywhere else.
```

## B 俯视工作桌（当前候选）

输出：`concept_B.png`；SHA-256 `9302bb7f255a3b722eb675a95c160d7dd022b4dd7a0f509b1ddfc511d02b40fb`。只显示五组当前选中值；未标小碗不定义新增原料。

```text
Use case: ui-mockup
Asset type: independent portrait mobile game interface concept art, variant B of three
Primary request: An original TOP-DOWN overhead plan view of the PLAYER'S OWN milk tea making desk inside a cute Chinese night-market shop. Distinct spatial layout: a generous complete wooden worktable fills the screen like a tactile board game, with a single central drink cup in a round recessed preparation mat. Five ingredient groups are clearly arranged as an ergonomic semicircle around the cup so the eye can trace from ingredient to cup; avoid front-facing counter, shelves, customer service facade, or generic form UI.
Scene/backdrop: maker-side desk viewed from high overhead, pale oak board surface, warm paper slips, soft lantern pools of light, a sliver of blue tile floor at edges only. Small decorative spoon and closed sealer tucked into corner are passive background props, not interactive steps.
Composition/framing: complete 2:3 portrait edge-to-edge game screen, no phone frame. At top, clipped paper order card taking a small but legible horizontal strip: 困难, 第2/3杯, 01:48, 标准甜标准冰珍珠红茶奶. From mid-upper through lower-middle, overhead tabletop. Central cup should be visually dominant and clearly filled with pearl milk tea. Five MATERIAL STATIONS must each be visible in physically coherent grouped containers with pale paper label and distinct selected token: 茶底 with 红茶 selected, 奶类 with 鲜奶 selected, 小料 with 珍珠 selected, 甜度 with 标准甜 selected, 冰量 with 标准冰 selected. Use a compact round station for each, distribute them left/upper/right/lower around cup and connect visually by wood inlays or small decorative lines, with no extra gameplay indicators. At very bottom, three large separate paper or wooden controls: 查看配方, 撤销, 确认交杯. Readable at mobile size; allow safe margins and avoid clipped elements.
Style/medium: polished smooth 2D cute Chinese game illustration, not pixel, rounded clear line art, simplified soft shadows, tactile paper and wood, warm amber lamp tones and muted cream; no photorealism, no modern glossy casino UI.
Text: keep these Simplified Chinese functional labels as accurately as possible: 困难, 2/3, 01:48, 标准甜标准冰珍珠红茶奶, 茶底, 奶类, 小料, 甜度, 冰量, 红茶, 鲜奶, 珍珠, 标准甜, 标准冰, 查看配方, 撤销, 确认交杯.
Constraints: player is on the making side, no customer, person, mascot, shopkeeper, storefront exterior, brand, IP, watermark, phone bezel, triptych. Five selectable recipe dimensions only. No open recipe answer panel. No added pouring, shaking, mixing, or sealing step. This B layout must visibly read as an overhead WORK DESK, structurally different from a frontal counter.
```

## C 两层柜内工位（当前候选）

输出：`concept_C.png`；SHA-256 `6e8038ec6100d3a674d647792730405c19fcabcb84b6dc3a1e3bc5146788eb62`。右下无交互标签的重复小料只当背景陈设；“去冰”旁示意冰块需后续 UI 澄清，不据图解释规则。

```text
Use case: ui-mockup
Asset type: independent portrait mobile game interface concept art, variant C of three
Primary request: Show the player's viewpoint STANDING INSIDE a cute Chinese night-market milk-tea booth, looking down into their own TWO-LEVEL MAKER'S WORKSPACE. This must be structurally different from a simple frontal single counter or a pure overhead tabletop. An upper recessed wall shelf and hanging order board form tier one, while a lower near-hand U-shaped prep bench with pullout ingredient trays forms tier two. Between tiers, a raised central cup-making island holds one large pearl milk tea cup as the visual hero. A little depth, warm lantern-lit alcove, side cabinets, and visible counter thickness make it feel like a real booth interior. Camera is maker-side three-quarter perspective, moderately elevated, aimed inward at the work surfaces; no customer-facing storefront facade.
Composition/framing: Full 2:3 portrait mobile game screen edge-to-edge, no device bezel. Upper 20%: clipped paper order on upper wall and compact time plaque; exact display 困难, 2/3, 01:48, 标准甜标准冰珍珠红茶奶. Middle 55%: big central cup on raised wooden preparation island; five physically believable, visibly grouped, selectable ingredient stations distributed around left/right upper shelf pockets and nearer lower pullout trays. Each station has a legible pale-paper category label and three separately identifiable choices with a highlighted selection. Tea group 茶底: 绿茶, 红茶(selected), 乌龙茶. Milk group 奶类: 燕麦奶, 鲜奶(selected), 椰奶. Topping group 小料: 珍珠(selected), 布丁(yellow pudding cubes), 仙草(dark grass jelly cubes). Sweetness group 甜度: 少甜, 标准甜(selected), 半糖. Ice group 冰量: 少冰, 标准冰(selected), 去冰. Place stations in different depth planes but keep every group accessible and readable; never hide ingredients behind the cup. Lower 20%: three large clear controls 查看配方, 撤销, 确认交杯, all fully inside frame.
Style/medium: polished original smooth 2D cute Chinese game illustration, slightly storybook but designed as a usable mobile UI concept. Rounded clean line art, soft simple shadows, pale wood and warm paper, orange lantern light; small muted night blue through a tiny back opening. Keep wood counter and product cup more prominent than decoration. Do not make a deep-blue form layout.
Text: only needed Simplified Chinese gameplay labels listed above; preserve exact option spelling. No extra decorative text, slogans or brand marks.
Constraints: only five recipe dimensions, one cup, no visible opened recipe answer. A shaker, sealer or tools may sit far back as passive decoration only, never a new step or button. No people, customer, mascot, new shopkeeper design, IP, exterior storefront, watermark, phone frame, triptych, photorealism, pixel art.
```

四次图像工具调用均得到实图；三张当前候选均为 1024×1536 PNG。概念图中文供审阅，生产时需按产品配置与许可字体重新排字。
