<script lang="ts">
	import ScheduleButton from '$lib/components/Buttons/ScheduleButton.svelte';
  import DeviceButton from '$lib/components/Buttons/DeviceButton.svelte';
</script>

<div class="home-main-container">
	<div class="schedule-button-container">
		<ScheduleButton />
	</div>
	<div class="lock-container">lock</div>
	<div class="device-buttons-container"><DeviceButton label="filter" /></div>
</div>

<style lang="scss">
	.home-main-container {
		display: flex;
		gap: 32px;
		justify-content: space-between;
		align-items: center;
	}
</style>
