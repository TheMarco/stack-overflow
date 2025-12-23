/**
 * Generate a simple template image showing the play area
 * Run with: node scripts/generate-template.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

async function generateTemplate() {
  try {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(256, 224);
    const ctx = canvas.getContext('2d');

    console.log('Canvas created:', canvas.width, 'x', canvas.height);

    // Set global alpha to fully opaque
    ctx.globalAlpha = 1.0;

    // Background - light gray (with explicit RGB)
    ctx.fillStyle = 'rgb(204, 204, 204)';
    ctx.fillRect(0, 0, 256, 224);

    // Play area - bright magenta/pink (easy to see and select in image editors)
    ctx.fillStyle = 'rgb(255, 0, 255)';
    ctx.fillRect(88, 32, 80, 160);

    // Add grid lines in play area
    ctx.strokeStyle = '#CC00CC';
    ctx.lineWidth = 1;
    // Vertical lines every 8 pixels
    for (let x = 88; x <= 168; x += 8) {
      ctx.beginPath();
      ctx.moveTo(x, 32);
      ctx.lineTo(x, 192);
      ctx.stroke();
    }
    // Horizontal lines every 8 pixels
    for (let y = 32; y <= 192; y += 8) {
      ctx.beginPath();
      ctx.moveTo(88, y);
      ctx.lineTo(168, y);
      ctx.stroke();
    }

    // Border around play area - black
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(88, 32, 80, 160);

    // Add labels
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px sans-serif';

    // Title
    ctx.fillText('TETRIS BACKDROP TEMPLATE', 40, 15);
    ctx.font = '10px sans-serif';
    ctx.fillText('256 x 224 pixels', 85, 215);

    // Play area label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('PLAY AREA', 100, 110);
    ctx.fillText('80 x 160', 105, 122);

    // Coordinates
    ctx.fillStyle = '#000000';
    ctx.font = '8px sans-serif';
    ctx.fillText('(88,32)', 90, 28);
    ctx.fillText('(168,192)', 130, 200);

    // UI area labels
    ctx.fillStyle = '#666666';
    ctx.font = '8px sans-serif';
    ctx.fillText('SCORE/LEVEL', 10, 20);
    ctx.fillText('AREA', 10, 30);

    ctx.fillText('NEXT PIECE', 185, 20);
    ctx.fillText('AREA', 185, 30);

    // Corner markers
    ctx.fillStyle = '#FF0000';
    const markerSize = 6;
    // Top-left
    ctx.fillRect(88 - markerSize/2, 32 - markerSize/2, markerSize, markerSize);
    // Top-right
    ctx.fillRect(168 - markerSize/2, 32 - markerSize/2, markerSize, markerSize);
    // Bottom-left
    ctx.fillRect(88 - markerSize/2, 192 - markerSize/2, markerSize, markerSize);
    // Bottom-right
    ctx.fillRect(168 - markerSize/2, 192 - markerSize/2, markerSize, markerSize);

    // Add dimension arrows
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#000000';

    // Width arrow (top)
    ctx.beginPath();
    ctx.moveTo(88, 25);
    ctx.lineTo(168, 25);
    ctx.stroke();
    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(88, 25);
    ctx.lineTo(92, 23);
    ctx.lineTo(92, 27);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(168, 25);
    ctx.lineTo(164, 23);
    ctx.lineTo(164, 27);
    ctx.closePath();
    ctx.fill();
    ctx.fillText('80px', 120, 23);

    // Height arrow (left)
    ctx.beginPath();
    ctx.moveTo(82, 32);
    ctx.lineTo(82, 192);
    ctx.stroke();
    // Arrow heads
    ctx.beginPath();
    ctx.moveTo(82, 32);
    ctx.lineTo(80, 36);
    ctx.lineTo(84, 36);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(82, 192);
    ctx.lineTo(80, 188);
    ctx.lineTo(84, 188);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(75, 112);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('160px', -15, 0);
    ctx.restore();
  
    // Save the template
    const templatePath = path.join(projectRoot, 'BACKDROP-TEMPLATE.png');
    const buffer = canvas.toBuffer('image/png');
    console.log('Buffer size:', buffer.length, 'bytes');
    fs.writeFileSync(templatePath, buffer);

    console.log('✅ Template created: BACKDROP-TEMPLATE.png');
    console.log('');
    console.log('The MAGENTA/PINK area (#FF00FF) is the play area.');
    console.log('Use this template in your image editor:');
    console.log('  1. Open BACKDROP-TEMPLATE.png');
    console.log('  2. Create your artwork on layers below the template');
    console.log('  3. Delete or hide the template layer');
    console.log('  4. Export as 256x224 PNG');
    console.log('  5. Save to public/assets/backdrops/level-X/backdrop.png');
  } catch (error) {
    console.error('Error generating template:', error);
    throw error;
  }
}

generateTemplate().catch(console.error);

