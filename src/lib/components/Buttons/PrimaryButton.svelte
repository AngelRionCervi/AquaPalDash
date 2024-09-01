<script lang="ts">
  import type { ComponentType } from 'svelte';
  import AddIcon from '$lib/icons/add.svg?component';
  import BinIcon from '$lib/icons/bin.svg?component';
  import BluetoothIcon from '$lib/icons/bluetooth.svg?component';
  import Loader from '$lib/components/Loaders/Loader.svelte';
  import windowStore from '$lib/stores/windowStore.svelte';
  import { MOBILE_BP } from '$lib/constants';

  interface Props {
    label: string;
    onclick: () => void;
    type?: 'default' | 'green' | 'red';
    icon?: 'add' | 'bin' | 'bluetooth';
    disabled?: boolean;
    isLoading?: boolean;
  }

  type IconMapType = {
    [key in Exclude<Props['icon'], undefined>]: ComponentType;
  };

  const { label, onclick, type = 'default', icon = undefined, disabled = false, isLoading = false }: Props = $props();

  const iconMap: IconMapType = {
    add: AddIcon,
    bin: BinIcon,
    bluetooth: BluetoothIcon
  };
</script>

<button class="primary-button button-{type}" class:disabled={disabled || isLoading} {onclick} disabled={disabled || isLoading}>
  {#if icon}
    <svelte:component this={iconMap[icon]} width={windowStore.width < MOBILE_BP ? 24 : 28} height={windowStore.width < MOBILE_BP ? 24 : 28} />
  {/if}
  {#if isLoading}
    <Loader size="small" theme="light" />
  {:else}
    <span class:label-align-center={!icon}>{label}</span>
  {/if}
</button>

<style lang="scss">
  @import '$lib/variables.scss';

  .primary-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    border-radius: var(--radius-S);
    padding: 10px 16px;
    font-size: var(--font-M);

    @media screen and (max-width: $mobile-bp) {
      padding: 8px 12px;
    }

    @media screen and (max-width: $small-mobile-bp) {
      font-size: var(--font-S);
    }
  }

  .button-default {
    border: 1px solid var(--secondary);
    background-color: var(--primary);
    color: var(--secondary);

    &:hover {
      background-color: var(--primary-darker);
    }
  }

  .button-green {
    border: 1px solid var(--secondary-success);
    background-color: var(--primary-success);
    color: var(--primary);

    &:hover {
      background-color: var(--primary-success-darker);
    }
  }

  .button-red {
    border: 1px solid var(--secondary-error);
    background-color: var(--primary-error);
    color: var(--primary);

    &:hover {
      background-color: var(--primary-error-darker);
    }
  }

  .disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &:hover {
      &.button-default {
        background-color: var(--primary);
      }

      &.button-green {
        background-color: var(--primary-success);
      }

      &.button-red {
        background-color: var(--primary-error);
      }
    }
  }

  .label-align-center {
    text-align: center;
    width: 100%;
  }
</style>
