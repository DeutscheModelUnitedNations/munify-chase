---
sidebar_position: 10
title: Perguntas frequentes
description: Perguntas frequentes sobre o MUNify CHASE
---

# Perguntas frequentes

## Posso usar o CHASE na minha conferência fora da DMUN?

Sim. Incentivamos e permitimos a utilização noutras conferências. Consulte a [licença](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/LICENSE) para mais detalhes.

O projeto ainda está em desenvolvimento ativo e recomendamos que fale connosco antes de o usar numa conferência. A aplicação já foi testada em várias conferências da DMUN. Se tiver interesse, contacte-nos através das [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). Teremos todo o gosto em ajudar, desde que a utilização respeite o nosso espírito sem fins lucrativos.

O CHASE foi concebido sobretudo em torno do regulamento da DMUN. Se precisar de adaptações às regras específicas da sua conferência, não hesite em contactar-nos.

## Podem alojar o CHASE por nós?

Sim! Se o alojamento próprio for demasiado complexo ou se não tiver a infraestrutura necessária, poderemos executar o CHASE por si. Isto é especialmente prático para conferências mais pequenas.

**Contacte-nos em [vorstand@dmun.de](mailto:vorstand@dmun.de)** e vemos juntos o que é possível. Consoante a complexidade e o âmbito, pode ser cobrada uma taxa de serviço.

## Posso ajudar a desenvolver o projeto?

Claro que sim. Consulte o [guia de contribuição](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/CONTRIBUTING.md) para começar. Relatórios de erros, sugestões de funcionalidades, melhorias na documentação e contribuições de código são todos bem-vindos.

## Podem adicionar uma funcionalidade?

Publique as suas sugestões nas [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). Se quiser implementá-la, consulte o guia de contribuição.

## O CHASE funciona sem o MUNify DELEGATOR?

Sim, mas alguns passos de configuração têm de ser feitos manualmente. O DELEGATOR fornece uma exportação estruturada dos dados de participantes e delegações que o CHASE pode importar diretamente. Sem ele, terá de configurar os comités e os participantes à mão.

## Que fornecedores de autenticação são suportados pelo CHASE?

Qualquer fornecedor compatível com OIDC. Recomendamos:

- [pocket-id](https://github.com/pocket-id/pocket-id): apenas passkeys, fácil de alojar
- [Zitadel](https://zitadel.com/): completo, na nuvem ou alojado por si
- [Logto](https://logto.io/): pensado para programadores, na nuvem ou alojado por si

Consulte o [guia de alojamento próprio](https://munify.cloud/chase/selfhost/getting-started) para os detalhes de configuração.

## Existe uma aplicação para computador?

Sim. O CHASE tem uma aplicação nativa para macOS, Windows e Linux. Descarregue o instalador mais recente na [secção de transferências da página inicial](/#download). Ela sugere o ficheiro certo para o seu sistema, e todos os instaladores estão também na [página de releases do GitHub](https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest).

A aplicação publicada liga-se ao servidor CHASE para o qual foi compilada e continua a funcionar quando a ligação cai por momentos. Se alojar o CHASE por si, use a aplicação web no navegador ou compile a aplicação para computador com o endereço do seu próprio servidor.

## Posso experimentar o CHASE sem conta nem servidor?

Sim. Clique em **Usar offline** na página inicial do CHASE para iniciar uma conferência que corre inteiramente no seu navegador. Não precisa de conta nem de alojamento próprio. Tudo fica guardado apenas nesse navegador, e este modo ainda está em beta. As resoluções, as estatísticas e o registo de presenças não estão disponíveis offline. Consulte [a conferência de demonstração offline](./user-manual/admin/getting-started#offline-demo-conference) para mais detalhes.

## Que fornecedores de IA são suportados pelo CHASE?

O assistente de IA para emendas pode funcionar de duas formas. No servidor, o CHASE funciona com qualquer API compatível com a OpenAI, configurada com a definição `AI_PROVIDERS` (modelo, chave de API e URL base). Sem um fornecedor no servidor, a presidência pode correr um modelo mais pequeno localmente no navegador, se o dispositivo suportar WebGPU. Na primeira utilização é descarregado um modelo de cerca de 500 MB. A IA também pode ser desligada por completo.
