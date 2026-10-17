# 六店长表情修正生产阻塞记录 v0.1

## 当前结果

Gate1 v0.2 方案已获用户批准，方案 SHA-256 为 `691699afcd70db3df4c82490cf7be27be1f3c055f72ac1a69907b2945e9e955a`。Art 同批预签 SHA-256 为 `6c52cb9edd7906ddceea2340c1711695c0d3ad1692fab6414377487916ec4eeb`，Tech 对该版已签 `APPROVED`，Producer 已记录 Gate1 Task `DONE`。因此首张代表样张具备开工门禁。

Art 已实际检查六张获批人物源图及六张现行旧脸片；输入整理见 `inputs/CLIENT_INPUTS_MANIFEST.json`。首张 MT_S2 surprised 编辑目标由获批 `approved_original_mt_s2.png`（SHA-256 `edfcb4fde3b221b6cc4a74da42c9f3cac8d2dc29745c96a4de298f98255173d4`）以原坐标 `[360,100,616,356]` 裁为256×256局部图，并经 `view_image` 检查。实际调用路径为 `inputs/mt_s2_approved_face_256.png`，调用前 SHA-256 `57e8745efe0003225790ad87c2ed7f73ab4cb1a91137a23d7d4d57ad5fa97faf`；实际提示全文在 `prompts/mt_s2_surprised_01_actual.txt`。

内置 `image_gen.imagegen` 首次调用约121秒后返回原始错误：`image generation failed: connection failed: error sending request`。工具没有返回请求 ID、图像或输出路径。2026-10-17 11:41:29 +08:00 检查 `~/.codex/generated_images` 近10分钟新文件为零，未找到可确认候选。调用确切起点未单独计时，结束观察时间及约121秒工具等待写入 `PRODUCTION_LEDGER.json`；不推断请求是否在远端消耗。该调用按 `UNKNOWN_COUNTED` 保守占用1次，总批上限48仍生效。没有重复发送 MT 请求，也没有发送 AT 或其他情绪请求。Art B 已由 Master 暂停，其独立调用数为0。已确认新候选数为0。

调用后编码支持流程写入同名 MT 输入文件，其当前 SHA-256 为 `fe652f718cf3fddd81c5f84fab05ea690be5c85b51d43b01cff5c14709769603`。Art 按同一 ImageMagick 命令在新路径重建，重建文件 SHA-256 为 `76f00d018984bc8c44aa8844eb11ff7b4d91002a699c72e8193bbd6f3254ce07`，未匹配调用前字节哈希。已用 Pillow 解码 RGBA 逐像素检查：当前流程文件与重建文件均等于批准源同 ROI 裁切，像素一致；但首调用时文件原字节未另存，无法再复验该原件。账本保留调用时已记录的哈希，不将现文件冒称原文件。

## 已做的非生成检查

- 六个获批源图与六个旧脸片实际查看；阿炭0魂黑眼圈、阿角男性、小锦0魂圈纹眼镜身份锚点明确。小锦旧重组脸近景可见镜圈叠层复杂，后续须只在前遮挡显示一次，当前没有新修复图。
- `SOURCE_REGISTRY.json` 保留六阶段的批准源、旧PSD、旧base/face/front的真实路径和SHA。`inputs/CLIENT_INPUTS_MANIFEST.json` 记录六张256脸裁剪与旧组合参考及实际SHA。原PSD与Client正式资源未改。
- 本批没有引入外部图片或字体；工具条款记录不作为第三方输入权属证明。

## 停止范围与恢复条件

当前无法取得可审的首张新图，故六代表样张 Art 实图 Review、Tech 实测、扩批复签、余24态、六份新版PSD、30脸片、重组与Gate2具体版本审核均未执行，状态为 `NOT_TESTED`。现行 Gate2 `ARTIFACT_APPROVAL.json` 维持 `DRAFT`，未送 `USER_REVIEW`；旧资源不可作为新图交付。

内置图像工具有可查询结果或连接恢复的可靠证据后，先核原请求是否产生输出及预算归属；不能查询时保持本次 `UNKNOWN_COUNTED` 且不重发同一高成本请求。由 Master 重新确认可执行分支后，从尚未调用的独立代表态恢复，仍按同批样张门槛与48次总额执行。不得静默转 CLI/API fallback。此阻塞是本轮实际工具连接错误，不等于永久认定工具不可用。
