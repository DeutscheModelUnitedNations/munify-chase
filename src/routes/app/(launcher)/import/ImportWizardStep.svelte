<script lang="ts">
	import BasicsStep from '#lib/components/importWizard/BasicsStep.svelte';
	import CommitteesStep from '#lib/components/importWizard/CommitteesStep.svelte';
	import DelegationsStep from '#lib/components/importWizard/DelegationsStep.svelte';
	import ActorsStep from '#lib/components/importWizard/ActorsStep.svelte';
	import RequestTypesStep from '#lib/components/importWizard/RequestTypesStep.svelte';
	import ReviewStep from '#lib/components/importWizard/ReviewStep.svelte';
	import type { ImportData } from './importWizard';

	interface Props {
		/** The current step, from 1 */
		step: number;
		data: ImportData;
		isAdmin: boolean;
		loading: boolean;
		onOpenAddCountries: (committeeId: string) => void;
		onApply: () => void;
		onDownload: () => void;
		onJump: (step: number) => void;
	}

	let {
		step,
		data = $bindable(),
		isAdmin,
		loading,
		onOpenAddCountries,
		onApply,
		onDownload,
		onJump
	}: Props = $props();
</script>

{#if step === 1}
	<BasicsStep bind:data />
{:else if step === 2}
	<CommitteesStep bind:data />
{:else if step === 3}
	<DelegationsStep bind:data {onOpenAddCountries} />
{:else if step === 4}
	<ActorsStep bind:data />
{:else if step === 5}
	<RequestTypesStep bind:data />
{:else if step === 6}
	<ReviewStep {data} {isAdmin} {loading} {onApply} {onDownload} {onJump} />
{/if}
