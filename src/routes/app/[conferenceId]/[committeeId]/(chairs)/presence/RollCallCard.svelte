<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import dayjs from 'dayjs';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import { rollCallTally } from './presence';

	interface Props {
		/** The roll call under way, if any */
		activeSession: { currentMemberIndex: number } | null;
		/** How many delegations the roll call goes through */
		total: number;
		pastSessions:
			| {
					id: string;
					createdAt: Date;
					completedAt?: Date | null;
					startedBy?: { name?: string | null; userEmail: string } | null;
					presenceEvents: { present: boolean }[];
			  }[]
			| null
			| undefined;
		onOpen: () => void;
	}

	let { activeSession, total, pastSessions, onOpen }: Props = $props();
</script>

<BasicCard data-tour="presence.roll-call">
	<div class="flex flex-col gap-2">
		{#if activeSession}
			<div class="alert alert-info p-2 text-sm">
				<i aria-hidden="true" class="ph-fill ph-info"></i>
				<span>
					{m.rollCallActiveAt({
						index: activeSession.currentMemberIndex + 1,
						total
					})}
				</span>
			</div>
			<button class="btn btn-warning btn-xl" onclick={onOpen}>
				<i aria-hidden="true" class="ph-fill ph-arrow-clockwise mr-2"></i>
				{m.resumeRollCall()}
			</button>
		{:else}
			<button class="btn btn-primary btn-xl" onclick={onOpen}>
				<i aria-hidden="true" class="ph-fill ph-user-focus mr-2"></i>
				{m.rollCall()}
			</button>
		{/if}

		{#if pastSessions && pastSessions.length > 0}
			<details class="group">
				<summary
					class="text-base-content/60 hover:text-base-content flex cursor-pointer select-none list-none items-center gap-1 text-sm transition-colors"
				>
					<i
						aria-hidden="true"
						class="ph-fill ph-caret-right text-xs transition-transform group-open:rotate-90"
					></i>
					{m.pastRollCalls({ count: pastSessions.length })}
				</summary>
				<div class="mt-2 flex flex-col gap-1">
					{#each pastSessions as session (session.id)}
						{@const tally = rollCallTally(session.presenceEvents)}
						<div class="bg-base-200 rounded-lg p-2 text-sm">
							<div class="flex items-center justify-between gap-2">
								<span class="font-medium">
									{dayjs(session.createdAt).format('DD.MM. HH:mm')}
								</span>
								<span class="text-base-content/60 text-xs">
									<span class="text-success font-medium">{tally.present}</span>
									<span class="text-base-content/40">/{tally.total}</span>
								</span>
							</div>
							<div
								class="text-base-content/50 mt-0.5 flex items-center justify-between gap-2 text-xs"
							>
								<span>
									<i aria-hidden="true" class="ph-fill ph-flag-checkered mr-1"></i>
									{dayjs(session.completedAt).format('HH:mm')}
								</span>
								{#if session.startedBy}
									<span class="truncate">
										<i aria-hidden="true" class="ph-fill ph-user mr-1"></i>
										{session.startedBy.name ?? session.startedBy.userEmail}
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</details>
		{/if}
	</div>
</BasicCard>
