/**
 * Web Audio API Sound Synthesizer & Procedural RPG Music Generator
 * Provides dynamic RPG ambient soundtrack for all worlds & stages + SFX
 */

const SCALES: Record<string, number[]> = {
  hills: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25],          // C Major Pentatonic (Folk Adventurous)
  dark_forest: [146.83, 174.61, 220.00, 261.63, 293.66],            // D Minor Dark (Mystic Forest)
  mine: [130.81, 164.81, 196.00, 246.94, 261.63],                   // Low Subterranean Industrial
  swamp: [110.00, 130.81, 146.83, 164.81, 220.00],                  // A Minor Gothic (Guttural Swamp)
  desert: [146.83, 155.56, 185.00, 220.00, 246.94],                 // D Phrygian Dominant (Desert Sitar)
  grotto: [523.25, 659.25, 783.99, 987.77, 1046.50],                // Ethereal Crystal Chiptune
  castle: [261.63, 329.63, 392.00, 493.88, 523.25],                 // Noble Imperial Baroque
  sea: [196.00, 246.94, 293.66, 349.23, 392.00],                    // Deep Ocean Ambient
  peaks: [440.00, 523.25, 659.25, 698.46, 880.00],                  // Glacial Cold Chiptune
  volcano: [82.41, 98.00, 110.00, 123.47, 164.81],                  // Low Metal Industrial
  abyss: [82.41, 98.00, 110.00, 123.47, 164.81],                    // Low Metal Industrial
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isSfxMuted: boolean = false;
  public isMusicMuted: boolean = false;

  private musicTimer: number | null = null;
  private musicStep: number = 0;
  private zoneId: string = 'hills';
  private stage: number = 1;

  private initCtx() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      /* ignore audio init errors */
    }
  }

  public setSfxMuted(muted: boolean) {
    this.isSfxMuted = muted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public updateZoneAndStage(zoneId: string, stage: number) {
    this.zoneId = zoneId || 'hills';
    this.stage = stage || 1;
    if (!this.isMusicMuted && !this.musicTimer) {
      this.startMusic();
    }
  }

  public startMusic() {
    if (this.musicTimer) return;
    this.musicTimer = window.setInterval(() => {
      this.stepMusic();
    }, 240);
  }

  public stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  private stepMusic() {
    if (this.isMusicMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const scale = SCALES[this.zoneId] ?? SCALES.hills;
      const step = this.musicStep++;
      const isBoss = this.stage >= 10;
      const isMid = this.stage >= 5;
      const now = this.ctx.currentTime;

      // Melody note
      if (step % 2 === 0) {
        const noteIdx = (Math.floor(step / 2) + (isBoss ? step % 3 : 0)) % scale.length;
        const freq = scale[noteIdx];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = (this.zoneId === 'grotto' || this.zoneId === 'peaks') ? 'sine' : (this.zoneId === 'volcano' || this.zoneId === 'abyss') ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const vol = isBoss ? 0.07 : 0.04;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      }

      // Sub-bassline / Percussion (for Boss or Mid stages)
      if (step % 4 === 0 && (isMid || isBoss)) {
        const bassFreq = scale[0] * 0.5;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(bassFreq, now);
        gain.gain.setValueAtTime(isBoss ? 0.08 : 0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      /* ignore playback errors */
    }
  }

  public playHit() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {
      /* ignore */
    }
  }

  public playCrit() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      /* ignore */
    }
  }

  public playSpell() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(750, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      /* ignore */
    }
  }

  public playFireball() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch { /* ignore */ }
  }

  public playFrost() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.22);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch { /* ignore */ }
  }

  public playHoly() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      });
    } catch { /* ignore */ }
  }

  public playSlash() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch { /* ignore */ }
  }

  public playBlock() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch { /* ignore */ }
  }

  public playLevelUp() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.12);
      });
    } catch {
      /* ignore */
    }
  }

  public playLoot() {
    try {
      if (this.isSfxMuted) return;
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      /* ignore */
    }
  }
}

export const sound = new SoundEngine();
