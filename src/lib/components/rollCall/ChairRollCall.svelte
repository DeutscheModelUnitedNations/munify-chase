<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import { untrack } from 'svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';

	interface Props {
		active: boolean;
		members: Array<{
			id: string;
			present: boolean;
			representation?: {
				name?: string | null;
				alpha2Code?: string | null;
				alpha3Code?: string | null;
				faIcon?: string | null;
				type?: string | null;
			} | null;
		}>;
		committeeId: string;
		/** ID of the server-side active session, if any. When this becomes null while
		 * the modal is open and a session was established, we know the session was
		 * completed externally (another device/tab) and should close the modal. */
		externalActiveSessionId?: string | null;
	}

	let {
		active = $bindable(),
		members,
		committeeId,
		externalActiveSessionId = null
	}: Props = $props();

	let currentIndex = $state(0);
	let sessionId = $state<string | null>(null);

	// Dedupe key for in-flight setPresence calls. We do NOT show a spinner — the
	// optimistic cache write makes the check/X icon visible immediately, and offline
	// the mutation promise never resolves, so any spinner would stick forever. This
	// set only exists to guard against double-fire on the same row (key repeat /
	// accidental double-click) which would otherwise re-run the +1 advance below
	// and visually skip an entry.
	const inFlight = new Set<string>();

	const setPresence = (present: boolean) => {
		const member = members[currentIndex];
		if (!member) {
			toast.error(m.rollCallError());
			return;
		}

		const id = member.id;
		if (inFlight.has(id)) return;
		inFlight.add(id);
		setTimeout(() => inFlight.delete(id), 600);

		client.mutate
			.setPresenceForCommitteeMembers({
				__args: { ids: [id], present, rollCallSessionId: sessionId },
				id: true,
				present: true
			})
			.catch(() => {});

		if (currentIndex === members.length - 1) {
			toast.success(m.rollCallSuccess());
			active = false;
			return;
		}

		const nextIndex = currentIndex + 1;
		currentIndex = nextIndex;
		syncIndex(nextIndex);
	};

	const syncIndex = (index: number) => {
		if (!sessionId) return;
		// Fire-and-forget: navigation should feel instant for the chair
		client.mutate
			.setRollCallSessionIndex({
				__args: { id: sessionId, currentMemberIndex: index },
				id: true,
				currentMemberIndex: true
			})
			.catch(() => {});
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			// `single: true` unbinds any prior handler in the rollCall scope before
			// registering a fresh one. Without it, if this effect re-runs while
			// `active` stays true, hotkeys-js stacks duplicate handlers in the
			// scope and every keypress fires setPresence twice — visibly skipping
			// a row per press because currentIndex has already advanced by the
			// time the second handler reads `members[currentIndex]`.
			hotkeys(
				'up, down, j, l, esc',
				{ scope: 'rollCall', single: true },
				(event, handler) => {
					event.preventDefault();
					// Also ignore key-repeat events from a held key — same skip
					// symptom from a different cause, same dedupe blind spot.
					if (event.repeat) return;
					switch (handler.key) {
						case 'up': {
							const newIndex = (currentIndex - 1 + members.length) % members.length;
							currentIndex = newIndex;
							syncIndex(newIndex);
							break;
						}
						case 'down': {
							const newIndex = (currentIndex + 1) % members.length;
							currentIndex = newIndex;
							syncIndex(newIndex);
							break;
						}
						case 'j':
							setPresence(false);
							break;
						case 'l':
							setPresence(true);
							break;
						case 'esc':
							active = false;
					}
				}
			);
			hotkeys.setScope('rollCall');

			// Set the session id synchronously so the chair can act before — and even
			// without — a server confirmation: subsequent setPresenceForCommitteeMembers
			// / setRollCallSessionIndex calls need a `rollCallSessionId` that the queued
			// startRollCallSession mutation will create on the server. Resume an existing
			// session if the parent already sees one in the cache, otherwise mint a
			// client-side id and pass it through so the optimistic write and the eventual
			// server insert land on the same row. Read externalActiveSessionId untracked
			// so a subscription update later doesn't restart the session.
			const id = untrack(() => externalActiveSessionId) ?? nanoid();
			sessionId = id;

			client.mutate
				.startRollCallSession({
					__args: { committeeId, id },
					id: true,
					currentMemberIndex: true
				})
				.then((result) => {
					// Server may return an existing session with a different id if one was
					// already running and the parent query hadn't surfaced it yet. Adopt
					// whatever the server returned so subsequent mutations target the right
					// row. For the index, only jump forward (resume case) — if the user has
					// already advanced locally while the round trip was in flight, snapping
					// back to the server-stored value would reset their progress and feel
					// like the modal lost their input.
					sessionId = result.id;
					if (result.currentMemberIndex > currentIndex) {
						currentIndex = result.currentMemberIndex;
					}
				})
				.catch(() => {});
		} else {
			hotkeys.deleteScope('rollCall');

			if (sessionId) {
				client.mutate.completeRollCallSession({ __args: { id: sessionId } }).catch(() => {});
				sessionId = null;
			}

			currentIndex = 0;
			inFlight.clear();
		}
	});

	// Track whether the server subscription has confirmed our session at least once.
	// This prevents a false-positive close during the gap between the mutation
	// returning (sessionId is set) and the subscription delivering the new session
	// to externalActiveSessionId.
	let sessionServerConfirmed = $state(false);

	$effect(() => {
		if (sessionId !== null && externalActiveSessionId === sessionId) {
			sessionServerConfirmed = true;
		}
		if (!active) {
			sessionServerConfirmed = false;
		}
	});

	// Close the modal only once the server had confirmed our session AND it is
	// now gone (completed externally from another device or tab).
	$effect(() => {
		if (active && sessionServerConfirmed && externalActiveSessionId === null) {
			sessionId = null; // cleared so the cleanup branch above skips completeRollCallSession
			sessionServerConfirmed = false;
			active = false;
		}
	});
</script>

<Modal bind:open={active}>
	<h1 class="mb-4 text-2xl font-bold">{m.rollCall()}</h1>
	<ScrollingCountryList {members} {currentIndex} />

	<div class="modal-action justify-around">
		<button
			class="btn btn-error btn-lg flex gap-2"
			onclick={() => {
				setPresence(false);
			}}
		>
			<i class="fas fa-xmark"></i>
			{m.absent()}
			<Kbd hotkey="J" />
		</button>
		<div class="join">
			<button
				class="btn btn-outline btn-lg join-item"
				aria-label="Move up"
				onclick={() => {
					const newIndex = (currentIndex - 1 + members.length) % members.length;
					currentIndex = newIndex;
					syncIndex(newIndex);
				}}
			>
				<i class="fas fa-chevron-up"></i>
			</button>
			<button
				class="btn btn-outline btn-lg join-item"
				aria-label="Move down"
				onclick={() => {
					const newIndex = (currentIndex + 1) % members.length;
					currentIndex = newIndex;
					syncIndex(newIndex);
				}}
			>
				<i class="fas fa-chevron-down"></i>
			</button>
		</div>
		<button
			class="btn btn-success btn-lg flex gap-2"
			onclick={() => {
				setPresence(true);
			}}
		>
			<i class="fas fa-check"></i>
			{m.present()}
			<Kbd hotkey="L" />
		</button>

		<div class="absolute top-3 right-3">
			<button
				aria-label="Close modal"
				class="btn btn-ghost btn-circle btn-sm"
				onclick={() => {
					active = false;
				}}
			>
				<i class="fa-duotone fa-xmark"></i>
			</button>
		</div>
	</div></Modal
>
