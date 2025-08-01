export default class Player {
  constructor(game) {
    this.game = game;
    this.groundY = 220;
    this.x = 60;
    this.y = this.groundY;
    this.width = 44;
    this.height = 48;
    this.velocityY = 0;
    this.gravity = 1.05;
    this.jumpVelocity = -17;
    this.ducking = false;
    this.grounded = true;
    this.jumpCooldown = 0;
    this.animFrame = 0;
    this.animTimer = 0;
    this.animSpeed = 7;
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
    // Placeholder pixel dino
    ctx.save();
    ctx.translate(this.x, this.y);
    // Shadow
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.ellipse(20, this.height-3, 17, 6, 0, 0, 2*Math.PI);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.globalAlpha = 1;

    // Dino body
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, this.width, this.height);

    // Head
    ctx.fillStyle = "#fff";
    ctx.fillRect(15, 5, 25, 23);
    // Eye
    ctx.fillStyle = "#222";
    ctx.fillRect(35, 12, 5, 5);
    // Jaw
    ctx.fillStyle = "#bbb";
    ctx.fillRect(27, 25, 13, 7);
    // Body
    ctx.fillStyle = "#fff";
    ctx.fillRect(10, 22, 22, 18);

    // Leg animation
    ctx.fillStyle = "#fff";
    if (this.ducking) {
      ctx.fillRect(8, this.height-15, 25, 7); // lower body
      ctx.fillRect(10 + 12*this.animFrame, this.height-9, 7, 8); // one leg
      ctx.fillRect(22 - 12*this.animFrame, this.height-9, 7, 8); // other leg
    } else {
      ctx.fillRect(10 + 12*this.animFrame, this.height-11, 7, 14);
      ctx.fillRect(22 - 12*this.animFrame, this.height-11, 7, 14);
    }
    ctx.restore();

    // Uncomment for debugging hitbox
    // let hb = this.getHitbox();
    // ctx.strokeStyle = "#f00";
    // ctx.strokeRect(hb.x, hb.y, hb.w, hb.h);
  }
}