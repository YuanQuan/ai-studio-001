$project = 'D:\work\ai-studio-template\ai-studio-001\apps\client'
$config = 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence\creator-build-config.json'
$evidence = 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence'
$exe = 'C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe'
$started = Get-Date
$p = Start-Process -FilePath $exe -ArgumentList @('--project',('"'+$project+'"'),'--build',('"configPath='+$config+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $evidence 'creator-cli-stdout.log') -RedirectStandardError (Join-Path $evidence 'creator-cli-stderr.log')
@{pid=$p.Id; started=$started.ToString('o'); project=$project; config=$config; creator=$exe} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'creator-cli-start.json') -Encoding utf8
if ($p.WaitForExit(240000)) {
  $p.Refresh()
  @{exitCode=$p.ExitCode; finished=(Get-Date).ToString('o'); elapsedSeconds=[math]::Round(((Get-Date)-$started).TotalSeconds,1)} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'creator-cli-result.json') -Encoding utf8
} else {
  @{status='TIMEOUT';pid=$p.Id; observedAt=(Get-Date).ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $evidence 'creator-cli-result.json') -Encoding utf8
}
Get-Content (Join-Path $evidence 'creator-cli-result.json')
Get-Content (Join-Path $evidence 'creator-cli-stdout.log') -Tail 15 -ErrorAction SilentlyContinue
Get-Content (Join-Path $evidence 'creator-cli-stderr.log') -Tail 15 -ErrorAction SilentlyContinue
