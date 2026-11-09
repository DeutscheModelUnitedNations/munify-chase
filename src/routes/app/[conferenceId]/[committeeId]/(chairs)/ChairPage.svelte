<script lang="ts" generics="C extends CommitteeOverview">
	import type { Snippet } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import UndrawError from '#lib/components/UndrawError.svelte';
	import emptyStreet from '#assets/undraw/empty_street.svg';
	import CommitteeOverviewCards, { type CommitteeOverview } from './CommitteeOverviewCards.svelte';

	interface Props {
		/** The committee the page is about; missing shows that it does not exist */
		committee: C | null | undefined;
		/** Cards below the status and majorities in the sticky side column */
		sidebar?: Snippet<[C]>;
		/** The main column */
		children: Snippet<[C]>;
	}

	let { committee, sidebar, children }: Props = $props();
</script>

{#if committee}
	<div class="flex h-full w-full items-center justify-center">
		<div class="flex h-full w-full max-w-screen-xl flex-col gap-6 p-6 lg:flex-row">
			<div class="top-22 flex h-full flex-col gap-4 lg:sticky lg:w-lg">
				<CommitteeOverviewCards {committee} />
				{@render sidebar?.(committee)}
			</div>
			<div class="flex h-full w-full flex-3 flex-col gap-4">
				{@render children(committee)}
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
