# v0.3 定向编辑完整提示词与来源

工具：内置 `image_gen.imagegen`，`transparent_background=true`。全部图片均是本项目 v0.1 同名 PNG 定向编辑；不采用外部网页参考、文字字体或品牌。图像生成结果先为待审候选，具体图版用户批准前不进入客户端。

## 阿角 0 魂 candidate_01

- 编辑目标：`deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_aj_s0.png`，调用前已用 `view_image` 目视。
- 输出：`source_images/mgr_aj_s0_candidate_01.png`，选作 `characters/mgr_aj_s0.png`；1024×1536 RGBA；SHA-256 `86e5adbca5197ec7c976dab738fa627bda736349d9935ada4b7a621f921aa089`。
- 参数：`referenced_image_paths=[v0.1/characters/mgr_aj_s0.png]`; `transparent_background=true`。

```text
Use case: identity-preserve precise character edit. Edit target: the attached local v0.1 portrait of Ajiao at soul stage 0, a full-body two-dimensional cute Chinese night-market character. Create the SAME recognizable character reinterpreted as a MALE adult ox-horned hair-styling shopkeeper. This is a direct edit, not a new character design. Preserve the original two short curved ivory horns in their hairline, black hair, near-front view, full-body framing including both feet, blue-violet work robe and pants, warm-copper accents, black waist apron, brown rope ornament in his raised hand, scissors and comb in the waist pouch, shoes, broad pose and the smooth 2D linework / cel shading / restrained warm highlights. Give him a clearly masculine face and neck/shoulders, no feminine eye makeup or lips, while keeping the recognizable brown eyes, mischievous expression and chibi proportions. For 0-soul state make the center-parted black hair visibly greasy, flat and clumped into strands, shirt collar crooked, apron and robe visibly wrinkled with a few subtle unkempt smudges, waist rope knot loose, shoulders slightly slumped. The unkempt look must read at thumbnail size. Keep the costume's major shapes and colors, tools and occupational identity unchanged. Isolated single character on an ACTUALLY TRANSPARENT background, no dark background, no halo, no cast shadow, no words, logo, extra characters or extra props. Aim for 1024x1536 portrait composition with safe margins. Input image is the edit target and identity/costume reference.
```

实图透明通道含低 alpha 深色软晕，未达到干净正式 Sprite 的边界；详见 `SAMPLE_ART_REVIEW.md`。

## 阿角 2 魂 candidate_01（退修）

输入顺序：① v0.1 `characters/mgr_aj_s2.png`（编辑目标、旧衣装／阶段参考），② v0.3 `characters/mgr_aj_s0.png`（男性身份参考）。输出 `source_images/mgr_aj_s2_candidate_01.png`。Art 与 Master 同屏发现头顶高光及贴头油感仍接近 0 魂，退修；未用作最终人物层。参数仍为 `transparent_background=true`。

```text
Use case: precise two-reference character edit for a full-body game portrait. Image 1 is the v0.1 Ajiao 2-soul portrait: EDIT TARGET, preserving its near-front full-body pose, two short curved ivory ox horns, blue-violet robe and pants, warm-copper details, brown rope ornament, waist apron with scissors and comb, shoes, 2D cute Chinese night-market line art and cel shading. Image 2 is the newly approved v0.3 MALE Ajiao 0-soul portrait: IDENTITY REFERENCE ONLY. Make Image 1's face clearly the SAME MALE person as Image 2, with his masculine jaw, thick brows, brown eyes and proportions; do not copy Image 2's grime or greasy hair into this stage. This 2-soul state is a CLEAN INTERMEDIATE step: washed matte black hair with moderate volume and some lift, not flat/greasy and not yet the dramatic standing stylish hair of stage 3; neatly aligned clean collar and robe, clean apron and pants; improved upright stance, still modestly relaxed. Preserve occupational tools, costume silhouette and major colors. Single complete character, 1024x1536 portrait, no cropping, ACTUALLY TRANSPARENT background, no dark backdrop, halo, cast shadow, text, logo, extra objects or extra people.
```

## 阿角 3 魂 candidate_01（选用）

输入顺序：① v0.1 `characters/mgr_aj_s3.png`（编辑目标／旧衣装／阶段），② v0.3 `characters/mgr_aj_s0.png`（男性同人身份），③ v0.3 阿角 2 魂当时的 `candidate_01`（阶段连续辅助；该候选后来因头发过油退修，但 3 魂实图独立审查通过）。输出 `source_images/mgr_aj_s3_candidate_01.png`，选作 `characters/mgr_aj_s3.png`。`transparent_background=true`。

```text
Use case: precise three-reference character edit for a full-body game portrait. Image 1, old v0.1 Ajiao 3-soul, is the EDIT TARGET and costume/stage reference: preserve near-front full-body pose, two ivory short curved ox horns, blue-violet work robe and pants, black apron, warm-copper details, brown rope ornament, scissors and comb in the waist pouch, shoes and original smooth 2D cute Chinese night-market line art/cel shading. Image 2, new v0.3 Ajiao 0-soul, is the definitive MALE IDENTITY reference: the final man must clearly have that SAME masculine face, thick brows, jaw, brown eyes, ox horn placement and body proportions; do not copy his dirt or greasy flat hair. Image 3, new v0.3 Ajiao 2-soul, is the clean transitional continuity reference. Make a final 3-soul adult MALE Ajiao who is clearly the same person and the next step from Image 3: clean, polished and stylish with a distinctly upright sculpted fashionable black hairstyle, standing forelock and controlled volume, more striking than stage 2; spotless neatly arranged robe/apron and tightly finished rope detail; upright confident posture. Keep the existing costume, colors and shopkeeper tools, no new outfit or profession, no female face or makeup. Single complete full-body character on ACTUALLY TRANSPARENT background, aim 1024x1536 portrait with safe margins; no dark backdrop, halo, shadow, text, logo or extra people.
```

## 阿炭 0 魂 candidate_01（选用）

输入：v0.1 `characters/mgr_ac_s0.png`，同阶段编辑目标。输出 `source_images/mgr_ac_s0_candidate_01.png`，选作 `characters/mgr_ac_s0.png`；`transparent_background=true`。

```text
Use case: precise edit of one existing full-body game character. Input Image 1 is the v0.1 Atan 0-soul portrait and the EDIT TARGET. Preserve the SAME boy's recognizable face, drooping tired brown eyes, short messy charcoal-black hair with warm orange tips, gray short-sleeve shirt, charcoal apron, dark loose trousers and shoes, one unbranded grilled-meat skewer in his hand, near-front full-body pose, and smooth 2D cute Chinese night-market line art/cel shading. Make his 0-soul physical weakness far more immediately visible than the source: narrow bony shoulders, thin wrists and arms, slim legs, noticeably SUNKEN CHEEKS with visible cheekbone planes and hollow lower face, rounded HUNCHED upper back and forward head, tired sloping neck/shoulder line, under-eye darkness. Keep him sympathetic and recognizable, not skeletal horror or a different character. The gray shirt/apron and skewer must remain fully visible. Single complete character including both shoes, aim 1024x1536 portrait, isolated on ACTUALLY TRANSPARENT background; no dark backdrop, halo, shadow, words, logo, extra people or props. The image is an edit target, not a mere style reference.
```

## 阿炭 2 魂 candidate_01（选用）

输入顺序：① v0.1 `characters/mgr_ac_s2.png`（编辑目标／旧阶段衣装），② v0.3 `characters/mgr_ac_s0.png`（同人身份／成长基线）。输出 `source_images/mgr_ac_s2_candidate_01.png`，选作 `characters/mgr_ac_s2.png`；`transparent_background=true`。

```text
Use case: two-reference full-body game character edit. Image 1, old v0.1 Atan 2-soul, is the EDIT TARGET: preserve its near-front full-body composition, gray short-sleeve shirt, charcoal apron, dark trousers/shoes, single grilled-meat skewer, black messy hair with warm orange tips, familiar brown eyes, smooth cute 2D Chinese night-market line art and cel shading. Image 2, new v0.3 Atan 0-soul, is the SAME-PERSON IDENTITY and progression reference: match its facial identity, hair silhouette and outfit, but show REAL RECOVERY in this 2-soul stage. His cheeks are no longer deeply hollow yet retain a little leanness, his upper back is less hunched but not fully straight, shoulders and arms gain modest healthy substance, eye bags ease, expression becomes more alert. He must be visibly stronger and more upright than Image 2, yet clearly less muscular and less upright than final stage 3. Keep skewer and exact work clothes/colors. Complete single character including shoes, aim 1024x1536 with safe margins, ACTUALLY TRANSPARENT background, no backdrop, halo, shadow, text, logo, extra people or props.
```

## 阿炭 3 魂 candidate_01（选用）

输入顺序：① v0.1 `characters/mgr_ac_s3.png`（编辑目标／旧阶段衣装），② v0.3 `characters/mgr_ac_s0.png`（同人身份），③ v0.3 `characters/mgr_ac_s2.png`（中间梯度）。输出 `source_images/mgr_ac_s3_candidate_01.png`，选作 `characters/mgr_ac_s3.png`；`transparent_background=true`。

```text
Use case: three-reference precise character edit for a full-body game portrait. Image 1 old v0.1 Atan 3-soul is the EDIT TARGET and outfit/pose reference: gray short-sleeve cook shirt, charcoal waist apron, loose dark trousers, black shoes, one grilled skewer, messy black hair with warm orange tips, cute smooth 2D Chinese night-market linework and cel shading. Image 2 new v0.3 Atan 0-soul is SAME-PERSON face and hair IDENTITY reference, but DO NOT copy its gauntness, hunched back or exhaustion. Image 3 new v0.3 Atan 2-soul is intermediate progression reference. Show a decisive final 3-soul recovery: straight TALL posture, chest open, broader muscular shoulders, visibly developed biceps and forearms on exposed arms, strong healthy build under the same gray shirt and apron, face full rather than hollow, lively clear eyes, self-assured warm expression. The body must read muscular at small size, visibly stronger than stage 2, while retaining the same character, hairstyle, work clothes, skewer and occupation. No bodybuilder exaggeration or new costume. One complete full-body character including shoes, aim 1024x1536 on ACTUALLY TRANSPARENT background with safe margins; no dark backdrop, halo, shadow, words, logo, extra people or props.
```

## 阿角 2 魂 candidate_02（最终选用）

输入顺序：① v0.3 `source_images/mgr_aj_s2_candidate_01.png`（局部头发编辑目标），② v0.3 `characters/mgr_aj_s0.png`（油腻 0 魂下限），③ v0.3 `characters/mgr_aj_s3.png`（立发 3 魂上限）。输出 `source_images/mgr_aj_s2_candidate_02.png`，选作 `characters/mgr_aj_s2.png`；`transparent_background=true`。选用文件 SHA-256 `eaff9d5165a9b293fdda8cf13f12cea72a0bc8d04aa8fe81179f6f9732e018d1`。

```text
Use case: extremely localized hair-only edit of an existing full-body game character. Image 1 is the current v0.3 Ajiao 2-soul portrait and the EDIT TARGET. Change ONLY the BLACK HAIR on top and sides of his head: remove the large oily shiny streaks and wet clumped look, make it clean, DRY, mostly MATTE black with soft restrained small highlights, and add moderate airy volume at the crown and sides. Keep a relaxed low side/center part, some loose natural strands and a gently lifted crown. This stage must look clearly cleaner and slightly fuller than Image 2, the greasy flat 0-soul reference, while clearly LESS upright, LESS sculpted and less fashionable than Image 3, the final 3-soul reference. Preserve every other pixel and feature of Image 1 as closely as possible: EXACT SAME male face, eyes, brows, jaw, horns, neck, body proportions, pose, hand gestures, rope ornament, blue-violet robe and trousers, copper details, apron, scissors, comb, waist pouch and shoes. Do not change his face, costume, colors, body, cropping or background. Single full-body character, 1024x1536, ACTUALLY TRANSPARENT background, no dark backdrop or added halo, text, logo, props or people.
```
