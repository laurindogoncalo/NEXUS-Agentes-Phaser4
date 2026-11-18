# NEXUS: Operação Autonomia

**Unidade curricular:** Sistemas Multimédia (2026/2027)  
**Curso:** Engenharia da Computação Gráfica e Multimédia  
**Estudante:** Laurindo Samunga Gonçalo  
**Tema atribuído:** Agentes inteligentes e tomada de decisão  
**Tecnologia prevista:** HTML5 + Phaser 4

## Objetivo

Jogo original de plataformas 2D. O jogador controla um robô de manutenção que explora uma instalação tecnológica, recolhe três núcleos de energia e alcança a saída de cada nível, evitando agentes de segurança autónomos.

## Conceitos técnicos de IA propostos

1. **Máquina de Estados Finitos (FSM):** patrulhar, detetar, perseguir, investigar e regressar à rota.
2. **Tomada de decisão baseada em utilidade:** o agente compara ações possíveis (perseguir o jogador, proteger um núcleo ou investigar um sinalizador) e executa a ação com maior pontuação de utilidade.

## Mecânica original proposta

O jogador dispõe de um sinalizador de distração com utilização limitada por nível. O agente pode interromper a perseguição e investigar o sinal quando essa ação apresenta maior utilidade.

## Funcionalidades planeadas

- Pelo menos dois níveis com dificuldade progressiva.
- Movimento lateral e salto através do teclado.
- Recolha de núcleos, pontuação e vidas.
- Agentes autónomos com comportamentos condicionados pelo ambiente.
- Aleatoriedade controlada na colocação de objetos e sentido inicial das patrulhas.
- Scenes para menu/instruções, jogo e resultados.
- Sprites animados, colisões com Arcade Physics e efeitos sonoros.

## Estrutura inicial

- `src/`: código JavaScript e Scenes Phaser.
- `assets/sprites/`: personagens, agentes e objetos visuais.
- `assets/audio/`: efeitos sonoros.
- `docs/`: relatório inicial e protótipos de baixa fidelidade.

## Estado

Nesta primeira fase estão definidos o conceito, as mecânicas planeadas e dois ecrãs de protótipo de baixa fidelidade. A implementação do jogo será desenvolvida progressivamente depois da entrega da proposta.

## Referência do protótipo

O vídeo demonstrativo disponibilizado no Moodle foi observado como referência geral do género de plataformas 2D. A temática, as personagens, a mecânica de agentes e os protótipos deste projeto são uma proposta própria.

## Repositório

URL previsto: https://github.com/laurindogoncalo/NEXUS-Agentes-Phaser4  
Confirmar o endereço depois de criar o repositório GitHub.
