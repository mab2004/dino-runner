export default class ScoreManager {
  constructor(game) {
    this.game = game;
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.speedLevel = 1;
    this.settings = this.loadSettings();
  }

  reset() {
    this.score = 0;
    this.speedLevel = 1;
  }

  update(dt, speed) {
    this.score += Math.floor(dt * speed * 1.2);
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
      return JSON.parse(localStorage.getItem('dino_settings')) || { soundOn: true };
    } catch {
      return { soundOn: true };
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