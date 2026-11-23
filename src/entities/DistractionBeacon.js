import Phaser from 'phaser';
import { GAME_SETTINGS } from '../config/GameConstants.js';

export class DistractionBeacon extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    const ring = scene.add.circle(0, 0, 26, 0xf0ca4a, 0.25);
    const marker = scene.add.rectangle(0, 0, 18, 18, 0xf0ca4a).setStrokeStyle(3, 0xfff0a6);
    this.add([ring, marker]);
    scene.add.existing(this);
    this.activeUntil = scene.time.now + GAME_SETTINGS.beaconDuration;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  isActive(now) {
    return now < this.activeUntil;
  }
}
