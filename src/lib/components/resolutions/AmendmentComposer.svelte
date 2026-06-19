<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
	import toast from 'svelte-french-toast';
	import Fuse, { type IFuseOptions } from 'fuse.js';
	import { isTeam, type AmendmentType, type ResolutionViewer } from './paperContext';
	import { type OperativeClause, getFirstTextContent, getAllTextContent } from '@deutschemodelunitednations/munify-resolution-editor';
	import { getTranslatedCountryNameFromAlpha3Code } from '$lib/utils/nationTranslationHelper.svelte';
	import Combobox from '$lib/components/Combobox.svelte';
	import Flag from '$lib/components/Flag.svelte';

	interface Props {
		open: boolean;
		paperId: string;
		committeeId: string;
		selectedClauseId: string | null;
		selectedClauseIndex: number | null;
		operative: OperativeClause[];
		operativeCount: number;
		viewer: ResolutionViewer;
		close: () => void;
	}

	let {
		open = $bindable(),
		paperId,
		committeeId,
		selectedClauseId,
		selectedClauseIndex,
		operative,
		operativeCount,
		viewer,
		close
	}: Props = $props();

	// Track which clause the user has picked as target inside the dialog.
	// Pre-select whatever is currently selected in the editor.
	let targetClauseId = $state<string | null>(selectedClauseId);
	let targetClauseIndex = $derived(operative.findIndex((c) => c.id === targetClauseId));

	let clauseSearch = $state('');
	const filteredClauses = $derived.by(() => {
		const q = clauseSearch.trim().toLowerCase();
		if (!q) return operative;
		return operative.filter((c) => getAllTextContent(c).toLowerCase().includes(q));
	});

	$effect(() => {
		if (open) {
			targetClauseId = selectedClauseId;
			clauseSearch = '';
		}
	});

	const team = $derived(isTeam(viewer));

	const members = await client.liveQuery.committeeMembers({
		__args: { where: { committee: { id: committeeId } } },
		id: true,
		representation: { name: true, alpha2Code: true, alpha3Code: true, faIcon: true, type: true }
	});

	function getMemberName(member: (typeof members)[number] | undefined) {
		return (
			getTranslatedCountryNameFromAlpha3Code(member?.representation?.alpha3Code) ??
			member?.representation?.name ??
			''
		);
	}

	type MemberItem = NonNullable<(typeof members)[number]>;
	type FuseItem = MemberItem & { label: string };
	const fuseOptions: IFuseOptions<FuseItem> = {
		keys: ['label'],
		ignoreFieldNorm: true,
		ignoreDiacritics: true,
		shouldSort: true
	};
	const fuse = new Fuse<FuseItem>([], fuseOptions);

	const filterMembers = (allMembers: typeof members, search: string) => {
		const plain = (allMembers ?? []) as MemberItem[];
		if (search.length > 0) {
			fuse.setCollection(plain.map((x) => ({ ...x, label: getMemberName(x) })));
			return fuse.search(search).map((r) => r.item as MemberItem);
		}
		return [...plain].sort((a, b) => getMemberName(a).localeCompare(getMemberName(b)));
	};

	let proposerValue = $state('');
	const selectedMember = $derived((members ?? []).find((mem) => getMemberName(mem) === proposerValue) ?? null);

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
		if (team && !selectedMember) {
			toast.error(m.selectProposerDelegation());
			return;
		}
		if (needsTargetClause && !targetClauseId) {
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
					targetClauseId: needsTargetClause ? (targetClauseId ?? undefined) : undefined,
					targetOperativeIndex: needsTargetClause ? (targetClauseIndex >= 0 ? targetClauseIndex : undefined) : undefined,
					newContent: needsContent ? newContent : undefined,
					targetPosition: needsPosition ? targetPosition : undefined,
					proposerCommitteeMemberId: team ? (selectedMember?.id ?? undefined) : undefined
				},
				id: true
			});
			toast.success(m.amendmentCreated());
			newContent = '';
			proposerValue = '';
			close();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to create amendment');
		} finally {
			saving = false;
		}
	}

	const types: { value: AmendmentType; label: () => string; icon: string }[] = [
		{ value: 'ALTER_TEXT', label: () => m.amendmentTypeAlterText(), icon: 'fa-pen' },
		{ value: 'DELETE', label: () => m.amendmentTypeDelete(), icon: 'fa-trash' },
		{ value: 'ADD', label: () => m.amendmentTypeAdd(), icon: 'fa-plus' },
		{ value: 'ALTER_POSITION', label: () => m.amendmentTypeAlterPosition(), icon: 'fa-arrows-up-down' }
	];
</script>

<dialog class="modal" {open}>
	<div class="modal-box bg-base-200 flex flex-col" style="min-height: 32rem;">
		<h3 class="mb-4 text-lg font-bold">{m.proposeAmendment()}</h3>

		<div class="flex flex-1 flex-col gap-4 overflow-y-auto">
			<!-- Amendment type -->
			<div class="bg-base-300 flex gap-1 rounded-lg p-1">
				{#each types as t (t.value)}
					<button
						class="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors {type === t.value ? 'bg-base-100 text-base-content shadow-sm' : 'text-base-content/50 hover:text-base-content'}"
						onclick={() => (type = t.value)}
					>
						<i class="fas {t.icon} text-xs"></i>
						{t.label()}
					</button>
				{/each}
			</div>

			<!-- Chair: proposer picker -->
			{#if team}
				<div class="flex flex-col gap-1">
					<span class="label-text text-sm font-medium">{m.selectProposerDelegation()}</span>
					{#if selectedMember}
						<div class="bg-base-100 flex items-center gap-2 rounded-lg px-3 py-2">
							<Flag representation={selectedMember.representation} size="xs" />
							<span class="flex-1 text-sm font-medium">{getMemberName(selectedMember)}</span>
							<button
								class="btn btn-ghost btn-xs btn-circle"
								aria-label={m.deselect()}
								onclick={() => (proposerValue = '')}
							>
								<i class="fas fa-xmark text-xs"></i>
							</button>
						</div>
					{:else}
						<Combobox
							bind:value={proposerValue}
							options={members ?? []}
							filter={filterMembers}
							getStringValue={getMemberName}
							getKey={(mem) => mem.id}
							placeholder={m.selectMember()}
							triggerClass="input-lg join-item flex items-center justify-center px-3 text-base-content/40 hover:text-base-content transition-colors"
						>
							{#snippet ListItem(option)}
								<Flag size="xs" representation={option.representation} />
								<span class="ml-2 flex-1">{getMemberName(option)}</span>
							{/snippet}
						</Combobox>
					{/if}
				</div>
			{/if}

			<!-- Target clause selector -->
			{#if needsTargetClause}
				<div class="flex flex-col gap-1">
					<span class="label-text text-sm font-medium">{m.targetClause()}</span>
					{#if targetClauseId}
						{@const idx = operative.findIndex((c) => c.id === targetClauseId)}
						{@const clause = operative[idx]}
						<div class="bg-base-100 flex items-start gap-2 rounded-lg px-3 py-2">
							<span class="shrink-0 font-mono text-sm font-semibold opacity-60">{idx + 1}.</span>
							<span class="flex-1 text-sm">{clause ? getFirstTextContent(clause) : ''}</span>
							<button
								class="btn btn-ghost btn-xs btn-circle shrink-0"
								aria-label={m.deselect()}
								onclick={() => (targetClauseId = null)}
							>
								<i class="fas fa-xmark text-xs"></i>
							</button>
						</div>
					{:else}
						<label class="input input-bordered input-sm flex w-full items-center gap-2">
							<i class="fas fa-magnifying-glass text-base-content/40 text-xs"></i>
							<input
								class="grow"
								type="text"
								bind:value={clauseSearch}
								placeholder={m.searchClauses()}
							/>
						</label>
						<div class="bg-base-300 flex max-h-40 flex-col gap-1 overflow-y-auto rounded-lg p-1">
							{#each filteredClauses as clause (clause.id)}
								{@const globalIndex = operative.indexOf(clause)}
								{@const preview = getFirstTextContent(clause)}
								<button
									class="hover:bg-base-200 flex items-start gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors"
									onclick={() => (targetClauseId = clause.id)}
								>
									<span class="shrink-0 font-mono font-semibold opacity-60">{globalIndex + 1}.</span>
									<span class="line-clamp-1 flex-1">{preview}</span>
								</button>
							{:else}
								<p class="text-base-content/50 px-2 py-3 text-center text-xs">{m.noOperativeClauses()}</p>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- New content -->
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

			<!-- Target position (ADD / ALTER_POSITION) -->
			{#if needsPosition}
				<label class="form-control gap-1">
					<span class="label-text text-sm font-medium">{m.targetPosition()}</span>
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
