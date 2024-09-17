<script lang="ts">
  import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
  import { MAX_DEVICES, SMART_PLUG_TYPES } from '$lib/constants';
  import modalStore from '$lib/stores/modalStore.svelte';
  import configStore from '$lib/stores/configStore.svelte';
  import ScheduleInput from '$lib/components/Inputs/ScheduleInput.svelte';
  import { generateUniqueId } from '$lib/helpers/utils';
  import { type Schedule, type SmartPlugs } from '$lib/types';
  import Select from '$lib/components/Inputs/Select.svelte';

  const { toggle } = modalStore;

  let name: string = $state('');
  let ipAddress: string = $state('');
  let buttonSlot: number | null = $state(null);
  let newSchedule = $state<Schedule | null>(null);
  let smartPlugType = $state<SmartPlugs | null>(null);
  let isValidateDisabled = $derived(!name || !ipAddress || typeof buttonSlot !== 'number' || newSchedule === null || !smartPlugType);

  function onAddDevice() {
    const id = generateUniqueId();
    if (
      !isValidateDisabled &&
      typeof buttonSlot === 'number' &&
      ipAddress &&
      name &&
      newSchedule !== null &&
      SMART_PLUG_TYPES.map((type) => type.value).includes(smartPlugType as SmartPlugs) &&
      smartPlugType
    ) {
      configStore.addDevice({ id, name, ip: ipAddress, smartPlugType, button: buttonSlot, schedule: newSchedule });
      toggle();
    }
  }

  function onButtonBindChange(value: number) {
    if (typeof value !== 'number') return;

    if (buttonSlot === value) {
      buttonSlot = null;
      return;
    }

    buttonSlot = value;
  }

  function onChange(schedule: Schedule) {
    newSchedule = schedule;
  }

  function onSmartPlugChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as SmartPlugs;
    smartPlugType = value;
  }
</script>

<div class="add-device-container">
  <div class="top">
    <fieldset class="input-fields">
      <div class="input-row">
        <label for="name_input">Name:</label>
        <input class="text-input" type="text" id="name_input" name="name" maxlength="30" bind:value={name} />
      </div>
      <div class="input-row">
        <label for="ip_input">IP:</label>
        <input class="text-input" type="text" id="ip_input" name="ip" maxlength="40" bind:value={ipAddress} />
      </div>
      <div class="input-row">
        <label for="smartplug_type">Smart plug type:</label>
        <Select name="smartplug_type" id="smartplug_type" values={[...SMART_PLUG_TYPES]} onchange={onSmartPlugChange} />
      </div>
      <div class="button-input-row">
        <label for="button_input">Button:</label>
        <div class="box-graph">
          <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
          {#each { length: MAX_DEVICES } as _, index}
            <div class="button-label-radio">
              <input
                class="radio-input"
                class:radio-input-disabled={configStore.config?.devices.some((device) => device.button === index)}
                type="radio"
                id="button_slot_{index}"
                name="button-slot-{index}"
                value={index}
                disabled={configStore.config?.devices.some((device) => device.button === index)}
                onclick={() => onButtonBindChange(index)}
                checked={buttonSlot === index}
              />
              <label for="button_slot_{index}">{index + 1}</label>
            </div>
          {/each}
        </div>
      </div>
    </fieldset>
  </div>
  <div class="schedule-field">
    <div class="inner-schedule-field">
      <ScheduleInput {onChange} timeFormat={configStore.config?.settings?.timeFormat} />
    </div>
  </div>
  <div class="bottom">
    <PrimaryButton label="Add device" onclick={onAddDevice} disabled={isValidateDisabled} />
  </div>
</div>

<style lang="scss">
  @import '$lib/variables.scss';

  .add-device-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 32px;

    @media screen and (max-width: $mobile-bp) {
      gap: 24px;
    }
  }

  .top {
    display: flex;
    justify-content: center;
  }

  .input-fields {
    display: flex;
    flex-direction: column;
    gap: 16px;
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

  .button-input-row {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .button-label-radio {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 4px;

    label {
      font-size: var(--font-S);
    }
  }

  .radio-input {
    &:checked {
      border: 6px solid var(--primary-success);
    }

    &.radio-input-disabled {
      cursor: not-allowed;
      border: 2px solid var(--primary-darker);
    }
  }

  .box-graph {
    display: flex;
    gap: 20px;
    padding: 16px;
    border-radius: var(--radius-S);
    border: 1px solid var(--secondary);
  }

  .schedule-field {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inner-schedule-field {
    width: 80%;
  }
</style>
