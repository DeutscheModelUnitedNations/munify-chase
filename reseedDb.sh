#!/bin/bash

docker compose -f ./dev.docker-compose.yml down
docker volume rm chase_chase-dev
bun run dev:docker -d
bunx drizzle-kit push --force
bun run db:seed:dev
