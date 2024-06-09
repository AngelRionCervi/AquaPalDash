<script lang="ts">
	interface Props {
		label: string;
	}

	const { label }: Props = $props();
</script>

<div class="container">
	<span class="button-label">{label}</span>
	<button class="green-button"></button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 20px;
		justify-content: center;
    align-items: center;
		border: 1px solid var(--secondary);
		border-bottom-left-radius: 999px;
    border-bottom-right-radius: 999px;
    width: 92px;
	}

	.green-button {
		width: 88px;
    height: 88px;
		border-radius: 999px;
    background-color: var(--primary-success);
		border: 3px solid var(--secondary-success);
    margin-bottom: 2px;
	}

	.button-label {
    margin-top: 12px;
		font-size: var(--font-M);
	}
</style>
