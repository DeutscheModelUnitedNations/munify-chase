# Meta-Plan: Resolution Editor Integration

## Context

MUNify CHASE currently has **zero resolution infrastructure**. This meta-plan defines the full architecture for integrating the resolution editor library (`@deutschemodelunitednations/munify-resolution-editor`) into CHASE, covering the entire resolution lifecycle per the DMUN Geschäftsordnung (GO).

Each numbered phase below will become its own implementation plan. Cross-committee flow (§13, presenting → decision-making body) is **deferred to V2**.

---

## Document Lifecycle (GO-Compliant)

```
Working Paper (delegates)
    │  delegates edit, share codes, gather sponsors
    │  delegate clicks "Submit"
    ▼
Submitted (Sekretariat + Chair have parallel edit access)
    │  Sekretariat makes formal corrections (§11.2)
    │  system ranks by sponsor count, suggests top N
    │  chair selects which become DRs (N configurable, default 3)
    │  → content snapshot saved for history
    ▼
Draft Resolution (public, auto-numbered e.g. DISEC/I/DR.1)
    │  all DRs presented by submitting delegation (§11.4)
    │  comparative debate (§11.5)
    ▼
Support Re-evaluation (§11.6)
    │  chair opens re-evaluation phase
    │  delegations can add/remove support on ANY DR (multi-support OK)
    │  system re-ranks DRs by supporter count
    │  chair closes re-evaluation
    ▼
DR Debate (one at a time, most supporters first — §12.1)
    │
    │  Per-paragraph debate (§12.2):
    │    debate OP1 → amendments targeting OP1
    │    debate OP2 → amendments targeting OP2
    │    ... (system locks amendments for passed paragraphs)
    │
    │  ADD amendments — new paragraphs (§12.3)
    │    (sub-amendments to newly added paragraphs treated immediately)
    │
    │  ORDER amendments — reorder paragraphs (§12.4)
    │
    │  For each amendment (§17.6-7):
    │    chair presents → "Check Consensus"
    │    → if no objection: adopted without vote
    │    → if objection: debate → formal vote
    │
    │  Debate finished DR (§12.5)
    │  Vote on individual operative paragraphs
    │    → rejected paragraphs marked & hidden (preserved in JSON)
    │
    │  Final roll-call vote (§12.6) — absolute majority required
    ▼
Result:
    ADOPTED → resolution (confetti, permanent record)
    REJECTED → next DR by supporter count (§12.7)
               if none remain → agenda item postponed
    SENT_BACK → outcome recorded, chair handles next steps manually
                (V2: cross-committee flow per §13/§16.4)
```

---

## Database Schema Design

### New Enums (6)

| Enum                    | Values                                                                           |
| ----------------------- | -------------------------------------------------------------------------------- |
| `paper_status`          | `WORKING_PAPER`, `SUBMITTED`, `DRAFT_RESOLUTION`, `AMENDMENT_PHASE`, `FINAL`     |
| `share_code_permission` | `SPONSOR`, `EDIT`                                                                |
| `comment_visibility`    | `PUBLIC`, `TEAM_ONLY`                                                            |
| `amendment_type`        | `DELETE`, `ADD`, `ALTER_TEXT`, `ALTER_POSITION`                                  |
| `amendment_status`      | `PENDING`, `SUBMITTED`, `CONSENSUS_ADOPTED`, `ACCEPTED`, `REJECTED`, `WITHDRAWN` |
| `vote_outcome`          | `ADOPTED`, `REJECTED`, `SENT_BACK`                                               |

### Modified Existing Tables

**`committee`** — Add fields:
| New Column | Type | Notes |
|------------|------|-------|
| `max_draft_resolutions` | `smallint` default 3 | Configurable per committee (GO default: 3) |
| `active_draft_resolution_id` | `text` FK→resolutionPaper, nullable | Which DR is currently being debated |
| `current_operative_index` | `smallint` nullable | Which operative paragraph is active (0-indexed). Amendments locked for index < this |
| `support_re_evaluation_open` | `boolean` default false | Whether delegations can currently change DR support |

### New Tables (11)

**`resolution_paper`** — Single entity for the entire lifecycle
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `committee_id` | `text` FK→committee | |
| `agenda_item_id` | `text` FK→agendaItem | |
| `creator_committee_member_id` | `text` FK→committeeMember | Only delegations can create |
| `status` | `paper_status` | Default `WORKING_PAPER` |
| `content` | `jsonb` | Resolution JSON (validated with `ResolutionSchema`) |
| `title` | `text` | Optional working title |
| `document_number` | `text` | Set when promoted (e.g. `"I/DR.1"`) |
| `sequence_number` | `smallint` | Sequential DR number within agenda item |
| `created_at`, `updated_at` | `timestamp` | |

**`paper_content_snapshot`** — Version history at key transitions
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `content` | `jsonb` | Resolution JSON at snapshot time |
| `trigger` | `text` | What triggered the snapshot (e.g. `"promoted_to_dr"`, `"amendment_accepted"`) |
| `created_at` | `timestamp` | |

**`paper_sponsor`** — Delegation sponsors (one unified role)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `committee_member_id` | `text` FK→committeeMember | Delegations only |
| `created_at`, `updated_at` | `timestamp` | |
| | | UNIQUE(paper_id, committee_member_id) |

**`paper_share_code`** — Owner-created invitation codes
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `code` | `text` UNIQUE | 6-char alphanumeric |
| `permission` | `share_code_permission` | `SPONSOR` or `EDIT` |
| `created_at`, `updated_at` | `timestamp` | |

**`paper_editor`** — Edit access (supports NSAs via conferenceUser)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `conference_user_id` | `text` FK→conferenceUser | Works for delegates AND NSAs |
| `created_at`, `updated_at` | `timestamp` | |
| | | UNIQUE(paper_id, conference_user_id) |

**`paper_clause_lock`** — Pessimistic per-clause editing locks (collaborative mode)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `clause_id` | `text` | Clause `id` from JSON |
| `conference_user_id` | `text` FK→conferenceUser | Lock holder |
| `expires_at` | `timestamp` | TTL (60s from acquire/refresh) |
| `created_at`, `updated_at` | `timestamp` | |
| | | UNIQUE(paper_id, clause_id) |

**`resolution_comment`** — Comments on draft resolutions (paragraph + document level)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `clause_id` | `text` nullable | `null` = document-level; otherwise clause `id` from JSON |
| `author_conference_user_id` | `text` FK→conferenceUser | |
| `content` | `text` | |
| `visibility` | `comment_visibility` | Default `PUBLIC` |
| `parent_comment_id` | `text` FK→self, nullable | Threading |
| `created_at`, `updated_at` | `timestamp` | |

**`amendment`** — Formal amendments to operative clauses (§17)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `proposer_committee_member_id` | `text` FK→committeeMember | |
| `type` | `amendment_type` | DELETE, ADD, ALTER_TEXT, ALTER_POSITION |
| `status` | `amendment_status` | Default `PENDING` |
| `target_clause_id` | `text` | Operative clause `id` from JSON (for DELETE/ALTER_TEXT/ALTER_POSITION) |
| `target_operative_index` | `smallint` | Index of targeted paragraph (for submission locking) |
| `new_content` | `jsonb` nullable | OperativeClause JSON for ADD/ALTER_TEXT |
| `target_position` | `smallint` nullable | For ADD/ALTER_POSITION |
| `created_at`, `updated_at` | `timestamp` | |

**`amendment_sponsor`** — Sponsors supporting an amendment
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `amendment_id` | `text` FK→amendment | |
| `committee_member_id` | `text` FK→committeeMember | |
| `created_at`, `updated_at` | `timestamp` | |
| | | UNIQUE(amendment_id, committee_member_id) |

**`operative_clause_vote`** — Per-paragraph vote results (§12.5)
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper | |
| `clause_id` | `text` | Operative clause `id` from JSON |
| `outcome` | `vote_outcome` | ADOPTED or REJECTED |
| `votes_for` | `smallint` | |
| `votes_against` | `smallint` | |
| `votes_abstain` | `smallint` default 0 | |
| `created_at` | `timestamp` | |

**`resolution_vote_result`** — Final vote outcome on the DR as a whole
| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` (nanoid) | PK |
| `paper_id` | `text` FK→resolutionPaper, UNIQUE | |
| `outcome` | `vote_outcome` | `ADOPTED` or `REJECTED` |
| `votes_for` | `smallint` | |
| `votes_against` | `smallint` | |
| `votes_abstain` | `smallint` default 0 | |
| `created_at`, `updated_at` | `timestamp` | |

### Key Relations

- `resolutionPaper` → committee, agendaItem, creator, sponsors[], shareCodes[], editors[], comments[], amendments[], clauseVotes[], voteResult?, snapshots[]
- `committee` → resolutionPapers[], activeDraftResolution?
- `amendment` → paper, proposer, sponsors[]
- `resolutionComment` → paper, author, parentComment?, replies[]

---

## New Pages & Routes

### Participant (Delegates / NSAs)

| Route                                                         | Purpose                                                                                                                                                           |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.../participant/[committeeId]/papers/+page.svelte`           | Papers overview: "My Papers", "Enter Code" input, create button, published DRs list, amendment submission (when amendment phase active)                           |
| `.../participant/[committeeId]/papers/[paperId]/+page.svelte` | Paper detail: editor (if access), sponsor list, share codes (creator), submit button. For DRs: read-only preview, comments, support toggle (during re-evaluation) |

### Chair

| Route                                   | Purpose                                                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.../(chairs)/resolutions/+page.svelte` | **New 5th tab (alt+5)**: Submitted papers queue, DR management, per-paragraph debate progression, amendment processing with consensus check, paragraph + final vote recording |

Modify: `ChairNavbar.svelte` — add 5th `fa-scroll` button with `alt+5`.

### Mission Control

| Route                                          | Purpose                                                         |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `.../mission-control/resolutions/+page.svelte` | Cross-committee resolution overview, status filters, commenting |

### Presentation

Modify presentation view — add optional `ResolutionPreview` grid item, pushed by chair via `localDB.committeeSettings.presentationDraftResolutionId`.

---

## Resolution Editor Library Changes

**Location**: `../munify-resolution-editor/src/lib/`

### 1. Preamble Extension Points (currently missing)

```typescript
preambleClauseToolbar?: Snippet<[{ clause: PreambleClause; index: number }]>;
preambleClauseAnnotations?: Snippet<[{ clause: PreambleClause; index: number }]>;
```

### 2. Amendment Rendering Props

```typescript
amendments?: AmendmentOverlay[];
rejectedClauseIds?: string[];  // For §12.5 paragraph vote results
onAmendmentClick?: (amendmentId: string) => void;
```

Renders: strikethrough (DELETE), green insertion (ADD), diff view (ALTER_TEXT), arrow (ALTER_POSITION). Rejected clauses shown with strikethrough/dimmed.

### 3. Between-Clauses Snippet

```typescript
betweenOperativeClauses?: Snippet<[{ index: number }]>;
```

For ADD amendment insertion markers.

### 4. Comment Panel Integration Point

```typescript
commentPanel?: Snippet<[{ resolution: Resolution; activeClauseId?: string }]>;
```

---

## GraphQL Handlers

### New Handler Files (10)

| Handler                   | Key Mutations                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `resolutionPaper.ts`      | `createResolutionPaper`, `updatePaperContent`, `submitPaper`, `promoteToDraftResolution`, `recordVoteResult`        |
| `paperSponsor.ts`         | `addSponsor`, `removeSponsor`                                                                                       |
| `paperShareCode.ts`       | `createShareCode`, `deleteShareCode`, `redeemShareCode`                                                             |
| `paperEditor.ts`          | managed via share code redemption                                                                                   |
| `paperContentSnapshot.ts` | auto-created on status transitions                                                                                  |
| `resolutionComment.ts`    | `createComment`, `deleteComment`                                                                                    |
| `amendment.ts`            | `createAmendment`, `submitAmendment`, `adoptByConsensus`, `acceptAmendment`, `rejectAmendment`, `withdrawAmendment` |
| `amendmentSponsor.ts`     | `addAmendmentSponsor`, `removeAmendmentSponsor`                                                                     |
| `operativeClauseVote.ts`  | `recordClauseVote` (per-paragraph)                                                                                  |
| `resolutionVoteResult.ts` | via `recordVoteResult` on paper handler                                                                             |

### Key Mutations on `committee` handler (extend existing)

- `setActiveDraftResolution(committeeId, paperId)` — sets which DR is being debated
- `setCurrentOperativeIndex(committeeId, index)` — advances paragraph pointer (locks amendments for passed paragraphs)
- `toggleSupportReEvaluation(committeeId, open)` — opens/closes support re-evaluation phase

### Amendment Flow (GO §17 compliant)

1. **Creation**: Delegate creates amendment → status `PENDING`. System validates `targetOperativeIndex >= committee.currentOperativeIndex` (can't amend already-passed paragraphs, §17.3)
2. **Sponsoring**: Other delegations sponsor. System enforces `sponsorCount >= committee.paperSupportThreshold` (10% of present, §17.1)
3. **Submission**: Once threshold met, proposer submits → status `SUBMITTED`
4. **Chair processes** (in GO-prescribed order):
   - Amendments targeting current paragraph first
   - Among those, most far-reaching first (§17.3, chair determines order)
   - Chair presents amendment, then clicks **"Check Consensus"**
   - **No objection** → `adoptByConsensus` → status `CONSENSUS_ADOPTED`, amendment applied to JSON
   - **Objection** → debate → formal vote → `acceptAmendment`/`rejectAmendment`
5. **Withdrawal**: Proposer can withdraw (§17.5). Chair asks if another delegation wants to maintain it.

### Share Code Flow

1. Enter code → `redeemShareCode` returns paper ID + permission (no records created)
2. SPONSOR: navigate to paper → review → click "Sponsor" → `addSponsor`
3. EDIT: creates `paperEditor` record immediately → navigate to paper in edit mode
4. NSAs: can only redeem EDIT codes

### Authorization Summary

| Action                            | Who                                                             |
| --------------------------------- | --------------------------------------------------------------- |
| Create working paper              | DELEGATE only                                                   |
| Edit working paper                | Creator + editors (via share code)                              |
| Edit submitted paper              | Creator + editors + Sekretariat (TEAM) + Chair                  |
| Sponsor paper                     | Any DELEGATE (via sponsor code); multi-support allowed for DRs  |
| Submit working paper              | Creator                                                         |
| View draft resolution             | All conference users                                            |
| Edit draft resolution             | Chair + Sekretariat (TEAM)                                      |
| Comment on DR                     | All conference users (TEAM_ONLY visibility for TEAM/ADMIN only) |
| Promote WP → DR                   | Chair / Admin                                                   |
| Open/close support re-evaluation  | Chair                                                           |
| Set active DR / advance paragraph | Chair                                                           |
| Create/sponsor amendment          | Any DELEGATE                                                    |
| Submit amendment                  | Proposer (when threshold met)                                   |
| Consensus check / accept / reject | Chair                                                           |
| Record paragraph vote             | Chair                                                           |
| Record final vote                 | Chair                                                           |

---

## Implementation Phases

### Phase 1: Database Schema + Basic API ✅

- ~~Add editor library dependency~~
- ~~Add 6 enums, 10 new tables, 4 new committee columns to `schema.ts`~~
- ~~Add all relations to `relations.ts`~~
- ~~`bun run db:push`~~
- ~~Create handlers: `resolutionPaper`, `paperSponsor`, `paperShareCode`, `paperEditor`, `paperContentSnapshot`~~
- ~~Register handlers, add i18n messages~~

### Phase 2: Delegate Working Paper UI ✅

- ~~Papers overview page + paper detail/editor page~~
- ~~`ResolutionEditor` integration with `onResolutionChange` (debounced 500ms)~~
- ~~Share code creation, copying, redemption~~
- ~~Sponsor list + "Sponsor" flow~~
- ~~"Submit to Chair" button~~
- ~~Navigation from participant committee page~~
- ~~Clause-level locking: `paper_clause_lock` table, acquire/release/heartbeat mutations, subscription, lock-aware content merge~~
- ~~Click-to-lock UX: hover overlay ("Start editing"), inline "Done editing" button, `collaborativeMode` gate~~

### Phase 3: Chair Resolutions Tab + DR Promotion

- New 5th tab in `ChairNavbar` (alt+5, `fa-scroll`)
- Submitted papers queue (ranked by sponsor count, suggests top N)
- "Promote to Draft Resolution" with auto-numbering
- DR editor for chair + Sekretariat (parallel access)
- Content snapshot on promotion

### Phase 4: Support Re-evaluation + DR Ordering

- "Open/Close Re-evaluation" chair controls
- Delegate UI: add/remove support on DRs (multi-support)
- Dynamic sponsor count display + DR ranking
- "Set Active DR" for debate progression

### Phase 5: Comment System

- `resolutionComment` handler
- `CommentPanel.svelte` (document + clause level, threading, visibility)
- **Editor library**: preamble extension points
- Integration in chair + participant DR views

### Phase 6: Amendment System

**6a: Editor library** — amendment overlay props, `rejectedClauseIds`, between-clauses snippet, rendering
**6b: Backend** — amendment + sponsor handlers, threshold enforcement, consensus check flow, paragraph index locking, amendment application to JSON + snapshot
**6c: Chair UI** — per-paragraph debate controls, amendment queue (GO-ordered), consensus check button, accept/reject actions
**6d: Delegate UI** — amendment creation form (4 types), sponsor flow

### Phase 7: Voting (Paragraphs + Final)

- `operativeClauseVote` handler — per-paragraph vote recording, rejected paragraphs hidden in preview
- `resolutionVoteResult` handler — final roll-call vote (absolute majority)
- Set `committee.lastResolutionAdoptionDate` on ADOPTED (triggers existing confetti)
- DR rejection fallback: system highlights next DR by supporter count
- Final resolution display with vote counts

### Phase 8: Presentation + Mission Control

- `presentationDraftResolutionId` in Dexie localDB
- "Push to Presentation" button
- `ResolutionPreview` grid item in presentation view
- Mission Control resolutions overview page

---

## Key Architectural Decisions

**Storage**: Resolution content as single JSONB column. Amendments + paragraph votes reference clause IDs from the JSON. Snapshots preserve history at key transitions.

**Real-time**: Rumble pubsub → Houdini subscriptions. `onResolutionChange` (debounced 500ms) → mutation → pubsub. Last-writer-wins acceptable for MUN context.

**Clause-level locking**: Explicit click-to-lock UX (not focus/blur). Delegates hover an unlocked clause to see a "Start editing" overlay, click to acquire a server-side lock, and click "Done editing" to release. Locks are per-clause rows in `paper_clause_lock` with a 60s TTL. A hybrid heartbeat (30s interval, only fires when idle >25s) keeps locks alive during active editing — saves already refresh locks implicitly via `updatePaperContent`. Lock state is pushed via GraphQL subscription; optimistic IDs bridge the gap. `collaborativeMode` gates all lock UI: solo editing (no share codes used, working paper status) shows no overlays or lock buttons. The `beforeunload` handler and navigation cleanup release all held locks via `sendBeacon`.

**Amendment application**: When accepted (by consensus or vote), server mutates JSON + creates snapshot. DELETE removes clause, ADD inserts, ALTER_TEXT replaces blocks, ALTER_POSITION moves. Record keeps status for history.

**Paragraph debate tracking**: Committee-level `currentOperativeIndex` field. Server-side enforcement: `createAmendment` rejects if `targetOperativeIndex < currentOperativeIndex`. Chair advances via `setCurrentOperativeIndex`.

**Paragraph vote-downs**: Rejected clauses stay in JSON but their `id`s are tracked in `operativeClauseVote`. Editor library renders them with strikethrough/hidden via `rejectedClauseIds` prop.

**Document numbering**: On promotion, auto-increment `sequenceNumber` per committee+agendaItem. `fullDocumentNumber` computed as `committee.abbreviation + "/" + toRoman(agendaItemPosition) + "/DR." + sequenceNumber`.

**Validation**: `ResolutionSchema` (Zod) validates JSONB on every save.

**Support re-evaluation**: Committee-level `supportReEvaluationOpen` boolean. When open, delegates can add/remove `paperSponsor` on DRs. Multi-support allowed (no exclusivity).

---

## Verification Plan

Per phase:

1. `bun run db:push` succeeds
2. `bun run check` + `bun run lint` pass
3. Manual flow: create paper → share → sponsor → submit → Sekretariat edits → chair promotes → re-evaluation → debate DR → per-paragraph amendments (consensus + vote) → paragraph votes → final vote → adopted/rejected
4. Real-time: two browser tabs, verify subscription updates
5. Authorization: NSAs can't create/sponsor, delegates can't edit DRs, amendments locked for passed paragraphs
6. Edge cases: DR rejection fallback, amendment withdrawal, paragraph vote-down removal

---

## Critical Files

| File                                                     | Changes                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `chase/src/api/db/schema.ts`                             | 6 enums, 10 tables, 4 committee columns                       |
| `chase/src/api/db/relations.ts`                          | All new + reverse relations                                   |
| `chase/src/api/handlers/register.ts`                     | Import 10 new handler files                                   |
| `chase/src/api/handlers/committee.ts`                    | New mutations for DR tracking, re-evaluation, paragraph index |
| `chase/src/routes/.../ChairNavbar.svelte`                | 5th tab                                                       |
| `chase/src/routes/.../participant/[committeeId]/papers/` | New routes                                                    |
| `chase/src/routes/.../(chairs)/resolutions/`             | New route                                                     |
| `chase/src/routes/.../mission-control/resolutions/`      | New route                                                     |
| `munify-resolution-editor/.../ResolutionEditor.svelte`   | Preamble snippets, amendment + rejected clause props          |
| `munify-resolution-editor/.../ResolutionPreview.svelte`  | Amendment rendering, comment panel                            |
| `munify-resolution-editor/.../schema/resolution.ts`      | AmendmentOverlay type                                         |
| `chase/messages/en.json` + `de.json`                     | All new i18n strings                                          |
