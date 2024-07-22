<script lang="ts">
	import Loader from '$lib/components/Loaders/Loader.svelte';

	interface Props {
		onClick: () => void;
		scheduleState: boolean;
		isLoading: boolean;
	}

	const { onClick, scheduleState, isLoading }: Props = $props();
</script>

<div class="container">
	<span class="button-label">Schedules</span>
	<button
		class="big-button schedule-{scheduleState ? 'on' : 'off'}"
		class:is-loading={isLoading}
		onclick={onClick}
	>
		{#if isLoading}
			<Loader size="big" />
		{/if}
	</button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--secondary);
		border-radius: var(--radius-XL);
		padding: 56px 26px;
	}

	.big-button {
		width: 180px;
		height: 180px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.schedule-on {
		background-color: var(--primary-success);
		border: 5px solid var(--secondary-success);

		&:hover {
			background-color: var(--primary-success-darker);
		}
	}

	.schedule-off {
		background-color: var(--primary-error);
		border: 5px solid var(--secondary-error);

		&:hover {
			background-color: var(--primary-error-darker);
		}
	}

	.is-loading {
		&.schedule-on {
			background-color: var(--primary-success-darker);
		}
		&.schedule-off {
			background-color: var(--primary-error-darker);
		}
	}

	.button-label {
		font-size: var(--font-ML);
	}
</style>
