<script lang="ts">
	import monitoringStore, { type MonitoringValueParam } from '$lib/stores/monitoringStore.svelte';

	interface Props {
		stat: MonitoringValueParam;
	}

	const { stat }: Props = $props();

	const statLabelMap = {
		ph: 'PH:',
		temp: 'Temp:'
	};

  const isError = $derived(monitoringStore.errors[stat]);
</script>

<div class="container">
	<div class="label">
		<span>{statLabelMap[stat]}</span>
	</div>
	<div class="value value-{isError ? "ko" : "ok"}">
		<span>{isError ? "Error" : monitoringStore.last[stat]}</span>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		gap: 8px;
	}

	.value {
		font-size: var(--font-XL);
		font-weight: bold;

		&.value-ok {
			color: var(--primary-success);
		}

    &.value-ko {
			color: var(--primary-error);
		}
	}
</style>
