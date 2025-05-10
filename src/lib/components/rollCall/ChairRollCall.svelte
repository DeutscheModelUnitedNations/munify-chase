<script lang="ts">
	import type { CommitteeTeamQuery$result } from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Modal from '../Modal.svelte';
	import ScrollingCountryList from './ScrollingCountryList.svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { SetPresenceMutation } from '../../../routes/app/[conferenceId]/[committeeId]/(chairs)/presence/presenceMutations';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { localDB } from '$lib/local-db/localDB';

	interface Props {
		active: boolean;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
		committeeId: string;
	}

	let { active = $bindable(), members, committeeId }: Props = $props();

	let currentIndex = $state(0);

	const setPresence = async (present: boolean) => {
		const member = members[currentIndex];
		if (member) {
			await toast.promise(
				SetPresenceMutation.mutate({
					memberIds: [member.id],
					present
				}),
				promiseToastStrings(m.presence(), 'update'),
				{
					duration: 1000,
					position: 'top-right'
				}
			);

			if (currentIndex === members.length - 1) {
				toast.success(m.rollCollSuccess());
				active = false;
			}
			currentIndex = (currentIndex + 1) % members.length;
		} else {
			toast.error(m.rollCollError());
		}
	};

	onMount(() => {
		hotkeys('up, down, left, right, esc', (event, handler) => {
			event.preventDefault();
			switch (handler.key) {
				case 'up':
					currentIndex = (currentIndex - 1 + members.length) % members.length;
					break;
				case 'down':
					currentIndex = (currentIndex + 1) % members.length;
					break;
				case 'left':
					setPresence(false);
					break;
				case 'right':
					setPresence(true);
					break;
				case 'esc':
					active = false;
			}
		});
	});

	$effect(() => {
		console.log('Roll call active:', active);
		console.log('Current index:', currentIndex);
		if (active && currentIndex !== undefined) {
			console.log('Updating roll call index:', currentIndex);
			localDB.committeeSettings.update(committeeId, {
				rollCall: currentIndex
			});
		} else if (!active) {
			currentIndex = 0;
			localDB.committeeSettings.update(committeeId, {
				rollCall: null
			});
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
			<kbd class="kbd">←</kbd>
		</button>
		<div class="join">
			<button
				class="btn btn-outline btn-lg join-item"
				aria-label="Move up"
				onclick={() => {
					currentIndex = (currentIndex - 1 + members.length) % members.length;
				}}
			>
				<i class="fas fa-chevron-up"></i>
			</button>
			<button
				class="btn btn-outline btn-lg join-item"
				aria-label="Move down"
				onclick={() => {
					currentIndex = (currentIndex + 1) % members.length;
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
			<kbd class="kbd">→</kbd>
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
