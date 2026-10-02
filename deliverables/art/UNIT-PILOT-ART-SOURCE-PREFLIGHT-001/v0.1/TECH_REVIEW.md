# 孟桃正式出图前Art方案｜Tech联合评审 v0.1

评审人：Tech Lead；2026-10-02；结论：**APPROVED，本版分层与单页草排检查矩阵可进入用户审阅。** 本次联合签认只确认制作计划及验证门槛可行，**没有签认正式图片/Spine/atlas导出许可、Creator接入或设备性能**。

| 核查点 | 结论与后续证据 |
|---|---|
| 上游与版式 | Product v0.1及Art概念v0.5审批记录均为`USER_APPROVED`。`PARTS_BOUNDING_PLAN`不改孟桃唯一“孟”腰牌、奶茶杯吸管标和未加宽店型；不增加旅客方向与经营规则。 |
| 三对象独立 | 角色`MT_CHAR_01`、同母版店身`MT_SHOP_STATIC_01` BACK/FRONT、三帘`MT_SHOP_MOTION_01`清楚；工作摇杯/手型/表情归角色页，帘轴归静店。角色整个Skeleton处于后店身与柜前层之间；手越柜前沿需另审层级，不复制手图。 |
| 单页排布 | `ATLAS_PLAN`两张互不重叠的候选图格分别覆盖全部列出的角色/帘附件；1024²/512²、每格8px、透明扩边2px均明确标为草排。未有逐片实际边界、自动pack文件或真实atlas页数，**不能确认装得下**。下一次出图须逐片测量/极限姿态、打包后每骨骼对象核实恰好一页。 |
| 合批与alpha | 一页只限制附件跨页，不保证一DrawCall；材质/混合/裁剪、店静态前后层和UI插入均需真实采样。店图现有环境暖晕必须从固有色/柜前遮挡剥离，过滤白边、预乘/直通alpha和压缩后伪边在Creator及真机检查。 |
| 可编辑母版与路径 | 与`TECH_DESIGN.md`一致：仓库根`art-source/units/mengtao/`及`art-source/units/milk-tea-shop/`为唯一可编辑源；`apps/client/assets/units/`相应目录为可导入文件和`.meta`；Lab与主体同UUID/导出版本，禁止各自手改。当前两目录仍是候选，未宣称实际文件存在。 |
| 设备、工具与权利 | 当前Creator工程为3.8.8/`spine-3.8`；本机常见安装路径未检到有许可Spine或Creator可执行，不能拿配置当成功导出。先由具合法席位工作站登记Spine精确版本、源工程与许可证，再在Creator实际导入。720×1280竖屏样张要测“孟”“奶茶”和握杯投影；目标机纹理格式/上限、内存、DrawCall、帧时间、字体/杯标权利均待实证。 |

参考技术证据为`deliverables/tech_lead/UNIT-PILOT-TECH-DESIGN-001/v0.1/CREATOR_DEPENDENCY_AUDIT.md`和`ASSET_PIPELINE.md`。Creator 3.8要求Skeleton数据、atlas描述和PNG三件套；[官方Spine导入文档](https://docs.cocos.com/creator/3.8/manual/en/asset/spine.html)。本次正式出图前的下一次Art+Tech双签必须填写逐片像素、导出版本、真实atlas页数、目标设备/alpha/合批实测及实际来源许可；该记录未完成时结论继续为“生产未放行”。
