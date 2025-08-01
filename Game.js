import Player from './Player.js';
import Obstacle from './Obstacle.js';
import Background from './Background.js';
import InputHandler from './InputHandler.js';
import ScoreManager from './ScoreManager.js';
import AudioManager from './AudioManager.js';
import UIManager from './UIManager.js';
import AssetManager from './AssetManager.js';

export default class Game {
  constructor(canvas, ctx, logicalWidth, logicalHeight) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.logicalWidth = logicalWidth || 800;
    this.logicalHeight = logicalHeight || 300;
    // Game state
    this.state = 'loading'; // loading, menu, playing, gameover
    this.entities = [];
    this.lastTime = 0;
    this.delta = 0;

    // Asset manager - must load before initializing other managers
    this.assetManager = new AssetManager();
    
    // Initialize managers (will be set up after assets load)
    this.audioManager = null;
    this.scoreManager = null;
    this.input = null;
    this.background = null;
    this.player = null;
    this.obstacles = [];
    this.ui = null;

    // Game speed and difficulty - Based on dhhruv's chromedino.py line 172
    // dhhruv: game_speed = 20, increments by 1 every 100 points (lines 170-171)
    this.gameSpeed = 20; // dhhruv starts at game_speed = 20
    this.spawnTimer = 0;
    this.lastMilestone = 0;
    
    // Day/night cycle - removed for now to match dhhruv's simpler approach
    
    // Initialize the game
    this.initialize();
  }

  async initialize() {
    // Load all assets first
    try {
      await this.assetManager.loadAllAssets();
      
      // Now initialize all managers with loaded assets
      this.audioManager = new AudioManager(this);
      this.scoreManager = new ScoreManager(this);
      this.input = new InputHandler(this);
      this.background = new Background(this);
      this.player = new Player(this);
      this.ui = new UIManager(this);

      // Initialize sound settings properly
      const settings = this.scoreManager.getSettings();
      this.soundOn = settings.soundOn ?? true;
      this.audioManager.bgmEnabled = settings.bgmEnabled ?? false;
      
      // Apply initial audio state
      this.audioManager.setMuted(!this.soundOn);

      // Ready to start
      this.state = 'menu';
      this.reset();
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.state = 'error';
    }
  }

  reset() {
    this.state = 'menu';
    this.obstacles = [];
    if (this.scoreManager) this.scoreManager.reset();
    if (this.player) this.player.reset();
    this.gameSpeed = 20; // dhhruv's initial game_speed
    this.spawnTimer = 0;
    if (this.background) this.background.reset();
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

      // Score update - dhhruv increments points by 1 each frame (chromedino.py line 168-170)
      // Adjust for 60fps target
      if (Math.random() < 0.8) { // Roughly 48/60 frames to slow down scoring
        this.scoreManager.update(dt, this.gameSpeed);
      }
      const points = this.scoreManager.score;
      
      // Speed progression - dhhruv increases speed by 1 every 100 points (chromedino.py line 170-171)
      if (points % 100 === 0 && points > this.lastMilestone) {
        this.gameSpeed += 1;
        this.lastMilestone = points;
        if (this.audioManager) this.audioManager.play('milestone');
      }

      // Spawn obstacles - dhhruv's logic from chromedino.py lines 223-230
      if (this.obstacles.length === 0) {
        this.spawnObstacle();
      }

      // Update obstacles
      for (const obs of this.obstacles) {
        obs.update(dt, this.gameSpeed);
      }
      // Remove off-screen obstacles - dhhruv's logic chromedino.py line 206-207
      this.obstacles = this.obstacles.filter(o => !o.isOffScreen());

      // Collision detection - dhhruv's logic chromedino.py line 231-234
      for (const obs of this.obstacles) {
        if (obs.collides(this.player)) {
          this.gameOver();
          return;
        }
      }
    }
  }

  spawnObstacle() {
    // dhhruv's obstacle spawn logic from chromedino.py lines 223-230
    // Random choice between SmallCactus, LargeCactus, Bird
    const rand = Math.floor(Math.random() * 3);
    let type;
    if (rand === 0) {
      type = 'smallCactus';
    } else if (rand === 1) {
      type = 'largeCactus';
    } else {
      type = 'bird';
    }
    this.obstacles.push(new Obstacle(this, type));
  }

  render() {
    // Clear canvas once at the start of each frame (use logical dimensions)
    this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    
    if (this.state === 'loading') {
      // Show loading screen
      this.ctx.fillStyle = '#f7f7f7';
      this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
      this.ctx.fillStyle = '#535353';
      this.ctx.font = '24px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Loading assets...', this.logicalWidth / 2, this.logicalHeight / 2);
      return;
    }

    if (this.state === 'error') {
      // Show error screen
      this.ctx.fillStyle = '#f7f7f7';
      this.ctx.fillRect(0, 0, this.logicalWidth, this.logicalHeight);
      this.ctx.fillStyle = '#d93025';
      this.ctx.font = '24px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Failed to load assets', this.logicalWidth / 2, this.logicalHeight / 2);
      return;
    }
    
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