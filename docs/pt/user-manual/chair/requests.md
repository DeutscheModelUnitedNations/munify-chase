---
sidebar_position: 7
title: Pedidos
description: Receber e resolver pontos e moções enviados por delegados e ANE
---

# Pedidos

Com os pedidos ativados, os delegados e os atores não estatais enviam pontos e moções (por exemplo um Direito à Informação ou uma Votação Nominal) à presidência a partir do próprio dispositivo. Trata-os na página **Pedidos**, onde também pode adicionar pedidos.

![A página Pedidos da presidência, com a lista de pedidos pendentes e os botões Resolver e Retirar pedido](shot:chair/requests-page)

## Ativar os pedidos

Na página [Configurar](./committee-setup), coloque o cartão **Pedidos** em **Ligado**. Por defeito está desligado e não está disponível na demonstração offline.

Depois de ativado, aparece um separador **Pedidos** (ícone de mão) na barra logo a seguir a **Votação**. Fica com o atalho Alt+5 e **Resoluções** passa para Alt+6.

Se o voltar a desligar, o separador desaparece, os delegados perdem o cartão **Pedidos** e os novos pedidos são recusados. Resolva primeiro os pedidos em aberto, porque os delegados deixam de os poder retirar quando o cartão desaparece.

## Que pedidos existem

A lista de tipos de pedido é a mesma para toda a conferência e é gerida pelos administradores em **Configuração**, separador **Pedidos**. Consulte [Tipos de pedido](../admin/requests). A presidência não a pode alterar.

- **Carregar conjunto padrão** adiciona os 15 pedidos padrão da DMUN. Direito à Informação, Direito à Restauração da Ordem, Direito ao Esclarecimento de um Mal-entendido, Votação Nominal e Sessão Informal estão abertos a todos. As restantes moções processuais estão marcadas como **Apenas delegados**.
- Os ANE nunca veem os tipos de pedido marcados como **Apenas delegados**.
- A ordem que os administradores dão aos tipos é a ordem pela qual os pedidos aparecem na sua página e no ecrã de apresentação.

## Receber notificações

Cada novo pedido mostra um aviso **Novo pedido** com o nome do pedido, quem o enviou e uma ligação **Ver pedidos**. O aviso fica até o fechar e fecha-se sozinho assim que o pedido é resolvido ou retirado, por si ou por outro membro da presidência. Os pedidos que já estavam à espera quando abriu o comité não geram aviso.

Enquanto houver algo pendente, o ícone Pedidos na barra mostra um ponto vermelho intermitente.

![Um aviso Novo pedido na interface da presidência, com uma ligação Ver pedidos](shot:chair/request-toast)

## Adicionar pedidos

Nem toda a gente usa o dispositivo. Quando alguém levanta a placa na sala, coloque o pedido na fila com o cartão **Adicionar pedido**, por cima da fila.

O cartão mostra duas listas lado a lado: à esquerda todas as delegações e ANE, à direita todos os tipos de pedido na ordem definida pelos administradores. Pode percorrê-las ou filtrá-las com o campo de pesquisa por cima de cada lista.

1. Clique na delegação ou no ANE.
2. Clique no tipo de pedido.
3. Clique em **Adicionar pedido**. O botão fica desativado até ambos estarem escolhidos.

Pelo teclado: Alt+R (ou **Adicionar pedido** na paleta de comandos) salta para a pesquisa de delegações. Escreva algumas letras e prima Enter para escolher o melhor resultado, faça o mesmo para o tipo de pedido e prima Enter outra vez para o adicionar.

Os tipos que esse lugar já tem pendentes, incluindo os que a própria delegação enviou, ficam marcados como "Já pendente" e não podem ser adicionados de novo. Os ANE não recebem tipos **Apenas delegados**. Funciona para qualquer lugar do comité, também para delegações sem conta ou sem sessão iniciada.

## Tratar a fila

Cada pedido pendente mostra o ícone e o nome, a bandeira e o nome da delegação ou do ANE (com o nome da própria pessoa entre parênteses, se for diferente) e a hora de envio. Os pedidos adicionados por si ou por outro membro da presidência têm um pequeno ícone de caneta junto ao nome ("Adicionado pela mesa"). A lista é ordenada por tipo de pedido, na ordem definida pelos administradores, e depois do mais antigo para o mais recente.

- **Resolver** marca o pedido como tratado.
- **Retirar pedido** descarta-o, por exemplo quando o ponto já não é relevante.

As duas ações funcionam da mesma forma para os pedidos enviados por uma delegação e para os adicionados pela presidência, e são atualizadas em tempo real para toda a presidência e para quem enviou o pedido. Se ainda não chegou nada, a página mostra "Sem pedidos pendentes."

## Histórico

A lista **N pedido(s) recente(s)** por baixo da fila mostra os últimos 20 pedidos resolvidos ou retirados, cada um com o selo **Resolvido** ou **Retirado** e a hora.

## O que os delegados veem

Os delegados e os ANE têm um cartão **Pedidos** na página do comité, com um botão **Fazer um pedido**, uma lista pesquisável de tipos de pedido e os seus próprios pedidos pendentes, cada um com um botão para o retirar. Cada pessoa pode ter um pedido pendente por tipo de cada vez. Os delegados só podem enviar pedidos ao próprio comité, os ANE a qualquer comité da conferência. Os espectadores não podem enviar pedidos. Um pedido adicionado pela presidência não aparece no cartão da própria delegação.

Os pedidos pendentes aparecem também num bloco próprio no ecrã de apresentação, a menos que desligue **Mostrar pedidos** na página [Configurar](./committee-setup). Consulte [Modo de apresentação](./presentation-mode).

Consulte [Pedidos para participantes](../participant/requests) para ver o lado deles.
