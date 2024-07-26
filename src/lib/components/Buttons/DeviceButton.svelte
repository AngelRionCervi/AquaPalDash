<script lang="ts">
	import Loader from '$lib/components/Loaders/Loader.svelte';

	interface Props {
		onClick: () => void;
		name: string;
		disabled: boolean;
		isLoading: boolean;
		state: boolean;
	}

	const { onClick, name, state, isLoading, disabled }: Props = $props();
</script>

<div class="container">
	<span class="button-label">{name}</span>
	<button
		class="device-button device-{state ? 'on' : 'off'}"
		class:is-loading={isLoading}
		class:is-disabled={disabled}
		onclick={onClick}
	>
		{#if isLoading}
			<Loader size="medium" theme="light" />
		{/if}
	</button>
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

	.device-button {
		width: 88px;
		height: 88px;
		border-radius: 999px;
		margin-bottom: 2px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.device-on {
		background-color: var(--primary-success);
		border: 2px solid var(--secondary-success);

		&:not(.is-disabled):hover {
			background-color: var(--primary-success-darker);
		}
	}

	.device-off {
		background-color: var(--primary-error);
		border: 2px solid var(--secondary-error);

		&:not(.is-disabled):hover {
			background-color: var(--primary-error-darker);
		}
	}

	.button-label {
		margin-top: 12px;
		font-size: var(--font-M);
	}

	.is-loading {
		&.device-on {
			background-color: var(--primary-success-darker);
		}
		&.device-off {
			background-color: var(--primary-error-darker);
		}
	}

	.is-disabled {
		cursor: not-allowed;
		opacity: 0.35;
	}
</style>
