import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.cameras.main.setBackgroundColor('#dceaf4');
    this.add.rectangle(640, 360, 1280, 720, 0x071b33).setOrigin(0.5);
    this.add.rectangle(640, 360, 1040, 520, 0xdceaf4).setOrigin(0.5);
    this.add.rectangle(640, 360, 1032, 512, 0xf7fbff).setOrigin(0.5);

    this.add.text(640, 150, 'NEXUS', {
      fontFamily: 'Arial', fontSize: '72px', fontStyle: 'bold', color: '#1c4f78'
    }).setOrigin(0.5);
    this.add.text(640, 220, 'OPERAÇÃO AUTONOMIA', {
      fontFamily: 'Arial', fontSize: '30px', fontStyle: 'bold', color: '#1da39b'
    }).setOrigin(0.5);
    this.add.text(640, 290, 'Recupera os núcleos e ultrapassa a segurança autónoma.', {
      fontFamily: 'Arial', fontSize: '22px', color: '#17324d'
    }).setOrigin(0.5);

    this.createInfo(350, 'OBJETIVO', 'Recolhe 3 núcleos\nalcança a saída');
    this.createInfo(640, 'CONTROLOS', 'A/D ou ←/→ mover\nESPAÇO saltar');
    this.createInfo(930, 'SINALIZADOR', 'E distrair\nuso limitado');

    const button = this.add.rectangle(640, 500, 420, 70, 0x1c4f78).setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(640, 500, 'JOGAR', {
      fontFamily: 'Arial', fontSize: '34px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5);

    const startGame = () => {
      this.registry.set('level', 1);
      this.registry.set('score', 0);
      this.registry.set('lives', 3);
      this.scene.start('LevelScene');
    };

    button.on('pointerover', () => button.setFillStyle(0x1da39b));
    button.on('pointerout', () => button.setFillStyle(0x1c4f78));
    button.on('pointerdown', startGame);
    buttonText.on('pointerdown', startGame);

    this.input.keyboard.once('keydown-ENTER', startGame);
  }

  createInfo(x, title, text) {
    this.add.rectangle(x, 390, 250, 130, 0xeaf3f8).setStrokeStyle(3, 0x8fb2c9);
    this.add.text(x, 350, title, {
      fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#17324d'
    }).setOrigin(0.5);
    this.add.text(x, 407, text, {
      fontFamily: 'Arial', fontSize: '18px', align: 'center', color: '#17324d', lineSpacing: 8
    }).setOrigin(0.5);
  }
}
