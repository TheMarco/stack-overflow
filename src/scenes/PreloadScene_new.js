import Phaser from 'phaser';
import { MAX_LEVEL } from '../constants.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Load pixel font first
    this.load.font('retro', 'assets/fonts/font.otf', 'opentype');

    // Create loading text
    const loadingText = this.add.text(128, 112, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Load block sprite sheet (64x8px, 10 sprites of 8x8 each)
    this.load.image('blocks-spritesheet', 'assets/blocks.png');

    // Load backdrops for all levels
    for (let i = 1; i <= MAX_LEVEL; i++) {
      this.load.image(`backdrop-${i}`, `assets/backdrops/level-${i}/backdrop.png`);
    }

    // Load music for all levels
    for (let i = 1; i <= MAX_LEVEL; i++) {
      this.load.audio(`music-${i}`, `assets/music/level-${i}/track.mp3`);
    }

    // Update loading progress
    this.load.on('progress', (value) => {
      loadingText.setText(`LOADING... ${Math.floor(value * 100)}%`);
    });

    this.load.on('complete', () => {
      // Update to use pixel font once loaded
      loadingText.setFontFamily('retro');
      loadingText.setText('PRESS SPACE TO START');
    });
  }

  create() {
    // Wait for space key to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}

