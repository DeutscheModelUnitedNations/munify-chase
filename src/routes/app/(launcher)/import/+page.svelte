<script lang="ts">
	import { getIsGlobalAdmin } from '#lib/state/currentUser.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { withBackendMessage } from '#lib/utils/toast';
	import { importDataSchema } from '#lib/utils/import';
	import AddCountriesModal from '#lib/components/AddCountriesModal.svelte';
	import { nanoid } from '#lib/helpers/nanoid';
	import StartStep from '#lib/components/importWizard/StartStep.svelte';
	import ImportTopBar from './ImportTopBar.svelte';
	import ImportStepper from './ImportStepper.svelte';
	import ImportWizardStep from './ImportWizardStep.svelte';
	import ImportFooterNav from './ImportFooterNav.svelte';
	import ImportJsonPanel from './ImportJsonPanel.svelte';
	import {
		IMPORT_STEP_COUNT,
		addCountriesToCommittee,
		defaultImportRequestTypes,
		freshImportData,
		importFileName,
		importPayload,
		importSchemaUrl,
		isJsonFileName,
		type ImportData
	} from './importWizard';

	const isAdmin = await getIsGlobalAdmin();

	let step = $state(0);
	let loading = $state(false);
	let importData = $state<ImportData | undefined>();
	let addCountriesModalOpen = $state(false);
	let activeCommitteeId = $state<string | null>(null);
	let showJsonPanel = $state(false);

	async function parseFile(file: File): Promise<ImportData | undefined> {
		if (!isJsonFileName(file.name)) {
			toast.error(m.fileParseError());
			return;
		}
		const text = await file.text();
		try {
			const parsed = importDataSchema.parse(JSON.parse(text));
			if (parsed.$schema) delete parsed.$schema;
			// A DELEGATOR export carries no request types, start it with the default set. An empty
			// list was emptied on purpose and stays empty.
			parsed.requestTypes ??= defaultImportRequestTypes(nanoid);
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
		importData = freshImportData(page.url.origin, nanoid);
		step = 1;
	}

	function downloadFile(): void {
		if (!importData) return;
		importData.$schema ||= importSchemaUrl(page.url.origin);
		const blob = new Blob([JSON.stringify(importData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = importFileName(importData.title);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	async function createConference() {
		if (loading || !importData) return;
		loading = true;
		try {
			const res = await client.mutate
				.importDelegatorConference({ __args: { data: importPayload(importData) }, id: true })
				.catch((err) => {
					toast.error(withBackendMessage(m.conferenceCreationError(), err));
					console.error('Error creating conference:', err);
				});
			if (res) {
				toast.success(m.conferenceCreated());
				goto(resolve('/app/(launcher)'));
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
		addCountriesToCommittee({
			data: importData,
			committeeId: activeCommitteeId,
			countries,
			makeId: nanoid
		});
		activeCommitteeId = null;
	}

	const goToStep = (s: number) => (step = s);
</script>

<div class="flex min-h-screen flex-col">
	<ImportTopBar
		{step}
		hasData={!!importData}
		{showJsonPanel}
		onBack={() => (step = step - 1)}
		onToggleJson={() => (showJsonPanel = !showJsonPanel)}
		onDownload={downloadFile}
	/>

	{#if step > 0}
		<ImportStepper {step} hasData={!!importData} onJump={goToStep} />
	{/if}

	<!-- Body -->
	<main
		id="main-content"
		tabindex="-1"
		class="mx-auto flex w-full flex-1 flex-col gap-4 px-6"
		class:max-w-full={step === 0}
		class:py-16={step === 0}
		class:max-w-3xl={step !== 0}
		class:py-10={step !== 0}
	>
		{#if step === 0}
			<StartStep
				onPickFile={handlePickFile}
				onCreateFresh={handleCreateFresh}
				{loading}
				{isAdmin}
			/>
		{:else if importData}
			<ImportWizardStep
				{step}
				bind:data={importData}
				{isAdmin}
				{loading}
				onOpenAddCountries={openAddCountries}
				onApply={createConference}
				onDownload={downloadFile}
				onJump={goToStep}
			/>
		{/if}
	</main>

	{#if step > 0 && step < IMPORT_STEP_COUNT}
		<ImportFooterNav {step} onStep={goToStep} />
	{/if}

	{#if showJsonPanel && importData}
		<ImportJsonPanel data={importData} onClose={() => (showJsonPanel = false)} />
	{/if}
</div>

<AddCountriesModal bind:open={addCountriesModalOpen} onSubmit={handleAddCountries} />
