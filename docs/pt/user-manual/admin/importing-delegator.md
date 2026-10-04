---
sidebar_position: 8
title: Importar do DELEGATOR
description: Criar uma conferência a partir de uma exportação do MUNify DELEGATOR ou do zero
---

# Importar do DELEGATOR

No CHASE, as conferências novas passam todas pelo mesmo assistente, quer esteja a trazer dados do MUNify DELEGATOR (o produto irmão para inscrições), quer esteja a começar do nada. Qualquer pessoa pode preenchê-lo, mas só os administradores globais podem criar a conferência no fim.

## Iniciar o assistente

No iniciador, clique em **Criar Conferência** (ou **Importar do arquivo DELEGATOR**). Pode escolher entre:

- **Carregar arquivo**: uma exportação JSON do DELEGATOR ou um ficheiro JSON guardado anteriormente (**Selecione o arquivo JSON**, ou largue um ficheiro .json na página).
- **Comece do zero**: uma conferência vazia em que todos os Estados-membros da ONU ficam logo disponíveis como possíveis delegações, prontos a atribuir e configurar à mão.

Se não for administrador global, um aviso explica que pode preparar o ficheiro, mas não aplicá-lo.

![O ecrã "Como gostaria de começar?", com as opções Carregar arquivo e Comece do zero](shot:admin/import-start)

## Passos

1. **Qual é o nome da sua conferência?**: título, datas de início e de fim, local. Em **ID da Conferência** pode reaproveitar o ID do DELEGATOR. Caso contrário, deixe o ID gerado.
2. **Comités**: crie os seus comités e adicione os itens da **Agenda** com **Adicionar Item**.
3. **Delegações**: reveja as delegações importadas ou use **Adicionar País** num comité para adicionar delegações com a mesma janela de códigos de país usada no Controlo de Missão.
4. **Outros atores**: atores não estatais e atores da ONU. São opcionais.
5. **Pedidos**: os tipos de pedido que os delegados podem enviar à presidência. Use **Carregar conjunto padrão** ou **Adicionar pedido** e ajuste **Ativado** e **Apenas delegados** para cada tipo. Pode alterar tudo mais tarde no separador [Pedidos](./requests).
6. **Editar**: um resumo de toda a conferência com eventuais avisos, cada um com um botão **Pular** para o passo que precisa de ser corrigido.

![O passo 1 do assistente de importação, que pede o título, as datas e o local da conferência](shot:admin/import-wizard-basics)

![O passo Pedidos do assistente de importação com os tipos de pedido padrão carregados](shot:admin/import-wizard-requests)

Avance pelos passos com **Voltar** e **Próximo** no fundo, ou clique em qualquer passo na barra de passos no topo. **Visualizar JSON** na barra superior mostra os dados de importação em bruto à medida que avança, e **Guardar** descarrega-os como ficheiro JSON. É útil para guardar o progresso ou para depurar uma importação que não está a comportar-se como esperado.

## Verificações antes de concluir

Estes problemas impedem a criação da conferência:

- falta o título da conferência,
- não existe nenhum comité,
- um comité não tem nome ou abreviatura,
- dois comités têm o mesmo nome ou a mesma abreviatura.

Um comité sem delegações só mostra um aviso.

## Concluir

No último passo, **Editar**, os administradores globais clicam em **Criar Conferência**. É levado diretamente para o iniciador, onde a nova conferência já aparece. Qualquer pessoa pode clicar em **Baixar como JSON** para guardar o ficheiro, por exemplo para o entregar a um administrador global que o possa aplicar.
