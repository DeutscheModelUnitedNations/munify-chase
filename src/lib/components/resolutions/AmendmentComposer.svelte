<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
	import toast from 'svelte-french-toast';
	import type { AmendmentType } from './paperContext';

	interface Props {
		open: boolean;
		paperId: string;
		selectedClauseId: string | null;
		selectedClauseIndex: number | null;
		operativeCount: number;
		close: () => void;
	}

	let {
		open = $bindable(),
		paperId,
		selectedClauseId,
		selectedClauseIndex,
		operativeCount,
		close
	}: Props = $props();

	let type = $state<AmendmentType>('ALTER_TEXT');
	let newContent = $state('');
	let targetPosition = $state(0);
	let saving = $state(false);

	const needsContent = $derived(type === 'ADD' || type === 'ALTER_TEXT');
	const needsPosition = $derived(type === 'ADD' || type === 'ALTER_POSITION');
	const needsTargetClause = $derived(type !== 'ADD');

	const contentError = $derived.by(() => {
		if (!needsContent || !newContent.trim()) return null;
		const parsed = parseClauseFragment(newContent);
		return parsed.valid ? null : parsed.errors.map((e) => e.code).join(', ');
	});

	async function submit() {
		if (needsTargetClause && !selectedClauseId) {
			toast.error(m.selectClauseFirst());
			return;
		}
		if (needsContent && (!newContent.trim() || contentError)) {
			toast.error(m.amendmentContentInvalid());
			return;
		}
		saving = true;
		try {
			await client.mutate.createAmendment({
				__args: {
					id: nanoid(),
					paperId,
					type,
					targetClauseId: needsTargetClause ? (selectedClauseId ?? undefined) : undefined,
					targetOperativeIndex: needsTargetClause ? (selectedClauseIndex ?? undefined) : undefined,
					newContent: needsContent ? newContent : undefined,
					targetPosition: needsPosition ? targetPosition : undefined
				},
				id: true
			});
			toast.success(m.amendmentCreated());
			newContent = '';
			close();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create amendment');
		} finally {
			saving = false;
		}
	}

	const types: { value: AmendmentType; label: () => string }[] = [
		{ value: 'ALTER_TEXT', label: () => m.amendmentTypeAlterText() },
		{ value: 'DELETE', label: () => m.amendmentTypeDelete() },
		{ value: 'ADD', label: () => m.amendmentTypeAdd() },
		{ value: 'ALTER_POSITION', label: () => m.amendmentTypeAlterPosition() }
	];
</script>

<dialog class="modal" {open}>
	<div class="modal-box bg-base-200">
		<h3 class="mb-3 text-lg font-bold">{m.proposeAmendment()}</h3>

		<div class="flex flex-col gap-3">
			<div class="join">
				{#each types as t (t.value)}
					<button
						class="btn join-item btn-sm"
						class:btn-primary={type === t.value}
						onclick={() => (type = t.value)}
					>
						{t.label()}
					</button>
				{/each}
			</div>

			{#if needsTargetClause}
				<div class="text-base-content/70 text-sm">
					{#if selectedClauseId}
						{m.targetingClause({ index: String((selectedClauseIndex ?? 0) + 1) })}
					{:else}
						<span class="text-error">{m.selectClauseFirst()}</span>
					{/if}
				</div>
			{/if}

			{#if needsContent}
				<div>
					<textarea
						class="textarea textarea-bordered w-full font-mono text-sm"
						class:textarea-error={!!contentError}
						rows="4"
						placeholder={m.amendmentContentPlaceholder()}
						bind:value={newContent}
					></textarea>
					{#if contentError}
						<p class="text-error mt-1 text-xs">{m.invalidResMarkup()}: {contentError}</p>
					{/if}
				</div>
			{/if}

			{#if needsPosition}
				<label class="form-control">
					<span class="label-text text-sm">{m.targetPosition()}</span>
					<input
						type="number"
						class="input input-bordered input-sm w-32"
						min="0"
						max={operativeCount}
						bind:value={targetPosition}
					/>
				</label>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => close()}>{m.cancel()}</button>
			<button class="btn btn-primary" disabled={saving} onclick={submit}>
				{#if saving}<i class="fas fa-spinner fa-spin"></i>{/if}
				{m.proposeAmendment()}
			</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => close()}>close</button>
	</form>
</dialog>
