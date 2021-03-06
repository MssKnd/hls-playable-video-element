import Hls from 'hls.js';

type HlsEventType = typeof Hls.Events[keyof typeof Hls.Events];

export class HlsPlayableVideoElement extends HTMLVideoElement {
  hls: Hls | null = null;
  #config: Partial<Hls.Config> = {};
  #playlist: string | null = null;
  #enableHlsJs = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #callbacks: { [key in HlsEventType]?: (event: HlsEventType, data: any) => void } = {};
  #enableDebug = false;

  constructor() {
    super();
    this.#enableHlsJs = Hls.isSupported() || !this.canPlayType('application/vnd.apple.mpegurl');
  }

  private static get observedAttributes() {
    return ['src'];
  }

  get config(): Partial<Hls.Config> {
    return { ...this.#config };
  }

  set config(value: Partial<Hls.Config>) {
    if (this.#enableHlsJs) {
      if (value?.debug) {
        this.#enableDebug = true;
        this.logger('hls.js ' + this.#enableHlsJs ? 'enabled' : 'disabled');
      } else {
        this.#enableDebug = false;
      }
      this.#config = value;
      this.logger('config updated');
      if (this.src) {
        this.initHlsJs();
      }
    }
  }

  private attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    this.logger('attribute change:' + name);
    if (
      name === 'src' &&
      newValue?.endsWith('.m3u8') &&
      this.#enableHlsJs
    ) {
      this.#playlist = newValue;
      this.logger('playlist updated');

      if (!this.hls) {
        this.initHlsJs();
      }

      return false;
    }
  }

  private disconnectedCallback(): void {
    this.logger('disconnect');
    if (this.hls) {
      this.removeHlsJsEventListner();
    }
  }

  private initHlsJs() {
    if (this.hls) {
      this.removeHlsJsEventListner();
      this.hls.destroy();
      this.logger('hls.js destroyed');
    }
    this.hls = new Hls(this.#config);
    this.hls.attachMedia(this);
    this.logger('hls.js initialized');

    if (this.#playlist) {
      this.hls?.loadSource(this.#playlist);
    }

    for (const hlsEventType of Object.values(Hls.Events)) {
      this.#callbacks[hlsEventType] = (event, data) => this.dispatchEvent(new CustomEvent(event, { detail: data }));
      // @ts-ignore
      this.hls.on(hlsEventType, this.#callbacks[hlsEventType]);
    }
  }

  private removeHlsJsEventListner() {
    for (const hlsEventType of Object.values(Hls.Events)) {
      // @ts-ignore
      this.hls?.off(hlsEventType, this.#callbacks[hlsEventType]);
    }
    this.hls?.detachMedia();
    this.hls?.destroy();
    this.logger('finalaized');
  }

  private logger(message: string) {
    if (this.#enableDebug) {
      console.log('[log: hls-playable] > ' + message);
    }
  }
}

if (!customElements.get('hls-playable')) {
  customElements.define('hls-playable', HlsPlayableVideoElement, { extends: 'video' });
}
