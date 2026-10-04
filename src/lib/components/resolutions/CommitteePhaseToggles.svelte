<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { registerCommands } from '$lib/commands/registry.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';

	interface Props {
		committeeId: string;
		amendmentSubmissionOpen: boolean;
		amendmentSponsoringOpen: boolean;
		supportReevaluationOpen: boolean;
	}

	let {
		committeeId,
		amendmentSubmissionOpen,
		amendmentSponsoringOpen,
		supportReevaluationOpen
	}: Props = $props();

	async function set(args: {
		amendmentSubmissionOpen?: boolean;
		amendmentSponsoringOpen?: boolean;
		supportReevaluationOpen?: boolean;
	}) {
		try {
			await client.mutate.setCommitteeResolutionToggles({
				__args: { committeeId, ...args },
				id: true,
				amendmentSubmissionOpen: true,
				amendmentSponsoringOpen: true,
				supportReevaluationOpen: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}

	// Same as flipping the matching toggle
	registerCommands(() => [
		{
			id: 'resolutions.amendment-submission',
			title: amendmentSubmissionOpen
				? m.commandCloseAmendmentSubmission
				: m.commandOpenAmendmentSubmission,
			group: 'page',
			icon: 'file-circle-plus',
			run: () => set({ amendmentSubmissionOpen: !amendmentSubmissionOpen })
		},
		{
			id: 'resolutions.amendment-sponsoring',
			title: amendmentSponsoringOpen
				? m.commandCloseAmendmentSponsoring
				: m.commandOpenAmendmentSponsoring,
			group: 'page',
			icon: 'handshake',
			run: () => set({ amendmentSponsoringOpen: !amendmentSponsoringOpen })
		},
		{
			id: 'resolutions.support-reevaluation',
			title: supportReevaluationOpen
				? m.commandCloseSupportReevaluation
				: m.commandOpenSupportReevaluation,
			group: 'page',
			icon: 'scale-balanced',
			run: () => set({ supportReevaluationOpen: !supportReevaluationOpen })
		}
	]);
</script>

<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
	<label class="label cursor-pointer gap-2 py-0">
		<input
			type="checkbox"
			class="toggle toggle-primary"
			checked={amendmentSubmissionOpen}
			onchange={(e) => set({ amendmentSubmissionOpen: e.currentTarget.checked })}
		/>
		<span class="label-text text-sm">{m.amendmentSubmission()}</span>
	</label>
	<label class="label cursor-pointer gap-2 py-0">
		<input
			type="checkbox"
			class="toggle toggle-primary"
			checked={amendmentSponsoringOpen}
			onchange={(e) => set({ amendmentSponsoringOpen: e.currentTarget.checked })}
		/>
		<span class="label-text text-sm">{m.amendmentSponsoring()}</span>
	</label>
	<label class="label cursor-pointer gap-2 py-0">
		<input
			type="checkbox"
			class="toggle toggle-primary"
			checked={supportReevaluationOpen}
			onchange={(e) => set({ supportReevaluationOpen: e.currentTarget.checked })}
		/>
		<span class="label-text text-sm">{m.supportReevaluation()}</span>
	</label>
</div>
