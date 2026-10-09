$ErrorActionPreference = 'Stop'
$r2Dir = 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence\retry-20261009-r2'
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
$admin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
@{started=(Get-Date).ToString('o');account=$identity.Name;administratorRoleActive=$admin} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $r2Dir 'admin-launch.json') -Encoding utf8
if (-not $admin) { throw 'Windows administrator token is not active' }
$exe = 'C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe'
$project = 'D:\work\ai-studio-template\ai-studio-001\apps\client'
$config = Join-Path $r2Dir 'creator-build-config.json'
$proc = Start-Process -FilePath $exe -ArgumentList @('--project',('"'+$project+'"'),'--build',('"configPath='+$config+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $r2Dir 'admin-stdout.log') -RedirectStandardError (Join-Path $r2Dir 'admin-stderr.log')
@{pid=$proc.Id;started=(Get-Date).ToString('o');config=$config} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $r2Dir 'admin-attempt.json') -Encoding utf8
$proc.WaitForExit()
$proc.Refresh()
@{exitCode=$proc.ExitCode;finished=(Get-Date).ToString('o')} | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $r2Dir 'admin-result.json') -Encoding utf8
