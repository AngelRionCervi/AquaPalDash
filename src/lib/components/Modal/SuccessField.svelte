<script lang="ts">
	interface Props {
		messages: null | string | Array<string>;
	}

	const { messages }: Props = $props();

	const messagesArr = $derived([messages].flat());
</script>

{#if messagesArr.filter(Boolean).length}
	<div class="success-field">
		{#each messagesArr as message}
			<p class="error-message">{message}</p>
		{/each}
	</div>
{/if}

<style lang="scss">
	.success-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		margin: 8px 0 16px 0;
		border: 1px solid var(--secondary-success);
		border-radius: var(--radius-S);
		background-color: var(--primary-lighter);
		padding: 8px 16px;
		max-width: 400px;
	}

	.error-message {
		color: var(--primary-success);
		font-size: var(--font-M);
	}
</style>
