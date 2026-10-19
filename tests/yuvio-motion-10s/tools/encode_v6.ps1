param([string]$Master,[string]$OutputDirectory)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$ffmpegPath = Join-Path $projectRoot 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
if (-not (Test-Path -LiteralPath $ffmpegPath)) { throw 'Install the project dependencies before encoding.' }
if (-not (Test-Path -LiteralPath $Master)) { throw 'The ProRes master is missing.' }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
& $ffmpegPath -hide_banner -loglevel warning -i $Master -map 0:v:0 -map 0:a:0 -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 320k -movflags +faststart -y (Join-Path $OutputDirectory 'yuvio-walkthrough-v6.mp4')
if ($LASTEXITCODE -ne 0) { throw 'H.264 delivery encoding failed.' }
& $ffmpegPath -hide_banner -loglevel warning -i $Master -map 0:v:0 -map 0:a:0 -c:v hevc_nvenc -preset p7 -tune hq -rc vbr -cq 10 -b:v 0 -profile:v main10 -pix_fmt p010le -tag:v hvc1 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 320k -movflags +faststart -y (Join-Path $OutputDirectory 'yuvio-walkthrough-v6-10bit.mp4')
if ($LASTEXITCODE -ne 0) { throw '10-bit HEVC encoding failed. Use libx265 with yuv420p10le on a machine without HEVC NVENC.' }
