"use client";

class RingtoneManager {
  private audioCtx: AudioContext | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  /**
   * Play pleasant synthesized incoming ringtone chime (repeats every 1.4s)
   */
  startIncomingRingtone() {
    this.stop();
    this.initContext();
    if (!this.audioCtx) return;

    const playChime = () => {
      if (!this.audioCtx) return;
      try {
        const now = this.audioCtx.currentTime;

        // Tone 1 (C5 - 523Hz)
        const osc1 = this.audioCtx.createOscillator();
        const gain1 = this.audioCtx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(this.audioCtx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Tone 2 (E5 - 659Hz)
        const osc2 = this.audioCtx.createOscillator();
        const gain2 = this.audioCtx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(659.25, now + 0.15);
        gain2.gain.setValueAtTime(0.12, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(this.audioCtx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.5);

        // Tone 3 (G5 - 783Hz)
        const osc3 = this.audioCtx.createOscillator();
        const gain3 = this.audioCtx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(783.99, now + 0.3);
        gain3.gain.setValueAtTime(0.12, now + 0.3);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc3.connect(gain3);
        gain3.connect(this.audioCtx.destination);
        osc3.start(now + 0.3);
        osc3.stop(now + 0.7);
      } catch (e) {
        // Ignore audio context errors
      }
    };

    playChime();
    this.intervalId = setInterval(playChime, 1400);
  }

  /**
   * Play standard outgoing ringback tone (repeats every 2.8s)
   */
  startOutgoingRingback() {
    this.stop();
    this.initContext();
    if (!this.audioCtx) return;

    const playRingback = () => {
      if (!this.audioCtx) return;
      try {
        const now = this.audioCtx.currentTime;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(425, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.2);
      } catch (e) {
        // Ignore audio context errors
      }
    };

    playRingback();
    this.intervalId = setInterval(playRingback, 2800);
  }

  /**
   * Stop any playing ringtone or ringback sound
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const ringtoneManager = new RingtoneManager();
