export class LevelManager {
  constructor() {
    this.levels = [
      {
        number: 1,
        title: 'Nível 1 - Manutenção',
        difficultyLabel: 'Introdução',
        playerStart: { x: 100, y: 620 },
        exit: { x: 1180, y: 620 },
        platforms: [
          [640, 680, 1280, 80],
          [220, 530, 260, 28],
          [610, 560, 230, 28],
          [920, 470, 260, 28],
          [1180, 390, 180, 28]
        ],
        coreSlots: [
          { x: 220, y: 480 },
          { x: 610, y: 510 },
          { x: 1180, y: 340 }
        ],
        patrols: [
          { x: 760, y: 620, route: [[700, 620], [970, 620]], direction: 1 }
        ]
      },
      {
        number: 2,
        title: 'Nível 2 - Núcleo Central',
        difficultyLabel: 'Difícil',
        playerStart: { x: 100, y: 620 },
        exit: { x: 1188, y: 260 },
        platforms: [
          [640, 680, 1280, 80],
          [180, 530, 220, 28],
          [430, 430, 180, 28],
          [680, 540, 220, 28],
          [900, 430, 220, 28],
          [1180, 320, 180, 28],
          [980, 250, 180, 28]
        ],
        coreSlots: [
          { x: 180, y: 480 },
          { x: 900, y: 380 },
          { x: 980, y: 200 }
        ],
        patrols: [
          { x: 500, y: 620, route: [[350, 620], [760, 620]], direction: 1 },
          { x: 840, y: 380, route: [[760, 380], [1040, 380]], direction: -1 },
          { x: 1140, y: 620, route: [[1080, 620], [1220, 620]], direction: 1 }
        ]
      }
    ];
  }

  getLevel(number) {
    return this.levels.find((level) => level.number === number) || this.levels[0];
  }
}
