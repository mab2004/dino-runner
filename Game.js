import Player from './Player.js';
import Obstacle from './Obstacle.js';
import Background from './Background.js';
import InputHandler from './InputHandler.js';
import ScoreManager from './ScoreManager.js';
import AudioManager from './AudioManager.js';
import UIManager from './UIManager.js';

export default class Game {
  constructor(canvas, ctx, logicalWidth, logicalHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.logicalWidth = logicalWidth || 800;
    this.logicalHeight = logicalHeight || 300;
    // Game state
    this.state = 'menu'; // menu, playing, gameover
    this.entities = [];
    this.lastTime = 0;
    this.delta = 0;

    // Managers
    this.audioManager = new AudioManager(this);
    this.scoreManager = new ScoreManager(this);
    this.input = new InputHandler(this);
    this.background = new Background(this);
    this.player = new Player(this);
    this.obstacles = [];
    this.ui = new UIManager(this);

    // Difficulty (Chrome-like)
    this.baseSpeed = 7;
    this.speed = this.baseSpeed;
    this.spawnTimer = 0;
    this.spawnInterval = 90;
    this.lastMilestone = 0;
    
    // Day/night cycle
    this.dayNight = false;
    this.cycleTimer = 0;
    this.cycleInterval = 700; // points

    // Initialize sound settings properly
    const settings = this.scoreManager.getSettings();
    this.soundOn = settings.soundOn ?? true;
    this.audioManager.bgmEnabled = settings.bgmEnabled ?? false;
    
    // Apply initial audio state
    this.audioManager.setMuted(!this.soundOn);

    // Bindings
    this.loop = this.loop.bind(this);

    // Start
    this.reset();
    requestAnimationFrame(this.loop);
  }

  reset() {
    this.state = 'menu';
    this.obstacles = [];
    this.scoreManager.reset();
    this.player.reset();
    this.speed = this.baseSpeed;
    this.spawnTimer = 0;
    this.background.reset();
    this.dayNight = false;
    this.cycleTimer = 0;
    this.lastMilestone = 0;
  }

  startGame() {
    this.reset();
    this.state = 'playing';
    // Start background music if enabled
    if (this.audioManager.bgmEnabled) {
      this.audioManager.playBgm();
    }
  }

  gameOver() {
    this.state = 'gameover';
    this.audioManager.play('collision');
    this.audioManager.stopBgm(); // Stop background music on game over
    this.scoreManager.saveHighScore();
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    this.scoreManager.setSettings({ soundOn: this.soundOn });
    this.audioManager.setMuted(!this.soundOn);
  }

  toggleBgm() {
    this.audioManager.toggleBgm();
  }

  update(dt) {
    if (this.state === 'playing') {
      this.background.update(dt);
      this.player.update(dt);

      // Spawn obstacles
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnObstacle();
        this.spawnTimer = this.spawnInterval / this.speed * 60 + Math.random() * 40;
      }

      // Update obstacles
      for (const obs of this.obstacles) {
        obs.update(dt, this.speed);
      }
      // Remove off-screen
      this.obstacles = this.obstacles.filter(o => !o.isOffScreen());

      // Collision
      for (const obs of this.obstacles) {
        if (obs.collides(this.player)) {
          this.gameOver();
          return;
        }
      }

      // Score & Difficulty (Chrome-like progression)
      this.scoreManager.update(dt, this.speed);
      const pts = this.scoreManager.score;
      
      // Speed increases by ~1 per 100 points (max ~14)
      const newSpeed = Math.min(this.baseSpeed + Math.floor(pts / 100), 14);
      if (newSpeed > this.speed) {
        this.speed = newSpeed;
      }
      
      // Milestone sound every 100 points
      if (pts > 0 && pts % 100 === 0 && pts !== this.lastMilestone) {
        this.audioManager.play('milestone');
        this.lastMilestone = pts;
      }
      
      // Day/night every 700 pts (less frequent)
      if (Math.floor(pts/700) % 2 !== this.dayNight) {
        this.dayNight = !this.dayNight;
        this.background.toggleDayNight(this.dayNight);
      }
    }
  }

  spawnObstacle() {
    // Random: cactus or pterodactyl (after score 200+)
    let type = 'cactus';
    const currentLevel = Math.floor(this.scoreManager.score / 200) + 1;
    if (currentLevel >= 2 && Math.random() > 0.6) type = 'pterodactyl';
    this.obstacles.push(new Obstacle(this, type));
  }

  render() {
    // Clear canvas once at the start of each frame (use logical dimensions)
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    
    // Draw in proper order
    this.background.draw(this.ctx);

    if (this.state === 'playing') {
      // Draw obstacles behind player
      for (const obs of this.obstacles) obs.draw(this.ctx);
      this.player.draw(this.ctx);
      this.ui.drawHud(this.ctx);
    } else if (this.state === 'menu') {
      this.ui.drawMenu(this.ctx);
    } else if (this.state === 'gameover') {
      // Draw obstacles and player for context
      for (const obs of this.obstacles) obs.draw(this.ctx);
      this.player.draw(this.ctx);
      this.ui.drawGameOver(this.ctx);
    }
  }

  loop(ts) {
    if (!this.lastTime) this.lastTime = ts;
    let dt = Math.min((ts - this.lastTime) / 16.666, 2); // cap to 2x speed (avoid jumps)
    this.lastTime = ts;
    this.update(dt);
    this.render();
    requestAnimationFrame(this.loop);
  }
}