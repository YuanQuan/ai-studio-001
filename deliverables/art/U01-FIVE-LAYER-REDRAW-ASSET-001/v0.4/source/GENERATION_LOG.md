# U01 v0.4 S05 内置图像生成原始记录

- 目的：只核水前街后、桥左右接后岸横街的空间纠正；正式目标仍3840×1024五层，S05不是成品。
- 预签：Art/Tech 对 `PREFLIGHT_PLAN.md` SHA-256 `81d63b2ddd471cea84eb93a0e9fb01ccbdcde276d7bb902af13d9b1efa859837` 和 `TOOLCHAIN_AUDIT.md` SHA-256 `297f3ea4d85360db25a425d7418a8d75aa0fc7bad2db235be598641f97d42612` 同版 `APPROVED` 后才调用。
- 工具：内置 `image_gen` 编辑参考，`transparent_background=false`。输入的唯一图像参考是已批 `deliverables/art/moonlit_psd_20261005_v2_raw/overall_from_psd.png`，SHA-256 `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd`；调用前已实看。空间语义还按已评审 `v0.3/corrections/SPATIAL_ORDER_CORRECTION.md` 和 `CORRECTED_GENERATION_PROMPT.md`。旧S03/S04未输入。
- 工具原始输出：`/Users/yuanquan/.codex/generated_images/01a11aa8-0923-7162-8297-9cfe19f56268/exec-e3d03f78-73b3-4c93-b72e-5c4485c9e984.png`。逐字节复制为 `source/sample_complete_s05.png`，保留原始输出。
- 实测：2172×724 RGB PNG，SHA-256 `acdd84a59069f0be45bc39fec7a657bcadfa5f28d8096ebf3fd5977a09d035ac`。无3840×1024真实源、五层或PSD。
- 原始提示词：

```text
Create ONE complete newly painted composition sample for a Chinese fantasy moonlit mobile-game panorama. This sample tests spatial layout; render at the image tool's native resolution. The eventual production specification is 3840×1024 and five layers, but do not fake that resolution by enlarging old pixels. Use the attached APPROVED ORIGINAL composite as the ONLY image reference for visual identity, spatial ordering, bridge geometry, and calm painterly style. Do not use or recreate the rejected later samples.

Preserve the original front-to-back order exactly. From top to bottom the scene has: a somewhat TALLER visible deep blue night sky and warm moon; misty mountains and distant lit buildings; willow grove; a horizontal STONE-PAVED STREET ON THE FAR BANK; then a somewhat NARROWER band of river IN THE FOREGROUND across the bottom; small water plants nearest the viewer in front of that water, mainly at the lower left and lower right corners. Widen the visible paving only in its original FAR-BANK position, and continue that far-bank street naturally to both left and right edges. Keep the river at the bottom IN FRONT OF the street even though less of it is visible. The bottom center must remain water, not a new cobbled foreground plaza or street. Do not put the river behind the street or its railing.

The CENTRAL STONE ARCH BRIDGE is embedded in the HORIZONTAL far-bank street, as in the original reference. The walkable bridge deck carries that street from LEFT TO RIGHT, meeting the street at both ends. Its SIDE ARCH faces the viewer and the foreground water, with water passing through/under the arch. Preserve the original bridge's relative scale, side-on silhouette, railings, warm lamps, and believable depth. There is NO road from the bottom edge toward the arch opening; do not make a frontal approach road or make the arch into a passage for people. Keep a few small glowing lamp boats on the foreground water. Keep the right gateway on the far bank on the right, with a blank signboard.

Repaint with credible new detail in the bridge stones, far-bank paving, railing, willows, and water ripples, while preserving the friendly smooth non-pixel Chinese fantasy illustration: midnight blues and restrained warm amber light. The widened street, reduced river, and taller sky should feel like the same original place with adjusted visible areas, not a redesigned world. No characters, Fengdu lettering, bridge plaque, spirit banners, other text, logos or watermark. One continuous opaque scene, no collage, no split panels, no transparency.
```

## S05R 一次后岸街道定向修订

- 前置：`PREFLIGHT_AMENDMENT_S05R.md` SHA-256 `584024d1a2949a72ecd20bf21687977fa0478b35c03424c80459d133182d69f7`，Art/Tech同SHA补充预签 `APPROVED`。
- 输入顺序：第一图 `source/sample_complete_s05.png`（SHA `acdd84a59069f0be45bc39fec7a657bcadfa5f28d8096ebf3fd5977a09d035ac`）是当前编辑目标；第二图是已批原合成（SHA `8d5f91396f0c0a5f0f974cd09a3c613dc68b648a4276a4f7dd46a2221a7ae6bd`）只作空间/风格参考。两图均在调用前实看；S03/S04未输入。
- 工具：内置 `image_gen`，`transparent_background=false`，只一次定向修订。
- 原始输出：`/Users/yuanquan/.codex/generated_images/01a11aa8-0923-7162-8297-9cfe19f56268/exec-3dcaacf5-85a7-4b78-ac1e-828bf33bbc32.png`；逐字节复制为 `source/sample_complete_s05r.png`。
- 实测：2172×724 RGB PNG，SHA-256 `d90bcd922de7a043e892a30beebf0591d0e72d0ff942e98a7f97e1483c8a8511`。此为方向样张，仍无3840×1024新绘源或正式五层。
- 原始提示词：

```text
Precise localized edit. IMAGE 1 is the current S05 moonlit panorama sample and is the EDIT TARGET. IMAGE 2 is the original approved composite and is ONLY a reference for the correct water-in-front, street-behind, side-view bridge geometry and visual identity. Keep S05's successful spatial correction and overall composition.

Make ONE visible change: make the stone-paved HORIZONTAL STREET ON THE FAR BANK noticeably deeper/wider in its visible front-to-back paving area. Move ONLY the street's BACK EDGE farther away from the viewer, upward into a modest portion of the shrubs immediately behind the street, painting newly exposed stone paving there. The front edge of the street, its chain railing, curb, shoreline, foreground water band, boats, and water plants must stay exactly in their current positions. Do NOT expand the street toward the water or the bottom image edge. Do not replace foreground water with a cobbled plaza.

Keep the central stone arch bridge unchanged in placement, scale, side-on view, and basic shape. The bridge deck remains part of the left-to-right far-bank street and meets that street at both ends. Its side arch faces the viewer and foreground water. There must be NO road from the bottom center into the arch. Keep the moon, taller blue sky, mountains, willow grove, distant lit buildings, blank-sign right gateway, lighting, and calm blue-and-amber painterly style stable. The newly widened back-bank paving should follow existing perspective and stone scale continuously on both sides of the bridge, reaching the left and right edges. Shrubs may recede only enough to create this visible extra paving; preserve the willow trees and lush feel.

Do not add characters, text, banners, bridge plaques, logos, watermarks, extra buildings, another bridge, or seams. Output one opaque complete sample at the tool's native resolution. This remains a spatial-direction sample, not a claim of 3840×1024 production resolution.
```
