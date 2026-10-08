# U03 六店牌匾修订技术预签 v0.1

状态：**条件预签，非正式切图 Review，非客户端接入许可**。依据为 2026-10-08 只读检查的现有工程和旧交付；Art 本轮制作方案、实际新 PSD/切片尚待同版本核对。用户对制作方案和具体切片效果的两次审批须分别记录。

## 工程基线

- `apps/client/assets/labs/u03/shop_definitions.ts` 固定 `MT_SHOP_01, SHOP_02..06` 的顺序与六个 Prefab 名。六个 Prefab 均含 `body`、`sign`、`ground_contact`；body/sign 本地坐标 `(0,0)`、缩放 `(1,1)`，脚点 `(0,-388)`，对应 1024×1024 源画布 `(512,900)`。两片均是整幅画布同坐标叠合，不能靠移动 Prefab 的 sign 节点修正单店版面。
- 正式工程 12 张 PNG 均位于 `apps/client/assets/units/shops/{milk_tea,sugar_art,charcoal_grill,barber,lantern,pitch_pot}/textures/`，各两片 body/sign，`.meta` 的 image/Texture2D/SpriteFrame 已导入。具体既有路径、逐项 UUID 和 SHA 以 `deliverables/client/U03-SHOP-CLIENT-IMPLEMENT-001/v0.1/RESOURCE_IDENTITY_AND_UUID.md` 为旧基线，实施时须再从当前 `.meta` 复核，不能把旧报告当新版本身份。
- 六个 Prefab UUID 按顺序为 `fcda6688-f33b-458a-8fe9-96c619c8eb09`、`9292333f-8d61-471a-ad72-7f3e7cdd1921`、`9a6dabaf-8b71-4eb8-99d0-9b318a3d66bc`、`6e542de1-ffe7-4b03-bfa8-eb0efc242301`、`b27473c3-9aad-49be-afed-a856881a5bd6`、`50b148c0-c848-41c9-9af5-ef9b0eb3172c`。旧实施报告记录 Scene 强引用与这些 UUID 对齐。`shop_definitions` 无需为牌面改名。
- 旧 R3 构建与 390×844、720×1280 Web 冒烟见 `deliverables/client/U03-SHOP-CLIENT-IMPLEMENT-001/v0.1/IMPLEMENTATION_REPORT.md`。它只证明旧版可运行；新切片的导入、构建、运行、遮挡与性能均为 `NOT_TESTED`。

## 牌面几何与遮挡预案

| 店 | 本轮牌面 | 技术检查点 |
|---|---|---|
| 01 | 右侧小木挂牌，奶茶 logo | 旧牌在中部；右悬牌应在现有 1024 画布与主体可见轮廓内留透明边距。牌体与挂绳、檐口连接处在 sign 前景层，不能悬空或被 body 檐错误遮住；若要让屋檐压住挂点，需从既有 PSD 调整层的遮挡并在两片重组图核验。不能通过整体平移 Sprite 改动脚点。 |
| 02 | 车前下移立牌，糖浆勺与糖图案 | 旧字位约 x816–907、y479–701（旧候选清单），已靠右且较低。新立牌再下移须确认仍高于地面接触区、不压车轮/车前工作物、不超主体和画布右下边界；若确需压在车前，立牌作为 sign 前景覆盖 body，但车轮、台面关键识别物不得误遮。旧版字符 bbox 不是新牌边界或通过证明。 |
| 03 | “现烤”文字 | 保留牌体、挂件和原位置，核字形完整、与炭烤设备识别物不相互遮挡。 |
| 04 | 剪梳图案 | 无字体依赖；检查在实际显示比例下剪刀/梳子的负形仍可辨，且不改主体轮廓。 |
| 05 | “花灯”文字 | 保留牌体、原光源层次和灯笼轮廓，检查字的对比度。 |
| 06 | “投壶”文字 | 保留竖牌位置，确认两字顺序、可读性及不压投壶主体。 |

对 01、02，Art 方案应给出新 sign 的 alpha bbox、body alpha bbox、两片重组、旧新版同画幅并排、390×844/720×1280 同尺度视窗，以及挂点/车前重叠局部图。以新图像数据比较画布边缘留白和旧整体可见范围；若新牌超出画布或显著扩大原主体可见边界，先报 Art/Master 做视觉取舍，不擅自缩放或移动整店。预计贴图逻辑仍为每店两张 1024×1024 RGBA；六店原始像素上限约 48 MiB（12×1024²×4），实际打包、驻留、合批和 DrawCall 要在新导入与运行后测，不能据此估算宣称达标。

## 获批后接入顺序

1. Art 制作方案先获用户批准；Art 与 Tech 对该批同版本 PSD、1024 画布、脚点、两片映射、遮挡和输出范围签认。Art 从当前 PSD 定向修订，输出新切片与同尺度重组。具体切片效果再由用户明确批准。
2. Client 记录获批切片每张 SHA-256 与源 PSD 版本；仅替换原 12 路径中**牌面有变化的 sign PNG**，body 若字节不变则不复制；保留既有 `.meta`、Prefab、Scene 及 UUID，不删除重建资产。若需改变 body 才能处理遮挡，应将该差异纳入 Art 方案和获批切片范围。
3. 替换后从 `.meta` 复核 image、`@6c48a` Texture2D、`@f9941` SpriteFrame UUID 与 Prefab 引用仍一致；核 PNG 1024×1024、alpha、脚点、两片同坐标重组、SHA 和清单。Creator 3.8.8 导入后核 AssetDB `imported: true`，再按项目 Cocos CLI 工作流构建独立 Web 输出。
4. 本地 HTTP 打开实际构建，用 Codex 内置浏览器检查 390×844 和 720×1280：六店切换、返回重进、01 悬挂与 02 车前遮挡、全店可见边界、旧资源回归和控制台；留下对应构建 ID、截图、日志、资源版本。性能和平台指标分别实测或标 `NOT_TESTED`。正式功能 QA 与用户最终验收继续按现有门禁执行。

本文件只给制作前技术条件。尚未拿到 Art 同版本方案与新切片，01/02 新轮廓是否越界、实图重组、导入和运行结论均未签为 `PASS`。
