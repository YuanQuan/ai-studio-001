# 七项菜单单元样例｜组件与复用规格 v0.1

任务：`UNIT-MENU-UI-SPEC-001`。组件编号是设计追踪号，不指定 Creator 代码接口或数据字段。视觉效果见 `components/shared-controls.svg`；实施前需 Art/Client 审核资源、触控和引用方式。

| 组件 | 内容与复用点 | 状态 | 层级/输入 |
|---|---|---|---|
| `LAB_MENU_ITEM` | 七顶层菜单统一编号、标题、短说明；③卡内提示双子项 | normal、pressed、disabled、selected | 仅 Lab；整卡命中，竖向滚动不误触 |
| `LAB_NAV_BAR` | 返回、当前项标题、重置 | normal、pressed、disabled | 仅 Lab；固定顶栏先消费触控 |
| `LAB_ACTION_BUTTON` | 预览/开始/继续/复位等 Lab 操作共用纸木按钮 | normal、pressed、disabled、busy、loading、error | 仅 Lab；触控目标候选≥48×48 |
| `LAB_TOGGLE` | 组合中的店、孟桃、幽灵、板凳、树/花/灯开关 | off、on、disabled、loading、error | 仅 Lab；状态文字与开关图形双通道 |
| `LAB_SEGMENT` | 顾客左/右和五状态选择、3A/3B 子入口 | normal、selected、disabled | 仅 Lab；方向标签/UI独立于镜像骨骼 |
| `LAB_STATUS_BADGE` | “演示 · 待机”等测试状态 | idle、busy、resetting、error | 仅 Lab；不能写进共用身份卡 |
| `MT_IDENTITY_CARD` | “奶茶店”“店长 孟桃”；唯一纸底木框/杯吸管小标识 | normal；对象缺席时隐藏或只呈真实存在的信息 | 2/3A/5/7与主体入口共用一份图形、文案键及组件规格 |
| `MT_DIALOGUE_SHELL` | 姓名、头像槽、正文、继续/关闭；Lab 示例标签分层 | closed、firstLine、secondLine、closing、error | 对话时覆盖场景输入；示例文本只在本 Lab 数据中 |

## 控件同源索引

`MT_IDENTITY_CARD` 延续旧孟桃 UI 候选中的语义，但旧 `UNIT-PILOT-UI-SPEC-001 v0.1` 尚在 `USER_REVIEW`，本版需按新七入口重新审批，不能直接继承其审批状态。Lab 菜单卡、按钮、段选和开关使用同一边框/纸底母版与统一状态，不按每项重复画七套。对话的关闭、继续可复用按钮母版，只在文案和尺寸上变化。正式主体游戏只读取身份卡和未来获批可复用对话壳；不会装入 `LAB_*` 诊断控件或示例文字。

按钮状态变化必须能由屏幕与无障碍文字识别：禁用有“不可用”说明，忙碌有“演示中”，加载有“准备中”，出错有“资源未就绪/重试”。图标配中文标签，不能把小杯、灯笼等图形当唯一提示。菜单项未实施的未来店铺/店长不渲染成可点击项。

对话文字和 UI 图标在自己的不镜像 UI 节点；幽灵顾客左右翻转只作用于其骨骼显示对象。板凳坐姿和挂件镜像质量由 Art/Tech/QA 验收，UI 的方向选择只表达审阅者的意图，不声称骨骼已正确切换。

## 资源和许可状态

本版 SVG 为独立绘制的可编辑示意，形状、颜色和字体配置不代表最终导入资源。正式九宫格、Sprite、图标、阴影及字体文件需 Art/Tech 出图前合批与尺寸审查；UI/Client 再核验组件源唯一性。系统字体候选 Noto Sans CJK SC，需记录具体版本、许可文本、使用/嵌入/分发范围。美术字体尚无可交付许可文件，不从概念牌匾截图生成美术字；修改他人字体也仍需许可。
