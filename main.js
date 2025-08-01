import Game from './Game.js';

// Responsive canvas
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Allow dynamic resizing (but keep pixel aspect)
function resizeCanvas() {
  const ratio = 300 / 800;
  let width = Math.min(window.innerWidth - 16, 800);
  let height = Math.round(width * ratio);
  canvas.width = width;
  canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Boot the game
const game = new Game(canvas, ctx);
window.game = game; // For debugging