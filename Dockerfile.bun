FROM oven/bun:1.2-slim AS base

FROM base AS dependencies
WORKDIR /build/dependencies
COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile

FROM base AS runtime-dependencies
WORKDIR /build/dependencies
COPY package.json bun.lock tsconfig.json ./
RUN bun install --frozen-lockfile --production

FROM base AS builder
WORKDIR /build/staging

ARG VERSION
ENV PUBLIC_VERSION=$VERSION
ARG SHA
ENV PUBLIC_SHA=$SHA

COPY --from=dependencies /build/dependencies .
COPY --from=runtime-dependencies /build/dependencies .
COPY . .
# the build command generates a few things, such as i18n outputs
# therefore we need to run the build command BEFORE we check for correctness
RUN bun run build
RUN bun run check

FROM base AS release
WORKDIR /app/release

ARG VERSION
ENV PUBLIC_VERSION=$VERSION
ARG SHA
ENV PUBLIC_SHA=$SHA
COPY --from=builder /build/staging/build .
COPY ./drizzle ./drizzle/
COPY ./drizzle.config.ts .
COPY ./src/api/db/schema.ts ./src/api/db/schema.ts
COPY --from=runtime-dependencies /build/dependencies .

RUN chown -R bun:bun .
USER bun
ENV NODE_ENV=production
EXPOSE 3000/tcp
# TODO
# HEALTHCHECK --interval=15s --timeout=10s --retries=3 CMD curl -f http://0.0.0.0:3000/api/health/ready || exit 1
CMD ["sh", "-c", "bunx drizzle-kit migrate && bun ./index.js"]
