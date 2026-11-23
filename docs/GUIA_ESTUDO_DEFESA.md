# Guia de estudo para defesa

## Fluxo geral

`main.js` cria o jogo Phaser 4.1.0 e registra `MenuScene`, `LevelScene` e `ResultScene`.

- `MenuScene`: apresenta objetivo, controlos e botão JOGAR.
- `LevelScene`: cria o nível atual, o jogador, plataformas, núcleos, saída e agentes.
- `ResultScene`: apresenta vitória ou derrota e permite recomeçar.

## Estrutura principal

- `Player`: movimento, salto, vidas e invulnerabilidade temporária.
- `SecurityAgent`: contém e atualiza a FSM e consulta Utility AI.
- `StateMachine`: guarda o estado atual e troca de estado de forma controlada.
- `UtilityDecisionSystem`: calcula perseguir, proteger núcleo e investigar sinalizador.
- `EnergyCore`: objeto recolhível.
- `DistractionBeacon`: representa o sinalizador ativo e o seu tempo.
- `LevelManager`: guarda os dados dos níveis 1 e 2.

## FSM

Os estados são `PATROL`, `DETECT`, `CHASE`, `INVESTIGATE` e `RETURN`.

As transições usam distância ao jogador, visibilidade, tempo visível/perdido e chegada a pontos de rota.
`DETECT` exige visibilidade continuada antes de passar a `CHASE`, evitando troca instável.
Perder o jogador leva a `INVESTIGATE` e depois a `RETURN`.
O campo de visão usa o alcance configurado e o ângulo configurado em `GAME_SETTINGS.detectionAngle`.

## Utility AI

Para cada ação existe uma pontuação:

- Perseguir: `0.45 * distânciaInversa + 0.35 * visibilidade`
- Proteger núcleo: `0.30 * proximidadeNormalizadaAoNúcleo`
- Investigar sinalizador: `1.00 * proximidadeNormalizadaAoSinalizador`

A distância é normalizada entre 0 e 1. A ação com maior pontuação é selecionada.
Se o sinalizador tiver mais utilidade, o agente muda para `INVESTIGATE` mesmo durante uma perseguição.

## Diferença entre FSM e Utility AI

A FSM decide o estado tático atual. A Utility AI decide qual objetivo é mais importante naquele instante.
A FSM dá estabilidade ao comportamento; Utility AI permite escolhas diferentes segundo o ambiente.

## Colisões e vida

Arcade Physics aplica gravidade ao jogador, plataformas estáticas e limite do mundo.
Colidir com agente reduz uma vida e ativa invulnerabilidade curta.
Com vidas a zero, abre-se `ResultScene`.

## Sinalizador

Tecla E cria um ponto temporário onde o jogador está.
O nível permite dois usos. Expira ao fim de `beaconDuration`.
O agente calcula utilidade com o sinalizador ativo e pode investigar.

## Alterar parâmetros

Os valores principais estão em `src/config/GameConstants.js`.
Os dados das plataformas, núcleos e patrulhas estão em `src/config/LevelManager.js`.

## Perguntas prováveis

**Como recolhes os núcleos?**  
O overlap do jogador com `EnergyCore` desativa o núcleo e aumenta pontuação.

**Quando abre a saída?**  
Depois de o contador chegar a três.

**Porque é que o jogo não gera níveis impossíveis?**  
Os núcleos usam slots seguros predefinidos e as patrulhas usam rotas também predefinidas.

**Como o nível 2 é mais difícil?**  
Tem três agentes, plataformas mais complexas e mais deslocação vertical.

**Como reiniciar?**  
Menu ou ecrã final reiniciam os valores de nível, pontuação e vidas.
