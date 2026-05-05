<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { cache, graphql, type RepresentationTypeEnum$options } from '$houdini';
	import toast from 'svelte-french-toast';
	import { importDataSchema } from '$lib/utils/import';
	import { z } from 'zod/v4';
	import Footer from '$lib/components/Footer.svelte';
	import AddCountriesModal from '$lib/components/AddCountriesModal.svelte';
	import WorldCountries from 'world-countries';
	import { nanoid } from '$lib/helpers/nanoid';
	import StartStep from '$lib/components/importWizard/StartStep.svelte';
	import BasicsStep from '$lib/components/importWizard/BasicsStep.svelte';
	import CommitteesStep from '$lib/components/importWizard/CommitteesStep.svelte';
	import DelegationsStep from '$lib/components/importWizard/DelegationsStep.svelte';
	import ActorsStep from '$lib/components/importWizard/ActorsStep.svelte';
	import ReviewStep from '$lib/components/importWizard/ReviewStep.svelte';
	import type { PageData } from './$houdini';

	type ImportData = z.infer<typeof importDataSchema>;

	let { data }: { data: PageData } = $props();
	let importPageQuery = $derived(data.ImportPageQuery);
	let isAdmin = $derived($importPageQuery.data?.isGlobalAdmin ?? false);

	let step = $state(0);
	let loading = $state(false);
	let importData = $state<ImportData | undefined>();
	let addCountriesModalOpen = $state(false);
	let activeCommitteeId = $state<string | null>(null);
	let showJsonPanel = $state(false);

	const ConferenceCreationMutation = graphql(`
		mutation ConferenceCreation($data: ImportData!) {
			importDelegatorConference(data: $data) {
				id
			}
		}
	`);

	const STEP_LABELS = $derived([
		m.basicsTitle(),
		m.committees(),
		m.delegations(),
		m.actorsTitle(),
		m.editStep()
	]);

	function transformRegionalGroup(regionalGroup: string | undefined) {
		switch (regionalGroup) {
			case 'African Group':
				return 'AFRICA';
			case 'Asia and the Pacific Group':
				return 'ASIA_PACIFIC';
			case 'Eastern European Group':
				return 'EASTERN_EUROPE';
			case 'Latin American and Caribbean Group':
				return 'LATIN_AMERICA_CARIBBEAN';
			case 'Western European and Others Group':
				return 'WESTERN_EUROPE_OTHERS';
			default:
				return undefined;
		}
	}

	async function parseFile(file: File): Promise<ImportData | undefined> {
		const ext = file.name.split('.').pop()?.toLowerCase();
		if (ext !== 'json') {
			toast.error(m.fileParseError());
			return;
		}
		const text = await file.text();
		try {
			const parsed = importDataSchema.parse(JSON.parse(text));
			if (parsed.$schema) delete parsed.$schema;
			return parsed;
		} catch (e) {
			console.error('Validation error:', e);
			toast.error(m.fileParseError());
		}
	}

	async function handlePickFile(file: File) {
		loading = true;
		try {
			const parsed = await parseFile(file);
			if (parsed) {
				importData = parsed;
				step = 1;
			}
		} finally {
			loading = false;
		}
	}

	function handleCreateFresh() {
		importData = {
			$schema: `${page.url.origin}/api/schemas/import`,
			title: '',
			id: nanoid(),
			committees: [],
			agendaItems: [],
			representations: WorldCountries.filter((x) => x.unMember).map((nation) => ({
				id: nanoid(),
				representationType: 'DELEGATION',
				alpha3Code: nation.cca3.toLowerCase(),
				alpha2Code: nation.cca2.toLowerCase(),
				regionalGroup: transformRegionalGroup(nation.unRegionalGroup)
			})),
			conferenceMembers: [],
			committeeMembers: []
		} as unknown as ImportData;
		step = 1;
	}

	async function downloadFile(): Promise<void> {
		if (!importData) return;
		if (!importData.$schema) {
			importData.$schema = `${page.url.origin}/api/schemas/import`;
		}
		const blob = new Blob([JSON.stringify(importData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${importData.title || 'conference'}-import.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function createConference() {
		if (loading || !importData) return;
		loading = true;
		if (importData.$schema) delete importData.$schema;

		try {
			const res = await ConferenceCreationMutation.mutate({ data: importData }).catch((e) => {
				toast.error(m.conferenceCreationError());
				console.error('Error creating conference:', e);
			});
			if (res) {
				toast.success(m.conferenceCreated());
				cache.markStale();
				await invalidateAll();
				goto('/app');
			}
		} finally {
			loading = false;
		}
	}

	function openAddCountries(committeeId: string) {
		activeCommitteeId = committeeId;
		addCountriesModalOpen = true;
	}

	function handleAddCountries(
		countries: Array<{ alpha2Code: string; alpha3Code: string; name: string }>
	) {
		if (!activeCommitteeId || !importData) return;

		for (const country of countries) {
			const existingRep = importData.representations.find(
				(x) => x.alpha2Code?.toLowerCase() === country.alpha2Code.toLowerCase()
			);

			let repId: string;

			if (existingRep) {
				repId = existingRep.id;
				const alreadyMember = importData.committeeMembers?.some(
					(cm) => cm.committeeId === activeCommitteeId && cm.representationId === repId
				);
				if (alreadyMember) continue;
			} else {
				repId = nanoid();
				const worldCountry = WorldCountries.find(
					(x) => x.cca2.toLowerCase() === country.alpha2Code.toLowerCase()
				);
				importData.representations.push({
					alpha2Code: country.alpha2Code,
					alpha3Code: country.alpha3Code,
					representationType: 'DELEGATION' as RepresentationTypeEnum$options,
					id: repId,
					regionalGroup: worldCountry
						? transformRegionalGroup(worldCountry.unRegionalGroup)
						: undefined
				});
			}

			if (!importData.committeeMembers) importData.committeeMembers = [];
			importData.committeeMembers.push({
				id: nanoid(),
				committeeId: activeCommitteeId,
				representationId: repId
			});
		}

		activeCommitteeId = null;
	}
</script>

<div class="flex min-h-screen flex-col">
	<!-- Top bar -->
	<header class="navbar bg-base-100 sticky top-0 z-20 shadow-sm">
		<div class="flex flex-1 items-center gap-2">
			<a
				class="btn btn-ghost"
				href={step === 0 ? '/app' : undefined}
				onclick={(e) => {
					if (step > 0) {
						e.preventDefault();
						step = step - 1;
					}
				}}
			>
				<i class="fa-solid fa-arrow-left"></i>
				{step === 0 ? m.launcher() : m.back()}
			</a>
		</div>
		<div class="flex items-center gap-1">
			{#if importData}
				<button
					type="button"
					class="btn btn-ghost btn-sm"
					onclick={() => (showJsonPanel = !showJsonPanel)}
				>
					<i class="fa-solid fa-code"></i>
					{showJsonPanel ? m.hideJson() : m.viewJson()}
				</button>
				<button type="button" class="btn btn-ghost btn-sm" onclick={downloadFile}>
					<i class="fa-solid fa-download"></i>
					{m.save()}
				</button>
			{/if}
		</div>
	</header>

	<!-- Stepper -->
	{#if step > 0}
		<div class="bg-base-100 border-base-content/10 border-b px-6 py-5">
			<ul class="steps mx-auto w-full max-w-4xl">
				{#each STEP_LABELS as label, i (i)}
					{@const idx = i + 1}
					<li class="step {idx <= step ? 'step-primary' : ''}">
						<button
							type="button"
							class="btn btn-ghost btn-sm h-auto whitespace-normal"
							onclick={() => importData && (step = idx)}
							disabled={!importData}
						>
							{label}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<!-- Body -->
	<main
		class="mx-auto flex w-full flex-1 flex-col gap-4 px-6 {step === 0
			? 'max-w-full py-16'
			: 'max-w-3xl py-10'}"
	>
		{#if step === 0}
			<StartStep
				onPickFile={handlePickFile}
				onCreateFresh={handleCreateFresh}
				{loading}
				{isAdmin}
			/>
		{:else if step === 1 && importData}
			<BasicsStep bind:data={importData} />
		{:else if step === 2 && importData}
			<CommitteesStep bind:data={importData} />
		{:else if step === 3 && importData}
			<DelegationsStep bind:data={importData} onOpenAddCountries={openAddCountries} />
		{:else if step === 4 && importData}
			<ActorsStep bind:data={importData} />
		{:else if step === 5 && importData}
			<ReviewStep
				data={importData}
				{isAdmin}
				{loading}
				onApply={createConference}
				onDownload={downloadFile}
				onJump={(s) => (step = s)}
			/>
		{/if}
	</main>

	<!-- Footer nav -->
	{#if step > 0 && step < 5}
		<footer
			class="bg-base-100/90 border-base-content/10 sticky bottom-0 flex items-center justify-between gap-4 border-t px-6 py-3 backdrop-blur"
		>
			<button class="btn" onclick={() => (step = step - 1)}>
				<i class="fa-solid fa-arrow-left"></i>
				{m.back()}
			</button>
			<div class="text-base-content/55 text-sm">
				{m.stepXofY({ current: step, total: 5 })}
			</div>
			<button class="btn btn-primary" onclick={() => (step = step + 1)}>
				{step === 4 ? m.goToReview() : m.forward()}
				<i class="fa-solid fa-arrow-right"></i>
			</button>
		</footer>
	{/if}

	<!-- JSON drawer -->
	{#if showJsonPanel && importData}
		<aside
			class="bg-primary text-primary-content fixed inset-y-0 right-0 z-40 w-96 overflow-auto p-5 shadow-2xl"
		>
			<div class="mb-4 flex items-center justify-between">
				<strong>{m.viewJson()}</strong>
				<button
					class="btn btn-ghost btn-sm text-primary-content"
					onclick={() => (showJsonPanel = false)}
					aria-label="Close"
				>
					<i class="fa-solid fa-xmark"></i>
				</button>
			</div>
			<pre
				class="m-0 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">{JSON.stringify(
					importData,
					null,
					2
				)}</pre>
		</aside>
	{/if}
</div>

<AddCountriesModal bind:open={addCountriesModalOpen} onSubmit={handleAddCountries} />

<Footer />
