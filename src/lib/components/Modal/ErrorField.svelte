<script lang="ts">
	interface Props {
		messages: null | string | Array<string>;
	}

	const { messages }: Props = $props();

	const messagesArr = $derived([messages].flat());
</script>

{#if messagesArr.filter(Boolean).length}
	<div class="error-field">
		{#each messagesArr as message}
			<p class="error-message">{message}</p>
		{/each}
	</div>
{/if}

<style lang="scss">
	.error-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		margin: 16px 0;
		border: 1px solid var(--secondary-error);
		border-radius: var(--radius-S);
		background-color: var(--primary-lighter);
		padding: 8px 16px;
		max-width: 400px;
	}

	.error-message {
		color: var(--primary-error);
		font-size: var(--font-M);
	}
</style>
