const sounds = {
  jump: { freq: 880, duration: 0.14, type: 'square' },
  collision: { freq: 150, duration: 0.3, type: 'sawtooth' },
  milestone: { freq: 1320, duration: 0.12, type: 'triangle' }
};

export default class AudioManager {
  constructor(game) {
    this.game = game;
    this.ctx = null;
    this.muted = !this.game.soundOn;
    this.lastSoundTime = {};
  }

  setMuted(state) {
    this.muted = state;
  }

  play(name) {
    if (this.muted || !sounds[name]) return;
    
    // Debounce sounds to prevent overlapping
    const now = Date.now();
    if (this.lastSoundTime[name] && now - this.lastSoundTime[name] < 100) return;
    this.lastSoundTime[name] = now;
    
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

  // Remove background music methods
  playBgm() {
    // No continuous background music in Chrome dino
  }

  stopBgm() {
    // No continuous background music in Chrome dino
  }
}