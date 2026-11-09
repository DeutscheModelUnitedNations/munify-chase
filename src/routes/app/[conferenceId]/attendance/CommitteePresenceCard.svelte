<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import NsaRow from './NsaRow.svelte';
	import {
		delegateStat,
		elapsedSince,
		isStaleCheckIn,
		presenceBadgeClass,
		STALE_CHECK_IN_HOURS
	} from './attendance';

	interface Props {
		conferenceId: string;
		committee: {
			id: string;
			name: string;
			abbreviation?: string | null;
			totalPresent?: number | null;
			members?: { representation?: { type?: string | null } | null }[] | null;
		};
		/** The check-ins currently open in this committee */
		events: {
			id: string;
			timestamp: string | Date;
			conferenceUser?: {
				name?: string | null;
				userEmail?: string | null;
				conferenceMember?: {
					representation?: { name?: string | null; icon?: string | null } | null;
				} | null;
			} | null;
		}[];
	}

	let { conferenceId, committee, events }: Props = $props();

	let now = $derived(getServerTime().valueOf());
	let stat = $derived(delegateStat(committee));

	function durationLabel(ts: string | Date) {
		const { minutes, hours, restMinutes } = elapsedSince({ ts, now });
		if (minutes < 60) return m.minutesShort({ count: minutes });
		return m.hoursMinutesShort({ hours, minutes: restMinutes });
	}
</script>

<BasicCard>
	<div class="mb-4">
		<h2 class="text-2xl font-bold">
			<a
				href={resolve('/app/[conferenceId]/[committeeId]/(chairs)/setup', {
					conferenceId,
					committeeId: committee.id
				})}
				class="hover:underline"
			>
				{committee.name} (<span style="view-transition-name: committee-abbr-{committee.id};"
					>{committee.abbreviation ?? ''}</span
				>)
			</a>
		</h2>
	</div>
	<div class="-mt-3 mb-3 flex flex-wrap items-center gap-2">
		<span class="badge badge-sm {presenceBadgeClass(stat)} tabular-nums" title={m.delegatePresence()}>
			{m.delegatesPresentOfTotal({ present: stat.present, total: stat.total })}
		</span>
	</div>
	{#if events.length === 0}
		<p class="text-base-content/50 py-2 text-sm">{m.noNsasInCommittee()}</p>
	{:else}
		<ul class="flex flex-col gap-1">
			{#each events as event (event.id)}
				{@const user = event.conferenceUser}
				{@const rep = user?.conferenceMember?.representation}
				<NsaRow
					icon={rep?.icon}
					name={user?.name ?? user?.userEmail ?? m.unknown()}
					orgName={rep?.name}
				>
					<span class="text-base-content/60 text-sm">
						{durationLabel(event.timestamp)}
					</span>
					{#if isStaleCheckIn({ ts: event.timestamp, now })}
						<span
							class="badge badge-warning"
							title={m.forgottenCheckoutWarning({ hours: STALE_CHECK_IN_HOURS })}
						>
							<i aria-hidden="true" class="ph-fill ph-warning"></i>
							<span class="sr-only">{m.forgottenCheckoutWarning({ hours: STALE_CHECK_IN_HOURS })}</span>
						</span>
					{/if}
				</NsaRow>
			{/each}
		</ul>
	{/if}
</BasicCard>
