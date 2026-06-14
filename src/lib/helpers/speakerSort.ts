/**
 * Stable ordering for speakers on a list: by `position`, then by `id` as a
 * deterministic tiebreaker.
 *
 * The id tiebreaker matters offline. A speakers list is ordered purely by the
 * numeric `position` field, and the server guarantees a dense, collision-free
 * 0-based sequence via a `unique(speakersListId, position)` constraint. Offline
 * there is no speakers-list subscription to re-deliver those authoritative
 * positions, so optimistic edits are the only source of truth until reconnect.
 * If two entries ever momentarily share a position (e.g. an append computed from
 * list length while the cached list is briefly non-dense), a bare
 * `a.position - b.position` returns 0 and leaves the relative order — and the
 * "current speaker" at index 0 — nondeterministic. Falling back to `id` keeps
 * the order stable and reproducible across tabs/windows.
 */
export function compareSpeakers(
	a: { id: string; position: number },
	b: { id: string; position: number }
): number {
	return a.position - b.position || a.id.localeCompare(b.id);
}
