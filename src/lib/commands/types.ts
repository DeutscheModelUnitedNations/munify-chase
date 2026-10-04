import type { Locale } from '$lib/paraglide/runtime';

/**
 * Text of a command. Pass a Paraglide message without parameters where possible, it is
 * also rendered in English so English search terms work in every language. A plain
 * `() => string` works too, e.g. for names coming from data.
 */
export type CommandMessage = (
	inputs?: Record<string, never>,
	options?: { locale?: Locale }
) => string;

/** Groups in the order the palette shows them */
export const COMMAND_GROUPS = ['page', 'navigation', 'global'] as const;
export type CommandGroup = (typeof COMMAND_GROUPS)[number];

export type Command = {
	/** Stable id, e.g. `speakers-list.next-speech`. Used for "recently used" */
	id: string;
	title: CommandMessage;
	/** Shown next to the title, e.g. which list a command acts on */
	context?: CommandMessage;
	/** Extra search terms, e.g. abbreviations like "POI" */
	keywords?: string[];
	/** `page` for things on the current page, `navigation` to go elsewhere, `global` otherwise */
	group: CommandGroup;
	/** Font Awesome icon name without the `fa-` prefix */
	icon?: string;
	/**
	 * hotkeys-js key string like `alt+n`. The registry binds it while the command is
	 * registered, so components must not bind the same key themselves.
	 */
	shortcut?: string;
	/** Disabled commands stay listed, like a disabled button */
	enabled?: () => boolean;
	/** Hidden commands are neither listed nor bound to their shortcut */
	visible?: () => boolean;
	/**
	 * Must do exactly what the matching button does, confirmation dialogs included.
	 * Pass the button's own click handler instead of reimplementing it.
	 */
	run: () => unknown;
};
