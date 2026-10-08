# U03 六店首样前来源与权利补充 v0.1

任务 `U03-SHOP-ASSET-001`；核查日 2026-10-06。本文件补充已获用户批准的 Gate1 `RIGHTS_AND_SOURCE.md`，只供首样批 `U03-SAMPLE-A` 同批预签使用，不回写历史审批，也不是法律意见。

| 输入或工具 | 可追溯证据及用途 | 权利核查与边界 |
|---|---|---|
| 用户本次 2172×724 店铺附件 | `deliverables/product/U03-SHOP-SCOPE-001/v0.1/reference/user_shop_reference.png`；2,836,434 字节；SHA-256 `658EF6718C0A030CC59D469128D20B877DB81984F601081151F977FC7110ECCB`；本轮在工作区重新计算一致 | `project/APPROVAL_LOG.md` 的 2026-10-06 17:43:15 登记保留原问题“本次 2172×724 店铺附件是否由本项目生成或制作，且你拥有允许我们将其用于商用改编、制作六店 PSD 与游戏资源的权利？”和用户选择原话“确认拥有并允许上述商用改编”。据此可作本批视觉输入；这不是第三方合同原件，也不自动批准最终六店切图。 |
| 旧第一街 v0.4 | `deliverables/art/ART-DIRECTION-FIRST-STREET-001/v0.4/scenes/night-market-selected-reference.png`；SHA-256 `203ABFFD2D96495A982C0B6D4C12447818288660AD6DEE5987E3010E50E0834B` | 只供旧浅底木框牌匾的材质语汇比较；不裁取、描摹旧牌，不把它作为新图的像素来源。其历史审计状态保持原记录。 |
| 六店经营线索和店形 | 上述用户附件及已批准 `VISUAL_ANCHORS.md`、`SIX_SIGNBOARD_PLAN.md` | 从附件读取店型、顺序、蓝夜暖灯和营业线索；每店重新形成独立画布及层，不从六店全景裁块。生产过程保留每店提示词、生成输出、局部修改、源图和哈希。 |
| 内置 `image_gen` | `C:/Users/admin/.codex/skills/.system/imagegen/SKILL.md`；仅用于同批独立店体位图生成及必要局部编辑 | 使用内置工具，不调用未获授权的 CLI/API 或外部素材服务。公开 [OpenAI Terms of Use](https://openai.com/policies/terms-of-use/) 对用户与 OpenAI 间输出权属作分配，也要求输入权利，并说明输出可能与他人相似；[Service Terms](https://openai.com/policies/service-terms/) 有图像能力条款。本轮未独立核用户账户的具体企业合同或历史生成服务链，不把公开条款视为第三方权利清除。实际调用与文件哈希须在出图后追加到本任务来源清单。 |
| `bggg-creator-image2psd` | `C:/Users/admin/.codex/skills/bggg-creator-image2psd/scripts/image2psd.py`，SHA-256 `AF7217E0F3DAD1EDAF7EB4017C717CC49C6CE45D35BE88A00C0D2F284B390EBD`；同目录 `LICENSE` 为 MIT，Copyright 2026 BGGG | 只读调用脚本，在本任务目录内保存源图、全画布语义层、manifest、PSD 和预览。PSD 的栅格层可分别编辑，不冒称图像模型输出天然具有隐藏结构；若用分割/补洞，逐层说明重建范围并做同尺度对照。工具脚本和依赖不并入游戏运行资源。 |
| 六块牌匾字 | 见同目录 `LETTERING_SOURCE_AND_LICENSE.md` | 走本批原创手绘字稿路径：不使用参考图里的伪字、不描摹现成字体、不把系统字体回退渲染作为生产字形；每个字的路径、绘制记录、牌匾 SVG 中间源和 PNG/PSD 映射留档。开图前只锁方法，不宣称字稿已存在。 |

**相似风险初筛**：附件整体是通用中式夜市题材；可见的奶茶大杯和理发大剪刀必须去除。后续单店实图重点检查是否意外形成可识别品牌标志、特定现有作品的独特店装、商业招牌字体或人物/IP 形象。糖画剪影、灯群、理发柱和壶箭按普通经营线索重新组织，不复刻单一外部作品。生成工具输出也要检查可识别相似性；若出现具体近似对象，停该店生产并交 Master 处理，不能仅换色规避。

**当前结论**：用户对本次附件的商用改编授权声明已记录，首样输入来源条件有可追溯依据；原创字形路径和所用工具许可路径已明确，实字稿与工具输出尚未生成。若用户声明撤回、出现相反合同证据、实际使用额外第三方字体/图片/笔刷但许可未核清，或生成结果出现具体高度近似对象，立即停止首样并重新预签。Gate2、Client 接入及 QA 均保持独立门禁。
