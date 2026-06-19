# Resolution Editor — UI Re-add Plan

Re-adding the resolution editor UI on top of the **reworked, confirmed-final
handlers** (branch `reAddRes`). This plan covers the UI only; it takes
inspiration from `main` but deliberately fixes its usability problems.

## Problems on `main` we are fixing

1. **Monolithic pages** — a 2,449-line chair editor page and a 1,568-line
   participant page that crammed every concern onto one screen.
2. **Clunky chair debate-driving** — during the amendment/voting debate the chair
   had to hunt for controls; no contextual "what do I act on now" surface.
3. **All amendments shown at once** — the UI listed every amendment regardless of
   which operative clause was being debated, instead of scoping to the active /
   selected clause.

## What changed in the handler layer (vs `main`'s meta-plan)

- **Content is a Y.Doc** (`paper_yjs_doc`), edited collaboratively in real time
  over WebSocket — not JSON-on-the-row with pessimistic clause locks. Presence /
  awareness is available via the Y.js `presence` adapter.
- **Voting is integrated with the existing `votingSession` system**:
  `operativeClauseVote` links a clause → a votingSession; `concludeResolutionPaperVote`
  links the paper → its final votingSession. The bespoke `resolutionVoteResult`
  table is gone.
- Lifecycle: `WORKING_PAPER → SUBMITTED → DRAFT_RESOLUTION → AMENDMENT_PHASE →
  VOTING_PHASE → FINAL`.
- Editors are `conferenceUser`s (NSAs work too). Share codes grant `SPONSOR` /
  `EDIT`. `paperContentSnapshot` provides version history.
- Committee debate controls already exist as mutations: `setActiveDraftResolution`,
  the active-amendment setter (validates the amendment belongs to the active DR),
  and the phase-flags / `currentOperativeIndex` setter (`supportReevaluationOpen`,
  `amendmentSubmissionOpen`, `amendmentSponsoringOpen`).

## Editor library extension points we rely on

`ResolutionEditor` (`@deutschemodelunitednations/munify-resolution-editor`) exposes:

- Per-clause snippets: `clauseToolbar`, `clauseAnnotations`, `afterOperativeClause`,
  `betweenOperativeClauses` (and preamble equivalents).
- `amendments?: AmendmentOverlay[]`, `rejectedClauseIds?: string[]`,
  `onAmendmentClick`.
- `presence?: PresenceAdapter` for live cursors/awareness.
- Read-only `ResolutionPreview` / `ResolutionPrintPreview` for presentation/final.

These mean contextual (per-clause) amendment rendering is native — **no global
amendment list is needed**.

---

## Concept: one role-and-phase-aware paper page

The architectural spine is a single shared **`PaperPage`** surface used by both
chair and participant routes. It reshapes by `(viewer role × paper.status)` rather
than splitting into two giant pages.

```
┌─ control bar (chair only) ────────────────────────────────────────┐
│ status stepper · set-active-DR · current clause · phase toggles ·  │
│ snapshots · share codes · sponsors                                 │
├──────────────────────────────────────────┬────────────────────────┤
│  ResolutionEditor / ResolutionPreview      │  Clause context panel  │
│  (center; editable per role+phase)         │  selected: Clause 3    │
│                                            │  [Amend·2][Comm·5][Vote]│
│  3. Calls upon…            ▾ 2 amend.       │  ───────────────────── │
│  4. Requests…             ▸ 0              │  ALTER  France [cons][▷]│
│  5. Decides…              ▸ 1              │  DELETE Brazil [cons][▷]│
└──────────────────────────────────────────┴────────────────────────┘
```

- **Center**: `ResolutionEditor` when the viewer may edit (per access + phase),
  otherwise `ResolutionPreview`. Each operative clause has a focus affordance
  (`clauseToolbar`) that sets local `selectedClauseId`; non-selected clauses show
  only a small amendment/comment count badge (`clauseAnnotations`).
- **Right context panel**: tabbed, scoped to `selectedClauseId` (document-level
  when nothing selected).
  - **Amendments** — only the selected clause's amendments. Chair:
    `[check consensus]` / `[start vote]` / accept / reject. Delegate: propose /
    sponsor / withdraw, gated by `amendmentSubmissionOpen` /
    `amendmentSponsoringOpen`.
  - **Comments** — clause-level threaded comments (`PUBLIC` / `TEAM_ONLY`),
    document-level when no clause selected.
  - **Vote** — status/result of the linked `operativeClauseVote` session.
- **Chair control bar** (team viewers only): status/phase stepper, set-as-active-DR,
  `currentOperativeIndex` "current clause" pointer (drives amendment overlays and
  highlights), phase-flag toggles, snapshot history, share-code & sponsor
  management.
- **Amendment overlays**: in `AMENDMENT_PHASE` the editor renders `amendments`
  overlays (strike/insert/diff/move) + `rejectedClauseIds`, scoped per clause.
- **Collaboration**: live presence/cursors via the existing Y.js `presence`
  adapter + `SyncBadge` (already scaffolded in `ResolutionEditorMount`).

## Routes (follow existing app conventions)

| Route | Audience | Purpose |
|-------|----------|---------|
| `(chairs)/resolutions/+page.svelte` | Chair/Team | List + **ranked Submitted queue** (by sponsor count, suggest top N) with one-click *Promote to DR* |
| `(chairs)/resolutions/[paperId]/+page.svelte` | Chair/Team | `PaperPage` with chair affordances |
| `participant/[committeeId]/+page.svelte` | Delegate/NSA | Add a **Resolutions card** to the existing mobile-first committee overview |
| `participant/[committeeId]/papers/+page.svelte` | Delegate/NSA | Papers list: my papers, enter share code, create working paper, published DRs |
| `participant/[committeeId]/papers/[paperId]/+page.svelte` | Delegate/NSA | `PaperPage` with participant affordances |

Stubs for the chair routes and `ResolutionEditorMount` / `SnapshotHistoryModal` /
`SyncBadge` already exist and will be absorbed/refactored into the shared
components below.

## Component inventory (`src/lib/components/resolutions/`)

- `PaperPage.svelte` — shared layout: control bar + editor + context panel; takes
  `paperId`, resolved `role`, `paper.status`, `canEdit`.
- `ResolutionEditorMount.svelte` *(exists)* — Y.js wiring; extend to pass
  `amendments`, `rejectedClauseIds`, per-clause snippets, and `selectedClauseId`
  selection callback.
- `ClauseContextPanel.svelte` — tabbed Amendments/Comments/Vote, driven by
  `selectedClauseId`.
- `AmendmentList.svelte` / `AmendmentComposer.svelte` — per-clause amendment list +
  create/sponsor/withdraw + chair consensus/vote actions.
- `CommentThread.svelte` — clause/document comments, one-level threading,
  visibility control.
- `ClauseVotePanel.svelte` — launch/show the linked votingSession result.
- `ChairControlBar.svelte` — status stepper, active-DR, current clause, phase
  toggles.
- `SubmittedQueue.svelte` — ranked promotion queue for the chair list page.
- `ShareCodePanel.svelte` / `SponsorPanel.svelte` — share-code create/copy/redeem
  and sponsor management.
- `SnapshotHistoryModal.svelte` *(exists)* — version history + restore.
- `PresentationResolutionPreview.svelte` — read-only preview grid item for the
  presentation view, driven by `activeDraftResolutionId` + `currentOperativeIndex`.

## Voting integration (auto-launch)

Chair `[start vote]` (clause) and `[final vote]` actions:
1. create + activate a `votingSession` for the committee;
2. link it via `linkOperativeClauseVote` (clause) or `concludeResolutionPaperVote`
   (final);
3. surface the result inline in the Vote tab.

Amendment **accept** already applies server-side to the Y.Doc and snapshots — the
UI just calls `acceptAmendment` / `rejectAmendment`.

## Selected-clause mechanism

The library has no `onClauseSelect` prop, but per-clause snippets give us the hook:
the `clauseToolbar` snippet renders a focus button that sets a local
`selectedClauseId` (Svelte 5 rune state on `PaperPage`), which drives the context
panel and the per-clause count badges in `clauseAnnotations`. The chair's
`currentOperativeIndex` independently highlights the clause under formal debate.

## Handler change required (approved)

`documentNumber` / `sequence_number` columns exist but **no mutation writes them**.
For the ranked queue's auto document numbers (e.g. `DISEC/I/DR.1`), add a
`documentNumber` (and optional `sequenceNumber`) arg to the promote path —
either extend `updateResolutionPaper` or add a dedicated `promoteToDraftResolution`
mutation that sets `status = DRAFT_RESOLUTION` + the computed number atomically.
This is the only handler-layer change in the plan.

## Build order

1. **Shared shell** — `PaperPage` + refactor `ResolutionEditorMount`; wire
   `selectedClauseId` selection and per-clause count badges. Read-only vs editable
   by role+phase.
2. **Working-paper authoring** — participant papers list + create + share codes +
   sponsors + submit; Resolutions card on the participant committee page.
3. **Clause context panel** — Comments tab first (simplest), then Amendments tab
   (compose/sponsor/withdraw), scoped to selected clause.
4. **Chair list + DR promotion** — ranked Submitted queue + promote (incl. the
   `documentNumber` handler change) + chair control bar (status stepper, active-DR,
   phase toggles, current clause).
5. **Amendment debate** — amendment overlays in `AMENDMENT_PHASE`, chair consensus /
   accept / reject, `currentOperativeIndex` advancement.
6. **Voting** — auto-launch clause votes + final vote, Vote tab results, FINAL
   transition + snapshot.
7. **Presentation** — read-only preview grid item driven by active DR + current
   clause.
8. **i18n + polish** — `messages/{de,en,pt}.json`, empty/loading states, mobile
   layout for the participant editor.
```
