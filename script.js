const message = document.getElementById('message');
const { createFFmpeg } = FFmpeg;
const ffmpeg = createFFmpeg({
  log: true,
  progress: ({ ratio }) => {
    message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
  },
});

const transcode = async ({ target: { files }  }) => {
  const { name } = files[0];
  message.innerHTML = 'Loading ffmpeg-core.js';
  await ffmpeg.load();
  message.innerHTML = 'Start transcoding';
  await ffmpeg.write(name, files[0]);
  var codec = document.getElementById("codec");
  codec.output = codec.value.startsWith('h') ? 'mp4':'mp3';
  var output = "output."+codec.output;
  var cmd = ['-f', codec.value, '-ar 8000', '-i', name, output]
  await ffmpeg.run(cmd.join(' '));
  message.innerHTML = 'Complete transcoding';
  const data = ffmpeg.read(output);
 
  const audio = document.getElementById('output-audio');
  audio.src = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
}
document.getElementById('uploader').addEventListener('change', transcode);