<script lang="ts">
	import DialogBackdrop from '../DialogBackdrop.svelte';
	import { modalFocus } from '#lib/helpers/modalFocus';
	import { m } from '#lib/paraglide/messages';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import toast from 'svelte-french-toast';

	interface Props {
		open: boolean;
		paperId: string;
		close: () => void;
	}

	let { open = $bindable(), paperId, close }: Props = $props();

	const snapshots = await client.liveQuery.paperContentSnapshots({
		__args: {
			where: { paper: { id: { eq: paperId } } },
			orderBy: { createdAt: 'desc' }
		},
		id: true,
		createdAt: true,
		trigger: true
	});

	let saving = $state(false);
	async function saveSnapshot() {
		saving = true;
		try {
			await client.mutate.createManualSnapshot({
				__args: { id: nanoid(), paperId },
				id: true
			});
			toast.success(m.snapshotSaved());
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to save snapshot');
		} finally {
			saving = false;
		}
	}

	let restoringId = $state<string | null>(null);
	let confirmSnap = $state<string | null>(null);

	function restore(snapshotId: string) {
		confirmSnap = snapshotId;
	}

	async function doRestore() {
		if (!confirmSnap) return;
		const snapshotId = confirmSnap;
		confirmSnap = null;
		restoringId = snapshotId;
		try {
			await client.mutate.restorePaperFromSnapshot({
				__args: { snapshotId },
				id: true
			});
			toast.success(m.restoredFromSnapshot());
			close();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Restore failed');
		} finally {
			restoringId = null;
		}
	}

	type Trigger = 'SUBMITTED' | 'AMENDMENT_APPLIED' | 'VOTE_CONCLUDED' | 'MANUAL';

	function triggerLabel(t: Trigger): string {
		switch (t) {
			case 'SUBMITTED':
				return m.snapshotTriggerSubmitted();
			case 'AMENDMENT_APPLIED':
				return m.snapshotTriggerAmendmentApplied();
			case 'VOTE_CONCLUDED':
				return m.snapshotTriggerVoteConcluded();
			case 'MANUAL':
				return m.snapshotTriggerManual();
		}
	}

	function triggerIcon(t: Trigger): string {
		switch (t) {
			case 'SUBMITTED':
				return 'paper-plane-tilt';
			case 'AMENDMENT_APPLIED':
				return 'pencil-simple';
			case 'VOTE_CONCLUDED':
				return 'check-circle';
			case 'MANUAL':
				return 'bookmark-simple';
		}
	}

	function triggerBadgeClass(t: Trigger): string {
		switch (t) {
			case 'SUBMITTED':
				return 'badge-info';
			case 'AMENDMENT_APPLIED':
				return 'badge-warning';
			case 'VOTE_CONCLUDED':
				return 'badge-success';
			case 'MANUAL':
				return 'badge-ghost';
		}
	}

	function formatTimestamp(d: Date): string {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: 'short',
			timeStyle: 'short'
		}).format(d);
	}

	function relativeTime(d: Date, now = new Date()): string {
		const diffMs = now.getTime() - d.getTime();
		const sec = Math.round(diffMs / 1000);
		if (sec < 60) return `${sec}s ago`;
		const min = Math.round(sec / 60);
		if (min < 60) return `${min}m ago`;
		const hr = Math.round(min / 60);
		if (hr < 24) return `${hr}h ago`;
		const day = Math.round(hr / 24);
		return `${day}d ago`;
	}

	const focusWhileOpen = $derived(open ? modalFocus(close) : undefined);
</script>

<dialog class="modal" {open} aria-modal="true" {@attach focusWhileOpen}>
	<div class="modal-box bg-base-200 max-h-[85vh] w-full max-w-2xl">
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-bold">
				<i class="ph-fill ph-clock-counter-clockwise mr-2"></i>
				{m.documentHistory()}
			</h3>
			<button
				class="btn btn-sm btn-primary"
				onclick={saveSnapshot}
				disabled={saving}
				title={m.saveCurrentState()}
			>
				{#if saving}
					<i class="ph-fill ph-spinner-gap animate-spin"></i>
				{:else}
					<i class="ph-fill ph-bookmark-simple"></i>
				{/if}
				{m.saveCurrentState()}
			</button>
		</div>

		<div class="bg-base-100 max-h-[55vh] overflow-y-auto rounded-lg p-2">
			{#if !snapshots || snapshots.length === 0}
				<div class="flex flex-col items-center gap-2 py-12 text-center opacity-60">
					<i class="ph-fill ph-folder-open text-4xl"></i>
					<p class="max-w-sm">{m.noSnapshotsYet()}</p>
				</div>
			{:else}
				<ul class="space-y-1">
					{#each snapshots as snap (snap.id)}
						{@const t = snap.trigger as Trigger}
						<li class="hover:bg-base-200 flex items-center gap-3 rounded p-2 transition">
							<div class="badge badge-md gap-1 {triggerBadgeClass(t)}" title={triggerLabel(t)}>
								<i class="ph-fill ph-{triggerIcon(t)}"></i>
								{triggerLabel(t)}
							</div>
							<div class="flex-1">
								<div class="text-sm font-medium">{relativeTime(snap.createdAt)}</div>
								<div class="text-base-content/60 text-xs">
									{formatTimestamp(snap.createdAt)}
								</div>
							</div>
							<button
								class="btn btn-sm btn-ghost"
								onclick={() => restore(snap.id)}
								disabled={restoringId !== null}
							>
								{#if restoringId === snap.id}
									<i class="ph-fill ph-spinner-gap animate-spin"></i>
								{:else}
									<i class="ph-fill ph-arrow-counter-clockwise"></i>
								{/if}
								{m.restoreSnapshot()}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn btn-ghost" onclick={() => close()}>
				<i class="ph-fill ph-x"></i>
				{m.close()}
			</button>
		</div>
	</div>
	<DialogBackdrop onclose={close} />
</dialog>

{#if confirmSnap}
	<div class="modal modal-open z-[1000]">
		<div class="modal-box">
			<h3 class="text-lg font-bold">{m.restoreSnapshotConfirmTitle()}</h3>
			<p class="py-3">{m.restoreSnapshotConfirmWarning()}</p>
			<div class="modal-action">
				<button class="btn btn-ghost" onclick={() => (confirmSnap = null)}>{m.cancel()}</button>
				<button class="btn btn-warning" disabled={restoringId !== null} onclick={doRestore}>
					{#if restoringId !== null}
						<i class="ph-fill ph-spinner-gap animate-spin"></i>
					{:else}
						<i class="ph-fill ph-arrow-counter-clockwise"></i>
					{/if}
					{m.restoreSnapshot()}
				</button>
			</div>
		</div>
		<button
			class="modal-backdrop"
			tabindex="-1"
			aria-label={m.cancel()}
			onclick={() => (confirmSnap = null)}
		></button>
	</div>
{/if}
