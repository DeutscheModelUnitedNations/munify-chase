// import type { applyAuth } from '$api/services/OIDC';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			displayToken?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// biome-ignore lint/complexity/noUselessEmptyExport:
export {};
