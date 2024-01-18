# Backend
TODO
## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3001/ with your browser to see the result.

## Seeding the database
With the backend running, you can use a prisma script to seed the database with some preset dummy data:

`Optional`: If your dev database does contain any data, you can reset it with:
```bash
bunx prisma db push --force-reset
```

Seed the database with:
```bash
bunx prisma db seed
```