# 01 奶茶浅明暗 r3 首样技术后验

批次 `U03-SHOP-FAITHFUL-REDRAW-V03`。Art 已在 `deliverables/art/U03-SHOP-ASSET-001/v0.3/SAMPLE_ART_REVIEW_LIGHT_R3.md` 对用户选定的**中间 v0.2 风格与明暗**给出 01 视觉 `PASS`；本记录只核真实资源与生产契约，不以尺寸、alpha 或 SHA 代替 Art 视觉判断。**技术结论：PASS，可进入 02–06 同批全量预案复签后扩批。** 旧 v0.3 r2 深色稿仍为 `REVISE` 历史。

逐件重算 `SAMPLE_BUILD_REPORT_LIGHT_R3.json` 所列 PSD、body/sign、重组与同画布三面板 SHA，均匹配。PSD SHA `D3FCAD9F…`，可打开为 1024×1024、11 层；独立可见性报告记录参考层隐藏、10 工作层可见及 PSD RGB 预览逐像素一致。新牌分 `sign_hardware_r3`、`sign_board_r3`、`sign_logo_r3`，只具可见像素语义分层，遮挡后的完整背面未重建，已在 Art 报告说明。

`body` SHA `A299B998…` 与用户选中间版 v0.2 body **字节完全相同**，alpha bbox `(142,280,882,900)`；新 `sign` SHA `1D5E5E84…`，alpha bbox `(821,449,943,651)`，右画布余 81 px。两片均 1024×1024 RGBA、同原点，程序重组与 Art 重组图逐像素一致；源脚点 `(512,900)` 保持。新牌源为 986×1595 RGBA 单独高分辨率图，目标牌不是从六店小总览裁切放大。3072×1024 同画布三面板、1170×844 的 390 三列和 2160×1280 的 720 三列均实存且尺寸正确。目视牌挂在右檐，主体灯、瓶罐和窗口可见；体色/明暗符合度以 Art 的逐锚点结论为准。

两片未压缩 RGBA 像素容量估算仍约 8 MiB；实际 Creator 导入、图集、驻留内存、DrawCall、Web/目标设备画面及性能均 `NOT_TESTED`。静态视窗和 PSD 可见性不能冒充运行证据；Photoshop/Photopea 人工开存也未测。后续 02–06 须对中间版明暗基准同批复签并逐店核实，不以 01 技术结果替代其实际结果。六店自行切片完成后按既有流程**直接交用户 Gate2 审核**，无额外成品专业效果复审门禁；批准前 Client 不得替换资源。
