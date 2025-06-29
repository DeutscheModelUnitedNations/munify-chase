# MUNify CHASE

> CHASE stands for _CHAiring SoftwarE_

MUNify CHASE is a Software to managing Debates of Model United Nations Conferences with tools like speakers lists, digital voting and resolution editing. It is part of the MUNify Project, which aims to provide a comprehensive Software Suite for Model United Nations Conferences. MUNify is an Open Source Project by the german non-profit organization [Deutsche Model United Nations (DMUN) e.V.](https://dmun.de).

The project is still under development. If you are interested in using it, please contact us via the discussion section of this repository.

We are happy to recieve feedback, contributions and donations. Please see below for more information.

## Dependencies

CHASE has no built-in authentication system. It is designed to be used alongside a OIDC compliant auth system. If you don't bring your own, we recommend using [pocket-id](https://github.com/pocket-id/pocket-id) if a passkey-only solution is sufficient for you. Otherwise, we would recommend setting up a [Zitadel](https://zitadel.com/) or [Logto](https://logto.io/) instance.

You will also need a PostgreSQL database to store the data.

Lastly, it is worth mentioning that CHASE is designed to go hand in hand with [MUNify DELEGATOR](https://github.com/DeutscheModelUnitedNations/munify-delegator), which is the MUNify App for Registration and Participant Management. It is not required to use the DELEGATOR, but some manual steps are required to set up CHASE without the export files from the DELEGATOR.

## Develop locally

Make sure you have [Docker](https://www.docker.com/get-started/), [bun](https://bun.sh/) and [node](https://nodejs.org/en/download/current) installed

Clone the project

```bash
  git clone https://github.com/DeutscheModelUnitedNations/munify-chase
```

Go to the project directory

```bash
  cd munify-chase
```

Install root dependencies

```bash
  bun i
```

All scripts can be found in the [package.json](./package.json) file. Most important scripts are:

- `bun run dev`: Starts the development server and docker containers with hot reloading.
- `bun run dev:server`: Starts the development server with hot reloading.
- `bun run dev:docker`: Starts the docker containers (database, mockOIDC server, etc.). Add `-d` to run it in detached mode (i.e. in the background).

## FAQ

#### Can I use this for my conference outside of DMUN?

Yes. We encourage and allow usage for other conferences. Please see our license for more detailed information on this.

Note that the project is still under development and it is not recommended to use it without our consultation for a conference at the moment. The current state of the of the App is tested on a few DMUN conferences. If you are interested in using it, please contact us via the discussion section of this repository. We are happy to help you with the setup and usage, as long as you use it for your own conferences in line with our non-profit spirit.

Note also that this is primarily a project for DMUN conferences and might not be 100% suitable for your conferences needs and compatable with your rules of procedure. If you want guidlines on how to adapt the Code to your needs, please contact us via the discussion section of this repository. We are also happy to help.

#### Ok, but how?

You would need to deploy the app yourself, on your own servers and do all the neccessary setups. This can be an owerwhelming task so feel free to contact us when you need help. In some cases it might be possible for us to run the infrastructure and grant you access. This is especially true if your conference is not very big. Please contact us in case you would like to know more about this. Depending on the use case and complexity, we might need to charge a service fee.

#### Can I help you building the project?

Yes, you can! Please refer to the contributing section below.

#### Can you add a feature?

For feature suggestions, please post in the discussion section of this repository. You can find it [here](https://github.com/DeutscheModelUnitedNations/munify-chase/discussions). If you want to write it yourself, please see the contributing section below.

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

By contributing you agree to release your contributtion under the projects license.

## License

_This aspect is work in progress since the project is currently in its development phase. If you want to use the project or one of its components nonetheless, please contact us via the discussion section._

[LICENSE](./LICENSE)

## Support us / Donations

You can support our work by donating to our non-profit organization [Deutsche Model United Nations (DMUN) e.V.](https://dmun.de).
Please contact our board for details on how to donate by sending an email to [vorstand@dmun.de](mailto:vorstand@dmun.de).

All donations are tax deductible in Germany and we are happy to provide you with a donation receipt. The money will be used to support our development of MUNify if you don't specify a different purpose.
