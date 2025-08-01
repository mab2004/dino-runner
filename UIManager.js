export default class UIManager {
  constructor(game) {
    this.game = game;
    this.menuButtons = [
      { label: 'Start Game', action: () => this.game.startGame() },
      { label: 'High Score', action: () => this.showingHighScore = true },
      { label: () => this.game.soundOn ? 'Mute Sound' : 'Unmute Sound', action: () => this.game.toggleSound() },
      { label: 'Controls', action: () => this.showingControls = true },
    ];
    this.showingHighScore = false;
    this.showingControls = false;
  }

  drawMenu(ctx) {
    ctx.save();
    ctx.textAlign = 'center';
    
    // Light semi-transparent overlay
    ctx.fillStyle = "#f7f7f7";
    ctx.globalAlpha = 0.95;
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.globalAlpha = 1;
    
    // Title
    ctx.fillStyle = "#535353";
    ctx.font = "24px monospace";
    ctx.fillText("DINO RUNNER", this.game.canvas.width/2, 100);
    ctx.font = "12px monospace";
    ctx.fillText("Press SPACE to play", this.game.canvas.width/2, 130);
    
    // High score display
    ctx.font = "14px monospace";
    ctx.fillText("HI " + String(this.game.scoreManager.highScore).padStart(5, '0'), this.game.canvas.width/2, 170);
    
    // Mute indicator
    ctx.font = "10px monospace";
    const muteText = this.game.soundOn ? "🔊" : "🔇";
    ctx.fillText(muteText + " Press M to toggle sound", this.game.canvas.width/2, 200);
    
    ctx.restore();

    if (this.showingHighScore) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = "#f7f7f7";
      ctx.globalAlpha = 0.95;
      ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#535353";
      ctx.font = "20px monospace";
      ctx.fillText("High Score", this.game.canvas.width/2, 140);
      ctx.font = "18px monospace";
      ctx.fillText(String(this.game.scoreManager.highScore).padStart(5, '0'), this.game.canvas.width/2, 170);
      ctx.font = "12px monospace";
      ctx.fillText("Press any key to return", this.game.canvas.width/2, 210);
      ctx.restore();
      this.handleMenuReturn();
      return;
    }
    
    if (this.showingControls) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = "#f7f7f7";
      ctx.globalAlpha = 0.95;
      ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#535353";
      ctx.font = "16px monospace";
      ctx.fillText("Controls", this.game.canvas.width/2, 120);
      ctx.font = "12px monospace";
      ctx.fillText("↑ or SPACE - Jump", this.game.canvas.width/2, 150);
      ctx.fillText("↓ - Duck", this.game.canvas.width/2, 170);
      ctx.fillText("M - Mute", this.game.canvas.width/2, 190);
      ctx.fillText("Press any key to return", this.game.canvas.width/2, 220);
      ctx.restore();
      this.handleMenuReturn();
      return;
    }

    // Mouse input for menu
    this.handleMenuMouse();
  }

  handleMenuMouse() {
    if (!this._menuMouseHandler) {
      this._menuMouseHandler = (e) => {
        // Start game on any click in menu
        if (this.game.state === 'menu' && !this.showingHighScore && !this.showingControls) {
          this.game.startGame();
        }
      };
      this.game.canvas.addEventListener('click', this._menuMouseHandler);
    }
  }

  handleMenuReturn() {
    if (!this._menuReturnHandler) {
      this._menuReturnHandler = (e) => {
        this.showingHighScore = false;
        this.showingControls = false;
      };
      window.addEventListener('keydown', this._menuReturnHandler, { once: true });
      this.game.canvas.addEventListener('click', this._menuReturnHandler, { once: true });
    }
  }

  drawHud(ctx) {
    ctx.save();
    ctx.font = "12px monospace";
    ctx.fillStyle = "#535353";
    ctx.textAlign = "right";
    
    // Current score (right aligned, top right)
    const scoreText = String(this.game.scoreManager.score).padStart(5, '0');
    ctx.fillText(scoreText, this.game.canvas.width - 20, 25);
    
    // High score (right aligned, below current score)
    ctx.fillText("HI " + String(this.game.scoreManager.highScore).padStart(5, '0'), this.game.canvas.width - 20, 45);
    
    // Mute indicator (top left)
    ctx.textAlign = "left";
    const muteText = this.game.soundOn ? "🔊" : "🔇";
    ctx.fillText(muteText, 20, 25);
    
    ctx.restore();
  }

  drawGameOver(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    
    // Light overlay for game over
    ctx.fillStyle = "#f7f7f7";
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    ctx.globalAlpha = 1;
    
    // Game Over text
    ctx.fillStyle = "#535353";
    ctx.font = "20px monospace";
    ctx.fillText("G A M E  O V E R", this.game.canvas.width/2, 120);
    
    // Current and high scores
    ctx.font = "14px monospace";
    ctx.fillText(String(this.game.scoreManager.score).padStart(5, '0'), this.game.canvas.width/2, 160);
    ctx.fillText("HI " + String(this.game.scoreManager.highScore).padStart(5, '0'), this.game.canvas.width/2, 180);
    
    // Restart instruction
    ctx.font = "12px monospace";
    ctx.fillText("Press SPACE to restart", this.game.canvas.width/2, 220);
    
    ctx.restore();

    // Mouse input for replay
    if (!this._gameOverHandler) {
      this._gameOverHandler = (e) => {
        this.game.startGame();
      };
      this.game.canvas.addEventListener('click', this._gameOverHandler, { once: true });
      window.addEventListener('keydown', this._gameOverHandler, { once: true });
    }
  }
}