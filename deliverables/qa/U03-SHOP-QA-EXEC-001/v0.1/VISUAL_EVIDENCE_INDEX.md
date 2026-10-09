# U03 视觉证据索引 v0.1

固定R3/Gate2v0.4。原归档位于deliverables/client/U03-SHOP-CLIENT-IMPLEMENT-001/v0.1/evidence/r3_iab；R3_IAB_EVIDENCE_MANIFEST.json含16图/控制台真实格式、像素、SHA。QA核17/17一致，实际逐图查看两尺寸六店12图。

| 店ID | 390 / 720原件 | 限定静帧观察 |
|---|---|---|
| MT_SHOP_01 | 390_shop_01.jpg / 720_shop_01.jpg | 奶茶/01一致，屋顶无大杯。 |
| SHOP_02 | 390_shop_02.jpg / 720_shop_02.jpg | 糖画/02一致，伞杆炉台完整。 |
| SHOP_03 | 390_shop_03.jpg / 720_shop_03.jpg | 炭烤/03一致，篷布炉台完整。 |
| SHOP_04 | 390_shop_04.jpg / 720_shop_04.jpg | 理发/04一致，屋顶无大剪刀，镜台完整。 |
| SHOP_05 | 390_shop_05.jpg / 720_shop_05.jpg | 花灯/05一致，挂灯完整。 |
| SHOP_06 | 390_shop_06.jpg / 720_shop_06.jpg | 投壶/06一致，壶口完整。 |

两尺寸均仅一店，六牌形制/文字有差异且可辨，暖灯/冷屋顶色调保留，常驻控件未遮挡店体/牌匾。没有最细笔画像素量测结论。

本轮Master在390固定IAB补证：evidence/390_reverse_06..01.jpg六张；390_twenty_next_final_03.jpg；390_reenter_cycle_01.jpg、390_reenter_cycle_10.jpg；r3_qa_console_logs.json；r3_390_canvas.json。9图实际JPEG，字节/SHA见evidence/EVIDENCE_MANIFEST.json；QA抽看反向06、最终03、重入10，均图牌名对应。其余反向图哈希与同店既有图相同，未变像素。

动态录屏、加载/错误/重试/禁用状态、黑灰白夜蓝实际重组比较、safe area/投影牌宽高/笔画像素和基线差异仍未完。整体Visual QA NOT_TESTED。
