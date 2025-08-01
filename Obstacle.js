export default class Obstacle {
  constructor(game, type) {
    this.game = game;
    this.type = type;
    this.x = game.logicalWidth; // Start at right edge
    this.passed = false;
    this.variant = 0;
    this.stepIndex = 0; // For bird animation

    // dhhruv's obstacle initialization logic
    if (type === 'smallCactus') {
      // SmallCactus from lines 131-137
      this.variant = Math.floor(Math.random() * 3); // 0, 1, or 2
      this.y = 325 * (300 / 600); // Scale Y position to our coordinate system
      this.width = 34; // Approximate width
      this.height = 70; // Approximate height
    } else if (type === 'largeCactus') {
      // LargeCactus from lines 140-146
      this.variant = Math.floor(Math.random() * 3); // 0, 1, or 2  
      this.y = 300 * (300 / 600); // Scale Y position
      this.width = 50; // Approximate width
      this.height = 100; // Approximate height
    } else if (type === 'bird') {
      // Bird from lines 149-158
      this.variant = 0; // Will be used for animation frame
      // dhhruv's BIRD_HEIGHTS = [250, 290, 320] scaled to our system
      const birdHeights = [250, 290, 320].map(h => h * (300 / 600));
      this.y = birdHeights[Math.floor(Math.random() * birdHeights.length)];
      this.width = 92; // Approximate width
      this.height = 80; // Approximate height
      this.animIndex = 0; // For bird wing flapping
    }
  }

  update(dt, gameSpeed) {
    // dhhruv's obstacle movement logic line 203-207
    this.x -= gameSpeed * dt;
    
    // Bird animation - dhhruv's logic lines 159-162
    if (this.type === 'bird') {
      this.animIndex++;
      if (this.animIndex >= 9) {
        this.animIndex = 0;
      }
    }
  }

  isOffScreen() {
    // dhhruv's logic line 206-207: if self.rect.x < -self.rect.width
    return this.x < -this.width;
  }

  collides(player) {
    // dhhruv's collision detection line 231: player.dino_rect.colliderect(obstacle.rect)
    const hb = player.getHitbox();
    return (
      hb.x < this.x + this.width &&
      hb.x + hb.w > this.x &&
      hb.y < this.y + this.height &&
      hb.y + hb.h > this.y
    );
  }

  draw(ctx) {
    const assets = this.game.assetManager;
    if (!assets.loaded) return; // Don't draw until assets are loaded

    let sprite = null;
    
    // dhhruv's sprite selection logic from obstacle draw methods
    if (this.type === 'smallCactus') {
      const smallCactusSprites = assets.getSmallCactusSprites();
      sprite = smallCactusSprites[this.variant];
    } else if (this.type === 'largeCactus') {
      const largeCactusSprites = assets.getLargeCactusSprites();
      sprite = largeCactusSprites[this.variant];
    } else if (this.type === 'bird') {
      // dhhruv's bird animation logic from lines 159-162
      const birdSprites = assets.getBirdSprites();
      sprite = birdSprites[Math.floor(this.animIndex / 5) % birdSprites.length];
    }

    if (sprite) {
      ctx.drawImage(sprite, this.x, this.y);
    }

    // Uncomment for debugging hitbox
    // ctx.strokeStyle = "#f00";
    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}