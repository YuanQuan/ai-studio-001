# U00/U01 樱花桥 v0.5 技术评审

结论：**本轮 Tech Review 通过，可提交集成后的实际运行效果给用户审阅。** 用户已确认 v0.5 具体桥切片并授权 U00/U01 接入，依据 `deliverables/master/U00-U01-BRIDGE-V05-INTEGRATION-20261014/v0.1/USER_AUTHORIZATION.json`。此结论限 UnitSamples 的 Creator 3.8.8 Web 构建与 720×1280 内置浏览器操作，不代替用户运行效果确认或目标设备性能结论。

## 资源身份与实例

获批 Art `CUT_MANIFEST.json` 含 21 张 PNG、45 个环境实例。Tech 重算 21 张 Art 实图 SHA 与清单逐项一致；Client 正式目录 `apps/client/assets/resources/sakura_v03/` 的 21 张图与批准 SHA 相同，21 个真实 `.meta` image/texture/spriteFrame UUID 与源码及浏览器实际导出相同。17 张非桥图的字节和三类 UUID 保留旧身份；按资产、坐标、镜像匹配的 41 个非桥实例，其 `instanceId`、名称、motion 与接入前 Git HEAD 一致。

| 桥片 | 尺寸 | 原画布左上角 | 镜像 |
|---|---:|---:|---|
| body_l | 1536×270 | (0,598) | 否 |
| body_r | 1536×271 | (1536,597) | 否 |
| front_l | 225×177 | (1311,573) | 否 |
| front_r | 225×177 | (1536,573) | 否 |

四片坐标、尺寸及 no-mirror 与获批 Art 清单一致，中央保持单枚旋涡章。U01 运行 `createInitialItems()` 将 L01/L02/L03 之后放入六店，再放 L04/L05；实际 IAB 导出顺序为两桥 body 索引15/16 → 六店17…22 → 两桥 front23/24 → 岸链25/26，前景继续在上。U00/U04 共用 `populateSakuraV03`，L03 body、实体 sibling index3、L04 front、L05 前景顺序相同。`check_layout.py`、`STATIC_CHECK.json`、`ACTUAL_IAB_EXPORT_CHECK.json`、`REENTRY_IAB_EXPORT_CHECK.json` 和 `FINAL_IAB_EXPORT_CHECK.json` 均无 issue。Root 的 U01 初次、重入、最终实际导出 JSON 内容完全相等，均为 21 原型、45 环境实例、6 店。已核实际拖店到桥中心时栏杆、灯和单章在前，另有树/精灵编辑、镜头拖缩与复位、返回重入截图；源图不因编辑落盘。

## 构建、HTTP 与退役

Client 在隔离快照上用 Creator 3.8.8 构建 UnitSamples web-mobile；旧桥退役后的最终构建退出码36，stdout 有最终 `Finished`，TypeScript 检查退出0，739 个输出文件实存且与 `BUILD_MANIFEST.json` 数量一致。Tech 复算 index、application、settings 等六个关键输出 SHA 全对；最终隔离源的 67 个源码/Scene/Prefab/21 PNG/meta 项与工作树零差。Root 的 `FINAL_HTTP_IDENTITY.json` 核同一 `http://127.0.0.1:8788/` 六项 HTTP 200 和 SHA 与最终构建清单匹配。中途构建日志有 build-script SIGTERM 调试行，但后续 Build Assets 成功、任务 Finished 和当前输出均已核，不把该中途行当最终失败。

旧 `tex_sakura_rr_bridge_half.png` 及 `.meta` 在退役前运行核验通过后从现行资源删除，带 SHA 的副本存 Client `evidence/retirement-backup/`；现行源码、隔离源和最终构建均无旧路径/UUID 活动引用，见 `RETIREMENT_CANDIDATES.json`。最终产物重载后，Root `FINAL_IAB_VERIFICATION.json` 记录菜单、U01 21/45+6 完整导出、U00 新桥、U04 共享背景均 PASS，浏览器警告/错误为空；`final_u01_export.json` 与初始导出完全一致。U04 表情操作与返回亦有退役前真实截图。没有触及 U05 并发工作文件。

## 画面与边界

U00 放大图可见桥顶一条细暗轮廓；批准的 `review/bridge_detail_v05.png` 同位置已有深色笔触，21 张图与批准源同字节，body/front 同镜头变换，现有证据未显示独立层偏移或动态重影。记录为批准源笔触在运行放大下可见，不改图片；不同缩放和 JPEG 截图不作跨画面 RGB 零差声称。Art 已记录 ROI 外 decoded RGBA 差 0，Tech 本轮核正式导入和真实运行。

四张桥图矩形面积 910,626 px；按 RGBA8 估算解码像素为 3,642,504 B（约 3.47 MiB）。此数不是图集实际驻留、GPU 内存、DrawCall 或帧率。目标设备、小游戏平台和性能指标 **NOT_TESTED**；本单元示例不下正式 QA 结论，后续正式功能接入仍须遵守相应门禁。
