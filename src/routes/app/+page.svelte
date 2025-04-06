<script lang="ts">
	import { graphql } from '$houdini';
	import { onMount } from 'svelte';
	import type { PageData } from './$houdini';

	let { data }: { data: PageData } = $props();

	let content = $state('');

	let postMessage = graphql(`
		mutation PostMessage($content: String!) {
			postMessage(content: $content) {
				id
				content
				user {
					id
					givenName
					familyName
				}
			}
		}
	`);

	let AllMessagesSub = graphql(`
		subscription AllMessagesSubscription {
			findManyMessage {
				id
				content
				createdAt
				user {
					familyName
					givenName
					id
				}
			}
		}
	`);

	onMount(() => {
		AllMessagesSub.listen();
	});
</script>

<h1>{data.user?.given_name} {data.user?.family_name}</h1>

<input type="text" class="bg-gray-300" bind:value={content} />
<button
	onclick={() => {
		postMessage.mutate({ content });
		content = '';
	}}>Post</button
>

{#if $AllMessagesSub.data?.findManyMessage}
	{#each $AllMessagesSub.data.findManyMessage as message (message.id)}
		<div>
			{message.user.givenName}
			{message.user.familyName}: {message.content}
		</div>
	{/each}
{/if}
