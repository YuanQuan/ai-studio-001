# 奶茶店左侧灯笼光照闪烁｜Art Brief v0.2

本次仅为 Gate1 文字方案。唯一对象是 `MT_SHOP_01` 奶茶店檐下左侧红灯笼的灯面亮度及紧邻木构件上的必要暖光。已目视当前店体与完整重组图：红灯笼位于画面左缘檐下；店内中央小黄灯、右侧奶茶杯招牌、瓦顶、整店、人物和其他店均排除。灯笼轮廓、红色灯罩分瓣、暖黄灯芯、黑色挂绳和下方流苏保持原样；无位置、形变、alpha 或身份语义变化。

批准记录为 `tasks/U03-SHOP-FULL-REDRAW-20261009/ARTIFACT_APPROVAL_GATE2.json` 的 v0.2 bundle；当前磁盘 `CUT_MANIFEST.json` 的 `shop_01` 字段为 `BYTE_IDENTICAL_V01_INHERITANCE`，该项引用的 PSD/body/sign 与现存实物哈希吻合。当前清单整体 SHA-256 却为 `0a9eff648a875bade3b7046650691f7aa4f118713561a03df15021867cd02375`，与批准记录中的 `F7B62B6A77B16FA5B10934ED112BE39A07DF7A4AFE6D99B952C735D97931D5ED` 不同。Master 已只读复核：当前 21013 字节含 784 个 LF；仅在内存把 LF 换成 CRLF 后为 21797 字节，SHA 精确等于批准记录值。差异仅为换行编码，清单语义与 shop_01 子项未变；当前物理文件仍以 `0a9e…` 标识，不把它冒称批准时原始字节。PSD 与 body/sign 仍沿 v0.1 实物；旧 `U03-SHOP-ASSET-001` v0.4 不是本方案基准。源身份、哈希和坐标见 `ASSET_MANIFEST.json` 与 `VISUAL_ANCHORS.md`。

现有 PSD 为 1024×1024 的四个整体区域栅格层，左灯笼及邻近原有暖光烘焙在店体画面中，没有独立 light、灯罩或光晕层。`source/shop_01/psd_work/manifest.json` 内是旧 Windows 绝对路径；四个 basename 逐一对应本仓 `source/shop_01/psd_work/layers/` 同名实文件。当前工程也没有可直接复用的局部亮度 Effect 参数；首样候选仅为独立 pilot 的本店体 Sprite 实例新增小型 Cocos Effect/独立材质，复用原 body 与局部 mask，不共享到其他对象，不修改正式 PNG/meta。它是局部参数调制，并非重新分层或原生可编辑光源。若强度 1.0 不能精确回到已批准画面，立即停止并提交差异，不先补绘。

来源权利沿用已获 Gate2 批准的本项目店面资产与原生产记录；本方案不引入新图、字体、第三方素材、付费工具或大型依赖。新光照动画本身仍待本批 Gate1 用户批准，批准方案不等于批准实际动画或客户端运行。
