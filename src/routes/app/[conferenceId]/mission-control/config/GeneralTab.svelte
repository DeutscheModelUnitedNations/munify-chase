<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';

	interface Props {
		conference: {
			id: string;
			title: string;
			pressWebsite: string | null;
			hasModeratedCaucus: boolean;
			resolutionFeatureEnabled: boolean;
		};
	}

	let { conference }: Props = $props();

	let title = $state('');
	let pressWebsite = $state('');
	let hasModeratedCaucus = $state(false);
	let resolutionFeatureEnabled = $state(true);
	let isSaving = $state(false);

	$effect(() => {
		title = conference.title;
		pressWebsite = conference.pressWebsite ?? '';
		hasModeratedCaucus = conference.hasModeratedCaucus;
		resolutionFeatureEnabled = conference.resolutionFeatureEnabled;
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
						hasModeratedCaucus,
						resolutionFeatureEnabled
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
