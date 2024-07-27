<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import configStore from '$lib/stores/configStore.svelte';
	import ErrorField from './ErrorField.svelte';
	import ScheduleInput from '$lib/components/Inputs/ScheduleInput.svelte';

	interface Props {
		id?: string;
	}

	const { id = '' }: Props = $props();
	const { toggle } = modalStore;
	const device = configStore.config?.devices.find((device) => device.id === id);

	let newSchedule = $state<Schedule | undefined>(device?.schedule);
	let isOldSchedule = $derived(device?.schedule.toString() === newSchedule?.toString());
	let errorMessage = $state<string | null>(null);

	function onValidate() {
		if (!isOldSchedule && newSchedule) {
			console.log('validate schedule', id, { schedule: newSchedule });
			configStore.updateDevice(id, { schedule: newSchedule });
			errorMessage = null;
		} else {
			errorMessage = 'The new schedule is the same as the current one';
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
		<ErrorField messages={errorMessage} />
		<PrimaryButton onclick={onValidate} disabled={isOldSchedule || !!errorMessage} label="OK" />
	</div>
</div>

<style lang="scss">
	.schedule-setting-container {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 24px;
	}

	.top {
		width: 100%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}

	.device-name {
		font-size: var(--font-M);
		font-weight: bold;
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
