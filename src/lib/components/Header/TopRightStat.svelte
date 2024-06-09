<script lang="ts">
	interface Props {
		stat: 'ph' | 'temp';
	}

	const { stat }: Props = $props();

  const statLabelMap = {
    ph: 'PH:',
    temp: "Temp:"
  }
</script>

<div class="container">
	<div class="label">
		<span>{statLabelMap[stat]}</span>
	</div>
	<div class="value value-ok">
		<span>6.4</span>
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
  }
</style>
