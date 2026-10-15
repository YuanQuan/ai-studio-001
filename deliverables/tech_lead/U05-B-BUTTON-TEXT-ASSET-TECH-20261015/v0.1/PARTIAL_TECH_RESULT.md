# v0.3 按钮文字拆层部分技术结果

结论：**核心 PSD/图像/GIF 的可核元数据通过，交付包 BLOCKED**。Art 唯一候选已产出并停止制作；`CUT_MANIFEST.json`、`ASSET_MANIFEST.md`、`PRODUCTION_LEDGER.json` 和 `DELIVERABLE.json` 在 v0.3 目录均未实存。Art 报批量写入脚本发生 `SyntaxError`，清单步骤未执行；约 199 秒活动已触及本次 140 秒制作核验加 60 秒整理放行边界。此处只记录 Owner 交接，不把未闭合净活动推断为精确超时秒数，也不追认继续制作。

独立只读核验：正式候选 `source/workspace_b_master.psd` SHA `782e29c5f408ee6020c5ae664da1b52756b5c14c18b841dced792eeed6fafc61`，Pillow 可解码 1024×1536、73 个 frame/layer；`source/psd_manifest_full.json` 实有 73 层。PSD 预览与 v0.3 `review/reconstructed.png` SHA 同为 `ef101b99caa8511d0cb6a19f91bd183ea83570bcb0303baa784cbb9f946ee947`，且相对已冻结 v0.2 中性图 RGB 不同像素 **0**。`review/animation_preview.gif` SHA `587218be8fe486512b2441b3558eb396b1afa3f04edf43acd491eb9a4d35040a`，可解码 39 个存储帧、画布 360×640、总时长 3900ms；44 个是逻辑采样项。v0.1/v0.2 已锁来源清单分别 8/8 与 6/6 SHA 匹配，旧文件未被当前候选改写。

缺失的清单使稳定 ID、实际切片路径/尺寸/alpha/SHA、客户端计划路径、UUID=`null`、PSD层映射和制作活动账本无法作为完整正式交付核验。最低成本的后续修复是 Art 在新的授权与可核活动余额下，将清单写入步骤单独运行：先用语法检查定位原批量脚本错误，再只读取当前已产文件生成登记，逐项核路径与 SHA；不得重渲染 PNG/GIF/PSD 或把缺项填成计划路径/虚构 UUID。清单实存后 Tech 再做一次独立元数据核验。本意见不代 Art 写文件，不增加效果专业复审门禁；具体资源 Gate2 未批准，Client 不得正式导入。

闭合范围可再收窄：现有 v0.2 Component `exports/` 已有 12 原料、共用 `LABEL_PLATE_9SLICE`、BMFont、杯/按钮等正式 PNG/FNT，可在 v0.3 清单中按**实际既有路径和 SHA**引用，不应为“归档齐全”复制同字节文件。现有交互 v0.1 `exports/` 已有顾客身体、四脸（含失落）、辅助补间与 `STATIC_BARE_PATCH04.png`，同样可核身份后引用。v0.3 新增且已实存的源是 `source/full_canvas_layers/TEXT_LABELS_HEADER_full.png` 与 `TEXT_BOTTOM_ACTIONS_full.png`；若正式资源契约需要把它们作为独立运行切片，才从这两张冻结 1024×1536 RGBA 层按可见 alpha 外接框做**确定性裁剪导出**，记录全画布源坐标、裁剪尺寸、透明边/锚点和新 SHA，不能将计划 `exports/` 路径当已产。`SELECTED_TRIO_TABLE` 和 0.78 订单杯是重组/动画表现，运行端原有三槽原料与订单杯层可复用；是否登记为单独切片应以已批资源契约为准，不应静默增新图。当前必须补的是实际 `CUT_MANIFEST.json`、`ASSET_MANIFEST.md`、`PRODUCTION_LEDGER.json`、`DELIVERABLE.json`，并逐项核证路径、尺寸/alpha、稳定 ID、PSD 层映射、Client 路径仅计划及 UUID=null。

Root 给出的 FULL 保守剩余约 **12.852 秒**；若用户额外批准 2 分钟且旧用量不清零，名义余量约 **132.852 秒**。只做既有文件登记和至多两张文字层的确定性裁剪，技术上可设计为一次短执行；但四份清单、裁剪/alpha/锚点核验和失败脚本修复的实际耗时尚无证据，**不能保证** 2 分钟足够。建议先把语法错误定位与清单字段映射写成可核输入，再在新活动审计后设例如 ≤90 秒执行核验、≥30 秒整理的更严停止线，剩余约12.852秒缓冲；若需重做大批切片、修已有画面或无法在限额内核完，立即停并升级，不以截断清单冒充完成。
