<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import ErrorField from './ErrorField.svelte';
	import ScheduleInput from '$lib/components/Inputs/ScheduleInput.svelte';

	interface Props {
		name?: string;
	}

	const { name = '' }: Props = $props();
	const { toggle } = modalStore;
	const { updateDevice } = configStore;
	const device = configStore.config?.devices.find((device) => device.name === name);

	let newSchedule = $state<Schedule | undefined>(device?.schedule);
	let isOldSchedule = $derived(device?.schedule.toString() === newSchedule?.toString());

	function onValidate() {
		if (!isOldSchedule && newSchedule) {
			console.log('validate schedule', name, { schedule: newSchedule });
			updateDevice(name, { schedule: newSchedule });
		}
		toggle();
	}

	function onChange(schedule: Schedule) {
    newSchedule = schedule;
	}
</script>

<div class="schedule-setting-container">
	<div class="top">
		<div class="current-schedule">
			<div class="current-schedule-inner">
				<p class="label">Current:</p>
				<p class="value">On between 11h and 18h.</p>
			</div>
		</div>
	</div>
	<div class="schedule-field">
		<ScheduleInput {onChange} previousSetting={device?.schedule} />
	</div>
	<div class="bottom">
		<ErrorField
			messages={['error example', "yet another error but this time it's veven longer lolol"]}
		/>
		<PrimaryButton onclick={onValidate} disabled={isOldSchedule} label="OK" />
	</div>
</div>

<style lang="scss">
	.schedule-setting-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 16px;
	}

	.top {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.current-schedule {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.current-schedule-inner {
		width: fit-content;

		.label {
			font-size: var(--font-M);
			font-weight: bold;
		}
	}

	.bottom {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.schedule-field {
		width: 80%;
	}
</style>
