# v0.3 石柱链条栏杆具体资源审阅包

请看无店全景 `review/scene_environment_stone_chain_final.png`；`review/before_after.png` 上行为 v0.2 矮灯绳栏，下行为 v0.3 同尺度灰蓝圆帽石柱与深色下垂链条。正式可编辑资源和 18 张环境切片在 `package/SCENE_SAKURA_ENVIRONMENT_GATE2_v0.3.zip`。这一版只换独立栏杆半幅，桥脚、岸石植物与其它画面不动；柱上没有灯。链节源于新绘透明原型，用户附件只作样式参考，没有裁入资源。

静态验证：实际 PSD 43 层，正式 18 张 PNG 中旧 17 张文件 hash 不变；PSD 展平、切片重组和无店静图解码零差。相对 v0.2，允许栏杆两侧局部变化 71,329 像素，允许区外 RGBA 变化 0。正式 ZIP 的 SHA-256、字节数和 CRC 见 `FILE_VERIFICATION.json`。原生新绘图、独立 post/chain 透明源、半幅编辑源保存在包中，可按 `EDITABILITY_NOTES.md` 调整。

请审核这次**具体 v0.3 资源**是否符合你给的石柱链条风格。方案此前获准制作，不代表成品已批准；v0.3 未接入客户端，Cocos 与目标机运行 `NOT_TESTED`。原有水面暖色反光属于本轮保护的旧水层，因此仍保留；左右栏杆半幅镜像亦沿已确认复用方式。六店没有输出，树红点依你澄清未修改。
