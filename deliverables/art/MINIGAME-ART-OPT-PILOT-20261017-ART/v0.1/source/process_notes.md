# PSD 转换过程及限制

使用 `bggg-creator-image2psd/scripts/image2psd.py assemble`。输入为本任务 `source/originals/` 中从 10 件当前工程 PNG 按原字节复制的文件；`source/psd_manifest.json` 将它们以 `fit=none`、`remove_background=none`、整数位移排列在 3072×2048 资源库画布，输出 `source/optimization_pilot_master.psd` 和 `review/psd_library_preview.png`。`source/psd_full_canvas_layers/` 为 skill 导出的 10 张 PSD 全画布单层 PNG。没有使用 imagegen、去背景、补洞、调色或缩放。

PSD 共有 10 个实际 RGBA 栅格层：奶茶 body/sign、游客 walk00/run00/happy01/happy03/sad04/sad05/sad06、火焰 A。所有层可单独选择和修改当前像素/透明边；它们不具有原生笔触、矢量、文字、被遮挡内容或动画绑定。游客历史 `tourist_body_master.psd` 当前缺失，因此这七层明确是原 PNG 的栅格转换。火焰在原樱花 PSD 中有四个变换后的场景实例，但本 PSD 的 160² 源层来自该版获批 PNG，不冒充场景实例的原生未变换纹理。奶茶原 PSD 四层保留在原位置只读，新资源库的 body/sign 两层是获批导出 PNG 栅格层；原前三层合成→body 和第四层→sign 的可见 RGBA 零差已独立核对。

本 PSD 作为多资产目录，其整体合成预览不是任一单件效果图。`PSD_LAYER_EXPORT_MAP.md` 指定每层的原画布位置与裁片映射；`build_pilot.py` 从**真实 PSD 层通道**读回，再反向平移并导出 10 裁片。ImageMagick 可读该 PSD 的 10 层，源→PSD 层→原尺寸画布→裁片→回置源的 alpha 和全部可见 RGB 均为零差。Photoshop/Photopea 交互打开未在本环境测试，验证范围是 PSD 结构读取、层像素及合成预览。
