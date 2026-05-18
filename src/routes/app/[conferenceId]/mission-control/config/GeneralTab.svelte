<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { svgToDataUrl } from '$lib/utils/svgToDataUrl';

	interface Props {
		conference: {
			id: string;
			title: string;
			pressWebsite: string | null;
			location: string | null;
			startDate: Date | null;
			endDate: Date | null;
			hasModeratedCaucus: boolean;
			resolutionFeatureEnabled: boolean;
			logoSvg: string | null;
		};
	}

	let { conference }: Props = $props();

	let title = $state('');
	let pressWebsite = $state('');
	let location = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let hasModeratedCaucus = $state(false);
	let resolutionFeatureEnabled = $state(true);
	let logoSvg = $state('');
	let isSaving = $state(false);

	let logoPreview = $derived(svgToDataUrl(logoSvg));

	async function onLogoFileSelected(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const text = await file.text();
		if (file.size > 512 * 1024 || !text.includes('<svg')) {
			toast.error(m.invalidSvgLogo());
			input.value = '';
			return;
		}
		logoSvg = text;
		input.value = '';
	}

	function removeLogo() {
		logoSvg = '';
	}

	function toDateInputValue(d: Date | string | null | undefined): string {
		if (!d) return '';
		const date = d instanceof Date ? d : new Date(d);
		if (Number.isNaN(date.getTime())) return '';
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// Seed the form from the conference ONCE per conference (keyed by id).
	// The `conference` prop is a live query that re-emits frequently; resyncing
	// on every emit would clobber in-progress edits (e.g. a just-picked logo
	// file) before the user clicks Save.
	let syncedConferenceId: string | undefined = $state(undefined);
	$effect(() => {
		if (conference.id === syncedConferenceId) return;
		syncedConferenceId = conference.id;
		title = conference.title;
		pressWebsite = conference.pressWebsite ?? '';
		location = conference.location ?? '';
		startDate = toDateInputValue(conference.startDate);
		endDate = toDateInputValue(conference.endDate);
		hasModeratedCaucus = conference.hasModeratedCaucus;
		resolutionFeatureEnabled = conference.resolutionFeatureEnabled;
		logoSvg = conference.logoSvg ?? '';
	});

	async function saveSettings() {
		isSaving = true;
		try {
			await toast.promise(
				client.mutate.updateConference({
					__args: {
						id: conference.id,
						title,
						pressWebsite: pressWebsite || null,
						location: location || null,
						startDate: startDate ? new Date(startDate) : null,
						endDate: endDate ? new Date(endDate) : null,
						hasModeratedCaucus,
						resolutionFeatureEnabled,
						logoSvg
					},
					id: true
				}),
				promiseToastStrings(m.configuration(), 'update')
			);
		} finally {
			isSaving = false;
		}
	}
</script>

<BasicCard title={m.general()}>
	<div class="flex flex-col gap-4">
		<div class="form-control">
			<label class="label" for="conference-title">
				<span class="label-text">{m.conferenceTitle()}</span>
			</label>
			<input
				id="conference-title"
				type="text"
				class="input input-bordered w-full"
				bind:value={title}
			/>
		</div>

		<div class="form-control">
			<label class="label" for="press-website">
				<span class="label-text">{m.pressWebsite()}</span>
			</label>
			<input
				id="press-website"
				type="text"
				class="input input-bordered w-full"
				placeholder="https://..."
				bind:value={pressWebsite}
			/>
		</div>

		<div class="form-control">
			<label class="label" for="conference-location">
				<span class="label-text">{m.conferenceLocation()}</span>
			</label>
			<input
				id="conference-location"
				type="text"
				class="input input-bordered w-full"
				placeholder={m.conferenceLocationPlaceholder()}
				bind:value={location}
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="form-control">
				<label class="label" for="conference-start-date">
					<span class="label-text">{m.conferenceStartDate()}</span>
				</label>
				<input
					id="conference-start-date"
					type="date"
					class="input input-bordered w-full"
					bind:value={startDate}
				/>
			</div>
			<div class="form-control">
				<label class="label" for="conference-end-date">
					<span class="label-text">{m.conferenceEndDate()}</span>
				</label>
				<input
					id="conference-end-date"
					type="date"
					class="input input-bordered w-full"
					bind:value={endDate}
				/>
			</div>
		</div>

		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4" for="has-moderated-caucus">
				<input
					id="has-moderated-caucus"
					type="checkbox"
					class="toggle toggle-primary"
					bind:checked={hasModeratedCaucus}
				/>
				<div class="flex flex-col">
					<span class="label-text font-semibold">{m.hasModeratedCaucus()}</span>
					<span class="label-text-alt">{m.hasModeratedCaucusDescription()}</span>
				</div>
			</label>
		</div>

		<div class="form-control">
			<label class="label cursor-pointer justify-start gap-4" for="resolution-feature-enabled">
				<input
					id="resolution-feature-enabled"
					type="checkbox"
					class="toggle toggle-primary"
					bind:checked={resolutionFeatureEnabled}
				/>
				<div class="flex flex-col">
					<span class="label-text font-semibold">{m.resolutionFeatureEnabled()}</span>
					<span class="label-text-alt">{m.resolutionFeatureEnabledDescription()}</span>
				</div>
			</label>
		</div>

		<div class="form-control">
			<label class="label" for="conference-logo">
				<span class="label-text font-semibold">{m.conferenceLogo()}</span>
			</label>
			<span class="label-text-alt mb-2">{m.conferenceLogoDescription()}</span>
			<div class="flex items-center gap-4">
				{#if logoPreview}
					<img
						src={logoPreview}
						alt={m.conferenceLogo()}
						class="h-16 w-16 shrink-0 rounded border border-base-300 bg-base-100 object-contain p-1"
					/>
				{/if}
				<input
					id="conference-logo"
					type="file"
					accept="image/svg+xml,.svg"
					class="file-input file-input-bordered w-full"
					onchange={onLogoFileSelected}
				/>
				{#if logoSvg}
					<button type="button" class="btn btn-ghost btn-sm text-error" onclick={removeLogo}>
						<i class="fas fa-trash mr-1"></i>{m.removeLogo()}
					</button>
				{/if}
			</div>
		</div>

		<div class="mt-2">
			<button class="btn btn-primary" onclick={saveSettings} disabled={isSaving}>
				{#if isSaving}
					<span class="loading loading-spinner loading-sm"></span>
				{/if}
				{m.save()}
			</button>
		</div>
	</div>
</BasicCard>
