# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MUNify CHASE (CHAiring SoftwarE) is a conference management application for Model United Nations debates. Built by Deutsche Model United Nations (DMUN) e.V., it provides speakers lists, digital voting, resolution editing, committee status tracking, and roll-call management.

**Tech Stack**: SvelteKit + TypeScript, PostgreSQL + Drizzle ORM, GraphQL (Yoga + Houdini), Tailwind CSS + DaisyUI, Paraglide i18n

**GraphQL Generation**: Uses [Rumble](https://github.com/m1212e/rumble) (`@m1212e/rumble`), a custom glue package that generates GraphQL schemas and resolvers directly from Drizzle ORM definitions with built-in ability-based access control.

## Common Commands

```bash
# Development
bun run dev              # Start dev server + Docker containers (database, mock OIDC)
bun run dev:server       # Dev server only (requires running containers)
bun run dev:docker       # Docker containers only (add -d for detached)

# Code Quality
bun run lint             # Prettier check + ESLint
bun run format           # Auto-format with Prettier
bun run check            # Svelte type checking
bun run typecheck        # TypeScript type checking

# Database
bun run db:push          # Push schema changes to database
bun run db:migrate       # Run migrations
bun run db:seed:dev      # Seed test data
bun run db:studio        # Open Drizzle Studio GUI
bun run db:reset         # Reset database

# Build
bun run build            # Production build
bun run preview          # Preview production build
```

## Architecture

### API Layer (`src/api/`)

- **`db/schema.ts`**: Drizzle table definitions (source of truth for database)
- **`db/relations.ts`**: Table relationships for Drizzle queries
- **`handlers/*.ts`**: GraphQL resolvers using Rumble DSL with ability-based access control
- **`context.ts`**: Request context with auth and permissions
- **`services/`**: Business logic (OIDC integration, email validation)

**Handler pattern**: Each handler file defines GraphQL types, access control rules, queries, mutations, and subscriptions for an entity using the Rumble DSL.

### Frontend (`src/lib/`)

- **`components/`**: Svelte 5 components using runes (not stores)
- **`state/`**: Client-side state (theme, server time sync)
- **`data/`**: Static data (country names, flags)
- **`paraglide/`**: Auto-generated i18n code (do not edit)

### Routes (`src/routes/`)

- **`(pages)/`**: Public landing pages
- **`app/[conferenceId]/`**: Protected conference routes (require auth)
- **`api/graphql/`**: GraphQL endpoint

### Key Generated Files (do not edit manually)

- `schema.graphql` - Generated GraphQL schema
- `src/lib/paraglide/` - Generated i18n code
- `.houdini/` - Generated GraphQL client code
- `drizzle/` - Generated database migrations

## Conventions

- **IDs**: nanoid with 30 characters, no lookalike chars (see `src/lib/helpers/nanoid.ts`)
- **Database columns**: snake_case (configured in Drizzle)
- **i18n**: Messages in `messages/de.json`, `messages/en.json`, and `messages/pt.json`, auto-translated via `bun run machine-translate`
- **Styling**: Tailwind CSS with DaisyUI components, DMUN corporate identity package

## Authentication

OIDC-only authentication (no built-in auth). Local development uses mock OIDC server. Configure via:

- `PUBLIC_OIDC_AUTHORITY`: OIDC provider URL
- `PUBLIC_OIDC_CLIENT_ID`: Application client ID
- `ADMIN_EMAIL_WHITELIST` / `ADMIN_DOMAIN_WHITELIST`: Admin access control

## Development Setup

Requirements: Docker, Bun, Node.js

```bash
bun i                    # Install dependencies
cp .env.example .env     # Configure environment
bun run dev              # Start everything
```

Database: `localhost:5432` (postgres/postgres)
Mock OIDC: `localhost:8080`
