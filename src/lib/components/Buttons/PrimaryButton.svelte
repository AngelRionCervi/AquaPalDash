<script lang="ts">
  import type { ComponentType } from 'svelte';
  import AddIcon from '$lib/icons/add.svg?component';
  import BinIcon from '$lib/icons/bin.svg?component';
  import BluetoothIcon from '$lib/icons/bluetooth.svg?component';
  import Loader from '$lib/components/Loaders/Loader.svelte';

  interface Props {
    label: string;
    onclick: () => void;
    type?: 'default' | 'green' | 'red';
    icon?: 'add' | 'bin' | 'bluetooth';
    disabled?: boolean;
    isLoading?: boolean;
    size?: 'small' | 'medium';
  }

  type IconMapType = {
    [key in Exclude<Props['icon'], undefined>]: ComponentType;
  };

  const { label, onclick, type = 'default', icon = undefined, disabled = false, isLoading = false, size = 'medium' }: Props = $props();

  const iconMap: IconMapType = {
    add: AddIcon,
    bin: BinIcon,
    bluetooth: BluetoothIcon
  };
</script>

<button class="primary-button button-{type} size-{size}" class:disabled={disabled || isLoading} {onclick} disabled={disabled || isLoading}>
  {#if icon}
    <div class="icon-container size-icon-{size}">
      <svelte:component this={iconMap[icon]} width="100%" height="100%" />
    </div>
  {/if}
  {#if isLoading}
    <Loader size="small" theme={type === 'default' ? 'dark' : 'light'} />
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
    border-radius: var(--radius-S);
    width: fit-content;

    &.size-small {
      gap: 6px;
      padding: 6px 10px;
      font-size: var(--font-S);
    }

    &.size-medium {
      gap: 8px;
      padding: 10px 16px;
      font-size: var(--font-M);
    }

    @media screen and (max-width: $mobile-bp) {
      padding: 8px 12px;

      &.size-small {
        padding: 5px 8px;
        font-size: var(--font-S);
      }
    }

    @media screen and (max-width: $small-mobile-bp) {
      font-size: var(--font-S);

      &.size-small {
        padding: 5px 8px;
      }
    }
  }

  .icon-container {
    width: 28px;
    height: 28px;

    &.size-icon-small {
      width: 20px;
      height: 20px;
    }

    @media screen and (max-width: $mobile-bp) {
      width: 24px;
      height: 24px;

      &.size-icon-small {
        width: 16px;
        height: 16px;
      }
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
