# U03 正式 QA 报告 v0.1

test_phase：FUNCTIONAL；规则：studio-workflow-v2-policy；Task：U03-SHOP-QA-EXEC-001。整体结论：BLOCKED。

## 固定输入与环境

Client v0.1/R3、Gate2 v0.4、QA Plan v0.1均已USER_APPROVED。Gate2清单SHA C67C47E89860A4EAFAFFA340617D7176E7F68A10AE54DBEF188F2BAF19505191；R3 Creator3.8.8 builder1791356044228，产物apps/client/build/u03-shop-client-r3-web-mobile，HTTP127.0.0.1:8776。

QA重新核107个构建文件/3个源SHA一致，12张正式切片Art→Client→R3 native逐件匹配，见RESOURCE_AND_BUILD_AUDIT.json、GATE2_MATCH_AUDIT.json及Client同版RESOURCE_IDENTITY_AND_UUID.md/Tech导入Review。

QA会话cua.getTab返回Browser is not available: iab；getState无IAB且Chrome报nodeRepl.fetch request failed。Master保留IAB会话补测：390反向六步、20次下一店最终03、退出重入10次均01，已归档9图及控制台。QA复核原件/哈希，并抽看反向06、20次最终03、重入10实图。Canvas只读记录CSS/backing均390×844；DPR/userAgent读取受限，不能推断DPR=1或2。720×1280为R3既有实图像素尺寸；缺完整CSS/DPR、安全区、visibleSize、GPU/驱动、刷新率、电源/缩放记录。

## 结果与范围

功能：资源身份C15完整PASS；其余用例均有未完成子项，详见TEST_CASE_RESULTS。限定鼠标主流程支持双向可达、首入/重入01、20连按最终正确；逐帧原子提交、受控乱序、故障/重试、输入去重、生命周期计数及完整回归未完成。

视觉：QA逐图查看R3两尺寸×六店12实图；仅一店、图牌名对应、牌体不同、奶茶无大杯屋顶/理发无大剪刀、常驻控件未覆盖，限定静帧PASS。完整Visual QA仍NOT_TESTED：无动态状态录屏、黑灰白夜蓝重组实际检查、逐牌投影/最细笔画像素测量、完整基线差异。

性能：12张1024×1024 PNG的静态RGBA8文件页面等效48MiB＜128MiB预警上限，静态部分PASS。GPU驻留/运行纹理页扩展、帧时60s×3×6店、FPS、冷热各3次、输入到完整帧、DrawCall、10次入退实例/监听/引用没有可靠原始计数，性能BLOCKED。218条QA日志warn/error0仅该集合成立，Object文本不是完整时间/目标对象，不能计算阈值PASS。

## 缺陷与阻塞

已复现P0/P1/P2均0；未完成覆盖，不是无缺陷声明。

- ENV-U03-QA-01：QA IAB不可用；Master补有限动态，但完整固定环境/记录仍不足。Owner Master；复核点恢复QA会话并补完整元数据与录屏。
- TESTABILITY-U03-01：强引用Prefab+微任务没有已证实延迟/缺图/解码/超时注入能力；C07–C11未测。Owner Master协调Client/Tech；复核点受控测试构建方案及实际注入。未改正式资源/注入浏览器游戏状态。
- METRICS-U03-01：缺低开销原始帧时/DrawCall/实例监听/资源计数及同钟输入时序。Owner Client/Tech；按已批阈值补能力，不得放宽阈值。

本版为真实受阻结果，送专业Review；用户未确认TEST_REPORT，不得整体PASS或DONE。真机/微信/其他平台/实际弱网仍NOT_TESTED，属RELEASE或另批范围。

执行时间：2026-10-07，15:20:35+08已有审计落盘；精确开始与总耗时未知，不估算归责。
