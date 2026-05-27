<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getCachedAccessToken, tauriLogin } from '$lib/platform/oidc';
	import chaseLogo from '$assets/logo/svg/chase_logo_blue_text.svg';

	type LoginState = 'idle' | 'loading' | 'error';
	let loginState = $state<LoginState>('idle');
	let errorMessage = $state('');
	let abortController: AbortController | undefined;

	onMount(() => {
		if (getCachedAccessToken()) {
			goto('/app');
		}
	});

	async function handleSignIn() {
		abortController = new AbortController();
		loginState = 'loading';
		errorMessage = '';
		try {
			await tauriLogin(abortController.signal);
			goto('/app');
		} catch (e) {
			if (e instanceof DOMException && e.name === 'AbortError') {
				loginState = 'idle';
			} else {
				errorMessage = e instanceof Error ? e.message : String(e);
				loginState = 'error';
			}
		} finally {
			abortController = undefined;
		}
	}

	function handleCancel() {
		abortController?.abort();
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-10 p-8">
	<img src={chaseLogo} alt="MUNify CHASE" class="w-72" />

	<div class="text-center">
		<p class="text-base-content/60 mt-1 text-lg">Conference management for Model UN</p>
	</div>

	{#if loginState === 'idle'}
		<button class="btn btn-primary btn-wide text-base" onclick={handleSignIn}>
			<i class="fas fa-right-to-bracket mr-2"></i>
			Sign in
		</button>
	{:else if loginState === 'loading'}
		<div class="flex flex-col items-center gap-3">
			<span class="loading loading-spinner loading-lg"></span>
			<p class="text-base-content/60">Opening browser…</p>
			<p class="text-base-content/40 text-sm">
				Complete sign-in in the browser window that opened.
			</p>
			<button class="btn btn-ghost btn-sm mt-2" onclick={handleCancel}>Cancel</button>
		</div>
	{:else if loginState === 'error'}
		<div class="flex flex-col items-center gap-4">
			<div class="alert alert-error max-w-md">
				<i class="fas fa-circle-exclamation shrink-0"></i>
				<span>Login failed: {errorMessage}</span>
			</div>
			<button class="btn btn-primary btn-wide" onclick={handleSignIn}>
				<i class="fas fa-rotate-right mr-2"></i>
				Try again
			</button>
		</div>
	{/if}
</div>
