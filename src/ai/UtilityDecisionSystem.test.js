import test from 'node:test';
import assert from 'node:assert/strict';
import { UtilityDecisionSystem } from './UtilityDecisionSystem.js';

test('persegue quando o jogador está perto e visível', () => {
  const system = new UtilityDecisionSystem();
  const result = system.decide({
    distanceToPlayer: 100,
    playerVisible: true,
    beacon: null,
    beaconDistance: 999,
    coreDistance: 350
  });

  assert.equal(result.selected, 'chase');
});

test('o sinalizador pode superar a perseguição', () => {
  const system = new UtilityDecisionSystem();
  const result = system.decide({
    distanceToPlayer: 100,
    playerVisible: true,
    beacon: { x: 200, y: 200 },
    beaconDistance: 80,
    coreDistance: 400
  });

  assert.equal(result.selected, 'investigate');
});

test('protege um núcleo próximo quando não há jogador visível nem sinalizador', () => {
  const system = new UtilityDecisionSystem();
  const result = system.decide({
    distanceToPlayer: 500,
    playerVisible: false,
    beacon: null,
    beaconDistance: 999,
    coreDistance: 80
  });

  assert.equal(result.selected, 'protectCore');
});
