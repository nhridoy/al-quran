export interface AudioEngine {
  play(): Promise<void>;
  pause(): void;
  currentTime: number;
  volume: number;
  readonly duration: number;
  src: string;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
  destroy(): void;
}

export class DefaultAudioEngine implements AudioEngine {
  private audio = new Audio();

  constructor() {
    this.audio.preload = "metadata";
  }

  play() {
    return this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  get currentTime() {
    return this.audio.currentTime;
  }

  set currentTime(time: number) {
    this.audio.currentTime = time;
  }

  get volume() {
    return this.audio.volume;
  }

  set volume(vol: number) {
    this.audio.volume = vol;
  }

  get duration() {
    return this.audio.duration;
  }

  get src() {
    return this.audio.src;
  }

  set src(url: string) {
    this.audio.src = url;
  }

  addEventListener(type: string, listener: EventListener) {
    this.audio.addEventListener(type, listener);
  }

  removeEventListener(type: string, listener: EventListener) {
    this.audio.removeEventListener(type, listener);
  }

  destroy() {
    this.audio.pause();
    this.audio.src = "";
  }
}

export function createDefaultAudioEngine(): AudioEngine {
  return new DefaultAudioEngine();
}
