# Phase 4: Support Re-evaluation + DR Ordering — Implementation Plan

**Status**: COMPLETED

## Summary

Enable chairs to open/close a support re-evaluation phase where delegates can add/remove support on Draft Resolutions. Add "Set Active DR" toggle for debate progression. Clear active DR on final vote. Real-time updates via committee pubsub.

---

## Implemented Changes

### Backend

1. **`src/api/handlers/paperSponsor.ts`** — Re-evaluation gate on `addSponsor`/`removeSponsor`
   - For DR-status papers (`DRAFT_RESOLUTION`/`AMENDMENT_PHASE`), checks `supportReEvaluationOpen === true`
   - `FINAL` papers always rejected

2. **`src/api/handlers/committee.ts`** — Validate `activeDraftResolutionId` + auto-close re-evaluation
   - Added `clearActiveDraftResolution: Boolean` arg (needed because GraphQL nullable args can't distinguish `null` from "not sent")
   - Validates paper exists, belongs to committee, has DR status
   - Auto-closes re-evaluation when setting active DR
   - `supportReEvaluationOpen` toggle fires existing committee pubsub

3. **`src/api/handlers/resolutionPaper.ts`** — Clear `activeDraftResolutionId` on final vote
   - In `recordVoteResult`, after setting paper to `FINAL`, clears active DR if it matches
   - Fires committee pubsub for real-time UI update

### Participant Data

4. **`src/routes/.../participant/[committeeId]/+layout.ts`** — Added `supportReEvaluationOpen` and `activeDraftResolutionId` to layout query

5. **`src/routes/.../participant/[committeeId]/committeeSubscription.ts`** — Added `supportReEvaluationOpen` and `activeDraftResolutionId` to subscription

6. **`src/routes/.../participant/[committeeId]/papers/+page.svelte`** — Start `ParticipantCommitteeSubscription.listen()` in `onMount`

7. **`src/routes/.../participant/[committeeId]/papers/[paperId]/+page.svelte`** — Start `ParticipantCommitteeSubscription.listen()` in `onMount`

### Chair UI

8. **`src/routes/.../(chairs)/resolutions/+page.svelte`**
   - DaisyUI toggle (`toggle-success`) for setting/clearing active DR per card
   - DaisyUI toggle (`toggle-warning`) for opening/closing support re-evaluation
   - DR list sorts by sponsor count (desc) during re-evaluation, by `sequenceNumber` otherwise
   - Highlighted sponsor counts during re-evaluation

### Participant UI

9. **`src/routes/.../participant/[committeeId]/papers/+page.svelte`**
   - Active DR shown with green ring + badge
   - Pulsing "Support Re-evaluation" badge when open
   - Support/Withdraw toggle buttons per DR during re-evaluation
   - Sponsor flags displayed on DR cards

10. **`src/routes/.../participant/[committeeId]/papers/[paperId]/+page.svelte`**
    - DR support toggle on detail page during re-evaluation

### i18n

11. **`messages/en.json`** + **`messages/de.json`** — Added keys:
    `supportReEvaluation`, `supportReEvaluationOpen`, `supportReEvaluationClosed`,
    `supportDraftResolution`, `withdrawSupport`, `supporterCount`,
    `setActiveDr`, `clearActiveDr`, `noActiveDr`, `activeDraftResolution`

---

## Key Design Decisions

- Reuse `paperSponsor` table — sponsors carry over from WP to DR
- Server-enforced re-evaluation gate (not just UI-hidden)
- `clearActiveDraftResolution` boolean arg for explicit null-setting via GraphQL
- Auto-close re-evaluation when setting an active DR
- Clear active DR on both final vote outcome and explicit chair action
- Committee pubsub drives all real-time updates (no separate subscription needed)
