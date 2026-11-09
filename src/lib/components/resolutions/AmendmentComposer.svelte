<script lang="ts">
	import { errorMessage } from '#lib/helpers/errorMessage';
	import DialogBackdrop from '../DialogBackdrop.svelte';
	import { modalFocus } from '#lib/helpers/modalFocus';
	import { untrack } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { serializeClause } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
	import toast from 'svelte-french-toast';
	import { isTeam, type AmendmentType, type ResolutionViewer } from './paperContext';
	import {
		type OperativeClause,
		OperativeParagraphEditor
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import { englishOperativePhrases } from '@deutschemodelunitednations/munify-resolution-editor/phrases';
	import { getResolutionLabels } from '#lib/utils/resolutionEditorLabels';
	import { fetchCommitteeMembers } from './committeeMembers';
	import { representationName } from './sponsors';
	import {
		type AmendmentDraft,
		amendmentNeeds,
		canSubmitDraft,
		createAmendmentArgs,
		draftProblem,
		isQueuedOffline,
		markupError
	} from './amendmentDraft';
	import ProposerPicker from './ProposerPicker.svelte';
	import TargetClausePicker from './TargetClausePicker.svelte';
	import TargetPositionPicker from './TargetPositionPicker.svelte';

	interface Props {
		open: boolean;
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		operative: OperativeClause[];
		viewer: ResolutionViewer;
		close: () => void;
	}

	let {
		open = $bindable(),
		paperId,
		committeeId,
		selectedClauseId,
		operative,
		viewer,
		close
	}: Props = $props();

	// Track which clause the user has picked as target inside the dialog.
	// Pre-select whatever is currently selected in the editor.
	// eslint-disable-next-line svelte/prefer-writable-derived -- writable and reactive to prop changes
	let targetClauseId = $state<string | null>(null);
	$effect(() => {
		targetClauseId = selectedClauseId;
	});
	let targetClauseIndex = $derived(operative.findIndex((c) => c.id === targetClauseId));

	let clauseSearch = $state('');

	$effect(() => {
		if (open) {
			// untrack so selectedClauseId is read once on open, not re-tracked as a
			// dependency — prevents sidebar selection changes (or type changes that
			// trigger reactive cascades) from resetting the in-modal target clause.
			targetClauseId = untrack(() => selectedClauseId);
			clauseSearch = '';
		}
	});

	const team = $derived(isTeam(viewer));

	const members = await fetchCommitteeMembers(committeeId);

	let proposerValue = $state('');
	const selectedMember = $derived(
		(members ?? []).find((mem) => representationName(mem.representation) === proposerValue) ?? null
	);

	let type = $state<AmendmentType>('ALTER_TEXT');
	let newContent = $state('');
	// null means "show picker"; -1 means insert at beginning; >=0 means insert after clause at that index
	let targetPosition = $state<number | null>(null);
	let saving = $state(false);

	const needs = $derived(amendmentNeeds(type));

	// Diff base for ALTER_TEXT: serialized original clause, always in sync with selection
	const oldMarkup = $derived.by(() => {
		const clause = type === 'ALTER_TEXT' ? operative[targetClauseIndex] : undefined;
		return clause ? serializeClause(clause) : '';
	});

	const contentError = $derived(needs.content ? markupError(newContent) : null);

	const draft = $derived<AmendmentDraft>({
		type,
		team,
		proposerId: selectedMember?.id ?? null,
		targetClauseId,
		targetClauseIndex,
		newContent,
		contentError,
		targetPosition,
		oldMarkup
	});
	const canSubmit = $derived(canSubmitDraft(draft));

	// Seed editor content when the target clause or type changes
	$effect(() => {
		if (type === 'ALTER_TEXT' && targetClauseIndex >= 0) {
			newContent = oldMarkup;
		} else if (type !== 'ALTER_TEXT') {
			newContent = '';
		}
	});

	$effect(() => {
		if (open) {
			targetPosition = operative.length > 0 ? operative.length - 1 : null;
		}
	});

	function sent() {
		toast.success(m.amendmentCreated());
		newContent = '';
		proposerValue = '';
		close();
	}

	async function submit() {
		const problem = draftProblem(draft);
		if (problem) {
			toast.error(problem);
			return;
		}
		saving = true;
		try {
			await client.mutate.createAmendment({
				__args: createAmendmentArgs({ id: nanoid(), paperId, draft }),
				id: true
			});
			sent();
		} catch (err) {
			// Network errors mean the request was queued for offline sync — the
			// optimistic update is already visible in the list, so close the dialog
			// and show the normal success message.
			if (isQueuedOffline(err)) sent();
			else toast.error(errorMessage(err, 'Failed to create amendment'));
		} finally {
			saving = false;
		}
	}

	const types: { value: AmendmentType; label: () => string; icon: string }[] = [
		{ value: 'ALTER_TEXT', label: () => m.amendmentTypeAlterText(), icon: 'pen' },
		{ value: 'DELETE', label: () => m.amendmentTypeDelete(), icon: 'trash' },
		{ value: 'ADD', label: () => m.amendmentTypeAdd(), icon: 'plus' },
		{
			value: 'ALTER_POSITION',
			label: () => m.amendmentTypeAlterPosition(),
			icon: 'arrows-down-up'
		}
	];
</script>

{#snippet typeTabs()}
	<!-- Amendment type -->
	<div class="bg-base-300 flex gap-1 rounded-lg p-1">
		{#each types as t (t.value)}
			<button
				class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors {type ===
				t.value
					? 'bg-base-100 text-base-content shadow-sm'
					: 'text-base-content/50 hover:text-base-content'}"
				onclick={() => (type = t.value)}
			>
				<i aria-hidden="true" class="ph-fill ph-{t.icon} text-xs"></i>
				{t.label()}
			</button>
		{/each}
	</div>
{/snippet}

{#snippet contentEditor()}
	<div class="flex flex-col gap-1">
		{#if type === 'ALTER_TEXT'}
			<OperativeParagraphEditor
				bind:markup={newContent}
				{oldMarkup}
				showDiff={true}
				editableOldMarkup={false}
				operativeNumber={Math.max(targetClauseIndex, 0) + 1}
				operativePhrases={englishOperativePhrases}
				labels={getResolutionLabels()}
			/>
		{:else}
			<OperativeParagraphEditor
				bind:markup={newContent}
				operativeNumber={(targetPosition ?? -1) + 2}
				operativePhrases={englishOperativePhrases}
				labels={getResolutionLabels()}
			/>
		{/if}
		{#if contentError}
			<p class="text-error mt-1 text-xs">{m.invalidResMarkup()}: {contentError}</p>
		{/if}
	</div>
{/snippet}

<dialog class="modal" {open} aria-modal="true" {@attach open ? modalFocus() : undefined}>
	<div class="modal-box bg-base-200 flex flex-col w-11/12 max-w-4xl" style="min-height: 32rem;">
		<h3 class="mb-4 text-lg font-bold">{m.proposeAmendment()}</h3>

		<div class="flex flex-1 flex-col gap-4 overflow-y-auto">
			{@render typeTabs()}

			{#if team}
				<ProposerPicker
					bind:value={proposerValue}
					members={members ?? []}
					selected={selectedMember}
				/>
			{/if}

			{#if needs.targetClause}
				<TargetClausePicker bind:clauseId={targetClauseId} bind:search={clauseSearch} {operative} />
			{/if}

			{#if needs.content && (type !== 'ALTER_TEXT' || targetClauseId)}
				{@render contentEditor()}
			{/if}

			{#if needs.position}
				<TargetPositionPicker
					bind:position={targetPosition}
					{operative}
					movingIndex={type === 'ALTER_POSITION' ? targetClauseIndex : -1}
				/>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => close()}>{m.cancel()}</button>
			<button class="btn btn-primary" disabled={saving || !canSubmit} onclick={submit}>
				{#if saving}<i aria-hidden="true" class="ph-fill ph-spinner-gap animate-spin"></i>{/if}
				{m.proposeAmendment()}
			</button>
		</div>
	</div>
	<DialogBackdrop onclose={close} />
</dialog>
