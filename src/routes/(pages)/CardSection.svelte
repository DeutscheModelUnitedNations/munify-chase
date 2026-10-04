<script lang="ts">
	import Card from './Card.svelte';
	import { m } from '$lib/paraglide/messages';

	import candidate from '$assets/undraw/candidate.svg';
	import voting from '$assets/undraw/voting.svg';
	import teamCollaboration from '$assets/undraw/team_collaboration.svg';
</script>

<section class="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 pb-16 md:px-12 lg:pb-32">
	<div class="enter-up flex flex-col gap-3" style="--enter-delay: 750ms">
		<span class="text-accent-600 text-xs font-bold tracking-[0.08em] uppercase">
			{m.homeFeaturesEyebrow()}
		</span>
		<h2 class="text-primary text-[27px] leading-none font-bold">{m.homeFeaturesTitle()}</h2>
	</div>
	<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
		<div class="enter-up h-full" style="--enter-delay: 850ms">
			<Card
				src={candidate}
				alt="SpeakersList"
				header={m.homeHeroCardSpeakersListTitle()}
				text={m.homeHeroCardSpeakersListText()}
			/>
		</div>
		<div class="enter-up h-full" style="--enter-delay: 950ms">
			<Card
				src={voting}
				alt="Voting"
				header={m.homeHeroCardVotingTitle()}
				text={m.homeHeroCardVotingText()}
			/>
		</div>
		<div class="enter-up h-full" style="--enter-delay: 1050ms">
			<Card
				src={teamCollaboration}
				alt="Resolution Editor"
				header={m.homeHeroCardResolutionEditorTitle()}
				text={m.homeHeroCardResolutionEditorText()}
			/>
		</div>
	</div>
</section>
