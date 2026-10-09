# Owner 自核 v0.6

- PASS：六店脚点与 v0.5 一致、六家 baseline scale 均为 0.34；JSON/源码静态一致。
- PASS：默认顾客 count 1、id1 scale 0.20；动态新增顾客采用 U00 baseline 0.20。
- PASS：恢复调用将顾客数量设回1并重置店铺坐标/缩放及顾客缩放；离开后重进初始化为新 baseline。
- PASS：修改只在 UnitSampleGallery 的 U00 专用逻辑；U02 独立示例文件未改。
- PASS：assets + Creator 声明 TypeScript noEmit，退出码0，原始结果和日志已保存。
- USER_VALIDATED：用户明确回复“我已帮你验证通过了”，按 `USER_VALIDATION.md` 作为当前 v0.6 单元示例参数修订的用户验收来源；验证设备、构建身份、具体操作和截图未知。
- NOT_TESTED（Agent执行）：Creator 构建及HTTP/IAB两视口。修正后的管理员启动器因Windows进程初始化 `0xc0000142` 未启动 Creator，详见构建记录；保留为后续工具链风险。
- 本自核不替代 Tech/Master Review 或正式QA。
