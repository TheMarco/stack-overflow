/**
 * Generate placeholder assets for all 10 levels
 * Run with: node scripts/generate-placeholders.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Create directories
const assetsDir = path.join(projectRoot, 'public', 'assets');
const backdropsDir = path.join(assetsDir, 'backdrops');
const musicDir = path.join(assetsDir, 'music');

// Ensure directories exist
fs.mkdirSync(backdropsDir, { recursive: true });
fs.mkdirSync(musicDir, { recursive: true });

// Color palettes for each level
const levelPalettes = [
  ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'], // Level 1 - Warm
  ['#3498DB', '#E74C3C', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22'], // Level 2 - Primary
  ['#FF1744', '#00E676', '#2979FF', '#FFEA00', '#D500F9', '#00E5FF', '#FF9100'], // Level 3 - Neon
  ['#8E44AD', '#16A085', '#C0392B', '#F39C12', '#2980B9', '#27AE60', '#D35400'], // Level 4 - Deep
  ['#FF6F61', '#6B5B95', '#88B04B', '#F7CAC9', '#92A8D1', '#955251', '#B565A7'], // Level 5 - Pastel
  ['#34495E', '#E74C3C', '#ECF0F1', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'], // Level 6 - Modern
  ['#FF4500', '#FFD700', '#00CED1', '#FF1493', '#00FF00', '#1E90FF', '#FF69B4'], // Level 7 - Vibrant
  ['#8B4513', '#DAA520', '#CD853F', '#D2691E', '#B8860B', '#A0522D', '#DEB887'], // Level 8 - Earth
  ['#000080', '#4B0082', '#8B008B', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6'], // Level 9 - Purple
  ['#FF0000', '#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#FFD700', '#FFFF00']  // Level 10 - Fire
];

// Generate backdrop images using Canvas API (Node.js)
async function generateBackdrop(level, palette) {
  const { createCanvas } = await import('canvas');
  const canvas = createCanvas(256, 224);
  const ctx = canvas.getContext('2d');

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 256, 224);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.5, palette[1]);
  gradient.addColorStop(1, palette[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 224);

  // Add some retro patterns
  ctx.fillStyle = palette[3];
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 224;
    const size = Math.random() * 20 + 5;
    ctx.fillRect(x, y, size, size);
  }

  // Add level indicator in corner
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = palette[4];
  ctx.font = 'bold 48px monospace';
  ctx.fillText(`L${level}`, 10, 50);

  // PLAY AREA INDICATOR - Make it very clear
  // Play area is at x:88, y:32, width:80, height:160

  // Dark background for play area
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = '#000000';
  ctx.fillRect(88, 32, 80, 160);

  // Bright border around play area
  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = '#FFFF00'; // Bright yellow
  ctx.lineWidth = 3;
  ctx.strokeRect(88, 32, 80, 160);

  // Add corner markers for extra visibility
  ctx.fillStyle = '#FFFF00';
  const markerSize = 8;
  // Top-left corner
  ctx.fillRect(88 - markerSize, 32 - markerSize, markerSize, markerSize);
  // Top-right corner
  ctx.fillRect(88 + 80, 32 - markerSize, markerSize, markerSize);
  // Bottom-left corner
  ctx.fillRect(88 - markerSize, 32 + 160, markerSize, markerSize);
  // Bottom-right corner
  ctx.fillRect(88 + 80, 32 + 160, markerSize, markerSize);

  // Add text labels
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('PLAY AREA', 92, 28);
  ctx.fillText('80x160px', 95, 200);
  ctx.fillText(`(${88},${32})`, 92, 44);

  // Add grid lines inside play area to show it clearly
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  // Vertical lines every 8 pixels (block size)
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

  return canvas.toBuffer('image/png');
}

// Generate silent MP3 placeholder (we'll create a minimal valid MP3)
function generateSilentMP3() {
  // Minimal valid MP3 header for 1 second of silence
  // This is a simplified approach - in production you'd use a proper audio library
  const mp3Header = Buffer.from([
    0xFF, 0xFB, 0x90, 0x00, // MP3 sync word and header
  ]);
  
  // Create a small buffer with MP3 frame headers
  const frames = 38; // Approximately 1 second at 44.1kHz
  const frameSize = 417;
  const buffer = Buffer.alloc(frames * frameSize);
  
  for (let i = 0; i < frames; i++) {
    mp3Header.copy(buffer, i * frameSize);
  }
  
  return buffer;
}

// Main generation function
async function generateAllAssets() {
  console.log('Generating placeholder assets...\n');
  
  // Check if canvas is available
  let canvasAvailable = false;
  try {
    await import('canvas');
    canvasAvailable = true;
  } catch (e) {
    console.log('⚠️  Canvas module not available. Install with: npm install canvas');
    console.log('   Skipping backdrop generation. You can add your own PNG files.\n');
  }
  
  for (let level = 1; level <= 10; level++) {
    const levelBackdropDir = path.join(backdropsDir, `level-${level}`);
    const levelMusicDir = path.join(musicDir, `level-${level}`);
    
    fs.mkdirSync(levelBackdropDir, { recursive: true });
    fs.mkdirSync(levelMusicDir, { recursive: true });
    
    // Generate backdrop
    if (canvasAvailable) {
      const backdropPath = path.join(levelBackdropDir, 'backdrop.png');
      const backdropBuffer = await generateBackdrop(level, levelPalettes[level - 1]);
      fs.writeFileSync(backdropPath, backdropBuffer);
      console.log(`✓ Generated backdrop for level ${level}`);
    } else {
      console.log(`⊘ Skipped backdrop for level ${level} (canvas not available)`);
    }
    
    // Generate silent MP3
    const musicPath = path.join(levelMusicDir, 'track.mp3');
    const mp3Buffer = generateSilentMP3();
    fs.writeFileSync(musicPath, mp3Buffer);
    console.log(`✓ Generated music placeholder for level ${level}`);
  }
  
  console.log('\n✅ All placeholder assets generated!');
  console.log('\nYou can now replace these files with your own:');
  console.log('  - Backdrops: public/assets/backdrops/level-X/backdrop.png (256x224 pixels)');
  console.log('  - Music: public/assets/music/level-X/track.mp3');
}

generateAllAssets().catch(console.error);

