<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { client } from '$lib/api/rumbleClient/client';
	import { promiseToastStrings } from '$lib/utils/toast';

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

	// IDs of members whose presence change is still saving. Shown as a spinner in
	// the chair view only; the presentation view derives presence state from the
	// server via GraphQL subscription.
	let pendingIds = $state<string[]>([]);

	const setPresence = (present: boolean) => {
		const member = members[currentIndex];
		if (!member) {
			toast.error(m.rollCallError());
			return;
		}

		const id = member.id;
		pendingIds = [...pendingIds, id];

		toast
			.promise(
				client.mutate.setPresenceForCommitteeMembers({
					__args: { ids: [id], present, rollCallSessionId: sessionId },
					id: true,
					present: true
				}),
				promiseToastStrings(m.presence(), 'update'),
				{
					duration: 1000,
					position: 'top-right'
				}
			)
			.finally(() => {
				pendingIds = pendingIds.filter((x) => x !== id);
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
			hotkeys('up, down, j, l, esc', 'rollCall', (event, handler) => {
				event.preventDefault();
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
			});
			hotkeys.setScope('rollCall');

			// Start a server-side session so the presentation view can mirror progress
			client.mutate
				.startRollCallSession({
					__args: { committeeId },
					id: true,
					currentMemberIndex: true
				})
				.then((result) => {
					sessionId = result.id;
					currentIndex = result.currentMemberIndex;
				})
				.catch(() => {
					toast.error(m.rollCallError());
					active = false;
				});
		} else {
			hotkeys.deleteScope('rollCall');

			if (sessionId) {
				client.mutate.completeRollCallSession({ __args: { id: sessionId } }).catch(() => {});
				sessionId = null;
			}

			currentIndex = 0;
			pendingIds = [];
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
	<ScrollingCountryList {members} {currentIndex} {pendingIds} />

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
