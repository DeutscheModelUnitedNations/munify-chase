<script lang="ts" module>
	import type { ComponentProps } from 'svelte';
	import StatusWidget from './StatusWidget.svelte';

	/** What the status and majorities cards at the top of a chair page read */
	export type CommitteeOverview = NonNullable<ComponentProps<typeof StatusWidget>['committee']> & {
		totalPresent: number | null;
		simpleMajority: number | null;
		twoThirdsMajority: number | null;
	};
</script>

<script lang="ts">
	import BasicCard from '#lib/components/BasicCard.svelte';
	import Majorities from '#lib/components/Majorities.svelte';

	let { committee }: { committee: CommitteeOverview } = $props();

	const minAmendmentSponsors = $derived(Math.ceil((committee.totalPresent ?? 0) * 0.1));
</script>

<BasicCard>
	<StatusWidget {committee} />
</BasicCard>
<BasicCard>
	<Majorities
		totalPresent={committee.totalPresent}
		simpleMajority={committee.simpleMajority}
		twoThirdsMajority={committee.twoThirdsMajority}
		{minAmendmentSponsors}
	/>
</BasicCard>
