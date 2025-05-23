import { onNavigate } from '$app/navigation';

/**
 * Enables the new view transition API.
 * To transition an element, give it a style:
 *
 * ```
 * <div style="view-transition-name: some-unique-{id};">Fancy!</div>
 * ```
 *
 * Make sure the element has the same ID when being removed and added between navigations.
 */
export function enableViewTransitionApi() {
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
}
