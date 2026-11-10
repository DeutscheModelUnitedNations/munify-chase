<script lang="ts">
	import {
		statusBadgeClass,
		statusLabel,
		type PaperStatus
	} from '#lib/components/resolutions/paperContext';
	import PaperCreator from '../../../PaperCreator.svelte';

	interface Props {
		title: string;
		emptyText: string;
		/** The tour anchor (`#lib/tours`), passed on as `data-tour`. */
		'data-tour': string;
		papers: {
			id: string;
			status: string;
			creatorCommitteeMember?: {
				representation?: { name?: string | null; alpha3Code?: string | null } | null;
			} | null;
			sponsors?: unknown[] | null;
		}[];
		label: (paper: Props['papers'][number]) => string;
		href: (paperId: string) => string;
		showSponsors?: boolean;
	}
	let {
		title,
		emptyText,
		'data-tour': tour,
		papers,
		label,
		href,
		showSponsors = false
	}: Props = $props();
</script>

<section class="flex flex-col gap-2" data-tour={tour}>
	<h2 class="font-bold">{title}</h2>
	{#each papers as p (p.id)}
		{@const representation = p.creatorCommitteeMember?.representation}
		<a href={href(p.id)} class="card bg-base-100 hover:bg-base-200 transition">
			<div class="card-body flex-row items-center gap-3 p-3">
				<div class="flex min-w-0 flex-1 flex-col">
					<span class="font-medium" style="view-transition-name: paper-title-{p.id};"
						>{label(p)}</span
					>
					{#if representation}
						<PaperCreator {representation} class="text-base-content/60 mt-1 text-sm" />
					{/if}
				</div>
				{#if showSponsors}
					<span class="badge badge-ghost gap-1"
						><i aria-hidden="true" class="ph-fill ph-handshake"></i>{p.sponsors?.length ?? 0}</span
					>
				{/if}
				<span class="badge badge-sm {statusBadgeClass(p.status as PaperStatus)}">
					{statusLabel(p.status as PaperStatus)}
				</span>
				<i aria-hidden="true" class="ph-fill ph-caret-right opacity-50"></i>
			</div>
		</a>
	{:else}
		<p class="text-base-content/50 text-sm">{emptyText}</p>
	{/each}
</section>
