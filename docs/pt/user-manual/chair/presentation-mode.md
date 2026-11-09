---
sidebar_position: 11
title: Modo de apresentação
description: O que o ecrã partilhado do projetor mostra e como controlar o seu esquema
---

# Modo de apresentação

O ecrã de apresentação (aberto com **Alt+P** ou com o botão **Abrir Vista de Apresentação** na página Configurar) destina-se ao projetor da sala. Não precisa de mudar manualmente de "vista". Tudo é automático e acompanha o que estiver a acontecer no comité:

- Chamada em curso: a lista de países a deslizar.
- Votação a decorrer: a vista correspondente ao tipo de votação iniciado (levantamento de mãos, nominal ou por dispositivo).
- Projeto de resolução definido como ativo: todo o ecrã muda para o esquema de resolução, com o estado, o item da agenda, as maiorias, as duas listas de oradores e a pré-visualização do documento. Na Fase de Emendas e na Votação destaca a cláusula atual e, na Fase de Emendas, mostra também a emenda que está a apresentar.
- Caso contrário: o esquema que escolheu, com o estado, as maiorias, o quadro branco e as duas listas de oradores, além (se ativado) da divisão por grupos regionais.
- Resolução finalizada com confete: uma animação de celebração.

![O ecrã de apresentação no esquema padrão, com o estado, as maiorias, o quadro branco e as listas de oradores](shot:chair/presentation-default)

:::live chair/presentation

Em resumo: tudo o que faz no resto da interface da presidência (iniciar uma votação, apresentar uma emenda, editar o quadro branco) é o que controla este ecrã. Não há nada para escolher no próprio ecrã de apresentação.

## Pedidos pendentes

Com os [pedidos](./requests) ativados, aparece um bloco **Pedidos** assim que houver algo pendente. Mostra cada pedido com o ícone, a bandeira e o nome da delegação ou do ANE e o tipo de pedido, pela mesma ordem da sua fila. Um selo indica quantos estão pendentes. Se não couberem todos, uma linha "+N mais" resume os restantes.

O bloco ocupa espaço de outros blocos:

- **Esquema de apresentação Padrão**: partilha a coluna do quadro branco, que fica mais pequeno.
- **Esquema de apresentação para Telas Pequenas**: a lista de comentários fica mais pequena e o quadro branco desce.
- Esquema de resolução: a lista de comentários fica mais pequena.

Quando a fila fica vazia, o bloco desaparece e o esquema volta ao normal. Desligue-o por comité com **Mostrar pedidos** na página Configurar. Os administradores podem manter tipos de pedido individuais fora do ecrã, por exemplo necessidades pessoais, desligando **Na apresentação** nos [tipos de pedido](../admin/requests).

## Esquema e tamanhos

Em [Configuração do comité](./committee-setup), pode controlar:

- **Esquema**: **Esquema de apresentação Padrão** ou **Esquema de apresentação para Telas Pequenas**, para diferentes ecrãs de sala. O esquema para ecrãs pequenos omite o título do comité e o item da agenda. Enquanto houver um projeto de resolução ativo, é usado o esquema de resolução, independentemente desta escolha.
- Tamanho de letra base e tamanho de letra da resolução: dois controlos deslizantes independentes, já que o texto da resolução muitas vezes precisa de um tamanho diferente do resto.
- **Mostrar Grupos Regionais**: define se a divisão por grupos regionais aparece.
- **Mostrar pedidos**: define se os pedidos pendentes têm um bloco próprio. Só aparece quando os pedidos estão ativados.
