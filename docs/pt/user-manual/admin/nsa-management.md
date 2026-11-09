---
sidebar_position: 5
title: Gestão de ANE
description: Configurar atores não estatais e atores da ONU
---

# Gestão de ANE

O separador **Atores Não Estatais** lista todos os ANE e atores da ONU registados na conferência, com o respetivo ícone e tipo de função.

Para adicionar um, preencha o **Nome**, escolha a **Função** (**Ator Não Estatal** ou **Ator da ONU**) e um **Ícone** para o representar em vez de uma bandeira. Clique no botão do ícone para abrir o seletor, pesquise com palavras-chave em inglês (por exemplo "health" ou "building") e clique num ícone para o escolher. Clique em **Adicionar ONG** para guardar.

As entradas não podem ser editadas. Para alterar uma, remova-a com o ícone do caixote do lixo (pede confirmação) e adicione-a de novo.

![O separador Atores Não Estatais, com o Secretário-Geral e o CICV e os respetivos tipos de função](shot:admin/nsa-tab)

Ao contrário das delegações, os ANE e os atores da ONU não estão ligados a um único comité. Abrangem toda a conferência, já que a mesma pessoa pode mudar de comité ao longo da conferência.

## Pessoas e cartões de ANE {#people-and-attendance-codes}

Para dar acesso a alguém como ANE, adicione essa pessoa em [Utilizadores e funções](./users-roles) com a função **Ator Não Estatal** e associe-a ao ANE. A presidência regista a entrada e a saída em cada sessão de comité em que a pessoa participa (consulte [Chamada e presença](../chair/roll-call-attendance)): através do cartão de ANE impresso, numa conferência vinda do MUNify DELEGATOR também através do crachá digital, ou procurando a pessoa pelo nome.

Os cartões imprimem-se em **Presença**, no separador **Por ANE**. Este lista cada pessoa ANE com o seu comité atual. Use **Cartão QR** para um único cartão, **Imprimir todos os cartões** para o conjunto completo ou **Exportar CSV** para uma lista. Cada cartão tem o nome da pessoa e um código assinado válido até ao dia seguinte ao fim da conferência, por isso defina primeiro a data de fim da conferência. Para imprimir, o servidor precisa de ter `SIGNED_CODE_SECRET` definido.

Se alguém perder o cartão, abra o seu **Cartão QR** e escolha **Novo cartão**. O novo cartão recebe o número seguinte e os leitores recusam os anteriores.

Numa conferência vinda de um MUNify DELEGATOR ligado, é o DELEGATOR que imprime os cartões (na sua página de transferências e no cartão de cada pessoa), e o separador indica-o em vez de oferecer a impressão.

![O separador de presença Por ANE com os botões de Cartão QR e Imprimir todos os cartões](shot:admin/attendance-by-nsa)
