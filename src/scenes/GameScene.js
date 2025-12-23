import Phaser from 'phaser';
import {
  GAME_WIDTH, GAME_HEIGHT, BLOCK_SIZE, GRID_WIDTH, GRID_HEIGHT,
  PLAY_AREA_X, PLAY_AREA_Y, PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT,
  TETROMINOES, SCORES, LEVEL_SPEEDS, LINES_PER_LEVEL, MAX_LEVEL, UI
} from '../constants.js';
import ColorExtractor from '../utils/ColorExtractor.js';
import SpriteBlockRenderer from '../utils/SpriteBlockRenderer.js';
import SoundGenerator from '../utils/SoundGenerator.js';

export default class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    this.grid = this.createEmptyGrid();
    this.score = 0; this.level = 1; this.lines = 0; this.gameOver = false;
    this.dropCounter = 0; this.dropInterval = LEVEL_SPEEDS[0];
    this.softDropping = false; this.softDropCounter = 0;
    this.currentPiece = null; this.nextPiece = null;
    this.currentX = 0; this.currentY = 0;
    this.blockSprites = []; this.ghostSprites = [];
    this.loadLevel(this.level); this.setupInput(); this.createUI();
    this.spawnPiece(); this.nextPiece = this.getRandomPiece();
    this.updateNextPieceDisplay();
  }

  createEmptyGrid() {
    const grid = [];
    for (let y = 0; y < GRID_HEIGHT; y++) { grid[y] = []; for (let x = 0; x < GRID_WIDTH; x++) grid[y][x] = 0; }
    return grid;
  }

  loadLevel(level) {
    if (this.currentMusic) this.currentMusic.stop();
    const backdropKey = `backdrop-${level}`;
    if (this.backdrop) this.backdrop.destroy();
    this.backdrop = this.add.image(0, 0, backdropKey).setOrigin(0, 0);
    this.backdrop.setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.backdrop.setDepth(-1);  // <-- ADD THIS LINE
    this.colorPalette = ColorExtractor.extractPalette(this, backdropKey);
    this.createBlockTextures();
    const musicKey = `music-${level}`;
    this.currentMusic = this.sound.add(musicKey, { loop: true, volume: 0.5 });
    this.currentMusic.play(); this.redrawGrid();
  }

  createBlockTextures() {
    const enhanced = SpriteBlockRenderer.enhancePalette(this.colorPalette);
    this.colorPalette = enhanced;
    Object.keys(TETROMINOES).forEach((key, i) => {
      // Remove old textures if they exist
      if (this.textures.exists(`block-${key}`)) {
        this.textures.remove(`block-${key}`);
      }
      if (this.textures.exists(`ghost-${key}`)) {
        this.textures.remove(`ghost-${key}`);
      }
      SpriteBlockRenderer.createBlockTexture(this, this.colorPalette, this.level, `block-${key}`, i);
      SpriteBlockRenderer.createBlockTexture(this, this.colorPalette, this.level, `ghost-${key}`, i);
    });
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.dasDelay = 16; this.dasSpeed = 6; this.dasCounter = 0; this.dasDirection = 0;
    this.paused = false;
    this.spaceReleased = true; // Track if space was released before allowing another hard drop
  }

  createUI() {
    const ts = { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff' };
    const g = this.add.graphics();

    // Draw UI frames and play area background
    this.drawNESFrame(g, 4, 4, 76, 56);
    this.drawNESFrame(g, 180, 36, 72, 56);
    g.fillStyle(0x000000, 1);
    g.fillRect(PLAY_AREA_X, PLAY_AREA_Y, PLAY_AREA_WIDTH, PLAY_AREA_HEIGHT);
    this.drawNESFrame(g, PLAY_AREA_X - 4, PLAY_AREA_Y - 4, PLAY_AREA_WIDTH + 8, PLAY_AREA_HEIGHT + 8);

    // UI text
    this.add.text(UI.SCORE_X, UI.SCORE_Y - 8, 'SCORE', ts);
    this.scoreText = this.add.text(UI.SCORE_X, UI.SCORE_Y, '000000', ts);
    this.add.text(UI.LEVEL_X, UI.LEVEL_Y - 8, 'LEVEL', ts);
    this.levelText = this.add.text(UI.LEVEL_X, UI.LEVEL_Y, '1', ts);
    this.add.text(UI.LINES_X, UI.LINES_Y - 8, 'LINES', ts);
    this.linesText = this.add.text(UI.LINES_X, UI.LINES_Y, '0', ts);
    this.add.text(UI.NEXT_X, UI.NEXT_Y, 'NEXT', ts);
  }

  drawNESFrame(g, x, y, w, h) {
    g.fillStyle(0x000000, 1); g.fillRect(x, y, w, h);
    g.lineStyle(2, 0xAAAAAA, 1); g.strokeRect(x, y, w, h);
    g.lineStyle(1, 0x555555, 1); g.strokeRect(x + 2, y + 2, w - 4, h - 4);
    g.lineStyle(1, 0xFFFFFF, 1); g.beginPath(); g.moveTo(x + 1, y + h - 1); g.lineTo(x + 1, y + 1); g.lineTo(x + w - 1, y + 1); g.strokePath();
    g.lineStyle(1, 0x333333, 1); g.beginPath(); g.moveTo(x + w - 1, y + 1); g.lineTo(x + w - 1, y + h - 1); g.lineTo(x + 1, y + h - 1); g.strokePath();
  }

  getRandomPiece() {
    const keys = Object.keys(TETROMINOES);
    return JSON.parse(JSON.stringify(TETROMINOES[keys[Math.floor(Math.random() * keys.length)]]));
  }

  spawnPiece() {
    this.currentPiece = this.nextPiece ? this.nextPiece : this.getRandomPiece();
    this.nextPiece = this.getRandomPiece();
    this.currentX = Math.floor(GRID_WIDTH / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
    this.currentY = 0;
    if (this.checkCollision(this.currentPiece, this.currentX, this.currentY)) { this.gameOver = true; this.handleGameOver(); }
    this.updateNextPieceDisplay();
  }

  update(time, delta) {
    if (this.gameOver) return;
    if (this.clearing) return; // Wait for line clear animation
    if (Phaser.Input.Keyboard.JustDown(this.pKey)) this.togglePause();
    if (this.paused) return;
    this.handleInput();
    this.dropCounter++;
    if (this.dropCounter >= this.dropInterval) { this.dropCounter = 0; this.moveDown(); }
    this.renderPiece();
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.pauseOverlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
      this.pauseOverlay.setDepth(100);
      this.pauseText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'PAUSED', { fontFamily: 'monospace', fontSize: '16px', color: '#ffff00' }).setOrigin(0.5);
      this.pauseText.setDepth(101);
      this.pauseHintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'PRESS P', { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff' }).setOrigin(0.5);
      this.pauseHintText.setDepth(101);
      if (this.currentMusic) this.currentMusic.pause();
    } else {
      if (this.pauseOverlay) { this.pauseOverlay.destroy(); this.pauseOverlay = null; }
      if (this.pauseText) { this.pauseText.destroy(); this.pauseText = null; }
      if (this.pauseHintText) { this.pauseHintText.destroy(); this.pauseHintText = null; }
      if (this.currentMusic) this.currentMusic.resume();
    }
  }

  handleInput() {
    if (Phaser.Input.Keyboard.JustDown(this.upKey)) this.rotatePiece();

    // Hard drop only if space was released first
    if (this.spaceKey.isDown && this.spaceReleased) {
      this.hardDrop();
      this.spaceReleased = false;
    }
    if (!this.spaceKey.isDown) this.spaceReleased = true;
    if (this.downKey.isDown) {
      if (!this.softDropping) { this.softDropping = true; this.softDropCounter = 0; }
      this.softDropCounter++;
      if (this.softDropCounter >= 2) { this.softDropCounter = 0; if (this.moveDown()) { this.score += SCORES.SOFT_DROP; this.updateUI(); } }
    } else { this.softDropping = false; this.softDropCounter = 0; }
    if (this.leftKey.isDown) {
      if (this.dasDirection !== -1) { this.dasDirection = -1; this.dasCounter = 0; this.moveLeft(); }
      else { this.dasCounter++; if (this.dasCounter >= this.dasDelay && this.dasCounter % this.dasSpeed === 0) this.moveLeft(); }
    } else if (this.rightKey.isDown) {
      if (this.dasDirection !== 1) { this.dasDirection = 1; this.dasCounter = 0; this.moveRight(); }
      else { this.dasCounter++; if (this.dasCounter >= this.dasDelay && this.dasCounter % this.dasSpeed === 0) this.moveRight(); }
    } else { this.dasDirection = 0; this.dasCounter = 0; }
  }

  moveLeft() { if (!this.checkCollision(this.currentPiece, this.currentX - 1, this.currentY)) { this.currentX--; SoundGenerator.playMove(); } }
  moveRight() { if (!this.checkCollision(this.currentPiece, this.currentX + 1, this.currentY)) { this.currentX++; SoundGenerator.playMove(); } }
  moveDown() { if (!this.checkCollision(this.currentPiece, this.currentX, this.currentY + 1)) { this.currentY++; return true; } else { this.lockPiece(); return false; } }
  hardDrop() { while (!this.checkCollision(this.currentPiece, this.currentX, this.currentY + 1)) this.currentY++; SoundGenerator.playDrop(); this.lockPiece(); }

  rotatePiece() {
    const rotated = this.getRotatedPiece(this.currentPiece);
    if (!this.checkCollision(rotated, this.currentX, this.currentY)) { this.currentPiece = rotated; SoundGenerator.playRotate(); }
  }

  getRotatedPiece(piece) {
    const rotated = JSON.parse(JSON.stringify(piece));
    const shape = piece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = [];
    for (let x = 0; x < cols; x++) { newShape[x] = []; for (let y = rows - 1; y >= 0; y--) newShape[x][rows - 1 - y] = shape[y][x]; }
    rotated.shape = newShape;
    return rotated;
  }

  checkCollision(piece, x, y) {
    const shape = piece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridX = x + col;
          const gridY = y + row;
          if (gridX < 0 || gridX >= GRID_WIDTH || gridY >= GRID_HEIGHT) return true;
          if (gridY >= 0 && this.grid[gridY][gridX]) return true;
        }
      }
    }
    return false;
  }

  lockPiece() {
    const shape = this.currentPiece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const gridX = this.currentX + col;
          const gridY = this.currentY + row;
          if (gridY >= 0) this.grid[gridY][gridX] = this.currentPiece.name;
        }
      }
    }
    this.checkAndClearLines();
  }

  checkAndClearLines() {
    // Find complete lines
    const completeLines = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      let isComplete = true;
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (!this.grid[y][x]) { isComplete = false; break; }
      }
      if (isComplete) completeLines.push(y);
    }

    if (completeLines.length > 0) {
      this.clearing = true; // Pause game during animation

      // Play sound
      if (completeLines.length === 4) SoundGenerator.playTetris();
      else SoundGenerator.playLineClear();

      // First redraw to show locked piece, then animate
      this.redrawGrid();

      // Animate the lines, then clear them
      this.animateLineClear(completeLines, () => {
        this.finishLineClear(completeLines);
      });
    } else {
      this.spawnPiece();
      this.redrawGrid();
    }
  }

  animateLineClear(lines, onComplete) {
    // Hide the blocks that are being cleared
    this.blockSprites.forEach(sprite => {
      const spriteY = Math.floor((sprite.y - PLAY_AREA_Y) / BLOCK_SIZE);
      if (lines.includes(spriteY)) {
        sprite.setVisible(false);
      }
    });

    // Create crush effect sprites for each block in the clearing lines
    const crushSprites = [];

    lines.forEach(y => {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const px = PLAY_AREA_X + x * BLOCK_SIZE;
        const py = PLAY_AREA_Y + y * BLOCK_SIZE;

        // White flash block
        const flash = this.add.rectangle(px + BLOCK_SIZE/2, py + BLOCK_SIZE/2, BLOCK_SIZE, BLOCK_SIZE, 0xffffff);
        flash.setDepth(50);
        crushSprites.push(flash);
      }
    });

    // Phase 1: Flash white
    this.tweens.add({
      targets: crushSprites,
      alpha: { from: 1, to: 0.7 },
      duration: 80,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Phase 2: Crush horizontally (squeeze from sides to center)
        this.tweens.add({
          targets: crushSprites,
          scaleY: 0.1,
          scaleX: 1.5,
          alpha: 0.8,
          duration: 100,
          ease: 'Power2',
          onComplete: () => {
            // Phase 3: Explode outward and fade
            crushSprites.forEach(sprite => {
              const randomX = (Math.random() - 0.5) * 16;
              const randomY = (Math.random() - 0.5) * 8;
              this.tweens.add({
                targets: sprite,
                x: sprite.x + randomX,
                y: sprite.y + randomY,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 120,
                ease: 'Power2'
              });
            });

            this.time.delayedCall(130, () => {
              crushSprites.forEach(s => s.destroy());
              onComplete();
            });
          }
        });
      }
    });
  }

  finishLineClear(completeLines) {
    const linesCleared = completeLines.length;
    const sortedLines = [...completeLines].sort((a, b) => a - b); // Sort ascending

    // Calculate how far each row needs to fall
    // For each block sprite above cleared lines, animate it falling
    const spritesToAnimate = [];

    this.blockSprites.forEach(sprite => {
      if (!sprite.visible) return; // Skip already hidden (cleared) blocks

      const spriteGridY = Math.floor((sprite.y - PLAY_AREA_Y) / BLOCK_SIZE);

      // Count how many cleared lines are below this sprite
      let linesBelowCount = 0;
      sortedLines.forEach(clearedY => {
        if (clearedY > spriteGridY) linesBelowCount++;
      });

      if (linesBelowCount > 0) {
        spritesToAnimate.push({
          sprite: sprite,
          fallDistance: linesBelowCount * BLOCK_SIZE
        });
      }
    });

    // Animate falling blocks
    if (spritesToAnimate.length > 0) {
      const tweens = spritesToAnimate.map(item => {
        return this.tweens.add({
          targets: item.sprite,
          y: item.sprite.y + item.fallDistance,
          duration: 150,
          ease: 'Bounce.easeOut'
        });
      });

      // Wait for all animations to complete
      this.time.delayedCall(160, () => {
        this.applyLineClear(completeLines, linesCleared);
      });
    } else {
      this.applyLineClear(completeLines, linesCleared);
    }
  }

  applyLineClear(completeLines, linesCleared) {
    // Remove lines from grid (sort descending so indices stay valid)
    [...completeLines].sort((a, b) => b - a).forEach(y => {
      this.grid.splice(y, 1);
      this.grid.unshift(new Array(GRID_WIDTH).fill(0));
    });

    this.lines += linesCleared;
    const levelMultiplier = this.level;
    switch (linesCleared) {
      case 1: this.score += SCORES.SINGLE * levelMultiplier; break;
      case 2: this.score += SCORES.DOUBLE * levelMultiplier; break;
      case 3: this.score += SCORES.TRIPLE * levelMultiplier; break;
      case 4: this.score += SCORES.TETRIS * levelMultiplier; break;
    }

    const newLevel = Math.min(MAX_LEVEL, Math.floor(this.lines / LINES_PER_LEVEL) + 1);
    if (newLevel > this.level) {
      this.level = newLevel;
      this.dropInterval = LEVEL_SPEEDS[this.level - 1];
      SoundGenerator.playLevelUp();
      this.loadLevel(this.level);
    }

    this.updateUI();
    this.clearing = false; // Resume game
    this.spawnPiece();
    this.redrawGrid();
  }

  redrawGrid() {
    this.blockSprites.forEach(sprite => sprite.destroy());
    this.blockSprites = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (this.grid[y][x]) {
          const blockType = this.grid[y][x];
          const sprite = this.add.sprite(PLAY_AREA_X + x * BLOCK_SIZE, PLAY_AREA_Y + y * BLOCK_SIZE, `block-${blockType}`).setOrigin(0, 0);
          sprite.setDepth(2);
          this.blockSprites.push(sprite);
        }
      }
    }
  }

  renderPiece() {
    this.blockSprites.forEach(sprite => { if (sprite.getData('current')) sprite.destroy(); });
    this.blockSprites = this.blockSprites.filter(s => !s.getData('current'));
    this.ghostSprites.forEach(sprite => sprite.destroy());
    this.ghostSprites = [];
    if (!this.currentPiece) return;
    if (this.level === 1) {
      let ghostY = this.currentY;
      while (!this.checkCollision(this.currentPiece, this.currentX, ghostY + 1)) ghostY++;
      const shape = this.currentPiece.shape;
      for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
          if (shape[row][col]) {
            const x = PLAY_AREA_X + (this.currentX + col) * BLOCK_SIZE;
            const y = PLAY_AREA_Y + (ghostY + row) * BLOCK_SIZE;
            const sprite = this.add.sprite(x, y, `block-${this.currentPiece.name}`).setOrigin(0, 0);
            sprite.setAlpha(0.3);
            sprite.setDepth(1);
            this.ghostSprites.push(sprite);
          }
        }
      }
    }
    const shape = this.currentPiece.shape;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = PLAY_AREA_X + (this.currentX + col) * BLOCK_SIZE;
          const y = PLAY_AREA_Y + (this.currentY + row) * BLOCK_SIZE;
          const sprite = this.add.sprite(x, y, `block-${this.currentPiece.name}`).setOrigin(0, 0);
          sprite.setData('current', true);
          sprite.setDepth(2);
          this.blockSprites.push(sprite);
        }
      }
    }
  }

  updateNextPieceDisplay() {
    if (this.nextPieceSprites) this.nextPieceSprites.forEach(sprite => sprite.destroy());
    this.nextPieceSprites = [];
    if (!this.nextPiece) return;
    const shape = this.nextPiece.shape;
    const startX = UI.NEXT_X + 4;
    const startY = UI.NEXT_Y + 16;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const x = startX + col * BLOCK_SIZE;
          const y = startY + row * BLOCK_SIZE;
          const sprite = this.add.sprite(x, y, `block-${this.nextPiece.name}`).setOrigin(0, 0);
          sprite.setDepth(20);
          this.nextPieceSprites.push(sprite);
        }
      }
    }
  }

  updateUI() {
    const scoreStr = this.score.toString().padStart(6, '0');
    this.scoreText.setText(scoreStr);
    this.levelText.setText(this.level.toString());
    this.linesText.setText(this.lines.toString());
  }

  handleGameOver() {
    if (this.currentMusic) this.currentMusic.stop();
    SoundGenerator.playGameOver();

    // Black screen overlay
    const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    overlay.setDepth(100);

    const gameOverText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'GAME OVER', { fontFamily: 'monospace', fontSize: '16px', color: '#ff0000' }).setOrigin(0.5);
    gameOverText.setDepth(101);

    const restartText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 'PRESS SPACE', { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff' }).setOrigin(0.5);
    restartText.setDepth(101);

    this.input.keyboard.once('keydown-SPACE', () => { this.scene.restart(); });
  }
}
