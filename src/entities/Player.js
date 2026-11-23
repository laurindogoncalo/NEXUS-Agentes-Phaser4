import Phaser from 'phaser';
import { GAME_SETTINGS } from '../config/GameConstants.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setMaxVelocity(GAME_SETTINGS.playerSpeed, 1000);
    this.setDragX(850);
    this.body.setSize(28, 44).setOffset(2, 4);
    this.invulnerable = false;
  }

  update(cursors, keys) {
    if (cursors.left.isDown || keys.A.isDown) {
      this.setVelocityX(-GAME_SETTINGS.playerSpeed);
      this.setFlipX(true);
      if (this.body.blocked.down) this.play('player_run', true);
    } else if (cursors.right.isDown || keys.D.isDown) {
      this.setVelocityX(GAME_SETTINGS.playerSpeed);
      this.setFlipX(false);
      if (this.body.blocked.down) this.play('player_run', true);
    } else {
      if (this.body.blocked.down) this.play('player_idle', true);
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(cursors.space) ||
      Phaser.Input.Keyboard.JustDown(keys.W);
    if (jumpPressed && this.body.blocked.down) {
      this.setVelocityY(-GAME_SETTINGS.playerJump);
      this.scene.audioFeedback?.play('jump');
    }

    if (!this.body.blocked.down) this.play('player_jump', true);
  }

  takeDamage(scene) {
    if (this.invulnerable) return false;
    this.invulnerable = true;
    this.scene.audioFeedback?.play('damage');
    let lives = scene.registry.get('lives') - 1;
    scene.registry.set('lives', lives);
    scene.flashHud();
    this.setVelocity(-150 * (this.flipX ? 1 : -1), -280);

    if (lives <= 0) {
      scene.audioFeedback?.play('defeat');
      scene.scene.start('ResultScene', { result: 'defeat', score: scene.registry.get('score') });
      return true;
    }

    scene.time.delayedCall(1200, () => {
      this.invulnerable = false;
      this.setAlpha(1);
    });
    this.scene.tweens.add({ targets: this, alpha: 0.3, duration: 100, yoyo: true, repeat: 5 });
    return true;
  }
}
