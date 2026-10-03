---
sidebar_position: 1
title: Primeiros passos
description: Chegar ao Controlo de Missão, níveis de acesso de administrador e a conferência de demonstração offline
---

# Primeiros passos como administrador

## Dois níveis de "administrador"

O CHASE distingue entre:

- **Administrador da conferência**: a função **Administrador** atribuída numa conferência específica (através de [Utilizadores e funções](./users-roles)). Dá acesso total à configuração dessa conferência.
- **Administrador global**: um administrador ao nível da plataforma. Os administradores globais também podem **criar conferências novas**, **eliminar conferências** e configurar qualquer conferência, e não apenas aquelas a que foram explicitamente adicionados.

Os direitos de administrador global vêm de uma função de administrador no seu fornecedor de login ou de uma lista de emails ou domínios autorizados, ambos definidos por quem aloja a sua instância do CHASE. Se gere o CHASE por conta própria, consulte o [guia de self-hosting](https://munify.cloud/chase/selfhost/getting-started).

## O iniciador

O que vê depois de iniciar sessão depende do seu nível de acesso.

- **Administradores da conferência e membros da equipa** veem um cartão para cada uma das suas conferências. Clique em **Conferência aberta** para ir para o [painel do Controlo de Missão](./mission-control).
- **Administradores globais** veem **Todas as conferências**, agrupadas em **Ativo**, **Por vir** e **Passado**, com uma caixa **Pesquisar conferências…** no topo. Cada linha tem um ícone de roda dentada (**Configurar**) que abre diretamente a Configuração, e um menu **Mais** (…) com **Eliminar**.

![O iniciador do administrador global com todas as conferências agrupadas em Ativo, Por vir e Passado](shot:admin/launcher-global-admin)

### Eliminar uma conferência

Só os administradores globais podem eliminar uma conferência. Abra **Mais** (…) na respetiva linha, escolha **Eliminar** e escreva o nome exato da conferência para confirmar. Esta ação não pode ser desfeita e remove todos os dados dessa conferência.

## Entrar na Configuração

Dentro de uma conferência, o menu na barra superior contém **Controlo de Missão**, **Presença** e **Estatísticas** para administradores e membros da equipa. Os administradores têm também **Configuração**, organizada em separadores:

- **Geral**: definições da conferência (consulte [Configuração da conferência](./conference-setup))
- **Utilizadores**: convidar pessoas e atribuir funções (consulte [Utilizadores e funções](./users-roles))
- **Comités**: criar comités (consulte [Comités e delegações](./committees-delegations))
- **Delegações**: adicionar países e delegações
- **Atores Não Estatais**: configurar ANE e atores da ONU (consulte [Gestão de ANE](./nsa-management))
- **Pedidos**: os tipos de pedido que os delegados e os ANE podem enviar à presidência (consulte [Pedidos](./requests))

:::tip
O botão de ajuda (?) na barra superior abre este manual na página do ecrã em que se encontra.
:::

## Criar uma conferência

As conferências novas são criadas através do mesmo processo de **Importar** usado para trazer dados do MUNify DELEGATOR (consulte [Importar do DELEGATOR](./importing-delegator)). Os administradores globais encontram **Criar Conferência** e **Importar do arquivo DELEGATOR** no fundo do iniciador. Os outros utilizadores também veem **Criar Conferência**. Podem preencher o assistente inteiro, mas só podem descarregar o resultado como ficheiro JSON para que um administrador global o aplique.

![O ecrã "Como gostaria de começar?", com as opções Carregar arquivo e Comece do zero, e uma nota a indicar que só os administradores globais podem criar a conferência diretamente](shot:admin/import-start)

## Conferência de demonstração offline {#offline-demo-conference}

Pode experimentar o CHASE sem conta. Na página inicial do CHASE, clique em **Usar offline** ou **Iniciar Conferência Offline** (ambos marcados como **Beta**). Abre-se uma conferência de demonstração chamada "Local Demo Conference", com comités e delegações de exemplo, diretamente no Controlo de Missão, e aí tem direitos totais de administrador.

- Não é preciso iniciar sessão e nada é enviado para um servidor. Os dados ficam guardados apenas neste navegador.
- As funcionalidades que precisam de servidor ficam ocultas: o separador **Utilizadores**, **Presença**, **Estatísticas** e a votação por dispositivo.
- O modo offline ainda está em beta e pode comportar-se de forma inesperada.

## Próximos passos

- [Controlo de Missão](./mission-control)
- [Configuração da conferência](./conference-setup)
- [Comités e delegações](./committees-delegations)
- [Gestão de ANE](./nsa-management)
- [Pedidos](./requests)
- [Utilizadores e funções](./users-roles)
- [Importar do DELEGATOR](./importing-delegator)
