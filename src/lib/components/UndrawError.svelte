<script lang="ts">
interface Props {
  undrawImage: string;
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const { undrawImage, title, description, buttonText, buttonLink }: Props =
  $props();
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
	<div class="card bg-base-100 w-full max-w-xl">
		<div class="card-body items-center justify-center">
			<img src={undrawImage} alt="Error illustration" class="h-auto w-full max-w-md" />
			<h2 class="mt-4 text-center text-2xl font-bold">{title}</h2>
			{#if description}
				<p class="text-center text-lg">{description}</p>
			{/if}
			{#if buttonText && buttonLink}
				<a href={buttonLink} class="btn btn-primary mt-4 w-full max-w-sm">{buttonText}</a>
			{/if}
		</div>
	</div>
</div>
