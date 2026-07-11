export const SYNTHETIC_EVENT_FIELD = '__syntheticSvelteRequestEvent';

export function hasSyntheticSvelteRequestEvent(req: { extra?: unknown }): boolean {
	return SYNTHETIC_EVENT_FIELD in (req as object);
}
