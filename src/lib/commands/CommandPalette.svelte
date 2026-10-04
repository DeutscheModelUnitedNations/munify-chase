<script lang="ts">
	import { Command, computeCommandScore } from 'bits-ui';
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import Kbd from '$lib/components/Kbd.svelte';
	import { m } from '$lib/paraglide/messages';
	import { bindCommandShortcuts, getCommands, isEnabled } from './registry.svelte';
	import { commandPalette, recentCommandIds, rememberCommand } from './palette.svelte';
	import { COMMAND_GROUPS, type Command as AppCommand, type CommandGroup } from './types';

	bindCommandShortcuts();

	let search = $state('');

	const groupLabels: Record<CommandGroup | 'recent', () => string> = {
		recent: () => m.commandGroupRecent(),
		page: () => m.commandGroupPage(),
		navigation: () => m.commandGroupNavigation(),
		global: () => m.commandGroupGlobal()
	};

	// Read when the palette opens, so titles and states match the moment it was opened
	const commands = $derived(commandPalette.open ? getCommands() : []);
	const sections = $derived.by(() => {
		const recent = recentCommandIds()
			.map((id) => commands.find((command) => command.id === id))
			.filter((command) => command !== undefined);
		return [
			// Recently used only while nothing is typed, the search covers them otherwise
			{ group: 'recent' as const, commands: search ? [] : recent },
			...COMMAND_GROUPS.map((group) => ({
				group,
				commands: commands.filter((command) => command.group === group)
			}))
		].filter((section) => section.commands.length > 0);
	});

	// Opens and closes the native dialog whenever the palette state changes
	const syncOpen: Attachment<HTMLDialogElement> = (dialog) => {
		if (commandPalette.open && !dialog.open) {
			dialog.showModal();
			dialog.querySelector('input')?.focus();
		} else if (!commandPalette.open && dialog.open) dialog.close();
	};

	function onClose(event: Event) {
		commandPalette.open = false;
		search = '';
		// The browser can leave focus on the hidden search field, and hotkeys-js ignores
		// keys while a field has focus, so every shortcut would stop working
		const dialog = event.currentTarget as HTMLDialogElement;
		if (document.activeElement instanceof HTMLElement && dialog.contains(document.activeElement)) {
			document.activeElement.blur();
		}
	}

	function isEditable(target: EventTarget | null) {
		return (
			target instanceof HTMLElement &&
			(target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
		);
	}

	function onKeydown(event: KeyboardEvent) {
		const modK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
		const slash =
			event.key === '/' && !event.ctrlKey && !event.metaKey && !isEditable(event.target);
		if (modK || (slash && !commandPalette.open)) {
			event.preventDefault();
			commandPalette.open = !commandPalette.open;
		}
	}

	async function run(command: AppCommand) {
		if (!isEnabled(command)) return;
		rememberCommand(command.id);
		commandPalette.open = false;
		// Let the dialog close and hand back focus first, so dialogs and fields the command
		// opens (confirmations, autofocused inputs) keep the focus
		await tick();
		await new Promise(requestAnimationFrame);
		command.run();
	}

	// Item values only identify the item, scoring them would let ids like
	// "navigation.committee" match unrelated searches. Only titles and keywords count.
	function filter(_value: string, query: string, keywords?: string[]) {
		return computeCommandScore('', query, keywords);
	}

	function searchTerms(command: AppCommand) {
		// Deduplicated, repeated words would let letters match across the copies
		const terms = [
			command.title(),
			command.title({}, { locale: 'en' }),
			command.context?.() ?? '',
			...(command.keywords ?? [])
		];
		return [...new Set(terms.filter(Boolean))];
	}
</script>

<svelte:window onkeydown={onKeydown} />

<dialog
	{@attach syncOpen}
	class="modal modal-top sm:modal-middle"
	aria-label={m.commandPaletteTitle()}
	onclose={onClose}
>
	<div class="modal-box mx-auto mt-4 w-full max-w-xl p-0 sm:mt-0">
		<Command.Root loop {filter} label={m.commandPaletteTitle()}>
			<div class="border-base-300 flex items-center gap-3 border-b px-4">
				<i class="fa-duotone fa-magnifying-glass opacity-60"></i>
				<Command.Input
					bind:value={search}
					placeholder={m.commandPalettePlaceholder()}
					class="h-14 w-full bg-transparent text-base outline-none"
				/>
				<Kbd hotkey="esc" size="sm" />
			</div>
			<Command.List class="max-h-[60vh] overflow-y-auto p-2">
				<Command.Viewport>
					<Command.Empty class="p-6 text-center text-sm opacity-70">
						{m.commandPaletteEmpty()}
					</Command.Empty>
					{#each sections as section (section.group)}
						<Command.Group value={section.group}>
							<Command.GroupHeading class="px-3 pt-3 pb-1 text-xs font-semibold opacity-60">
								{groupLabels[section.group]()}
							</Command.GroupHeading>
							<Command.GroupItems>
								<!-- Keyed by title too: bits-ui keeps an item's search terms for its whole
								life, so a renamed command ("Close list" to "Reopen list") needs a new item -->
								{#each section.commands as command (`${command.id}:${command.title()}`)}
									<Command.Item
										value={`${section.group}:${command.id}:${command.title()}`}
										keywords={searchTerms(command)}
										disabled={!isEnabled(command)}
										onSelect={() => run(command)}
										class="rounded-field data-selected:bg-base-200 flex cursor-pointer items-center gap-3 px-3 py-2 data-disabled:cursor-not-allowed data-disabled:opacity-40"
									>
										<i class="fa-duotone fa-{command.icon ?? 'angle-right'} w-5 text-center"></i>
										<span class="flex-1">
											{command.title()}
											{#if command.context}
												<span class="text-sm opacity-60">· {command.context()}</span>
											{/if}
										</span>
										{#if command.shortcut}
											<Kbd hotkey={command.shortcut} size="sm" />
										{/if}
									</Command.Item>
								{/each}
							</Command.GroupItems>
						</Command.Group>
					{/each}
				</Command.Viewport>
			</Command.List>
		</Command.Root>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>{m.close()}</button>
	</form>
</dialog>
