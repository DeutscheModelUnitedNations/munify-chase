<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import QRCode from 'qrcode';

	interface Props {
		showModal: boolean;
		committeeID?: string | null;
		conferenceID?: string | null;
		resolve: (value: string | null) => void;
	}

	let { showModal = $bindable(), committeeID, conferenceID, resolve }: Props = $props();
	let activeTab = $state<'CUSTOM' | 'COMMITTEE'>('COMMITTEE');
	let qrUrl = $state('');
	let isGenerating = $state(false);
	let qrError = $state('');
	let qrImageUrl = $state<string | null>(null);

	// Generate committee URL based on current committee
	function getCommitteeUrl(): string {
		const baseUrl = window.location.origin;
		return `${baseUrl}/app/${encodeURIComponent(conferenceID)}/${encodeURIComponent(committeeID)}`;
	}

	async function generateQRCode() {
		let urlToGenerate = '';

		if (activeTab === 'CUSTOM') {
			if (!qrUrl) {
				qrError = m.urlRequired();
				return;
			}
			urlToGenerate = qrUrl;
		} else {
			urlToGenerate = getCommitteeUrl();
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
		} catch (err) {
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
			resetState();
		}
	}

	function handleCancel() {
		resolve(null);
		showModal = false;
		resetState();
	}

	function resetState() {
		qrUrl = '';
		qrError = '';
		qrImageUrl = null;
		isGenerating = false;
		activeTab = 'CUSTOM';
	}

	// Reset when modal closes
	$effect(() => {
		if (!showModal) {
			resetState();
		}
	});
</script>

<dialog class="modal" open={showModal}>
	<div class="modal-box bg-base-200 max-w-2xl">
		<h3 class="mb-4 text-lg font-bold">{m.genQRCode()}</h3>

		<!-- Tabs -->
		<div class="tabs tabs-box bg-base-300 mb-4 justify-stretch">
			<button
				class="tab flex-1 {activeTab === 'COMMITTEE' ? 'tab-active' : ''}"
				onclick={() => {
					activeTab = 'COMMITTEE';
					qrImageUrl = null;
					qrError = '';
					// Auto-fill committee URL when switching to committee tab
					if (!qrUrl && conferenceID && committeeID) {
						qrUrl = getCommitteeUrl();
					}
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
					<!-- DEBUG
                    {#if activeTab === 'COMMITTEE'}
                        <p class="text-xs text-base-content/50 mt-2">
                            Link: {getCommitteeUrl()}
                        </p>
                    {/if}-->
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
			{#if activeTab === 'CUSTOM'}
				<div class="flex flex-col gap-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">{m.urlLabel()}</span>
						</label>
						<input
							type="url"
							bind:value={qrUrl}
							placeholder={m.urlPlaceholder()}
							class="input input-bordered w-full"
							oninput={() => {
								qrImageUrl = null;
								qrError = '';
							}}
						/>
					</div>

					<button
						class="btn btn-primary"
						onclick={generateQRCode}
						disabled={!qrUrl || isGenerating}
					>
						{#if isGenerating}
							<i class="fa-solid fa-spinner fa-spin"></i>
						{:else}
							<i class="fa-solid fa-qrcode mr-2"></i>
						{/if}
						{m.genQRCode()}
					</button>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					<!-- DEBUG
                    <div class="alert alert-info">
                        <i class="fa-solid fa-info-circle"></i>
                        <span>Committee URL INFO: <strong>{committeeID}</strong></span>
                    </div>
                    <div class="alert alert-info">
                        <i class="fa-solid fa-info-circle"></i>
                        <span>Conference URL INFO: <strong>{conferenceID}</strong></span>
                    </div>-->

					<div class="form-control">
						<label class="label">
							<span class="label-text">{m.preview()}</span>
						</label>
						<input
							type="text"
							value={getCommitteeUrl()}
							readonly
							class="input input-bordered w-full bg-base-200 cursor-pointer"
							onclick={(e) => {
								const target = e.target as HTMLInputElement;
								target.select();
								navigator.clipboard.writeText(target.value);
							}}
						/>
						<label class="label">
							<span class="label-text-alt">{m.copy()}</span>
						</label>
					</div>

					<button
						class="btn btn-primary"
						onclick={generateQRCode}
						disabled={isGenerating || !committeeID || !conferenceID}
					>
						{#if isGenerating}
							<i class="fa-solid fa-spinner fa-spin"></i>
						{:else}
							<i class="fa-solid fa-qrcode mr-2"></i>
						{/if}
					</button>
				</div>
			{/if}
		</div>

		<!-- Modal Actions -->
		<div class="modal-action mt-4">
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
