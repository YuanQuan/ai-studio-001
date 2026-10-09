$ErrorActionPreference='Stop'
$evidence='D:\work\ai-studio-template\ai-studio-001\deliverables\client\U03-SHOP-FULL-REDRAW-CLIENT-20261009\v0.1\evidence'
$exe='C:\ProgramData\cocos\editors\Creator\3.8.8\CocosCreator.exe'
$project='D:\work\ai-studio-template\ai-studio-001\apps\client\temp\u03-shop-full-redraw-client-v01'
$config='D:\work\ai-studio-template\ai-studio-001\deliverables\client\U03-SHOP-FULL-REDRAW-CLIENT-20261009\v0.1\evidence\creator-build-config.json'
$admin=([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
@{started=(Get-Date).ToString('o');admin=$admin;project=$project;config=$config} | ConvertTo-Json | Set-Content (Join-Path $evidence 'creator-admin-launch.json') -Encoding utf8
if(-not $admin){@{status='BLOCKED';reason='Windows administrator token is not active'}|ConvertTo-Json|Set-Content (Join-Path $evidence 'creator-admin-result.json') -Encoding utf8;exit 1}
$proc=Start-Process -FilePath $exe -ArgumentList @('--project',('"'+$project+'"'),'--build',('"configPath='+$config+'"')) -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $evidence 'creator-cli-stdout.log') -RedirectStandardError (Join-Path $evidence 'creator-cli-stderr.log')
$heldHandle=$proc.Handle
@{pid=$proc.Id;started=(Get-Date).ToString('o');admin=$admin} | ConvertTo-Json | Set-Content (Join-Path $evidence 'creator-admin-process.json') -Encoding utf8
if($proc.WaitForExit(180000)){$proc.Refresh();@{pid=$proc.Id;exit_code=$proc.ExitCode;finished=(Get-Date).ToString('o');admin=$admin}|ConvertTo-Json|Set-Content (Join-Path $evidence 'creator-admin-result.json') -Encoding utf8}else{@{pid=$proc.Id;status='TIMEOUT';finished=(Get-Date).ToString('o');admin=$admin}|ConvertTo-Json|Set-Content (Join-Path $evidence 'creator-admin-result.json') -Encoding utf8}
