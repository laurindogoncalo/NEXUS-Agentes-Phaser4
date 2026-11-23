import { UTILITY_WEIGHTS } from '../config/GameConstants.js';

export class UtilityDecisionSystem {
  decide({ distanceToPlayer, playerVisible, beacon, beaconDistance, coreDistance }) {
    const normalizedDistance = 1 - Math.min(distanceToPlayer / 600, 1);

    const chase = UTILITY_WEIGHTS.chasePlayerDistance * normalizedDistance
      + UTILITY_WEIGHTS.chaseVisibility * (playerVisible ? 1 : 0);

    const protectCore = UTILITY_WEIGHTS.protectCore
      * (1 - Math.min(coreDistance / 500, 1));

    let investigate = 0;
    if (beacon) {
      investigate = UTILITY_WEIGHTS.beacon
        * (1 - Math.min(beaconDistance / 700, 1));
    }

    const actions = {
      chase,
      protectCore,
      investigate
    };

    const selected = Object.entries(actions).sort((a, b) => b[1] - a[1])[0][0];
    return { selected, scores: actions };
  }
}
