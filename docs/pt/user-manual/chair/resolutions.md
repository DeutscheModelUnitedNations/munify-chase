---
sidebar_position: 8
title: Gerir resoluções
description: Fazer avançar um documento pelo seu ciclo de vida, conduzir votações por cláusula e guardar snapshots
---

# Gerir resoluções

A página **Resoluções** (Alt+5, ou Alt+6 quando os Pedidos estão ativos) lista os documentos do **item da agenda ativo**, ordenados pelo número de patrocinadores, com separadores para filtrar por estado. Não está disponível na demonstração offline.

No topo controla três interruptores para todo o comité: **Submissão de Emendas** e **Patrocínio de Emendas** definem se os delegados podem, de momento, submeter novas emendas ou apoiar as existentes. **Reavaliação de apoio** destina-se à fase em que os delegados podem mudar o seu apoio. Os mesmos interruptores estão atrás do ícone da roda dentada dentro de cada documento.

## Criar um documento

**Criar Documento** inicia um novo documento de trabalho (é preciso haver primeiro um item da agenda ativo). Quando um documento de trabalho é submetido, aparece aqui em **Documentos Submetidos** e pode clicar em **Promover a Projeto de Resolução** para o fazer avançar. A promoção atribui automaticamente um número de documento no formato `ABBR/II/DR.3` (comité, item da agenda, número sequencial), a não ser que defina um com o ícone da caneta ao lado do título enquanto o documento está submetido.

Use o botão da estrela em qualquer documento para o tornar o **projeto de resolução ativo** do comité, ou seja, o que aparece no ecrã de apresentação partilhado. Clique outra vez na estrela para o desmarcar.

![A lista de resoluções da presidência, com os interruptores de fase, os filtros de estado e a ação Promover a Projeto de Resolução](shot:chair/resolutions-list)

## Dentro de um documento

O cabeçalho de um documento dá à presidência estas ferramentas:

- **Submeter**: submete um documento de trabalho em nome dos delegados.
- **Códigos de Partilha**: cria um **Código de edição** ou um **Código de patrocínio** que permite a outras delegações coeditar ou patrocinar um documento de trabalho.
- **Patrocinadores**: mostra quem apoia o documento e permite adicionar um patrocinador com **Adicionar Patrocinador**.
- Ícone da roda dentada: os três interruptores de fase da página da lista.
- **Configurações de IA** (ícone de robô): a sua preferência pessoal de IA, consulte [Assistência de IA](./ai-assistance).
- **Histórico do documento** (ícone de relógio): snapshots, ver abaixo.
- **Definir como Ativo** / **Atualmente Ativo**: a mesma estrela da página da lista.
- **Descarregar PDF** e **Descarregar fonte Typst**.

## Avançar no ciclo de vida

Dentro de um documento, uma barra de etapas mostra: **Documento de Trabalho**, **Documentos Submetidos**, **Projetos de Resolução**, **Fase de Emendas**, **Votação**, **Final**. Clique na etapa seguinte para avançar, ou numa anterior para recuar (é-lhe pedida confirmação para recuar).

![Um projeto de resolução na etapa Votação, com as ações Iniciar votação da cláusula e Iniciar Votação](shot:chair/resolution-voting-phase)

- **Ao entrar na Fase de Emendas**, o CHASE pergunta primeiro se quer abrir automaticamente a submissão de emendas, o patrocínio e a reavaliação de apoio (**Ativar tudo**) ou deixar os interruptores como estão (**Manter configurações atuais**).
- **Ao entrar na Votação**, volta à primeira cláusula operativa, pronta para as votações cláusula a cláusula.
- **Ao entrar em Final**, é pedida confirmação e pode escolher **Finalizar com Confete 🎉** para um momento de celebração no ecrã de apresentação, ou **Finalizar sem Confete** para um encerramento mais discreto.

## Votação cláusula a cláusula

Na etapa Votação, a cláusula atual está destacada. Avance com **Definir como cláusula atual** na cláusula seguinte (escolher uma cláusula fora de ordem pede confirmação primeiro) e depois clique em **Iniciar votação da cláusula** (ou em **Reiniciar votação** se precisar de a repetir). A preparação da votação abre já preenchida com levantamento de mãos, maioria simples e abstenções permitidas, e pode alterá-la antes de começar. O resultado (**Adotada**/**Rejeitada**) fica registado por cláusula. Se uma cláusula for rejeitada, o CHASE pergunta se a quer retirar do documento (**Remover Cláusula**) ou mantê-la (**Manter Cláusula**).

![A janela de preparação da votação da cláusula, já preenchida com um título para a cláusula selecionada](shot:chair/clause-vote-setup)

**Iniciar Votação** lança a votação da resolução no seu conjunto. A preparação abre já preenchida com votação nominal, maioria absoluta e abstenções permitidas, que pode alterar.

## Snapshots

Abra o **Histórico do documento** (ícone de relógio) e clique em **Guardar estado atual** a qualquer momento para criar um ponto de restauro do documento. O CHASE também guarda snapshots automaticamente quando uma emenda é aplicada, quando o documento é submetido ou quando uma votação termina. **Restaurar** pede confirmação primeiro e guarda o estado atual antes de restaurar.

## Próximos passos

- [Rever emendas](./amendments-review): aceitar, rejeitar e conciliar emendas durante a fase de emendas
