import Phaser from 'phaser';
import { GAME_SETTINGS } from '../config/GameConstants.js';
import { StateMachine } from '../ai/StateMachine.js';
import { UtilityDecisionSystem } from '../ai/UtilityDecisionSystem.js';

export class SecurityAgent extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, route, direction = 1) {
    super(scene, x, y, 'agent_patrol');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setSize(34, 44).setOffset(7, 4);
    this.setDepth(7);
    this.route = route;
    this.routeIndex = direction > 0 ? 1 : 0;
    this.lastKnownPosition = null;
    this.playerVisibleTimer = 0;
    this.playerLostTimer = 0;
    this.utilitySystem = new UtilityDecisionSystem();
    this.stateMachine = new StateMachine('PATROL', this);
  }

  updateAgent(player, beacon, cores, now, delta) {
    const playerDistance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const visible = this.canSeePlayer(player, playerDistance);

    if (visible) {
      this.playerVisibleTimer += delta;
      this.playerLostTimer = 0;
      this.lastKnownPosition = { x: player.x, y: player.y };
    } else {
      this.playerVisibleTimer = 0;
      this.playerLostTimer += delta;
    }

    this.stateMachine.update(this.createStateContext(player, beacon, cores, visible, playerDistance, now, delta));
  }

  createStateContext(player, beacon, cores, visible, playerDistance, now, delta) {
    const beaconActive = beacon?.isActive(now);
    const beaconPosition = beaconActive ? beacon.getPosition() : null;

    return {
      PATROL: {
        enter: () => this.setTint(0xffffff),
        execute: () => {
          const utility = this.calculateUtility(player, beaconPosition, cores);
          if (visible && playerDistance < GAME_SETTINGS.detectionRange && this.playerVisibleTimer > 180) {
            this.stateMachine.transitionTo('DETECT');
          } else if (utility.selected === 'investigate' && beaconActive) {
            this.lastKnownPosition = beaconPosition;
            this.stateMachine.transitionTo('INVESTIGATE');
          } else if (utility.selected === 'protectCore') {
            const core = this.findNearestCore(cores);
            if (core) this.moveTowards(core.x, core.y, GAME_SETTINGS.patrolSpeed);
            else this.moveAlongRoute();
          } else {
            this.moveAlongRoute();
          }
        }
      },
      DETECT: {
        enter: () => {
          this.detectTimer = 0;
          this.setTint(0xffcf70);
          this.play('agent_alert');
          this.scene.audioFeedback?.play('detect');
        },
        execute: () => {
          this.detectTimer += delta;
          if (visible && this.detectTimer >= 220) {
            this.stateMachine.transitionTo('CHASE');
          } else if (this.playerVisibleTimer <= 0) {
            this.stateMachine.transitionTo('INVESTIGATE');
          }
        }
      },
      CHASE: {
        enter: () => {
          this.setTint(0xff8a70);
          this.play('agent_chase');
        },
        execute: () => {
          const utility = this.calculateUtility(player, beaconPosition, cores);
          if (beaconActive && utility.selected === 'investigate') {
            this.lastKnownPosition = beaconPosition;
            this.stateMachine.transitionTo('INVESTIGATE');
            return;
          }
          if (!visible && this.playerLostTimer > 900) {
            this.stateMachine.transitionTo('INVESTIGATE');
          } else if (visible) {
            this.moveTowards(player.x, player.y, GAME_SETTINGS.chaseSpeed);
          }
        }
      },
      INVESTIGATE: {
        enter: () => this.setTint(0x70cbd7),
        execute: () => {
          if (visible && playerDistance < GAME_SETTINGS.detectionRange) {
            this.stateMachine.transitionTo('CHASE');
          } else if (this.lastKnownPosition) {
            this.moveTowards(this.lastKnownPosition.x, this.lastKnownPosition.y, 110);
            if (Phaser.Math.Distance.Between(this.x, this.y, this.lastKnownPosition.x, this.lastKnownPosition.y) < 28) {
              this.investigateTimer = (this.investigateTimer || 0) + delta;
              if (this.investigateTimer > 1400) {
                this.investigateTimer = 0;
                this.lastKnownPosition = null;
                this.stateMachine.transitionTo('RETURN');
              }
            }
          } else {
            this.stateMachine.transitionTo('RETURN');
          }
        }
      },
      RETURN: {
        enter: () => this.setTint(0xa8c0ce),
        execute: () => {
          const nearest = this.route[this.routeIndex];
          this.moveTowards(nearest[0], nearest[1], GAME_SETTINGS.patrolSpeed);
          if (Phaser.Math.Distance.Between(this.x, this.y, nearest[0], nearest[1]) < 20) {
            this.stateMachine.transitionTo('PATROL');
          }
        }
      }
    };
  }

  calculateUtility(player, beaconPosition, cores) {
    const playerDistance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const beaconDistance = beaconPosition
      ? Phaser.Math.Distance.Between(this.x, this.y, beaconPosition.x, beaconPosition.y)
      : 999;
    const nearestCore = this.findNearestCore(cores);
    const coreDistance = nearestCore
      ? Phaser.Math.Distance.Between(this.x, this.y, nearestCore.x, nearestCore.y)
      : 999;
    return this.utilitySystem.decide({
      distanceToPlayer: playerDistance,
      playerVisible: this.canSeePlayer(player, playerDistance),
      beacon: beaconPosition,
      beaconDistance,
      coreDistance
    });
  }

  findNearestCore(cores) {
    if (!cores) return null;
    let nearest = null;
    let nearestDistance = Infinity;
    cores.getChildren().forEach((core) => {
      if (!core.active) return;
      const distance = Phaser.Math.Distance.Between(this.x, this.y, core.x, core.y);
      if (distance < nearestDistance) {
        nearest = core;
        nearestDistance = distance;
      }
    });
    return nearest;
  }

  canSeePlayer(player, distance) {
    if (distance > GAME_SETTINGS.detectionRange) return false;
    if (!this.lastDirection) return true;

    const horizontalDirection = player.x >= this.x ? 1 : -1;
    if (Math.sign(horizontalDirection) !== this.lastDirection) return false;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const normalizedLength = Math.sqrt(dx * dx + dy * dy);
    if (normalizedLength === 0) return true;

    const viewDot = (dx / normalizedLength) * this.lastDirection;
    const halfAngleRadians = Phaser.Math.DegToRad(GAME_SETTINGS.detectionAngle / 2);
    return viewDot >= Math.cos(halfAngleRadians);
  }

  moveAlongRoute() {
    const target = this.route[this.routeIndex];
    this.moveTowards(target[0], target[1], GAME_SETTINGS.patrolSpeed);
    if (Phaser.Math.Distance.Between(this.x, this.y, target[0], target[1]) < 18) {
      this.routeIndex = (this.routeIndex + 1) % this.route.length;
    }
  }

  moveTowards(x, y, speed) {
    const dx = x - this.x;
    const dy = y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 4) {
      this.setVelocity(0, 0);
      return;
    }
    this.lastDirection = Math.sign(dx);
    this.setVelocity(dx / distance * speed, dy / distance * speed);
    this.setFlipX(dx < 0);
  }
}
