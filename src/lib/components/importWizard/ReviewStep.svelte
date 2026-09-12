<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { z } from 'zod/v4';
	import type { importDataSchema } from '$lib/utils/import';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import StepHeader from './StepHeader.svelte';

	type ImportData = z.infer<typeof importDataSchema>;
	type Validation = { severity: 'error' | 'warning'; step: number; msg: string };

	interface Props {
		data: ImportData;
		isAdmin: boolean;
		loading?: boolean;
		onApply: () => void;
		onDownload: () => void;
		onJump: (step: number) => void;
	}

	let { data, isAdmin, loading = false, onApply, onDownload, onJump }: Props = $props();

	const totalDelegations = $derived(
		new SvelteSet(
			(data.committeeMembers ?? [])
				.map((cm) => data.representations.find((r) => r.id === cm.representationId)?.alpha2Code)
				.filter(Boolean)
		).size
	);

	const totalNsas = $derived(
		data.representations.filter((r) => r.representationType === 'NSA').length
	);
	const totalUn = $derived(
		data.representations.filter((r) => r.representationType === 'UN').length
	);
	const totalRequestTypes = $derived((data.requestTypes ?? []).length);

	const validations = $derived.by<Validation[]>(() => {
		const v: Validation[] = [];
		if (!data.title) v.push({ severity: 'error', step: 1, msg: m.missingConferenceTitle() });
		if (data.committees.length === 0)
			v.push({ severity: 'error', step: 2, msg: m.noCommitteesCreated() });
		const nameCounts = new SvelteMap<string, number>();
		const abbrCounts = new SvelteMap<string, number>();
		for (const c of data.committees) {
			if (!c.abbreviation || !c.name) {
				v.push({
					severity: 'error',
					step: 2,
					msg: m.committeeIncomplete({ name: c.abbreviation || c.name || m.unbenamedCommittee() })
				});
			}
			if (c.name) nameCounts.set(c.name, (nameCounts.get(c.name) ?? 0) + 1);
			if (c.abbreviation) abbrCounts.set(c.abbreviation, (abbrCounts.get(c.abbreviation) ?? 0) + 1);
			const memberCount = (data.committeeMembers ?? []).filter(
				(cm) => cm.committeeId === c.id
			).length;
			if (memberCount === 0) {
				v.push({
					severity: 'warning',
					step: 3,
					msg: m.committeeNoDelegations({
						name: c.abbreviation || c.name || m.unbenamedCommittee()
					})
				});
			}
		}
		for (const [name, count] of nameCounts) {
			if (count > 1) {
				v.push({ severity: 'error', step: 2, msg: m.duplicateCommitteeName({ name }) });
			}
		}
		for (const [abbreviation, count] of abbrCounts) {
			if (count > 1) {
				v.push({
					severity: 'error',
					step: 2,
					msg: m.duplicateCommitteeAbbreviation({ abbreviation })
				});
			}
		}
		return v;
	});

	const hasErrors = $derived(validations.some((x) => x.severity === 'error'));

	function membersOfCommittee(committeeId: string) {
		const seen = new SvelteSet<string>();
		return (data.committeeMembers ?? [])
			.filter((cm) => cm.committeeId === committeeId)
			.map((cm) => data.representations.find((r) => r.id === cm.representationId))
			.filter((r): r is NonNullable<typeof r> => !!r && !!r.alpha2Code)
			.filter((r) => {
				if (seen.has(r.id)) return false;
				seen.add(r.id);
				return true;
			});
	}

	function agendaCountOf(committeeId: string) {
		return data.agendaItems.filter((a) => a.committeeId === committeeId).length;
	}
</script>

<div class="flex flex-col gap-7">
	<StepHeader
		eyebrow={m.reviewEyebrow()}
		title={data.title || m.unnamedConference()}
		subtitle={m.reviewSubtitleText()}
		accent
	/>

	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
			<div class="bg-primary/15 text-primary grid h-11 w-11 place-items-center rounded-lg text-xl">
				<i class="fa-solid fa-building-columns"></i>
			</div>
			<div>
				<div class="font-mono text-2xl leading-none font-bold">{data.committees.length}</div>
				<div class="text-base-content/60 text-xs">{m.statCommittees()}</div>
			</div>
		</div>
		<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
			<div class="bg-primary/15 text-primary grid h-11 w-11 place-items-center rounded-lg text-xl">
				<i class="fa-solid fa-flag"></i>
			</div>
			<div>
				<div class="font-mono text-2xl leading-none font-bold">{totalDelegations}</div>
				<div class="text-base-content/60 text-xs">{m.statDelegations()}</div>
			</div>
		</div>
		<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
			<div class="bg-primary/15 text-primary grid h-11 w-11 place-items-center rounded-lg text-xl">
				<i class="fa-solid fa-bullhorn"></i>
			</div>
			<div>
				<div class="font-mono text-2xl leading-none font-bold">{totalNsas}</div>
				<div class="text-base-content/60 text-xs">{m.statNsas()}</div>
			</div>
		</div>
		<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
			<div
				class="bg-accent/25 text-accent-content grid h-11 w-11 place-items-center rounded-lg text-xl"
			>
				<i class="fa-solid fa-landmark-flag"></i>
			</div>
			<div>
				<div class="font-mono text-2xl leading-none font-bold">{totalUn}</div>
				<div class="text-base-content/60 text-xs">{m.statUnActors()}</div>
			</div>
		</div>
		<div class="card bg-base-100 border-base-content/10 flex-row items-center gap-3 border p-4">
			<div class="bg-primary/15 text-primary grid h-11 w-11 place-items-center rounded-lg text-xl">
				<i class="fa-solid fa-hand"></i>
			</div>
			<div>
				<div class="font-mono text-2xl leading-none font-bold">{totalRequestTypes}</div>
				<div class="text-base-content/60 text-xs">{m.requestTypes()}</div>
			</div>
		</div>
	</div>

	{#if validations.length > 0}
		<div class="card bg-base-100 border-warning border-l-4 p-5">
			<div class="mb-3 flex items-center gap-2">
				<i class="fa-solid fa-triangle-exclamation"></i>
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
							<i class="fa-solid fa-arrow-right"></i>
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
					{@const members = membersOfCommittee(c.id)}
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
										<div class="h-5 w-7 overflow-hidden rounded shadow-sm">
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
				<button class="btn btn-primary btn-lg" onclick={onApply} disabled={loading || hasErrors}>
					{#if loading}
						<span class="loading loading-spinner"></span>
					{:else}
						<i class="fa-solid fa-paper-plane"></i>
						{m.createConference()}
					{/if}
				</button>
			{/if}
			<button class="btn btn-outline btn-primary btn-lg" onclick={onDownload}>
				<i class="fa-solid fa-download"></i>
				{m.downloadAsJson()}
			</button>
			{#if !isAdmin}
				<div class="text-base-content/55 flex items-center gap-2 text-sm">
					<i class="fa-solid fa-lock"></i>
					{m.applyAdminOnly()}
				</div>
			{/if}
		</div>
	</div>
</div>
