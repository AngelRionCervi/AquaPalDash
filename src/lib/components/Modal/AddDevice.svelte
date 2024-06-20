<script lang="ts">
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import { MAX_DEVICES } from '$lib/constants';
	import modalStore from '$lib/stores/modalStore.svelte';

	const { toggle } = modalStore;

	let name: string = $state('');
	let ipAddress: string = $state('');
	let buttonSlot: number = $state(NaN);

	function onAddDevice() {
		console.log('name ip', name, ipAddress);
		toggle();
	}
</script>

<div class="add-device-container">
	<div class="top">
		<fieldset class="input-fields">
			<div class="input-row">
				<label for="name_input">Name:</label>
				<input
					class="text-input"
					type="text"
					id="name_input"
					name="name"
					maxlength="30"
					bind:value={name}
				/>
			</div>
			<div class="input-row">
				<label for="ip_input">IP:</label>
				<input
					class="text-input"
					type="text"
					id="ip_input"
					name="ip"
					maxlength="40"
					bind:value={ipAddress}
				/>
			</div>
			<div class="input-row">
				<label for="button_input">Button:</label>
				<input
					class="text-input"
					type="number"
					id="button_input"
					name="button"
					min="1"
					max={MAX_DEVICES}
					bind:value={buttonSlot}
				/>
			</div>
		</fieldset>
	</div>
	<div class="bottom">
		<PrimaryButton label="Add device" onclick={onAddDevice} />
	</div>
</div>

<style lang="scss">
	.add-device-container {
		display: flex;
		flex-direction: column;
		gap: 36px;
	}

	.top {
		display: flex;
		justify-content: center;
	}

	.input-fields {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.input-row {
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}

	.bottom {
		display: flex;
		justify-content: center;
	}

	.text-input {
		width: 250px;
	}
</style>
