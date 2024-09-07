<script lang="ts">
  import type { WifiNetwork } from '$lib/types';
  import Wireless1Icon from '$lib/icons/wireless-1.svg?component';
  import Wireless2Icon from '$lib/icons/wireless-2.svg?component';
  import Wireless3Icon from '$lib/icons/wireless-3.svg?component';

  interface Props {
    wifiNetwork: WifiNetwork;
    isSelected: boolean;
    onSelect: (ssid: string, fingerprint: string) => void;
  }

  const { wifiNetwork, isSelected, onSelect }: Props = $props();
  const { ssid, encryptionType, rssi, channel, fingerprint } = wifiNetwork;

  const wirelessIconMap = {
    3: Wireless1Icon,
    2: Wireless2Icon,
    1: Wireless3Icon
  };

  function getSignalStrength() {
    const nRSSI = Math.abs(rssi);
    if (nRSSI <= 60) {
      return 3;
    } else if (nRSSI <= 75) {
      return 2;
    } else {
      return 1;
    }
  }
</script>

<button class="card-container" class:is-selected={isSelected} onclick={() => onSelect(ssid, fingerprint)}>
  <div class="signal-strength-container">
    <div class="signal-strength-icon">
      <svelte:component this={wirelessIconMap[getSignalStrength()]} />
    </div>
    <p class="ssid-label">{ssid}</p>
  </div>
  <div class="network-info">
    <p class="info-label">{encryptionType}</p>
    <p class="info-label-secondary">channel: {channel}</p>
  </div>
</button>

<style lang="scss">
  .card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    box-sizing: border-box;
    width: 100%;
    gap: 20px;
    background-color: var(--primary);
    border: 1px solid var(--secondary);
    border-radius: var(--radius-S);

    &.is-selected {
      border: 3px solid var(--primary-success);
      padding: 8px 16px;
      background-color: var(--primary-lighter);
    }

    &:not(.is-selected):hover {
      background-color: var(--primary-lighter);
    }
  }

  .signal-strength-container {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }

  .signal-strength-icon {
    width: 24px;
    height: 24px;
  }

  .network-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ssid-label {
    font-size: var(--font-S);
    font-weight: bold;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 160px;
    text-align: right;
  }

  .info-label {
    font-size: var(--font-S);
    text-align: right;
  }

  .info-label-secondary {
    font-size: var(--font-S);
    text-align: right;
    color: var(--secondary-lighter);
  }
</style>
