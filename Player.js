export default class Player {
  constructor(game) {
    this.game = game;
    this.groundY = 220;
    this.x = 60;
    this.y = this.groundY;
    this.width = 44;
    this.height = 48;
    this.velocityY = 0;
    this.gravity = 0.8; // Adjusted for more Chrome-like arc
    this.jumpVelocity = -15; // Adjusted for more Chrome-like arc
    this.ducking = false;
    this.grounded = true;
    this.jumpCooldown = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 8; // Slightly slower animation
    this.duckHeight = 30;
  }

  reset() {
    this.y = this.groundY;
    this.velocityY = 0;
    this.grounded = true;
    this.ducking = false;
    this.animFrame = 0;
    this.animTimer = 0;
    this.jumpCooldown = 0;
  }

  jump() {
    if (this.grounded && this.jumpCooldown <= 0) {
      this.velocityY = this.jumpVelocity;
      this.grounded = false;
      this.jumpCooldown = 12;
      this.game.audioManager.play('jump');
    }
  }

  duck(isDown) {
    this.ducking = isDown && this.grounded;
  }

  update(dt) {
    if (!this.grounded) {
      this.velocityY += this.gravity * dt;
      this.y += this.velocityY * dt;
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
        this.grounded = true;
      }
    }
    if (this.jumpCooldown > 0) this.jumpCooldown -= dt;

    // Animation
    this.animTimer += dt;
    if (this.animTimer > this.animSpeed) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 2;
    }
  }

  getHitbox() {
    if (this.ducking) {
      return { x: this.x+6, y: this.y+this.height-this.duckHeight-4, w: this.width-12, h: this.duckHeight };
    }
    return { x: this.x+6, y: this.y, w: this.width-12, h: this.height-6 };
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Chrome dino colors
    const dinoColor = "#535353";
    
    if (this.ducking) {
      // Ducking dino sprite
      this.drawDuckingDino(ctx, dinoColor);
    } else {
      // Running dino sprite
      this.drawRunningDino(ctx, dinoColor);
    }
    
    ctx.restore();

    // Uncomment for debugging hitbox
    // let hb = this.getHitbox();
    // ctx.strokeStyle = "#f00";
    // ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
  }

  drawRunningDino(ctx, color) {
    ctx.fillStyle = color;
    
    // Head outline
    ctx.fillRect(22, 0, 2, 2);
    ctx.fillRect(20, 2, 6, 2);
    ctx.fillRect(18, 4, 10, 2);
    ctx.fillRect(16, 6, 14, 2);
    ctx.fillRect(16, 8, 16, 2);
    ctx.fillRect(16, 10, 18, 2);
    ctx.fillRect(16, 12, 20, 2);
    ctx.fillRect(18, 14, 20, 2);
    ctx.fillRect(18, 16, 18, 2);
    
    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(30, 6, 2, 2);
    ctx.fillStyle = color;
    
    // Mouth
    ctx.fillRect(16, 18, 14, 2);
    ctx.fillRect(16, 20, 10, 2);
    ctx.fillRect(16, 22, 8, 2);
    
    // Body
    ctx.fillRect(16, 24, 6, 2);
    ctx.fillRect(12, 26, 10, 2);
    ctx.fillRect(10, 28, 12, 2);
    ctx.fillRect(8, 30, 14, 2);
    ctx.fillRect(6, 32, 16, 2);
    ctx.fillRect(6, 34, 18, 2);
    ctx.fillRect(6, 36, 18, 2);
    ctx.fillRect(8, 38, 16, 2);
    ctx.fillRect(10, 40, 14, 2);
    
    // Legs (animated)
    if (this.grounded) {
      if (this.animFrame === 0) {
        // Left leg forward
        ctx.fillRect(12, 42, 4, 2);
        ctx.fillRect(12, 44, 6, 2);
        ctx.fillRect(10, 46, 6, 2);
        // Right leg back
        ctx.fillRect(20, 42, 4, 2);
        ctx.fillRect(20, 44, 4, 2);
        ctx.fillRect(20, 46, 4, 2);
      } else {
        // Right leg forward
        ctx.fillRect(20, 42, 4, 2);
        ctx.fillRect(20, 44, 6, 2);
        ctx.fillRect(22, 46, 6, 2);
        // Left leg back
        ctx.fillRect(12, 42, 4, 2);
        ctx.fillRect(12, 44, 4, 2);
        ctx.fillRect(12, 46, 4, 2);
      }
    } else {
      // Jumping pose - legs together
      ctx.fillRect(14, 42, 6, 2);
      ctx.fillRect(14, 44, 8, 2);
      ctx.fillRect(14, 46, 8, 2);
    }
    
    // Arms
    ctx.fillRect(8, 28, 2, 6);
    ctx.fillRect(6, 30, 2, 4);
  }

  drawDuckingDino(ctx, color) {
    ctx.fillStyle = color;
    
    // Head (lower position)
    ctx.fillRect(22, 14, 2, 2);
    ctx.fillRect(20, 16, 6, 2);
    ctx.fillRect(18, 18, 10, 2);
    ctx.fillRect(16, 20, 14, 2);
    ctx.fillRect(16, 22, 16, 2);
    ctx.fillRect(16, 24, 18, 2);
    ctx.fillRect(16, 26, 20, 2);
    ctx.fillRect(18, 28, 20, 2);
    ctx.fillRect(18, 30, 18, 2);
    
    // Eye
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(30, 20, 2, 2);
    ctx.fillStyle = color;
    
    // Body (elongated)
    ctx.fillRect(6, 32, 30, 2);
    ctx.fillRect(4, 34, 32, 2);
    ctx.fillRect(4, 36, 32, 2);
    ctx.fillRect(6, 38, 28, 2);
    
    // Legs (running animation while ducking)
    if (this.animFrame === 0) {
      ctx.fillRect(8, 40, 4, 2);
      ctx.fillRect(8, 42, 6, 2);
      ctx.fillRect(26, 40, 4, 2);
      ctx.fillRect(26, 42, 4, 2);
    } else {
      ctx.fillRect(10, 40, 4, 2);
      ctx.fillRect(10, 42, 4, 2);
      ctx.fillRect(24, 40, 4, 2);
      ctx.fillRect(24, 42, 6, 2);
    }
  }
}