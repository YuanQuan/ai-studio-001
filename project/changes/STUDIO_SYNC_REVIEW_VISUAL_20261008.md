# 视觉效果优先规则｜当前游戏与主模板文件级同步审阅

## 范围与结果

用户 2026-10-08 明确授权效果优先、局部修图不足时可由 Art 选择重绘。当前游戏仅更新下表五份 Studio Layer；主模板 `YuanQuan/ai-studio-template` 对应五份逐文件 SHA-256 完全一致，另更新两份 `templates/game/` 通用默认项和两份去项目化提案。未对当前游戏做全目录 Studio 升级；其他已有游戏仍保持 pinned。

| 当前游戏/主模板同路径 | 两处一致的 SHA-256 |
|---|---|
| `AGENTS.md` | `6245C3EE98FD2CB4598D1AC2490681EF86FFB6B81840D196EB3BC4651F004266` |
| `rules/visual_production_contract.md` | `1F9A5721D4B013BEB52B5712C9159639A36ECEC0BDAC0035BF5BA4C977F17F0D` |
| `agents/art/ROLE.md` | `F88159C56DCAAC84C94A48D584FC7969EC3AD77B26BEE7331D53962D1DED7000` |
| `agents/art/CONSTRAINTS.md` | `9DF2D6E6CA9B69B30DC7F6061677B5CFFB25D91B9CF2453C67F7762F8888239B` |
| `agents/art/DECISIONS.md` | `494759ACCDAF2C1B218B68762479D25259EA5D12D18AD1345BE6AB57BE655E84` |

主模板另外提交：`templates/game/STUDIO.md`、`templates/game/project/ART_GUIDE.md`、`governance/capability_changes/CP-VISUAL-OUTCOME-PRIORITY-20261008.json`、同名 `.md`。两个模板默认项及主模板提案已只读检索，未见 U03、夜市、`mixed_signs` 等具体游戏内容。当前游戏提案保留本游戏评审证据，主模板提案为去项目化文本。

## Git 与锁文件

主模板实际 commit：`9ee34fa80c9c96a1999849175242ef077b78741d`（`art: prioritize visual fidelity and allow justified redraws`），九个上述文件。Master 报告普通 push 成功，Producer 只读核 `origin/main` 与本地 `HEAD` 同为该 commit、`main...origin/main` 无领先/落后；未独立查询 GitHub 远端。当前游戏上述五文件及本项目 Task/Artifact/日志的 commit/push 结果待各自 Git 证据，不能据模板 push 推断本游戏已推送。

当前游戏 `.studio-lock.json` 保留原全量基线 `790193e5ec8b5c717596d8495549c2497177d971`。本次仅五文件组织规则定向同步，未将锁文件虚写为模板 `9ee34fa…` 或称其他 Studio 文件完成升级。

## 审阅与持续任务

Tech 与 Client 治理 Review 均 APPROVED，Master 接受组织级规则修改；未新增用户审批门禁。U03 v0.3 的效果忠实制作仍在进行，旧 v0.2 审批作为历史保留；具体新切片 Gate2 与客户端运行仍按各自实际证据流转。本同步记录不替代美术样张后验或正式资源审批。
