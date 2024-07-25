<script lang="ts">
	import SmallButton from '$lib/components/Buttons/SmallButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';
	import devicesStatusStore from '$lib/stores/deviceStatusStore.svelte';
	import { getScheduleLabel } from '$lib/helpers/utils';
	import EditIcon from '$lib/icons/edit.svg?component';

	interface Props {
		device: Device;
	}

	const { device }: Props = $props();
	const deviceStatus = $derived(devicesStatusStore.getDeviceStatus(device.name));
	const deviceDisabled = $derived(device.isUnsaved || device.toBeRemoved);

	function onScheduleEdit() {
		console.log('schedule edit');
		modalStore.toggle('Schedule Edit', 'scheduleSetting', { name: device.name });
	}

	function onButtonSlotEdit() {
		console.log('button slot edit');
		modalStore.toggle('Button Edit', 'buttonSlotSetting', { name: device.name });
	}

  function onModifyName() {
    console.log('modify name');
    modalStore.toggle('Modify Name', 'modifyNameDevice', { name: device.name });
  }

	function getPillStatusOn(status: boolean | null | undefined) {
		if (status === null) return 'unknown';
		return status ? 'on' : 'off';
	}

	function getPillStatusConnected(status: boolean | null | undefined) {
		if (status === null) return 'unknown';
		return status ? 'online' : 'offline';
	}
</script>

<div class="card-container" class:card-device-unsaved={deviceDisabled}>
	<div class="device-name-container">
		<div class="device-name">
			<span>{device.name}</span><button onclick={onModifyName} class="name-edit-button" aria-label="edit"
				><EditIcon width={20} height={20} /></button
			>
		</div>
	</div>
	<div class="separator"></div>
	<div class="device-status">
		<span class="setting-title">Status:</span>
		<div class="status-pills">
			<span class="pill is-{deviceStatus?.isConnected ? 'on' : 'off'}"
				>{getPillStatusConnected(deviceStatus?.isConnected)}</span
			>
			<span class="pill is-{deviceStatus?.isOn ? 'on' : 'off'}"
				>{getPillStatusOn(deviceStatus?.isOn)}</span
			>
		</div>
	</div>
	<div class="semi-separator"></div>
	<div class="device-controls">
		<div class="editable-row-slot">
			<div class="row-values-slot">
				<span class="setting-title">Button slot:</span>
				<div class="current-value-slot"><span>{device.button + 1}</span></div>
			</div>
			<SmallButton onclick={onButtonSlotEdit} disabled={deviceDisabled} label="Edit" />
		</div>
		<div class="semi-separator"></div>
		<div class="editable-row-schedule">
			<span class="setting-title">Schedule:</span>
			<div class="current-value-schedule">
				<span>{@html getScheduleLabel(device.schedule)}</span>
			</div>
			<SmallButton onclick={onScheduleEdit} disabled={deviceDisabled} label="Edit" />
		</div>
	</div>
</div>

<style lang="scss">
	.card-container {
		border: 1px solid var(--secondary);
		background-color: var(--primary);
		border-radius: var(--radius-XL);
		padding: 24px;
		width: 250px;
		height: fit-content;
	}

	.card-device-unsaved {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.device-name-container {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 8px;
	}

	.device-name {
		font-size: var(--font-L);
		display: flex;
		gap: 8px;
		margin-left: 25px;
	}

	.separator {
		width: calc(100% + 48px);
		height: 1px;
		background-color: var(--secondary);
		margin: 20px 0 20px -24px;
	}

	.semi-separator {
		width: calc(100% + 0px);
		height: 1px;
		background-color: var(--secondary);
		margin: 20px 0 20px 0px;
	}

	.device-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.status-pills {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.setting-title {
		font-size: var(--font-M);
	}

	.pill {
		border-radius: 15px;
		padding: 1px 6px 2px 6px;
		font-size: var(--font-S);
		line-height: 14px;
		margin-bottom: 6px;
		color: var(--secondary-text);
		width: fit-content;

		&.is-on {
			background-color: var(--primary-success);
		}

		&.is-off {
			background-color: var(--primary-error);
		}
	}

	.editable-row-slot {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.row-values-slot {
		display: flex;
		justify-content: space-between;
	}

	.current-value-slot {
		font-size: var(--font-S);
		border-radius: 999px;
		background-color: var(--secondary);
		color: var(--secondary-text);
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.editable-row-schedule {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.current-value-schedule {
		font-size: var(--font-S);
		font-weight: bold;
	}

	.name-edit-button {
		background-color: transparent;
		cursor: pointer;
		padding: 0;
		border-radius: var(--radius-S);
		height: fit-content;
		padding: 2px;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			background-color: var(--primary-darker);
		}
	}
</style>
