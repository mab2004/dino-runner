export default class Background {
  constructor(game) {
    this.game = game;
    // dhhruv's background logic from lines 184-193
    this.x_pos_bg = 0;
    this.y_pos_bg = 380 * (300 / 600); // Scale to our coordinate system
    this.clouds = [];
    this.initClouds();
  }

  reset() {
    this.x_pos_bg = 0;
    this.initClouds();
  }

  initClouds() {
    this.clouds = [];
    // dhhruv's cloud initialization
    for (let i = 0; i < 3; i++) {
      this.clouds.push({
        x: this.game.logicalWidth + Math.random() * 800 + 800,
        y: 50 + Math.random() * 50, // Random Y between 50-100
        speed: 1, // Clouds move slower than ground
      });
    }
  }

  update(dt) {
    // dhhruv's background scrolling logic from lines 184-193
    // Move clouds - dhhruv's cloud update logic
    for (const cloud of this.clouds) {
      cloud.x -= this.game.gameSpeed * dt;
      
      // Reset cloud position when off-screen - dhhruv's logic
      if (cloud.x < -100) { // Cloud width
        cloud.x = this.game.logicalWidth + Math.random() * 2500 + 3000;
        cloud.y = 50 + Math.random() * 50;
      }
    }
  }

  draw(ctx) {
    const assets = this.game.assetManager;
    if (!assets.loaded) return; // Don't draw until assets are loaded

    // dhhruv's background drawing logic from lines 184-193
    // Simple white background (matching Chrome dino)
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(0, 0, this.game.logicalWidth, this.game.logicalHeight);
    
    // Draw scrolling track/ground - dhhruv's background() function
    const trackSprite = assets.getAsset('track');
    if (trackSprite) {
      const imageWidth = trackSprite.width;
      // Draw main track
      ctx.drawImage(trackSprite, this.x_pos_bg, this.y_pos_bg);
      // Draw second track for seamless scrolling
      ctx.drawImage(trackSprite, imageWidth + this.x_pos_bg, this.y_pos_bg);
      
      // Update background position - dhhruv's logic
      if (this.x_pos_bg <= -imageWidth) {
        this.x_pos_bg = 0;
      }
      this.x_pos_bg -= this.game.gameSpeed * 0.5; // Slower than obstacles
    }

    // Draw clouds - dhhruv's cloud drawing
    const cloudSprite = assets.getAsset('cloud');
    if (cloudSprite) {
      for (const cloud of this.clouds) {
        ctx.drawImage(cloudSprite, cloud.x, cloud.y);
      }
    }
  }
}