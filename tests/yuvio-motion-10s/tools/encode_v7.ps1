param([Parameter(Mandatory)][string]$Master,[Parameter(Mandatory)][string]$OutputDirectory,[switch]$UseConcat,[string]$AudioMaster,[string]$FfmpegExecutable)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
$ffmpegPath=Join-Path $projectRoot 'node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe'
if($FfmpegExecutable){$ffmpegPath=$FfmpegExecutable}
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null
$inputArgs=if($UseConcat){@('-f','concat','-safe','0','-segment_time_metadata','1','-i',$Master)}else{@('-i',$Master)}
$audioArgs=if($AudioMaster){@('-i',$AudioMaster,'-map','0:v:0','-map','1:a:0')}else{@('-map','0:v:0','-map','0:a:0')}
$timingArgs=if($UseConcat){@('-vf','select=concatdec_select,settb=1/60000,setpts=N*1000','-r','60','-fps_mode','cfr')}else{@()}
# CBR delivery requested for V7: actual bitrate is measured after export.
& $ffmpegPath -hide_banner -loglevel warning -progress (Join-Path $OutputDirectory 'v7-h264-progress.txt') @inputArgs @audioArgs @timingArgs -c:v h264_nvenc -preset p7 -tune hq -rc cbr -b:v 30M -minrate 30M -maxrate 30M -bufsize 60M -multipass fullres -spatial-aq 1 -temporal-aq 1 -aq-strength 5 -rc-lookahead 32 -profile:v high -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 320k -movflags +faststart -y (Join-Path $OutputDirectory 'yuvio-walkthrough-v7.mp4')
if($LASTEXITCODE -ne 0){throw 'V7 H.264 export failed'}
# High-quality Main 10 copy, encoded from the ProRes HQ working master.
& $ffmpegPath -hide_banner -loglevel warning -progress (Join-Path $OutputDirectory 'v7-hevc-progress.txt') @inputArgs @audioArgs @timingArgs -c:v hevc_nvenc -preset p7 -tune hq -rc vbr -cq 6 -b:v 0 -profile:v main10 -pix_fmt p010le -tag:v hvc1 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 320k -movflags +faststart -y (Join-Path $OutputDirectory 'yuvio-walkthrough-v7-10bit.mp4')
if($LASTEXITCODE -ne 0){throw 'V7 Main 10 export failed'}
