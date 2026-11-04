# DELEGATOR ↔ CHASE link

The same plan lives in munify-delegator as `docs/plans/chase-link.md`. It replaces the JSON file
round trip between the two apps (delegator's CHASE export and chase's import wizard; chase's
presence export and delegator's presence import) with a live link between the two instances.

## Decisions

| Topic                        | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Scope of a link              | **System level**: one delegator instance ↔ one chase instance. Every delegator conference not yet in `POST` exists in chase automatically, under delegator's ids.                                                                                                                                                                                                                                                                                                  |
| Pairing                      | A delegator system admin enters the chase URL and sends a request; a chase global admin approves it. Both sides keep a hashed token. Either side can unlink.                                                                                                                                                                                                                                                                                                       |
| Unlinking                    | Freezes both sides: the sync stops, tokens are revoked, chase rows become ordinary local rows, delegator keeps the attendance and resolutions it received.                                                                                                                                                                                                                                                                                                         |
| Transport                    | **GraphQL subscriptions in both directions**, held by a link worker **inside each app process**. Each side subscribes to what it imports and then reads the current state (see "Sync").                                                                                                                                                                                                                                                                            |
| Ownership                    | Each field has one owner. Delegator: conferences, committees, agenda, roles, people, working papers, NSA cards. Chase: presence, adopted resolutions, everything about running the session.                                                                                                                                                                                                                                                                        |
| Chase while linked           | Creating conferences (the import wizard) is off, and so is changing what DELEGATOR owns: synced rows cannot be deleted, and their DELEGATOR fields (names, abbreviations, dates, the people) not changed. What CHASE owns on the same rows (session state, presentation) stays editable. Chase admins may still add **local extras** (a guest chair, a late spectator), which the sync never touches, unless DELEGATOR later brings someone with the same address. |
| Participants and the release | Participants (delegates, NSAs, single participants) reach chase only once `conference.assignmentReleased` is set. Before that: conference, committees, agenda, roles, team.                                                                                                                                                                                                                                                                                        |
| Team roles                   | `PROJECT_MANAGEMENT` and `TEAM_COORDINATOR` (delegator's team admins) → chase `ADMIN`; every other team member → `TEAM`.                                                                                                                                                                                                                                                                                                                                           |
| Custom roles                 | Each custom role (press, judges, …) gets a "CHASE access" setting: spectator (the default), team or none.                                                                                                                                                                                                                                                                                                                                                          |
| Supervisors                  | `SPECTATOR`, as today.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Presence → delegator         | A live view of chase's records on the attendance import page, scored as today (`scoreDelegates` / `scoreNsas`). **The team applies it**; nothing is written automatically.                                                                                                                                                                                                                                                                                         |
| Adopted resolutions          | Automatic: chase records a resolution as ADOPTED, delegator renders the adopted text in its own header and stores it as a `resolution` in that committee. Adopting it again replaces it.                                                                                                                                                                                                                                                                           |
| Working papers               | ACCEPTED working papers appear in chase as drafts and **stay in sync** with delegator's newer versions until chase starts editing them.                                                                                                                                                                                                                                                                                                                            |
| NSA check-in                 | NSAs only. Chase's NSA scanner accepts delegator's digital nametag (the rotating `MUN1…` code) and a new printed card, both verified offline, plus a search by name. The 6-character `attendanceCode` goes.                                                                                                                                                                                                                                                        |
| NSA cards                    | A new PDF in delegator: name, NSA, icon and a signed QR. The card is valid until the conference ends and can be revoked by its card number. Unlinked, chase prints the same card with its own key.                                                                                                                                                                                                                                                                 |
| Code sharing                 | `identityCode.ts` (with its tests) is **copied** into chase, extended there by the card variant, and kept in step by hand.                                                                                                                                                                                                                                                                                                                                         |
| New mail                     | "Familiarize yourself with CHASE", a new reminder kind with its own window, for seated delegates, NSAs and single participants with CHASE access.                                                                                                                                                                                                                                                                                                                  |
| Dashboard                    | A CHASE card: open my committee in CHASE, the manual for my role, and for NSAs a hint about the nametag.                                                                                                                                                                                                                                                                                                                                                           |
| JSON files                   | Kept as a fallback for unlinked setups, under an "advanced" section.                                                                                                                                                                                                                                                                                                                                                                                               |
| Delivery                     | This document first, then the phases below, on one branch per repo, with unit and e2e tests.                                                                                                                                                                                                                                                                                                                                                                       |

## The link itself

### Pairing

1. Delegator, system admin area: **CHASE link** card → chase URL (https only) → "Send request".
   Delegator calls chase's `requestDelegatorLink({ delegatorUrl, delegatorToken, nonce })` with a
   fresh token chase will use to call back, and stores its hash. Delegator fetches only this URL,
   and only to make this request.
2. Chase, global admin: a pending request with delegator's URL and a short confirmation code that
   is also shown in delegator, so the admins can compare them. "Approve" calls delegator's
   `confirmChaseLink` with chase's own token, then marks the link active.
3. Both sides keep one row: `instanceLink` (`remoteUrl`, `inboundTokenHash`, `outboundToken`
   (encrypted with `SECRET` in delegator, the optional `LINK_SECRET` in chase, without which chase
   refuses to pair), `status` `PENDING` / `ACTIVE` / `FROZEN`, `linkedAt`,
   `lastEventAt`, `lastReconcileAt`, `lastError`).
4. Unlinking on either side revokes both tokens through the remote (best effort) and sets
   `FROZEN` locally.

### The link principal

- A request carrying the link token in the `x-munify-link-token` header (not `Authorization`: both
  apps take OIDC bearer tokens there) gets `ctx.linkCaller()`, looked up lazily, once per request.
  This works on `/api/graphql`, delegator's `/api/graphql/stream`, and chase's WebSocket, which takes
  the token in its connection parameters.
- Abilities: one read rule per table the other side mirrors (`linkedChase(...)` in delegator's
  `authHelper/rules.ts`), each with only the columns mirrored. It never matches a user rule, so
  masks and participant rules are unaffected.

### The link worker

- Started from the server's `init` hook in each app. Only one instance holds it: a blocking
  Postgres advisory lock on a dedicated connection, so another instance takes over when its
  holder dies, without retrying on a timer.
- It runs **ordinary live queries** through the typed client generated from the remote's schema
  (`bun run link:client`, from the `schema.graphql` each app writes on dev start and build). Their
  updates only trigger: the worker then reads the conference afresh (debounced) and reconciles it,
  which makes a lost, doubled or partial update harmless.
- It runs a **full reconcile on every (re)connect**, and otherwise only on what the subscriptions
  report. There is no timer: a subscription that has gone quiet is noticed by the transport's
  keep-alive (graphql-ws pings, graphql-sse's stream), which drops the connection, and the
  reconnect reconciles everything.
- It reconnects with backoff. The state (`lastEventAt`, `lastReconcileAt`, `lastError`) is
  written to `instanceLink` and shown on both status cards.
- Clients: delegator → chase over `graphql-ws`; chase → delegator over `graphql-sse` (distinct
  connections mode, since the server is not a browser tab).

### Sync, delegator → chase (chase's worker pulls)

Chase's worker watches `conferences` and, per conference, `committees`, `committeeAgendaItems`,
`conferenceRoles`, `teamMembers`, `delegations`, `delegationMembers`, `singleParticipants` and
`conferenceSupervisors`, all through delegator's link read rules. The mapping is pure and unit
tested (`mirror.ts` in chase).

| Delegator                                        | Chase                                                                                           | Id in chase                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------- |
| conference (title, start, end, location)         | `conference`                                                                                    | conference id              |
| committee                                        | `committee` (name, abbreviation)                                                                | committee id               |
| committeeAgendaItem                              | `agendaItem`                                                                                    | agenda item id             |
| conferenceRole: nation seated by a committee     | `representation` `DELEGATION` (alpha2/3, regional group)                                        | role id                    |
| conferenceRole: non-state actor                  | `representation` `NSA` (name, icon)                                                             | role id                    |
| nation role × committee it seats                 | `committeeMember`                                                                               | `${roleId}_${committeeId}` |
| NSA delegation                                   | `conferenceMember`                                                                              | delegation id              |
| team member                                      | `conferenceUser` `ADMIN` / `TEAM`                                                               | team member id             |
| supervisor                                       | `conferenceUser` `SPECTATOR`                                                                    | supervisor id              |
| delegation member (nation, after release)        | `conferenceUser` `DELEGATE` → its committee member                                              | delegation member id       |
| delegation member (NSA, after release)           | `conferenceUser` `NON_STATE_ACTOR` → conference member, with `delegatorUserId` and `cardNumber` | delegation member id       |
| single participant (after release, CHASE access) | `conferenceUser` `SPECTATOR` / `TEAM`                                                           | single participant id      |
| accepted working paper                           | `resolutionPaper` draft (see "Working papers")                                                  | paper id                   |

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

## NSA nametags and cards

### Codes

The module is `#lib/helpers/identityCode.ts` in delegator and a copy in chase
(`src/lib/helpers/identityCode.ts`), with the same tests.

- **Digital nametag** (exists): `MUN1…`, signs `userId` and the time it was issued, valid for
  10 minutes.
- **Card** (new): a second prefix (`MUC1…`) and domain (`munify-identity-card-v1`), signing
  `userId`, `conferenceId`, `expiresAtSeconds` (the conference end date plus one day) and
  `cardNumber` (a small integer). `verifyIdentityCard` returns
  `{ valid, userId, conferenceId, cardNumber }` or `malformed` / `forged` / `expired` /
  `otherConference`.
- Delegator signs both with its deployment key (`identityKeyPair.ts`). Chase gets
  `identityCodePublicKey` from delegator over the link and keeps it in IndexedDB, so the scanner
  checks codes offline. Unlinked, chase signs cards with its own key pair (an env secret, like
  delegator's).

### Delegator

- `conferenceParticipant.nsaCardNumber` (integer, default 1). "Reprint card" in the user card
  raises it, so earlier cards stop scanning once the next sync reaches chase.
- `issueNsaCards(conferenceId, participantIds?)` (team, `manageParticipants`): signs one card per
  NSA, valid until the conference ends.
- `#lib/api/nsaCardsPdf.ts` (pdf-lib, next to `nametagSheetsPdf.ts`): an A4 sheet of cut-out
  cards, each with the person's name, the NSA's name and icon, the conference logo and the QR.
  It is offered on the downloads page and as a single card in the user card.
- The NSA badge CSV (`BadgeData.svelte`) stays as it is.

### Chase

- `conferenceUser.attendanceCode` is dropped (migration), and with it the 6-character fallback,
  `pickUniqueAttendanceCode` and the code input in `NsaScannerDrawer`.
- `conferenceUser.delegatorUserId` and `conferenceUser.cardNumber` come from the sync.
- `resolveNsaTarget` takes a verified identity instead of a raw string: the scanner verifies the
  QR in the browser (nametag or card, delegator's or chase's key), rejects an outdated card
  number, and sends `{ userId }` or `{ conferenceUserId }`. The server verifies the signature
  again and refuses the request otherwise.
- **Name search** in the NSA scanner drawer, the same flexible search as delegator's attendance
  page: names, NSA name and email, so a chair can check someone in when the QR will not scan.
  The printed card carries the name for exactly that case.
- Unlinked, chase's own print page (`attendance/print`) prints the same card layout, signed with
  chase's key.

## Working papers → chase

- `linkWorkingPapers(conferenceId)` lists the working papers whose latest version is `ACCEPTED`,
  with committee, agenda item, delegation and version number. It is part of the snapshot.
- Chase creates or updates a `resolutionPaper` draft: `delegatorPaperId` (unique),
  `delegatorVersion`, content seeded into the Yjs document, and `creatorCommitteeMemberId` set to
  the delegation's committee member in the paper's committee.
- **Kept in sync until chase edits it:** the first local edit (a Yjs update not from the sync,
  or any status change) sets `detachedAt`. From then on delegator's newer versions are ignored,
  and the paper shows "taken over from DELEGATOR, version n".
- A paper without an agenda item, or whose delegation has no seat in that committee, is listed on
  delegator's CHASE status card as "not transferred", with the reason.

## Familiarize-with-CHASE mail

- New kind `CHASE_INTRO_REMINDER` in `REMINDER_KINDS`, with
  `CHASE_INTRO_REMINDER_DAYS = 10` in `#lib/helpers/emailKinds.ts`.
- **It exists only while an instance link is `ACTIVE`.** Without one, the kind is left out of the
  e-mail page, the user card's owed mails, `openEmailCounts` and the `send-emails` job, and
  `dueEmails` never owes it. The same goes for every CHASE hint in the UI.
- `dueEmails` owes it to seated delegation members (nation or NSA) and to single participants
  whose role has CHASE access, once the assignment is released, within the window before the
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

Survey and paper deadlines can still fall anywhere, so `dueEmails` also keeps a **gap per person**:
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

## Phases

1. **Link and roster** (both repos): `instanceLink`, pairing UI, link caller and read rules, the
   link worker with advisory lock and reconcile into chase with `managedByDelegator`, the release
   rule, the role mappings and the CHASE access setting on custom roles; chase's creation locked
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

## Open points for implementation

- The dev setup for two linked instances: likely a `bun run dev:linked` that starts chase next to
  delegator against the same oidc-mock, with the pairing done by the seed.
- Chase needs `delegatorUserId` to resolve a scanned user id while the NSA has never logged into
  chase. With the same identity provider it equals the OIDC sub; with different ones it is still
  delegator's id, which is what the codes sign.
