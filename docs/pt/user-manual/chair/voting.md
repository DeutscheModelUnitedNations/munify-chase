---
sidebar_position: 6
title: Conduzir votações
description: Preparar e conduzir votações por levantamento de mãos, nominais e por dispositivo
---

# Conduzir votações

A página **Votação** (Alt+4) é onde prepara e conduz qualquer votação. Também pode premir **Alt+V** em qualquer página da presidência para abrir a mesma preparação. Se já houver uma votação ativa (talvez iniciada noutro dispositivo), vê o aviso "Votação em curso" com o botão **Retomar votação**, que a reabre com as definições originais.

## Preparar uma votação

1. **Tipo de Votação**: escolha **Votação por Levantamento de Mãos**, **Votação Nominal** ou **Votação por Dispositivo** (não disponível na demonstração offline).
2. **Configurações de Maioria**: **Simples**, **Absoluta** ou **Dois terços**, e ainda **Sem Abstenções** ou **Com Abstenções**.
3. Apenas para a votação por dispositivo: defina a **Janela de Votação (segundos)** (de 5 a 300, por defeito 20), ou seja, quanto tempo os delegados têm para votar no próprio dispositivo.
4. **Título da Votação**: escolha uma opção predefinida ou escreva o seu. É mostrado a todos e, se ficar em branco, assume "Votação".
5. Clique em **Iniciar Votação**.

![O formulário de preparação da votação, com o tipo de votação, as definições de maioria e o título da votação](shot:chair/voting-setup)

:::live chair/voting

## Levantamento de mãos

Percorre as etapas **A Favor**, **Contra**, **Abstenção** (se permitida) e a avaliação. Em cada etapa, conte os cartões levantados:

- Espaço ou ↑ acrescenta um, ↓ retira um. Também pode escrever o número no campo.
- Enter ou **Seguinte** passa à etapa seguinte. Na última contagem o botão passa a **Publicar** e depois a **Fechar** quando tiver visto o resultado.
- Backspace ou **Anterior** volta à etapa anterior.
- Esc cancela a votação sem resultado.

Uma barra de progresso compara a sua contagem com o número de delegações presentes e avisa se contou mais votos do que pessoas, ou confirma que os números batem certo.

![Uma votação por levantamento de mãos em curso, com a contagem dos votos A Favor e Contra](shot:chair/voting-show-of-hands)

## Votação nominal

O mesmo percurso delegação a delegação da chamada de presenças, mas a registar votos: **Contra** (`J`), **Abstenção** (`K`, se permitida), **A Favor** (`L`). Só são chamadas as delegações marcadas como presentes. Cada escolha avança automaticamente para a delegação seguinte. Um gráfico de resultados é atualizado em tempo real e, depois da última delegação, chega à avaliação com o botão **Fechar**. Premir Esc antes do fim cancela a votação.

## Votação por dispositivo

Aqui não regista nada. Os delegados votam no próprio dispositivo, onde a votação aparece automaticamente. Só as delegações marcadas como presentes podem votar. O seu ecrã mostra uma contagem decrescente em tempo real, a lista de quem ainda não votou e, quando a contagem termina, o resultado com o botão **Fechar**. Não é possível terminar a contagem mais cedo para ver os resultados. Fechar a janela antes do fim da contagem cancela a votação.

## Ler os resultados

O resultado (**Adotada** / **Rejeitada**) é determinado automaticamente com base na maioria escolhida:

- **Levantamento de mãos**: a maioria é calculada a partir dos votos que contou. **Simples** e **Dois terços** usam A Favor mais Contra. **Absoluta** conta também as abstenções.
- **Nominal e por dispositivo**: a maioria é calculada a partir das delegações marcadas como presentes. **Simples** deixa de fora as abstenções. **Absoluta** e **Dois terços** usam as maiorias do comité baseadas nas presenças, mostradas no cartão **Maiorias**.
