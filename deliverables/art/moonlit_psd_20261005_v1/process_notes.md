# 四层 PSD 制作与从 PSD 导出验证

日期：2026-10-05。用途：用户要求的实际 PSD 制作模拟及交付检查，待用户查看；未批准为正式游戏接入资源。

## 输入与执行范围

源图为用户上传的 `codex-clipboard-e01c456c-045b-490b-9888-3ad26be83b8e.png`，本目录保留 `original_reference.png`。本次沿用同一源图的已有四层 PNG：`../moonlit_four_layers_v2/`，复制到本目录 `layer_sources/` 后组装。本轮完成的是 image2psd 实际组装与 PSD 回读导出，没有重新抠层、补绘或调用 imagegen。上轮分层与遮挡补绘的制作方式和限制详见该目录 README。

采用 `bggg-creator-image2psd` skill 原有 `scripts/image2psd.py assemble` 脚本，未修改 skill 脚本。项目文件保存于当前游戏仓库的交付目录。四层均保持 2172×724 全画布 PNG、位置 (0,0)、正常混合和 100% 图层透明度；每层已有的逐像素透明通道原样保留。

## 图层与交付

`moonlit_four_layers.psd`：四个独立栅格图层，由下至上为：

1. 天空、月亮、云彩、星星。
2. 山峦、远方建筑。
3. 地面、树木、右侧走廊。
4. 栏杆、桥、前方景物。

PSD 文件内部采用非透明内容包围框和对应坐标存储图层，这是正常的 PSD 存储方式；画布始终为 2172×724。导出的四张 PNG 仍是完整同尺寸画布。

- `overall_from_psd.png`：独立回读保存后的 PSD 图层通道，按图层顺序重组合成的整体效果图。
- `assembly_preview.png`：skill 组装时输出的预览，用于独立对照。
- `psd_full_canvas_layers/`、`four_layers.zip`：四张全画布单层 PNG 及压缩包。
- `manifest.json`：本次组装参数与图层名称。
- `validation.json`：尺寸、图层数、透明通道、可见颜色和合成差异的验证结果。
- `export_from_psd.py`：本次 PSD 原始通道回读、效果图导出及验证脚本，适用于该 skill 写出的 RGB8 普通混合、未压缩栅格 PSD。

## 验证结果与可编辑范围

PSD 回读确认有且仅有四层，中文图层名正确。尺寸 2172×724，逐层透明通道及可见 RGB 与输入 PNG 一致。由 PSD 四层重新生成的效果图与 skill 预览、Pillow 读取的 PSD 内存储合成图逐像素一致，最大 RGB 差值均为 0。

效果图与上传原图的 RGB 通道最大差值为 5/255，平均绝对差值约 0.123/255，这是已有分层的轻微边缘差异。导出画面已目视检查。

可编辑范围：每层可独立隐藏、移动、变换和修改栅格内容；树叶、灯光、桥等未进一步拆成单独对象。隐藏处为上轮推断补绘，沿用其已知限制。本轮没有用 Photoshop 或 Photopea GUI 打开验证，验证范围为 PSD 文件结构、Pillow 可读性、图层通道回读、重新合成及导出图目视检查。
