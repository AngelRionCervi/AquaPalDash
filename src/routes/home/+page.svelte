<script lang="ts">
	import ScheduleButton from '$lib/components/Buttons/ScheduleButton.svelte';
	import DeviceButton from '$lib/components/Buttons/DeviceButton.svelte';
	import LockIcon from '$lib/icons/lock.svg?component';
	import UnlockIcon from '$lib/icons/unlock.svg?component';

	const lockIconMap = {
		lock: LockIcon,
		unlock: UnlockIcon
	};
</script>

<div class="home-main-container">
	<div class="home-inner">
		<div class="schedule-button-container">
			<ScheduleButton />
		</div>
		<div class="lock-container">
			<svelte:component this={lockIconMap['lock']} width={96} height={96} fill="var(--secondary)" />
		</div>
		<div class="device-buttons-container"><DeviceButton label="filter" /></div>
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
</style>
