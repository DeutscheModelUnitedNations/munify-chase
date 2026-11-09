<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { slide } from 'svelte/transition';
	import { m } from '#lib/paraglide/messages';
	import Flag from '#lib/components/Flag.svelte';
	import type { ResolutionViewer } from './paperContext';
	import { representationName } from './sponsors';
	import { amendmentTypeIcon, statusBadge, type DecisionKind } from './amendmentListState';
	import AmendmentSponsorPanel from './AmendmentSponsorPanel.svelte';
	import AmendmentChairActions from './AmendmentChairActions.svelte';

	interface Props {
		amendment: {
			id: string;
			type: string;
			status: string;
			documentNumber?: string | null;
			newContent?: string | null;
			proposer?: {
				id: string;
				representation?: ComponentProps<typeof Flag>['representation'];
			} | null;
			sponsors?: { id: string }[] | null;
		};
		committeeId: string;
		viewer: ResolutionViewer;
		team: boolean;
		myMemberId: string | null;
		sponsoringOpen: boolean;
		minAmendmentSponsors: number;
		/** Shown on the beamer right now. */
		active: boolean;
		/** Which action is running: an amendment's id, 'unpresent' or null. */
		busyId: string | null;
		onsubmit: () => void;
		onwithdraw: () => void;
		onpresent: () => void;
		onunpresent: () => void;
		onvote: () => void;
		ondecide: (kind: DecisionKind) => void;
	}

	let {
		amendment: a,
		committeeId,
		viewer,
		team,
		myMemberId,
		sponsoringOpen,
		minAmendmentSponsors,
		active,
		busyId,
		onsubmit,
		onwithdraw,
		onpresent,
		onunpresent,
		onvote,
		ondecide
	}: Props = $props();

	let sponsorsExpanded = $state(false);

	const busy = $derived(busyId === a.id);
	const icon = $derived(amendmentTypeIcon(a.type));
	const badge = $derived(statusBadge(a.status));
	const sponsorCounts = $derived({
		current: String(a.sponsors?.length ?? 0),
		needed: String(minAmendmentSponsors)
	});
	const canSubmit = $derived((a.sponsors?.length ?? 0) >= minAmendmentSponsors);
	const ownDraft = $derived(a.proposer?.id === myMemberId && a.status === 'PENDING');
	const undecided = $derived(team && (a.status === 'SUBMITTED' || a.status === 'PENDING'));
</script>

<div
	class="bg-base-100 rounded-lg p-3"
	class:ring-2={active}
	class:ring-inset={active}
	class:ring-primary={active}
>
	<div class="flex items-center justify-between gap-2">
		<div class="flex items-center gap-1.5">
			<span class="flex items-center gap-1.5 font-mono text-sm font-semibold">
				{#if icon}
					<i aria-hidden="true" class="ph-fill ph-{icon}"></i>
				{/if}
				{a.documentNumber ?? ''}
			</span>
		</div>
		<span class="badge badge-sm {badge.cls}">{badge.label}</span>
	</div>
	<div class="text-base-content/70 mt-2 flex items-center gap-2 text-xs">
		<Flag representation={a.proposer?.representation} size="xs" />
		<span>{representationName(a.proposer?.representation, m.unknown())}</span>
		<span class="text-base-content/40">·</span>
		<button
			class="btn btn-xs btn-ghost -my-1 -ml-1 gap-1"
			class:text-warning={!canSubmit && a.status === 'PENDING'}
			onclick={() => (sponsorsExpanded = !sponsorsExpanded)}
		>
			{m.sponsorsCount(sponsorCounts)}
			<i
				aria-hidden="true"
				class="ph-fill ph-caret-down text-[0.6rem] transition-transform duration-200"
				class:rotate-180={sponsorsExpanded}
			></i>
		</button>
	</div>
	{#if sponsorsExpanded}
		<div transition:slide={{ duration: 200 }}>
			<AmendmentSponsorPanel
				amendmentId={a.id}
				{committeeId}
				{sponsoringOpen}
				{viewer}
				proposerMemberId={a.proposer?.id}
				amendmentStatus={a.status}
			/>
		</div>
	{/if}

	{#if a.newContent}
		<p class="bg-base-200 mt-2 rounded p-2 font-mono text-xs whitespace-pre-wrap opacity-80">
			{a.newContent}
		</p>
	{/if}

	<div class="mt-3 flex flex-wrap gap-1.5">
		{#if ownDraft}
			<div
				class="tooltip tooltip-top"
				data-tip={canSubmit ? undefined : m.sponsorsNeededToSubmit(sponsorCounts)}
			>
				<button class="btn btn-xs btn-primary" disabled={busy || !canSubmit} onclick={onsubmit}
					>{m.submit()}</button
				>
			</div>
			<button class="btn btn-xs btn-ghost" disabled={busy} onclick={onwithdraw}
				>{m.withdraw()}</button
			>
		{/if}

		{#if undecided}
			<AmendmentChairActions
				status={a.status}
				{active}
				{busy}
				unpresenting={busyId === 'unpresent'}
				{onpresent}
				{onunpresent}
				{onvote}
				{ondecide}
			/>
		{/if}
	</div>
</div>
