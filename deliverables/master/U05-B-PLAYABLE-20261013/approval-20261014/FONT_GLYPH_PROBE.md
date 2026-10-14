# 字形栅格探针（只读核验）

使用bundled Python的Pillow ImageFont在内存中以48px读取完整官方ZCOOLKuaiLe-Regular.ttf，检查12原料名、三按钮、订单/难度/锁定/重试/返回和数字标点共71个唯一字符；与U+FFFE缺字mask逐字符比较，缺字形状匹配为0。未保存或制作任何字体样张。

此前fontTools库在该runtime不可用，未安装依赖，改用实际Pillow字形栅格探针。该结论验证所列字可出形，不替代Art文字风格/小屏可读性判断或全字库cmap完整审计。
