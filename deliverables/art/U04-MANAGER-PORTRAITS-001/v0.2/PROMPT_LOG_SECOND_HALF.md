# 第二组九幅非人店长图：完整提示词与原源映射

任务批次：`U04-MANAGER-PORTRAITS-001/v0.2`。所有图用 Codex **内置 imagegen**，`transparent_background=true`，每幅独立调用。下列每个文本框为该次调用实际传入的完整 `prompt`，不是下一步建议。`referenced_image_paths` 只在同人 2/3 魂与定向修订中设置；这些本地图均在调用前通过 `view_image` 实看。默认原源位于 `/Users/yuanquan/.codex/generated_images/01a12399-e2da-7532-bc54-2d12bc114d49/`，已复制到本目录 `source_images/`，选定者再逐字节复制到 `characters/`。未裁图、缩放、拉伸或重画。旧 v0.1 人形未使用。

## 阿角 0 魂——选定 `mgr_aj_s0_candidate_01.png`

默认生成原源：`exec-59728ef7-64b6-4d08-8640-50a544e3d51c.png`。`referenced_image_paths`：无。

```text
Use case: stylized-concept
Asset type: 2D night-market mobile game character portrait candidate, a single complete nonhuman chibi ghost/monster on a transparent 1024x1536 portrait canvas.
Primary request: Design 阿角 (A-Jiao), 0 soul, a completely original girl-coded COW MONSTER shaped as one plump bean-shaped cow-face-and-body mass, medium-tall in the six-character lineup. Her whole silhouette is a rounded diamond cow face merging directly into a stout bean body. NO neck, shoulders, chest, waist, hips or human legs. Two SHORT curved cow horns fixed at top left and right; two tiny hoof-like arms and two tiny hoof-like feet. Her confidence is already present in slightly upturned eye corners and playful mouth. Between horns is a dark separated hair tuft, visibly OILY, FLAT and pasted to the bean head with a center part. The hair must not hide horns. Blue-violet broad body color blocks, very restrained warm copper accent; one original colorful cord ornament held between hoof fingers has a loose unfinished knot; one small hair-cutting tool hangs from the side contour. All body parts and props fully visible with margin. Cohesive clean expressive 2D cute night-market illustration: broad flat shapes, restrained soft shading, confident dark contour lines, large warm eyes, clear species and job identity at small size, matching a friendly hand-drawn mobile game set. No setting, no background, no floor, no letters, no logo.
Important avoid: human body, human clothing, pants, skirt, human hair hanging as a human haircut, ordinary human with cow horns, extra props, detailed realism, 3D, humanoid anatomy, cropped horn/tool/feet. Actual transparent background, keep alpha; no checkerboard baked in.
```

## 阿角 2 魂——首稿未选 `mgr_aj_s2_candidate_01.png`

默认生成原源：`exec-cbb1d6a4-f889-4fb4-ad94-4715a7a6e552.png`。`referenced_image_paths`：`characters/mgr_aj_s0.png`。首稿仍有油亮高光，保留历史，后续定向修订。

```text
Use case: stylized-concept. Create one 2D mobile night-market game portrait candidate of the SAME original nonhuman cow-bean monster A-Jiao in the provided local image. Input image role: exact character identity, species, 2D line/color style, anatomy, fixed horns, color patches, face and prop reference. The full cow face and stout bean body are ONE form, with no human neck, shoulders, torso, waist, hips or human limbs. Maintain same head/body proportion and same character size; two short curved horns, tiny hoof arms and feet, playful upturned eyes, blue-violet and cream patches, restrained copper accents, a colorful cord ornament held in hooves and one small cutting tool on side. Transparent portrait canvas, full body and all props within margins. Clean broad color shapes, expressive dark contours, restrained soft shading. No environment, no text or logo.
Soul stage: TWO (middle image). Her center-parted dark hair between horns is freshly clean and has LOW FLUFFY VOLUME supporting itself above the head, yet it is NOT the final high upright 3-soul style. Cord knot is becoming neat, color motif harmonizes with patches; hoof hand movement looks smoother. Expression remains self-confident. Keep the same species, horn placements, cow-bean shape, proportions and tools. Avoid greasy flat hair, avoid tall vertical hair, human body, human clothing, another character, complex jewelry or background. Preserve real transparency.
```

## 阿角 2 魂——定向修订并选定 `mgr_aj_s2_candidate_02.png`

默认生成原源：`exec-b350101b-0df1-4ea1-b129-3bba497093d8.png`。`referenced_image_paths`：修订前 `characters/mgr_aj_s2.png`，即候选01。选中后该 `characters/` 路径指向候选02。

```text
Use case: precise-object-edit
Input image role: edit target, the approved A-Jiao cow-bean monster soul-2 portrait. Make a highly targeted edit ONLY to the dark center-parted hair tuft BETWEEN THE TWO HORNS. This is her middle soul stage. Replace the slick oily, striped, sharp white shine with CLEAN MATTE DARK HAIR: remove the repeated bright oily zigzag specular bands, use only one or two broad soft shaded planes, and lift both hair lobes a SMALL amount off the cow head into a LOW rounded fluffy arc with visible root support. Her hair must be visibly cleaner and less pasted-down than soul-0, but clearly lower than a tall upright final hairstyle. Preserve every other pixel and design as closely as possible: original two horn sizes and positions, cow face, cheek patches, eyes, mouth, blue-violet bean body, exact hoof arms and feet, cord knot, dangling scissors, tail, existing silhouette and composition. Keep actual transparent background and original 1024x1536 portrait canvas. Do not add a human body, clothes, extra ornaments or text; do not redraw the character.
```

## 阿角 3 魂——选定 `mgr_aj_s3_candidate_01.png`

默认生成原源：`exec-80fbb26c-298a-4a3f-ab2e-34e8376fed31.png`。`referenced_image_paths`：`characters/mgr_aj_s0.png`。

```text
Use case: stylized-concept. Create one 2D mobile night-market game portrait candidate of the SAME original nonhuman cow-bean monster A-Jiao in the provided local image. Input image role: exact character identity, species, 2D line/color style, anatomy, fixed horns, color patches, face and prop reference. The full cow face and stout bean body are ONE form, with no human neck, shoulders, torso, waist, hips or human limbs. Maintain same head/body proportion and same character size; two short curved horns, tiny hoof arms and feet, playful upturned eyes, blue-violet and cream patches, restrained copper accents, a colorful cord ornament held in hooves and one small cutting tool on side. Transparent portrait canvas, full body and all props within margins. Clean broad color shapes, expressive dark contours, restrained soft shading. No environment, no text or logo.
Soul stage: THREE (final image). Dark center-parted hair between horns is now spirited, FASHIONABLY UPRIGHT and clearly higher than 2-soul low fluff, without covering or changing either horn. Cord ornament's end knot is tidy and deliberately displayed; both tiny hoof hands are relaxed and precise. Confident friendly demeanor, exact same cow-bean species, large silhouette and markings. Avoid oily flat or merely low fluffy hair; avoid human body, clothing, hair stylist person, human arms, extra prop, lettering or background. Preserve real transparency.
```

## 阿灯 0 魂——选定 `mgr_ad_s0_candidate_01.png`

默认生成原源：`exec-c52983f4-dae4-4184-ba0e-8551dcddfff1.png`。`referenced_image_paths`：无。

```text
Use case: stylized-concept
Asset type: one 2D chibi night-market game full-character portrait candidate on an actually transparent portrait canvas (aim 1024x1536).
Primary request: Draw 阿灯 (A-Deng), soul stage ZERO, an entirely original, cute NONHUMAN PAPER LANTERN MONSTER. This is the TALLEST, SLIMMEST character in a six-monster lineup. Its complete body IS one elongated SIX-PETAL faceted paper lantern, with six clearly readable curved paper panels and dark midnight-blue ribs/frame. Warm golden inner wick glows gently through the paper. Its round friendly face with drooping eyebrow tails is DRAWN DIRECTLY ON the upper paper surface, not a human head. Fixed curled hook-shaped wick at lantern top like a small forelock and one short rear paper streamer. The bottom is the lantern's long tassel, visibly the lowest point. Two short PAPER STRIP arms attach directly to lantern sides; one presents a single small unlettered flower lantern, held close to the big lantern body; empty paper-strip arm curls backward to ask/confirm. Warm welcoming open mouth, but wavering light and a momentarily searching glance/paused gesture suggest she just forgot the last sentence. The character remains kind; no caricature of mental decline.
Style: clean colorful 2D hand-drawn chibi illustration for a friendly Chinese fantasy night-market mobile game, broad simple color masses, confident dark contour lines, large warm eyes, restrained soft shading, no realism, easy to read at small size. Entire hook, lantern, arms, small flower lantern and bottom tassel visible with good margin.
Critical avoid: no human head-neck-shoulder-chest-waist-hips-legs, no person wearing a lantern dress, no sleeves, dress, skirt, pants or shoes; no extra lanterns or background scene; no text, logo, fake checkerboard or baked colored background. Actual transparent alpha background.
```

## 阿灯 2 魂——选定 `mgr_ad_s2_candidate_01.png`

默认生成原源：`exec-65d45110-bad5-4c74-a9b7-ff706fb7fb74.png`。`referenced_image_paths`：`characters/mgr_ad_s0.png`。

```text
Use case: stylized-concept. Create ONE full-character 2D chibi night-market game portrait of SAME original nonhuman paper-lantern monster A-Deng as local reference. Input image role: exact identity, material, proportion, color and line style reference. Preserve her tall slim six-panel paper-lantern body, midnight-blue frame, warm yellow inner wick, face drawn on paper surface, curled luminous top hook, one short rear paper streamer, two short paper-strip arms, exactly one small flower lantern held in one arm, and bottom tassel ending the figure. Keep character at same apparent size with all parts and prop within portrait margin. Real transparent background. Expressive dark contours and broad warm paper color blocks. NO human body, head-on-shoulders, dress, skirt, human hands, legs, shoes, setting, lettering or logo.
Soul stage TWO: She now faces the guest and deliberately selects/presents the small flower lantern OUTWARD from her body at mid-height, arm gesture more connected and clear than the zero-soul clutch. The other paper-strip arm points gently toward that lantern with a brief visible pause/confirmation gesture rather than curling backward; light inside big lantern is moderately steady with just a small flicker. Eyes are attentive, friendly and alert, with a tiny thinking pause. The main lantern shape, hook, streamer, face, lantern and tassel remain the same species and proportions. Do not only change eyebrows; visibly change both paper arm gestures.
```

## 阿灯 3 魂——选定 `mgr_ad_s3_candidate_01.png`

默认生成原源：`exec-a1dcae0d-f442-40c6-9306-a23701e427eb.png`。`referenced_image_paths`：`characters/mgr_ad_s0.png`。

```text
Use case: stylized-concept. Create ONE full-character 2D chibi night-market game portrait of SAME original nonhuman paper-lantern monster A-Deng as local reference. Input image role: exact identity, material, proportion, color and line style reference. Preserve her tall slim six-panel paper-lantern body, midnight-blue frame, warm yellow inner wick, face drawn on paper surface, curled luminous top hook, one short rear paper streamer, two short paper-strip arms, exactly one small flower lantern held in one arm, and bottom tassel ending the figure. Keep character at same apparent size with all parts and prop within portrait margin. Real transparent background. Expressive dark contours and broad warm paper color blocks. NO human body, head-on-shoulders, dress, skirt, human hands, legs, shoes, setting, lettering or logo.
Soul stage THREE: Her internal wick glows evenly and steadily. She speaks with easy warmth and NATURALLY DISPLAYS the one small flower lantern FARTHER OUT to a guest, with paper-strip arm smoothly extended; the other strip arm opens outward in an easy welcoming gesture. The posture reads fluent and relaxed, more open than stage two, while tall six-panel body, top hook, short streamer and lowest tassel remain identical in species and proportions. Do not only change face; clearly distinguish prop distance and both paper-arm gestures. No extra prop or symbols.
```

## 小锦 0 魂——首稿未选 `mgr_xj_s0_candidate_01.png`

默认生成原源：`exec-12a73d53-ff6c-4417-8d20-fef619192f4f.png`。`referenced_image_paths`：无。镜片内多圈纹不足，保留历史。

```text
Use case: stylized-concept
Asset type: one complete 2D chibi ghost-fish character portrait candidate for a friendly Chinese fantasy night-market mobile game, on an actual transparent 1024x1536 portrait canvas.
Primary request: Draw 小锦 (Xiao-Jin), soul stage ZERO. She is an original female Koi-Fish SPIRIT whose ENTIRE BODY is a real short, broad upright-swimming FISH silhouette: continuous fish head, belly, back, two side fins, and one broad forked tail fin. NO human torso, chest, waist, hips, legs, arms, dress or mermaid body. She reads as an expressive cute fish, not a woman costume. Medium height relative to a six-monster cast; do not stretch to the canvas. Main lake-teal body color with restrained coral-red accent patches and clear fish-fin shapes. A fixed high SIDE WATER-FIN tuft on the fish head echoes a ponytail but is unmistakably a pointed water-fin ending, plus a small short fin beside the face. Broad fish cheeks and warm expressive eyes. She wears unmistakably THICK round multi-concentric-ring spectacles on her FISH FACE, an obvious high-myopia visual cue, and narrows her eyes toward a distant target. One short SIDE FIN itself supports EXACTLY ONE slender unlettered ring-toss/pitch-pot arrow used to host a投壶 booth; no human hand. She still looks capable and welcoming as a game host. A slight forward lean/swim toward the target expresses checking its location. Full top water-fin, body, side fins, one arrow and entire tail within comfortable margin.
Style: clean charming hand-drawn 2D chibi night-market game illustration, dark smooth contour lines, broad simplified color masses, gentle soft shading, eyes readable at small display size; same visual family as colorful cute ghost, cow-bean and paper-lantern monsters. No other props, no actual pot or stage, no scene, no letters/logo, no checkerboard, no opaque backdrop; genuine transparent alpha.
Critical avoid: mermaid/person with fish tail, human body or arms, legs, clothing, ordinary girl with fin ears, second arrow, generic goldfish bowl, hyperreal scales, 3D.
```

## 小锦 0 魂——定向修订并选定 `mgr_xj_s0_candidate_02.png`

默认生成原源：`exec-7afc2f0c-4c5a-4ed1-a9b0-171299d3d051.png`。`referenced_image_paths`：修订前 `characters/mgr_xj_s0.png`，即候选01。选中后该 `characters/` 路径指向候选02。

```text
Use case: precise-object-edit
Input image role: edit target of the exact original Xiao-Jin zero-soul koi-fish monster portrait. Make a targeted edit to BOTH GLASS LENSES ONLY. She has obvious severe-myopia THICK LENSES with multiple nested concentric optical rings INSIDE THE TRANSPARENT GLASS SURFACE over each eye, clearly visible at normal portrait viewing size. Add two or three gentle oval/circular lens refraction bands within each lens, plus slight eye magnification/refraction, while the eyes remain readable; these are optical rings in the actual lens area, not additional decorative stripes on the outer golden frames. Preserve the golden round frames, fish eyes and expression as closely as possible. Preserve all else exactly: complete short broad teal-and-coral koi-fish body with no human anatomy, high side water-fin tuft, side fins, one slender arrow held in a fin, full forked tail, palette, character pose, portrait composition, alpha-transparent background, 2D game art line style. Do not add extra glasses, extra arrows, clothing, hands, legs, text or scenery.
```

## 小锦 2 魂——选定 `mgr_xj_s2_candidate_01.png`

默认生成原源：`exec-07cdb7dd-eb29-4d3a-b3c8-e8aa1130ad9f.png`。`referenced_image_paths`：已选新 `characters/mgr_xj_s0.png`（候选02）。

```text
Use case: stylized-concept. Draw ONE 2D chibi night-market game portrait of the SAME original female koi-fish spirit Xiao-Jin shown in the provided local reference. Input image role: exact species, identity, entire fish-body anatomy, color palette, high side water-fin tuft, fish face, side fins, forked tail, single pitch-pot arrow and line style. She MUST remain a complete short broad upright-swimming koi fish, not a mermaid or woman with a fish tail. Preserve lake-teal and coral color layout, original short fin beside face, fin-held exactly ONE slender arrow, full tail and all parts within comfortable portrait margin. Actual transparent background; no setting, human torso/chest/waist/hips/legs, arms/hands, clothing, extra arrow, letters, logo or checkerboard.
Soul stage TWO (middle): Her glasses are still PRESENT but become noticeably LIGHTER and thinner than zero-soul; the strong multi-circle optical lines INSIDE the lenses reduce to only one gentle faint lens ring per lens. Her eyes and distant sightline are more open and clear, and the fish side-fin holding the arrow extends a little more openly toward the audience. Preserve fish anatomy, teal/coral markings, high water-fin tuft and single arrow. This is not the no-glasses final state. Do not replace lens rings with only frame decorations.
```

## 小锦 3 魂——选定 `mgr_xj_s3_candidate_01.png`

默认生成原源：`exec-791b3255-a971-4f45-95d3-c1232a473013.png`。`referenced_image_paths`：已选新 `characters/mgr_xj_s0.png`（候选02）。

```text
Use case: stylized-concept. Draw ONE 2D chibi night-market game portrait of the SAME original female koi-fish spirit Xiao-Jin shown in the provided local reference. Input image role: exact species, identity, entire fish-body anatomy, color palette, high side water-fin tuft, fish face, side fins, forked tail, single pitch-pot arrow and line style. She MUST remain a complete short broad upright-swimming koi fish, not a mermaid or woman with a fish tail. Preserve lake-teal and coral color layout, original short fin beside face, fin-held exactly ONE slender arrow, full tail and all parts within comfortable portrait margin. Actual transparent background; no setting, human torso/chest/waist/hips/legs, arms/hands, clothing, extra arrow, letters, logo or checkerboard.
Soul stage THREE (final): Remove the visible glasses COMPLETELY: no frames, no lens rings, no box, no visible contact lenses. Eyes fully clear and expressive on her fish face, gaze confidently toward the distant audience. She openly presents the one pitch-pot arrow with a graceful fish-fin gesture, forked tail and other fin spread in an assured hosting pose. High side water-fin tuft and cheek fin remain exact identity cues. Keep same complete fish species, compact body proportions and teal/coral markings. Do not suggest contact lenses cure vision; no medical graphics.
```
