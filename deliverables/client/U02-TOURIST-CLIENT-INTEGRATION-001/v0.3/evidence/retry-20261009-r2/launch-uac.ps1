$ErrorActionPreference = 'Stop'
$r2Script = 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence\retry-20261009-r2\run-admin-build.ps1'
$argumentList = '-NoProfile -ExecutionPolicy Bypass -File "' + $r2Script + '"'
$elevated = Start-Process -FilePath 'powershell.exe' -ArgumentList $argumentList -Verb RunAs -WindowStyle Hidden -PassThru
@{launcherPid=$elevated.Id;launchedAt=(Get-Date).ToString('o');script=$r2Script} | ConvertTo-Json | Set-Content -LiteralPath 'D:\work\ai-studio-template\ai-studio-001\deliverables\client\U02-TOURIST-CLIENT-INTEGRATION-001\v0.3\evidence\retry-20261009-r2\uac-launcher.json' -Encoding utf8
