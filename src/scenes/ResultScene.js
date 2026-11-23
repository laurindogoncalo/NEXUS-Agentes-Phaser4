import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(data) {
    const won = data.result === 'victory';
    this.cameras.main.setBackgroundColor(won ? '#0b3b52' : '#321a2b');
    this.add.text(640, 180, won ? 'MISSÃO CONCLUÍDA' : 'MISSÃO FALHADA', {
      fontFamily: 'Arial', fontSize: '48px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(640, 280, `Pontuação final: ${data.score || 0}`, {
      fontFamily: 'Arial', fontSize: '34px', color: '#88e2d8'
    }).setOrigin(0.5);

    const button = this.add.rectangle(640, 430, 420, 68, 0x1da39b).setInteractive({ useHandCursor: true });
    this.add.text(640, 430, 'JOGAR NOVAMENTE', {
      fontFamily: 'Arial', fontSize: '28px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);

    button.on('pointerdown', () => {
      this.registry.set('level', 1);
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.scene.start('LevelScene');
    });
  }
}
