<script lang="ts">
	import type { Component } from 'svelte';
	import type { ModalTypes } from './types';
	import modalStore from '$lib/stores/modalStore.svelte';
	import CloseIcon from '$lib/icons/close.svg?component';
	import ScheduleSetting from './ScheduleSetting.svelte';
	import ButtonSlotSetting from './ButtonSlotSetting.svelte';
	import RemoveDevices from './RemoveDevices.svelte';
	import AddDevice from './AddDevice.svelte';
	import ModifyNameDevice from './ModifyNameDevice.svelte';

	type ModalChildMap = {
		[key in ModalTypes]: Component;
	};

	let { toggle } = modalStore;

	const modalChildMap: ModalChildMap = {
		scheduleSetting: ScheduleSetting,
		buttonSlotSetting: ButtonSlotSetting,
		removeDevices: RemoveDevices,
		addDevice: AddDevice,
		modifyNameDevice: ModifyNameDevice
	};

	$effect(() => {
		console.log('isOpen', modalStore.isOpen);
	});
</script>

{#if modalStore.isOpen}
	<div class="modal-container">
		<div class="modal-header">
			<div class="modal-top-left">
				<span class="modal-title">{modalStore.title}</span>
				<span class="modal-subtitle">{modalStore?.subtitle || ''}</span>
			</div>
			<button onclick={() => toggle()}><CloseIcon width={32} height={32} /></button>
		</div>
		<div>
			{#if modalStore.type}
				<svelte:component this={modalChildMap[modalStore.type]} {...modalStore.childProps} />
			{/if}
		</div>
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="backdrop" onclick={toggle}></div>
{/if}

<style lang="scss">
	.backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		width: 100vw;
		height: 100vh;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
	}

	.modal-top-left {
    display: flex;
    align-items: flex-end;
    gap: 16px;
	}

  .modal-title {
		font-size: var(--font-L);
		font-weight: bold;
  }

  .modal-subtitle {
    font-size: var(--font-M);
    margin-bottom: 4px;
  }

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
	}

	.modal-container {
		min-width: 600px;
		z-index: 11;
		border: 1px solid var(--secondary);
		border-radius: var(--radius-XL);
		padding: 24px;
		background-color: var(--primary);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
