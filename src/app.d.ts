// import type { applyAuth } from '#api/services/OIDC';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			/**
			 * Whether the linked DELEGATOR is calling: set by `linkHandle` (`hooks.server.ts`) and the
			 * WebSocket's connect (`websocket.ts`) when its link token grants the `delegator` role.
			 */
			linkCaller?: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// biome-ignore lint/complexity/noUselessEmptyExport:
export {};
