import test from 'node:test';
import assert from 'node:assert/strict';
import { StateMachine } from './StateMachine.js';

test('permite transição controlada entre estados', () => {
  const machine = new StateMachine('PATROL', {});
  let executed = '';

  machine.transitionTo('DETECT');
  machine.update({
    PATROL: { execute: () => executed = 'PATROL' },
    DETECT: { enter: () => executed = 'ENTER_DETECT', execute: () => executed = 'DETECT' }
  });

  assert.equal(machine.state, 'DETECT');
  assert.equal(executed, 'DETECT');
});

test('não executa transição para o estado atual', () => {
  const machine = new StateMachine('PATROL', {});
  machine.transitionTo('PATROL');
  machine.update({
    PATROL: { execute: () => {} }
  });

  assert.equal(machine.state, 'PATROL');
  assert.equal(machine.pendingState ?? null, null);
});
