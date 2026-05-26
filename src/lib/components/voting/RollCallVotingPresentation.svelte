<script lang="ts">
	import Flag from '$lib/components/Flag.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ResultChart from './ResultChart.svelte';
	import { flip } from 'svelte/animate';
	import FlagRow from './FlagRow.svelte';
	import { crossfade } from 'svelte/transition';
	import { sortTranslatedCountries } from '$lib/utils/nationTranslationHelper.svelte';
	import { calculateMajority } from '$lib/utils/majorities';

	interface Props {
		committeeId: string;
		committee?: {
			id: string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
			members: Array<{
				id: string;
				present: boolean;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
					regionalGroup?: string | null;
				} | null;
			}>;
		} | null;
	}
	let { committeeId, committee }: Props = $props();

	const activeSessions = await client.liveQuery.votingSessions({
		__args: {
			where: { committeeId, completedAt: { isNull: true } },
			limit: 1
		},
		id: true,
		mode: true,
		voteName: true,
		majority: true,
		withAbstentions: true,
		votes: { id: true, committeeMemberId: true, vote: true }
	});

	let session = $derived((activeSessions ?? [])[0] ?? null);

	const [send, receive] = crossfade({
		duration: 1000,
		easing: cubicInOut
	});

	const flipOptions = {
		duration: 500,
		delay: 250,
		easing: cubicInOut
	};

	let members = $derived(
		committee?.members
			.filter((member) => member.present && member.representation?.type === 'DELEGATION')
			.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!))
	);

	let votedIds = $derived(session?.votes.map((v) => v.committeeMemberId) ?? []);
	let remainingMembers = $derived(members?.filter((m) => !votedIds.includes(m.id)));
	let proMembers = $derived(
		members?.filter((m) => session?.votes.find((v) => v.committeeMemberId === m.id)?.vote === 'PRO')
	);
	let conMembers = $derived(
		members?.filter((m) => session?.votes.find((v) => v.committeeMemberId === m.id)?.vote === 'CON')
	);
	let abstainMembers = $derived(
		members?.filter(
			(m) => session?.votes.find((v) => v.committeeMemberId === m.id)?.vote === 'ABSTAIN'
		)
	);

	let majorityAmount = $derived.by(() => {
		if (!session || !committee) return 0;
		const abstainCount = session.votes.filter((v) => v.vote === 'ABSTAIN').length;
		switch (session.majority) {
			case 'SIMPLE':
				return calculateMajority((committee.totalPresent ?? 0) - abstainCount, 'simple');
			case 'ABSOLUTE':
				return committee.simpleMajority ?? 0;
			case 'TWO_THIRDS':
				return committee.twoThirdsMajority ?? 0;
			default:
				return 0;
		}
	});
</script>

{#snippet FlagCard(member: NonNullable<typeof members>[number])}
	<div class="card card-bordered bg-base-200 items-center gap-1 p-2 shadow-sm">
		<Flag representation={member.representation} size="sm" />
		<h3 class="font-mono text-lg font-bold uppercase">
			{member.representation?.name || member.representation?.alpha2Code}
		</h3>
	</div>
{/snippet}

{#if session?.mode === 'ROLL_CALL'}
	<div class="modal modal-open">
		<div
			class="modal-box bg-base-200 relative flex h-full max-h-11/12 w-full max-w-11/12 flex-col gap-4"
			in:fly={{ y: 100, duration: 1000, easing: cubicOut }}
			out:fly={{ y: 100, duration: 1000, easing: cubicIn }}
		>
			<h2 class="w-full text-center text-4xl font-bold">
				{session.voteName || m.rollCallVoting()}
			</h2>

			<ResultChart
				{majorityAmount}
				votesAbstain={abstainMembers?.length}
				votesCon={conMembers?.length}
				votesPro={proMembers?.length}
				total={members?.length}
			/>

			<FlagRow faIcon="arrow-right" countValue={remainingMembers?.length}>
				{#each remainingMembers ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>

			<FlagRow color="success" faIcon="circle-plus" countValue={proMembers?.length}>
				{#each proMembers?.toReversed() ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>

			{#if session.withAbstentions}
				<FlagRow color="info" faIcon="circle" countValue={abstainMembers?.length}>
					{#each abstainMembers?.toReversed() ?? [] as member (member.id)}
						<div
							animate:flip={flipOptions}
							in:receive={{ key: member.id }}
							out:send={{ key: member.id }}
						>
							{@render FlagCard(member)}
						</div>
					{/each}
				</FlagRow>
			{/if}

			<FlagRow color="error" faIcon="circle-minus" countValue={conMembers?.length}>
				{#each conMembers?.toReversed() ?? [] as member (member.id)}
					<div
						animate:flip={flipOptions}
						in:receive={{ key: member.id }}
						out:send={{ key: member.id }}
					>
						{@render FlagCard(member)}
					</div>
				{/each}
			</FlagRow>
		</div>
	</div>
{/if}
