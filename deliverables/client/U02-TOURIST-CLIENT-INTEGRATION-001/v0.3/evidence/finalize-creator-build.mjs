import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);
const json=p=>JSON.parse(read(p));
const writeJson=(p,x)=>write(p,JSON.stringify(x,null,2)+'\n');
const map=json('apps/client/assets/units/ghost-customer/data/ug_ghost_01_asset_map.json');
const manifest=json('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/BUILD_MANIFEST.json');
const importAudit=json('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/creator-import-library-audit.json');
if(importAudit.status!=='PASS'||manifest.buildTaskResult!=='FINISHED'||manifest.outputFiles<100)throw new Error('Creator build/import evidence not sufficient to finalize');

const registryPath='project/ASSET_HANDOFF_REGISTRY.md';
let registry=read(registryPath);
const marker='## U02 VFX v0.2 Gate2 正式接入（Client v0.3）';
const split=registry.indexOf(marker);
if(split<0)throw new Error('v0.3 registry section missing');
const head=registry.slice(0,split), section=registry.slice(split);
let lines=section.split(/\r?\n/);
for(const row of map.assets.filter(x=>x.kind==='body_frame')){
 const old=['walk','run'].includes(row.action)?row.index<6:row.index<4;
 const status=old?'EXISTING_UUID_PRESERVED_LIBRARY_RECHECKED':'NEW_UUID_IMPORTED_LIBRARY_FULL_CANVAS_VERIFIED';
 const idx=lines.findIndex(line=>line.startsWith(`| \`${row.stableId}\` |`));
 if(idx<0)throw new Error(`registry row missing ${row.stableId}`);
 lines[idx]=lines[idx].replace(/\| (EXISTING_UUID_PRESERVED_IMPORT_PENDING_RECHECK|META_PREPARED_IMPORT_PENDING|NEW_UUID_IMPORTED_LIBRARY_FULL_CANVAS_VERIFIED|EXISTING_UUID_PRESERVED_LIBRARY_RECHECKED)\s*\|\s*$/,`| ${status} |`);
}
lines=lines.map(line=>line.includes('新增 SpriteFrame UUID 根据稳定 meta 文件写入，Creator AssetDB/Library/导入及运行状态待当前 Editor 重导与实测确认；本表中的 META_PREPARED_IMPORT_PENDING 不表示 Creator 已导入。')
 ? line.replace('新增 SpriteFrame UUID 根据稳定 meta 文件写入，Creator AssetDB/Library/导入及运行状态待当前 Editor 重导与实测确认；本表中的 META_PREPARED_IMPORT_PENDING 不表示 Creator 已导入。','Creator 3.8.8 AssetDB 已导入并从 Library 实查 40 主体帧与 4 个附件：真实 image/Texture2D/SpriteFrame UUID 与登记一致、PNG Library SHA-256 一致、SpriteFrame 全画布 rect/originalSize 与源尺寸一致；本表区分保留 UUID 重导核验与新 UUID 首次导入核验。')
 : line);
write(registryPath,head+lines.join('\n'));

const auditPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/RESOURCE_AND_FRAME_AUDIT.json';
const audit=json(auditPath);
audit.creatorImport='IMPORTED_LIBRARY_VERIFIED';
audit.creatorBuild='BUILT';
audit.buildManifest='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/BUILD_MANIFEST.json';
audit.staticAudit.creatorImport='IMPORTED_LIBRARY_VERIFIED';
audit.staticAudit.creatorBuild='BUILT';
audit.staticAudit.creatorImportAudit={status:'PASS',checkedAssets:44,bodyFrames:40,accessorySlices:4,errors:[]};
audit.runtimeAnimation='NOT_TESTED_PENDING_IAB';
audit.runtimeMountAndMirror='NOT_TESTED_PENDING_IAB';
audit.webPerformance='NOT_TESTED';
writeJson(auditPath,audit);

const runtimePath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/WEB_RUNTIME_RECORD.md';
let runtime=read(runtimePath).replace('状态：`NOT_TESTED`（Creator 加载环境阻塞）','状态：`BUILD_AVAILABLE_BROWSER_VERIFY_PENDING`（Creator 导入/构建已通过；IAB 实测待 Master 执行）');
runtime=runtime.replace('- Creator CLI build：未生成构建产物；CLI 结果为 `TIMEOUT`。stderr 记录 Creator 3.8.8 安装缓存文件 `C:\\ProgramData\\cocos\\editors\\Creator\\3.8.8\\resources\\resources\\3d\\engine\\bin\\.cache\\dev\\editor\\import-map.json` 写入失败 `EPERM`，之后报告 `engine - query-engine-info` 缺失。','- Creator 管理员会话 CLI build：Creator 3.8.8 Web-Mobile 任务于 2026-10-08 23:50:38 记录 `Finished in 120553ms`；输出 147 文件、20,421,577 bytes。构建日志见 `evidence/retry-20261008/creator-build.log`，构建文件 SHA-256 列表见 `evidence/retry-20261008/BUILD_MANIFEST.json`。Creator 包装进程 ExitCode 为 null，但日志明确记录 Build Assets success、Asset DB resumed、Task Finished，输出文件完整存在；无构建 fatal errors，唯一 Rollup warning 为 DragonBones `THIS_IS_UNDEFINED`。');
runtime=runtime.replace('- HTTP 服务：未启动；Codex 内置浏览器：未打开本版运行产物；构建日志、截图与控制台记录：无。','- HTTP：`http://127.0.0.1:8774/`，根页已由 Invoke-WebRequest 验证 HTTP 200；服务 PID 记录于 `evidence/retry-20261008/http-server.json`。Codex 内置浏览器与实际画面尚待 Master 核验；本版截图及运行控制台记录待补。');
runtime=runtime.replace('使用 Creator 3.8.8 以有权写入安装引擎缓存的 Windows 管理员会话重新打开 `apps/client`，等待 AssetDB 导入后，从 Build 面板导入 `evidence/creator-build-config.json` 并构建 `web-mobile`。成功后用 loopback HTTP 和 Codex 内置浏览器验证：','使用已运行的 v0.3 `web-mobile` 构建和 loopback HTTP，在 Codex 内置浏览器验证：');
runtime=runtime.replace('上述结果取得前不报告 Web 运行或视觉通过，也不以历史 v0.2/R5 构建作为 v0.3 证据。','上述 IAB 运行/视觉结果取得前，不报告 Web 运行或视觉通过；不以历史 v0.2/R5 构建替代 v0.3 证据。');
write(runtimePath,runtime);

const implPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/IMPLEMENTATION_REPORT.md';
write(implPath,read(implPath)+[
  '', '', '## Creator 导入与构建补充证据', '',
  '用户授权管理员 UAC 会话后，Creator 3.8.8 AssetDB 成功导入。', '',
  '- `evidence/audit-creator-import.mjs` 检查 40 个主体帧和 4 个附件：meta 导入标记、image/Texture2D/SpriteFrame UUID、Library PNG 哈希、SpriteFrame 全画布 rect/originalSize、零偏移均通过；Library 源 PNG 与客户端资源 SHA-256 一致。',
  '- `web-mobile` Build Task `(U02-TOURIST-CLIENT-INTEGRATION-001-v0.3)` 日志记录 Finished，耗时 120553ms；输出 147 文件，总计 20,421,577 bytes。身份与每文件 SHA-256 见 `evidence/retry-20261008/BUILD_MANIFEST.json`。Creator 父进程记录的 ExitCode 为 null，但其 stdout 明确记录 Build Assets success、Asset DB resume 和 Finished；未见 fatal error。',
  '- HTTP 服务 PID 32812 提供 `http://127.0.0.1:8774/`，根页 HTTP 200。等待 Master 完成 IAB 画面检查；浏览器运行、动作视觉、U01 当前构建回归、性能仍未由本 Client 记录确认。', ''
].join('\n'));

const u01Path='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/U01_REGRESSION_RECORD.md';
write(u01Path,read(u01Path).replace('U02 v0.3 尚未成功导入/构建','U02 v0.3 已成功导入并构建，但尚未在当前构建中进行浏览器回归'));

const dPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/DELIVERABLE.json';
const d=json(dPath);
const creatorIndex=d.acceptance_results.findIndex(x=>x.criterion.includes('Creator 3.8.8 导入、Web-Mobile 构建'));
if(creatorIndex>=0){
 d.acceptance_results.splice(creatorIndex,1,
  {criterion:'Creator 3.8.8 AssetDB 导入后回读主体帧和独立配件真实 UUID/Library 全画布属性',result:'PASS',evidence:'evidence/creator-import-library-audit.json：40主体帧+4附件，44项 UUID/Library PNG SHA/全画布检查全部通过。'},
  {criterion:'Creator 3.8.8 Web-Mobile 构建及输出身份清单',result:'PASS',evidence:'evidence/retry-20261008/BUILD_MANIFEST.json：Task FINISHED，147 files / 20,421,577 bytes；build log 和各输出文件 SHA-256 已登记。包装进程 exitCode=null，Creator stdout明确记录 Build Assets success 与 Task Finished。'},
  {criterion:'v0.3 Web 浏览器运行及动作/附件/happy03视觉检查',result:'NOT_TESTED',evidence:'HTTP 根页已验证 200；等待 Master 在 Codex IAB 验证实际画面并回传证据。'});
}
d.risks=d.risks.filter(x=>!x.includes('Creator 安装缓存 EPERM'));
d.risks.push('IAB 浏览器运行、happy03 帽顶裁切、运行时挂点/镜像层序、U01当前构建回归及性能仍待补证。');
writeJson(dPath,d);

const reviewPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/CLIENT_REVIEW.json';
const review=json(reviewPath);
review.findings=review.findings.map(f=>f.message.startsWith('Creator 3.8.8 CLI 加载安装目录引擎缓存')?
 {severity:'INFO',message:'管理员会话下 Creator 3.8.8 已完成 AssetDB 导入和 Web-Mobile Build Task。Library 44/44 UUID/哈希/全画布检查通过；构建输出 147 文件。父进程 exitCode 为 null，但 stdout明确记载 Build Assets success 和 Task Finished。IAB 运行视觉仍待独立核验。'}:f.message.startsWith('本地 asset map 中计划 SpriteFrame UUID')?
 {severity:'INFO',message:'原计划导入 UUID 已由 Creator AssetDB/Library 回读核验：40主体帧+4附件 UUID、SHA-256 和全画布 rect/originalSize 一致。'}:f);
review.findings.push({severity:'MAJOR',message:'HTTP 根页已返回 200，但 IAB 实际动作循环、挂点/镜像、配件层序、happy03帽顶及 U01 回归仍缺当前构建运行证据；性能和正式 QA TEST_REPORT 也未完成。'});
review.next_action='Master 使用 http://127.0.0.1:8774/ 在 Codex IAB 完成实际运行/画面核验并记录证据；Client 据此更新运行与回归记录，随后由 Art、Tech、UI、QA、Master 完成同版 Review，Producer 管理用户审批及 QA 门禁。';
writeJson(reviewPath,review);
console.log(JSON.stringify({updatedRegistryBodyRows:40,buildFiles:manifest.outputFiles,creatorAssetsChecked:importAudit.checkedAssets,serverUrl:'http://127.0.0.1:8774/'},null,2));
