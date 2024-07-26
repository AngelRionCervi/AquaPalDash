<script lang="ts">
	import ScheduleButton from '$lib/components/Buttons/ScheduleButton.svelte';
	import DeviceButton from '$lib/components/Buttons/DeviceButton.svelte';
	import LockIcon from '$lib/icons/lock.svg?component';
	import UnlockIcon from '$lib/icons/unlock.svg?component';
	import configStore from '$lib/stores/configStore.svelte';
	import controllerStore from '$lib/stores/controllerStore.svelte';
	import deviceStatusStore from '$lib/stores/deviceStatusStore.svelte';

	let devicesInOrder = $state(configStore.config?.devices || []);

	const lockIconMap = {
		lock: LockIcon,
		unlock: UnlockIcon
	};

	function onScheduleButtonClick() {
		controllerStore.toggleSchedule();
	}

	function onDeviceButtonClick(id: string) {
		console.log('device button clicked', id);
		if (controllerStore.isScheduleOn) return;
		controllerStore.toggleDeviceSchedule(id);
	}

	$effect(() => {
		console.log(
			'controllerStore.callStates.toggleSchedule.isLoading',
			controllerStore.callStates.toggleSchedule.isLoading
		);
	});

	$effect(() => {
		devicesInOrder = configStore.config?.devices.sort((a, b) => a.button - b.button) || [];
	});
</script>

<div class="home-main-container">
	<div class="home-inner">
		<div class="schedule-button-container">
			<ScheduleButton
				onClick={onScheduleButtonClick}
				scheduleState={controllerStore.isScheduleOn}
				isLoading={!!controllerStore.callStates.toggleSchedule.isLoading}
			/>
		</div>
		<div class="lock-container">
			<svelte:component
				this={lockIconMap[controllerStore.isScheduleOn ? 'lock' : 'unlock']}
				width={96}
				height={96}
				fill="var(--secondary)"
			/>
		</div>
		<div class="device-buttons-container">
			{#if configStore.config?.devices}
				{#each devicesInOrder as { id, name } (id)}
					<DeviceButton
						onClick={() => onDeviceButtonClick(id)}
						{name}
						disabled={controllerStore.isScheduleOn}
						isLoading={!!controllerStore.deviceCallStates[id]?.isLoading}
						state={!!deviceStatusStore.getDeviceStatus(id)?.isOn}
					/>
				{/each}
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.home-main-container {
		display: flex;
		height: 100%;
		margin: 0 64px;
		justify-content: center;
	}

	.home-inner {
		display: flex;
		gap: 128px;
		justify-content: center;
		align-items: center;
	}

	.device-buttons-container {
		display: flex;
		gap: 32px;
	}
</style>
