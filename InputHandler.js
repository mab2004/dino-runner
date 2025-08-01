export default class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = {};
    this.touchStartY = null;
    this.init();
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys[e.code] = true;
      if (this.game.state === 'menu' && (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter')) {
        this.game.startGame();
      } else if (this.game.state === 'gameover' && (e.code === 'Space' || e.code === 'Enter')) {
        this.game.startGame();
      } else if (this.game.state === 'playing') {
        if (e.code === 'Space' || e.code === 'ArrowUp') this.game.player.jump();
        if (e.code === 'ArrowDown') this.game.player.duck(true);
      }
      if (e.code === 'KeyM') this.game.toggleSound();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      if (this.game.state === 'playing' && e.code === 'ArrowDown')
        this.game.player.duck(false);
    });

    // Touch controls
    this.game.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.touchStartY = e.touches[0].clientY;
      }
    });
    this.game.canvas.addEventListener('touchend', (e) => {
      if (this.touchStartY !== null) {
        const dy = (e.changedTouches[0].clientY - this.touchStartY);
        if (Math.abs(dy) < 32) {
          // Tap: jump or start
          if (this.game.state === 'menu' || this.game.state === 'gameover')
            this.game.startGame();
          else if (this.game.state === 'playing')
            this.game.player.jump();
        } else if (dy > 16 && this.game.state === 'playing') {
          // Swipe down: duck
          this.game.player.duck(true);
          setTimeout(() => this.game.player.duck(false), 400);
        }
        this.touchStartY = null;
      }
    });
  }
}