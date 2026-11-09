<script lang="ts">
	interface Props {
		status?: number;
		message?: string;
		backHref?: string;
		backLabel?: string;
	}

	let {
		status,
		message = 'An unexpected error occurred',
		backHref,
		backLabel = 'Go Back'
	}: Props = $props();

	let clearing = $state(false);
	let cleared = $state(false);

	async function clearCache() {
		clearing = true;
		const dbs = await indexedDB.databases().catch(() => [{ name: 'chase-cache' }]);
		await Promise.all(
			dbs
				.filter((db): db is IDBDatabaseInfo & { name: string } => !!db.name)
				.map(
					(db) =>
						new Promise<void>((resolve) => {
							const req = indexedDB.deleteDatabase(db.name);
							req.onsuccess = () => resolve();
							req.onerror = () => resolve();
							req.onblocked = () => resolve();
						})
				)
		);
		clearing = false;
		cleared = true;
		setTimeout(() => window.location.reload(), 800);
	}
</script>

<div class="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
	<i aria-hidden="true" class="ph-duotone ph-warning text-error text-6xl"></i>
	<div>
		<h1 class="text-2xl font-bold">{message}</h1>
		{#if status}
			<p class="text-base-content/60 mt-1 text-sm">Error {status}</p>
		{/if}
	</div>
	<div class="flex flex-wrap justify-center gap-3">
		{#if backHref}
			<a href={backHref} class="btn btn-primary">
				<i aria-hidden="true" class="ph-duotone ph-arrow-left"></i>
				{backLabel}
			</a>
		{/if}
		<a href="/app" class="btn btn-ghost">
			<i aria-hidden="true" class="ph-duotone ph-squares-four"></i>
			My Conferences
		</a>
		<button class="btn btn-outline btn-warning" onclick={clearCache} disabled={clearing || cleared}>
			{#if cleared}
				<i aria-hidden="true" class="ph-duotone ph-check"></i>
				Cache Cleared — Reloading…
			{:else if clearing}
				<span class="loading loading-spinner loading-sm"></span>
				Clearing…
			{:else}
				<i aria-hidden="true" class="ph-duotone ph-trash"></i>
				Clear Offline Cache
			{/if}
		</button>
	</div>
</div>
