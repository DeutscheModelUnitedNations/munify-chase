import { untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import hotkeys from 'hotkeys-js';
import { dev } from '$app/environment';
import type { Command } from './types';

// Every mounted component that offers commands adds one source. The palette and the
// shortcut bindings read them on demand, so they always reflect the current page.
const sources = new SvelteMap<symbol, () => Command[]>();

/**
 * Offers commands for as long as the calling component is mounted. Call it during
 * component initialisation. The callback runs whenever the commands are needed, so
 * titles and states can depend on component state (e.g. "Pause" while a timer runs).
 */
export function registerCommands(commands: () => Command[]) {
	const key = Symbol();
	$effect(() => {
		sources.set(key, commands);
		return () => {
			sources.delete(key);
		};
	});
}

/** All commands currently offered, hidden ones excluded */
export function getCommands(): Command[] {
	return [...sources.values()]
		.flatMap((source) => source())
		.filter((command) => command.visible?.() ?? true);
}

export function isEnabled(command: Command) {
	return command.enabled?.() ?? true;
}

/**
 * Binds the shortcuts of all registered commands. Call once, in the app layout.
 * Bindings follow the registered sources. Which command a key triggers is decided when
 * the key is pressed, so a shortcut always does what its current command says.
 */
export function bindCommandShortcuts() {
	// A string, so the bindings below only change when the set of keys changes, not every
	// time some command's title or state does. Hidden commands are bound too and checked
	// on key press.
	const shortcutKeys = $derived(
		[...sources.values()]
			.flatMap((source) => source().flatMap((command) => command.shortcut ?? []))
			.filter((shortcut, i, all) => all.indexOf(shortcut) === i)
			.sort()
			.join('\n')
	);

	$effect(() => {
		const shortcuts = shortcutKeys ? shortcutKeys.split('\n') : [];
		const handlers = untrack(() => shortcuts).map((shortcut) => {
			const handler = (event: KeyboardEvent) => {
				// Hidden commands still own their key, so the browser default (e.g. Alt+N
				// switching tabs) stays suppressed on the page the shortcut would open
				const owned = [...sources.values()].some((source) =>
					source().some((command) => command.shortcut === shortcut)
				);
				if (!owned) return;
				event.preventDefault();
				const matching = getCommands().filter((command) => command.shortcut === shortcut);
				if (matching.length === 0) return;
				if (dev && matching.length > 1) {
					console.warn(
						`Shortcut ${shortcut} is used by several commands:`,
						matching.map((c) => c.id)
					);
				}
				const command = matching.find(isEnabled);
				command?.run();
			};
			hotkeys(shortcut, handler);
			return [shortcut, handler] as const;
		});

		return () => {
			// Name the scope, otherwise hotkeys-js only unbinds from the current one (e.g.
			// rollCall) and the handlers bound in 'all' pile up
			for (const [shortcut, handler] of handlers) hotkeys.unbind(shortcut, 'all', handler);
		};
	});
}
