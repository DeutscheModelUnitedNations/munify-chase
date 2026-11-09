<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '#lib/utils/import';
	import { countDelegations, flaggedMembersOf, reviewValidations } from './reviewValidations';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;

	interface Props {
		data: ImportData;
		isAdmin: boolean;
		loading?: boolean;
		onApply: () => void;
		onDownload: () => void;
		onJump: (step: number) => void;
	}

	let { data, isAdmin, loading = false, onApply, onDownload, onJump }: Props = $props();

	const totalDelegations = $derived(countDelegations(data));

	const totalNsas = $derived(
		data.representations.filter((r) => r.representationType === 'NSA').length
	);
	const totalUn = $derived(
		data.representations.filter((r) => r.representationType === 'UN').length
	);
	const totalRequestTypes = $derived((data.requestTypes ?? []).length);

	const validations = $derived(reviewValidations(data));

	const hasErrors = $derived(validations.some((x) => x.severity === 'error'));

	function agendaCountOf(committeeId: string) {
		return data.agendaItems.filter((a) => a.committeeId === committeeId).length;
	}
</script>

{#snippet statCard({
	icon,
	value,
	label,
	iconClass = 'bg-primary/15 text-primary'
}: {
	icon: string;
	value: number;
	label: string;
	iconClass?: string;
})}
	<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
		<div class="{iconClass} grid h-11 w-11 place-items-center rounded-lg text-xl">
			<i aria-hidden="true" class="ph-fill ph-{icon}"></i>
		</div>
		<div>
			<div class="font-mono text-2xl leading-none font-bold">{value}</div>
			<div class="text-base-content/60 text-xs">{label}</div>
		</div>
	</div>
{/snippet}

{#snippet committeeRow(c: ImportData['committees'][number])}
	{@const members = flaggedMembersOf(data, c.id)}
	<div
		class="border-base-content/10 flex items-start gap-4 border-b pb-3 last:border-b-0 last:pb-0"
	>
		<div
			class="bg-primary/15 text-primary grid h-14 w-14 shrink-0 place-items-center rounded-lg font-mono text-sm font-bold"
		>
			{c.abbreviation}
		</div>
		<div class="flex-1">
			<div class="text-base font-semibold">{c.name}</div>
			<div class="text-base-content/60 mb-1.5 text-sm">
				{m.committeeMembersShort({ members: members.length, agenda: agendaCountOf(c.id) })}
			</div>
			{#if members.length > 0}
				<div class="flex flex-wrap gap-1">
					{#each members.slice(0, 18) as rep (rep.id)}
						<div class="h-5 w-7 overflow-hidden rounded-box shadow-sm">
							<span
								class="fi fi-{rep.alpha2Code}"
								style="display:block;width:100%;height:100%;background-size:cover;background-position:center;"
							></span>
						</div>
					{/each}
					{#if members.length > 18}
						<div class="text-base-content/60 ml-1 self-center text-xs">
							+{members.length - 18}
						</div>
					{/if}
				</div>
			{/if}
		</div>
		<button class="btn btn-ghost btn-sm" onclick={() => onJump(2)}>{m.editStep()}</button>
	</div>
{/snippet}

{#snippet adminActions()}
	<button class="btn btn-primary btn-lg" onclick={onApply} disabled={loading || hasErrors}>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{:else}
			<i aria-hidden="true" class="ph-fill ph-paper-plane-tilt"></i>
			{m.createConference()}
		{/if}
	</button>
{/snippet}

<div class="flex flex-col gap-7">
	<StepHeader
		eyebrow={m.reviewEyebrow()}
		title={data.title || m.unnamedConference()}
		subtitle={m.reviewSubtitleText()}
		accent
	/>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		{@render statCard({ icon: 'bank', value: data.committees.length, label: m.statCommittees() })}
		{@render statCard({ icon: 'flag', value: totalDelegations, label: m.statDelegations() })}
		{@render statCard({ icon: 'megaphone', value: totalNsas, label: m.statNsas() })}
		{@render statCard({
			icon: 'bank',
			value: totalUn,
			label: m.statUnActors(),
			iconClass: 'bg-accent/25 text-accent-content'
		})}
		{@render statCard({ icon: 'hand', value: totalRequestTypes, label: m.requestTypes() })}
	</div>

	{#if validations.length > 0}
		<div class="card bg-base-100 border-warning border-l-4 p-5">
			<div class="mb-3 flex items-center gap-2">
				<i aria-hidden="true" class="ph-fill ph-warning"></i>
				<strong>{m.validationsHeading({ count: validations.length })}</strong>
			</div>
			<ul class="m-0 flex list-disc flex-col gap-1.5 pl-5">
				{#each validations as v (v.severity + v.step + v.msg)}
					<li class="text-sm {v.severity === 'error' ? 'text-error' : 'text-warning'}">
						{v.msg}
						<button
							type="button"
							class="btn btn-ghost btn-xs text-primary ml-1 font-semibold"
							onclick={() => onJump(v.step)}
						>
							{m.jumpToStep()}
							<i aria-hidden="true" class="ph-fill ph-arrow-right"></i>
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if data.committees.length > 0}
		<div class="card bg-base-100 p-6 shadow-sm">
			<h3 class="text-base-content/60 mb-4 text-sm font-bold tracking-widest uppercase">
				{m.committeesOverviewHeading()}
			</h3>
			<div class="flex flex-col gap-3">
				{#each data.committees as c (c.id)}
					{@render committeeRow(c)}
				{/each}
			</div>
		</div>
	{/if}

	<div
		class="card border-accent/30 bg-base-100 border p-7 shadow-md"
		style="background: linear-gradient(135deg, var(--color-base-100) 0%, color-mix(in oklab, var(--color-accent) 8%, var(--color-base-100)) 100%);"
	>
		<div class="mb-4">
			<h3 class="mb-1 text-2xl font-bold">{m.finishReadyTitle()}</h3>
			<p class="text-base-content/70 m-0">
				{isAdmin ? m.finishReadyAdmin() : m.finishReadyNonAdmin()}
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			{#if isAdmin}
				{@render adminActions()}
			{/if}
			<button class="btn btn-outline btn-primary btn-lg" onclick={onDownload}>
				<i aria-hidden="true" class="ph-fill ph-download-simple"></i>
				{m.downloadAsJson()}
			</button>
			{#if !isAdmin}
				<div class="text-base-content/55 flex items-center gap-2 text-sm">
					<i aria-hidden="true" class="ph-fill ph-lock"></i>
					{m.applyAdminOnly()}
				</div>
			{/if}
		</div>
	</div>
</div>
