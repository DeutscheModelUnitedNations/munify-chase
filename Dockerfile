FROM oven/bun:1-slim AS base

FROM base AS dependencies
WORKDIR /build/dependencies
COPY package.json bun.lock tsconfig.json ./
# the patches `patchedDependencies` in package.json names; bun refuses to install without them
COPY patches ./patches
RUN bun install --frozen-lockfile

FROM base AS runtime-dependencies
WORKDIR /build/dependencies
COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile --production

FROM base AS builder
WORKDIR /build/staging

ARG VERSION
ENV PUBLIC_VERSION=$VERSION
ARG SHA
ENV PUBLIC_SHA=$SHA

COPY --from=dependencies /build/dependencies .
COPY . .
RUN bun run build

FROM node:lts-slim AS release
WORKDIR /app/release

# Security fixes Debian released after the base image was built, and no npm: the server runs on
# plain `node`, and Trivy flags what npm bundles (undici, tar, ...), which no override reaches.
RUN apt-get update \
	&& apt-get upgrade -y --no-install-recommends \
	&& apt-get clean \
	&& rm -rf /var/lib/apt/lists/* \
		/usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
		/usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack

ARG VERSION
ENV PUBLIC_VERSION=$VERSION
ARG SHA
ENV PUBLIC_SHA=$SHA
COPY --from=builder /build/staging/build .
COPY ./drizzle ./drizzle/
COPY ./drizzle.config.ts .
COPY ./src/api/db/schema.ts ./src/api/db/schema.ts
COPY --from=runtime-dependencies /build/dependencies .
COPY ./src/server.js ./server.js

RUN chown -R node:node .
USER node
ENV NODE_ENV=production
EXPOSE 3000/tcp
# TODO
# HEALTHCHECK --interval=15s --timeout=10s --retries=3 CMD curl -f http://0.0.0.0:3000/api/health/ready || exit 1
CMD ["sh", "-c", "./node_modules/.bin/drizzle-kit migrate && node ./server.js"]
