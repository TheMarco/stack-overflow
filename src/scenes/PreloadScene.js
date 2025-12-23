import Phaser from 'phaser';
import { MAX_LEVEL } from '../constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Load block sprite sheet
    this.load.image('blocks-spritesheet', 'assets/blocks.png');

    // Load backdrops for all levels
    for (let i = 1; i <= MAX_LEVEL; i++) {
      this.load.image(`backdrop-${i}`, `assets/backdrops/level-${i}/backdrop.png`);
    }

    // Load music for all levels
    for (let i = 1; i <= MAX_LEVEL; i++) {
      this.load.audio(`music-${i}`, `assets/music/level-${i}/track.mp3`);
    }

    // Show loading progress
    const loadingText = this.add.text(128, 112, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      loadingText.setText(`LOADING ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
    });
  }

  create() {
    // Show start text
    this.add.text(128, 112, 'PRESS SPACE TO START', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Wait for space key to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}

