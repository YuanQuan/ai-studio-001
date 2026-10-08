# U03 六店牌匾同批技术制作预签 v0.2

批次：`U03-SHOP-SIGN-REVISION-V02`，与 `deliverables/art/U03-SHOP-ASSET-001/v0.2/ART_PRODUCTION_PRESIGN_V02.json` 的 Art 同批签认一致。结论：**首张样张可按 Art v0.2 已获用户批准的制作方案开工**。本预签只覆盖六店现有 PSD 的牌匾局部修订、01 旧牌暴露的 body 缺口修补，以及 02 车前小牌；不批准改画幅、重绘整店、扩大资产范围、正式切片效果或 Client 接入。方案变更源格式、工具、尺寸、动画/层级或资产范围，须在下一张图前复签。

## 同版本与现有源核对

| 文件 | SHA-256 |
|---|---|
| `deliverables/art/U03-SHOP-ASSET-001/v0.2/PRODUCTION_PLAN.md` | `8C193C9E43B8AE6F89AAC816D06DD70A72BC672E27141FC384A698F5561BFA7D` |
| `deliverables/art/U03-SHOP-ASSET-001/v0.2/VISUAL_ANCHORS.md` | `32D039DA35BDDB03F83D800CE1DB22B404ABB19D122E45163565AAB9441BAACD` |
| `deliverables/art/U03-SHOP-ASSET-001/v0.2/SOURCE_FEASIBILITY.md` | `3706A0BF82ADF6142F5EBD95C7CF49247DF46C2758E7D5F403287C2A4A687CE4` |

按 v0.1 Gate2 六张 PSD 的 `source/psd_work/shop_XX/<variant>/manifest.json` 核得图层数依次 **10/8/10/10/9/9**，逐项 `layer_sources` 文件缺失数均为 **0**。对应 variant 为 `full_redraw_v04 / zcool_b92_v03 / zcool_b92_v03 / full_redraw_v03 / zcool_b92_v03 / zcool_b92_v03`；旧可见性报告只作为已有分层记录，本轮未打开编辑器实测新 PSD 保存/导出。新版本须继承并保留历史原件、参考层和层到导出映射。

六店均使用 1024×1024 RGBA 全画布；脚点 `(512,900)`；body、sign 两片同画幅同坐标叠合。现有 Prefab 的 body/sign 均在本地 `(0,0)`、`(1,1)`，ground_contact 在 `(0,-388)`，不靠移动 sign 节点处理牌位。原正式资产已导入，尚未获第二次用户审批不得覆盖。

## 首图边界与预算

- **01**：移除旧中牌会露出旧 body 的透明矩形缺口，仅在该暴露区域由原 PSD 语义层局部补画；新 body 与 sign 均列入后续切片/用户审批。右檐小木牌挂点须与檐口、灯和窗口协调，提交新旧 body/sign alpha bbox、画布边距和局部遮挡图。不得扩大为屋顶图标或改店型。
- **02**：旧侧牌不在 body，优先复用原 body 字节；新车前立牌放在 sign 前景，核糖勺、浆线、字与车体的遮挡，不盖车轮、糖画主体或地面接触区。确认右下画布边距及同尺度可见边界；若确需修 body，限定补画、记录差异并一并送审。
- **03–06**：03/04 只动获批牌面范围；05/06 若旧像素满足目标，沿用原 SHA，不为凑 12 张重写。03 的“现”用已核官方 OFL 字体渲栅格候选，与旧“烤”字效是否协调由 Art 样张实图判断。
- 预算估算：每店 body/sign 各一张 1024² RGBA，共 12 张，未压缩像素上限约 **48 MiB**（12×1024×1024×4），仅是资源面面积估算。纹理导入格式、图集页数、DrawCall、实际驻留、压缩、目标设备性能、alpha 范围和投影尺寸仍为 `NOT_TESTED`；样张后按新图实测复核，不据估算放行。

## 字体来源与权限

已将官方上游 OFL 与 TTF 下载至 Art `v0.2/source/rights/` 本地核验目录，详见 `RIGHTS_SOURCE.md`。OFL SHA-256 `538078469839B4A2E7AD22BEF4EBE41681A4E53749BB2A072144024F1D6D703D`；官方 TTF SHA-256 `812A6FC1FE54B6D73A419245C32DFEBA8AA33104D5BE90D1CF6AF082007CB71D`。旧 wordshub TTF SHA-256 `302D8DEE7D2CB7D25D6BC89399E43513D2CAFD031862BD46BCE47F573C68807E`，字节与“现/烤/糖”96 px 栅格均不同。新“现”可走官方 OFL 文件；不必因缺少站酷网页原包而暂停该路线。旧字层可继承旧 PSD 像素，不把聚合站字体当官方文件新渲染。TTF 被本目录 `.gitignore` 排除，不入客户端或 Git。

## 后续门禁

Art 先以 01/02 可编辑样张提供 PSD 修订、局部补画图、alpha bbox、旧新同尺度重组、390×844 与 720×1280 静态视窗，逐锚点自审；Tech 随后按实图复核边界、层序与贴图预算，批量扩展前如有方案变更复签。正式自切片完成后执行 Agent 核清单/重组并直接呈用户作**第二次具体切片效果审批**；批准前 Client 不得替换现有 PNG。导入、Creator 构建、Web 运行和目标平台性能另记实测，当前均未发生。
