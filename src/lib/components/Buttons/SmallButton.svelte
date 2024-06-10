<script lang="ts">
	interface Props {
		label: string;
		type?: 'default' | 'green';
	}

	const { label, type = 'default' }: Props = $props();
</script>

<button class="primary-button button-{type}">
	<span>{label}</span>
</button>

<style lang="scss">
	.primary-button {
    display: flex;
    align-items: center;
    justify-content: center;
		border-radius: var(--radius-S);
		padding: 2px 8px;
    font-size: var(--font-S);
	}

	.button-default {
		border: 1px solid var(--secondary);
		background-color: var(--primary);
		color: var(--secondary);

    &:hover {
      background-color: var(--primary-darker);
    }
	}

	.button-green {
		border: 1px solid var(--secondary-success);
		background-color: var(--primary-success);
		color: var(--primary);

    &:hover {
      background-color: var(--primary-success-darker);
    }
	}
</style>
