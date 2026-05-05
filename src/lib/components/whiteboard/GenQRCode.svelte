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
	let activeTab = $state<'COMMITTEE' | 'CUSTOM'>('COMMITTEE');
	let qrUrl = $state('');
	let isGenerating = $state(false);
	let qrError = $state('');
	let qrImageUrl = $state<string | null>(null);

	// State for path option
	let includePapers = $state<boolean>(true);

	// Generate committee URL based on current committee and option
	function getCommitteeUrl(): string {
		const baseUrl = window.location.origin;

		if (includePapers) {
			console.log(
				`${baseUrl}/app/${encodeURIComponent(conferenceID)}/participant/${encodeURIComponent(committeeID)}/papers`
			);
			return `${baseUrl}/app/${encodeURIComponent(conferenceID)}/participant/${encodeURIComponent(committeeID)}/papers`;
		} else {
			console.log(
				`${baseUrl}/app/${encodeURIComponent(conferenceID)}/participant/${encodeURIComponent(committeeID)}`
			);
			return `${baseUrl}/app/${encodeURIComponent(conferenceID)}/participant/${encodeURIComponent(committeeID)}`;
		}
	}

	// Get preview text for the selected option
	function getPreviewText(): string {
		if (includePapers) {
			return `/app/${conferenceID}/${committeeID}/papers`;
		} else {
			return `/app/${conferenceID}/${committeeID}`;
		}
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
		activeTab = 'COMMITTEE';
		includePapers = false;
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
						<label class="label">
							<span class="label-text font-semibold">
								<i class="fa-solid fa-folder-tree mr-2"></i>
								{m.whereQRCodeLead()}
							</span>
						</label>
						<div class="flex gap-2 mt-1">
							<button
								class="btn flex-1 {!includePapers ? 'btn-primary' : 'btn-outline'}"
								onclick={() => {
									includePapers = false;
									qrImageUrl = null;
									qrError = '';
								}}
							>
								<i class="fa-solid fa-folder-open mr-2"></i>
								{m.toPresentation()}
							</button>
							<button
								class="btn flex-1 {includePapers ? 'btn-primary' : 'btn-outline'}"
								onclick={() => {
									includePapers = true;
									qrImageUrl = null;
									qrError = '';
								}}
							>
								<i class="fa-solid fa-file-alt mr-2"></i>
								{m.toPapers()}
							</button>
						</div>
					</div>

					<!-- URL Preview -->
					<!--<div class="form-control">
						<label class="label">
							<span class="label-text">
								<i class="fa-regular fa-eye mr-1"></i>
								{m.preview()}
							</span>
						</label>
						<div class="relative">
							<input
								type="text"
								value={getCommitteeUrl()}
								readonly
								class="input input-bordered w-full bg-base-200 cursor-pointer font-mono text-sm"
								onclick={(e) => {
									const target = e.target as HTMLInputElement;
									target.select();
									navigator.clipboard.writeText(target.value);
								}}
							/>
							<div class="absolute right-2 top-1/2 transform -translate-y-1/2">
								<span class="tooltip" data-tip={m.copyToClipboard()}>
									<i class="fa-regular fa-copy text-base-content/50 cursor-pointer hover:text-primary"
										onclick={() => {
											const input = document.querySelector('.form-control input') as HTMLInputElement;
											if (input) {
												input.select();
												navigator.clipboard.writeText(input.value);
											}
										}}
									></i>
								</span>
							</div>
						</div>
					</div>-->

					<!-- Generate Button -->
					<button
						class="btn btn-primary"
						onclick={generateQRCode}
						disabled={isGenerating || !committeeID || !conferenceID}
					>
						{#if isGenerating}
							<i class="fa-solid fa-spinner fa-spin"></i>
							{m.generating()}
						{:else}
							<i class="fa-solid fa-qrcode mr-2"></i>
							{m.genQRCode()}
						{/if}
					</button>
				</div>
			{:else}
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
