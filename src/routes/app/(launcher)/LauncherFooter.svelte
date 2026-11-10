<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { resolve } from '$app/paths';

	interface Props {
		/** The linked DELEGATOR, where conferences come from while linked */
		delegatorUrl: string | null | undefined;
		isGlobalAdmin: boolean;
	}

	let { delegatorUrl, isGlobalAdmin }: Props = $props();
</script>

{#if delegatorUrl}
	<footer class="mt-8 flex flex-col items-center gap-2 pt-6 text-center">
		<p class="text-base-content/70 m-0 text-sm">{m.delegatorLinkConferencesFromDelegator()}</p>
		<a class="btn btn-ghost btn-sm" href={delegatorUrl} target="_blank" rel="noopener">
			<i aria-hidden="true" class="ph-duotone ph-arrow-square-out"></i>
			{m.delegatorLinkOpen()}
		</a>
	</footer>
{:else if isGlobalAdmin}
	<footer
		class="from-base-100 sticky bottom-0 mt-8 flex flex-col gap-2 bg-gradient-to-b from-35% to-transparent py-4 [&>.btn]:w-full"
		style="background: linear-gradient(180deg, transparent 0%, var(--color-base-100) 35%);"
	>
		<a class="btn btn-primary btn-lg" href={resolve('/app/(launcher)/import')}>
			<i aria-hidden="true" class="ph-fill ph-plus"></i>
			{m.createConference()}
		</a>
		<a class="btn btn-ghost btn-sm" href={resolve('/app/(launcher)/import')}>
			<i aria-hidden="true" class="ph-duotone ph-file-arrow-up"></i>
			{m.launcherImportDelegator()}
		</a>
	</footer>
{:else}
	<footer class="mt-8 flex justify-center pt-6">
		<a class="btn btn-ghost btn-sm" href={resolve('/app/(launcher)/import')}>
			<i aria-hidden="true" class="ph-fill ph-plus"></i>
			{m.createConference()}
		</a>
	</footer>
{/if}
