<script
	lang="ts"
	generics="M extends { id: string; representation?: ComponentProps<typeof Flag>['representation'] }, S extends { id: string; committeeMember?: { id: string; representation?: ComponentProps<typeof Flag>['representation'] } | null }"
>
	import type { ComponentProps } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import SponsorPicker from './SponsorPicker.svelte';
	import { createMemberFilter, representationName, sortSponsors } from './sponsors';
	import type { SponsorActions } from './sponsorActions.svelte';

	interface Props {
		sponsors: S[] | null | undefined;
		/** The committee's members, offered to the team as sponsors. */
		members: M[];
		team: boolean;
		myMemberId: string | null;
		actions: SponsorActions;
		/** Whether the viewer may sponsor on their own right now. */
		canSelfSponsor: boolean;
		selfSponsorLabel: string;
		selfSponsorClass: string;
		/** Smaller text and spacing, for the amendment cards. */
		compact?: boolean;
	}

	let {
		sponsors,
		members,
		team,
		myMemberId,
		actions,
		canSelfSponsor,
		selfSponsorLabel,
		selfSponsorClass,
		compact = false
	}: Props = $props();

	const sorted = $derived(sortSponsors(sponsors));
	const size = $derived(
		compact
			? { text: 'text-xs', list: 'space-y-1.5', gap: 'gap-1.5' }
			: { text: 'text-sm', list: 'space-y-2.5', gap: 'gap-2' }
	);

	const getName = (member: M) => representationName(member.representation);
	const filterMembers = createMemberFilter<M>({
		getName,
		exclude: (member) => (sponsors ?? []).some((s) => s.committeeMember?.id === member.id)
	});

	let pickValue = $state('');

	async function addByName() {
		const member = members.find((mem) => getName(mem) === pickValue);
		if (!member) return;
		await actions.add(member.id);
		pickValue = '';
	}
</script>

{#if !sorted.length}
	<p class="text-base-content/50 {size.text}">{m.noSponsorsYet()}</p>
{:else}
	<ul class={size.list}>
		{#each sorted as s (s.id)}
			<li class="flex items-center justify-between gap-2 {size.text}">
				<div class="flex items-center {size.gap}">
					<Flag representation={s.committeeMember?.representation} size="xs" />
					<span>{representationName(s.committeeMember?.representation, '?')}</span>
				</div>
				{#if team || s.committeeMember?.id === myMemberId}
					<button
						class="btn btn-ghost btn-xs"
						aria-label={m.delete()}
						onclick={() => actions.remove(s.id)}
					>
						<i aria-hidden="true" class="ph-fill ph-x text-error"></i>
					</button>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

{#if canSelfSponsor}
	<button class={selfSponsorClass} disabled={actions.busy} onclick={() => actions.add()}>
		<i aria-hidden="true" class="ph-fill ph-handshake"></i>
		{selfSponsorLabel}
	</button>
{/if}

{#if team}
	<SponsorPicker
		bind:value={pickValue}
		{members}
		filter={filterMembers}
		{getName}
		busy={actions.busy}
		add={addByName}
	/>
{/if}
