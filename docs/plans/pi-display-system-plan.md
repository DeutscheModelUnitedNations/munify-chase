# Pi Display System — Implementation Plan

## Goal

Headless Raspberry Pi appliances that boot straight into a full-screen,
read-only CHASE committee grid (the existing `CommitteeGrid` /
mission-control view) for the conference/committee they are assigned to.
Zero on-device input: a Pi self-registers, shows a pairing QR until an
organizer assigns it in CHASE, then renders live data and reacts to
re-assignment or revocation without a reboot.

## Decisions locked in (from clarification rounds)

1. **Device identity**: the Pi generates its own id (nanoid, 30 chars,
   `src/lib/helpers/nanoid.ts` convention) on first boot and persists it
   alongside the refresh token.
2. **Auth model**: a single shared OIDC "display" account (role
   `service_user`, already in `oidcRoles`). Per-device scoping is **not**
   from the OIDC identity (shared) but from the device id the kiosk
   presents, validated against its `displayDevice` row.
3. **Session bridge**: a NixOS systemd helper on the Pi runs the OAuth 2.0
   Device Authorization Grant + refresh loop, then calls a new CHASE
   endpoint that exchanges a valid display token into the **standard
   `@m1212e/sveltekit-oidc` session cookie**. Chromium then loads `/kiosk`
   through the **normal** auth path — `src/api/context.ts` and Rumble
   abilities stay unchanged. **No synthetic context.**
4. **Live data**: kiosk uses the same `client.liveQuery.conference({...})`
   shape as mission-control. A second liveQuery on the device's own
   `displayDevice` row drives assignment/revocation; on `conferenceId`
   change the kiosk re-subscribes — no reboot.
5. **Revocation**: per-device boolean flag on the `displayDevice` row.
6. **Pairing**: unassigned/revoked devices render an on-screen QR + the
   device id linking to the assignment row in CHASE.
7. **Pi secret storage**: refresh token + device id in a root-only file
   under `/var/lib/chase-kiosk`. No at-rest encryption (no TPM on Pi 4);
   documented physical-access risk, mitigated by per-device revoke +
   shared-account rotation.
8. **NixOS image**: one generic image. A guided builder script prompts for
   WiFi SSID/PSK + prod CHASE base URL at flash time and bakes only those.
   No conference/device data or secrets committed to the repo.

## Open investigation (resolve during build, fallback documented)

- **`@m1212e/sveltekit-oidc` session minting**: confirm the library
  exposes a way to establish its session cookie from an externally
  obtained token (token introspection / refresh-token import). If it does
  not, the fallback is a thin first-party callback that validates the
  display token against the OIDC provider's userinfo/introspection
  endpoint and sets the same session payload shape the library expects —
  still feeding the normal `req.locals.oidc`, still no synthetic context.

## Work breakdown

### Phase 1 — Data model & API (CHASE)

- `src/api/db/schema.ts`: add `displayDevice` table
  - `id` text PK (Pi-generated nanoid30)
  - `conferenceId` FK → conference, nullable (null = unassigned)
  - `committeeId` FK → committee, nullable (grid is committee-scoped)
  - `name` / label text, nullable (set by organizer)
  - `revoked` boolean, default false
  - `registeredAt`, `lastSeenAt`, `createdAt` timestamps
- `src/api/db/relations.ts`: relations to conference & committee.
- `bun run db:push` / generate migration in `drizzle/`.
- New handler `src/api/handlers/displayDevice.ts` (Rumble DSL):
  - **Ability path (kiosk-scoped)**: a request authenticated as the
    display account (`hasRole('service_user')`) may read exactly one
    `displayDevice` row + its assigned conference/committee grid data,
    selected by the `deviceId` argument, **only when** the row exists and
    `revoked === false`. No write access to debate state.
  - `registerDisplayDevice(id)` mutation — idempotent upsert by id,
    callable only by the display role; creates the row unassigned. Abuse
    bound: only the shared display principal can register; unassigned rows
    are inert (just show a QR) until an organizer acts.
  - Organizer-side queries/mutations (admin/member abilities): list
    devices, assign conference+committee, set name, toggle `revoked`.
  - Subscription/liveQuery exposure for the device row + assigned grid so
    the kiosk can `liveQuery` it.
- Regenerate `schema.graphql`.

### Phase 2 — Session-exchange endpoint (CHASE)

- New endpoint (e.g. `src/routes/api/kiosk/session/+server.ts`):
  accepts a valid display token from the Pi helper, validates it, and
  establishes the standard `@m1212e/sveltekit-oidc` session (per the
  investigation above). Restricted to the display role; rejects anything
  else. Sets the normal session cookie so `/kiosk` is authenticated
  through `hooks.server.ts` → `OIDC.handle` → `context()` unchanged.

### Phase 3 — Kiosk route & UI (CHASE)

- `src/routes/kiosk/+page.ts` / `+page.svelte` (Svelte 5 runes):
  - Resolves `deviceId` (delivered by the Pi helper — query param/cookie
    written locally; never trusts client-typed input since there is none).
  - `client.liveQuery` on the `displayDevice` row:
    - **unassigned or revoked** → full-screen pairing card: device id +
      QR encoding the CHASE assignment URL for that row.
    - **assigned** → render `CommitteeGrid` bound via
      `client.liveQuery.conference({...})` (reuse mission-control shape)
      for the assigned conference/committee.
  - Re-subscribe automatically when `conferenceId`/`committeeId` change.
  - Connection-loss overlay; auto-recover (appliance never gets a human).
- Organizer assignment UI: a section under the conference admin area
  listing display devices with assign/rename/revoke controls.
- i18n strings added to `messages/de.json`, `en.json`, `pt.json`
  (+ `bun run machine-translate`).
- Validate with `svelte-autofixer` before finalizing components.

### Phase 4 — Pi NixOS appliance

- `pi-display/` (new top-level dir, Nix flake):
  - NixOS module:
    - `chase-kiosk-auth.service`: first-boot generates nanoid30 device id
      if absent; runs Device Authorization Grant; persists `{deviceId,
      refreshToken}` to root-only `/var/lib/chase-kiosk` (0600,
      `systemd` `StateDirectory`); refresh loop; calls `registerDisplayDevice`;
      calls the Phase 2 session endpoint to obtain the CHASE session.
    - `chase-kiosk.service`: cage/weston (or X) launching Chromium in
      kiosk mode at `https://<base>/kiosk`, restarted on exit, screen
      blanking disabled.
    - WiFi (`wpa_supplicant`) + base URL from builder-injected config.
  - `build-image.sh`: guided script — prompts WiFi SSID/PSK + prod base
    URL, writes them into the image inputs (gitignored), produces the SD
    image. No secrets committed.
  - `pi-display/README.md`: flashing, assignment workflow, revocation,
    shared-account rotation, and the documented physical-access risk.

### Phase 5 — Quality & docs

- `bun run lint`, `bun run check`, `bun run typecheck`.
- Update root `README.md` / `docs/` with the display-system overview.
- Manual verification: register → QR → assign → live grid → reassign
  (no reboot) → revoke (grid disappears, QR returns).

## Out of scope

- TPM/secure-element key storage (no Pi 4 hardware support).
- On-device input / captive portal WiFi setup.
- Write access to debate state from kiosks (read-only by construction).

## Risks

- `@m1212e/sveltekit-oidc` may not expose token→session minting →
  Phase 2 fallback callback (documented above).
- Stolen Pi exposes the shared display refresh token → mitigated by
  per-device revoke + shared-account rotation; documented.
- Shared display account means per-device authz must rely on the
  validated `displayDevice` row, not the OIDC identity — enforced in the
  Phase 1 kiosk ability path.
