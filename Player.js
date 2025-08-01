export default class Player {
  constructor(game) {
    this.game = game;
    
    // dhhruv's exact player constants from chromedino.py lines 50-54
    // Don't scale - keep original values but adjust for our canvas size
    this.X_POS = 80;
    this.Y_POS = 310;
    this.Y_POS_DUCK = 340;
    this.JUMP_VEL = 8.5;
    
    // Use original positions but adjust for 300px height canvas
    this.x = 80;
    this.groundY = 200; // Adjusted to be visible in 300px height canvas
    this.y = this.groundY;
    this.duckY = this.groundY + 30;
    this.jumpVelocity = this.JUMP_VEL;
    
    this.width = 44;
    this.height = 48;
    this.velocityY = 0;
    this.gravity = 0.8; // dhhruv's gravity from line 97
    this.ducking = false;
    this.grounded = true;
    this.jumpCooldown = 0;
    
    // Animation - dhhruv's step_index logic from lines 55, 74, 85, 91
    this.stepIndex = 0;
    this.animTimer = 0;
    
    // States matching dhhruv's logic
    this.dinoRun = true;
    this.dinoJump = false;
    this.dinoDuck = false;
    this.dinoDead = false;
  }

  reset() {
    this.y = this.groundY;
    this.velocityY = 0;
    this.grounded = true;
    this.ducking = false;
    this.stepIndex = 0;
    this.animTimer = 0;
    this.jumpCooldown = 0;
    
    // Reset states
    this.dinoRun = true;
    this.dinoJump = false;
    this.dinoDuck = false;
    this.dinoDead = false;
  }

  jump() {
    // dhhruv's jump logic from lines 65-68
    if (this.grounded && this.jumpCooldown <= 0) {
      this.dinoDuck = false;
      this.dinoRun = false;
      this.dinoJump = true;
      this.velocityY = -this.jumpVelocity; // Negative for upward movement
      this.grounded = false;
      this.jumpCooldown = 12;
      this.game.audioManager.play('jump');
    }
  }

  duck(isDown) {
    // dhhruv's duck logic from lines 69-74
    if (isDown && !this.dinoJump) {
      this.dinoDuck = true;
      this.dinoRun = false;
      this.dinoJump = false;
    } else if (!this.dinoJump) {
      this.dinoDuck = false;
      this.dinoRun = true;
      this.dinoJump = false;
    }
  }

  update(dt) {
    // Update animation step index - dhhruv's logic line 66
    this.stepIndex++;
    if (this.stepIndex >= 10) {
      this.stepIndex = 0;
    }

    // Jump physics - dhhruv's logic lines 95-100  
    if (this.dinoJump) {
      this.y -= this.jumpVelocity * 4; // dhhruv multiplies by 4
      this.jumpVelocity -= 0.8; // dhhruv's gravity application
      
      if (this.jumpVelocity < -this.JUMP_VEL) {
        this.dinoJump = false;
        this.dinoRun = true;
        this.jumpVelocity = this.JUMP_VEL;
        this.grounded = true;
        this.y = this.groundY; // Ensure exact ground position
      }
    }

    // Cooldown
    if (this.jumpCooldown > 0) {
      this.jumpCooldown -= 1;
    }
  }

  getHitbox() {
    // dhhruv's collision detection uses pygame rect collision
    // Make hitbox smaller and more forgiving
    if (this.dinoDuck) {
      return { x: this.x + 10, y: this.duckY + 10, w: this.width - 20, h: 25 };
    }
    return { x: this.x + 10, y: this.y + 10, w: this.width - 20, h: this.height - 20 };
  }

  draw(ctx) {
    const assets = this.game.assetManager;
    if (!assets.loaded) return; // Don't draw until assets are loaded

    let sprite = null;
    
    // dhhruv's sprite selection logic from lines 76-94
    if (this.dinoDuck) {
      // Duck animation - dhhruv's logic line 76-78  
      const duckSprites = assets.getDinoDuckSprites();
      sprite = duckSprites[Math.floor(this.stepIndex / 5) % duckSprites.length];
    } else if (this.dinoRun) {
      // Run animation - dhhruv's logic line 85-87
      const runSprites = assets.getDinoRunSprites();
      sprite = runSprites[Math.floor(this.stepIndex / 5) % runSprites.length];
    } else if (this.dinoJump) {
      // Jump sprite - dhhruv's logic line 91
      sprite = assets.getAsset('dinoJump');
    } else if (this.dinoDead) {
      // Dead sprite
      sprite = assets.getAsset('dinoDead');
    } else {
      // Default to start sprite
      sprite = assets.getAsset('dinoStart');
    }

    if (sprite) {
      // Draw at current position - adjust Y position for ducking
      const drawY = this.dinoDuck ? this.duckY : this.y;
      ctx.drawImage(sprite, this.x, drawY);
    }

    // Uncomment for debugging hitbox
    // let hb = this.getHitbox();
    // ctx.strokeStyle = "#f00";
    // ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
  }
}