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

    // Clouds
    for (const c of this.clouds) {
      ctx.save();
      ctx.globalAlpha = this.dayNight ? 0.22 : 0.38;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, 28, 13, 0, 0, 2*Math.PI);
      ctx.ellipse(c.x+20, c.y+2, 17, 9, 0, 0, 2*Math.PI);
      ctx.ellipse(c.x-20, c.y+3, 13, 7, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.restore();
    }

    // Sun/Moon
    ctx.save();
    ctx.globalAlpha = 0.70;
    ctx.beginPath();
    if (this.sunMoon === 0) {
      ctx.arc(60, 58, 20, 0, 2*Math.PI);
      ctx.fillStyle = "#ffe066";
    } else {
      ctx.arc(60, 58, 19, 0, 2*Math.PI);
      ctx.fillStyle = "#dbe8fa";
    }
    ctx.fill();
    ctx.restore();

    // Ground
    for (let x = this.offset; x < this.game.canvas.width; x += 48) {
      ctx.save();
      ctx.fillStyle = "#b9b39f";
      ctx.fillRect(x, this.groundY, 48, 13);
      ctx.fillStyle = "#8e8872";
      ctx.fillRect(x, this.groundY+11, 48, 4);
      ctx.restore();
    }
  }
}