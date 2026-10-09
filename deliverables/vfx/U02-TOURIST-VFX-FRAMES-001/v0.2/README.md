# U02 四动作正式序列帧 v0.2

本批 `U02-VFX-A`，实际PNG具体版本待用户Gate2批准。此目录为VFX产出；原Art源、旧正式帧和Client工程保留。

## 审核入口

启动 `node deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/serve-export.mjs`，访问 `http://127.0.0.1:8874/review.html`。审核页直接读输出PNG，四动作各10帧，可暂停、从头播放、固定帧号、显示独立装扮。该页不是Creator正式运行证据。

`preview/contact_sheet.png`：4行依次walk/run/happy/sad，10列00..09，每格256px为原画布的一半。`preview/recomposition.png`：4行同序、3列00/04/09，每格512px，为原画布1:1；独立帽、眼镜、手环按新挂点局部变换重组，主体PNG不含装扮。布局与帧ID见 `preview/PREVIEW_MANIFEST.json`。

## 可重复导出

1. 制作前运行 `node deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/finalize-export.mjs --preflight`，冻结源文件哈希。已存在的SOURCE_PREFLIGHT应保留，不为本批重复建立基线。
2. Art/Tech对 `PRODUCTION_PLAN.md` 同批预签，由Master保存 `PRODUCTION_PRESIGN.json`。未预签服务拒绝写入。
3. 在 `http://127.0.0.1:8874/` 点击“第一阶段：导出4张代表PNG”，只保存walk00/run00/happy04/sad05。导出使用原型原Shader原始512px canvas。运行 `finalize-export.mjs --representatives` 核实PNG并生成黑灰白、左右配件与源/GIF同尺度对照，VFX查看后在 `REPRESENTATIVE_CHECK.json` 记录Owner核对。第二阶段按钮再保存剩余36张；服务无代表核对PASS则拒绝扩批。已有同名PNG拒绝覆盖，修订须新版本目录。
4. 全批出齐运行 `node deliverables/vfx/U02-TOURIST-VFX-FRAMES-001/v0.2/finalize-export.mjs`，核源保护、alpha、walk/run一致性，重算挂点并生成清单与审核图。sharp使用桌面已提供模块，其他环境设置 `U02_SHARP_PATH`。

文件中的foot固定为逻辑地面锚点(256,440)，保留跳起局部位移。`visualFoot`只作运动解释。挂点localAffine为局部坐标变换，实际Client旋转/缩放支持及运行效果待后续技术验证。本版本不是旧20帧manifest的原位更新：新40帧、时序和情绪循环需按同版清单重新接线。

VFX_REVIEW仅是交付核对；具体PNG须用户Gate2批准，随后才可Client正式接入、构建、运行和QA。
