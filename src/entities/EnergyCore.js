import Phaser from 'phaser';

export class EnergyCore extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, 'core');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.setDepth(5);
  }

  spawnPulse() {
    this.scene.tweens.add({
      targets: this,
      scale: 1.18,
      duration: 420,
      yoyo: true,
      repeat: -1
    });
  }
}
