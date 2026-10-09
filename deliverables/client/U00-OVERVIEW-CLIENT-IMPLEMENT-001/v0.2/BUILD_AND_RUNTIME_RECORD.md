# U00 v0.2 构建与运行记录

| 阶段 | Owner | 结果 | 证据 |
|---|---|---|---|
| Creator TypeScript静态检查 | Client | PASS | Creator 3.8.8随附`@cocos/typescript`，`--noEmit --strict false --target es2019 --skipLibCheck -p apps/client/tsconfig.json`，exit 0。 |
| 全量资源字节完整性 | Client | PASS | `RESOURCE_INTEGRITY_CHECK.json`：198个tracked assets，两份获授权TS除外196/196不变。 |
| Creator 3.8.8 Web-Mobile CLI构建 R1（历史） | Client Owner | PASS（已由R2替代） | 旧源码hash见`evidence/BUILD_R1_MANIFEST.json`；149文件、25,935,082 bytes。 |
| Creator 3.8.8 Web-Mobile CLI构建 R2（当前） | Client Owner（按Master授权接手） | PASS | 最终源码SHA绑定；exit36，`Build Assets success`、`Asset DB is resume!`、`build Task (web-mobile) Finished`；149文件、25,935,211 bytes。exec session 16431，见`evidence/BUILD_R2_MANIFEST.json`与`evidence/CREATOR_BUILD_R2_LOG.txt`。日志有engine-script worker SIGTERM诊断；Tech复核认为未阻止本次完成，不断言为正常终止，如浏览器发现脚本/资源缺失需追查。 |
| HTTP实际构建入口 | Client Owner（现有服务） | PASS | 既有loopback服务PID 83580、`http://127.0.0.1:4174/`；HEAD/GET 200，served index SHA `02a48cd131c0f6287f4ce5841b9084b34dfd4c13bd7d62eedc0a22d79f03981d` 与R2构建目录相同。见`evidence/HTTP_R2_CHECK.json`。未启动或更改服务。 |
| Codex内置浏览器交互 | Master | PASS（失败分支未测） | R2 两视口实测菜单顺序、调店/步长、六店选择聚焦与改值、导出、恢复/重进、相机重置保留值、折叠拖缩、显隐/count；JSON textarea DOM有六店、855字符，手动Super+C后clipboard.readText完全匹配DOM全文。Clipboard API拒绝分支未强制诱发。截图/导出文件见`evidence/iab/r2-*`，运行清单为`evidence/RUNTIME_R2_MANIFEST.json`。 |
| Creator AssetDB/Library UUID回读 | Tech Lead | NOT_TESTED | 无资源文件修改；仍按构建记录区分实际导入与逐UUID回读。 |
| 真机触控与性能 | 未执行 | NOT_TESTED | 桌面Web不能替代目标设备与性能专项。 |

## Master R2 内置浏览器检查

Master实测390视口菜单顺序U00→U01→U02→U03；步长1/10/50正确，奶茶脚点从(-1320,-225)调为(-1311,-265)，选择后聚焦可见。下一店糖画可设为(-900,-225)。复制后DOM导出包含六店且保留临时值；对话框文本可选中，手动Super+C后clipboard.readText为855字符，与DOM导出全文一致。恢复六店基线、离页重进恢复基线和步长10、相机重置保留调值、折叠后拖动/缩放、显隐及顾客0→1/上限8通过。720视口逐店选择到投壶，调至(1270,-175)，导出正确，恢复基线通过。console error/warn为空。系统剪贴板API写入失败的专门路径未强制诱发；真机性能和逐UUID Library回读未测。详细截图及JSON证据见`evidence/iab/`，运行清单`evidence/RUNTIME_R2_MANIFEST.json`绑定390×844、720×1280及最终两份TS SHA。

## 本轮源码身份

- `apps/client/assets/UnitSampleGallery.ts`：`42d27216233c26995a3d8eba052b3a828cf32b1433680277595b5967f2df2f20`
- `apps/client/assets/labs/menu/scene1_camera_controller.ts`：`3b3b55cdb6cbc9cb7cb21bcfc30b521ddedc4edd830356296ec591b6bc085ef7`

v0.1/R3历史构建与运行清单保留原目录，不作为本轮新调店功能验收；v0.2 R1日志仅记录复制文本框增加前的中间源码身份，清单和日志保留作修订过程证据。最终R2绑定上方SHA，日志SHA-256为`cb7299f43fe809577d7f209429df52d102e814acfac42467731acdb2ab63008d`，CLI实际exec session ID为16431、退出36。Creator日志中engine脚本worker出现SIGTERM字样，但后续`Build Assets success`、`Asset DB is resume!`与Finished均存在；Tech复核结论为该诊断未阻止本次构建成功，但不据此推断其正常，若R2浏览器发现脚本/资源缺失需再追查。Master内置浏览器检查需绑定R2 SHA。
## Master R2 实际运行证据

390×844：初始步长10，奶茶X+、Y+后切步长1并X−，得(-1311,-215)；切50并Y−得(-1311,-265)。糖画X+50得(-900,-225)，整组JSON同时保留两店改动及另四店原值。镜头重置保持编辑数值；恢复六店导出与原基线一致；修改后返回菜单再进恢复基线及步长10。调节面板折叠后拖动缩放正常，街景/顾客/店铺独立隐藏及人数8、0→1保持隐藏通过。

720×1280：通过‘下一店’连续选择至第6店并保存各店截图；投壶步长50，X−/Y+得(1270,-175)，实际画面与导出数值一致；六店恢复通过。菜单四卡顺序U00、U01、U02、U03可见，旧入口逻辑未改变。

整组参数验证：复制按钮调用成功后显示可选只读JSON。Master从实际可见textarea读取六店；点击‘全选文本’并真实键盘复制后，浏览器剪贴板读回855字符，与DOM导出全文完全一致，见r2-manual-copied-390.json。未人为诱发Clipboard API失败分支，其降级由源码审查保证；不把成功回调等同于未执行分支验证。R1自动复制成功回调后的工具读回曾为空，因此R2增加了成功也显示文本的可检查路径。

HTTP除了入口外，Master另实际GET assets/main/index.js，HTTP200及SHA与R2产物清单一致；R1仅历史，不作为终版验收。预览由Master已有session4953服务提供，Owner未另启服务。真机触控/设备性能/逐UUID Library回读仍未测，本次为单元示例Owner验证，不作正式QA结论。
