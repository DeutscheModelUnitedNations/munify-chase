<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import { getResolutionLabels } from '$lib/utils/resolutionEditorLabels';
	import {
		OperativeParagraphEditor,
		type OperativeClause
	} from '@deutschemodelunitednations/munify-resolution-editor';
	import {
		serializeClause,
		parseClauseFragment
	} from '@deutschemodelunitednations/munify-resolution-editor/res-markup';

	type AmendmentType = 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION';

	interface Props {
		open: boolean;
		operativeClauses: OperativeClause[];

		// Chair mode: if provided, shows proposer selection step first
		committeeMembers?: Array<{
			id: string;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			representation: any;
		}>;

		// Pre-fill support (for participant inline buttons)
		initialType?: AmendmentType;
		initialTargetIndex?: number;

		// Edit mode support
		editMode?: boolean;
		initialProposerId?: string | null;
		initialNewContent?: string | null;
		initialTargetPosition?: number | null;

		// Called on submit with all args needed for the mutation
		onSubmit: (args: {
			type: AmendmentType;
			targetClauseId: string | null;
			targetOperativeIndex: number | null;
			targetPosition: number | null;
			newContent: string | null;
			committeeMemberId?: string;
		}) => Promise<void>;
	}

	let {
		open = $bindable(),
		operativeClauses,
		committeeMembers,
		initialType,
		initialTargetIndex,
		editMode = false,
		initialProposerId,
		initialNewContent,
		initialTargetPosition,
		onSubmit
	}: Props = $props();

	// Derived mode
	let isChairMode = $derived(!!committeeMembers);
	let typeStep = $derived(isChairMode ? 2 : 1);
	let contentStep = $derived(isChairMode ? 3 : 2);

	// Internal state
	let step = $state(1);
	let selectedProposer = $state<string | null>(null);
	let proposerSearchQuery = $state('');
	let selectedType = $state<AmendmentType | null>(null);
	let selectedSourceIndex = $state<number>(0);
	// RES-Markup fragment of the new/edited clause (ALTER_TEXT + ADD).
	let markup = $state('');
	// RES-Markup of the original clause, used as the diff base (ALTER_TEXT).
	let oldMarkup = $state('');
	let showDiff = $state(true);
	let targetPosition = $state<number>(0);
	let submitting = $state(false);
	let confirmingDelete = $state(false);

	let markupParse = $derived(parseClauseFragment(markup));
	let markupValid = $derived(markup.trim().length > 0 && markupParse.valid);

	// Serialize an operative clause to a RES-Markup fragment (diff base /
	// editing seed). Empty string if the clause is missing.
	function clauseMarkup(index: number): string {
		const clause = operativeClauses[index];
		return clause ? serializeClause(clause) : '';
	}

	// Set up the markup editor state for a given amendment type. For
	// ALTER_TEXT the original clause is the diff base and the editing seed;
	// for ADD the editor starts blank with no diff base.
	function initMarkup(type: AmendmentType, sourceIndex: number) {
		if (type === 'ALTER_TEXT') {
			oldMarkup = clauseMarkup(sourceIndex);
			markup = initialNewContent ?? oldMarkup;
			showDiff = true;
		} else if (type === 'ADD') {
			oldMarkup = '';
			markup = initialNewContent ?? '';
			showDiff = false;
		} else {
			oldMarkup = '';
			markup = '';
			showDiff = false;
		}
	}

	// Reset on open change
	$effect(() => {
		if (open) {
			confirmingDelete = false;
			if (editMode && initialType != null) {
				// Edit mode: pre-fill all fields, type is locked
				selectedType = initialType;
				selectedSourceIndex = initialTargetIndex ?? 0;
				selectedProposer = initialProposerId ?? null;
				proposerSearchQuery = '';
				submitting = false;

				initMarkup(initialType, selectedSourceIndex);
				targetPosition = initialTargetPosition ?? 0;

				if (initialType === 'DELETE') {
					// For DELETE, go to type step so they can change target
					step = typeStep;
				} else {
					step = contentStep;
				}
			} else if (initialType != null && initialTargetIndex != null) {
				// Pre-filled mode from participant inline buttons
				selectedType = initialType;
				selectedSourceIndex = initialTargetIndex;
				selectedProposer = null;
				proposerSearchQuery = '';

				if (initialType === 'DELETE') {
					// Show confirmation before submitting DELETE
					confirmingDelete = true;
					submitting = false;
					return;
				}
				submitting = false;
				initMarkup(initialType, initialTargetIndex);
				if (initialType === 'ADD') {
					targetPosition = initialTargetIndex; // insert after this index
				} else if (initialType === 'ALTER_POSITION') {
					// Default to "after OP 2" when source is first; "at beginning" otherwise
					targetPosition = initialTargetIndex === 0 ? 1 : -1;
				}
				step = contentStep;
			} else {
				// Fresh open — reset all
				step = 1;
				selectedProposer = null;
				proposerSearchQuery = '';
				selectedType = null;
				selectedSourceIndex = 0;
				markup = '';
				oldMarkup = '';
				showDiff = true;
				targetPosition = 0;
				submitting = false;
			}
		}
	});

	// Filtered member list for chair proposer selection
	let filteredMembers = $derived.by(() => {
		if (!committeeMembers) return [];
		const q = proposerSearchQuery.toLowerCase();
		const list = q
			? committeeMembers.filter((member) =>
					getRepName(member.representation).toLowerCase().includes(q)
				)
			: committeeMembers;
		return [...list].sort((a, b) =>
			getRepName(a.representation).localeCompare(getRepName(b.representation))
		);
	});

	function getRepName(
		rep: { name?: string | null; alpha3Code?: string | null } | null | undefined
	): string {
		return getTranslatedCountryNameFromAlpha3Code(rep?.alpha3Code) ?? rep?.name ?? '';
	}

	function handleSelectProposer(memberId: string) {
		selectedProposer = memberId;
		step = typeStep;
	}

	function handleConfirmType() {
		if (!selectedType) return;

		if (selectedType === 'DELETE') {
			confirmingDelete = true;
			return;
		}

		if (selectedType === 'ALTER_TEXT') {
			initMarkup('ALTER_TEXT', selectedSourceIndex);
		} else if (selectedType === 'ADD') {
			initMarkup('ADD', selectedSourceIndex);
			// Default: insert after the selected position
			if (operativeClauses.length === 0) {
				targetPosition = -1; // insert as first
			} else {
				targetPosition = selectedSourceIndex;
			}
		} else if (selectedType === 'ALTER_POSITION') {
			// Default to "after OP 2" when source is first; "at beginning" otherwise
			targetPosition = selectedSourceIndex === 0 ? 1 : -1;
		}

		step = contentStep;
	}

	async function doSubmit() {
		if (submitting) return;
		if (!selectedType) return;

		const isAdd = selectedType === 'ADD';
		const isAlterPos = selectedType === 'ALTER_POSITION';
		const isDelete = selectedType === 'DELETE';
		const isAlterText = selectedType === 'ALTER_TEXT';

		if ((isAlterText || isAdd) && !markupValid) return;
		submitting = true;

		const targetClause = operativeClauses[selectedSourceIndex];

		try {
			await onSubmit({
				type: selectedType,
				targetClauseId: isDelete || isAlterText || isAlterPos ? (targetClause?.id ?? null) : null,
				targetOperativeIndex: !isAdd ? selectedSourceIndex : null,
				targetPosition: isAdd ? targetPosition : isAlterPos ? targetPosition : null,
				newContent: isAlterText || isAdd ? markup : null,
				...(isChairMode && selectedProposer ? { committeeMemberId: selectedProposer } : {})
			});
			open = false;
		} finally {
			submitting = false;
		}
	}

	// Total step count for step indicator
	let totalSteps = $derived.by(() => {
		if (isChairMode) {
			return selectedType === 'DELETE' ? 2 : 3;
		}
		return selectedType === 'DELETE' ? 1 : 2;
	});
</script>

<Modal bind:open>
	<div class="flex items-center justify-between mb-4">
		<h3 class="font-bold text-lg">
			{editMode ? m.editAmendment() : isChairMode ? m.chairCreateAmendment() : m.proposeAmendment()}
		</h3>
		<button class="btn btn-ghost btn-sm" onclick={() => (open = false)} aria-label={m.close()}>
			<i class="fas fa-times"></i>
		</button>
	</div>

	{#if confirmingDelete}
		<!-- DELETE confirmation -->
		<div class="flex flex-col items-center gap-4 py-4">
			<i class="fas fa-exclamation-triangle text-warning text-4xl"></i>
			<p class="text-center">{m.confirmDeleteAmendment()}</p>
			<p class="text-center text-sm opacity-70">
				{m.amendmentDelete()} — <span class="font-mono">OP {selectedSourceIndex + 1}</span>
			</p>
			<div class="flex gap-2 w-full justify-end">
				<button class="btn btn-ghost btn-sm" onclick={() => (open = false)}>
					{m.cancel()}
				</button>
				<button class="btn btn-error btn-sm" onclick={doSubmit} disabled={submitting}>
					{#if submitting}
						<span class="loading loading-spinner loading-sm"></span>
					{/if}
					{m.amendmentDelete()}
				</button>
			</div>
		</div>
	{:else}
		<!-- Step indicator -->
		<ul class="steps steps-horizontal w-full mb-4">
			{#if isChairMode}
				<li class="step {step >= 1 ? 'step-primary' : ''}">{m.selectProposerDelegation()}</li>
			{/if}
			<li class="step {step >= typeStep ? 'step-primary' : ''}">{m.selectAmendmentType()}</li>
			{#if totalSteps > (isChairMode ? 2 : 1)}
				<li class="step {step >= contentStep ? 'step-primary' : ''}">{m.edit()}</li>
			{/if}
		</ul>

		{#if isChairMode && step === 1}
			<!-- Chair Step 1: Select proposer -->
			<input
				class="input input-bordered w-full mb-3"
				placeholder={m.searchMembers()}
				bind:value={proposerSearchQuery}
			/>
			<div class="max-h-64 overflow-y-auto space-y-1">
				{#each filteredMembers as member (member.id)}
					<button
						class="btn btn-ghost btn-sm w-full justify-start gap-2"
						onclick={() => handleSelectProposer(member.id)}
					>
						<Flag representation={member.representation} size="xs" />
						<span>{getRepName(member.representation)}</span>
					</button>
				{/each}
				{#if filteredMembers.length === 0}
					<p class="text-center text-sm opacity-60 py-4">{m.noResults()}</p>
				{/if}
			</div>
		{:else if step === typeStep}
			<!-- Type + target selection -->
			<div class="flex flex-col gap-3">
				{#if editMode && selectedType}
					<!-- Read-only type badge in edit mode -->
					{@const typeBadgeClass = {
						DELETE: 'badge-error',
						ADD: 'badge-success',
						ALTER_TEXT: 'badge-warning',
						ALTER_POSITION: 'badge-info'
					}[selectedType]}
					{@const typeIcon = {
						DELETE: 'fa-trash',
						ADD: 'fa-plus',
						ALTER_TEXT: 'fa-pen',
						ALTER_POSITION: 'fa-arrows-alt'
					}[selectedType]}
					{@const typeLabel = {
						DELETE: m.amendmentDelete(),
						ADD: m.amendmentAdd(),
						ALTER_TEXT: m.amendmentAlterText(),
						ALTER_POSITION: m.amendmentAlterPosition()
					}[selectedType]}
					<div class="badge {typeBadgeClass} gap-1">
						<i class="fas {typeIcon}"></i>
						{typeLabel}
					</div>
				{:else}
					<div class="grid grid-cols-2 gap-2">
						<button
							class="btn btn-sm {selectedType === 'DELETE' ? 'btn-error' : 'btn-outline'}"
							onclick={() => (selectedType = 'DELETE')}
						>
							<i class="fas fa-trash mr-1"></i>
							{m.amendmentDelete()}
						</button>
						<button
							class="btn btn-sm {selectedType === 'ADD' ? 'btn-success' : 'btn-outline'}"
							onclick={() => (selectedType = 'ADD')}
						>
							<i class="fas fa-plus mr-1"></i>
							{m.amendmentAdd()}
						</button>
						<button
							class="btn btn-sm {selectedType === 'ALTER_TEXT' ? 'btn-warning' : 'btn-outline'}"
							onclick={() => (selectedType = 'ALTER_TEXT')}
						>
							<i class="fas fa-pen mr-1"></i>
							{m.amendmentAlterText()}
						</button>
						<button
							class="btn btn-sm {selectedType === 'ALTER_POSITION' ? 'btn-info' : 'btn-outline'}"
							onclick={() => (selectedType = 'ALTER_POSITION')}
						>
							<i class="fas fa-arrows-alt mr-1"></i>
							{m.amendmentAlterPosition()}
						</button>
					</div>
				{/if}

				{#if selectedType}
					<div class="form-control">
						<div class="label">
							<span class="label-text">{m.selectTargetClause()}</span>
						</div>
						{#if selectedType === 'ADD'}
							<select class="select select-bordered w-full" bind:value={selectedSourceIndex}>
								{#if operativeClauses.length === 0}
									<option value={-1}>{m.insertAsFirstClause()}</option>
								{:else}
									<option value={-1}>{m.insertAtBeginning()}</option>
									{#each operativeClauses as clause, i (clause.id)}
										<option value={i}>
											{m.insertAfterPresentation({ index: String(i + 1) })}
										</option>
									{/each}
								{/if}
							</select>
						{:else if operativeClauses.length > 0}
							<select class="select select-bordered w-full" bind:value={selectedSourceIndex}>
								{#each operativeClauses as clause, i (clause.id)}
									<option value={i}>OP {i + 1}</option>
								{/each}
							</select>
						{:else}
							<p class="text-sm opacity-60 py-2">{m.noResults()}</p>
						{/if}
					</div>

					<div class="flex justify-end gap-2">
						{#if isChairMode}
							<button class="btn btn-ghost btn-sm" onclick={() => (step = 1)}>
								{m.back()}
							</button>
						{/if}
						<button
							class="btn btn-primary btn-sm"
							onclick={handleConfirmType}
							disabled={selectedType !== 'ADD' && operativeClauses.length === 0}
						>
							{selectedType === 'DELETE'
								? editMode
									? m.saveChanges()
									: m.submitAmendment()
								: m.forward()}
						</button>
					</div>
				{/if}
			</div>
		{:else if step === contentStep}
			<!-- Content editing -->
			<div class="flex flex-col gap-3">
				{#if selectedType === 'ALTER_TEXT' || selectedType === 'ADD'}
					{#if selectedType === 'ALTER_TEXT'}
						<p class="text-sm">
							{m.alterText()} — <span class="font-mono">OP {selectedSourceIndex + 1}</span>
						</p>
					{:else}
						<p class="text-sm">
							{m.addClause()} — {m.targetPosition()}:
							<span class="font-mono">
								{#if targetPosition === -1}
									{m.insertAtBeginning()}
								{:else}
									{m.insertAfterPresentation({ index: String(targetPosition + 1) })}
								{/if}
							</span>
						</p>
					{/if}
					<div class="border rounded-lg p-2">
						{#if selectedType === 'ALTER_TEXT'}
							<OperativeParagraphEditor
								bind:markup
								bind:oldMarkup
								bind:showDiff
								operativeNumber={selectedSourceIndex + 1}
								labels={getResolutionLabels()}
							/>
						{:else}
							<OperativeParagraphEditor
								bind:markup
								operativeNumber={targetPosition === -1 ? 1 : targetPosition + 2}
								labels={getResolutionLabels()}
							/>
						{/if}
					</div>
					{#if markup.trim().length > 0 && !markupParse.valid}
						<p class="text-error text-sm">{m.operativeParagraphInvalidMarkup()}</p>
					{/if}
				{:else if selectedType === 'ALTER_POSITION'}
					<p class="text-sm mb-2">
						{m.alterPosition()} — <span class="font-mono">OP {selectedSourceIndex + 1}</span>
					</p>
					<div class="form-control">
						<div class="label">
							<span class="label-text">{m.targetPosition()}</span>
						</div>
						<select class="select select-bordered w-full" bind:value={targetPosition}>
							{#if selectedSourceIndex !== 0}
								<option value={-1}>{m.insertAtBeginning()}</option>
							{/if}
							{#each operativeClauses as clause, i (clause.id)}
								{#if i !== selectedSourceIndex}
									<option value={i}>
										{m.insertAfterPresentation({ index: String(i + 1) })}
									</option>
								{/if}
							{/each}
						</select>
					</div>
				{/if}

				<div class="flex justify-end gap-2">
					<button class="btn btn-ghost btn-sm" onclick={() => (step = typeStep)}>
						{m.back()}
					</button>
					<button
						class="btn btn-primary btn-sm"
						onclick={doSubmit}
						disabled={submitting ||
							((selectedType === 'ALTER_TEXT' || selectedType === 'ADD') && !markupValid)}
					>
						{editMode ? m.saveChanges() : m.submitAmendment()}
					</button>
				</div>
			</div>
		{/if}
	{/if}
</Modal>
