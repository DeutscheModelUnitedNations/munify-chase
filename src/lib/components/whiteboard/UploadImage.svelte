<script lang="ts">
import { m } from "$lib/paraglide/messages";

interface Props {
  showModal: boolean;
  resolve: (value: string | null) => void;
}

let { showModal = $bindable(), resolve }: Props = $props();

const activeTab = $state<"UPLOAD" | "URL">("UPLOAD");
const imageUrl = $state("");
let uploadedFile = $state<File | null>(null);
let isUploading = $state(false);
let uploadError = $state("");

const MAX_FILE_SIZE = 1048576; // 1MB in bytes

// Utility function to convert File to Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

function handleFileInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > MAX_FILE_SIZE) {
      uploadError = "File size exceeds 1MB limit";
      uploadedFile = null;
      return;
    }

    uploadedFile = file;
    uploadError = "";
  }
}

async function handleUpload() {
  if (!uploadedFile) {
    uploadError = "Please select a file";
    return;
  }

  isUploading = true;

  try {
    // Convert file to Base64 string
    const base64String = await fileToBase64(uploadedFile);
    resolve(base64String);
    showModal = false;
  } catch (error) {
    uploadError = "Upload failed";
  } finally {
    isUploading = false;
  }
}

function handleUrlSubmit() {
  if (!imageUrl) {
    return;
  }
  resolve(imageUrl);
  showModal = false;
}

function handleCancel() {
  resolve(null);
  showModal = false;
}
</script>

<dialog class="modal" open={showModal}>
	<div class="modal-box bg-base-200">
		<h3 class="mb-4 text-lg font-bold">{m.img()}</h3>

		<div class="tabs tabs-box bg-base-300 mb-4 justify-stretch">
			<button
				class="tab flex-1 {activeTab === 'UPLOAD' ? 'tab-active' : ''}"
				onclick={() => (activeTab = 'UPLOAD')}
			>
				<i class="fa-duotone fa-upload mr-2"></i>
				{m.upload()}
			</button>
			<button
				class="tab tab-bordered flex-1 {activeTab === 'URL' ? 'tab-active' : ''}"
				onclick={() => (activeTab = 'URL')}
			>
				<i class="fa-duotone fa-link mr-2"></i>
				{m.url()}
			</button>
		</div>

		<div class="bg-base-100 card p-4 shadow-sm">
			{#if activeTab === 'UPLOAD'}
				<div class="flex flex-col gap-4">
					<input
						type="file"
						accept="image/*"
						class="file-input file-input-bordered w-full"
						onchange={handleFileInput}
					/>

					{#if uploadedFile}
						<div class="text-sm">{m.selected()}: {uploadedFile.name}</div>
					{/if}

					{#if uploadError}
						<div class="text-error text-sm">{uploadError}</div>
					{/if}

					<button
						class="btn btn-primary"
						onclick={handleUpload}
						disabled={!uploadedFile || isUploading}
					>
						{#if isUploading}
							<i class="fa-solid fa-spinner fa-spin"></i>
						{:else}
							<i class="fa-solid fa-upload mr-2"></i>
						{/if}
						{m.submitImg()}
					</button>
				</div>
			{:else}
				<div class="flex flex-col gap-4">
					<div class="form-control">
						<input
							type="text"
							bind:value={imageUrl}
							placeholder="https://example.com/image.jpg"
							class="input input-bordered w-full"
						/>
					</div>

					<button class="btn btn-primary" onclick={handleUrlSubmit} disabled={!imageUrl}>
						<i class="fa-solid fa-check mr-2"></i>
						{m.submitImg()}
					</button>
				</div>
			{/if}
		</div>

		<div class="modal-action">
			<button class="btn btn-error" onclick={handleCancel}>
				<i class="fas fa-xmark"></i>{m.abort()}
			</button>
		</div>
	</div>
	<button type="button" class="modal-backdrop" onclick={handleCancel} aria-label="Close modal"
	></button>
</dialog>
