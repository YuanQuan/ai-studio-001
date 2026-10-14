# U05 B 组件成品技术元数据静态核对

结论：**通过静态元数据检查**。本记录只核文件及坐标/度量，不作新的效果专业复审，也不表示 Gate2 已批或 Creator 运行通过。

- `CUT_MANIFEST.json` 记录 `LABEL_PLATE_9SLICE` 为 123×45 RGBA；实际 PNG 同尺寸、RGBA，SHA-256 `33cbcab25f95b73ce42f60a0399f17dd51dbf79383aa0ccbc135acabdeaa13df` 与清单一致，源旧空名牌 hash 相同。四边 inset 为 L/R 18、T/B 12；中心 87×21 均为正。十二实例计划宽 123/130/131，源高 44/45；运行高按技术方案 45，旧源个别 44 的定位需 Client 以实际 B 画布热区复核。
- `U05_ART_FONT.png` 实测 1024×1024 RGBA，SHA-256 `b1afe3e4ebb623f97c9c4bb87600075476bab8421531212ad08e9cee07efeb41`。`.fnt` SHA-256 `14f9073139b14aa4b46a389d934dc93f7581804721c881b882995c1ca6101af1`，头部 `pages=1`、`scaleW=scaleH=1024`、`chars count=719`，唯一字符 ID 719 个，与清单字符集逐码点一致。全部 glyph `page=0`、宽高非负、x/y 非负、矩形在 1024 页内；最大右界 1018、下界 874；xadvance 范围 8–31 且均正。`source/font_metrics.json` 已存在，当前仅作静态交接；Creator 的 FNT 解析和实际排版仍待 Client 导入。
- 字体源 SHA-256 `812a6fc1fe54b6d73a419245c32dfeba8aa33104d5be90d1cf6af082007cb71d`、许可 SHA-256 `538078469839b4a2e7ad22bef4ebe41681a4e53749bb2a072144024f1d6d703d` 与旧版 `CUT_MANIFEST.json` 登记完全相同。Art 清单的客户端路径均为 `PLANNED`，UUID 为 null；当前为 Gate2 待批资源。
- PSD、重组图与组件页由 Art 清单登记，本检查未对其视觉效果做结论。图集页数不能推断 DrawCall、驻留内存、帧率；导入、Web 与目标平台均 `NOT_TESTED`。

静态检查时间：2026-10-14。具体批次 `U05-B-COMPONENT-ASSETS-20261014/v0.1`。原 TECH_PRESIGN 四件版本保持不变。
