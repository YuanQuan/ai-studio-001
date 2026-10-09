# U00 v0.3 构建与运行记录

| 阶段 | 结果 | 证据 |
|---|---|---|
| Creator TypeScript静态检查 | PASS | Creator 3.8.8随附`@cocos/typescript`；`--noEmit --strict false --target es2019 --skipLibCheck -p apps/client/tsconfig.json`，exit 0。 |
| Client资源完整性 | PASS | 198个Git跟踪assets中，仅授权`UnitSampleGallery.ts`发生本轮差异；其他197项与Git HEAD逐字节一致。 |
| Creator 3.8.8 Web-Mobile CLI构建 | PASS | 唯一一次运行，exec session 21944，exit36；Build Assets success、Asset DB resume、Finished；149文件、25,935,219字节。详细文件hash见`evidence/BUILD_R1_MANIFEST.json`。 |
| 构建诊断 | 已记录 | Creator日志出现build-script worker SIGTERM；后续日志仍有Build Assets success、Asset DB resume和Finished。未将诊断推断为良性。 |
| HTTP实际产物 | PASS | 既有4174 loopback服务PID 83580，目录为该隔离项目实际build输出；显式绕过环境代理后GET/HEAD `/`与`/assets/main/index.js`均200，响应hash匹配R1产物。见`evidence/HTTP_R1_CHECK.json`。 |
| Codex内置浏览器运行 | PASS | Master在390×844确认奶茶店默认新坐标、整组导出逐项匹配用户输入、微调后恢复及离页重进；720×1280逐店选择六店、确认投壶默认坐标。console warn/error为空。`evidence/RUNTIME_MANIFEST.json`绑定本轮源码SHA、HTTP主脚本SHA与11项证据。 |
| 真机与性能专项 | NOT_TESTED | 未执行。 |

构建绑定源码：Gallery `238a76c18a0b095e5646800e08f2c2adfbc7db1510bab75fb980823a5872ec82`；Camera `3b3b55cdb6cbc9cb7cb21bcfc30b521ddedc4edd830356296ec591b6bc085ef7`。初次HTTP客户端请求继承环境代理返回502；本轮通过绕过代理的loopback GET/HEAD取得200及匹配hash，并完成同一构建的Master内置浏览器核验。
