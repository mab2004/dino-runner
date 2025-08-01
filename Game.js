import Player from './Player.js';
import Obstacle from './Obstacle.js';
import Background from './Background.js';
import InputHandler from './InputHandler.js';
import ScoreManager from './ScoreManager.js';
import AudioManager from './AudioManager.js';
import UIManager from './UIManager.js';

export default class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
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

    // Difficulty
    this.baseSpeed = 7;
    this.speed = this.baseSpeed;
    this.level = 1;
    this.spawnTimer = 0;
    this.spawnInterval = 90;
    // Day/night cycle
    this.dayNight = false;
    this.cycleTimer = 0;
    this.cycleInterval = 1000; // points

    this.soundOn = this.scoreManager.getSettings().soundOn ?? true;

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
    this.level = 1;
    this.spawnTimer = 0;
    this.background.reset();
    this.dayNight = false;
    this.cycleTimer = 0;
  }

  startGame() {
    this.reset();
    this.state = 'playing';
    this.audioManager.playBgm();
  }

  gameOver() {
    this.state = 'gameover';
    this.audioManager.stopBgm();
    this.audioManager.play('gameover');
    this.scoreManager.saveHighScore();
  }

  toggleSound() {
    this.soundOn = !this.soundOn;
    this.scoreManager.setSettings({ soundOn: this.soundOn });
    this.audioManager.setMuted(!this.soundOn);
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

      // Score & Difficulty
      this.scoreManager.update(dt, this.speed);
      const pts = this.scoreManager.score;
      // Level up every 200 pts
      if (Math.floor(pts/200) + 1 > this.level) {
        this.level = Math.floor(pts/200) + 1;
        this.speed += 0.7;
        this.audioManager.play('levelup');
      }
      // Day/night every 1000 pts
      if (Math.floor(pts/this.cycleInterval) % 2 !== this.dayNight) {
        this.dayNight = !this.dayNight;
        this.background.toggleDayNight(this.dayNight);
        this.audioManager.play('cycle');
      }
    }
  }

  spawnObstacle() {
    // Random: cactus or pterodactyl (after level 2)
    let type = 'cactus';
    if (this.level >= 2 && Math.random() > 0.6) type = 'pterodactyl';
    this.obstacles.push(new Obstacle(this, type));
  }

  render() {
    // Clear canvas once at the start of each frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
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