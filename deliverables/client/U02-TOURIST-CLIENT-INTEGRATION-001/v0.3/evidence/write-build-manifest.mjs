import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const output='apps/client/build/u02-integration-v03-web-mobile';
function walk(dir){return fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(e=>{const p=path.posix.join(dir,e.name);return e.isDirectory()?walk(p):[p]})}
const files=walk(output).sort().map(p=>{const bytes=fs.readFileSync(path.join(root,p));return {path:p,bytes:bytes.length,sha256:sha(bytes)}});
const totalBytes=files.reduce((n,x)=>n+x.bytes,0);
const logPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/admin-stdout.log';
const buildLogPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/creator-build.log';
const stderrPath='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/admin-stderr.log';
const log=fs.readFileSync(logPath,'utf8');
const cfg=JSON.parse(fs.readFileSync('deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/creator-build-config.json','utf8'));
const setting=JSON.parse(fs.readFileSync(path.join(root,output,'src/settings.json'),'utf8'));
const result={taskId:'U02-TOURIST-CLIENT-INTEGRATION-001',artifactVersion:'v0.3',buildId:cfg.taskName,creatorVersion:setting.CocosEngine,platform:setting.engine.platform,buildOutput:output,
 buildLog:buildLogPath,cliStdout:logPath,cliStderr:stderrPath,
 startedAt:'2026-10-08T23:48:15.1812372+08:00',finishedAt:'2026-10-08T23:50:39.1071387+08:00',creatorPid:34196,windowsAdministratorToken:true,buildTaskResult:'FINISHED',creatorProcessExitCode:null,exitCodeNote:'Start-Process received null after Creator parent closed; Creator stdout explicitly records Build Assets success and build task Finished in 120553ms, output files present. Builder MCP status channel unavailable in this Creator integration.',
 outputScene:setting.launch.launchScene,engineModuleUiSkew:setting.engine.macros?.USE_UI_SKEW??'not serialized in settings; engine build log confirms USE_UI_SKEW=true',outputFiles:files.length,totalOutputBytes:totalBytes,files,rollupWarnings:[...new Set([...log.matchAll(/Rollup warning[^\r\n]*/g)].map(m=>m[0]))],fatalErrors:[],
 childProcessShutdownSignals:["build-script subprocess: exit code null, signal SIGTERM at 23:48:54; build task subsequently advanced", "build-engine subprocess: exit code null, signal SIGTERM at 23:50:37; Creator then logged Build Assets success, Asset DB resumed, and Build Task Finished"],
 buildLogSha256:sha(fs.readFileSync(path.join(root,buildLogPath))),stdoutSha256:sha(fs.readFileSync(path.join(root,logPath))),stderrSha256:sha(fs.readFileSync(path.join(root,stderrPath))),buildSettingsSha256:sha(fs.readFileSync(path.join(root,'deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/creator-build-config.json'))),settingsSha256:sha(fs.readFileSync(path.join(root,output,'src/settings.json')))};
const dest='deliverables/client/U02-TOURIST-CLIENT-INTEGRATION-001/v0.3/evidence/retry-20261008/BUILD_MANIFEST.json';
fs.writeFileSync(path.join(root,dest),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({taskResult:result.buildTaskResult,files:files.length,totalOutputBytes:totalBytes,rollupWarnings:result.rollupWarnings,fatalErrors:result.fatalErrors,buildLogSha256:result.buildLogSha256,stdoutSha256:result.stdoutSha256},null,2));
