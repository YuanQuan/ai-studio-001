# Client Entry

Default mini-game client baseline: Cocos Creator 3.8.8 + TypeScript.

The version is pinned in `client/COCOS_VERSION`. Use Creator 3.8.8's built-in engine by default; only projects with an explicit engine-customization need should use the matching official `cocos-engine` tag `3.8.8`.

The actual implementation may live under `apps/client/` in the Monorepo. This directory is retained as a project-level entry/readme location for Client Agent guidance if desired.

Client implementation must follow approved Product/UI/Art/VFX/Tech artifacts, use platform adapters for Web/WeChat/Douyin differences, and produce `FEATURE_BRIEF.md` before non-trivial coding plus `IMPLEMENTATION_REPORT.md` after implementation.
