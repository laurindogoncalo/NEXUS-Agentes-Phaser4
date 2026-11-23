# NEXUS: Operação Autonomia

Jogo académico de plataformas 2D em HTML5 para Desktop, desenvolvido em JavaScript modular com **Phaser 4.1.0** e Vite. O jogador controla um robô de manutenção numa instalação tecnológica, recolhe três núcleos por nível e evita agentes de segurança autónomos.

Trabalho da Unidade Curricular Sistemas Multimédia (2026/2027), Engenharia da Computação Gráfica e Multimédia.

## Mecânicas

- Movimento com setas ou A/D e salto com Espaço.
- Três núcleos por nível; a saída só abre após recolher todos.
- Pontuação, vidas limitadas, dano, vitória, derrota e recomeço.
- Dois níveis; o segundo contém mais plataformas e agentes.
- Sinalizador temporário limitado a dois usos por nível com tecla E.
- Aleatoriedade controlada nos slots seguros dos núcleos e sentido das patrulhas.
- Agentes com FSM real e sistema independente de Utility AI.

## Instalação e execução

Requisitos: Node.js 22 ou superior e npm.

```powers
npm install
npm run dev
```

Abrir `http://127.0.0.1:5173/`.

Para gerar a versão de produção:

```powers
npm run build
npm run preview
```

Para executar os testes unitários da FSM e da Utility AI:

```powers
npm test
```

## Controlos

| Tecla | Ação |
|---|---|
| ← / → ou A / D | Mover |
| Espaço ou W | Saltar |
| E | Ativar sinalizador |
| Enter | Entrar pelo menu |

## Estrutura

```text
src/
  main.js
  config/
    GameConstants.js
    LevelManager.js
  scenes/
    MenuScene.js
    LevelScene.js
    ResultScene.js
  entities/
    Player.js
    SecurityAgent.js
    EnergyCore.js
    DistractionBeacon.js
  ai/
    StateMachine.js
    UtilityDecisionSystem.js
  audio/
    AudioFeedback.js
docs/
  Relatorio_Inicial_NEXUS_Phaser4.pdf
  PBF/
  GUIA_ESTUDO_DEFESA.md
  DIARIO_DESENVOLVIMENTO.md
  ASSET_CREDITS.md
assets/
  sprites/
  audio/
```

## Inteligência artificial

A FSM usa `PATROL`, `DETECT`, `CHASE`, `INVESTIGATE` e `RETURN`. As transições dependem de distância, visibilidade e temporizadores.

A Utility AI avalia separadamente `perseguir jogador`, `proteger núcleo` e `investigar sinalizador`, normaliza os factores e escolhe o maior valor. O sinalizador pode tomar prioridade sobre perseguição ou proteção.

Mais detalhes estão em `docs/GUIA_ESTUDO_DEFESA.md`.

## Recursos

O MVP usa placeholders geométricos gerados por Phaser e sons sintetizados com Web Audio API. Não existem referências a ficheiros externos inexistentes. Os recursos finais necessários e os respectivos formatos estão descritos em `docs/ASSET_CREDITS.md`.

## Versões

- Phaser: 4.1.0
- Vite: 7
- Física: Arcade Physics

## Repositório

https://github.com/laurindogoncalo/NEXUS-Agentes-Phaser4
