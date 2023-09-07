# Backend
TODO
## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3001/ with your browser to see the result.

## Authentication
For development purposes you can modify the permissions in [src/plugins/auth.ts](./src/plugins/auth.ts) to your needs. They are disabled in prod, where ZITADEL (see the [auth](/auth) component) is used.