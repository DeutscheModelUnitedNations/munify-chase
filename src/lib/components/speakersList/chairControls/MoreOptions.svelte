<script lang="ts">
	import { client, type SpeakerslistcategoryEnum } from '#lib/api/rumbleClient/client';
	import { registerCommands } from '#lib/commands/registry.svelte';
	import Popover from '#lib/components/Popover.svelte';
	import { m } from '#lib/paraglide/messages';
	import Tabs from '#lib/components/Tabs.svelte';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { alertDialog } from '#lib/components/Alert/alert';
	import Modal from '#lib/components/Modal.svelte';
	import dayjs from 'dayjs';
	import { listCommandScope } from './listCommands';
	import {
		firstSpeaker,
		hasSpeakers,
		listLabel,
		renameTarget,
		toggleClosedCommand
	} from './listOptions';

	interface Props {
		type: SpeakerslistcategoryEnum;
		speakersList?: {
			id: string;
			type: string;
			isClosed: boolean;
			speakingTime: number;
			startTimestamp?: Date | null;
			timeLeft: number;
			speakers: Array<{ id: string; position: number; overwriteName?: string | null }>;
		} | null;
	}

	let { type, speakersList }: Props = $props();

	let isOpen = $state(false);

	let changeSpeakersNameModalOpen = $state(false);
	let changeSpeakersNameValue = $state('');
	let changeSpeakingTimeModalOpen = $state(false);
	let changeSpeakingTimeValue = $state(0);
	let chageSpeakingTimeDisplayValue = $derived(
		dayjs.duration(changeSpeakingTimeValue, 'seconds').format('mm:ss')
	);

	const closeListTabs = [
		{
			id: false,
			icon: 'lock-open'
		},
		{
			id: true,
			icon: 'lock'
		}
	];

	const openOrCloseList = async (isClosed: boolean) => {
		if (!speakersList?.id) return;
		await toast.promise(
			client.mutate.updateSpeakersList({
				__args: { id: speakersList.id, isClosed },
				id: true,
				isClosed: true
			}),
			promiseToastStrings(listLabel(speakersList.type), 'update')
		);
	};

	const clearList = async () => {
		if (!speakersList?.id) return;
		isOpen = false;
		if (
			await alertDialog({
				title: m.clearList(),
				description: m.clearListDescription(),
				confirmText: m.yes(),
				cancelText: m.abort(),
				confirmColor: 'error'
			})
		) {
			await toast.promise(
				client.mutate.clearSpeakersList({
					__args: { id: speakersList.id },
					id: true,
					speakers: { id: true }
				}),
				promiseToastStrings(listLabel(speakersList.type), 'delete')
			);
		}
	};

	const changeSpeakersName = async () => {
		const target = renameTarget({ list: speakersList, name: changeSpeakersNameValue });
		if (target === 'skip') return;
		if (target === 'noSpeaker') {
			toast.error(m.noCurrentSpeaker());
			return;
		}
		await toast.promise(
			client.mutate.updateSpeakerOnList({
				__args: { id: target.speakerId, overwriteName: changeSpeakersNameValue },
				id: true,
				overwriteName: true
			}),
			promiseToastStrings(listLabel(target.listType), 'update')
		);
		changeSpeakersNameModalOpen = false;
	};

	const changeSpeakersTime = async () => {
		if (!speakersList?.id || changeSpeakingTimeValue < 0) return;

		await toast.promise(
			client.mutate.updateSpeakersList({
				__args: {
					id: speakersList.id,
					speakingTime: changeSpeakingTimeValue,
					timeLeft: changeSpeakingTimeValue
				},
				id: true,
				speakingTime: true,
				timeLeft: true
			}),
			promiseToastStrings(listLabel(speakersList.type), 'update')
		);
		changeSpeakingTimeModalOpen = false;
	};

	const openChangeSpeakersNameModal = () => {
		if (!hasSpeakers(speakersList)) return;
		changeSpeakersNameModalOpen = true;
		isOpen = false;
	};

	const openChangeSpeakingTimeModal = () => {
		changeSpeakingTimeModalOpen = true;
		isOpen = false;
	};

	const toggleListClosed = () => openOrCloseList(!speakersList?.isClosed);

	registerCommands(() => {
		const { idPrefix, context, keywords } = listCommandScope(type);
		const toggleClosed = toggleClosedCommand(!!speakersList?.isClosed);
		return [
			{
				id: `${idPrefix}.toggle-closed`,
				title: toggleClosed.title,
				context,
				keywords,
				group: 'page',
				icon: toggleClosed.icon,
				run: toggleListClosed
			},
			{
				id: `${idPrefix}.change-speaker-name`,
				title: m.changeSpeakersName,
				context,
				keywords,
				group: 'page',
				icon: 'pencil-simple',
				enabled: () => hasSpeakers(speakersList),
				run: openChangeSpeakersNameModal
			},
			{
				id: `${idPrefix}.change-speaking-time`,
				title: m.changeSpeakersTime,
				context,
				keywords,
				group: 'page',
				icon: 'timer',
				run: openChangeSpeakingTimeModal
			},
			{
				id: `${idPrefix}.clear-list`,
				title: m.clearList,
				context,
				keywords,
				group: 'page',
				icon: 'trash',
				run: clearList
			}
		];
	});

	$effect(() => {
		if (speakersList?.speakingTime != null) {
			changeSpeakingTimeValue = speakersList.speakingTime;
		}
	});

	$effect(() => {
		if (hasSpeakers(speakersList)) {
			changeSpeakersNameValue = firstSpeaker(speakersList)?.overwriteName || '';
		}
	});
</script>

<Popover bind:open={isOpen}>
	{#snippet Trigger({ props })}
		<button {...props} class="btn btn-lg" aria-label="More options">
			<i aria-hidden="true" class="ph-fill ph-gear-six"> </i>
		</button>
	{/snippet}
	{#snippet Content()}
		<div class="flex flex-col gap-2">
			<Tabs
				tabs={closeListTabs}
				activeTab={!!speakersList?.isClosed}
				onTabChange={(newStatus) => openOrCloseList(newStatus)}
			/>
			<button
				class={speakersList?.speakers?.length ? 'btn' : 'btn btn-disabled'}
				disabled={!speakersList?.speakers?.length}
				onclick={openChangeSpeakersNameModal}
			>
				<i aria-hidden="true" class="ph-fill ph-pencil-simple"></i>
				{m.changeSpeakersName()}
			</button>
			<button class="btn" onclick={openChangeSpeakingTimeModal}>
				<i aria-hidden="true" class="ph-fill ph-timer"></i>
				{m.changeSpeakersTime()}
			</button>
			<button class="btn btn-error" onclick={clearList}>
				<i aria-hidden="true" class="ph-fill ph-trash"></i>
				{m.clearList()}
			</button>
		</div>
	{/snippet}
</Popover>

<Modal bind:open={changeSpeakersNameModalOpen}>
	<h1 class="mb-2 text-2xl font-bold">{m.changeSpeakersName()}</h1>
	<input
		type="text"
		class="input input-lg w-full"
		bind:value={changeSpeakersNameValue}
		placeholder={m.speakersListNamePlaceholder()}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				changeSpeakersName();
			} else if (e.key === 'Escape') {
				changeSpeakersNameModalOpen = false;
			}
		}}
	/>
	<div class="modal-action">
		<button class="btn" onclick={() => (changeSpeakersNameModalOpen = false)}>
			{m.abort()}
		</button>
		<button class="btn btn-primary" onclick={changeSpeakersName}>
			{m.save()}
		</button>
	</div>
</Modal>

<Modal bind:open={changeSpeakingTimeModalOpen}>
	<h1 class="mb-2 text-2xl font-bold">{m.changeSpeakersTime()}</h1>
	<input
		class="input input-lg w-full"
		value={chageSpeakingTimeDisplayValue}
		type="time"
		onchange={(e: Event) => {
			const target = e.target as HTMLInputElement;
			const [minutes, seconds] = target.value.split(':').map(Number);
			changeSpeakingTimeValue = minutes * 60 + seconds;
		}}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				changeSpeakersTime();
			} else if (e.key === 'Escape') {
				changeSpeakingTimeModalOpen = false;
			}
		}}
	/>
	<div class="modal-action">
		<button class="btn" onclick={() => (changeSpeakingTimeModalOpen = false)}>
			{m.abort()}
		</button>
		<button class="btn btn-primary" onclick={changeSpeakersTime}>
			{m.save()}
		</button>
	</div>
</Modal>
