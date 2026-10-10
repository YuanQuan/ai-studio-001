# 图像生成提示词与输入记录 v0.1

工具：Codex 内置 `imagegen`，每幅单独调用。以下仅记录已经实际调用的图；后续每幅生成后补充。`transparent_background=true` 为请求参数，实际 alpha／底色以 PNG 实测为准。输出原件另留于 Codex 默认生成目录，项目 `source_images/` 保存副本；最终审阅候选置 `characters/`。

## 孟桃 0 魂 candidate01 — REVISE

- 输入：仅获批文字方案，无图片参考。输出：`source_images/mgr_mt_s0_candidate_01.png`，1024×1536 RGBA，SHA-256 `09596cf321785700593b580beaba805d650f6ab75adcc1b0ee41a49a5680e08c`。
- 实际提示词：

> Use case: stylized-concept. Asset type: one ORIGINAL game character full-body portrait, the 0-soul design of Meng Tao (孟桃), owner of a milk-tea stall in a gentle Chinese ghost night market. Create exactly ONE character, ONE state, ONE standalone vertical image; no comparison board, no other people. Smooth 2D cute Chinese game illustration, non-pixel, clean readable silhouette, restrained simple shadows, polished character design suitable for small mobile display. Near-frontal fixed three-quarter-neutral standing view, entire head/hair, carried cup, hands, legs and both shoes visible, comfortable transparent safe margins, feet on a consistent imaginary ground line. Character: young adult feminine ghost-world shopkeeper, round face tapering gently to a point, slightly upswept eyebrow ends, deep berry-red shoulder-length side-parted hair with one small lock tucked behind one ear; several small visible ear studs. Short-sleeved cream-and-deep-berry work overshirt worn open, a single small ORIGINAL bridge-and-water knot ornament, one unbranded drink cup with a distinctive teardrop-shaped rim. Forward-shifted weight and direct frank expression show rebellious outward energy while keeping dignity and independent resolve. No green apron, orange sash, waist name plaque or old brown short hairstyle. Keep accessory restrained so cup and face read at thumbnail size. Muted warm light on the character with clean line and flat painterly blocks. Transparent background, no scenery, no glow halo, no shadow outside character. No lettering, characters, logos, trademarks, watermark, UI, borders, captions, or printed symbols. No recognizable franchise or existing character imitation.

## 孟桃 0 魂 candidate02 — Art PASS 审阅候选

- 输入：仅获批文字方案；未引用 candidate01 图片。输出：`source_images/mgr_mt_s0_candidate_02.png`，与 `characters/mgr_mt_s0.png` 相同，1024×1536 RGBA，SHA-256 `6bd4cccdac4351ccda863d7df4a5f079727fc38a2614e559b827b74f7d330ecb`。
- 实际提示词：

> Use case: stylized-concept. Create ONE original full-body character only: Meng Tao, a young adult female milk-tea shopkeeper in a gentle Chinese ghost night market, 0-soul state. Art direction is a cute, simple 2D MOBILE GAME character, approximately 4 heads tall with compact proportions, rounded readable silhouette, clean moderately thick colored outlines, smooth flat color with ONE simple shadow plane and no detailed rendering. It must look like a polished illustrated game sprite, NOT an anime fashion portrait, not realistic, no glossy skin, no intricate fabric patterns. Full body near-frontal standing pose; full hair, one beverage cup, both hands and both shoes visible with generous EMPTY transparent margin all around and a consistent foot baseline. Face round tapering slightly at chin, slightly upturned eyebrow tails; deep berry-red side-parted shoulder-length hair with one short lock tucked behind one ear. Several tiny visible ear studs. Cream and berry-red short-sleeved loose work overshirt worn open over simple dark top, one small ORIGINAL bridge-and-water knot accessory, single unbranded drink cup with teardrop-shaped rim. Direct, frank expression and subtly forward weight show outward rebellion, with dignity and independence. The drink cup and small hair silhouette are clearer than jewelry at thumbnail size. Keep clothes modest and practical for a stall keeper; no shorts, thigh straps, fashion boots, huge exposed legs, or waist sashes. No green apron, orange belt, name plaque, old brown short hair. Strictly transparent background with ZERO halo, ZERO cast shadow, ZERO scenery, no floor, no gradient. No text, symbols, logo, watermark, border, comparison layout, or additional figures. This is the single 0-soul state, not a multi-stage sheet.

注：candidate02 实际仍存在低 alpha 暖色光晕，提示词中的 `ZERO halo` 不是实际合格事实；详见 `ART_REVIEW.md`。

## 其余独立调用完整记录

以下每一节都是一次独立内置调用。`selected` 表示进入本版 18 张人物图；`history/revise` 仅留来源记录，不进入板和 PSD。所有调用均请求 `transparent_background=true`，实际软光 alpha 的限制见 Review。

### s0_at — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-d9a767e6-f55b-4bbd-8c94-a677ef2763ac.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original character in ONE 0-soul state, a standalone full-body game illustration; no panels or extra figures. Same approved visual language as a cute simplified 2D Chinese gentle-ghost night-market mobile game: about four heads tall, compact adult proportions, clear rounded silhouette, moderately thick colored outline, broad flat color areas and one or two simple shadow planes, no glossy anime fashion rendering, no intricate textile patterns. Near-frontal standing view, complete head, hands, carried occupational object and both shoes, generous transparent margin, feet at consistent baseline. Transparent background, no halo or vignette, scenery, floor, lettering, symbol, logo, watermark or border. Preserve personal dignity; no morality ranking from 0-soul state. Avoid recognizable franchise character designs. A-Tang, a shy introverted sugar-painting spirit and stall owner. Soft round face, narrow eyebrows, neat short bangs above brows, amber short curly hair with exactly two recognizable fixed curved locks beside the ears. Short rounded shoulder cape in warm honey and muted cream. One thin copper sugar ladle and one SMALL original unfinished-loop sugar-painting sample, held close to her body. Head lowered slightly, shoulders and arms drawn inward, gaze gently avoiding direct contact. She is able to draw skillfully even though speech is sparse. No writing on sugar sample.

### s0_ac — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-ca90e29d-9de5-45dc-963f-066f67ef90a3.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original character in ONE 0-soul state, a standalone full-body game illustration; no panels or extra figures. Same approved visual language as a cute simplified 2D Chinese gentle-ghost night-market mobile game: about four heads tall, compact adult proportions, clear rounded silhouette, moderately thick colored outline, broad flat color areas and one or two simple shadow planes, no glossy anime fashion rendering, no intricate textile patterns. Near-frontal standing view, complete head, hands, carried occupational object and both shoes, generous transparent margin, feet at consistent baseline. Transparent background, no halo or vignette, scenery, floor, lettering, symbol, logo, watermark or border. Preserve personal dignity; no morality ranking from 0-soul state. Avoid recognizable franchise character designs. A-Tan, a young adult male stove-fire spirit who runs a charcoal skewer stall. Long rounded face with slightly square jaw, two short straight eyebrows, charcoal-black short tousled hair with stable warm-orange tips. Simple charcoal-gray work apron/bib and one unbranded grilled skewer, no religious stove-god icon. At 0 soul he is slim, tired, has visible under-eye dark circles, and stands with slightly weary shoulders, but handles food attentively. No comic disgust at food, no medical labels. Muted ember orange accent only.

### s0_aj — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-8e93d749-7959-486b-821f-db99f0f082ed.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original character in ONE 0-soul state, a standalone full-body game illustration; no panels or extra figures. Same approved visual language as a cute simplified 2D Chinese gentle-ghost night-market mobile game: about four heads tall, compact adult proportions, clear rounded silhouette, moderately thick colored outline, broad flat color areas and one or two simple shadow planes, no glossy anime fashion rendering, no intricate textile patterns. Near-frontal standing view, complete head, hands, carried occupational object and both shoes, generous transparent margin, feet at consistent baseline. Transparent background, no halo or vignette, scenery, floor, lettering, symbol, logo, watermark or border. Preserve personal dignity; no morality ranking from 0-soul state. Avoid recognizable franchise character designs. A-Jiao, a young adult female ox-family younger sister who owns a hairstyle and grooming shop. Rounded diamond face, slightly pointed chin, clear upturned eye corners, two SHORT gently curved ox horns fixed on either side of the hairline, confident gaze even at 0 soul. Blue-violet clothing with a little warm copper trim, one small original woven cord ornament held between fingers, hairdressing shears safely stored at her waist. 0-soul hair MUST be greasy-looking, flat and tired-looking side-parted hair pressed against scalp, with an unfinished slack cord knot and slightly untidy collar. Keep tool small and expression confident, no horns changing position.

### s0_ad — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-c5ea1f5e-8c4d-4c20-9940-2d7ce6076394.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original character in ONE 0-soul state, a standalone full-body game illustration; no panels or extra figures. Same approved visual language as a cute simplified 2D Chinese gentle-ghost night-market mobile game: about four heads tall, compact adult proportions, clear rounded silhouette, moderately thick colored outline, broad flat color areas and one or two simple shadow planes, no glossy anime fashion rendering, no intricate textile patterns. Near-frontal standing view, complete head, hands, carried occupational object and both shoes, generous transparent margin, feet at consistent baseline. Transparent background, no halo or vignette, scenery, floor, lettering, symbol, logo, watermark or border. Preserve personal dignity; no morality ranking from 0-soul state. Avoid recognizable franchise character designs. A-Deng, a welcoming lantern-spirit young adult who owns a flower-lantern stall. Round face, eyebrow tails turning down gently, one distinctive curved-hook forelock, short hair bundle tied behind head. Warm yellow gentle inner glow in body, deep night blue clothing with a simplified paper-lantern-shaped hem; holding exactly one small unlettered flower lantern close to body. At 0 soul the character warmly welcomes a guest but pauses as if trying to remember a just-heard request, free hand points slightly backward in recalling gesture. Not mute, not sad, no glowing halo outside silhouette, no text on lantern.

### s0_xj — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-90937a3f-318d-4cc0-bbb5-839211d7cb2c.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original character in ONE 0-soul state, a standalone full-body game illustration; no panels or extra figures. Same approved visual language as a cute simplified 2D Chinese gentle-ghost night-market mobile game: about four heads tall, compact adult proportions, clear rounded silhouette, moderately thick colored outline, broad flat color areas and one or two simple shadow planes, no glossy anime fashion rendering, no intricate textile patterns. Near-frontal standing view, complete head, hands, carried occupational object and both shoes, generous transparent margin, feet at consistent baseline. Transparent background, no halo or vignette, scenery, floor, lettering, symbol, logo, watermark or border. Preserve personal dignity; no morality ranking from 0-soul state. Avoid recognizable franchise character designs. Xiao Jin, a young adult FEMALE koi-fish spirit and host of a ring-toss/pitch-pot (touhu) amusement stall. Soft heart-shaped face, curved brows, lake-teal long hair in a high side ponytail whose end forms an ORIGINAL simple fish-fin shape; one short fin-like hair lock fixed beside her cheek. Teal outfit with small coral-red accents, one thin pitch-pot arrow in hand, lively stage-host posture. At 0 soul she wears visibly thick circular-pattern nearsighted glasses and squints at a distant point, leaning a little toward the pot to check it while still able to host. No fish tail covering legs, no specific opera costume, no words or logos.

### ac_s0_r2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-da72dd2c-d74d-4ea5-a690-bdcd10791ba7.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original 0-soul full-body game character in one standalone vertical image. Smooth cute simple 2D Chinese gentle ghost night market MOBILE GAME style, compact four-head-tall adult proportions, clean moderately thick colored outline, large flat readable color blocks with at most two shadow values, no intricate patterns or fashion illustration rendering. Near-frontal standing, whole head, hands, main occupational object and two shoes visible with generous margin. Actual transparent background, no colored halo or vignette, no scenery. No text, marks, logos, watermark, panels, extra people or recognizable existing characters. A-Tan, male stove-fire spirit and charcoal skewer stallkeeper. Long rounded slightly square-jawed face, two short straight brows, charcoal-black SHORT tousled hair with fixed warm orange tips. Simple dark charcoal-gray work apron over modest practical short-sleeved shirt, one small unbranded grilled skewer, no other props. 0 soul: notably slim upper arms/shoulders, visible dark circles below eyes, slight weary slump, still handles skewer attentively and respectfully. Avoid realistic anime adult long-legged body, large towel, extra objects, shiny fabric, dramatic lighting and black background.

### aj_s0_r2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-faa57edb-f096-4339-b308-d36528157fff.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original 0-soul full-body game character in one standalone vertical image. Smooth cute simple 2D Chinese gentle ghost night market MOBILE GAME style, compact four-head-tall adult proportions, clean moderately thick colored outline, large flat readable color blocks with at most two shadow values, no intricate patterns or fashion illustration rendering. Near-frontal standing, whole head, hands, main occupational object and two shoes visible with generous margin. Actual transparent background, no colored halo or vignette, no scenery. No text, marks, logos, watermark, panels, extra people or recognizable existing characters. A-Jiao, female ox-family younger sister running a hairstyle shop. Rounded diamond face, slightly pointed chin, clear upturned eye corners, two SHORT gently curved ox horns in fixed symmetric hairline positions. 0-soul hair is emphatically GREASY, FLAT, pressed onto scalp with a clear tired center or side PART; it is NOT a polished bun, not fluffy, not fashionable. She maintains a confident knowing gaze because aesthetic judgement remains excellent. Blue-violet modest practical outfit with tiny warm copper accents, slightly untidy collar, one small original partly loose woven cord knot between fingers, small shears stored at waist. Keep total decoration sparse, no long tassels or elaborate robes. No dramatic background.

### xj_s0_r2 — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-3d01e310-7571-4c82-80bf-991a4b9a258b.png`。
- 输入图片：无；仅获批文字方案。
- 完整实际提示词：

> Use case: stylized-concept. Create exactly ONE original 0-soul full-body game character in one standalone vertical image. Smooth cute simple 2D Chinese gentle ghost night market MOBILE GAME style, compact four-head-tall adult proportions, clean moderately thick colored outline, large flat readable color blocks with at most two shadow values, no intricate patterns or fashion illustration rendering. Near-frontal standing, whole head, hands, main occupational object and two shoes visible with generous margin. Actual transparent background, no colored halo or vignette, no scenery. No text, marks, logos, watermark, panels, extra people or recognizable existing characters. Xiao Jin, young adult FEMALE koi-fish spirit who hosts a Chinese pitch-pot game stall. Soft heart-shaped face and curved brows, lake-teal hair in ONE high side ponytail, ponytail tip a small original fish-fin silhouette, one short fin-shaped hair lock beside cheek. Simple modest teal and cream work outfit with coral-red small accents, not layered fantasy robes. Exactly ONE thin pitch-pot arrow in hand; DO NOT show a pot, other arrows, fish tail, stage, props or scenery. 0 soul: distinctive thick glasses with clear concentric optical rings, squints toward a far guest while still presenting arrow, slight lean to inspect target. All limbs and shoes visible, compact four-head proportions; no anime adult long legs, halo or background.

### at_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-70bad2b4-2212-46b6-837e-8e8b142547b2.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_at_s0.png`。
- 完整实际提示词：

> Input image is the APPROVED same-person A-Tang 0-soul source. Preserve EXACT same face shape, amber short curls, brow-length short bangs, two curved ear-side locks, clothing/cape silhouette and colors, copper ladle and original loop sugar sample, near-frontal full-body proportions, feet baseline and transparent background. Change ONLY her 2-soul state: shoulders open moderately, chin lifts, she turns the small sugar sample visibly toward the viewer, makes some eye contact while retaining slight nervousness. Same person, same outfit and objects. Do not invent new clothes/flowers/props or change age, hair, identity or scene. No text, halo, floor, panel or vignette.

### at_s3 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-519ad15d-869d-4e1d-80e1-cce125e33346.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_at_s0.png`。
- 完整实际提示词：

> Input image is the APPROVED same-person A-Tang 0-soul source. Preserve EXACT same face shape, amber short curls, short bangs, two curved ear-side locks, cape and clothing shape/colors, copper ladle, unfinished-loop sugar sample, near-frontal full-body scale and transparent background. Change ONLY her 3-soul state: stand with both arms openly welcoming, raise and present the same small sugar sample to an imagined guest, direct confident eye contact and a warm outgoing smile. She remains careful about sugar painting. Keep full head, hands, prop, both shoes and foot position; no new props, hair, scene, lettering, halo or panel.

### ad_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-46701d79-b0be-4098-b5ad-2f183cf3e940.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ad_s0.png`。
- 完整实际提示词：

> Input image is the APPROVED same-person A-Deng 0-soul source. Preserve EXACT same round face, hooked forelock, downturned eyebrow tails, short rear bun, simplified paper-lantern hem, deep night blue and warm yellow colors, ONE small unlettered lantern, near-frontal full body and transparent background. Change ONLY the 2-soul state: clearer purpose while choosing a lantern, a continuous welcoming hand gesture oriented to the guest, one small thoughtful pause visible in expression, lantern held slightly farther forward; gentle contained inner glow only. Do not change clothing, hair, identity or age. No new props, text, halo, scenery, border or panel.

### ad_s3 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-e32d466f-9c88-4d58-a94a-81ca78d89dcc.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ad_s0.png`。
- 完整实际提示词：

> Input image is the APPROVED same-person A-Deng 0-soul source. Preserve EXACT same round face, hooked forelock, downturned eyebrow tails, short rear bun, simplified paper-lantern hem, deep night blue and warm yellow colors, ONE small unlettered lantern, near-frontal full body and transparent background. Change ONLY the 3-soul state: naturally engage an imagined guest, relaxed confident smile, lift the same small lantern forward and slightly up, free hand openly welcomes, contained inner lantern glow appears stable. Keep identity and outfit unchanged; full shoes visible. No new props, words, external halo, scenery, border or panel.

### mt_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-b13c38d6-4bb0-478b-8f50-fcf6df7a7638.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_mt_s0.png`。
- 完整实际提示词：

> Input image is the selected Meng Tao 0-soul full-body game design. Keep the SAME person's round-tapered face, upturned brows, deep berry-red shoulder-length side-parted hair with tucked ear lock, cream and berry-red short-sleeve work overshirt, dark top, bridge-water knot, single unbranded milk-tea cup, compact cute 2D proportions, near-frontal full body. Make ONLY the 2-soul stage: reduce visible ear studs to ONE small stud, close and neaten the work overshirt, shoulder line more level, calm direct eye contact, cup stays in hand. Keep head, both hands and both shoes fully in frame and consistent feet baseline. No new sash/name plaque/extra props, no change to identity or career, no text/logo, scenery, colored halo, border or panel; transparent background.

### mt_s3 — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-7d04fe44-9e92-400c-a0fa-96a8c34ba658.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_mt_s0.png`。
- 完整实际提示词：

> Input image is the selected Meng Tao 0-soul full-body game design. Keep SAME face, deep berry-red shoulder-length side-parted hair/tucked ear lock, same cream and berry-red short-sleeve work overshirt, dark top, tiny bridge-water knot and same unbranded milk-tea cup. Maintain compact cute 2D mobile-game proportions, near-frontal full body, feet baseline. Make ONLY 3-soul stage: no visible ear studs or at most one tiny stud, overshirt neatly closed, poised gentle ladylike bearing, calm soft confident expression, independent shopkeeper resolve remains. No other costume or cup redesign, no green apron/orange sash/name tag, no text/logo, scenery, colored halo, border or multi-stage sheet; transparent background.

### ac_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-072767ee-9518-431f-93e9-c8d95df40e5f.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ac_s0.png`。
- 完整实际提示词：

> Input image is the selected A-Tan 0-soul full-body design. Keep EXACT same slightly square long-round face, short straight brows, charcoal-black short tousled hair with warm orange tips, gray practical shirt and charcoal-gray work apron, one single unbranded grilled skewer, cute simplified 2D mobile-game style and near-frontal full body. Make ONLY 2-soul stage: shoulders and arms noticeably steadier and modestly fuller, under-eye dark circles fade but are still faint, more alert gentle expression, holds the skewer naturally closer to self without exaggerated eating. Same clothes, face, hair and object; complete shoes and hands, transparent background, no halo, scenery, text or panel.

### ac_s3 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-529d4a12-525f-4d25-8b29-54d677cef878.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_ac_s0.png`。
- 完整实际提示词：

> Input image is the selected A-Tan 0-soul full-body design. Keep EXACT same slightly square long-round face, short straight brows, charcoal-black short tousled hair with warm orange tips, practical gray shirt and charcoal-gray work apron, one single unbranded grilled skewer, cute simplified 2D mobile-game style and near-frontal full body. Make ONLY 3-soul stage: healthy sturdy upper arms/shoulders, relaxed upright energetic stance, dark under-eye circles absent, natural friendly expression and skewer held in an easy ready-to-eat position. This is fictional character growth, not a medical claim. Same clothes, face, hair and occupational object; whole shoes and hands, transparent background, no halo, scenery, text or panel.

### aj_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-ed23d8ee-2ce1-4051-b1cd-8d54bdd01525.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_aj_s0.png`。
- 完整实际提示词：

> Input image is the selected A-Jiao 0-soul full-body design. Preserve EXACT same rounded-diamond face, pointed chin, upturned eyes, the TWO same short curved ox horns in the same hairline spots, blue-violet modest hairstyle-shop work outfit with small copper detail, waist-stored shears and same small original woven cord. Preserve near-frontal cute simplified 2D proportions, full feet and transparent background. Make ONLY 2-soul stage: hair is CLEANER and lightly lifted with some volume, but NOT yet a final tall style; collar neatly arranged; she displays woven cord whose pattern complements hem, fingers coordinate smoothly, same confident gaze. No new hair color, horns, costume, props, text, halo, scenery or comparison panel.

### aj_s3 — history/revise

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-e241aa6c-8e51-40dc-ac82-f4c609c37110.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_aj_s0.png`。
- 完整实际提示词：

> Input image is the selected A-Jiao 0-soul full-body design. Preserve EXACT same rounded-diamond face, pointed chin, upturned eyes, TWO short curved ox horns in the SAME hairline spots, blue-violet practical hairstyle-shop outfit with small copper detail, waist-stored shears and same original woven cord. Preserve near-frontal cute simplified 2D proportions, full feet and transparent background. Make ONLY 3-soul stage: hair now clean, spirited, lifted upright and fashionable with a confident sculpted silhouette, while horn placement unchanged; collar neat, woven cord end skillfully tidy and clearly presented, shoulders confident. No new hair color/horns, costume, props, text, halo, scenery or comparison panel.

### xj_s0_r3 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-96945339-05ca-4082-9eed-a37889651248.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/source_images/mgr_xj_s0_candidate_02.png`。
- 完整实际提示词：

> Input image is the selected Xiao Jin 0-soul character candidate. Edit ONLY the lenses of her existing round glasses: make SEVERAL clearly visible concentric optical rings inside EACH lens, unmistakable thick high-nearsighted-glasses cue at small game display size. Keep the SAME young female koi-spirit face, one open eye and one squinting eye, teal high side ponytail with fish-fin tip, cheek fin lock, simple teal/cream outfit and coral accents, single pitch-pot arrow, whole body pose, clean silhouette, shoe placement, transparent background and no pot. No other visual changes. No lettering, logo, scenery, halo, panel, other character or new props.

### xj_s2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-0e6009e7-e760-43ba-833c-3963bb41182c.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_xj_s0.png`。
- 完整实际提示词：

> Input is selected Xiao Jin 0-soul full-body character. Preserve EXACT SAME young female koi-spirit face, teal high side ponytail with small fish-fin tip, short fin-like cheek lock, cream-and-teal modest work outfit with coral accents, ONE thin pitch-pot arrow, compact cute 2D full-body near-frontal proportions, shoes and transparent background. Make ONLY 2-soul stage: she sees distant shapes more accurately, eye contact and host presentation more open. Her GLASSES REMAIN but the concentric optical rings are lighter/subtler and frame slightly lighter than 0 soul. Keep ONE arrow and no pot, fish tail, stage, extra prop or word; no colored halo or comparison board.

### xj_s3 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-b2837fd2-5274-44ff-8511-e8bec54c8b8a.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/characters/mgr_xj_s0.png`。
- 完整实际提示词：

> Input is selected Xiao Jin 0-soul full-body character. Preserve EXACT SAME young female koi-spirit face, teal high side ponytail with small fish-fin tip, short fin-like cheek lock, cream-and-teal modest work outfit with coral accents, ONE thin pitch-pot arrow, compact cute 2D full-body near-frontal proportions, shoes and transparent background. Make ONLY 3-soul stage: she no longer wears visible glasses because contact lenses are mentioned ONLY in separate text, so both eyes are fully visible; raises head, confidently sees a distant guest and joyfully hosts, open graceful stage-hand gesture with same arrow. Still same person and slightly nearsighted in story. Do NOT draw contact lens case or visible lenses, pot, fish tail, extra prop, text, halo or comparison panel.

### mt_s3_r2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-854e57e2-f208-4501-85fd-0f7c95b0e0de.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/source_images/mgr_mt_s3_candidate_01.png`。
- 完整实际提示词：

> This is the approved Meng Tao 3-soul candidate. Make one precise clothing correction ONLY: close and neatly fasten her cream-and-deep-berry short-sleeve work overshirt all the way down the center, as in her 2-soul state; do not leave it open at waist. Keep exactly the same face, deep berry shoulder-length side-parted hair, no visible ear studs, calm ladylike expression, posture, cup, original knot, wide dark pants, shoes, near-frontal full body and colors. Transparent background, no new accessories, text, halo, scenery or crop.

### aj_s3_r2 — selected

- 内置原件：`/Users/yuanquan/.codex/generated_images/01a12354-293c-7ac2-9a44-920fbdfcfd30/exec-bf172df1-4ec2-4ee4-881e-296bdfe13358.png`。
- 输入图片：`/Users/yuanquan/Desktop/project/ai-studio-template/ai-studio-001/deliverables/art/U04-MANAGER-PORTRAITS-001/v0.1/source_images/mgr_aj_s3_candidate_01.png`。
- 完整实际提示词：

> This is A-Jiao 3-soul selected candidate. Make one precise hair correction: groom the dark short-to-medium side-part hair into a CLEARLY UPRIGHT, STYLISH sculpted high quiff at the crown, visibly taller and more energetic than the low flat 0-soul hair; keep the same hairline and both short curved ox horns EXACTLY in place, clearly visible. Preserve EXACT SAME face, eyes, blue-violet hairstylist outfit, copper accents, waist shears and comb, small neat cord, confident stance, full body/feet, proportions and transparent background. Change only hair styling, no new props, text, scenery, halo or panel.
