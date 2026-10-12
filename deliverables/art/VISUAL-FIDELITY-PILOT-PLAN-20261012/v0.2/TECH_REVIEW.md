# Tech Lead 独立评审｜奶茶店左檐红灯笼 Gate1 v0.2

结论：`APPROVED`，仅限五份锁定的文字方案。当前获批源为 U03 全店重绘 v0.2 的奶茶店 01，同字节继承 v0.1 的 PSD、body 与 sign。磁盘 `CUT_MANIFEST.json` 的 LF 哈希与 Gate2 所记 CRLF 哈希不同，按换行转换只读重算后精确吻合；两种文件身份已分别登记，未改源文件。

现有 PSD 只有四个区域层，灯面及暖光已烘焙。首样候选是在独立 pilot 中给本店体实例使用小型局部亮度 Effect 和独立材质，复用原 body，仅以局部 mask 调亮度。强度 1.0 必须回到获批全画面 RGB/alpha；动态时 mask 外零差、全画面 alpha 不变，室内小灯和右杯牌不受影响。材质不得泄漏到其他实例，也不得以整店透明度或双叠加冒充局部效果。

当前 body SpriteFrame 为 1024×1024、无 trim、未绑定 atlas、`packable=true`。首样前须核实际 UV、rect、trim、图集/动态合批和 ROI 到采样坐标的映射，及 Creator 3.8.8 Effect/API、采样、混合与色彩路径。约 2 秒单曲线、首尾接缝、打断复位、单实例和静态降级均须实际回放验证。方案预算为 0 生成、1 候选、累计 2 轮修正、4 小时和 0 元新增费用；新增 Draw Call≤1 是首样上限，0 为优化目标；CPU/GPU 各≤0.1 ms/帧仅作参考，mask 增量内存≤0.25 MiB。现无构建、真机性能或动态视觉证据，结果保持 `NOT_TESTED`。

本评审锁定五份方案 SHA-256：

原图实际 SHA-256 与获批清单均为 `fe31c8353f7c1160eeef0cbc2aa33d6d5d447fda4b8fd5607d1e0427f9d18a93`；`ASSET_MANIFEST.json` 仅修正漏写的 `d6`。原图和技术候选范围未变，`APPROVED` 仍仅针对 Gate1 文字方案。

| 文件 | SHA-256 |
|---|---|
| `PRODUCTION_PLAN.md` | `aa5caec7d6bca618f93401e589899169032bde103711bbe46b33e5444b4ff893` |
| `ART_BRIEF.md` | `54a4f6bcea28c8c980af252702a1efbe8f4363f0f202bd27cb0c299a1eb14374` |
| `VISUAL_ANCHORS.md` | `2563cd084124028b8812745fc22bed0c66aeae526cc124f102cf69d26ac926be` |
| `ASSET_MANIFEST.json` | `8b1ea61b163e8cc60efcdd487af8ae7c7d8733f0f0f49286c919f429805e64f5` |
| `VFX_SPEC.md` | `e491937a6d2869dfaa4b9614a63519abf64f1794e914fbe1e4afe77b5c80b0e5` |

`DELIVERABLE.json` 和审批记录由 Master/Producer 收尾核验。自产切图的实际文件和重组效果仍直接交用户 Gate2；本示例由 Owner 留证，正式接入另走适用 QA。
