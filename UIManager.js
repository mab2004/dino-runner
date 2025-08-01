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
    ctx.fillStyle = "#1c2636";
    ctx.globalAlpha = 0.92;
    ctx.fillRect(this.game.canvas.width/2-170, 40, 340, 220);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.font = "32px monospace";
    ctx.fillText("DINO RUNNER", this.game.canvas.width/2, 100);
    ctx.font = "18px monospace";
    ctx.fillText("A Google Chrome Dino Clone", this.game.canvas.width/2, 134);

    if (this.showingHighScore) {
      ctx.font = "22px monospace";
      ctx.fillStyle = "#ffe066";
      ctx.fillText("High Score", this.game.canvas.width/2, 170);
      ctx.font = "20px monospace";
      ctx.fillStyle = "#fff";
      ctx.fillText(this.game.scoreManager.highScore, this.game.canvas.width/2, 200);
      ctx.font = "16px monospace";
      ctx.fillText("Press any key or click to return", this.game.canvas.width/2, 240);
      ctx.restore();
      this.handleMenuReturn();
      return;
    }
    if (this.showingControls) {
      ctx.font = "20px monospace";
      ctx.fillStyle = "#ffe066";
      ctx.fillText("Controls", this.game.canvas.width/2, 170);
      ctx.font = "17px monospace";
      ctx.fillStyle = "#fff";
      ctx.fillText("Jump: Space / Up Arrow / Tap", this.game.canvas.width/2, 200);
      ctx.fillText("Duck: Down Arrow / Swipe Down", this.game.canvas.width/2, 224);
      ctx.fillText("Mute: M", this.game.canvas.width/2, 248);
      ctx.font = "16px monospace";
      ctx.fillText("Press any key or click to return", this.game.canvas.width/2, 272);
      ctx.restore();
      this.handleMenuReturn();
      return;
    }

    // Buttons
    ctx.font = "20px monospace";
    let y = 170;
    for (let i=0; i<this.menuButtons.length; i++) {
      const btn = this.menuButtons[i];
      let label = typeof btn.label === 'function' ? btn.label() : btn.label;
      ctx.fillStyle = "#fff";
      ctx.fillRect(this.game.canvas.width/2-90, y-20, 180, 34);
      ctx.fillStyle = "#222";
      ctx.fillText(label, this.game.canvas.width/2, y);
      y += 44;
    }
    ctx.restore();

    // Mouse input for menu
    this.handleMenuMouse();
  }

  handleMenuMouse() {
    if (!this._menuMouseHandler) {
      this._menuMouseHandler = (e) => {
        const rect = this.game.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        let y = 170;
        for (let i=0; i<this.menuButtons.length; i++) {
          if (mx >= this.game.canvas.width/2-90 && mx <= this.game.canvas.width/2+90 &&
              my >= y-20 && my <= y+14) {
            this.menuButtons[i].action();
            break;
          }
          y += 44;
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
    ctx.font = "18px monospace";
    ctx.fillStyle = "#222";
    ctx.globalAlpha = 0.40;
    ctx.fillRect(20, 10, 220, 38);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffe066";
    ctx.fillText("Score: " + this.game.scoreManager.score, 34, 34);
    ctx.fillStyle = "#fff";
    ctx.fillText("High: " + this.game.scoreManager.highScore, 160, 34);
    ctx.fillStyle = "#bbe0fa";
    ctx.fillText("Speed: " + this.game.level, 270, 34);
    ctx.restore();
  }

  drawGameOver(ctx) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = "32px monospace";
    ctx.fillStyle = "#c93030";
    ctx.globalAlpha = 0.92;
    ctx.fillRect(this.game.canvas.width/2-170, 80, 340, 130);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#fff";
    ctx.fillText("Game Over", this.game.canvas.width/2, 120);
    ctx.font = "22px monospace";
    ctx.fillStyle = "#ffe066";
    ctx.fillText("Score: " + this.game.scoreManager.score, this.game.canvas.width/2, 154);
    ctx.fillStyle = "#fff";
    ctx.fillText("High Score: " + this.game.scoreManager.highScore, this.game.canvas.width/2, 182);
    ctx.font = "18px monospace";
    ctx.fillText("Click or Space to Play Again", this.game.canvas.width/2, 210);
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