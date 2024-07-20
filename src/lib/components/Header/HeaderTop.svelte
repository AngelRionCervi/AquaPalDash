<script lang="ts">
	import controllerStore from '$lib/stores/controllerStore.svelte';
	import TopRightStat from './TopRightStat.svelte';
</script>

<div class="main-container">
	<div class="left-container">
		<div class="aquarium-name">60x40 Living Room</div>
		<div class="aquarium-stat">
			<span>status:</span>
			<span class="status-{controllerStore.isOn ? 'on' : 'off'}"
				>{controllerStore.isOn ? 'online' : 'offline'}</span
			>
		</div>
		<div class="aquarium-stat">
			<span>schedules:</span><span class="status-{controllerStore.isScheduleOn ? 'on' : 'off'}"
				>{controllerStore.isScheduleOn ? 'on' : 'off'}</span
			>
		</div>
	</div>
	<div class="right-container">
		<div class="stat-container">
			<TopRightStat stat="ph" />
		</div>
		<div class="stat-container">
			<TopRightStat stat="temp" />
		</div>
	</div>
</div>

<style lang="scss">
	.main-container {
		display: flex;
		justify-content: space-between;
	}

	.left-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 16px;
	}

	.aquarium-name {
		font-size: var(--font-XL);
		font-weight: bold;
	}

	.aquarium-stat {
		margin-bottom: 7px;
		display: flex;
		gap: 6px;

		.status-on {
			color: var(--primary-success);
		}

		.status-off {
			color: var(--primary-error);
		}
	}

	.right-container {
		display: flex;
		gap: 36px;
	}

	.stat-container {
		margin-top: 7px;
	}
</style>
