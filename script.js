const message = document.getElementById('message');

if (!self.crossOriginIsolated){
  message.innerHTML = 'COOP/COEP Error! Execution blocked.';
} else {
  message.innerHTML = 'Ready!';
}

const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  corePath: './dist/ffmpeg-core.js',
  progress: ({ ratio }) => {
    message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
  },
});

const transcode = async ({ target: { files }  }) => {
  try {
  const { name } = files[0];
  message.innerHTML = 'Loading ffmpeg-core.js';
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  message.innerHTML = 'Start transcoding';
  // await ffmpeg.FS('writeFile', name, files[0]);
  ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  var codec = document.getElementById("codec") || 'g';
  codec.output = codec.value.startsWith('h') ? 'mp4':'mp3';
  var output = "output."+codec.output;
  await ffmpeg.run('-err_detect', 'ignore_err', ' -f', codec.value, '-i', name, output);
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.FS('readFile', output);
  const audio = document.getElementById('output-audio');
  audio.src = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
    
  } catch(e) {  message.innerHTML = e; }
}
document.getElementById('uploader').addEventListener('change', transcode);
