<script lang="ts">
	let checkbox: HTMLInputElement;
</script>

<button class="btn btn-ghost btn-square" aria-label="Toggle theme" onclick={() => checkbox.click()}>
	<label class="swap swap-rotate">
		<input type="checkbox" class="theme-controller" value="dark" bind:this={checkbox} />

		<i class="fa-duotone fa-sun swap-off"></i>

		<i class="fa-duotone fa-moon swap-on"></i>
	</label>
</button>
