# U04 分层对话客户端运行审核包 v0.1

## 当前版本

本包面向用户审核客户端接入效果。消费已获用户批准的Art资源v0.1；Client实现位于既有 `UnitSampleGallery` U04入口。最终构建源码SHA-256为`3186b8ff463be0d0121b37a59789cb422662447b34f53304ca821efaab096ee4`，Creator 3.8.8 web-mobile构建时间21:02:04 +08:00，HTTP地址：<http://127.0.0.1:8765/>。

## 画面与交互

U04以Gallery现有U00五层背景和六间店铺为背景，左侧店长立绘按stage展示腰以上部分，右侧/下方九宫格面板承载姓名、对白、状态。用户可分别操作店长、魂阶段、表情；“缩小面板/放大面板”切换384×192、768×256、1024×384和1280×195四档。角饰与文本独立于九宫格拉伸。

Master已在Final10同一HTTP构建实际检查并保存U00全景、90/90组合、三轴切换、384×192/768×256/1024×384面板和返回重入证据，见`evidence/runtime_final10_*.jpg`。返回菜单再进入后脸层与人物比例正常。另在Final10检查960×540横屏和连续8次快速切换（最终XJ 2魂惊讶，无旧图覆盖）。逐项结果及最终版证据均见 `RUNTIME_CHECK.json`；审核主图为 `evidence/runtime_final10_user_preview.jpg`。Tech已对Final10源码SHA完成APPROVED评审，记录见 `deliverables/tech_lead/U04-DIALOGUE-CLIENT-REVIEW-001/v0.1/REVIEW.json`。

## 可复核材料

- 实现与构建说明：[`IMPLEMENTATION_REPORT.md`](IMPLEMENTATION_REPORT.md)
- 逐资源源文件SHA、路径和UUID：[`RESOURCE_IMPORT_MAP.json`](RESOURCE_IMPORT_MAP.json)
- 运行与验收逐项结果：[`RUNTIME_CHECK.json`](RUNTIME_CHECK.json)
- 90组合状态可从运行页发起“巡检90组”；页面发布只读 `globalThis.__U04_RUNTIME__` 状态，显示已完成数、失败清单、组合、代次和加载状态。
- 构建证据：[`U04_CREATOR_BUILD_FINAL10_STDOUT.log`](evidence/U04_CREATOR_BUILD_FINAL10_STDOUT.log)、[`U04_CREATOR_BUILD_FINAL10_STDERR.log`](evidence/U04_CREATOR_BUILD_FINAL10_STDERR.log)。

## 审核范围说明

本次是客户端接入与Web运行审核，不替代Art资源审批，也不构成原生或目标SDK平台测试。目标设备、原生/SDK和GPU/FPS性能未测试；冷网络并发竞态压力也未执行，均在 `RUNTIME_CHECK.json` 明确标出。Tech最终源码Review和Producer流程Artifact由相应角色记录。
