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
    if (this.type === 'cactus') {
      // Cactus: placeholder pixel art (green)
      ctx.save();
      ctx.fillStyle = ['#1b5b1b', '#328732', '#3ab13a'][this.variant];
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "#67c867";
      ctx.fillRect(this.x+4, this.y+6, this.width-8, this.height-8);
      ctx.restore();
    } else if (this.type === 'pterodactyl') {
      // Pterodactyl: placeholder pixel art (gray bird)
      ctx.save();
      ctx.fillStyle = "#555";
      ctx.beginPath();
      ctx.moveTo(this.x, this.y+this.height/2);
      ctx.lineTo(this.x+this.width/2, this.y+2 + 8*this.flap);
      ctx.lineTo(this.x+this.width, this.y+this.height/2);
      ctx.lineTo(this.x+this.width/2, this.y+this.height-2 - 8*this.flap);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
}