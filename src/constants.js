// Game dimensions
export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 224;

// Grid configuration
export const BLOCK_SIZE = 8; // 8x8 pixel blocks for retro feel
export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const PLAY_AREA_WIDTH = GRID_WIDTH * BLOCK_SIZE; // 80 pixels
export const PLAY_AREA_HEIGHT = GRID_HEIGHT * BLOCK_SIZE; // 160 pixels
export const PLAY_AREA_X = 88; // Centered with room for UI
export const PLAY_AREA_Y = 32; // Room for header

// Level progression
export const LINES_PER_LEVEL = 10;
export const MAX_LEVEL = 10;

// Tetromino shapes (NES Tetris style)
export const TETROMINOES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 0, // Will be replaced with palette color
    name: 'I'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 1,
    name: 'O'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 2,
    name: 'T'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 3,
    name: 'S'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 4,
    name: 'Z'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 5,
    name: 'J'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 6,
    name: 'L'
  }
};

// NES Tetris scoring
export const SCORES = {
  SINGLE: 40,
  DOUBLE: 100,
  TRIPLE: 300,
  TETRIS: 1200,
  SOFT_DROP: 1
};

// Game speeds (frames per drop) - Higher = slower
// Very gradual progression for better playability
export const LEVEL_SPEEDS = [
  90,  // Level 1 - very slow, beginner friendly
  80,  // Level 2
  70,  // Level 3
  60,  // Level 4
  50,  // Level 5
  40,  // Level 6
  32,  // Level 7
  24,  // Level 8
  16,  // Level 9
  10   // Level 10 - fast
];

// UI Layout
export const UI = {
  SCORE_X: 12,
  SCORE_Y: 20,
  LEVEL_X: 12,
  LEVEL_Y: 36,
  LINES_X: 12,
  LINES_Y: 52,
  NEXT_X: 188,
  NEXT_Y: 44
};

