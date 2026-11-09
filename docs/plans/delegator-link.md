# DELEGATOR ↔ CHASE link

The same plan lives in munify-delegator as `docs/plans/chase-link.md`. It replaces the JSON file
round trip between the two apps (delegator's CHASE export and chase's import wizard; chase's
presence export and delegator's presence import) with a live link between the two instances.

## Decisions

| Topic                        | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Scope of a link              | **System level**: one delegator instance ↔ one chase instance. Every delegator conference not yet in `POST` exists in chase automatically, under delegator's ids.                                                                                                                                                                                                                                                                                                  |
| Trust                        | **Configuration only**: both instances sign people in at the same OIDC provider and call each other with tokens from it (client credentials, each with its M2M app). No pairing, nothing to approve.                                                                                                                                                                                                                                                               |
| Unlinking                    | Removing the configuration and restarting: the sync stops, chase rows become ordinary local rows, delegator keeps the attendance and resolutions it received.                                                                                                                                                                                                                                                                                                      |
| Transport                    | **GraphQL subscriptions in both directions**, held by a link worker **inside each app process**. Each side subscribes to what it imports and then reads the current state (see "Sync").                                                                                                                                                                                                                                                                            |
| Ownership                    | Each field has one owner. Delegator: conferences, committees, agenda, roles, people, working papers, NSA cards. Chase: presence, adopted resolutions, everything about running the session.                                                                                                                                                                                                                                                                        |
| Chase while linked           | Creating conferences (the import wizard) is off, and so is changing what DELEGATOR owns: synced rows cannot be deleted, and their DELEGATOR fields (names, abbreviations, dates, the people) not changed. What CHASE owns on the same rows (session state, presentation) stays editable. Chase admins may still add **local extras** (a guest chair, a late spectator), which the sync never touches, unless DELEGATOR later brings someone with the same address. |
| Participants and the release | Participants (delegates, NSAs, single participants) reach chase only once `conference.assignmentReleased` is set. Before that: conference, committees, agenda, roles, team.                                                                                                                                                                                                                                                                                        |
| Team roles                   | `PROJECT_MANAGEMENT` and `TEAM_COORDINATOR` (delegator's team admins) → chase `ADMIN`; every other team member → `TEAM`.                                                                                                                                                                                                                                                                                                                                           |
| Custom roles                 | Every custom role (press, judges, …) is a spectator in CHASE.                                                                                                                                                                                                                                                                                                                                                                                                      |
| Supervisors                  | `SPECTATOR`, as today.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Presence → delegator         | A live view of chase's records on the attendance import page, scored as today (`scoreDelegates` / `scoreNsas`). **The team applies it**; nothing is written automatically.                                                                                                                                                                                                                                                                                         |
| Adopted resolutions          | Automatic: chase records a resolution as ADOPTED, delegator renders the adopted text in its own header and stores it as a `resolution` in that committee. Adopting it again replaces it.                                                                                                                                                                                                                                                                           |
| Working papers               | ACCEPTED working papers appear in chase as drafts and **stay in sync** with delegator's newer versions until chase starts editing them.                                                                                                                                                                                                                                                                                                                            |
| NSA check-in                 | NSAs only. Chase's NSA scanner accepts delegator's digital nametag (the rotating `MUN1…` code) and a new printed card, both verified offline, plus a search by name. The 6-character `attendanceCode` goes.                                                                                                                                                                                                                                                        |
| NSA cards                    | A new PDF in delegator: name, NSA, icon and a signed QR. The card is valid until the conference ends and can be revoked by its card number. Unlinked, chase prints the same card with its own key.                                                                                                                                                                                                                                                                 |
| Code sharing                 | `identityCode.ts` (with its tests) is **copied** into chase, extended there by the card variant, and kept in step by hand.                                                                                                                                                                                                                                                                                                                                         |
| New mail                     | "Familiarize yourself with CHASE", a new reminder kind with its own window, for seated delegates, NSAs and single participants.                                                                                                                                                                                                                                                                                                                                    |
| Dashboard                    | A CHASE card: open my committee in CHASE, the manual for my role, and for NSAs a hint about the nametag.                                                                                                                                                                                                                                                                                                                                                           |
| JSON files                   | Kept as a fallback for unlinked setups, under an "advanced" section.                                                                                                                                                                                                                                                                                                                                                                                               |
| Delivery                     | This document first, then the phases below, on one branch per repo, with unit and e2e tests.                                                                                                                                                                                                                                                                                                                                                                       |

## The link itself

### Trust

Both instances sign people in at the same OIDC provider (Logto), so a person has the same id in
both, and the provider is what each trusts the other through. There is no pairing and nothing is
stored about the link but its state: it is configuration, the same variables on both sides.

- `LINK_REMOTE_URL`: the other instance's origin. `LINK_REMOTE_RESOURCE`: the resource
  indicator of its API. `LINK_RESOURCE`: this instance's own (delegator falls back to
  `OIDC_RESOURCE`). With `OIDC_M2M_CLIENT_ID` / `OIDC_M2M_CLIENT_SECRET`, the instance's
  machine-to-machine app: Logto grants client credentials only to M2M apps, never to the app
  people sign in with (delegator already has one for impersonation).
- Each worker asks the provider for a token for the other's API with the client credentials grant,
  asking for the scope of its role there (`chase` at delegator, `delegator` at chase), keeps it
  until shortly before it expires, and sends it with every call (`linkAuth.ts` in both).
- In Logto: an API resource per instance, a permission on it named after the role of the instance
  calling (`chase` on delegator's API, `delegator` on chase's), and on each M2M app a machine role
  holding the other's permission.
- Both sides keep one row, `instanceLink`, written at start-up from the configuration
  (`syncLinkRow` in delegator, `linkState.ts` in chase): `remoteUrl`, `lastEventAt`,
  `lastReconcileAt`, `lastError`, and in chase `remoteSigningKeys`. Removing the configuration
  ends the link at the next start: chase's rows lose `managedByDelegator`, delegator's
  resolutions their `chasePaperId`. Chase keeps the row of an ended link, unread, so delegator's
  printed cards keep scanning.

### The link principal

- A request carrying the token in the `x-munify-link-token` header (not `Authorization`: the
  session library takes bearer tokens there) is checked once, by a `linkHandle` in
  `hooks.server.ts`: signed by the provider, for this instance's API, granting the link role,
  through the role claim (`OIDC_ROLE_CLAIM`, delegator's `OIDC_ROLE_MAP`) or as a scope. The
  context then holds the role like any other: `ctx.hasRole('chase')` in delegator,
  `ctx.hasRole('delegator')` in chase, the way `admin` is checked. A session never holds it. This
  works on `/api/graphql`, delegator's `/api/graphql/stream`, and chase's WebSocket, which checks
  the token from its connection parameters once, when it connects.
- Abilities: one read rule per table the other side mirrors (`linkedChase(...)` in delegator's
  `authHelper/rules.ts`, `linkedDelegator(...)` in chase), each with only the columns mirrored. It
  never matches a user rule, so masks and participant rules are unaffected.

### The link worker

- Started from the server's `init` hook in each app. Only one instance holds it: a blocking
  Postgres advisory lock on a dedicated connection, so another instance takes over when its
  holder dies, without retrying on a timer.
- It runs **ordinary live queries** through the typed client generated from the remote's schema
  (`bun run link:client`, from the `schema.graphql` each app writes on dev start and build), one
  per table and page of 1000 rows (`liveTable.ts`). Every answer holds the rows as they are, so
  the worker keeps the remote's tables in memory and reads nothing twice: chase works out the
  mirror from them and writes only the rows that differ from its own, announcing only those;
  delegator works out presence and adopted resolutions, reading a text only to render it.
- **A list hears changes to the rows it shows, not of a row coming into its filter.** Tables are
  filtered only where they would be large: the members of seated delegations, the participant
  rows and users by the ids the other tables name, the final papers. Delegations and single
  participants are watched whole, so a seat change is heard and the filtered tables are asked
  again; a row named but not held (a new person, a paper turning final) asks its table again.
- A row missing across pages is asked for by id before it counts as gone; a page whose first
  answer failed is asked again with backoff; at most four first answers are awaited at once, so
  starting up is no burst of heavy queries.
- **Every (re)connect asks every table again.** There is no timer: a subscription that has gone
  quiet is noticed by the transport's keep-alive (graphql-ws pings, graphql-sse's stream), which
  drops the connection, and the reconnect catches up.
- It reconnects with backoff. The state (`lastEventAt`, `lastReconcileAt`, `lastError`) is
  written to `instanceLink` and shown on both status cards.
- Clients: delegator → chase over `graphql-ws`; chase → delegator over `graphql-sse` (distinct
  connections mode, since the server is not a browser tab).

### Sync, delegator → chase (chase's worker pulls)

Chase's worker watches `conferences` and, per conference, `committees`, `committeeAgendaItems`,
`conferenceRoles`, `teamMembers`, `delegations`, `delegationMembers`, `singleParticipants` and
`conferenceSupervisors`, all through delegator's link read rules. The mapping is pure and unit
tested (`mirror.ts` in chase).

| Delegator                                    | Chase                                                                     | Id in chase                |
| -------------------------------------------- | ------------------------------------------------------------------------- | -------------------------- |
| conference (title, start, end, location)     | `conference`                                                              | conference id              |
| committee                                    | `committee` (name, abbreviation)                                          | committee id               |
| committeeAgendaItem                          | `agendaItem`                                                              | agenda item id             |
| conferenceRole: nation seated by a committee | `representation` `DELEGATION` (alpha2/3, regional group)                  | role id                    |
| conferenceRole: non-state actor              | `representation` `NSA` (name, icon)                                       | role id                    |
| nation role × committee it seats             | `committeeMember`                                                         | `${roleId}_${committeeId}` |
| NSA delegation                               | `conferenceMember`                                                        | delegation id              |
| team member                                  | `conferenceUser` `ADMIN` / `TEAM`                                         | team member id             |
| supervisor                                   | `conferenceUser` `SPECTATOR`                                              | supervisor id              |
| delegation member (nation, after release)    | `conferenceUser` `DELEGATE` → its committee member                        | delegation member id       |
| delegation member (NSA, after release)       | `conferenceUser` `NON_STATE_ACTOR` → conference member, with `cardNumber` | delegation member id       |
| single participant (after release)           | `conferenceUser` `SPECTATOR`                                              | single participant id      |
| accepted working paper                       | `resolutionPaper` draft (see "Working papers")                            | paper id                   |

- Every chase row synced from delegator gets `managedByDelegator`. Local extras have none, and the
  reconcile never touches them, except one sharing an address with someone delegator brings.
- Reconcile per conference, in one transaction: upsert what delegator has, **delete** the managed
  rows it no longer has, with what hangs on them (chase's foreign keys cascade). Chase mirrors
  delegator exactly; a delegate moved to another committee keeps nothing of the old one.
- A conference moving to `POST` stays in chase (it ran there) but is no longer synced.
- Unlike today's export, representations are only the roles the conference offers, not every
  nation. Chase's "add country" stays off for linked conferences.

### Sync, chase → delegator (delegator's worker pulls)

The same pattern the other way: chase gets read rules for the link on its presence events,
conference users and adopted resolution papers, and delegator's worker watches them with live
queries through the generated chase client. Delegator renders the adopted resolution's PDF itself
(typst and the resolution editor are in both apps), so it prints in delegator's header: the
conference's emblem and the committee's resolution headline. Chase's `/api/pdf` is not involved.

- **Presence:** delegator keeps the latest `linkPresence` per conference in memory and in a
  `chasePresenceSnapshot` row (JSON, `fetchedAt`), and publishes it. The attendance import page
  shows it live, scored by the existing `scoreDelegates` / `scoreNsas`, and the team applies it
  with the existing buttons. The file upload stays below, under "advanced".
- **Resolutions:** chase lets the link read FINAL papers, their `VOTE_CONCLUDED` snapshots and
  the votes' outcomes, of synced conferences only, and its conclude and delete mutations now
  publish the snapshot table too. Delegator's worker watches the concluding snapshots per
  conference (nested `paper { vote { outcome } }`, so a later outcome reaches it as well), on its
  own debounce, so presence never triggers a compile; syncs run one at a time. A paper counts when
  its vote is ADOPTED; its text is the latest concluding snapshot (`adoptedResolutions.ts`). The
  worker renders the new ones and those with a newer snapshot (`#api/services/typst`, shared with
  `/api/pdf`), stores the PDF without an uploader (`storeGeneratedFile`) and upserts `resolution`
  by `chasePaperId` (unique) with `chaseSnapshotId`. A re-render replaces only the file, so a
  title or committee the team changed stays. A resolution whose paper is no longer adopted is
  deleted; its old PDFs are left to the file cleanup, which the existing `resolutionOf` read rule
  and `fileRef()` column already cover.
  While the link is active nobody deletes such a resolution in delegator (the delete rule and the
  disabled button in the resolution manager, with a note why), since the next sync would bring it
  back; unlinking clears `chasePaperId`, which makes them ordinary resolutions. Typst comes with
  the `typst` dependency's platform package, which every `bun install` (the image's included)
  puts into `node_modules`; the compile runs that binary directly.

## NSA nametags and cards

### Codes

The module is `#lib/helpers/identityCode.ts` in delegator and a copy in chase
(`src/lib/helpers/identityCode.ts`); change both together.

- **Digital nametag** (exists): `MUN1…`, signs `userId` and the time it was issued, valid for
  10 minutes.
- **Card**: `MUC1.<userId>.<conferenceId>.<expires>.<cardNumber>.<signature>` under its own
  domain (`munify-identity-card-v1`). It counts at its conference until the end of the day after
  the conference ends (`identityCardExpiry`). `verifyIdentityCard` answers
  `{ valid, userId, conferenceId, cardNumber }` or `malformed` / `forged` / `expired` /
  `otherConference`; whether the number is the person's current one is the caller's check.
- Delegator signs both with its deployment key (`identityKeyPair.ts`, `issueIdentityCard`), and
  hands the public key to the linked chase too (`identityCodePublicKey`,
  `assertCanReadIdentityKey`). Chase's link worker stores it on the link row
  (`remoteIdentityKey`) on every (re)connect and keeps it after unlinking, so delegator's cards
  keep scanning. Unlinked, chase signs cards with its own keys, derived from `SIGNED_CODE_SECRET`
  the way delegator derives its own from `CERTIFICATE_SECRET` (`src/api/services/signingKeys.ts`,
  a copy of delegator's `signingKeys.ts`, with a list of key ids to rotate), with the
  `conferenceUser` id as the user id.

### Delegator

- `conferenceParticipant.nsaCardNumber` (integer, default 1), read by the link.
- `nsaCard/`: `issueNsaCards(conferenceId, conferenceParticipantIds?)` signs the cards of the
  members of NSA delegations (participant care, `manageParticipants`; signing writes nothing);
  `reprintNsaCard(conferenceParticipantId)` raises the number (CONFLICT past 65535) and answers
  the new card.
- `#lib/api/nsaCardsPdf.ts`: A6 cards, four to an A4 sheet with cut lines, each with the logo,
  the person's name, the NSA's icon and name, the QR (medium error correction, no emblem) and
  "Karte n". `#lib/api/nsaCards.ts` downloads them: all from the downloads page (badge data),
  one from the user card (`NsaCardSection`: print the current card, or a new one that voids the
  earlier ones).
- The NSA badge CSV (`BadgeData.svelte`) stays as it is.

### Chase

- `conferenceUser.attendanceCode` is dropped (migration), and with it the 6-character fallback,
  `regenerateNsaAttendanceCode` and the code input. `conferenceUser.cardNumber` comes from the
  sync (or a reprint here). The sync also writes each person's `user` row under their id, which
  both instances share, ahead of their first sign-in; chairs read that id through
  `conferenceUser.user`.
- `identifyNsa` (`#lib/helpers/nsaScan.ts`) decides who a scanned code stands for, the same way
  in the scanner and on the server: a nametag by DELEGATOR's key and the person's account id; a
  card by DELEGATOR's key (account id) or chase's own (`conferenceUser` id), refused unless its
  number is the current one.
- The scanner (`NsaScannerDrawer`) keeps the keys in the browser (`#lib/api/identityKeys.ts`,
  query `identityKeys`), identifies the person offline from the conference's NSAs, and sends
  `{ conferenceUserId, code }`; the server verifies the code again (`resolveNsaTarget`,
  `#api/services/nsaCards.ts`). The **name search** (`searchNsas`: name, e-mail, NSA, ignoring
  case and diacritics) sends `{ conferenceUserId }` alone. The optimistic update reads the target
  by that id.
- Unlinked, chase prints the cards itself (`issueNsaCards` / `reprintNsaCard`, admins; refused
  for a synced conference): the print page and the card modal show the signed code, the names
  and the card number. A synced conference's NSA tab and print page point to DELEGATOR.

## Working papers → chase

- Delegator lets the link read working papers of released mirrored conferences that have an
  accepted version, and only their accepted versions (`paperPermissions.ts`,
  `paperVersionPermissions.ts`). The content is the resolution editor's JSON, the same chase
  stores.
- Chase's link worker watches them per conference and, after each reconcile, runs
  `syncWorkingPapers` (`src/api/services/link/workingPaperSync.ts`). `workingPaperChanges`
  (`workingPapers.ts`, unit tested) decides: a paper goes across with its latest accepted version
  as a `WORKING_PAPER` draft, written by its delegation's seat in its agenda item's committee
  (`committeeMemberId(roleId, committeeId)`); `resolutionPaper.delegatorPaperId` (unique),
  `delegatorVersion` and `detachedAt` record where it came from. The Yjs document is written with
  the draft, before anybody can open it.
- **Kept in sync until chase changes it:** a newer accepted version replaces the text through the
  live document (`applyServerMutation` + `replaceResolution`), so open editors see it. The first
  edit through a user's connection (Hocuspocus `onChange` with a session; the link's own updates
  come through a direct connection without one) or any `updateResolutionPaper` by someone who may
  update the paper sets `detachedAt` (`detach.ts`); from then on newer versions are ignored. The
  paper page shows "From DELEGATOR, version n" (`DelegatorOriginBadge`), with a hint saying
  which of the two it is.
- A draft whose paper is gone from delegator is deleted unless chase changed it.
- A paper without an agenda item, without its delegation's seat in that committee, or with a text
  the editor cannot read stays behind (`leftBehind`, with the reason). Showing that list on
  delegator's CHASE card is still open.

## Familiarize-with-CHASE mail

- New kind `CHASE_INTRO_REMINDER` in `REMINDER_KINDS`, with
  `CHASE_INTRO_REMINDER_DAYS = 10` in `#lib/helpers/emailKinds.ts`.
- **It exists only while an instance link is `ACTIVE`.** Without one, the kind is left out of the
  e-mail page, the user card's owed mails, `openEmailCounts` and the `send-emails` job, and
  `dueEmails` never owes it. The same goes for every CHASE hint in the UI.
- `dueEmails` owes it to seated delegation members (nation or NSA) and to single participants
  with a custom role, once the assignment is released, within the window before the
  conference starts. It is keyed by the conference start, so a moved date reminds again, like the
  survey reminder.
- Placeholders: `{chaseLink}` (their committee or conference in chase), `{manualLink}` (the
  manual page for their role: delegate, NSA or spectator, in the recipient's language) and
  `{committee}`. Default texts built from new `emailAutoChaseIntro…` messages in de and en.
- Like every kind, it is off by default, its text can be edited, and it appears in the user card's
  owed mails. The e-mail page explains the rule.

### Spacing the reminders

The reminders before the conference no longer land on the same days:

| Days before the conference | Mail                   |
| -------------------------- | ---------------------- |
| 14                         | `OPEN_ISSUES_REMINDER` |
| 10                         | `CHASE_INTRO_REMINDER` |
| 7                          | `PHONE_READY_REMINDER` |

Survey and paper deadlines can still fall anywhere, so the sweep also keeps a **gap per person**
(`spaceReminders`, `#api/handlers/email/reminderSpacing.ts`; every reminder carries the date it
reminds of, `remindsOf`):
a reminder (`isReminder`) is not due while the person got another automatic reminder within the
last `REMINDER_GAP_DAYS` (2), and it moves to the next sweep after the gap. It stays due as long as
its own window lasts; a reminder whose window closes during the gap is sent on the window's last
day anyway, so nothing is lost. Mails that report something (acceptance, a review, a payment) are
never held back. The rule is pure and unit tested with the windows above, and the e-mail page
explains it.

## Dashboard and UX between the apps

- **Participant dashboard** (preparation and active stages; only while linked and once released):
  a CHASE card with "Open my committee in CHASE" (`/app/{conferenceId}/{committeeId}`, or the
  conference for NSAs and single participants), "Manual for my role" (chase's `/docs` page for the
  role, in the locale), and for NSAs: "Chairs check you in and out of committees with your digital
  nametag or your printed card", linking to the check-in page.
- **Delegator team area:** a "CHASE" status card for the conference (link state, last event, last
  reconcile, what is waiting for the release, papers not transferred) with "Open in CHASE". The
  system-level link card lives in the admin area.
- **Chase:** a "managed by DELEGATOR" badge with a link back to the conference in delegator on
  synced rows. NSAs in chase get "Show my nametag", linking to delegator's check-in page. The
  launcher hides the import wizard while linked and points system admins to delegator for new
  conferences.
- **Fallback files:** delegator's CHASE export and presence import, and chase's import wizard and
  presence export, move under "advanced" and are hidden while linked.

## Status (2026-11-04)

Phases 1 to 5 are built on `feat/chase-link` (delegator) and `feat/delegator-link` (chase), with
unit tests, the team's CHASE status card (`ChaseStatusCard`, with the accepted working papers that
stay behind, `chaseTransferIssue`), chase's links back (`ManagedByDelegatorBadge`, `NametagLink`),
the link's authorization spec (`e2e/authorization/chase-link.spec.ts`, not run yet) and
`dev:linked` (see "Running both"). Nothing has run against a database or two live instances yet.
Still open: the remaining e2e specs listed under Tests. Since then, pairing gave way to
configuration over the shared OIDC provider ("Trust").

## Phases

1. **Link and roster** (both repos): `instanceLink`, the link's trust and read rules, the
   link worker with advisory lock and reconcile into chase with `managedByDelegator`, the release
   rule, the role mappings; chase's creation locked
   and DELEGATOR's fields read-only while linked.
2. **Back to delegator:** chase's link read rules on presence and resolutions; delegator's link
   worker, its live presence view and the resolution import.
3. **NSA codes and cards:** the card variant in both copies of `identityCode.ts`, the card
   number, `nsaCardsPdf.ts`, chase's scanner verification and name search, `attendanceCode`
   dropped, chase's own card print when unlinked.
4. **Working papers:** `linkWorkingPapers`, chase drafts, `detachedAt`.
5. **Mail and UX:** `CHASE_INTRO_REMINDER`, the dashboard card, status cards, deep links both
   ways, the fallback files moved under "advanced"; manual pages in chase (en, de, pt), CLAUDE.md
   and CLAUDE-UI.md in delegator.

## Tests

- **Unit:** snapshot → chase rows mapping (pure, next to today's `chaseExport.test.ts`), the
  reconcile's diff (upsert / delete / mark inactive, extras untouched), the release rule, the card
  encode and verify (expiry, other conference, outdated number), `dueEmails` for
  `CHASE_INTRO_REMINDER`, the working paper detach rule.
- **e2e (delegator):** link principal abilities (`e2e/authorization/`: reads only through the link
  rules, never masked columns), roles not reaching chase before release, the CHASE status card,
  the NSA card PDF, the dashboard card.
- **e2e (chase):** the scanner with a nametag, a card and the name search; a revoked card refused;
  read-only synced rows next to editable extras.
- **Both:** a link test pairs two dev servers (delegator's dev seed, chase's dev seed), then checks
  a committee renamed in delegator appearing in chase, and a presence record made in chase
  appearing on delegator's import page.

## Running both

Chase runs next to delegator's dev setup on its own ports, signing in at delegator's oidc-mock
(8090), so both share one provider and people's ids: `bun run dev:linked` in chase starts its
Postgres on 15433 (`linked.docker-compose.yml`) and the app on http://localhost:5174, with the
`LINK_*` variables pointing at delegator; `bun run db:migrate:linked` migrates that database.
Delegator runs as usual (`bun run dev`, port 5173) with these in its `.env`:

```
LINK_REMOTE_URL=http://localhost:5174
LINK_REMOTE_RESOURCE=http://localhost:5174/api
LINK_RESOURCE=http://localhost:5173/api
OIDC_M2M_CLIENT_ID=delegator-m2m
OIDC_M2M_CLIENT_SECRET=dev
```

oidc-mock issues a client credentials token to any client with whatever scope it asks for, which
stands in for Logto's machine roles.
