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
  @import '$lib/variables.scss';

	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
		align-items: center;
		border: 2px solid var(--secondary);
		border-radius: var(--radius-XL);
		padding: 56px 26px;
    box-shadow: 0px 4px 4px -2px var(--secondary-lighter);

    @media screen and (max-width: $mobile-bp) {
      padding: 40px 20px;
    }
	}

	.big-button {
		width: 180px;
		height: 180px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;

    @media screen and (max-width: $mobile-bp) {
      width: 120px;
      height: 120px;
    }
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
