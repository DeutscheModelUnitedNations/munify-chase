<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { graphql, type RepresentationTypeEnum$options } from '$houdini';
	import toast from 'svelte-french-toast';
	import { importDataSchema } from '$lib/utils/import';
	import { z } from 'zod/v4';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';
	import CountryBadge from '$lib/components/CountryBadge.svelte';
	import AddCountriesModal from '$lib/components/AddCountriesModal.svelte';
	import WorldCountries from 'world-countries';
	import { page } from '$app/state';
	import { nanoid } from '$lib/helpers/nanoid';

	// State for the add countries modal
	let addCountriesModalOpen = $state(false);
	let activeCommitteeId = $state<string | null>(null);

	// let { data }: PageData = $props();

	let file: File | null = $state(null);
	let loading = $state(false);
	let importData = $state<z.infer<typeof importDataSchema>>();

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		file = target.files && target.files[0] ? target.files[0] : null;
	}

	const ConferenceCreationMutation = graphql(`
		mutation ConferenceCreation($data: ImportData!) {
			importDelegatorConference(data: $data) {
				id
			}
		}
	`);

	async function parseFile(file: File): Promise<any> {
		const ext = file.name.split('.').pop()?.toLowerCase();
		const text = await file.text();
		if (ext !== 'json') throw new Error('Unsupported file type');

		// validate JSON structure
		try {
			const data = importDataSchema.parse(JSON.parse(text));
			// Strip out the $schema property
			if (data.$schema) {
				delete data.$schema;
			}
			return data;
		} catch (e) {
			if (e instanceof SyntaxError) {
				toast.error(m.fileParseError());
				throw new Error('Invalid JSON structure');
			} else if (e instanceof z.ZodError) {
				toast.error(m.fileParseError());
				console.error('Validation error:', e);
			}
		}
	}

	async function importDataUpload(): Promise<void> {
		if (!file) return;
		loading = true;
		let parsedData: any;
		try {
			parsedData = await parseFile(file);
			if (parsedData.$schema) {
				delete parsedData.$schema;
			}
			importData = parsedData;
			loading = false;
		} catch (e) {
			toast.error(m.fileParseError());
			loading = false;
			return;
		}
	}

	const transformRegionalGroup = (regionalGroup: string | undefined) => {
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
	};

	async function createFreshData(): Promise<void> {
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
		} as unknown as z.infer<typeof importDataSchema>;
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
		if (loading) return;
		loading = true;

		if (!importData) return;
		if (importData.$schema) {
			delete importData.$schema;
		}

		const res = await ConferenceCreationMutation.mutate({ data: importData }).catch((e) => {
			toast.error(m.conferenceCreationError());
			console.error('Error creating conference:', e);
			loading = false;
		});
		if (res) {
			toast.success(m.conferenceCreated());
			goto(`/app`);
		}
		loading = false;
	}

	const addCommittee = () =>
		importData?.committees.push({
			id: nanoid(),
			name: '',
			abbreviation: ''
		});

	const addAgendaItem = (committeeId: string) =>
		importData?.agendaItems.push({
			committeeId,
			title: ''
		});

	const addRepresentationAndConferenceMember = (type: RepresentationTypeEnum$options) => {
		const repId = nanoid();
		importData?.representations.push({
			name: '',
			faIcon: type === 'NSA' ? 'megaphone' : undefined,
			// alpha2Code: type === 'UN' ? 'un' : undefined,
			// alpha3Code: type === 'UN' ? 'uno' : undefined,
			representationType: type,
			id: repId
		});
		if (importData?.conferenceMembers === undefined) {
			importData!.conferenceMembers = [];
		}
		importData?.conferenceMembers.push({
			id: nanoid(),
			representationId: repId
		});
	};

	const openAddCountriesModal = (committeeId: string) => {
		activeCommitteeId = committeeId;
		addCountriesModalOpen = true;
	};

	const handleAddCountries = (
		countries: Array<{ alpha2Code: string; alpha3Code: string; name: string }>
	) => {
		if (!activeCommitteeId || !importData) return;

		for (const country of countries) {
			// Check if this country is already a member of this committee
			const existingRep = importData.representations.find(
				(x) => x.alpha2Code?.toLowerCase() === country.alpha2Code.toLowerCase()
			);

			let repId: string;

			if (existingRep) {
				repId = existingRep.id;
				// Check if already a member of this committee
				const alreadyMember = importData.committeeMembers?.some(
					(m) => m.committeeId === activeCommitteeId && m.representationId === repId
				);
				if (alreadyMember) {
					continue; // Skip this country, already a member
				}
			} else {
				// Create a new representation
				repId = nanoid();
				const worldCountry = WorldCountries.find(
					(x) => x.cca2.toLowerCase() === country.alpha2Code.toLowerCase()
				);
				importData.representations.push({
					alpha2Code: country.alpha2Code,
					alpha3Code: country.alpha3Code,
					representationType: 'DELEGATION',
					id: repId,
					regionalGroup: worldCountry
						? transformRegionalGroup(worldCountry.unRegionalGroup)
						: undefined
				});
			}

			if (importData.committeeMembers === undefined) {
				importData.committeeMembers = [];
			}

			importData.committeeMembers.push({
				id: nanoid(),
				committeeId: activeCommitteeId,
				representationId: repId
			});
		}

		activeCommitteeId = null;
	};
</script>

<div class="navbar bg-base-100 relative shadow-sm">
	<div class="flex-none">
		<a class="btn btn-ghost" href=".">
			<i class="fa-duotone fa-arrow-left mr-2"></i>
			{m.back()}
		</a>
		<button
			class="btn btn-ghost"
			aria-label="Download import data"
			onclick={downloadFile}
			disabled={!importData}
		>
			<i class="fa-solid fa-download"></i>
			{m.download()}
		</button>
	</div>
</div>

<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center">
	{#if !importData}
		<div class="bg-base-100 card flex w-full max-w-md flex-col items-center p-8 shadow-sm">
			<h1 class="mb-8 text-3xl font-bold">{m.importFromDelegator()}</h1>
			<input
				type="file"
				class="file-input file-input-bordered mb-6 w-full"
				onchange={handleFileChange}
				accept=".json"
			/>
			<button class="btn btn-primary w-full" onclick={importDataUpload} disabled={loading || !file}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					<i class="fas fa-paper-plane"></i>
					<span>{m.upload()}</span>
				{/if}
			</button>
			<button class="btn w-full" onclick={createFreshData} disabled={loading}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					<i class="fas fa-plus"></i>
					<span>{m.create()}</span>
				{/if}
			</button>
		</div>
	{:else}
		<div class="m-10 flex w-full max-w-3xl flex-col gap-4">
			<input
				type="text"
				class="input input-bordered input-xl w-full"
				bind:value={importData.title}
				placeholder={m.conferenceTitle()}
			/>
			<input
				type="text"
				class="input input-bordered w-full"
				bind:value={importData.id}
				placeholder={m.conferenceId()}
			/>

			{#each importData.committees as committee}
				{@const agendaItems = importData.agendaItems.filter(
					(item) => item.committeeId === committee.id
				)}
				{@const committeeMembers = importData.committeeMembers?.filter(
					(member) => member.committeeId === committee.id
				)}

				<fieldset class="fieldset bg-base-100 border-base-300 rounded-box relative border p-4">
					<legend class="fieldset-legend">{m.committee()}</legend>

					<input
						type="text"
						class="input input-bordered input-lg w-full"
						bind:value={committee.abbreviation}
						placeholder={m.committeeAbbreviation()}
					/>
					<input
						type="text"
						class="input input-bordered w-full"
						bind:value={committee.name}
						placeholder={m.committeeName()}
					/>
					<input
						type="text"
						class="input input-bordered w-full"
						bind:value={committee.id}
						placeholder={m.committeeId()}
					/>
					<fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
						<legend class="fieldset-legend">{m.agendaItems()}</legend>
						{#each agendaItems as item}
							<div class="join">
								<input
									type="text"
									class="input input-bordered join-item w-full"
									bind:value={item.title}
									placeholder={m.agendaItem()}
								/>
								<button
									class="btn join-item"
									aria-label="Remove agenda item"
									onclick={() => {
										importData!.agendaItems = importData!.agendaItems.filter(
											(i) => i.title !== item.title
										);
									}}
								>
									<i class="fa-solid fa-trash"></i>
								</button>
							</div>
						{/each}
						<button
							class="btn"
							aria-label="Add agenda item"
							onclick={() => addAgendaItem(committee.id)}
						>
							<i class="fa-solid fa-plus"></i>
							{m.addAgendaItem()}
						</button>
					</fieldset>
					<fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4">
						<legend class="fieldset-legend">{m.committeeMember()}</legend>
						<div class="flex flex-wrap gap-1">
							<div class="badge badge-primary badge-outline">
								<i class="fa-duotone fa-sigma"></i>
								<span class="ml-2">{committeeMembers.length}</span>
							</div>
							{#each committeeMembers.toSorted((a, b) => importData!.representations
										.find((rep) => rep.id === a.representationId)
										?.alpha2Code?.localeCompare(importData!.representations.find((rep) => rep.id === b.representationId)?.alpha2Code ?? '') ?? 0) as member}
								{@const rep = importData.representations.find(
									(rep) => rep.id === member.representationId
								)}
								<CountryBadge
									alpha2Code={rep?.alpha2Code ?? ''}
									alpha3Code={rep?.alpha3Code}
									onRemove={() => {
										importData!.committeeMembers = importData!.committeeMembers?.filter(
											(i) => i.id !== member.id
										);
									}}
								/>
							{/each}
						</div>
						<button
							class="btn btn-primary btn-sm mt-2"
							aria-label="Add committee member"
							onclick={() => {
								openAddCountriesModal(committee.id);
							}}
						>
							<i class="fa-solid fa-plus"></i>
							{m.addCountry()}
						</button>
					</fieldset>

					<button
						class="btn btn-error btn-circle absolute top-0 right-0 translate-x-1/2 -translate-y-3/4 transition-all duration-300"
						aria-label="Remove committee"
						onclick={() => {
							importData!.committees = importData!.committees.filter((i) => i.id !== committee.id);
							importData!.agendaItems = importData!.agendaItems.filter(
								(i) => i.committeeId !== committee.id
							);
							importData!.committeeMembers = importData!.committeeMembers?.filter(
								(i) => i.committeeId !== committee.id
							);
						}}
					>
						<i class="fa-solid fa-trash"></i>
					</button>
				</fieldset>
			{/each}

			<button class="btn" aria-label="Add agenda item" onclick={() => addCommittee()}>
				<i class="fa-solid fa-plus"></i>
				{m.addCommittee()}
			</button>

			<div class="divider"></div>

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-4">
				<legend class="fieldset-legend">{m.nonStateActors()}</legend>
				{#each importData.representations.filter((x) => x.representationType === 'NSA') as rep}
					{@const conferenceMembers = importData.conferenceMembers?.filter(
						(member) => member.representationId === rep.id
					)}
					<div class="join">
						<div class="btn join-item w-14">
							<i class="fa-solid fa-{rep.faIcon?.replace('fa-', '')}"></i>
						</div>
						<input
							type="text"
							class="input input-bordered join-item w-full flex-1"
							bind:value={rep.faIcon}
							placeholder={m.icon()}
						/>
						<input
							type="text"
							class="input input-bordered join-item w-sm"
							bind:value={rep.name}
							placeholder={m.nonStateActor()}
						/>
						<div class="btn join-item {conferenceMembers?.length === 0 ? 'btn-error' : ''}">
							<i class="fas fa-users"></i>
							<span class="ml-2">{conferenceMembers?.length}</span>
						</div>
						<button
							class="btn join-item"
							aria-label="Remove agenda item"
							onclick={() => {
								importData!.representations = importData!.representations.filter(
									(i) => i.id !== rep.id
								);
								importData!.conferenceMembers = importData!.conferenceMembers?.filter(
									(i) => i.representationId !== rep.id
								);
							}}
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</div>
				{/each}
				<button
					class="btn"
					aria-label="Add agenda item"
					onclick={() => addRepresentationAndConferenceMember('NSA')}
				>
					<i class="fa-solid fa-plus"></i>
					{m.addNonStateActor()}
				</button>
			</fieldset>

			<fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-4">
				<legend class="fieldset-legend">{m.unActors()}</legend>
				{#each importData.representations.filter((x) => x.representationType === 'UN') as rep}
					{@const conferenceMembers = importData.conferenceMembers?.filter(
						(member) => member.representationId === rep.id
					)}
					<div class="join">
						<input
							type="text"
							class="input input-bordered join-item w-full"
							bind:value={rep.name}
							placeholder={m.unActor()}
						/>
						<div class="btn join-item {conferenceMembers.length === 0 ? 'btn-error' : ''}">
							<i class="fas fa-users"></i>
							<span class="ml-2">{conferenceMembers.length}</span>
						</div>
						<button
							class="btn join-item"
							aria-label="Remove agenda item"
							onclick={() => {
								importData!.representations = importData!.representations.filter(
									(i) => i.id !== rep.id
								);
								importData!.conferenceMembers = importData!.conferenceMembers?.filter(
									(i) => i.representationId !== rep.id
								);
							}}
						>
							<i class="fa-solid fa-trash"></i>
						</button>
					</div>
				{/each}
				<button
					class="btn"
					aria-label="Add agenda item"
					onclick={() => addRepresentationAndConferenceMember('UN')}
				>
					<i class="fa-solid fa-plus"></i>
					{m.addUnActor()}
				</button>
			</fieldset>
		</div>
	{/if}

	<button
		class="btn btn-primary fixed right-0 bottom-0 left-0 z-50 m-4"
		aria-label="Create conference"
		onclick={createConference}
		disabled={!importData || loading}
	>
		{#if loading}
			<span class="loading loading-spinner"></span>
		{:else}
			<i class="fa-solid fa-paper-plane"></i>
			<span>{m.createConference()}</span>
		{/if}
	</button>
</div>

<AddCountriesModal bind:open={addCountriesModalOpen} onSubmit={handleAddCountries} />

<Footer />
