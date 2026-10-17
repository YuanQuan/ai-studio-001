# 计划资产清单 v0.2
状态：Gate1 方案候选；以下新版路径均为**计划**，尚无新版PSD、PNG或切片。旧资源真实路径、SHA、尺寸及偏移见 `SOURCE_PSD_AUDIT.json`。按现行 `U04-DIALOGUE-LAYERED-ASSET-001/v0.1/ASSET_MANIFEST.json` 保留稳定ID：`U04_PORTRAIT_{STAGE}_BASE`、`U04_FACE_{STAGE}_{STATE}`、`U04_FRONT_{STAGE}`；不更改客户端实际UUID，未来导入后据实登记。

| 范围 | 计划Art母版与输出 | 源/导出规格 | 状态 |
|---|---|---|---|
| MT_S2、AT_S0、AC_S0、AJ_S2 | `deliverables/art/U04-EXPRESSION-REPAIR-ASSET-20261017/v0.1/source/u04_{stage}_dialogue.psd`; `exports/u04_{stage}_face_{state}.png` | PSD 1024×1536；脸源/导出256×256；base/front沿旧坐标 | 计划，待Gate1 |
| AD_S0、XJ_S0 | 同上稳定命名 | PSD 1024×1536；脸源256×256、导出192×192；base/front依旧0.75映射 | 计划，待Gate1 |
| 余12阶段60态 | 同名结构另立批次版本 | 逐阶段沿旧映射，首批后复核 | 延后，未授权扩批 |

每个首批阶段五态共30张合成脸片，另保留各态可准确分离的眉眼嘴语义栅格层、必要skin/shading层（不可精确分离处标记合并编辑限制）、基底与前遮挡；实际最终张数依获批切片方案与变更清单核定。独立输出须含整PSD预览、30态同尺度重组、差异和图层到导出映射；批准前绝不交Client正式接入。

现行Client映射路径模式：`apps/client/assets/units/dialogue/faces/tex_u04_{stage}_face_{state}.png`；基底与前遮挡分别为 `apps/client/assets/units/dialogue/portraits/tex_u04_{stage}_base.png`、`apps/client/assets/units/dialogue/portraits/tex_u04_{stage}_front.png`。首批六阶段均按该模式，路径存在不代表新版已接入。未来新图的Art路径与客户端导入真实UUID须在制作任务中登记。
