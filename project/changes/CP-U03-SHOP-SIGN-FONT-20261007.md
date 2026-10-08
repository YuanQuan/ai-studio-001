# U03 六店牌匾字形调整记录

日期：2026-10-07。来源：用户最新指令“牌匾的字体不好看，再换一个，可以用一些免费的字体”。本记录由 Master 建立，供 Art、Tech Lead、Client、QA 对同一变更范围核对；用户的意见直接覆盖当前尚未获 Gate2 批准的旧牌匾字形方向。

## 变更范围

- 保留已批准的六店身份、准确牌文「奶茶、糖画、炭烤、理发、花灯、投壶」、不同牌匾形制和挂位、六店店体、奶茶与理发屋顶去大 LOGO、单店切换交互。
- 把 `U03-SHOP-ASSET-001` 当前手绘 `sign_glyph` 候选换为经核准的免费商用中文字体字形；只定向更新牌匾字层与受其影响的字距、笔宽、明暗和同源导出，不借此重画店体或统一六块牌的外形。
- 旧字稿、PSD 和候选导出保留版本/哈希追溯；新字稿须有视觉对照、所用字体实际文件及版本/SHA、官方来源和许可全文。若只把字体字形栅格化进牌匾 PNG，应明确游戏包是否包含字体文件；任何嵌入、分发或字体文件修改均按实际方式核许可。

## 受影响门禁

1. Art 先产可比较的字体字样与六牌在 390×844 候选视口的真实投影，说明选型理由；正式资源不使用许可不明的字体。
2. 已签 `U03-SAMPLE-A` 和 `U03-FULL-BATCH-B` 的“从空白矢量逐笔自绘”方法不再适用于新字层。Art 与 Tech Lead 须对字体来源、版本、字形制作/导出、PSD 层、牌匾可读性、纹理和原批次其他不变项形成**同一修订输入的预签**；旧签名保留历史，不追认为新字体签名。
3. Art 基于当前 PSD 定向替换六店 `sign_glyph`，重核六店牌文、不同牌形/挂位、PSD 层可见性、候选/正式切片哈希、两片同尺度重组、720×1280 与 390×844 投影及 alpha。`U03-SHOP-ASSET-001` Gate2 仍为 `DRAFT`；具体新版切片与重组完成后由用户单独批准。
4. Client 在 Gate2 批准前不导入新旧候选店图；获批后只接入登记的确切新版切片和真实 UUID。QA 以获批版本和已批 QA Plan 验新字形实际运行可读性，不把静态对照当成 Creator Web 通过。

此变更不修改 Product v0.1 的六店顺序、单店显示、切换状态或付费/经营语义。Art/Tech 若发现选用字体需要改变已批牌匾形制、挂位或 UI 安全区，须就实际差异另行提交受影响评审，不在本记录中默许。

## Master 候选与授权核对（待 Art/Tech 修订预签）

- 候选字体：Ma Shan Zheng Regular，作者声明 `Copyright 2018 The Ma Shan Zheng Project Authors`，SIL Open Font License 1.1。官方仓库：<https://github.com/googlefonts/mashanzheng>；许可全文：<https://github.com/googlefonts/mashanzheng/blob/master/OFL.txt>。
- 2026-10-07 从上述官方仓库取得的实际 TTF 位于 `deliverables/art/U03-SHOP-ASSET-001/v0.1/source/font_candidates/MaShanZheng-Regular.ttf`，SHA-256 为 `6D2546BB189C732A8CA29AF9E22457B152387D158AA459E4AC2CE1E51788B7FB`；同目录保存 `MaShanZheng-OFL.txt`。字体文件内部的具体版本号尚未读取，以文件哈希锁定本次候选。
- 当前只以字体渲染六店牌匾字形 PNG 候选，拟在游戏里使用栅格化字形，不随包分发 TTF。若后续改变为嵌入或分发字体文件，须重新核对实际分发方式并保留 OFL 文本。
- 原字样与新字样同尺度对照：`deliverables/art/U03-SHOP-ASSET-001/v0.1/preview/font_revision/six_sign_font_comparison_mashan.png`。六张 390×844 候选投影和逐店透明全图同目录。该目录仍为预览候选，不是 Gate2 正式切片，也不是 Art/Tech 已批准结论。
