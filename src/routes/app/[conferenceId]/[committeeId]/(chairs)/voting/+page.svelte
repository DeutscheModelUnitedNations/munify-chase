<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { PageData } from './$houdini';
	import { onMount } from 'svelte';
	import { CommitteeSubscription } from '../committeeSubscription';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import Majorities from '$lib/components/Majorities.svelte';
	import UndrawError from '$lib/components/UndrawError.svelte';
	import emptyStreet from '$assets/undraw/empty_street.svg';
	import StatusWidget from '../StatusWidget.svelte';
	import ShowOfHandsVotingSetup from '$lib/components/voting/ShowOfHandsVotingSetup.svelte';

	let { data }: { data: PageData } = $props();

	let query = $derived(data?.CommitteeTeamQuery);
	let committee = $derived(
		$CommitteeSubscription.data?.findFirstCommittee ?? $query.data?.findFirstCommittee
	);
</script>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<div class="top-22 flex h-full flex-col gap-4 lg:sticky lg:w-lg">
				<BasicCard>
					<StatusWidget {committee} />
				</BasicCard>
				<BasicCard>
					<Majorities
						totalPresent={committee.totalPresent}
						simpleMajority={committee.simpleMajority}
						twoThirdsMajority={committee.twoThirdsMajority}
						paperSupportThreshold={committee.paperSupportThreshold}
					/>
				</BasicCard>
			</div>
			<div class="flex h-full w-full flex-3 flex-col gap-4">
				<BasicCard title={m.showOfHandsVoting()}>
					<ShowOfHandsVotingSetup {committee} />
				</BasicCard>
				<BasicCard title={m.rollCallVoting()}>Coming Soon</BasicCard>
			</div>
		</div>
	</div>
{:else}
	<UndrawError
		undrawImage={emptyStreet}
		title={m.committeeDoesNotExist()}
		buttonText={m.back()}
		buttonLink="/app"
	/>
{/if}
