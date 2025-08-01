export default class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.speedLevel = 1;
    this.settings = this.loadSettings();
    this.framesSinceStart = 0;
  }

  reset() {
    this.score = 0;
    this.speedLevel = 1;
    this.framesSinceStart = 0;
  }

  update(dt, gameSpeed) {
    // dhhruv's scoring logic from lines 168-170: points += 1 each frame
    this.score += 1;
    
    // Handle score rollover at 100000 (like Chrome dino)
    if (this.score >= 100000) {
      this.score = this.score % 100000;
    }
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
  }

  getFormattedScore() {
    // dhhruv's score display format - 5-digit zero-padded
    return this.score.toString().padStart(5, '0');
  }

  getFormattedHighScore() {
    // dhhruv's high score display format - 5-digit zero-padded  
    return this.highScore.toString().padStart(5, '0');
  }

  saveHighScore() {
    localStorage.setItem('dino_highscore', this.highScore);
  }

  loadHighScore() {
    return parseInt(localStorage.getItem('dino_highscore') || 0, 10);
  }

  saveSettings() {
    localStorage.setItem('dino_settings', JSON.stringify(this.settings));
  }

  loadSettings() {
    try {
      return JSON.parse(localStorage.getItem('dino_settings')) || { soundOn: true, bgmEnabled: false };
    } catch {
      return { soundOn: true, bgmEnabled: false };
    }
  }

  setSettings(opts) {
    Object.assign(this.settings, opts);
    this.saveSettings();
  }

  getSettings() {
    return this.settings;
  }
}