<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';
	import {
		isTeam,
		amendmentStatusLabel,
		amendmentStatusBadgeClass,
		type AmendmentType,
		type AmendmentStatus,
		type ResolutionViewer
	} from './paperContext';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import Flag from '$lib/components/Flag.svelte';

	interface Props {
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		viewer: ResolutionViewer;
		sponsoringOpen: boolean;
		activeAmendmentId: string | null;
	}

	let {
		paperId,
		committeeId,
		selectedClauseId,
		viewer,
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
		documentNumber: true,
		proposer: { id: true, representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true } },
		sponsors: { id: true, committeeMember: { id: true } }
	});

	// Clause-targeted amendments when a clause is selected; ADD amendments
	// (which target a position, not a clause) surface at the document level.
	const PROCESSED: AmendmentStatus[] = ['CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];
	const isProcessed = (a: { status?: string | null }) =>
		PROCESSED.includes(a.status as AmendmentStatus);

	const scoped = $derived.by(() => {
		const list = amendments ?? [];
		const filtered = selectedClauseId
			? list.filter((a) => a.targetClauseId === selectedClauseId)
			: list.filter((a) => !a.targetClauseId);
		return filtered.slice().sort((a, b) => Number(isProcessed(a)) - Number(isProcessed(b)));
	});

	const myMemberId = $derived(viewer.committeeMemberId ?? null);
	const team = $derived(isTeam(viewer));

	function mySponsorRow(a: (typeof scoped)[number]) {
		return a.sponsors?.find((s) => s.committeeMember?.id === myMemberId);
	}

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
	// Select activeAmendmentId + the activeAmendment relation so the mutation
	// response (and the optimistic layer) update the cached Committee entity
	// directly, rather than relying on the subscription to eventually push it.
	const activeAmendmentSelection = {
		id: true,
		activeAmendmentId: true,
		activeAmendment: {
			id: true,
			type: true,
			documentNumber: true,
			targetClauseId: true,
			targetOperativeIndex: true,
			targetPosition: true,
			newContent: true
		}
	} as const;
	const present = (id: string) =>
		run(id, () =>
			client.mutate.setActiveAmendment({
				__args: { committeeId, amendmentId: id },
				...activeAmendmentSelection
			})
		);
	const unpresent = () =>
		run('unpresent', () =>
			client.mutate.setActiveAmendment({
				__args: { committeeId },
				...activeAmendmentSelection
			})
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
		<div class="flex-1 space-y-3 overflow-y-auto">
			{#each scoped as a (a.id)}
				{@const mine = a.proposer?.id === myMemberId}
				{@const myRow = mySponsorRow(a)}
				{@const isActive = a.id === activeAmendmentId}
				<div
					class="bg-base-100 rounded-lg p-3"
					class:ring-2={isActive}
					class:ring-inset={isActive}
					class:ring-primary={isActive}
				>
					<div class="flex items-center justify-between gap-2">
						<div class="flex items-center gap-1.5">
							<span class="flex items-center gap-1.5 font-mono text-sm font-semibold">
								{#if a.type === 'ADD'}
									<i class="fas fa-plus"></i>
								{:else if a.type === 'DELETE'}
									<i class="fas fa-trash"></i>
								{:else if a.type === 'ALTER_TEXT'}
									<i class="fas fa-pen"></i>
								{:else if a.type === 'ALTER_POSITION'}
									<i class="fas fa-arrows-up-down"></i>
								{/if}
								{#if a.documentNumber}
									{a.documentNumber}
								{/if}
							</span>
						</div>
						<span class="badge badge-sm {amendmentStatusBadgeClass(a.status as AmendmentStatus)}">
							{amendmentStatusLabel(a.status as AmendmentStatus)}
						</span>
					</div>
					<div class="text-base-content/70 mt-2 flex items-center gap-2 text-xs">
						<Flag representation={a.proposer?.representation} size="xs" />
						<span>{getTranslatedCountryNameFromAlpha3Code(a.proposer?.representation?.alpha3Code) ?? a.proposer?.representation?.name ?? m.unknown()}</span>
						<span class="text-base-content/40">·</span>
						<span>{a.sponsors?.length ?? 0} {m.sponsors()}</span>
					</div>
					{#if a.newContent}
						<p class="bg-base-200 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap opacity-80">{a.newContent}</p>
					{/if}

					<div class="mt-3 flex flex-wrap gap-1.5">
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
							{#if isActive}
								<button
									class="btn btn-xs btn-primary"
									disabled={busyId === a.id || busyId === 'unpresent'}
									onclick={() => unpresent()}>{m.stopPresenting()}</button
								>
							{:else}
								<button
									class="btn btn-xs btn-ghost"
									disabled={busyId === a.id}
									onclick={() => present(a.id)}>{m.present()}</button
								>
							{/if}
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

</div>
