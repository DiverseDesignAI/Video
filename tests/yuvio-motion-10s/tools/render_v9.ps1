param([string]$OutputPath,[int]$Concurrency=6)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
if(-not $OutputPath){$OutputPath=Join-Path ([IO.Path]::GetFullPath((Join-Path $projectRoot '../../../..'))) 'work/yuvio-v9-master.mkv'}
$cli=Join-Path $projectRoot 'node_modules/.bin/remotion.cmd'
$publicPath=Join-Path $projectRoot 'public'
# Explicit ANGLE is required: Chrome's automatic backend can omit layers around
# backdrop-filter and changing material clips. Verified against every critical frame.
& $cli render (Join-Path $projectRoot 'src/index.tsx') YuvioMotionTest $OutputPath --codec=prores --prores-profile=hq --audio-codec=pcm-16 --pixel-format=yuv422p10le --image-format=png --color-space=bt709 --gl=angle --browser-executable='C:/Program Files/Google/Chrome/Application/chrome.exe' "--public-dir=$publicPath" "--concurrency=$Concurrency"
if($LASTEXITCODE -ne 0){throw 'V9 master render failed'}
