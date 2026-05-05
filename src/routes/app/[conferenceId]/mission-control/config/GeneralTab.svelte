<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { cache, graphql } from '$houdini';
	import { invalidateAll } from '$app/navigation';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

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
	let isSaving = $state(false);

	function toDateInputValue(d: Date | string | null | undefined): string {
		if (!d) return '';
		const date = d instanceof Date ? d : new Date(d);
		if (Number.isNaN(date.getTime())) return '';
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	$effect(() => {
		title = conference.title;
		pressWebsite = conference.pressWebsite ?? '';
		location = conference.location ?? '';
		startDate = toDateInputValue(conference.startDate);
		endDate = toDateInputValue(conference.endDate);
		hasModeratedCaucus = conference.hasModeratedCaucus;
		resolutionFeatureEnabled = conference.resolutionFeatureEnabled;
	});

	const UpdateConferenceMutation = graphql(`
		mutation UpdateConferenceFromGeneralTab(
			$id: ID!
			$title: String
			$pressWebsite: String
			$location: String
			$startDate: DateTime
			$endDate: DateTime
			$hasModeratedCaucus: Boolean
			$resolutionFeatureEnabled: Boolean
		) {
			updateConference(
				id: $id
				title: $title
				pressWebsite: $pressWebsite
				location: $location
				startDate: $startDate
				endDate: $endDate
				hasModeratedCaucus: $hasModeratedCaucus
				resolutionFeatureEnabled: $resolutionFeatureEnabled
			) {
				id
				title
				pressWebsite
				location
				startDate
				endDate
				hasModeratedCaucus
				resolutionFeatureEnabled
			}
		}
	`);

	async function saveSettings() {
		isSaving = true;
		try {
			await toast.promise(
				UpdateConferenceMutation.mutate({
					id: conference.id,
					title,
					pressWebsite: pressWebsite || null,
					location: location || null,
					startDate: startDate ? new Date(startDate) : null,
					endDate: endDate ? new Date(endDate) : null,
					hasModeratedCaucus,
					resolutionFeatureEnabled
				}),
				promiseToastStrings(m.configuration(), 'update')
			);
			cache.markStale();
			await invalidateAll();
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
