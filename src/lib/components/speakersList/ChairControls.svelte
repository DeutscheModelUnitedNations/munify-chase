<script lang="ts">
	import type {
		CommitteeTeamQuery,
		CommitteeTeamQuery$result,
		SpeakersListCategoryEnum$options
	} from '$houdini';
	import { m } from '$lib/paraglide/messages';
	import { getFullTranslatedCountryNameFromISO3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { Command } from 'bits-ui';

	interface Props {
		committeeId: string;
		type: SpeakersListCategoryEnum$options;
		members: CommitteeTeamQuery$result['findFirstCommittee']['members'];
	}

	let { committeeId, members, type }: Props = $props();

	// State management
	let searchValue = '';
	let selectedMember: (typeof members)[0] | null = null;
	let speakersList: typeof members = [];

	// Function to add member to speakers list
	function addToSpeakersList(member: (typeof members)[0]) {
		if (!speakersList.find((m) => m.id === member.id)) {
			speakersList = [...speakersList, member];
		}
		selectedMember = null;
		searchValue = '';
	}

	// Function to remove member from speakers list
	function removeFromSpeakersList(id: string) {
		speakersList = speakersList.filter((member) => member.id !== id);
	}
</script>
