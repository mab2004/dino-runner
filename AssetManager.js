// Asset Manager - handles loading and management of all sprite assets
// Based on dhhruv's Chrome-Dino-Runner asset structure
export default class AssetManager {
  constructor() {
    this.assets = {};
    this.loaded = false;
    this.loadPromises = [];
  }

  async loadAllAssets() {
    // Define all assets to load based on dhhruv's structure
    const assetPaths = {
      // Dino sprites - from dhhruv's chromedino.py lines 18-25
      dinoRun1: 'assets/Dino/DinoRun1.png',
      dinoRun2: 'assets/Dino/DinoRun2.png',
      dinoJump: 'assets/Dino/DinoJump.png',
      dinoDuck1: 'assets/Dino/DinoDuck1.png',
      dinoDuck2: 'assets/Dino/DinoDuck2.png',
      dinoDead: 'assets/Dino/DinoDead.png',
      dinoStart: 'assets/Dino/DinoStart.png',
      
      // Cactus sprites - from dhhruv's chromedino.py lines 27-34
      smallCactus1: 'assets/Cactus/SmallCactus1.png',
      smallCactus2: 'assets/Cactus/SmallCactus2.png',
      smallCactus3: 'assets/Cactus/SmallCactus3.png',
      largeCactus1: 'assets/Cactus/LargeCactus1.png',
      largeCactus2: 'assets/Cactus/LargeCactus2.png',
      largeCactus3: 'assets/Cactus/LargeCactus3.png',
      
      // Bird/Pterodactyl sprites - from dhhruv's chromedino.py lines 36-39
      bird1: 'assets/Bird/Bird1.png',
      bird2: 'assets/Bird/Bird2.png',
      
      // Background and UI - from dhhruv's chromedino.py lines 41-45
      cloud: 'assets/Other/Cloud.png',
      track: 'assets/Other/Track.png',
      gameOver: 'assets/Other/GameOver.png',
      reset: 'assets/Other/Reset.png'
    };

    // Load all assets
    for (const [key, path] of Object.entries(assetPaths)) {
      this.loadPromises.push(this.loadImage(key, path));
    }

    await Promise.all(this.loadPromises);
    this.loaded = true;
    console.log('All assets loaded successfully');
  }

  loadImage(key, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.assets[key] = img;
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load asset: ${path}`);
        reject(new Error(`Failed to load ${path}`));
      };
      img.src = path;
    });
  }

  getAsset(key) {
    return this.assets[key];
  }

  // Convenience methods to get grouped assets
  getDinoRunSprites() {
    return [this.assets.dinoRun1, this.assets.dinoRun2];
  }

  getDinoDuckSprites() {
    return [this.assets.dinoDuck1, this.assets.dinoDuck2];
  }

  getSmallCactusSprites() {
    return [this.assets.smallCactus1, this.assets.smallCactus2, this.assets.smallCactus3];
  }

  getLargeCactusSprites() {
    return [this.assets.largeCactus1, this.assets.largeCactus2, this.assets.largeCactus3];
  }

  getBirdSprites() {
    return [this.assets.bird1, this.assets.bird2];
  }
}