<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import AmendmentComposer from './AmendmentComposer.svelte';
	import {
		isTeam,
		amendmentTypeLabel,
		amendmentStatusLabel,
		amendmentStatusBadgeClass,
		type AmendmentType,
		type AmendmentStatus,
		type ResolutionViewer
	} from './paperContext';

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		selectedClauseIndex: number | null;
		operativeCount: number;
		viewer: ResolutionViewer;
		submissionOpen: boolean;
		sponsoringOpen: boolean;
		activeAmendmentId: string | null;
	}

	let {
		paperId,
		committeeId,
		selectedClauseId,
		selectedClauseIndex,
		operativeCount,
		viewer,
		submissionOpen,
		sponsoringOpen,
		activeAmendmentId
	}: Props = $props();

	const amendments = await client.liveQuery.amendments({
		__args: { where: { paper: { id: paperId } }, orderBy: { createdAt: 'asc' } },
		id: true,
		type: true,
		status: true,
		targetClauseId: true,
		newContent: true,
		targetPosition: true,
		proposer: { id: true, representation: { name: true } },
		sponsors: { id: true, committeeMember: { id: true } }
	});

	// Clause-targeted amendments when a clause is selected; ADD amendments
	// (which target a position, not a clause) surface at the document level.
	const scoped = $derived.by(() => {
		const list = amendments ?? [];
		if (selectedClauseId) return list.filter((a) => a.targetClauseId === selectedClauseId);
		return list.filter((a) => !a.targetClauseId);
	});

	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const team = $derived(isTeam(viewer));
	const canPropose = $derived(!team && !!myMemberId && submissionOpen);

	function mySponsorRow(a: (typeof scoped)[number]) {
		return a.sponsors?.find((s) => s.committeeMember?.id === myMemberId);
	}

	let composerOpen = $state(false);
	let busyId = $state<string | null>(null);

	async function run(id: string, fn: () => Promise<unknown>, successMsg?: string) {
		busyId = id;
		try {
			await fn();
			if (successMsg) toast.success(successMsg);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Action failed');
		} finally {
			busyId = null;
		}
	}

	const submit = (id: string) =>
		run(
			id,
			() => client.mutate.submitAmendment({ __args: { id }, id: true }),
			m.amendmentSubmitted()
		);
	const withdraw = (id: string) => run(id, () => client.mutate.deleteAmendment({ __args: { id } }));
	const accept = (id: string, consensus: boolean) =>
		run(
			id,
			() => client.mutate.acceptAmendment({ __args: { id, consensus }, id: true }),
			m.amendmentApplied()
		);
	const reject = (id: string) =>
		run(id, () => client.mutate.rejectAmendment({ __args: { id }, id: true }));
	const present = (id: string) =>
		run(id, () =>
			client.mutate.setActiveAmendment({ __args: { committeeId, amendmentId: id }, id: true })
		);
	const sponsor = (id: string) =>
		run(id, () =>
			client.mutate.addAmendmentSponsor({ __args: { id: nanoid(), amendmentId: id }, id: true })
		);
	const unsponsor = (sponsorId: string, amendmentId: string) =>
		run(amendmentId, () => client.mutate.removeAmendmentSponsor({ __args: { id: sponsorId } }));
</script>

<div class="flex h-full flex-col gap-3">
	{#if !scoped.length}
		<p class="text-base-content/50 py-6 text-center text-sm">
			{selectedClauseId ? m.noAmendmentsForClause() : m.noDocumentAmendments()}
		</p>
	{:else}
		<div class="flex-1 space-y-2 overflow-y-auto">
			{#each scoped as a (a.id)}
				{@const mine = a.proposer?.id === myMemberId}
				{@const myRow = mySponsorRow(a)}
				{@const isActive = a.id === activeAmendmentId}
				<div
					class="bg-base-100 rounded-lg p-2"
					class:ring-2={isActive}
					class:ring-primary={isActive}
				>
					<div class="flex items-center justify-between gap-2">
						<span class="badge badge-sm badge-outline"
							>{amendmentTypeLabel(a.type as AmendmentType)}</span
						>
						<span class="badge badge-sm {amendmentStatusBadgeClass(a.status as AmendmentStatus)}">
							{amendmentStatusLabel(a.status as AmendmentStatus)}
						</span>
					</div>
					<div class="text-base-content/70 mt-1 text-xs">
						{a.proposer?.representation?.name ?? '?'} · {a.sponsors?.length ?? 0}
						{m.sponsors()}
					</div>
					{#if a.newContent}
						<p class="mt-1 font-mono text-xs whitespace-pre-wrap opacity-80">{a.newContent}</p>
					{/if}

					<div class="mt-2 flex flex-wrap gap-1">
						{#if mine && a.status === 'PENDING'}
							<button
								class="btn btn-xs btn-primary"
								disabled={busyId === a.id}
								onclick={() => submit(a.id)}>{m.submit()}</button
							>
							<button
								class="btn btn-xs btn-ghost"
								disabled={busyId === a.id}
								onclick={() => withdraw(a.id)}>{m.withdraw()}</button
							>
						{/if}

						{#if !mine && !team && myMemberId && sponsoringOpen && a.status !== 'REJECTED' && a.status !== 'WITHDRAWN'}
							{#if myRow}
								<button
									class="btn btn-xs btn-ghost"
									disabled={busyId === a.id}
									onclick={() => unsponsor(myRow.id, a.id)}>{m.removeSponsorship()}</button
								>
							{:else}
								<button
									class="btn btn-xs btn-outline"
									disabled={busyId === a.id}
									onclick={() => sponsor(a.id)}>{m.sponsorAmendment()}</button
								>
							{/if}
						{/if}

						{#if team && (a.status === 'SUBMITTED' || a.status === 'PENDING')}
							<button
								class="btn btn-xs btn-ghost"
								disabled={busyId === a.id}
								onclick={() => present(a.id)}>{m.present()}</button
							>
							<button
								class="btn btn-xs btn-success"
								disabled={busyId === a.id}
								onclick={() => accept(a.id, true)}>{m.adoptByConsensus()}</button
							>
							<button
								class="btn btn-xs btn-success btn-outline"
								disabled={busyId === a.id}
								onclick={() => accept(a.id, false)}>{m.accept()}</button
							>
							<button
								class="btn btn-xs btn-error btn-outline"
								disabled={busyId === a.id}
								onclick={() => reject(a.id)}>{m.reject()}</button
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	{#if canPropose}
		<button class="btn btn-primary btn-sm" onclick={() => (composerOpen = true)}>
			<i class="fas fa-plus"></i>
			{m.proposeAmendment()}
		</button>
	{/if}
</div>

<AmendmentComposer
	bind:open={composerOpen}
	{paperId}
	{selectedClauseId}
	{selectedClauseIndex}
	{operativeCount}
	close={() => (composerOpen = false)}
/>
