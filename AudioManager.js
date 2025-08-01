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
    this.bgmEnabled = false;
    this.bgmGain = null;
    this.bgmOscillators = [];
    this.bgmStartTime = 0;
  }

  setMuted(state) {
    this.muted = state;
    if (state && this.bgmEnabled) {
      this.stopBgm();
    } else if (!state && this.game.state === 'playing') {
      this.playBgm();
    }
  }

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    this.game.scoreManager.setSettings({ bgmEnabled: this.bgmEnabled });
    
    if (this.bgmEnabled && !this.muted && this.game.state === 'playing') {
      this.playBgm();
    } else {
      this.stopBgm();
    }
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

  // Simple background music loop inspired by classic arcade games
  playBgm() {
    if (!this.bgmEnabled || this.muted || !window.AudioContext && !window.webkitAudioContext) return;
    
    this.stopBgm(); // Stop any existing music
    
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a simple melody loop
    const melody = [
      { freq: 523, duration: 0.25 }, // C5
      { freq: 587, duration: 0.25 }, // D5
      { freq: 659, duration: 0.25 }, // E5
      { freq: 523, duration: 0.25 }, // C5
      { freq: 523, duration: 0.25 }, // C5
      { freq: 587, duration: 0.25 }, // D5
      { freq: 659, duration: 0.5 },  // E5 (longer)
      { freq: 440, duration: 0.25 }, // A4
      { freq: 494, duration: 0.25 }, // B4
      { freq: 523, duration: 0.5 },  // C5 (longer)
    ];
    
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.03; // Very quiet background music
    this.bgmGain.connect(this.ctx.destination);
    
    this.bgmStartTime = this.ctx.currentTime;
    this._playMelodyLoop(melody, 0);
  }

  _playMelodyLoop(melody, noteIndex) {
    if (!this.bgmEnabled || this.muted || !this.bgmGain) return;
    
    const note = melody[noteIndex];
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = note.freq;
    noteGain.gain.value = 0.5;
    
    osc.connect(noteGain);
    noteGain.connect(this.bgmGain);
    
    const startTime = this.ctx.currentTime;
    const endTime = startTime + note.duration;
    
    osc.start(startTime);
    osc.stop(endTime);
    noteGain.gain.linearRampToValueAtTime(0, endTime);
    
    this.bgmOscillators.push(osc);
    
    // Schedule next note
    const nextIndex = (noteIndex + 1) % melody.length;
    const delay = note.duration * 1000;
    
    setTimeout(() => {
      this._playMelodyLoop(melody, nextIndex);
    }, delay);
  }

  stopBgm() {
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
    
    this.bgmOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.bgmOscillators = [];
  }
}