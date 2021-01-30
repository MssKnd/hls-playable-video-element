import Hls from 'hls.js';

class HlsPlayableVideoElement extends HTMLVideoElement {

  constructor() {
    super();
    console.log(Hls)
  }

  connectedCallback() {
    console.log('connectedCallback');
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // console.log(name, ' is change to ', newValue);
    if (
      name === 'src' &&
      newValue.endsWith('.m3u8') &&
      !this.canPlayType('application/vnd.apple.mpegurl')
    ) {
      console.log('aaaaaaa')
      const hls = new Hls();
      hls.loadSource(newValue);
      hls.attachMedia(this);
    }
  }
}

customElements.define('hls-playable-video', HlsPlayableVideoElement, { extends: 'video' });
