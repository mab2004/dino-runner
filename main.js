import Game from './Game.js';

// Canvas setup with high-DPI scaling for crisp rendering
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Get device pixel ratio for high-DPI displays
const devicePixelRatio = window.devicePixelRatio || 1;

// Logical dimensions (Chrome dino standard)
const LOGICAL_WIDTH = 800;
const LOGICAL_HEIGHT = 300;

// Set actual canvas size for high-DPI
canvas.width = LOGICAL_WIDTH * devicePixelRatio;
canvas.height = LOGICAL_HEIGHT * devicePixelRatio;

// Set CSS size to maintain logical dimensions
canvas.style.width = LOGICAL_WIDTH + 'px';
canvas.style.height = LOGICAL_HEIGHT + 'px';

// Scale context to match device pixel ratio
ctx.scale(devicePixelRatio, devicePixelRatio);

// Disable image smoothing for crisp pixel art
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

// Boot the game with logical dimensions
const game = new Game(canvas, ctx, LOGICAL_WIDTH, LOGICAL_HEIGHT);
window.game = game; // For debugging