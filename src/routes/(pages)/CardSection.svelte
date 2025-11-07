<script lang="ts">
import { fly } from "svelte/transition";
import candidate from "$lib/assets/undraw/candidate.svg";
import teamCollaboration from "$lib/assets/undraw/team_collaboration.svg";
import voting from "$lib/assets/undraw/voting.svg";
import { m } from "$lib/paraglide/messages";
import Card from "./Card.svelte";
</script>

<div class="grid grid-cols-1 justify-stretch gap-4 p-4 md:grid-cols-3">
	<div in:fly={{ y: 10, duration: 1000, delay: 1000 }}>
		<Card
			src={candidate}
			alt="SpeakersList"
			header={m.homeHeroCardSpeakersListTitle()}
			text={m.homeHeroCardSpeakersListText()}
		/>
	</div>
	<div in:fly={{ y: 10, duration: 1000, delay: 1200 }}>
		<Card
			src={voting}
			alt="Voting"
			header={m.homeHeroCardVotingTitle()}
			text={m.homeHeroCardVotingText()}
		/>
	</div>
	<div in:fly={{ y: 10, duration: 1000, delay: 1400 }}>
		<Card
			src={teamCollaboration}
			alt="Resolution Editor"
			header={m.homeHeroCardResolutionEditorTitle()}
			text={m.homeHeroCardResolutionEditorText()}
			comingSoonRibbon
		/>
	</div>
</div>
