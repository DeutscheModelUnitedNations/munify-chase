---
sidebar_position: 10
title: FAQ
description: Frequently asked questions about MUNify CHASE
---

# Frequently Asked Questions

## Can I use CHASE for my conference outside of DMUN?

Yes. We encourage and allow usage for other conferences. Please see the [license](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/LICENSE) for details.

Note that the project is still under active development and we recommend consulting with us before deploying it for a conference. The app has been tested at several DMUN conferences. If you're interested, reach out via the [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). We're happy to help as long as you use it in line with our non-profit spirit.

CHASE is primarily designed around DMUN's rules of procedure. If you need adaptations for your conference's specific rules, feel free to contact us.

## Can you host CHASE for us?

Yes! If self-hosting is too complex or you don't have the infrastructure, we may be able to run CHASE for you. This is especially practical for smaller conferences.

**Contact us at [vorstand@dmun.de](mailto:vorstand@dmun.de)** and we'll discuss what's possible. Depending on complexity and scope, a service fee may apply.

## Can I help build the project?

Absolutely. See the [contributing guide](https://github.com/DeutscheModelUnitedNations/munify-chase/blob/main/CONTRIBUTING.md) to get started. Bug reports, feature suggestions, documentation improvements, and code contributions are all welcome.

## Can you add a feature?

Post feature suggestions in the [GitHub Discussions](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). If you want to implement it yourself, see the contributing guide.

## Does CHASE work without MUNify DELEGATOR?

Yes, but some setup steps need to be done manually. DELEGATOR provides a structured export of participant and delegation data that CHASE can import directly. Without it, you'll need to configure committees and participants by hand.

## What authentication providers does CHASE support?

Any OIDC-compliant provider. We recommend:

- [pocket-id](https://github.com/pocket-id/pocket-id): passkey-only, simple to self-host
- [Zitadel](https://zitadel.com/): full-featured, cloud or self-hosted
- [Logto](https://logto.io/): developer-friendly, cloud or self-hosted

See the [self-hosting guide](https://munify.cloud/chase/selfhost/getting-started) for configuration details.

## Is there a desktop app?

Yes. CHASE ships a native desktop app for macOS, Windows, and Linux. Download the latest installer from the [GitHub releases page](https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest).

The released desktop app connects to the CHASE server it was built for and keeps working when the connection drops for a moment. If you host CHASE yourself, use the web app in the browser, or build the desktop app with your own server address.

## Can I try CHASE without an account or a server?

Yes. Click **Use it offline** on the CHASE homepage to start a conference that runs entirely in your browser. You don't need an account or your own hosting. Everything is stored only in that browser, and the mode is still in beta. Resolutions, statistics and attendance tracking aren't available offline. See [the offline demo conference](./user-manual/admin/getting-started#offline-demo-conference) for details.

## Which AI providers does CHASE support?

The AI helper for amendments can run in two ways. On the server, CHASE works with any OpenAI-compatible API, which you configure with the `AI_PROVIDERS` setting (model, API key and base URL). Without a server provider, chairs can run a smaller model locally in the browser if their device supports WebGPU. The first run downloads a model of about 500 MB. AI can also be turned off completely.
