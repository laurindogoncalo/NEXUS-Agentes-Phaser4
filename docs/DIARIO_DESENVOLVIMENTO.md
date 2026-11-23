# Diário de Desenvolvimento

Este diário contém apenas atividades realizadas nesta sessão.

## 23 de novembro de 2026

- Consultado o estado Git e confirmado que o repositório já estava na branch `main`, sem alterações pendentes.
- Confirmado o remote `origin` como `https://github.com/laurindogoncalo/NEXUS-Agentes-Phaser4.git`.
- Inspecionados o `README.md`, o relatório inicial e os dois protótipos PBF em `docs/PBF`.
- O relatório aprovado foi lido integralmente; a proposta mantém dois níveis, três núcleos por nível, vidas, saída bloqueada, FSM e Utility AI.
- Instalados Node.js/npm, Phaser 4.1.0 e Vite.
- Criadas as Scenes `MenuScene`, `LevelScene` e `ResultScene`.
- Criadas as classes `Player`, `SecurityAgent`, `EnergyCore`, `DistractionBeacon`, `StateMachine`, `UtilityDecisionSystem` e `LevelManager`.
- Implementados movimento, salto, colisões Arcade, HUD, núcleos, saída, vidas, dois níveis e progressão.
- Implementados estados FSM, utilidade ponderada e sinalizador temporário.
- Criados placeholders visuais locais por Phaser Graphics, sem recursos externos nem links não verificados.
- Utilizada a IA Copilot como apoio à geração modular de código, à inspeção da API local do Phaser 4.1.0 e à verificação por build/browser.
- Decisão confirmada comigo: manter o relatório aprovado como fonte de verdade e não alterar o género ou as mecânicas propostas.

## 23 de novembro de 2026 - correções da primeira versão

- Auditadas as classes implementadas e reproduzida a abertura do jogo no browser.
- Corrigida a visibilidade dos agentes: passou a considerar distância, direção do agente e semiplano de visão configurado em `GAME_SETTINGS.detectionAngle`.
- Adicionado temporizador real ao estado `DETECT` antes da transição para `CHASE`.
- Adicionadas animações placeholder distintas para patrulha, alerta e perseguição.
- Reforçada a integração visual de estados durante a detecção e perseguição.
- Adicionados testes unitários para Utility AI e `StateMachine` usando o executor padrão do Node.js.
- Acrescentado teste de prioridade do sinalizador e teste de proteção de núcleo próximo.
