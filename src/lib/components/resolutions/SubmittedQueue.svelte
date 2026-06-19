<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
		paperHref: (id: string) => string;
		/** Suggested number of draft resolutions to promote (GO default 3). */
		suggestN?: number;
	}

	let { committeeId, paperHref, suggestN = 3 }: Props = $props();

	const submitted = await client.liveQuery.resolutionPapers({
		__args: { where: { committee: { id: committeeId }, status: 'SUBMITTED' } },
		id: true,
		title: true,
		documentNumber: true,
		creatorCommitteeMember: { id: true, representation: { name: true } },
		sponsors: { id: true }
	});

	// Rank by sponsor count desc; the top `suggestN` are visually suggested.
	const ranked = $derived(
		[...(submitted ?? [])].sort((a, b) => (b.sponsors?.length ?? 0) - (a.sponsors?.length ?? 0))
	);

	let promotingId = $state<string | null>(null);
	const docNumbers = $state<Record<string, string>>({});

	async function promote(id: string) {
		promotingId = id;
		try {
			await client.mutate.updateResolutionPaper({
				__args: {
					id,
					status: 'DRAFT_RESOLUTION',
					documentNumber: docNumbers[id]?.trim() || undefined
				},
				id: true
			});
			toast.success(m.promotedToDr());
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to promote');
		} finally {
			promotingId = null;
		}
	}
</script>

{#if ranked.length}
	<div class="bg-base-200 rounded-box flex flex-col gap-2 p-4">
		<h2 class="flex items-center gap-2 font-bold">
			<i class="fas fa-inbox"></i>
			{m.submittedQueue()}
			<span class="text-base-content/60 text-sm font-normal">({m.rankedBySponsors()})</span>
		</h2>
		<ul class="space-y-2">
			{#each ranked as p, i (p.id)}
				<li
					class="bg-base-100 flex flex-wrap items-center gap-2 rounded-lg p-2"
					class:ring-1={i < suggestN}
					class:ring-success={i < suggestN}
				>
					<span class="badge badge-lg" class:badge-success={i < suggestN}>#{i + 1}</span>
					<a class="link min-w-32 flex-1 font-medium" href={paperHref(p.id)}>
						{p.title || m.workingPaper()}
						<span class="text-base-content/60 text-xs">
							· {p.creatorCommitteeMember?.representation?.name ?? '?'}
						</span>
					</a>
					<span class="badge badge-ghost gap-1">
						<i class="fas fa-handshake"></i>
						{p.sponsors?.length ?? 0}
					</span>
					<input
						type="text"
						class="input input-bordered input-xs w-24"
						placeholder={m.documentNumberPlaceholder()}
						bind:value={docNumbers[p.id]}
					/>
					<button
						class="btn btn-primary btn-xs"
						disabled={promotingId === p.id}
						onclick={() => promote(p.id)}
					>
						{#if promotingId === p.id}<i class="fas fa-spinner fa-spin"></i>{/if}
						{m.promoteToDr()}
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}
