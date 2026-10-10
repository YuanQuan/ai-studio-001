# 来源、权利与生成审计 v0.3

本批唯一画面基线为本项目 `SCENE-CLARITY-REDRAW-ASSET-20261010/v0.2/exports/` 五层，风格参考是当前已接入 U03 六店（`U03-SHOP-FULL-REDRAW-20261009/v0.2/CUT_MANIFEST.json` 的 v0.1 五店、v0.2 第四店）。未输入外部网站图、品牌、字体或其他 IP 图像。2026-10-10 用 Codex 内置 imagegen 的透明背景模式，对 L03、L04、L05 各自全幅独立新绘；退回候选保存在 `source/rejected_*.png` 及 `source/candidate_*.png`，不进入本版正式像素。

| 层 | 本版来源 | SHA-256 | 原生信息 |
| --- | --- | --- | --- |
| L01 | v0.2 正式 PNG 逐字节复制 | `9ee1857cbd0eae8a0367cf4b10d4ed054de8f4e9c8661eb933559e927b081de7` | 继承 v0.2；本轮未生成 |
| L02 | v0.2 正式 PNG 逐字节复制 | `7318c68726700af9051bffcda7af5c130d0bdb2e1f53619ece92f45a52886fbc` | 继承 v0.2；本轮未生成 |
| L03 | `source/new_l03_whole_native.png` | `e0660b5d2bff03f4617ebbfc02a836c8c09b7ad93ea870cdce7b9342fad9cb16` | 2172×724 RGBA；柳林/宽街/右牌楼，中心透明水道 |
| L04 | `source/new_l04_whole_native.png` | `8a102dbbf0fd3bfe8c54765317c29da4e0b8a71bade02508e2f2d6338c009c36` | 2172×724 RGBA；中央单桥/河/灯船 |
| L05 | `source/new_l05_whole_native.png` | `bb5d15d0238a1bbb682841bcf528daba25bd06af93086251a07c460a6f51fc65` | 2172×724 RGBA；左右低草石 |

最终 imagegen 提示均明确“whole full-width layer newly painted from scratch”，要求依对应旧层保持原位/语义/透明，依六店蓝瓦暖木、圆润色块和局部暖灯画风减小深黑阴影、重石缝与强高光。L03 最终提示另明确：唯一桥由 L04 提供，L03 后岸街从两侧接桥肩、中心 x45–55% 留真透明水道，不加中央灯柱/第二拱，右牌楼仍仅两灯。L04 最终提示另明确：唯一中央桥含灯约占 x43.4–56.7%，原高度与栏杆柱尺寸不扩张，桥上四灯、沿岸柱不点灯，石面柔和宽过渡且水面连续。L05 最终提示另明确：左右草石主要限 x0–16%/84–100% 与画幅底部，圆润蓝灰中间调，中心大面积透明，不增物件。工具生成图原件均留 `source/`；正式 PNG 一次 Lanczos 等比规范至 3072×1024，不把插值像素算作新绘细节。PSD 用 bggg-creator-image2psd 按五张正式 PNG 组装，转换未重画。

项目内授权参考与自身生成不等于外部分发许可。未发现文字、商标或可识别外部作品的直接挪用；正式对外分发仍按既有项目权利流程。生成层经 PSD 转换仅可按五个完整栅格层编辑，不是柳叶/石块逐对象可编辑母版；源 PNG 与预览保留。当前只是 Gate2 送审，未接工程。
