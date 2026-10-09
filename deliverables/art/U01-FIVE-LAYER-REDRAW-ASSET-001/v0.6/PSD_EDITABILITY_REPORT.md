# PSD 可编辑范围 v0.6

- 母版：`source/u01_five_layer_master.psd`；PSD 8BPS v1、RGB8、3072×1024，实读5层，SHA-256 `cb6dd00c99a2082d59d2ea0e4dd494185c768b15190dde29e5eec966cb49ccac`。
- 自下而上：L01天空、L02远山楼阁、L03柳林/后岸街/右牌楼、L04桥栏/前景水/灯船、L05河前草。各层是独立 RGBA 栅格，不是原生笔触或矢量/智能对象。
- 五PNG均3072×1024同坐标。PSD保存的合成与总览RGB逐像素差0；五PNG经bggg重组与总览RGBA逐像素差0。
- L05仅近草，隐藏后L04仍有河面；源层及v0.5原始图/提示词保留。无未知遮挡裁减。
- 已用脚本/Pillow读取PSD结构及平面图，未在Photoshop/Photopea GUI打开；客户端运行未测。
