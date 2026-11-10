<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import {
		statusBadgeClass,
		statusLabel,
		type PaperStatus
	} from '#lib/components/resolutions/paperContext';
	import PaperCreator from '../../../PaperCreator.svelte';
	import { paperLabel } from '../../../papers';

	interface Props {
		paper: {
			id: string;
			status: string;
			title?: string | null;
			documentNumber?: string | null;
			creatorCommitteeMember?: {
				representation?: { name?: string | null; alpha3Code?: string | null } | null;
			} | null;
			sponsors: unknown[];
		};
		href: string;
		isActive: boolean;
		promoting: boolean;
		settingActive: boolean;
		onPromote: () => void;
		onSetActive: () => void;
	}
	let { paper, href, isActive, promoting, settingActive, onPromote, onSetActive }: Props = $props();

	let representation = $derived(paper.creatorCommitteeMember?.representation);
</script>

<div class="card bg-base-100 hover:bg-base-200 transition">
	<div class="card-body flex-row flex-wrap items-center gap-4 p-4">
		<a {href} class="flex min-w-0 flex-1 flex-col">
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-semibold">{paperLabel(paper)}</span>
				<span class="badge badge-sm {statusBadgeClass(paper.status as PaperStatus)}">
					{statusLabel(paper.status as PaperStatus)}
				</span>
			</div>
			<div class="text-base-content/60 flex flex-wrap items-center gap-x-2 text-sm">
				{#if representation}
					<PaperCreator {representation} class="my-2" />
					·
				{/if}
				{paper.sponsors.length}
				{paper.sponsors.length === 1 ? m.sponsor() : m.sponsors()}
			</div>
		</a>
		{#if paper.status === 'SUBMITTED'}
			<button
				class="btn btn-primary btn-sm"
				data-tour="resolutions.promote"
				disabled={promoting}
				onclick={onPromote}
			>
				{#if promoting}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
				{m.promoteToDraftResolution()}
			</button>
		{/if}
		<button
			class="btn btn-sm btn-circle"
			data-tour="resolutions.set-active"
			class:btn-secondary={isActive}
			class:btn-ghost={!isActive}
			disabled={settingActive}
			title={isActive ? m.activeDraftResolution() : m.setActiveDr()}
			aria-label={m.setActiveDr()}
			onclick={onSetActive}
		>
			<i
				aria-hidden="true"
				class="ph-fill {settingActive ? 'ph-spinner-gap animate-spin' : 'ph-star'}"
			></i>
		</button>
		<a {href} aria-label={m.open()}>
			<i aria-hidden="true" class="ph-fill ph-caret-right opacity-50"></i>
		</a>
	</div>
</div>
