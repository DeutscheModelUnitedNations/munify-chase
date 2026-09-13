// import type { applyAuth } from '$api/services/OIDC';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// Set by kioskOIDC.ts once it verifies a token against
			// OIDC_KIOSK_TRUSTED_AUDIENCES — i.e. the request authenticated
			// through the kiosk's own OIDC application (the OAuth 2.0 Device
			// Authorization Grant), not the normal browser login flow. See
			// authHelper.ts's isDisplayKiosk() for how this gates access.
			isKioskSession?: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// biome-ignore lint/complexity/noUselessEmptyExport:
export {};
