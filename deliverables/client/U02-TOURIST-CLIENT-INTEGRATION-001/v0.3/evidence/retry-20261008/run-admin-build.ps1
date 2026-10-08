$ErrorActionPreference = 'Stop'
$retryDir = 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence\retry-20261008'
$retryIdentity = [Security.Principal.WindowsIdentity]::GetCurrent()
$retryPrincipal = New-Object Security.Principal.WindowsPrincipal($retryIdentity)
$retryAdmin = $retryPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
@{started=(Get-Date).ToString('o');account=$retryIdentity.Name;administratorRoleActive=$retryAdmin} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $retryDir 'admin-launch.json') -Encoding utf8
if (-not $retryAdmin) { throw 'Windows administrator token is not active' }
$retryExe = 'C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe'
$retryProject = 'D:\work\ai-studio-template\ai-studio-001\apps\client'
$retryConfig = Join-Path $retryDir 'creator-build-config.json'
$retryProcess = Start-Process -FilePath $retryExe -ArgumentList @('--project',('"'+$retryProject+'"'),'--build',('"configPath='+$retryConfig+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $retryDir 'admin-stdout.log') -RedirectStandardError (Join-Path $retryDir 'admin-stderr.log')
@{pid=$retryProcess.Id;started=(Get-Date).ToString('o');config=$retryConfig} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $retryDir 'admin-attempt.json') -Encoding utf8
$retryProcess.WaitForExit()
$retryProcess.Refresh()
@{exitCode=$retryProcess.ExitCode;finished=(Get-Date).ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $retryDir 'admin-result.json') -Encoding utf8
