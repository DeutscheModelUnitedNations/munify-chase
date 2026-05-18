<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import toast from 'svelte-french-toast';
	import { promiseToastStrings } from '$lib/utils/toast';
	import { page } from '$app/state';
	import QRCode from 'qrcode';

	interface Props {
		conferenceId: string;
	}

	let { conferenceId }: Props = $props();

	const tokens = await client.liveQuery.displayTokens({
		__args: { where: { conferenceId } },
		id: true,
		label: true,
		code: true,
		showStateOfDebate: true,
		createdAt: true,
		revokedAt: true
	});

	let newLabel = $state('');
	let newShowStateOfDebate = $state(false);
	let isCreating = $state(false);
	let qrFor = $state<string | null>(null);
	let qrDataUrl = $state<string | null>(null);

	const linkFor = (code: string) => `${page.url.origin}/display/${code}`;

	async function createLink() {
		isCreating = true;
		try {
			await toast.promise(
				client.mutate.createDisplayToken({
					__args: {
						conferenceId,
						label: newLabel.trim(),
						showStateOfDebate: newShowStateOfDebate
					},
					id: true
				}),
				promiseToastStrings(m.displayLink(), 'create')
			);
			newLabel = '';
			newShowStateOfDebate = false;
		} finally {
			isCreating = false;
		}
	}

	async function copyLink(code: string) {
		await navigator.clipboard.writeText(linkFor(code));
		toast.success(m.codeCopied());
	}

	async function toggleQr(id: string, code: string) {
		if (qrFor === id) {
			qrFor = null;
			qrDataUrl = null;
			return;
		}
		qrDataUrl = await QRCode.toDataURL(linkFor(code), { width: 256, margin: 1 });
		qrFor = id;
	}

	async function revokeLink(id: string) {
		if (!confirm(m.confirmRevokeDisplayLink())) return;
		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types boolean mutations as plain `Boolean` instead of callable functions
			(client.mutate.revokeDisplayToken as any)({ __args: { displayTokenId: id } } as any),
			promiseToastStrings(m.displayLink(), 'update')
		);
	}

	async function deleteLink(id: string) {
		if (!confirm(m.confirmDeleteDisplayLink())) return;
		await toast.promise(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- rumble generator types boolean mutations as plain `Boolean` instead of callable functions
			(client.mutate.deleteDisplayToken as any)({ __args: { displayTokenId: id } } as any),
			promiseToastStrings(m.displayLink(), 'delete')
		);
	}
</script>

<BasicCard title={m.displayLinks()}>
	<p class="text-base-content/70 mb-4 text-sm">{m.displayLinksDescription()}</p>

	<div class="mb-6 flex flex-wrap items-end gap-3">
		<div class="form-control">
			<label class="label" for="display-link-label">
				<span class="label-text">{m.displayLink()}</span>
			</label>
			<input
				id="display-link-label"
				class="input input-bordered"
				bind:value={newLabel}
				placeholder={m.displayLinkLabelPlaceholder()}
			/>
		</div>
		<label class="label cursor-pointer gap-2">
			<input type="checkbox" class="checkbox" bind:checked={newShowStateOfDebate} />
			<span class="label-text">{m.showStateOfDebateOption()}</span>
		</label>
		<button class="btn btn-primary" disabled={isCreating} onclick={createLink}>
			{m.createDisplayLink()}
		</button>
	</div>

	{#if !tokens || tokens.length === 0}
		<p class="text-base-content/60 text-sm">{m.noDisplayLinks()}</p>
	{:else}
		<div class="flex flex-col gap-2">
			{#each tokens as token (token.id)}
				<div class="border-base-300 flex flex-col gap-2 rounded-lg border p-3">
					<div class="flex flex-wrap items-center gap-2">
						<span class="font-semibold">{token.label || m.displayLink()}</span>
						{#if token.revokedAt}
							<span class="badge badge-error">{m.revoked()}</span>
						{/if}
						{#if token.showStateOfDebate}
							<span class="badge badge-ghost">{m.stateOfDebate()}</span>
						{/if}
					</div>
					<div class="flex flex-wrap items-center gap-2">
						<input
							class="input input-bordered input-sm flex-1 font-mono"
							readonly
							value={linkFor(token.code)}
						/>
						<button class="btn btn-sm" onclick={() => copyLink(token.code)}>{m.copy()}</button>
						<button class="btn btn-sm" onclick={() => toggleQr(token.id, token.code)}>
							{m.genQRCode()}
						</button>
						{#if !token.revokedAt}
							<button class="btn btn-sm btn-warning" onclick={() => revokeLink(token.id)}>
								{m.revoke()}
							</button>
						{/if}
						<button class="btn btn-sm btn-error" onclick={() => deleteLink(token.id)}>
							{m.deleteEntry()}
						</button>
					</div>
					{#if qrFor === token.id && qrDataUrl}
						<img src={qrDataUrl} alt="QR code" class="h-48 w-48 self-start bg-white p-2" />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</BasicCard>
