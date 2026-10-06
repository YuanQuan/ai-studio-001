# Cocos CLI 与内置浏览器优先：可行性与迁移

Task：`COCOS-CLI-BROWSER-POLICY-001`，版本v0.1，2026-10-06。用户已明确授权可行后直接修改约束并共享，Tech、Client、QA同版专业Review均APPROVED。

## 结论与适用范围

方案可行，已落实为组织默认约束：版本相容脚本/API与Creator CLI优先开发、处理引用和构建，HTTP提供实际Web产物，Codex内置浏览器优先验证运行画面及真实输入。必要Editor、目标设备/SDK、原生、性能与发布专项继续按已批准规范执行。源码/Scene修改仍需要上游输入、明确文件范围、备份和引用核验，方法变更不代替实现或QA批准。

Creator内置CLI主要提供导入/构建能力；Editor场景扩展API仍依赖编辑器进程。独立官方cocos-cli是另一工具链，本机未安装且未证明与3.8.8兼容，未安装或升级项目以追求CLI。Scene/Prefab支持可审查脚本转换，完整维护嵌套索引、对象关系、Prefab实例/覆盖与稳定UUID，再由当前引擎和实际运行核验。

依据：[Creator 3.8命令行构建](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-in-command-line.html)、[Editor场景脚本](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/scene-script.html)、[官方独立CLI](https://github.com/cocos/cocos-cli)。Creator3.8官方成功码为36，命令行仍需图形环境，故不承诺任意无图形机器可运行。

## 本机实际证据

| 检查 | 结果与边界 |
|---|---|
| 内置浏览器实际Creator预览 | 通过 `http://localhost:7456` 显示旧菜单，真实Canvas坐标点击U10后显示四层场景；`evidence/iab-u10-route-probe.png`。仅工具路线探测，非新U01验收。 |
| 当前Creator CLI普通进程 | 实际启动隔离官方模板副本，因引擎缓存写入EPERM与engine消息缺失停在初始化；日志为 `cli-out.log / cli-err.log`。ACL只读核查为管理员写、Users读；未修改ACL。 |
| 正规管理员CLI | 本机既有管理员约束下通过Windows RunAs启动，`cli-admin-start.json`证实admin=true。14:03:11起构建、14:04:47结束，总96774ms，当前web-mobile产物存在。首个启动器未采集到退出码（null），已单独补测进程句柄采集，不以null或父进程返回判成功。 |
| 实际CLI产物加载 | 本轮官方模板输出从loopback HTTP18038提供，IAB显示3D场景；可用console error查询为空，截图 `evidence/iab-cli-built-probe.png`。这证明实际CLI→HTTP→内置浏览器路线，非当前游戏功能/性能QA。 |
| Skill结构 | skill-creator的quick_validate.py实际输出 `Skill is valid!`。PyYAML/jsonschema仅安装到忽略的任务temp校验目录，不进入工程运行依赖。 |
| 静态检查器 | 10项主控fixture及14项QA独立fixture符合声明退出码；故意关系/schema错误仍可能STATIC_PASS，脚本明确NOT_CHECKED，保留引擎与运行门禁。 |
| 同步与发现 | Game、主Studio、全局skill五个文件SHA256一致；十角色CONSTRAINTS/SKILLS及registry均索引同一维护源。标准模板STUDIO与manifest默认项已更新；见 `evidence/sync-validation.json`。 |

## 已实施的约束与共享入口

- `rules/cocos_cli_browser_workflow.md` 是跨角色执行约束；`AGENTS.md`、`rules/artifact_contract.md` 和各角色配置均引用。
- `agents/shared/skills/cocos-cli-browser/SKILL.md` 为Studio维护源，按需加载场景/资源与构建/浏览器references；附只读静态检查脚本。
- 相同内容已安装 `C:/Users/admin/.codex/skills/cocos-cli-browser`；当前会话可直接读仓库入口，未来会话通过 `$cocos-cli-browser` 或Cocos任务描述发现。安装不意味着现有会话的技能目录已自动重载。
- 主Studio同步只含通用规则、角色索引、skill、能力变更及标准模板默认项；具体路径、游戏资产、日志、截图和Task留在Game。
- 此为本次Cocos规则范围的补充同步，未宣称其他Studio差异全部升级；原 `.studio-lock.json` 保留，实际模板新commit在同步记录中单独记载。

## 当前U01任务迁移

安全交接点尚无本Task实施代码/Scene变更，补充约束见 `project/changes/CP-COCOS-CLI-BROWSER-20261006.md`。实施Task已引用该补充约束，旧Client Brief v0.2、QA Plan v0.2与批准记录保留。Inspector限定由受控脚本替代，Creator导入/构建、真实运行、资源身份和实现用户批准仍为必需。

当前四层批准PNG、meta、共享Prefab与Controller身份受保护。70个旧Demo/资源删除是工作树既有基线，不能称作本轮新增清理。历史文档不删除。正式QA只能在实现版本获用户批准后进入，工具路线探测不生成TEST_REPORT。

## 最终同步与执行结果

退出码补测、提交/推送和当前实现状态的实际结果在本文件附录更新；缺失项不宣称完成。新路线遇到真实错误记录具体原因，不沿用旧截图超时作自动阻塞。

### 完成判据补测

同一隔离模板在14:06:15再次启动，持有进程句柄后实际采集Creator退出码 **36**；日志14:06:46结束、构建10814ms，进程14:06:49退出。再次从HTTP加载并观察资源加载后的实际3D场景，可用error日志查询为空。初次null保留为未采集，不改写为36。完整当前产物哈希与服务/浏览器身份见 `evidence/build-identity.json`。CLI构建及IAB路线探测通过，仍不代表U01正式QA。
