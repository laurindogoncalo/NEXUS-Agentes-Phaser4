export class AudioFeedback {
  constructor() {
    this.context = null;
  }

  ensureContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.context = new AudioContext();
    }
  }

  play(type) {
    this.ensureContext();
    if (!this.context) return;

    const notes = {
      jump: [260, 360, 0.12],
      core: [620, 880, 0.18],
      damage: [140, 80, 0.22],
      beacon: [420, 620, 0.16],
      victory: [520, 780, 0.35],
      defeat: [180, 70, 0.40],
      detect: [300, 420, 0.14]
    };
    const [startFrequency, endFrequency, duration] = notes[type] || notes.core;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type === 'damage' || type === 'defeat' ? 'sawtooth' : 'sine';
    oscillator.frequency.setValueAtTime(startFrequency, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, this.context.currentTime + duration);
    gain.gain.setValueAtTime(0.10, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}
