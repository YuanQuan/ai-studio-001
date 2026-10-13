# 母版编辑范围与来源

`source/scene_sakura_reuse_master.psd` 是 3072×1024、RGB 8-bit 的真实 41 个栅格层母版；图层名对应 `PSD_MANIFEST.json`，按从底到顶叠放。`source/psd_full_canvas_layers/` 保留同坐标透明 PNG，可直接在图像软件里逐层检查。`source/native/` 存全部本批内置生图原件副本；工具默认原件路径同时逐笔写在 `EXECUTION_LEDGER.json`，不以裁切参考代替新绘源。

天空和远景左右非镜像；桥与水岸取左半镜像；树有 A/B 两原型形成四个可移动实例；精灵有 A/B 两原型，水上七实例的火焰、莲座、倒影分别成层，山间五个静态火焰复用同原型。右牌楼、左右近景各自成层。PSD 没有六店、原参考覆盖层、隐藏假层或单张平图遮盖其它层。图层是栅格透明对象，不是矢量、骨骼或可编辑的生成提示词。源图原生分辨率低于部分 3072 宽输出，放大处使用插值，不能声称原生 3072 细节。

`CUT_MANIFEST.json` 的 `instances_bottom_to_top` 是正式切片放置、大小、镜像与动静态的事实源。`source/build_environment.py` 以同一变换生成全景工作层、17 张活动切片和切片重组图；`FILE_VERIFICATION.json` 证明这两条管线与 PSD 平铺静图的 RGB 最大通道差为零。若后续改位置、尺寸或层顺序，须重新运行组装、PSD 和验证，并生成新审阅版本，不能静默覆盖当前待审资源。
