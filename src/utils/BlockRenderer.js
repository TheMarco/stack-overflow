import { BLOCK_SIZE } from '../constants.js';

/**
 * Renders Tetris blocks with different pixel art styles per level
 */
export default class BlockRenderer {
  /**
   * Create a block texture with a specific style
   * @param {Phaser.Scene} scene - The Phaser scene
   * @param {number} color - The color in hex format
   * @param {number} level - Current level (1-10) determines style
   * @param {string} key - Texture key to create
   */
  static createBlockTexture(scene, color, level, key) {
    const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
    
    // Extract RGB components
    const r = (color >> 16) & 0xFF;
    const g = (color >> 8) & 0xFF;
    const b = color & 0xFF;
    
    // Create lighter and darker shades
    const lightColor = Phaser.Display.Color.GetColor(
      Math.min(255, r + 60),
      Math.min(255, g + 60),
      Math.min(255, b + 60)
    );
    const darkColor = Phaser.Display.Color.GetColor(
      Math.max(0, r - 60),
      Math.max(0, g - 60),
      Math.max(0, b - 60)
    );
    
    // Different styles based on level
    const style = (level - 1) % 5; // 5 different styles cycling
    
    switch (style) {
      case 0: // Classic with border
        this.drawClassicBlock(graphics, color, lightColor, darkColor);
        break;
      case 1: // Gradient style
        this.drawGradientBlock(graphics, color, lightColor, darkColor);
        break;
      case 2: // Dotted pattern
        this.drawDottedBlock(graphics, color, lightColor);
        break;
      case 3: // Checkered
        this.drawCheckeredBlock(graphics, color, darkColor);
        break;
      case 4: // Outlined
        this.drawOutlinedBlock(graphics, color, lightColor, darkColor);
        break;
    }
    
    graphics.generateTexture(key, BLOCK_SIZE, BLOCK_SIZE);
    graphics.destroy();
  }
  
  static drawClassicBlock(graphics, color, lightColor, darkColor) {
    // Fill
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    
    // Light edge (top-left)
    graphics.fillStyle(lightColor);
    graphics.fillRect(0, 0, BLOCK_SIZE, 1);
    graphics.fillRect(0, 0, 1, BLOCK_SIZE);
    
    // Dark edge (bottom-right)
    graphics.fillStyle(darkColor);
    graphics.fillRect(0, BLOCK_SIZE - 1, BLOCK_SIZE, 1);
    graphics.fillRect(BLOCK_SIZE - 1, 0, 1, BLOCK_SIZE);
  }
  
  static drawGradientBlock(graphics, color, lightColor, darkColor) {
    // Create gradient effect with horizontal bands
    for (let y = 0; y < BLOCK_SIZE; y++) {
      const ratio = y / BLOCK_SIZE;
      const r = Phaser.Math.Linear((lightColor >> 16) & 0xFF, (darkColor >> 16) & 0xFF, ratio);
      const g = Phaser.Math.Linear((lightColor >> 8) & 0xFF, (darkColor >> 8) & 0xFF, ratio);
      const b = Phaser.Math.Linear(lightColor & 0xFF, darkColor & 0xFF, ratio);
      graphics.fillStyle(Phaser.Display.Color.GetColor(r, g, b));
      graphics.fillRect(0, y, BLOCK_SIZE, 1);
    }
  }
  
  static drawDottedBlock(graphics, color, lightColor) {
    graphics.fillStyle(color);
    graphics.fillRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    
    // Add dots
    graphics.fillStyle(lightColor);
    for (let y = 1; y < BLOCK_SIZE; y += 3) {
      for (let x = 1; x < BLOCK_SIZE; x += 3) {
        graphics.fillRect(x, y, 1, 1);
      }
    }
  }
  
  static drawCheckeredBlock(graphics, color, darkColor) {
    for (let y = 0; y < BLOCK_SIZE; y += 2) {
      for (let x = 0; x < BLOCK_SIZE; x += 2) {
        const useMain = (x + y) % 4 === 0;
        graphics.fillStyle(useMain ? color : darkColor);
        graphics.fillRect(x, y, 2, 2);
      }
    }
  }
  
  static drawOutlinedBlock(graphics, color, lightColor, darkColor) {
    // Fill
    graphics.fillStyle(color);
    graphics.fillRect(1, 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
    
    // Thick outline
    graphics.fillStyle(darkColor);
    graphics.fillRect(0, 0, BLOCK_SIZE, 1);
    graphics.fillRect(0, 0, 1, BLOCK_SIZE);
    graphics.fillRect(0, BLOCK_SIZE - 1, BLOCK_SIZE, 1);
    graphics.fillRect(BLOCK_SIZE - 1, 0, 1, BLOCK_SIZE);
    
    // Inner highlight
    graphics.fillStyle(lightColor);
    graphics.fillRect(2, 2, BLOCK_SIZE - 4, 1);
    graphics.fillRect(2, 2, 1, BLOCK_SIZE - 4);
  }
}

