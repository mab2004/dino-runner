export default class Background {
  constructor(game) {
    this.game = game;
    this.groundY = 268;
    this.offset = 0;
    this.clouds = [];
    this.initClouds();
    this.dayNight = false;
    this.cycleColor = ['#f7f7f7', '#232d36'];
    this.sunMoon = 0; // 0=sun, 1=moon
  }

  reset() {
    this.offset = 0;
    this.initClouds();
    this.dayNight = false;
    this.sunMoon = 0;
  }

  toggleDayNight(night) {
    this.dayNight = night;
    this.sunMoon = night ? 1 : 0;
    // Optional: add screen transition
  }

  initClouds() {
    this.clouds = [];
    for (let i=0; i<4; i++) {
      this.clouds.push({
        x: Math.random()*800,
        y: 40+Math.random()*60,
        speed: 0.5+Math.random()*0.7,
      });
    }
  }

  update(dt) {
    // Scroll ground
    this.offset -= this.game.speed * dt;
    if (this.offset < -48) this.offset += 48;

    // Move clouds
    for (const c of this.clouds) {
      c.x -= c.speed * dt;
      if (c.x < -60) {
        c.x += 860;
        c.y = 40+Math.random()*60;
        c.speed = 0.5+Math.random()*0.7;
      }
    }
  }

  draw(ctx) {
    // BG color
    ctx.fillStyle = this.dayNight ? this.cycleColor[1] : this.cycleColor[0];
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // Clouds (more Chrome-like)
    for (const c of this.clouds) {
      this.drawCloud(ctx, c.x, c.y);
    }

    // Sun/Moon (more Chrome-like)
    ctx.save();
    ctx.globalAlpha = 0.8;
    if (this.sunMoon === 0) {
      // Sun
      ctx.fillStyle = "#ffcc00";
      ctx.beginPath();
      ctx.arc(60, 58, 16, 0, 2*Math.PI);
      ctx.fill();
    } else {
      // Moon (crescent)
      ctx.fillStyle = "#cccccc";
      ctx.beginPath();
      ctx.arc(60, 58, 16, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = this.cycleColor[1];
      ctx.beginPath();
      ctx.arc(66, 54, 14, 0, 2*Math.PI);
      ctx.fill();
    }
    ctx.restore();

    // Ground (Chrome-like bumpy ground)
    this.drawGround(ctx);
  }

  drawCloud(ctx, x, y) {
    ctx.save();
    ctx.globalAlpha = this.dayNight ? 0.3 : 0.6;
    ctx.fillStyle = this.dayNight ? "#ffffff" : "#cccccc";
    
    // Chrome-style pixelated cloud
    ctx.fillRect(x + 4, y + 4, 8, 2);
    ctx.fillRect(x + 2, y + 6, 12, 2);
    ctx.fillRect(x, y + 8, 16, 2);
    ctx.fillRect(x + 2, y + 10, 12, 2);
    ctx.fillRect(x + 4, y + 12, 8, 2);
    
    ctx.restore();
  }

  drawGround(ctx) {
    const groundColor = "#535353";
    ctx.fillStyle = groundColor;
    
    // Ground line
    ctx.fillRect(0, this.groundY, this.game.canvas.width, 2);
    
    // Ground bumps/details (like Chrome dino)
    for (let x = Math.floor(this.offset); x < this.game.canvas.width; x += 12) {
      if (Math.random() > 0.7) {
        ctx.fillRect(x, this.groundY + 2, 2, 2);
      }
      if (Math.random() > 0.8) {
        ctx.fillRect(x + 6, this.groundY + 2, 2, 2);
      }
    }
  }
}