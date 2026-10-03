---
sidebar_position: 4
title: Chamada e presenças
description: Acompanhar as presenças, fazer a chamada e ler os crachás dos ANE
---

# Chamada e presenças

A página **Presença** (Alt+2) é onde acompanha quem está na sala.

![A página Presença da presidência, com a chamada, os seletores por delegação e a leitura de presenças dos ANE](shot:chair/presence-page)

:::live chair/presence

## Chamada

Clique em **Chamada** para abrir um percurso em ecrã inteiro, delegação a delegação:

- **Presente** (`L`) ou **Ausente** (`J`). Qualquer das duas avança automaticamente para a delegação seguinte.
- Use as setas para cima e para baixo se precisar de saltar.
- Ao terminar a última delegação, aparece "Chamada concluída" e o percurso fecha.
- Esc fecha o percurso. Fechar termina a chamada, por isso faça-a de uma só vez.

Se ainda houver uma chamada aberta noutro dispositivo, a página Presença mostra "Chamada em andamento (membro X / Y)" e, em vez disso, um botão **Retomar chamada**.

Todas as chamadas ficam registadas. A lista **N chamada(s) passada(s)** na página Presença mostra quando cada uma começou e terminou, quem a fez e a contagem de presentes face ao total.

## Alternar presenças rapidamente

Cada linha em **Delegações** tem um seletor Presente/Ausente, útil para corrigir uma única entrada sem iniciar uma nova chamada. **Marcar Todos como Presentes** e **Marcar Todos como Ausentes** alteram todas as delegações de uma vez. Os **Atores da ONU** aparecem apenas como referência e não têm seletor.

## Porque é que a presença conta

Marcar alguém como presente não é só uma formalidade. Determina diretamente se essa pessoa se pode inscrever numa lista de oradores ou votar no próprio dispositivo, e alimenta os cálculos de maioria em tempo real mostrados em toda a interface da presidência.

## Leitura dos crachás dos atores não estatais

O cartão **Presença de ANE** lista toda a gente com entrada registada no seu comité, cada pessoa com a indicação "Registado desde HH:MM". Clique em **Ler pessoa ANE** para abrir o painel de leitura:

1. Escolha **Registar entrada** ou **Registar saída**.
2. Leia o crachá QR impresso com a câmara ou, se a leitura falhar, use **Introduzir código manualmente** com o código de 6 caracteres.
3. Um registo mostra as últimas 10 leituras (a verde com o nome em caso de sucesso, a vermelho em caso de erro), com um sinal sonoro (um bip agudo para sucesso, um grave para erro).

Registar a entrada de alguém regista automaticamente a saída dessa pessoa de qualquer outro comité. Registar a saída funciona mesmo que a pessoa tenha entrada registada noutro sítio, e o registo indica então que saiu de outro comité. O cartão dos ANE não está disponível na demonstração offline.

## Painel de presenças da conferência

Uma página **Presença** separada (menu do avatar, fora de qualquer comité) dá uma imagem de toda a conferência, útil tanto para o Secretariado como para a presidência. Tem quatro separadores:

- **Não presente**: ANE sem entrada registada em lado nenhum e delegados ausentes agrupados por comité. Este separador abre primeiro.
- **Por comissão**: contagem de presenças e entradas de ANE em tempo real por comité, assinalando quem tem entrada registada há mais de 4 horas sem saída (provavelmente uma leitura de saída esquecida).
- **Por ANE**: todos os ANE com o seu estado e cartão QR, mais **Imprimir todos os cartões** e **Exportar CSV**.
- **Histórico e correções de ANEs**: o registo completo de presenças dos ANE, com filtros, um botão **Adicionar registo** e um botão de edição por linha para correções.

Os administradores exportam as presenças para o MUNify DELEGATOR com **Baixar para o MUNify Delegator** na página Estatísticas.
