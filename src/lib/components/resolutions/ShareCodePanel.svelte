<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import toast from 'svelte-french-toast';

	interface Props {
		paperId: string;
	}

	let { paperId }: Props = $props();

	const codes = await client.liveQuery.paperShareCodes({
		__args: { where: { paper: { id: paperId } } },
		id: true,
		code: true,
		permission: true
	});

	let busy = $state(false);
	async function create(permission: 'EDIT' | 'SPONSOR') {
		busy = true;
		try {
			await client.mutate.createPaperShareCode({
				__args: { id: nanoid(), paperId, permission },
				id: true
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		} finally {
			busy = false;
		}
	}
	async function remove(id: string) {
		try {
			await client.mutate.deletePaperShareCode({ __args: { id } });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed');
		}
	}
	async function copy(code: string) {
		try {
			await navigator.clipboard.writeText(code);
			toast.success(m.copiedToClipboard());
		} catch {
			/* clipboard may be unavailable */
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#if codes?.length}
		<ul class="space-y-1">
			{#each codes as c (c.id)}
				<li class="flex items-center justify-between gap-2">
					<button class="btn btn-ghost btn-sm font-mono" onclick={() => copy(c.code)}>
						<i class="fas fa-copy"></i>
						{c.code}
					</button>
					<span class="badge badge-sm">
						{c.permission === 'EDIT' ? m.shareEdit() : m.shareSponsor()}
					</span>
					<button class="btn btn-ghost btn-xs" aria-label={m.delete()} onclick={() => remove(c.id)}>
						<i class="fas fa-trash text-error"></i>
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-base-content/50 text-sm">{m.noShareCodes()}</p>
	{/if}

	<div class="join">
		<button class="btn btn-sm join-item" disabled={busy} onclick={() => create('EDIT')}>
			<i class="fas fa-pen"></i>
			{m.shareEdit()}
		</button>
		<button class="btn btn-sm join-item" disabled={busy} onclick={() => create('SPONSOR')}>
			<i class="fas fa-handshake"></i>
			{m.shareSponsor()}
		</button>
	</div>
</div>
