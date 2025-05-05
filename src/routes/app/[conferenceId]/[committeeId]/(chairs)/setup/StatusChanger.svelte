<script lang="ts">
	import { graphql, type CommitteeStatusEnum$options } from '$houdini';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import dayjs from 'dayjs';
	import { m } from '$lib/paraglide/messages';
	import toast from 'svelte-french-toast';

	type Props = {
		committeeId: string;
		oldUntil?: Date;
		oldCustomName?: string;
	};
	let { committeeId, oldUntil, oldCustomName = '' }: Props = $props();

	const categories: {
		id: CommitteeStatusEnum$options;
		faIcon: string;
	}[] = [
		{ id: 'FORMAL', faIcon: 'podium' },
		{ id: 'INFORMAL', faIcon: 'comments' },
		{ id: 'PAUSE', faIcon: 'mug-saucer' },
		{ id: 'SUSPENSION', faIcon: 'forward-step' }
	];

	const absoluteTimes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
	const relativeTimes = [3, 5, 10, 15, 20, 25, 30];

	let activeCategory: CommitteeStatusEnum$options = $state('INFORMAL');
	let until = $state(dayjs(oldUntil) ?? dayjs());
	let untilFormatted = $derived(dayjs(until).format('HH:mm:ss'));
	let customName = $state(oldCustomName);

	let customNameOpen = $state(false);

	const StatusChangerMutation = graphql(`
		mutation StatusChanger(
			$status: CommitteeStatusEnum!
			$until: DateTime!
			$customName: String!
			$committeeId: ID!
		) {
			updateCommittee(
				id: $committeeId
				status: $status
				statusUntil: $until
				statusHeadline: $customName
			) {
				id
				status
				statusUntil
				statusHeadline
			}
		}
	`);

	const submitStatus = async () => {
		if (until.isBefore(dayjs())) {
			toast.error(m.dateCannotBeInPast());
		}
		await toast.promise(
			StatusChangerMutation.mutate({
				status: activeCategory,
				until: until.toDate(),
				customName: customName,
				committeeId: committeeId
			}),
			{
				loading: m.updatingStatus(),
				success: m.statusUpdated(),
				error: m.errorUpdatingStatus()
			}
		);
	};

	$effect(() => {
		if (customName) {
			customNameOpen = true;
		}
	});
</script>

<BasicCard>
	<Tabs tabs={categories} bind:activeTab={activeCategory} />
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<i class="fa-duotone fa-clock w-8 text-center text-2xl"></i>
		<div
			class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-12"
		>
			{#each absoluteTimes as time}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() =>
						(until = dayjs().minute(time).second(0).isBefore(dayjs())
							? dayjs().add(1, 'hour').minute(time).second(0)
							: dayjs().minute(time).second(0))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="card bg-base-200 flex flex-row items-center gap-2 p-2">
		<i class="fa-duotone fa-timer w-8 text-center text-2xl"></i>
		<div class="grid flex-1 grid-cols-4 items-center gap-1 md:grid-cols-5 lg:grid-cols-7">
			{#each relativeTimes as time}
				<button
					class="btn bg-base-100 flex-1"
					onclick={() => (until = dayjs().add(time, 'minute'))}
				>
					{time}
				</button>
			{/each}
		</div>
	</div>
	<div class="flex w-full gap-2">
		<input
			type="time"
			class="input input-xl w-full flex-1 text-center font-mono"
			value={untilFormatted}
			onchange={(e) => {
				const inputValue = (e.target as HTMLInputElement).value;
				const parts = inputValue.split(':');
				until = dayjs()
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
			<i class="fa-solid fa-minus"></i>
		</button>
		<button
			class="btn btn-square btn-xl"
			onclick={() => (until = dayjs(until).add(1, 'minute'))}
			aria-label="Increase time"
		>
			<i class="fa-solid fa-plus"></i>
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
			<i class="fa-solid fa-pencil"></i>
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
	<button
		class="btn btn-primary btn-lg w-full {until.isBefore(dayjs()) ? 'btn-disabled' : ''}"
		onclick={() => {
			submitStatus();
		}}
	>
		<i class="fas fa-save mr-2"></i>
		{m.submitStatus()}
	</button>
</BasicCard>
