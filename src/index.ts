class HlsPlayableVideoElement extends HTMLVideoElement {

  constructor() {
    super();
    console.log('constructor')
  }

  connectedCallback() {
    console.log('connectedCallback');
  }

  static get observedAttributes() {
    return ['src'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(name, ' is change to ', newValue);
  }
}

customElements.define('hls-playable-video', HlsPlayableVideoElement, { extends: 'video' });
