<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import type { CommitteestatusEnum } from '#lib/api/rumbleClient/client';
	import Tabs from '#lib/components/Tabs.svelte';
	import dayjs from 'dayjs';
	import { m } from '#lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '#lib/utils/toast';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import ChangerActions from './ChangerActions.svelte';

	type Props = {
		committeeId: string;
		oldStatus?: CommitteestatusEnum;
		oldUntil?: Date;
		oldCustomName?: string;
		hasModeratedCaucus?: boolean;
		abort?: () => void;
	};
	let {
		committeeId,
		oldStatus,
		oldUntil,
		oldCustomName = '',
		hasModeratedCaucus = false,
		abort
	}: Props = $props();

	const categories = $derived([
		{ id: 'FORMAL' as CommitteestatusEnum, icon: 'lectern', tooltip: m.formalDebate() },
		{ id: 'INFORMAL' as CommitteestatusEnum, icon: 'chats', tooltip: m.informalCaucus() },
		{ id: 'PAUSE' as CommitteestatusEnum, icon: 'coffee', tooltip: m.pause() },
		{ id: 'SUSPENSION' as CommitteestatusEnum, icon: 'skip-forward', tooltip: m.suspension() },
		...(hasModeratedCaucus
			? [
					{
						id: 'MODERATED_INFORMAL' as CommitteestatusEnum,
						icon: 'chats-circle',
						tooltip: m.moderatedInformalCaucus()
					}
				]
			: [])
	]);

	const absoluteTimes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
	const relativeTimes = [3, 5, 10, 15, 20, 25, 30];

	let activeCategory: CommitteestatusEnum = $state('INFORMAL');
	// eslint-disable-next-line svelte/prefer-writable-derived -- writable and reactive to prop changes
	let until = $state(getServerTime());
	$effect(() => {
		until = dayjs(oldUntil) ?? getServerTime();
	});
	let untilFormatted = $derived(dayjs(until).format('HH:mm:ss'));
	// eslint-disable-next-line svelte/prefer-writable-derived -- writable and reactive to prop changes
	let customName = $state('');
	$effect(() => {
		customName = oldCustomName;
	});

	let customNameOpen = $state(false);

	const submitStatus = async () => {
		if (until.isBefore(getServerTime())) {
			toast.error(m.dateCannotBeInPast());
		}
		await toast.promise(
			client.mutate.updateCommittee({
				__args: {
					id: committeeId,
					status: activeCategory,
					statusUntil: until.toDate(),
					statusHeadline: customName
				},
				id: true
			}),
			promiseToastStrings(m.committeeStatus(), 'update')
		);
	};

	$effect(() => {
		if (customName) {
			customNameOpen = true;
		}
	});

	$effect(() => {
		if (oldStatus) {
			switch (oldStatus) {
				case 'FORMAL':
					activeCategory = 'INFORMAL';
					break;
				default:
					activeCategory = 'FORMAL';
					break;
			}
		}
	});
</script>

<div class="flex flex-col gap-4">
	<Tabs tabs={categories} bind:activeTab={activeCategory} />
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<div class="tooltip tooltip-right flex items-center" data-tip={m.minuteOfTheHour()}>
			<i aria-hidden="true" class="ph-duotone ph-clock w-8 text-center text-2xl"></i>
		</div>
		<div
			class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-12"
		>
			{#each absoluteTimes as time (time)}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() =>
						(until = getServerTime().minute(time).second(0).isBefore(getServerTime())
							? getServerTime().add(1, 'hour').minute(time).second(0)
							: getServerTime().minute(time).second(0))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<div class="tooltip tooltip-right flex items-center" data-tip={m.minutesFromNow()}>
			<i aria-hidden="true" class="ph-duotone ph-timer w-8 text-center text-2xl"></i>
		</div>
		<div class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-7">
			{#each relativeTimes as time (time)}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() => (until = getServerTime().add(time, 'minute'))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="flex w-full gap-2">
		<input
			type="time"
			aria-label={m.a11yStatusEndTime()}
			class="input input-xl w-full flex-1 text-center font-mono"
			value={untilFormatted}
			onchange={(e) => {
				const inputValue = (e.target as HTMLInputElement).value;
				const parts = inputValue.split(':');
				until = getServerTime()
					.hour(parseInt(parts[0], 10))
					.minute(parseInt(parts[1], 10))
					.second(parseInt(parts[2], 10));
			}}
			step="1"
		/>
		<button
			class="btn btn-square btn-xl"
			aria-label="Decrease time"
			onclick={() => (until = dayjs(until).subtract(1, 'minute'))}
		>
			<i aria-hidden="true" class="ph-fill ph-minus"></i>
		</button>
		<button
			class="btn btn-square btn-xl"
			onclick={() => (until = dayjs(until).add(1, 'minute'))}
			aria-label="Increase time"
		>
			<i aria-hidden="true" class="ph-fill ph-plus"></i>
		</button>
		<button
			class="btn btn-square btn-xl {customNameOpen ? 'btn-primary' : ''}"
			onclick={() => {
				if (customNameOpen) {
					customNameOpen = false;
					customName = '';
				} else {
					customNameOpen = true;
				}
			}}
			aria-label="Increase time"
		>
			<i aria-hidden="true" class="ph-fill ph-tag"></i>
		</button>
	</div>
	{#if customNameOpen}
		<input
			type="text"
			class="input w-full flex-1 py-2 text-center"
			bind:value={customName}
			placeholder={m.customName()}
		/>
	{/if}
	<ChangerActions
		{abort}
		onsubmit={submitStatus}
		submitLabel={m.submitStatus()}
		submitDisabled={until.isBefore(getServerTime())}
	/>
</div>
