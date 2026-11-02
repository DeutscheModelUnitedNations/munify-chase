<script lang="ts">
	import toast from 'svelte-french-toast';
	import { m } from '#lib/paraglide/messages';
	import { getLocale } from '#lib/paraglide/runtime';
	import { client } from '#lib/api/rumbleClient/client';
	import { withBackendMessage } from '#lib/utils/toast';

	/**
	 * The link to a MUNify DELEGATOR instance, for global admins (`docs/plans/delegator-link.md`).
	 * DELEGATOR asks; here the request is approved with the code DELEGATOR shows, and the link
	 * watched or ended.
	 */
	const links = await client.liveQuery.instanceLinks({
		id: true,
		remoteUrl: true,
		status: true,
		confirmationCode: true,
		linkedAt: true,
		lastEventAt: true,
		lastReconcileAt: true,
		lastError: true
	});
	const link = $derived((links ?? []).find((l) => l.status !== 'FROZEN'));

	let code = $state('');
	let busy = $state(false);

	const formatTime = (date: Date | string | null | undefined) =>
		date
			? new Date(date).toLocaleString(getLocale(), { dateStyle: 'medium', timeStyle: 'short' })
			: '–';

	async function run(action: () => Promise<unknown>) {
		busy = true;
		try {
			await action();
		} catch (error) {
			toast.error(withBackendMessage(m.saveError(), error));
		} finally {
			busy = false;
		}
	}

	const approve = () =>
		run(() =>
			Promise.resolve(client.mutate.approveDelegatorLink({ __args: { confirmationCode: code } }))
		);
	const reject = () => run(() => Promise.resolve(client.mutate.rejectDelegatorLink()));
	const unlink = () => {
		if (!confirm(m.delegatorLinkUnlinkConfirm())) return;
		return run(() => Promise.resolve(client.mutate.unlinkDelegator()));
	};
</script>

{#if link?.status === 'PENDING'}
	<section class="card bg-base-200 gap-3 p-5">
		<h2 class="m-0 text-lg font-bold">
			<i class="fa-duotone fa-link"></i>
			{m.delegatorLinkRequestTitle()}
		</h2>
		<p class="m-0 text-sm">{m.delegatorLinkRequestBody({ url: link.remoteUrl })}</p>
		<label class="input w-full max-w-xs">
			<span class="label">{m.delegatorLinkCode()}</span>
			<input
				class="font-mono uppercase tracking-widest"
				maxlength="6"
				autocomplete="off"
				bind:value={code}
			/>
		</label>
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary" disabled={busy || code.trim().length !== 6} onclick={approve}>
				<i class="fa-duotone fa-check"></i>
				{m.delegatorLinkApprove()}
			</button>
			<button class="btn btn-ghost" disabled={busy} onclick={reject}>
				<i class="fa-duotone fa-xmark"></i>
				{m.delegatorLinkReject()}
			</button>
		</div>
	</section>
{:else if link?.status === 'ACTIVE'}
	<section class="card bg-base-200 gap-3 p-5">
		<h2 class="m-0 text-lg font-bold">
			<i class="fa-duotone fa-link"></i>
			{m.delegatorLinkActiveTitle()}
		</h2>
		<p class="m-0 text-sm">{m.delegatorLinkActiveBody({ url: link.remoteUrl })}</p>
		<dl class="m-0 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
			<dt class="text-base-content/60">{m.delegatorLinkLinkedAt()}</dt>
			<dd class="m-0">{formatTime(link.linkedAt)}</dd>
			<dt class="text-base-content/60">{m.delegatorLinkLastSync()}</dt>
			<dd class="m-0">{formatTime(link.lastReconcileAt)}</dd>
		</dl>
		{#if link.lastError}
			<div class="alert alert-warning text-sm">
				<i class="fa-duotone fa-triangle-exclamation"></i>
				<span>{m.delegatorLinkLastError({ error: link.lastError })}</span>
			</div>
		{/if}
		<div class="flex flex-wrap gap-2">
			<a class="btn btn-primary btn-sm" href={link.remoteUrl} target="_blank" rel="noopener">
				<i class="fa-duotone fa-arrow-up-right-from-square"></i>
				{m.delegatorLinkOpen()}
			</a>
			<button class="btn btn-ghost btn-sm text-error" disabled={busy} onclick={unlink}>
				<i class="fa-duotone fa-link-slash"></i>
				{m.delegatorLinkUnlink()}
			</button>
		</div>
	</section>
{/if}
