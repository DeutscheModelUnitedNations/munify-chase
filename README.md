# MUNify

MUNify is a collection of tools to organize and run a [model united nations](https://en.wikipedia.org/wiki/Model_United_Nations) conference. It aims to simplify aspects like participant management, document organization, commitee sessions (including speakers lists, voting and attendance tracking) and communication at the conference.

![munify](./screenshots/chase_landing_page.png)
*(Landing page of the CHASE software component)*

The project is still under development. It is currently not recommended to use it for a conference. If you are interested in using it, please contact us via the discussion section of this repository.

The project has been initiated by members of [DMUN](https://de.wikipedia.org/wiki/Deutsche_Model_United_Nations).

It is composed of multiple software components which can be found in their separate directories inside this monorepo.

## Components

See the existing components and their directory below

- [CHASE (CHAiring SoftwarE)](./chase) -> A tool to manage the speakers list, voting and attendance tracking in commitees. It also supports messaging and resolution editing/sharing.

### Planned Components

- A participant management system/database
- A renewal of the DMUN conferences Websites ([mun-sh.de](https://mun-sh.de), [munbw.de](https://munbw.de) and [munbb.de](https://mun-bb.de))
- An inventory management system for conference materials

### Internal Tools

- [todo-sync](./todo-sync) -> A tool to sync #todo comments from the code to [this static website](https://deutschemodelunitednations.github.io/munify/)

## Develop Locally

Make sure you have [Docker](https://www.docker.com/get-started/), [bun](https://bun.sh/) and [node](https://nodejs.org/en/download/current) installed

Clone the project

```bash
  git clone https://github.com/DeutscheModelUnitedNations/munify
```

Go to the project directory

```bash
  cd munify
```

Install root dependencies

```bash
  bun i
```

Now go to the component you would like to run and follow the instructions/run the start scripts.
All root level scripts can be found in the [package.json](./package.json) file. Run them with `bun run <nameOfScript>`.

### Development in a Devcontainer
A devcontainer is a containerized development environment. It is a good way to ensure that all developers have the same environment and to avoid the "it works on my machine" problem. A devcontainer is defined in the [.devcontainer](./.devcontainer) directory. To use it, you need to have [Docker](https://www.docker.com/get-started/) and [VSCode](https://code.visualstudio.com/) installed. The Container is preconfigured with all the tools you need to develop the project.

## FAQ

#### Can I use this for my conference outside of DMUN?

Yes. We encourage and allow usage for other conferences as long as it is non commercial. Please see our license for more detailed information on this.

Note that the project is still under development and it is not recommended to use it for a conference at the moment. If you are interested in using it, please contact us via the discussion section of this repository. We are happy to help you with the setup and usage.

Note also that this is primarily a project for DMUN conferences and might not be 100% suitable for your conferences needs and compatable with your rules of procedure.

#### Ok, but how?

You would need to deploy the app yourself, on your own servers and do all the neccessary setups. This can be an owerwhelming task so feel free to contact us when you need help. In some cases it might be possible for us to run the infrastructure and grant you access, please contact us in case you would like to know more about this.

#### Can I help you building the project?

Yes, you can! Please refer to the contributing section below.

#### Can you add a feature?

For feature suggestions, please post in the discussion section of this repository. You can find it [here](https://github.com/DeutscheModelUnitedNations/munify/discussions). If you want to write it yourself, please see the contributing section below.

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

By contributing you agree to release your contributtion under the projects license.

## License

*This aspect is work in progress since the project is currently in its development phase. If you want to use the project or one of its components nonetheless, please contact us via the discussion section.*

[LICENSE](./LICENSE)
