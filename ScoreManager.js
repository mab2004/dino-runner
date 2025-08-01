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

  update(dt, speed) {
    // Increment score per frame/pixel like Chrome dino (more authentic)
    this.framesSinceStart++;
    
    // Score increments based on frames and speed (roughly 1 point per 4-5 frames at base speed)
    const increment = Math.max(1, Math.floor(speed / 7)); // Scale with speed
    if (this.framesSinceStart % 4 === 0) {
      this.score += increment;
    }
    
    // Handle score rollover at 100000
    if (this.score >= 100000) {
      this.score = this.score % 100000;
    }
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }
    this.speedLevel = Math.floor(this.score / 200) + 1;
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