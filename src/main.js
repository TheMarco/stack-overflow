import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 224,
  parent: 'game-container',
  backgroundColor: '#000000',
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: 3, // Scale up for visibility while maintaining pixel-perfect rendering
  },
  scene: [PreloadScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

