import Game from './Game.js';

// Canvas setup with fixed dimensions (Chrome-like)
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Fixed canvas dimensions like Chrome dino
canvas.width = 800;
canvas.height = 300;

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Boot the game
const game = new Game(canvas, ctx);
window.game = game; // For debugging