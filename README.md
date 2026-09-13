# MUNify CHASE

> CHASE stands for _CHAiring SoftwarE_

MUNify CHASE is a software for managing debates of Model United Nations conferences — speakers lists, digital voting, resolution editing, roll-call, and more. It is part of the MUNify Project by the German non-profit [Deutsche Model United Nations (DMUN) e.V.](https://dmun.de).

<p align="center">
  <a href="https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest">
    <img src="https://img.shields.io/badge/⬇%20Download%20Native%20Client-macOS%20%7C%20Windows%20%7C%20Linux-blue?style=for-the-badge" alt="Download Native Client" />
  </a>
  <br/>
  <sub>Opens the latest release page — scroll down to <strong>Assets</strong> to find the installer for your platform.</sub>
</p>

---

> **Need CHASE for your conference but can't self-host?**
>
> We can host and operate CHASE for you. This is especially suited for smaller conferences. Depending on the use case a service fee may apply.
>
> **Reach out at [vorstand@dmun.de](mailto:vorstand@dmun.de)** and we'll figure out what works for you.

---

## Documentation

Full documentation — setup guides, self-hosting, user manual, and FAQs — lives at **[munify.cloud](https://munify.cloud)**.

- [Self-hosting guide](https://munify.cloud/chase/selfhost/getting-started)
- [FAQ](https://munify.cloud/chase/faq)
- [User manual](https://munify.cloud/chase/user-manual/introduction)

## Dependencies

CHASE has no built-in authentication. It requires an OIDC-compliant identity provider. If you don't bring your own, we recommend [pocket-id](https://github.com/pocket-id/pocket-id) (passkey-only) or [Zitadel](https://zitadel.com/) / [Logto](https://logto.io/) for more options.

You will also need a PostgreSQL database.

CHASE works best alongside [MUNify DELEGATOR](https://github.com/DeutscheModelUnitedNations/munify-delegator) for registration and participant management, though it can be used standalone.

## Native Client

CHASE ships a Tauri-based desktop app (macOS `.dmg`, Windows `.exe`, Linux `.deb` / `.AppImage`). Installers are attached to every [GitHub release](https://github.com/DeutscheModelUnitedNations/munify-chase/releases/latest).

The desktop app is built from the `native-client` branch — a server-free fork of `main`. A workflow merges `main` into `native-client` automatically on every commit, strips server-only files, and either pushes directly or opens a PR if there are conflicts. Release builds are triggered by version tags and published to the same release alongside the Docker image.

## Releasing

```bash
npm version patch   # 1.2.3 → 1.2.4
npm version minor   # 1.2.3 → 1.3.0
npm version major   # 1.2.3 → 2.0.0

git push --follow-tags
```

Pre-release tags (`alpha`, `beta`, `rc`) are published as GitHub pre-releases and excluded from the auto-updater.

## Pi display appliance

Headless Raspberry Pi screens can show a live, read-only committee grid for
a conference. A Pi self-registers, shows a pairing QR until an organizer
assigns it under `/app/displays`, then renders live data. See
[`pi-display/README.md`](./pi-display/README.md) for building, pairing, and
operating the appliance.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to get started.

By contributing you agree to release your work under the project's license.

## License

[LICENSE](./LICENSE)

## Support / Donations

Support DMUN e.V. by donating at [dmun.de](https://dmun.de) or contact [vorstand@dmun.de](mailto:vorstand@dmun.de) for details. Donations are tax-deductible in Germany.
