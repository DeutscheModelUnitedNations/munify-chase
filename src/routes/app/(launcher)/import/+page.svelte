<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { graphql } from '$houdini';
	import toast from 'svelte-french-toast';
	import { importDataSchema } from '$lib/utils/import';
	import { z } from 'zod/v4';
	import Footer from '$lib/components/Footer.svelte';
	import Navbar from '../../../(pages)/Navbar.svelte';

	// let { data }: PageData = $props();

	let file: File | null = $state(null);
	let loading = $state(false);
	let conferenceId = $state<string>();
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

	async function createConference() {
		if (!file) return;
		loading = true;
		let parsedData: any;
		try {
			parsedData = await parseFile(file);
		} catch (e) {
			toast.error(m.fileParseError());
			loading = false;
			return;
		}
		console.log('Parsed Data:', parsedData);
		const res = await ConferenceCreationMutation.mutate({ data: parsedData });
		conferenceId = res.data?.importDelegatorConference?.id;
		loading = false;
		setTimeout(() => {
			goto('/app');
		}, 3000);
	}
</script>

<Navbar />

<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center">
	<div class="bg-base-100 card flex w-full max-w-md flex-col items-center p-8 shadow-sm">
		<h1 class="mb-8 text-3xl font-bold">{m.importFromDelegator()}</h1>
		{#if !conferenceId}
			<input
				type="file"
				class="file-input file-input-bordered mb-6 w-full"
				onchange={handleFileChange}
				accept=".json"
			/>
			<button class="btn btn-primary w-full" onclick={createConference} disabled={loading || !file}>
				{#if loading}
					<span class="loading loading-spinner"></span>
				{:else}
					<i class="fas fa-paper-plane"></i>
					<span>{m.submit()}</span>
				{/if}
			</button>
		{:else}
			<div class="alert alert-success mb-4 shadow-lg">
				<i class="fas fa-check"></i>
				<span>{m.conferenceCreationSuccessful()}</span>
			</div>
		{/if}
	</div>
</div>

<Footer />
