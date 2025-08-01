const sounds = {
  jump: { freq: 880, duration: 0.14, type: 'square' },
  collision: { freq: 100, duration: 0.22, type: 'sawtooth' },
  levelup: { freq: 1320, duration: 0.10, type: 'triangle' },
  cycle: { freq: 500, duration: 0.16, type: 'triangle' },
  gameover: { freq: 200, duration: 0.4, type: 'triangle' }
};

export default class AudioManager {
  constructor(game) {
    this.game = game;
    this.ctx = null;
    this.muted = !this.game.soundOn;
    this.bgmOsc = null;
    this.bgmGain = null;
  }

  setMuted(state) {
    this.muted = state;
    if (state) this.stopBgm();
    else if (this.game.state === 'playing') this.playBgm();
  }

  play(name) {
    if (this.muted || !sounds[name]) return;
    this._beep(sounds[name].freq, sounds[name].duration, sounds[name].type);
  }

  _beep(freq, duration, type='square') {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = 0.12;
    o.connect(g).connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + duration);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
  }

  playBgm() {
    if (this.muted || this.bgmOsc) return;
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmOsc = this.ctx.createOscillator();
    this.bgmGain = this.ctx.createGain();
    this.bgmOsc.type = 'triangle';
    this.bgmOsc.frequency.value = 96;
    this.bgmGain.gain.value = 0.045;
    this.bgmOsc.connect(this.bgmGain).connect(this.ctx.destination);
    this.bgmOsc.start();
  }

  stopBgm() {
    if (this.bgmOsc) {
      this.bgmOsc.stop();
      this.bgmOsc.disconnect();
      this.bgmOsc = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
  }
}