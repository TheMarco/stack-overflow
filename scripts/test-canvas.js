import { createCanvas } from 'canvas';
import fs from 'fs';

const canvas = createCanvas(256, 224);
const ctx = canvas.getContext('2d');

// Fill with white
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, 256, 224);

// Draw a big red rectangle
ctx.fillStyle = '#FF0000';
ctx.fillRect(50, 50, 100, 100);

// Draw a blue circle
ctx.fillStyle = '#0000FF';
ctx.beginPath();
ctx.arc(200, 100, 30, 0, Math.PI * 2);
ctx.fill();

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('test-canvas.png', buffer);
console.log('Test image created:', buffer.length, 'bytes');

