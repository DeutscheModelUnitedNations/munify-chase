<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import QRCode from 'qrcode';
	import Tabs from '../Tabs.svelte';
	import toast from 'svelte-french-toast';
	import { page } from '$app/state';
	import { untrack } from 'svelte';

	interface Props {
		showModal: boolean;
		resolve: (value: string | null) => void;
	}

	let url = page.url;

	const urlSegments = url.pathname.split('/').filter(Boolean);

	let conferenceId = urlSegments[1];
	let committeeId = urlSegments[2];

	let { showModal = $bindable(), resolve }: Props = $props();
	let activeTab = $state<'COMMITTEE' | 'CUSTOM'>('COMMITTEE');
	let qrUrl = $state('');
	let isGenerating = $state(false);
	let qrError = $state('');
	let qrImageUrl = $state<string | null>(null);

	// State for path option
	let includePapers = $state<boolean>(false);

	// Generate committee URL based on current committee and option
	function getCommitteeUrl(): string | undefined {
		const baseUrl = window.location.origin;

		if (!conferenceId || !committeeId || !baseUrl) {
			toast.error('Missing required data. Please reload or contact support.');
			return undefined;
		}

		if (includePapers) {
			return `${baseUrl}/app/${encodeURIComponent(conferenceId)}/participant/${encodeURIComponent(committeeId)}/papers`;
		} else {
			return `${baseUrl}/app/${encodeURIComponent(conferenceId)}/participant/${encodeURIComponent(committeeId)}`;
		}
	}

	async function generateQRCode() {
		let urlToGenerate: string | undefined;

		if (activeTab === 'CUSTOM') {
			if (!qrUrl) {
				qrError = m.urlRequired();
				isGenerating = false;
				return;
			}
			urlToGenerate = qrUrl;
		} else {
			urlToGenerate = getCommitteeUrl();
			if (urlToGenerate === undefined) {
				isGenerating = false;
				return;
			}
		}

		isGenerating = true;
		qrError = '';
		qrImageUrl = null;

		try {
			const url = await QRCode.toDataURL(urlToGenerate, {
				errorCorrectionLevel: 'M',
				margin: 2,
				width: 300,
				color: {
					dark: '#000000',
					light: '#FFFFFF'
				}
			});
			qrImageUrl = url;
		} catch (_err) {
			qrError = m.qrGenerationFailed();
			qrImageUrl = null;
		} finally {
			isGenerating = false;
		}
	}

	function handleConfirm() {
		if (qrImageUrl) {
			resolve(qrImageUrl);
			showModal = false;
		}
	}

	function handleCancel() {
		resolve(null);
		showModal = false;
	}

	function resetState() {
		qrUrl = '';
		qrError = '';
		qrImageUrl = null;
		isGenerating = false;
		activeTab = 'COMMITTEE';
		includePapers = false;
	}

	function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
		let timeout: ReturnType<typeof setTimeout>;

		return (...args: Parameters<T>) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
	}

	const debouncedGenerateQRCode = debounce(generateQRCode, 500);

	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (showModal && !dialog.open) {
			dialog.showModal();
			untrack(() => {
				if (activeTab === 'COMMITTEE') {
					generateQRCode();
				}
			});
		} else if (!showModal && dialog.open) {
			dialog.close();
			resetState();
		}
	});
</script>

<dialog
	bind:this={dialog}
	class="modal"
	oncancel={(e) => {
		e.preventDefault();
		handleCancel();
	}}
>
	<div class="modal-box bg-base-200 flex max-h-[calc(100vh-5em)] max-w-2xl flex-col p-0">
		<h3 class="px-6 pt-6 text-lg font-bold">{m.genQRCode()}</h3>

		<div class="min-h-0 flex-1 overflow-y-auto px-6 py-4">
			<!-- Tabs -->
			<div class="tabs tabs-box bg-base-300 mb-4 justify-stretch">
				<button
					class="tab flex-1 {activeTab === 'COMMITTEE' ? 'tab-active' : ''}"
					onclick={() => {
						activeTab = 'COMMITTEE';
						qrImageUrl = null;
						qrError = '';
						generateQRCode();
					}}
				>
					<i class="fa-duotone fa-users mr-2"></i>
					{m.committeeUrl()}
				</button>
				<button
					class="tab flex-1 {activeTab === 'CUSTOM' ? 'tab-active' : ''}"
					onclick={() => {
						activeTab = 'CUSTOM';
						qrImageUrl = null;
						qrError = '';
					}}
				>
					<i class="fa-duotone fa-link mr-2"></i>
					{m.customUrl()}
				</button>
			</div>

			<!-- QR Code Preview Area -->
			<div class="bg-base-100 card p-6 shadow-sm mb-4">
				<div class="flex flex-col items-center justify-center min-h-[300px]">
					{#if qrImageUrl}
						<img
							src={qrImageUrl}
							alt={m.qrCodePreview()}
							class="max-w-full h-auto border border-base-300 rounded-lg shadow-md"
						/>
						<p class="text-sm text-base-content/70 mt-3">
							<i class="fa-regular fa-circle-check text-success mr-1"></i>
							{m.qrCodeSuccess()}
						</p>
					{:else if isGenerating}
						<div class="text-center">
							<i class="fa-solid fa-spinner fa-spin text-4xl text-primary mb-3"></i>
							<p class="text-sm">{m.generating()}</p>
						</div>
					{:else}
						<div class="text-center text-base-content/50">
							<i class="fa-solid fa-qrcode text-5xl mb-3 opacity-50"></i>
							<p class="text-sm">
								{activeTab === 'CUSTOM' ? m.enterUrlToGenerate() : m.clickGenerateForCommittee()}
							</p>
						</div>
					{/if}

					{#if qrError}
						<div class="alert alert-error mt-4 py-2 text-sm">
							<i class="fa-solid fa-circle-exclamation"></i>
							{qrError}
						</div>
					{/if}
				</div>
			</div>

			<!-- URL Input Area -->
			<div class="bg-base-100 card p-4 shadow-sm">
				{#if activeTab === 'COMMITTEE'}
					<div class="flex flex-col gap-4">
						<!-- Path Option Buttons -->
						<div class="form-control">
							<div class="form-control mt-2">
								<fieldset
									class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4"
								>
									<legend class="fieldset-legend">{m.whereQRCodeLead()}</legend>
									<Tabs
										activeTab={includePapers}
										tabs={[
											{ id: false, label: m.defaultCommittee() },
											{ id: true, label: m.toPapers() }
										]}
										onTabChange={(value) => {
											includePapers = value ?? false;
											qrImageUrl = null;
											qrError = '';
											generateQRCode();
										}}
									/>
								</fieldset>
							</div>
						</div>
					</div>
				{:else}
					<div class="flex flex-col gap-4">
						<div class="form-control">
							<label class="label" for="qr-custom-url">
								<span class="label-text">{m.urlLabel()}</span>
							</label>
							<input
								id="qr-custom-url"
								type="url"
								bind:value={qrUrl}
								placeholder={m.urlPlaceholder()}
								class="input input-bordered w-full"
								oninput={() => {
									qrImageUrl = null;
									qrError = '';
									if (qrUrl) isGenerating = true;
									debouncedGenerateQRCode();
								}}
							/>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Modal Actions -->
		<div class="bg-base-200 modal-action mt-0 border-base-300 border-t px-6 py-4">
			{#if qrImageUrl}
				<button class="btn btn-success" onclick={handleConfirm}>
					<i class="fa-regular fa-check-circle mr-2"></i>
					{m.useQRCode()}
				</button>
			{/if}
			<button class="btn btn-error" onclick={handleCancel}>
				<i class="fas fa-xmark mr-2"></i>
				{m.abort()}
			</button>
		</div>
	</div>
	<button type="button" class="modal-backdrop" onclick={handleCancel} aria-label={m.close()}
	></button>
</dialog>
