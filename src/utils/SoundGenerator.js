/**
 * Generate simple sound effects using Web Audio API
 */
export default class SoundGenerator {
  /**
   * Play a simple beep sound
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {number} volume - Volume (0-1)
   */
  static playBeep(frequency, duration, volume = 0.3) {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square'; // Retro square wave sound

      // Envelope
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);

      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, duration * 1000 + 100);
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }

  static playMove() {
    this.playBeep(200, 0.05, 0.2);
  }

  static playRotate() {
    this.playBeep(300, 0.08, 0.25);
  }

  static playDrop() {
    this.playBeep(150, 0.15, 0.3);
  }

  static playLineClear() {
    // Multi-tone for line clear
    this.playBeep(400, 0.1, 0.3);
    setTimeout(() => this.playBeep(500, 0.1, 0.3), 50);
    setTimeout(() => this.playBeep(600, 0.15, 0.3), 100);
  }

  static playTetris() {
    // Exciting sound for 4-line clear
    this.playBeep(500, 0.1, 0.35);
    setTimeout(() => this.playBeep(600, 0.1, 0.35), 60);
    setTimeout(() => this.playBeep(700, 0.1, 0.35), 120);
    setTimeout(() => this.playBeep(800, 0.2, 0.35), 180);
  }

  static playLevelUp() {
    // Ascending tone
    this.playBeep(400, 0.1, 0.3);
    setTimeout(() => this.playBeep(500, 0.1, 0.3), 80);
    setTimeout(() => this.playBeep(600, 0.1, 0.3), 160);
    setTimeout(() => this.playBeep(700, 0.2, 0.3), 240);
  }

  static playGameOver() {
    // Descending tone
    this.playBeep(400, 0.15, 0.3);
    setTimeout(() => this.playBeep(300, 0.15, 0.3), 120);
    setTimeout(() => this.playBeep(200, 0.15, 0.3), 240);
    setTimeout(() => this.playBeep(100, 0.3, 0.3), 360);
  }
}


