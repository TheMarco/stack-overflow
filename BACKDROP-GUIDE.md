# Backdrop Creation Guide

## Screen Layout (256×224 pixels)

```
┌─────────────────────────────────────────────────────────────┐
│ 0,0                                                    256,0 │
│                                                               │
│  SCORE: 0      ┌──────────────────┐                          │
│  LEVEL: 1      │                  │         NEXT:            │
│  LINES: 0      │   PLAY AREA      │         ┌──┐             │
│                │   88,32          │         │  │             │
│                │   80×160 px      │         └──┘             │
│                │                  │                          │
│                │   10×20 blocks   │                          │
│                │   (8×8 each)     │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                │                  │                          │
│                └──────────────────┘                          │
│                168,192                                       │
│                                                               │
│ 0,224                                                  256,224│
└─────────────────────────────────────────────────────────────┘
```

## Play Area Specifications

- **Top-left corner**: (88, 32)
- **Bottom-right corner**: (168, 192)
- **Width**: 80 pixels (10 blocks × 8 pixels)
- **Height**: 160 pixels (20 blocks × 8 pixels)
- **Block size**: 8×8 pixels

## UI Element Positions

### Left Side (Score/Stats)
- **Score**: X: 8, Y: 8
- **Level**: X: 8, Y: 24
- **Lines**: X: 8, Y: 40

### Right Side (Next Piece)
- **"NEXT:" label**: X: 184, Y: 40
- **Next piece preview**: X: 184, Y: 52

## Design Tips

1. **Keep the play area visible**: The play area should be clearly distinguishable from the background
2. **Avoid busy patterns in play area**: Keep the area at (88, 32) to (168, 192) relatively clear
3. **Consider contrast**: Blocks will be colored based on your backdrop's dominant colors
4. **Safe zones**: 
   - Left side (0-87): Can have artwork, but leave room for score text
   - Right side (169-256): Can have artwork, but leave room for next piece
   - Top (0-31): Can have artwork/title
   - Bottom (193-224): Can have artwork/footer

## Color Palette Extraction

The game extracts 7 dominant colors from your backdrop to color the Tetris pieces:
- **Color 0**: I-piece (4-block line)
- **Color 1**: O-piece (square)
- **Color 2**: T-piece
- **Color 3**: S-piece
- **Color 4**: Z-piece
- **Color 5**: J-piece
- **Color 6**: L-piece

**Tips for color extraction:**
- Use vibrant, distinct colors in your backdrop
- Avoid too many similar shades
- The algorithm skips very dark colors (brightness < 40)
- Colors are quantized and sorted by frequency

## Template Image

**Quick Start:** Run `npm run generate-template` to create `BACKDROP-TEMPLATE.png`

This template shows:
- **Bright magenta (#FF00FF) play area** - Easy to see and select
- **Grid lines** showing 8×8 pixel blocks
- **Dimension arrows** with measurements
- **Corner markers** in red
- **Labels** for all areas

### Using the Template

1. Run `npm run generate-template`
2. Open `BACKDROP-TEMPLATE.png` in your image editor (Photoshop, GIMP, etc.)
3. Create new layers BELOW the template layer
4. Design your artwork on these layers
5. The magenta area shows exactly where the play area will be
6. When finished, delete or hide the template layer
7. Export as 256×224 PNG
8. Save to `public/assets/backdrops/level-X/backdrop.png`

## Example Workflow

1. Generate and open the template: `npm run generate-template`
2. In your image editor, create layers below the template
3. Design your artwork around the magenta play area
4. Make sure the play area has good contrast
5. Include 7 distinct colors you want for the blocks
6. Delete the template layer
7. Export as PNG (256×224)
8. Place in `public/assets/backdrops/level-X/backdrop.png`
9. Test in game to see the extracted colors

## Placeholder Backdrops

The generated placeholder backdrops show:
- **Yellow border**: Exact play area boundary
- **Yellow corner markers**: Play area corners
- **Grid lines**: 8×8 pixel block grid
- **Labels**: Coordinates and dimensions
- **Level indicator**: "L1", "L2", etc.

Use these as templates to understand the layout before creating your final artwork!

## Resolution Reference

- **Total screen**: 256×224 pixels (classic retro resolution)
- **Play area**: 80×160 pixels
- **Block size**: 8×8 pixels
- **Grid**: 10 blocks wide × 20 blocks tall
- **Aspect ratio**: Approximately 8:7 (slightly wider than square)

