import dayjs, { type Dayjs } from 'dayjs';

// Standalone reactive clock with server-time correction.
// Intentionally has NO dependency on urqlClient so it can be imported by
// optimisticUpdateHandlers.ts without creating a circular module graph.
// serverTime.svelte.ts owns syncing and calls setOffset/tick to keep this up to date.

let current = $state(dayjs());
let offset = 0; // ms: server clock minus client clock

export function setOffset(newOffset: number) {
	offset = newOffset;
	current = dayjs().add(offset, 'ms');
}

export function tick() {
	current = dayjs().add(offset, 'ms');
}

export function getServerTime(): Dayjs {
	return current;
}
