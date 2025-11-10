<script lang="ts">
interface Props {
  buttons: Button[];
}

export interface Button {
  faIcon?: string;
  label: string;
  shortcut?: string;
  action?: () => void;
  href?: string;
  active?: boolean;
}

const { buttons }: Props = $props();

let container: HTMLDivElement;
let overflowKbd = $state(false);

const checkOverflow = () => {
  if (container) {
    overflowKbd = container.scrollWidth > container.clientWidth;
  }
};

$effect(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
  return () => window.removeEventListener("resize", checkOverflow);
});
</script>

{#snippet ButtonContent(button: Button)}
	{@const { faIcon, label, shortcut, active } = button}
	{#if faIcon}
		<i class="fa-{active ? 'solid' : 'duotone'} fa-{faIcon.replace('fa-', '')}"></i>
	{/if}
	<div class="hidden md:block">{label}</div>
	{#if shortcut && shortcut !== ''}
		<div class="kbd bg-base-100 text-base-content hidden md:block">{shortcut}</div>
	{/if}
{/snippet}

<div
	bind:this={container}
	class="join flex w-full flex-1 items-center justify-center overflow-hidden"
>
	{#each buttons as button}
		{@const { label, action, href, active } = button}
		{#if button.href}
			<a class="btn join-item {active ? 'btn-primary' : ''}" {href} aria-label={label}>
				{@render ButtonContent({
					...button,
					shortcut: overflowKbd ? '' : button.shortcut
				})}
			</a>
		{:else}
			<button
				class="btn join-item {active ? 'btn-primary' : ''}"
				aria-label={label}
				onclick={action}
			>
				{@render ButtonContent({ ...button, shortcut: overflowKbd ? '' : button.shortcut })}
			</button>
		{/if}
	{/each}
</div>
