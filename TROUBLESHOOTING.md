# Troubleshooting Guide

## Common Issues

### Game doesn't load / Black screen

1. **Check browser console** (F12) for errors
2. **Verify assets are generated**:
   ```bash
   npm run generate-assets
   ```
3. **Clear browser cache** and reload (Cmd+Shift+R or Ctrl+Shift+R)

### Audio doesn't play

- **Browser autoplay policy**: Most browsers block audio until user interaction
- The game requires you to press SPACE to start, which should enable audio
- Check browser console for audio-related errors
- Verify music files exist in `public/assets/music/level-X/track.mp3`

### Blocks don't appear or wrong colors

- **Color extraction issue**: Make sure backdrop images are valid PNG files
- **Texture generation**: Check browser console for WebGL errors
- Try refreshing the page

### Controls not working

- Make sure the game window has focus (click on it)
- Check that you're using arrow keys and spacebar
- Verify no browser extensions are intercepting keyboard events

### Performance issues

- The game uses pixel-perfect rendering which is GPU-intensive
- Try closing other browser tabs
- Check if hardware acceleration is enabled in browser settings

## Development Issues

### Canvas module installation fails

If `npm install canvas` fails on your system:

1. The placeholder generation will skip backdrop creation
2. You can manually create 256×224 PNG files and place them in:
   ```
   public/assets/backdrops/level-X/backdrop.png
   ```

### Vite build errors

- Make sure you're using Node.js version 14 or higher
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

### Module import errors

- Verify `"type": "module"` is in package.json
- Check that all import paths use `.js` extensions

## Testing Checklist

- [ ] Game loads and shows "LOADING..." then "PRESS SPACE TO START"
- [ ] Pressing SPACE starts the game
- [ ] Backdrop is visible
- [ ] Tetris pieces appear and are colored
- [ ] Arrow keys move pieces left/right
- [ ] Up arrow rotates pieces
- [ ] Down arrow soft drops
- [ ] Space bar hard drops
- [ ] Lines clear when complete
- [ ] Score updates
- [ ] Level increases after 20 lines
- [ ] Backdrop, music, and colors change on level up
- [ ] Ghost piece shows on level 1 only
- [ ] Game over screen appears when pieces stack to top

## Browser Compatibility

Tested on:
- Chrome/Edge (recommended)
- Firefox
- Safari

Requires:
- WebGL support
- ES6 module support
- Web Audio API

## Getting Help

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify all files are in the correct locations
3. Make sure the dev server is running (`npm run dev`)
4. Try a different browser
5. Check that all dependencies are installed (`npm install`)

