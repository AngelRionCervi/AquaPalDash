<script lang="ts">
	import { randomDecimal } from '$lib/helpers/utils';
import authStore from '$lib/stores/authStore.svelte';
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
  const statValue = $derived(isError ? "-" : monitoringStore.last[stat]);

  function getRandomDecimal(label: MonitoringValueParam) {
    if (label === 'ph') {
      return randomDecimal(6, 7.5, 2);
    } else {
      return randomDecimal(22, 25, 2);
    }
  }
</script>

<div class="container">
	<div class="label">
		<span>{statLabelMap[stat]}</span>
	</div>
	<div class="value value-{isError ? "ko" : "ok"}">
		<span>{authStore.isDemoMode ? getRandomDecimal(stat) : statValue}</span>
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
			color: var(--secondary);
		}
	}
</style>
