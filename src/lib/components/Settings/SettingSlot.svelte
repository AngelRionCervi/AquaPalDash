<script lang="ts">
  import type { Setting } from './type';
  import Select from '$lib/components/Inputs/Select.svelte';
  import { convertToType } from '$lib/helpers/utils';
  import type { ConfigSettings } from '$lib/types';

  interface Props {
    setting: Setting;
    index: number;
    currentValue: unknown;
    onSettingChange: (settingName: keyof ConfigSettings, value: string | number | boolean) => void;
  }

  const { setting, index, currentValue, onSettingChange }: Props = $props();
  const { label, name, type, defaultVal, values, valueType } = setting;

  const id = `${name}_${type}`;

  function onChange({ target }: Event) {
    const value = (target as HTMLInputElement).value;
    const typedValue = convertToType(valueType, value) as string | number | boolean;
    console.log('typedValue', typedValue);
    onSettingChange(name, typedValue);
  }
</script>

<div class="setting-slot-container">
  {#if index === 0}
    <div class="separator"></div>
  {/if}
  <div class="inner-container">
    <div class="left-container">
      <label for={id}>{label}</label>
    </div>
    <div class="right-container">
      {#if type === 'text'}
        <input class="input" type="text" {id} value={currentValue ?? defaultVal} maxlength="30" oninput={onChange} />
      {:else if type === 'select' && values?.length}
        <Select {id} {name} {values} {currentValue} onchange={onChange} hasBorders />
      {/if}
    </div>
  </div>
  <div class="separator"></div>
</div>

<style lang="scss">
  @use '$lib/variables.scss';

  .setting-slot-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media screen and (max-width: variables.$mobile-bp) {
      margin: 0 16px;
    }
  }

  .inner-container {
    display: flex;
    justify-content: space-between;
    padding: 16px 0;
    font-size: var(--font-M);

    @media screen and (max-width: variables.$mobile-bp) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }
  }

  .left-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .separator {
    width: 100%;
    height: 1px;
    background-color: var(--secondary);
  }

  .input {
    font-size: var(--font-M);
    width: 250px;
  }
</style>
