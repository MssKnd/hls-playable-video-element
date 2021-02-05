# HLS playable video element
This custom video element is hls playable. It's powereded by [hls.js](https://github.com/video-dev/hls.js).

```html
<script defer src='../dist/index.js' onload="loaded()"></script>

<video is="hls-playable" controls></video>

<script>
  const video = document.querySelector('video');
  function loaded() {
    video.config = {
      debug: true,
    };

    video.src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

    video.addEventListener('hlsMediaAttached', () => {
      console.log('media attached')
    })
  }
</script>
```
