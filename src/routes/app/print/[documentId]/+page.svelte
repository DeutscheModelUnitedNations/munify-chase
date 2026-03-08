<script lang="ts">
	import type { PageData } from './$houdini';
	import {
		ResolutionPrintPreview,
		migrateResolution,
		type Resolution,
		type ResolutionHeaderData
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.PrintPaperQuery);
	let paper = $derived($query.data?.findFirstResolutionPaper);

	let resolution = $derived(paper?.content ? migrateResolution(paper.content as Resolution) : null);

	let headerData = $derived<ResolutionHeaderData>({
		conferenceTitle: paper?.committee?.conference?.title ?? undefined,
		committeeAbbreviation: paper?.committee?.abbreviation ?? undefined,
		committeeFullName: paper?.committee?.name ?? undefined,
		committeeResolutionHeadline: paper?.committee?.resolutionHeadline ?? undefined,
		documentNumber:
			paper?.documentNumber?.replace(`${paper?.committee?.abbreviation}/`, '') ?? undefined,
		topic: paper?.agendaItem?.title ?? undefined,
		authoringDelegation:
			getTranslatedCountryNameFromAlpha3Code(paper?.creator?.representation?.alpha3Code) ??
			paper?.creator?.representation?.name ??
			undefined,
		sponsoringDelegations: paper?.sponsors
			?.map(
				(s: (typeof paper.sponsors)[number]) =>
					getTranslatedCountryNameFromAlpha3Code(s.committeeMember?.representation?.alpha3Code) ??
					s.committeeMember?.representation?.name ??
					''
			)
			.filter(Boolean)
			.sort((a: string, b: string) => a.localeCompare(b)),
		lastEdited: paper?.updatedAt ?? undefined
	});
</script>

<div class="p-8 print:p-0">
	{#if resolution}
		<ResolutionPrintPreview {resolution} {headerData} labels={getResolutionLabels()} />
	{:else}
		<div class="flex justify-center items-center min-h-screen">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{/if}
</div>
