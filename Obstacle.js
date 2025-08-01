export default class Obstacle {
  constructor(game, type) {
    this.game = game;
    this.type = type;
    this.x = game.canvas.width + 30;
    this.passed = false;

    if (type === 'cactus') {
      this.width = 24 + Math.floor(Math.random()*16);
      this.height = 40 + Math.floor(Math.random()*12);
      this.y = 220 + (48-this.height);
      this.variant = Math.floor(Math.random()*3);
    } else if (type === 'pterodactyl') {
      this.width = 46;
      this.height = 20;
      // Flying: different heights
      const flyHeights = [160, 190, 220];
      this.y = flyHeights[Math.floor(Math.random()*flyHeights.length)];
      this.variant = Math.floor(Math.random()*2);
      this.flap = 0;
      this.animTimer = 0;
    }
  }

  update(dt, speed) {
    this.x -= speed * dt;
    if (this.type === 'pterodactyl') {
      this.animTimer += dt;
      if (this.animTimer > 12) {
        this.animTimer = 0;
        this.flap = (this.flap+1)%2;
      }
    }
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  collides(player) {
    // Axis-aligned bounding box
    const hb = player.getHitbox();
    return (
      hb.x < this.x + this.width &&
      hb.x + hb.w > this.x &&
      hb.y < this.y + this.height &&
      hb.y + hb.h > this.y
    );
  }

  draw(ctx) {
    const obstacleColor = "#535353";
    
    if (this.type === 'cactus') {
      this.drawCactus(ctx, obstacleColor);
    } else if (this.type === 'pterodactyl') {
      this.drawPterodactyl(ctx, obstacleColor);
    }
  }

  drawCactus(ctx, color) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = color;
    
    if (this.variant === 0) {
      // Small single cactus
      ctx.fillRect(6, 0, 2, this.height);
      ctx.fillRect(4, this.height-16, 6, 2);
      ctx.fillRect(2, this.height-14, 10, 2);
      ctx.fillRect(0, this.height-12, 14, 2);
      ctx.fillRect(2, this.height-10, 10, 2);
      ctx.fillRect(4, this.height-8, 6, 2);
    } else if (this.variant === 1) {
      // Medium double cactus
      ctx.fillRect(4, 0, 2, this.height);
      ctx.fillRect(10, 6, 2, this.height-6);
      // Left branch
      ctx.fillRect(2, this.height-20, 6, 2);
      ctx.fillRect(0, this.height-18, 10, 2);
      ctx.fillRect(2, this.height-16, 6, 2);
      // Right branch  
      ctx.fillRect(8, this.height-14, 6, 2);
      ctx.fillRect(6, this.height-12, 10, 2);
      ctx.fillRect(8, this.height-10, 6, 2);
    } else {
      // Large triple cactus
      ctx.fillRect(4, 0, 2, this.height);
      ctx.fillRect(10, 4, 2, this.height-4);
      ctx.fillRect(16, 8, 2, this.height-8);
      // Branches
      ctx.fillRect(2, this.height-24, 6, 2);
      ctx.fillRect(0, this.height-22, 10, 2);
      ctx.fillRect(2, this.height-20, 6, 2);
      ctx.fillRect(8, this.height-18, 6, 2);
      ctx.fillRect(6, this.height-16, 10, 2);
      ctx.fillRect(8, this.height-14, 6, 2);
      ctx.fillRect(14, this.height-12, 6, 2);
      ctx.fillRect(12, this.height-10, 10, 2);
      ctx.fillRect(14, this.height-8, 6, 2);
    }
    
    ctx.restore();
  }

  drawPterodactyl(ctx, color) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = color;
    
    // Body
    ctx.fillRect(16, 8, 8, 4);
    ctx.fillRect(12, 10, 16, 2);
    ctx.fillRect(14, 12, 12, 2);
    
    // Head/beak
    ctx.fillRect(8, 8, 8, 4);
    ctx.fillRect(4, 10, 4, 2);
    
    // Wings (animated)
    if (this.flap === 0) {
      // Wings up
      ctx.fillRect(10, 2, 12, 2);
      ctx.fillRect(8, 4, 16, 2);
      ctx.fillRect(6, 6, 20, 2);
      ctx.fillRect(8, 8, 16, 2);
    } else {
      // Wings down
      ctx.fillRect(8, 10, 16, 2);
      ctx.fillRect(6, 12, 20, 2);
      ctx.fillRect(8, 14, 16, 2);
      ctx.fillRect(10, 16, 12, 2);
    }
    
    // Tail
    ctx.fillRect(26, 8, 6, 2);
    ctx.fillRect(28, 6, 4, 2);
    ctx.fillRect(30, 4, 2, 2);
    
    ctx.restore();
  }
}