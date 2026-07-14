<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	const _rawStats = await client.query.myStats({
		__args: { conferenceId },
		speaking: {
			totalSeconds: true,
			speechCount: true,
			commentCount: true,
			avgSpeechSeconds: true,
			longestSpeechSeconds: true,
			avgWaitSeconds: true,
			speakingPercentile: true,
			speakingToAttendanceRatio: true
		},
		attendance: {
			totalSeconds: true,
			committeesCount: true
		},
		voting: {
			pro: true,
			con: true,
			abstain: true,
			total: true
		},
		activity: {
			papersSponsored: true,
			amendmentsProposed: true,
			amendmentsAccepted: true
		}
	});

	// Keep the last valid stats so that a transient null from the observable
	// (e.g. a failed background re-fetch) doesn't blank the already-visible UI.
	let stats = $state(_rawStats);
	$effect(() => {
		if (_rawStats != null) stats = _rawStats;
	});

	// stats sub-objects are plain values at runtime; cast to avoid function-type confusion from generated types.
	// All four are $derived so they stay in sync when stats is updated by the $effect above.
	const speaking = $derived(
		stats?.speaking as
			| {
					totalSeconds: number;
					speechCount: number;
					commentCount: number;
					avgSpeechSeconds: number;
					longestSpeechSeconds: number;
					avgWaitSeconds: number;
					speakingPercentile: number;
					speakingToAttendanceRatio: number;
			  }
			| null
			| undefined
	);
	const attendance = $derived(
		stats?.attendance as { totalSeconds: number; committeesCount: number } | null | undefined
	);
	const voting = $derived(
		stats?.voting as { pro: number; con: number; abstain: number; total: number } | null | undefined
	);
	const activity = $derived(
		stats?.activity as
			| { papersSponsored: number; amendmentsProposed: number; amendmentsAccepted: number }
			| null
			| undefined
	);

	function fmtTime(s: number): string {
		if (s <= 0) return '0s';
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const sec = s % 60;
		if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
		if (m > 0) return `${m}m ${String(sec).padStart(2, '0')}s`;
		return `${sec}s`;
	}

	const hasSpeaking = $derived((speaking?.speechCount ?? 0) + (speaking?.commentCount ?? 0) > 0);
	const hasVoting = $derived((voting?.total ?? 0) > 0);
	const hasActivity = $derived(
		(activity?.papersSponsored ?? 0) + (activity?.amendmentsProposed ?? 0) > 0
	);
</script>

<section>
	<h2 class="text-base-content/70 mb-4 text-lg font-semibold">{m.myStatistics()}</h2>

	{#if !stats}
		<p class="text-base-content/40 text-sm">{m.noSpeakingDataYet()}</p>
	{:else}
		<!-- Attendance + queue wait — fills 2 columns; attendance spans full width when no speaking data -->
		<div class="mb-4 grid grid-cols-2 gap-4">
			<div class="card bg-base-100" class:col-span-2={!hasSpeaking}>
				<div class="card-body gap-1 p-5">
					<div class="flex items-start justify-between">
						<p class="text-base-content/60 text-sm font-medium">{m.totalAttendanceTime()}</p>
						<div class="bg-info/10 rounded-lg p-2">
							<i class="fa-duotone fa-clock text-info text-lg"></i>
						</div>
					</div>
					<p class="font-mono text-3xl font-bold tabular-nums">
						{fmtTime(attendance?.totalSeconds ?? 0)}
					</p>
					<p class="text-base-content/50 text-xs">
						{attendance?.committeesCount ?? 0}
						{m.statCommittees().toLowerCase()}
					</p>
				</div>
			</div>

			{#if hasSpeaking}
				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.avgWaitTime()}</p>
							<div class="bg-warning/10 rounded-lg p-2">
								<i class="fa-duotone fa-hourglass-half text-warning text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{fmtTime(Math.round(speaking?.avgWaitSeconds ?? 0))}
						</p>
						<p class="text-base-content/50 text-xs">{m.avgWaitTime()}</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Voting breakdown — full-width row when present -->
		{#if hasVoting}
			<div class="mb-4">
				<div class="card bg-base-100">
					<div class="card-body gap-2 p-5">
						<p class="text-base-content/60 text-sm font-medium">{m.votingRecord()}</p>
						<div class="flex items-end gap-4">
							<div class="flex flex-col items-center gap-1">
								<p class="font-mono text-2xl font-bold text-success tabular-nums">
									{voting?.pro ?? 0}
								</p>
								<span class="badge badge-success badge-sm">PRO</span>
							</div>
							<div class="flex flex-col items-center gap-1">
								<p class="font-mono text-2xl font-bold text-error tabular-nums">
									{voting?.con ?? 0}
								</p>
								<span class="badge badge-error badge-sm">CON</span>
							</div>
							<div class="flex flex-col items-center gap-1">
								<p class="text-base-content/50 font-mono text-2xl font-bold tabular-nums">
									{voting?.abstain ?? 0}
								</p>
								<span class="badge badge-ghost badge-sm">ABSTAIN</span>
							</div>
							<div class="flex-1">
								{#if (voting?.total ?? 0) > 0}
									<div class="flex h-4 w-full overflow-hidden rounded-full">
										<div
											class="bg-success"
											style="width:{((voting?.pro ?? 0) / (voting?.total ?? 1)) * 100}%"
										></div>
										<div
											class="bg-error"
											style="width:{((voting?.con ?? 0) / (voting?.total ?? 1)) * 100}%"
										></div>
										<div
											class="bg-base-300"
											style="width:{((voting?.abstain ?? 0) / (voting?.total ?? 1)) * 100}%"
										></div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Speaking cards — 3-column grid fills full width -->
		{#if hasSpeaking}
			<div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.totalSpeakingTime()}</p>
							<div class="bg-primary/10 rounded-lg p-2">
								<i class="fa-duotone fa-microphone text-primary text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{fmtTime(speaking?.totalSeconds ?? 0)}
						</p>
						<p class="text-base-content/50 text-xs">
							{m.betterThanPct({ pct: String(speaking?.speakingPercentile ?? 0) })}
						</p>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.formalSpeeches()}</p>
							<div class="rounded-lg bg-success/10 p-2">
								<i class="fa-duotone fa-podium text-success text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{speaking?.speechCount ?? 0}
						</p>
						<p class="text-base-content/50 text-xs">
							{m.avgSpeechLength()}: {fmtTime(Math.round(speaking?.avgSpeechSeconds ?? 0))}
						</p>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.commentInterventions()}</p>
							<div class="bg-secondary/10 rounded-lg p-2">
								<i class="fa-duotone fa-comment-dots text-secondary text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{speaking?.commentCount ?? 0}
						</p>
						<p class="text-base-content/50 text-xs">
							{m.longestSpeech()}: {fmtTime(speaking?.longestSpeechSeconds ?? 0)}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Activity -->
		{#if hasActivity}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.papersSponsored()}</p>
							<div class="bg-primary/10 rounded-lg p-2">
								<i class="fa-duotone fa-file-lines text-primary text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{activity?.papersSponsored ?? 0}
						</p>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.proposed()}</p>
							<div class="rounded-lg bg-warning/10 p-2">
								<i class="fa-duotone fa-pen-to-square text-warning text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold tabular-nums">
							{activity?.amendmentsProposed ?? 0}
						</p>
						<p class="text-base-content/50 text-xs">{m.amendments()}</p>
					</div>
				</div>

				<div class="card bg-base-100">
					<div class="card-body gap-1 p-5">
						<div class="flex items-start justify-between">
							<p class="text-base-content/60 text-sm font-medium">{m.amendmentStatusAccepted()}</p>
							<div class="rounded-lg bg-success/10 p-2">
								<i class="fa-duotone fa-circle-check text-success text-lg"></i>
							</div>
						</div>
						<p class="font-mono text-3xl font-bold text-success tabular-nums">
							{activity?.amendmentsAccepted ?? 0}
						</p>
						<p class="text-base-content/50 text-xs">{m.amendments()}</p>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</section>
