const message = document.getElementById('message');
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
  await ffmpeg.load();
  message.innerHTML = 'Start transcoding';
  // await ffmpeg.FS('writeFile', name, files[0]);
  ffmpeg.FS('writeFile', name, await fetchFile(files[0]));
  var codec = document.getElementById("codec");
  codec.output = codec.value.startsWith('h') ? 'mp4':'mp3';
  var output = "output."+codec.output;
  var cmd = ['', '-i', name, '-f', codec.value, '-ar 8000', output]
  await ffmpeg.run(cmd.join(' '));
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.FS('readFile', output);
  const audio = document.getElementById('output-audio');
  audio.src = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
    
  } catch(e) {  message.innerHTML = e; }
}
document.getElementById('uploader').addEventListener('change', transcode);
