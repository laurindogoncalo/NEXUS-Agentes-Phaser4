import Phaser from 'phaser';
import { LevelManager } from '../config/LevelManager.js';
import { GAME_SETTINGS } from '../config/GameConstants.js';
import { Player } from '../entities/Player.js';
import { SecurityAgent } from '../entities/SecurityAgent.js';
import { EnergyCore } from '../entities/EnergyCore.js';
import { DistractionBeacon } from '../entities/DistractionBeacon.js';
import { AudioFeedback } from '../audio/AudioFeedback.js';

export class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
  }

  create() {
    this.audioFeedback = new AudioFeedback();
    this.levelManager = new LevelManager();
    this.levelNumber = this.registry.get('level') || 1;
    this.level = this.levelManager.getLevel(this.levelNumber);
    this.coresCollected = 0;
    this.beaconUses = GAME_SETTINGS.beaconUsesPerLevel;
    this.beacon = null;
    this.ending = false;

    this.createTextures();
    this.createAnimations();
    this.createWorld();
    this.createPlayer();
    this.createCores();
    this.createAgents();
    this.createExit();
    this.createHud();
    this.configureControls();
    this.configureCollisions();
  }

  createTextures() {
    if (this.textures.exists('player_idle')) return;

    const makeRect = (key, width, height, color, border = null) => {
      const graphics = this.add.graphics();
      graphics.fillStyle(color, 1).fillRoundedRect(0, 0, width, height, 4);
      if (border !== null) graphics.lineStyle(3, border).strokeRoundedRect(0, 0, width, height, 4);
      graphics.generateTexture(key, width, height);
      graphics.destroy();
    };

    makeRect('player_idle', 32, 48, 0x79b9d3, 0x17324d);
    makeRect('player_run', 32, 48, 0x55a6c7, 0x17324d);
    makeRect('player_jump', 32, 48, 0x3a91b8, 0x17324d);
    makeRect('agent_patrol', 40, 48, 0xe4bb76, 0x17324d);
    makeRect('agent_alert', 40, 48, 0xffcf70, 0x17324d);
    makeRect('agent_chase', 40, 48, 0xff8a70, 0x17324d);
    makeRect('platform', 128, 28, 0x45677a, 0x88c8db);
    makeRect('core', 28, 28, 0xf0ca4a, 0xfff0a6);
    makeRect('exit_closed', 54, 72, 0x6d8290, 0x17324d);
    makeRect('exit_open', 54, 72, 0x55d1ba, 0xcffaf0);
  }

  createAnimations() {
    if (this.anims.exists('player_idle')) return;
    this.anims.create({ key: 'player_idle', frames: [{ key: 'player_idle' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'player_run', frames: [{ key: 'player_run' }, { key: 'player_idle' }], frameRate: 8, repeat: -1 });
    this.anims.create({ key: 'player_jump', frames: [{ key: 'player_jump' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'agent_patrol', frames: [{ key: 'agent_patrol' }], frameRate: 1, repeat: -1 });
    this.anims.create({ key: 'agent_alert', frames: [{ key: 'agent_alert' }], frameRate: 6, repeat: -1 });
    this.anims.create({ key: 'agent_chase', frames: [{ key: 'agent_chase' }], frameRate: 8, repeat: -1 });
  }

  createWorld() {
    this.add.rectangle(640, 360, 1280, 720, 0xdceaf4).setDepth(-10);
    this.platforms = this.physics.add.staticGroup();
    this.level.platforms.forEach(([x, y, width, height]) => {
      const platform = this.platforms.create(x, y, 'platform');
      platform.setDisplaySize(width, height).refreshBody();
    });
  }

  createPlayer() {
    const start = this.level.playerStart;
    this.player = new Player(this, start.x, start.y);
  }

  createCores() {
    const slots = Phaser.Utils.Array.Shuffle([...this.level.coreSlots]);
    this.cores = this.physics.add.group();
    slots.forEach((slot) => {
      const core = new EnergyCore(this, slot.x, slot.y);
      this.cores.add(core);
      core.spawnPulse();
    });
  }

  createAgents() {
    this.agents = [];
    this.level.patrols.forEach((patrol) => {
      const direction = Phaser.Math.RND.pick([-1, 1]);
      const agent = new SecurityAgent(this, patrol.x, patrol.y, patrol.route, direction);
      this.agents.push(agent);
    });
  }

  createExit() {
    this.exit = this.physics.add.staticSprite(this.level.exit.x, this.level.exit.y, 'exit_closed');
    this.exit.body.setSize(54, 72).setOffset(0, 0);
  }

  createHud() {
    this.add.rectangle(640, 46, 1280, 92, 0x071b33).setScrollFactor(0).setDepth(20);
    this.levelText = this.add.text(40, 28, `NÍVEL ${this.levelNumber}/${this.levelManager.levels.length}`, {
      fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#ffffff'
    }).setDepth(21);
    this.scoreText = this.add.text(300, 28, '', this.hudStyle()).setDepth(21);
    this.livesText = this.add.text(560, 28, '', this.hudStyle()).setDepth(21);
    this.coresText = this.add.text(760, 28, '', this.hudStyle()).setDepth(21);
    this.beaconText = this.add.text(950, 28, '', this.hudStyle()).setDepth(21);
    this.statusText = this.add.text(640, 660, '', {
      fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#17324d', align: 'center',
      backgroundColor: '#f7fbff', padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setDepth(21);
    this.updateHud();
  }

  hudStyle() {
    return { fontFamily: 'Arial', fontSize: '20px', fontStyle: 'bold', color: '#88e2d8' };
  }

  configureControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,W,E');
  }

  configureCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.agents.forEach((agent) => this.physics.add.collider(agent, this.platforms));
    this.physics.add.overlap(this.player, this.cores, this.collectCore, null, this);
    this.agents.forEach((agent) => {
      this.physics.add.overlap(this.player, agent, () => this.handleAgentCollision(agent), null, this);
    });
    this.physics.add.overlap(this.player, this.exit, this.tryExit, null, this);

    this.keys.E.on('down', () => this.activateBeacon());
  }

  update(time, delta) {
    if (this.ending) return;
    this.player.update(this.cursors, this.keys);
    this.agents.forEach((agent) => agent.updateAgent(this.player, this.beacon, this.cores, time, delta));
    this.updateAgentStatus();

    if (this.beacon && !this.beacon.isActive(time)) {
      this.beacon.destroy();
      this.beacon = null;
    }
  }

  collectCore(player, core) {
    core.disableBody(true, true);
    this.coresCollected += 1;
    const score = this.registry.get('score') + GAME_SETTINGS.coreScore;
    this.registry.set('score', score);
    this.audioFeedback.play('core');
    this.updateHud();

    if (this.coresCollected === 3) {
      this.exit.setTexture('exit_open');
      this.statusText.setText('Saída ativada - alcança a porta!');
    } else {
      this.statusText.setText(`Núcleo recolhido (${this.coresCollected}/3)`);
    }
  }

  activateBeacon() {
    if (this.ending || this.beaconUses <= 0) return;
    if (this.beacon) this.beacon.destroy();
    this.beaconUses -= 1;
    this.beacon = new DistractionBeacon(this, this.player.x, this.player.y - 20);
    this.audioFeedback.play('beacon');
    this.updateHud();
  }

  handleAgentCollision(agent) {
    if (this.player.takeDamage(this)) {
      if (this.player.invulnerable) agent.setVelocity(-agent.body.velocity.x * 0.5, -150);
    }
  }

  tryExit() {
    if (this.ending) return;
    if (this.coresCollected < 3) {
      this.statusText.setText('A saída permanece bloqueada');
      return;
    }

    this.ending = true;
    const bonus = this.registry.get('score') + GAME_SETTINGS.levelScoreBonus;
    this.registry.set('score', bonus);

    if (this.levelNumber < this.levelManager.levels.length) {
      this.registry.set('level', this.levelNumber + 1);
      this.time.delayedCall(700, () => this.scene.restart());
    } else {
      this.time.delayedCall(500, () => {
        this.audioFeedback.play('victory');
        this.scene.start('ResultScene', { result: 'victory', score: this.registry.get('score') });
      });
    }
  }

  flashHud() {
    this.cameras.main.flash(180, 255, 100, 100);
  }

  updateHud() {
    this.scoreText?.setText(`PONTOS ${this.registry.get('score') || 0}`);
    this.livesText?.setText(`VIDAS ${this.registry.get('lives') || 0}`);
    this.coresText?.setText(`NÚCLEOS ${this.coresCollected}/3`);
    this.beaconText?.setText(`SINALIZADOR ${this.beaconUses}`);
  }

  updateAgentStatus() {
    if (!this.statusText || this.agents.length === 0) return;
    const states = this.agents.map((agent) => agent.stateMachine.state).join(' · ');
    if (!this.coresCollected && this.statusText.active) {
      this.statusText.setText(`Agentes: ${states}`);
    }
  }
}
