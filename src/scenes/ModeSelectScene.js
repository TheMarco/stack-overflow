import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, BORDER_OFFSET } from '../constants.js';
import SoundGenerator from '../utils/SoundGenerator.js';

export default class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModeSelectScene' });
  }

  create() {
    // Use the title backdrop
    const titleImage = this.add.image(BORDER_OFFSET, 0, 'title');
    titleImage.setOrigin(0, 0);
    titleImage.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Dim the background by 50%
    const dimOverlay = this.add.rectangle(GAME_WIDTH / 2 + BORDER_OFFSET, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.5);
    dimOverlay.setDepth(5);

    // Title
    const titleText = this.add.bitmapText(GAME_WIDTH / 2 + BORDER_OFFSET, 60, 'pixel-font', 'MODE SELECT', 10).setOrigin(0.5);
    titleText.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    titleText.setDepth(10);

    // Classic mode option
    this.classicText = this.add.bitmapText(GAME_WIDTH / 2 + BORDER_OFFSET, 100, 'pixel-font', '> CLASSIC', 10).setOrigin(0.5);
    this.classicText.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.classicText.setDepth(10);
    this.classicText.setInteractive({ useHandCursor: true });

    const classicDesc = this.add.bitmapText(GAME_WIDTH / 2 + BORDER_OFFSET, 115, 'pixel-font', '7 STANDARD PIECES', 10).setOrigin(0.5);
    classicDesc.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    classicDesc.setDepth(10);

    // Advanced mode option
    this.advancedText = this.add.bitmapText(GAME_WIDTH / 2 + BORDER_OFFSET, 145, 'pixel-font', '  ADVANCED', 10).setOrigin(0.5);
    this.advancedText.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.advancedText.setDepth(10);
    this.advancedText.setInteractive({ useHandCursor: true });

    const advancedDesc = this.add.bitmapText(GAME_WIDTH / 2 + BORDER_OFFSET, 160, 'pixel-font', 'EXTRA UNIQUE PIECES', 10).setOrigin(0.5);
    advancedDesc.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    advancedDesc.setDepth(10);

    // Track selected mode
    this.selectedMode = 'classic';

    // Hover effects
    this.classicText.on('pointerover', () => {
      if (this.selectedMode !== 'classic') {
        SoundGenerator.playMove();
        this.selectedMode = 'classic';
        this.updateSelection();
      }
    });

    this.advancedText.on('pointerover', () => {
      if (this.selectedMode !== 'advanced') {
        SoundGenerator.playMove();
        this.selectedMode = 'advanced';
        this.updateSelection();
      }
    });

    // Click handlers
    this.classicText.on('pointerdown', () => {
      SoundGenerator.playRotate();
      this.startGame('classic');
    });

    this.advancedText.on('pointerdown', () => {
      SoundGenerator.playRotate();
      this.startGame('advanced');
    });

    // Keyboard controls
    const upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    const downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    upKey.on('down', () => {
      if (this.selectedMode !== 'classic') {
        SoundGenerator.playMove();
        this.selectedMode = 'classic';
        this.updateSelection();
      }
    });

    downKey.on('down', () => {
      if (this.selectedMode !== 'advanced') {
        SoundGenerator.playMove();
        this.selectedMode = 'advanced';
        this.updateSelection();
      }
    });

    spaceKey.on('down', () => {
      SoundGenerator.playRotate();
      this.startGame(this.selectedMode);
    });

    enterKey.on('down', () => {
      SoundGenerator.playRotate();
      this.startGame(this.selectedMode);
    });
  }

  updateSelection() {
    if (this.selectedMode === 'classic') {
      this.classicText.setText('> CLASSIC');
      this.advancedText.setText('  ADVANCED');
    } else {
      this.classicText.setText('  CLASSIC');
      this.advancedText.setText('> ADVANCED');
    }
  }

  startGame(mode) {
    // Store the selected mode in the registry so GameScene can access it
    this.registry.set('gameMode', mode);
    this.scene.start('GameScene');
  }
}

