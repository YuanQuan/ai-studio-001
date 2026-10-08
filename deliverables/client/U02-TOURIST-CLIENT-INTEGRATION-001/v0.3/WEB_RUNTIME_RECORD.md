# U02 Client v0.3-R2 Web 运行记录

状态：R2_BROWSER_REVIEW_COMPLETE（Client浏览器运行证据与Tech/UI/Art同版复核完成；正式QA最终报告、用户审批、正式性能、实触和目标设备项仍未完成）
日期：2026-10-09（+08:00）

## 当前构建身份

- 构建：U02-TOURIST-CLIENT-INTEGRATION-001-v0.3-R2，Creator 3.8.8 Web-Mobile，147个游戏文件、20,421,377 bytes。逐文件SHA-256：evidence/retry-20261009-r2/BUILD_MANIFEST.json。
- R2源只移除TouristStage辅助caption，保留标题、控件、状态、居中游客和附件表现。Scene未因修正变化，保留U03六店。
- 页面：http://127.0.0.1:8775/；只读审计页：http://127.0.0.1:8775/audit.html。审计页不驱动游戏动作，人工操作由CUA完成。
- 44/44 Creator Library资源（40主体帧、4附件）核验通过。R1的147个构建文件逐项哈希未变；R1为历史版本，不用作R2画面证据。

## R2运行检查

- runtime-full-equipped-390x844.json：40/40动作帧观察并渲染，160/160挂点矩阵有效，invalidRows=0，最大重建误差4.440892098500626e-16；三类配件全装。600样本/9.984秒，engine frameTime p50 16.7ms、p95 19.1ms、max 20ms，draw calls 36，triangles max 1871。
- runtime-40-combinations.json：390×667的40/40组合通过。覆盖walk/run/happy/sad、左右朝向以及全套/无/单配件；各组合JSON和JPG在同目录。四个动作循环、独立配件穿脱、镜像、重置和返回由Master在IAB人工点击检查。
- runtime-full-coverage-390x667.json：40/40帧与160/160矩阵通过；循环回绕计数walk/run/happy/sad分别为38/8/12/4。600样本/10.217秒，rAF p50/p95/max为16.7/17.0/32.2ms；engine frameTime p50/p95/max为16.7/20.4/32.6ms；draw calls 34–36、triangles max 1871。
- happy-cycle-left/right-390x667/844.jpg保存双视口循环图；sad镜像、walk/run全装扮画面亦有对应截图与状态JSON。Art、Tech Lead、UI对同版R2修正和实现复核批准。Master另保存R2用户预览图evidence/retry-20261009-r2/user-preview-u02-r2.jpg。happy03精确帧专门截图未单独采集；Art/UI已基于双视口循环图、组合证据和整体运行画面接受修订，该项不作为当前阻塞。
- runtime-reset-390x667.json、runtime-reenter-390x667.json验证返回/重进时action=null、phase=initial、附件全卸、ready且error=null。U01与U03鼠标回归见U01_REGRESSION_RECORD.md。
- browser-console.json原始数组保留一条发生于R2启动前的audit harness MutationObserver异常。按R2启动时间过滤后的browser-console-r2-window.json记录当前R2窗口0 error、0 warning；不声称原始文件为空。

## 历史R1结果与边界

R1旧输出8774曾完成浏览器全帧/性能采样，数据保留在evidence/retry-20261008/，仅作为历史。R1中happy03帽顶与stage caption重叠，随后已按评审意见仅删caption并生成独立R2。之前的BLOCKED状态和R1视觉问题不代表当前R2阻塞。

旧runtime-initial-390x667.json来自修复前harness，其UISkew矩阵重组计算有误；其中invalidRows/maxReconstructionError不可引用。已修复版R2样本见本目录runtime-full-equipped与runtime-full-coverage。

## 未完成项

- 正式性能要求的60秒×3轮尚未执行；本记录的约10秒浏览器采样是短窗口观测，不是正式性能PASS。
- 真实触屏/触控设备、目标移动设备与发布环境未验证。CUA鼠标操作不替代实触。
- QA仅确认实现准备/证据范围；正式QA TEST_REPORT、用户审批及Master最终接受仍待完成。不得将Tech/UI/Art批准写成QA或用户批准。
