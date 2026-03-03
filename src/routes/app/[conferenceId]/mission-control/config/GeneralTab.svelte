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
			hasModeratedCaucus: boolean;
		};
	}

	let { conference }: Props = $props();

	let title = $state('');
	let pressWebsite = $state('');
	let hasModeratedCaucus = $state(false);
	let isSaving = $state(false);

	$effect(() => {
		title = conference.title;
		pressWebsite = conference.pressWebsite ?? '';
		hasModeratedCaucus = conference.hasModeratedCaucus;
	});

	const UpdateConferenceMutation = graphql(`
		mutation UpdateConferenceFromGeneralTab(
			$id: ID!
			$title: String
			$pressWebsite: String
			$hasModeratedCaucus: Boolean
		) {
			updateConference(
				id: $id
				title: $title
				pressWebsite: $pressWebsite
				hasModeratedCaucus: $hasModeratedCaucus
			) {
				id
				title
				pressWebsite
				hasModeratedCaucus
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
					hasModeratedCaucus
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
