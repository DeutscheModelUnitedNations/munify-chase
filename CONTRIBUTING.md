# Contributing to MUNify CHASE

Contributions of all kinds are welcome — bug reports, feature suggestions, code, documentation, and testing. Thank you for your interest!

In all contributions, please follow the [code of conduct](./CODE_OF_CONDUCT.md) and be aware that your contribution will be published under the [project's license](./LICENSE).

## Getting Started

Make sure you have [Docker](https://www.docker.com/get-started/), [Bun](https://bun.sh/), and [Node.js](https://nodejs.org/en/download/current) installed.

```bash
git clone https://github.com/DeutscheModelUnitedNations/munify-chase
cd munify-chase
bun i
cp .env.example .env
bun run dev        # starts dev server + Docker containers (postgres + mock OIDC)
```

The dev server runs at `http://localhost:5173`. The mock OIDC server runs at `http://localhost:8080`.

### Key development commands

| Command               | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| `bun run dev`         | Full stack: dev server + Docker containers      |
| `bun run dev:server`  | Dev server only (requires running containers)   |
| `bun run dev:docker`  | Docker containers only                          |
| `bun run check`       | Svelte type check                               |
| `bun run typecheck`   | TypeScript check                                |
| `bun run lint`        | ESLint                                          |
| `bun run format`      | Prettier auto-format                            |
| `bun run test`        | Vitest                                          |
| `bun run db:seed:dev` | Seed database with test data                    |
| `bun run db:nuke`     | Full reset: tear down volume, recreate, migrate |

See [package.json](./package.json) for the full list.

### GraphQL client regeneration

The urql client (`src/lib/api/rumbleClient/`) is generated at runtime. After schema changes, start the dev server and request `/api/graphql` — Rumble writes the updated files automatically. Do not edit these files manually.

## Working with Issues

Before starting implementation, explain your suggested approach in the issue discussion. Issues marked **good first issue** are a good entry point for newcomers.

## Branches and Pull Requests

Create a branch from the relevant issue (GitHub supports this directly). Develop on that branch and open a pull request against `main`.

Branch naming:

- `feature/short-description`
- `fix/short-description`
- `docs/short-description`

### PR requirements

The `PR Lint` CI job will fail unless both conditions are met:

**Label** — add at least one `PR:` label:
`PR: Feature`, `PR: Enhancement`, `PR: Bug`, `PR: Performance`, `PR: Refactor`, `PR: Infrastructure`, `PR: Tests`, `documentation`, `dependencies`

**Title** — conventional commit format:

```
type: description
type (scope): description
```

Allowed types: `feat`, `fix`, `style`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`, `deps`

Example: `feat (Frontend): add yield to questions functionality`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix      | When to use                           |
| ----------- | ------------------------------------- |
| `feat:`     | New feature                           |
| `fix:`      | Bug fix                               |
| `style:`    | Stylistic / UI changes                |
| `refactor:` | Refactor without behavior change      |
| `perf:`     | Performance improvement               |
| `docs:`     | Documentation                         |
| `test:`     | Tests                                 |
| `chore:`    | Housekeeping / maintenance            |
| `build:`    | Build system or dependency changes    |
| `ci:`       | CI configuration                      |
| `wip:`      | Work in progress (avoid in final PRs) |

Write commit messages that explain the _why_, not just the what. Code review takes time — clearly structured, well-explained commits make it faster.

## Code Style

- TypeScript for all new code; strict mode enabled
- Svelte 5 runes (not stores) for components
- Tailwind CSS v4 + DaisyUI for styling
- `snake_case` for database columns (Drizzle convention)
- `nanoid` (30 chars, no lookalike chars) for IDs — see `src/lib/helpers/nanoid.ts`
- Run `bun run format` before committing

## Native Client

The Tauri desktop app lives on the `native-client` branch — a server-free fork of `main`. A CI workflow keeps it in sync automatically. You generally don't need to touch this branch; just work on `main`. See the [native client docs](https://munify.cloud/docs/chase/developer/native-client) for the full sync/build process.

## Getting Help

- **GitHub Issues** — bugs and features
- **GitHub Discussions** — questions and ideas
- **Email** — [vorstand@dmun.de](mailto:vorstand@dmun.de) for private matters
