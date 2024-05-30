FROM oven/bun AS install
COPY package.json bun.lockb /temp/dependencies/
RUN cd /temp/dependencies && bun install --frozen-lockfile
FROM oven/bun AS install-prisma-only
COPY package.json bun.lockb /temp/dependencies/
COPY package.json /temp/dependencies/package.json
RUN cd /temp/dependencies && bun install prisma --frozen-lockfile

FROM install as prisma-builder
WORKDIR /temp/prisma
COPY prisma ./prisma/
COPY /temp/dependencies/node_modules ./node_modules/
# we need to use node and bun for generating prisma files, see https://github.com/prisma/prisma/issues/21241
RUN curl -fsSL https://nodejs.org/dist/v20.14.0/node-v20.14.0-linux-x64.tar.xz | tar -xJv -C /usr/local --strip-components=1
RUN bunx prisma generate --schema=./prisma/schema.prisma

FROM prisma-builder AS builder
WORKDIR /app/staging
ARG NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_VERSION=${NEXT_PUBLIC_VERSION}
COPY . ./
COPY /temp/dependencies/node_modules ./node_modules/
COPY /temp/prisma/prisma ./prisma/
RUN bun next telemetry disable
RUN bun run build
COPY ./public ./.next/standalone/public/
COPY ./.next/static ./.next/standalone/.next/static/

FROM oven/bun AS release
WORKDIR /app/prod
COPY --from=builder /app/staging/.next/standalone ./
COPY --from=prisma-builder /temp/prisma/prisma/migrations ./prisma/migrations/
COPY --from=prisma-builder /temp/prisma/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=install-prisma-only /temp/dependencies/node_modules ./node_modules/
ENV NODE_ENV=production
ENV PORT=3000
USER bun
EXPOSE 3000/tcp
CMD [ "bunx", "prisma", "migrate", "deploy", "&&", "bun", "main.js" ]