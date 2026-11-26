#!/usr/bin/env bash
# Checks that this checkout's migrations apply to a database the previous release left behind:
# migrates an empty database with that release's migrations, fills it with that release's dev
# seed (dev.yaml: its users, conferences, committees, speakers lists and votes), then runs this
# checkout's migrations over it. A migration that only works on empty tables (a NOT NULL column
# without a default, a new unique index the data breaks, a trigger the rows violate) fails here
# instead of in production.
#
#   bash scripts/migrationUpgrade.sh [base-ref]
#
# base-ref defaults to the newest release tag (v*) below HEAD that does not point at HEAD itself,
# so on a release tag it is the release before. Needs DATABASE_URL (the dev container:
# `bun run dev:docker`). DESTROYS the database at DATABASE_URL: every table, enum, view and the
# migration journal.
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is not set}"

root="$(git rev-parse --show-toplevel)"
cd "$root"

base="${1:-}"
if [ -z "$base" ]; then
	head_tags="$(git tag --points-at HEAD)"
	base="$(git tag --merged HEAD --list 'v*' --sort=-v:refname | grep -vxF -- "${head_tags:-}" | head -n 1 || true)"
fi
if [ -z "$base" ]; then
	echo "No earlier release tag found; fetch the tags (fetch-depth: 0) or pass a base ref." >&2
	exit 1
fi
base_sha="$(git rev-parse --verify "$base^{commit}")"
echo "Upgrading a seeded database from $base ($base_sha) to $(git rev-parse HEAD)"

# drizzle-kit only creates missing tables, and the seed only empties the app's own: start from
# nothing, migration journal (schema drizzle) included.
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q <<'SQL'
DROP SCHEMA IF EXISTS drizzle CASCADE;
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
SQL

worktree="$(mktemp -d)"
cleanup() { git worktree remove --force "$worktree" >/dev/null 2>&1 || rm -rf "$worktree"; }
trap cleanup EXIT
git worktree add --detach "$worktree" "$base_sha" >/dev/null

echo "::group::$base: install, migrate, seed"
(
	cd "$worktree"
	bun install --frozen-lockfile
	bunx svelte-kit sync
	bun run db:migrate
	bun run db:seed:dev
)
echo "::endgroup::"

echo "::group::$(git rev-parse --short HEAD): migrate"
bunx svelte-kit sync
bun run db:migrate
echo "::endgroup::"

# The seed must have reached the tables, or the check proved nothing.
users="$(psql "$DATABASE_URL" -tAq -c 'SELECT count(*) FROM "user"')"
if [ "${users:-0}" -eq 0 ]; then
	echo "The seeded database holds no users after the upgrade." >&2
	exit 1
fi
echo "The migrations since $base apply to its seeded database ($users users)."
