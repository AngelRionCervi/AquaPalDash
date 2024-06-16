<script lang="ts">
	import CloudIcon from '$lib/icons/cloud.svg?component';
	import NoCloudIcon from '$lib/icons/no-cloud.svg?component';
	import SmallButton from '$lib/components/Buttons/SmallButton.svelte';

	const cloudIconMap = {
		online: CloudIcon,
		offline: NoCloudIcon
	};
</script>

<div class="card-container">
	<div class="device-name-container">
		<span class="device-name">Filter</span>
	</div>
	<div class="separator"></div>
	<div class="device-status">
		<span class="setting-title">Status:</span>
		<div class="status-pills">
			<span class="pill is-on">connected</span>
			<span class="pill is-on">on</span>
		</div>
	</div>
	<div class="semi-separator"></div>
	<div class="device-controls">
		<div class="editable-row-slot">
			<div class="row-values-slot">
				<span class="setting-title">Button slot:</span>
				<div class="current-value-slot"><span>1</span></div>
			</div>
			<SmallButton label="Edit" />
		</div>
		<div class="semi-separator"></div>
		<div class="editable-row-schedule">
			<span class="setting-title">Schedule:</span>
			<div class="current-value-schedule"><span>On between 88h30 and 88h30</span></div>
			<SmallButton label="Edit" />
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
	}

	.device-name-container {
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 8px;
	}

	.device-name {
		font-size: var(--font-L);
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
	}
</style>
