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
    const assets = this.game.assetManager;
    if (!assets.loaded) return;
    
    ctx.save();
    ctx.textAlign = 'center';
    
    // dhhruv's menu background - simple white/gray background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.game.logicalWidth, this.game.logicalHeight);
    
    // dhhruv's menu logic from lines 257-287
    ctx.fillStyle = "#535353";
    ctx.font = "24px Arial"; // Changed to Arial to match dhhruv's font
    ctx.fillText("Press any Key to Start", this.game.logicalWidth/2, this.game.logicalHeight/2);
    
    // High score display - dhhruv's format from lines 275-285
    ctx.font = "20px Arial";
    ctx.fillText("High Score : " + this.game.scoreManager.getFormattedHighScore(), this.game.logicalWidth/2, this.game.logicalHeight/2 + 50);
    
    // Draw dino sprite in menu - dhhruv's logic line 286
    const dinoSprite = assets.getAsset('dinoRun1');
    if (dinoSprite) {
      ctx.drawImage(dinoSprite, this.game.logicalWidth/2 - 20, this.game.logicalHeight/2 - 140);
    }
    
    ctx.restore();
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
    // dhhruv's HUD logic from lines 167-176 
    ctx.save();
    ctx.font = "20px Arial"; // dhhruv uses freesansbold.ttf, Arial is close
    ctx.fillStyle = "#535353";
    ctx.textAlign = "left";
    
    // dhhruv's score format: "High Score: <highscore> Points: <points>"
    const scoreText = "High Score: " + this.game.scoreManager.getFormattedHighScore() + 
                     "  Points: " + this.game.scoreManager.getFormattedScore();
    
    // Position like dhhruv's - centered at (900, 40) scaled to our system  
    ctx.textAlign = "center";
    const centerX = 900 * (this.game.logicalWidth / 1100); // Scale from dhhruv's 1100px width
    ctx.fillText(scoreText, centerX, 40);
    
    ctx.restore();
  }

  drawGameOver(ctx) {
    const assets = this.game.assetManager;
    if (!assets.loaded) return;
    
    ctx.save();
    ctx.textAlign = "center";
    
    // dhhruv's game over logic from menu() function when death_count > 0 
    // Use same background as menu
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.game.logicalWidth, this.game.logicalHeight);
    
    ctx.fillStyle = "#535353";
    ctx.font = "30px Arial";
    ctx.fillText("Press any Key to Restart", this.game.logicalWidth/2, this.game.logicalHeight/2);
    
    // Show current score - dhhruv's logic lines 263-266
    ctx.font = "30px Arial";
    ctx.fillText("Your Score: " + this.game.scoreManager.getFormattedScore(), this.game.logicalWidth/2, this.game.logicalHeight/2 + 50);
    
    // Show high score - dhhruv's logic lines 275-281  
    ctx.fillText("High Score : " + this.game.scoreManager.getFormattedHighScore(), this.game.logicalWidth/2, this.game.logicalHeight/2 + 100);
    
    // Draw dino sprite - dhhruv draws RUNNING[0] sprite in menu
    const dinoSprite = assets.getAsset('dinoRun1');
    if (dinoSprite) {
      ctx.drawImage(dinoSprite, this.game.logicalWidth/2 - 20, this.game.logicalHeight/2 - 140);
    }
    
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