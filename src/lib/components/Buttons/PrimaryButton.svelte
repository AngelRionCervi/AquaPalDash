<script lang="ts">
	import AddIcon from '$lib/icons/add.svg?component';
	import BinIcon from '$lib/icons/bin.svg?component';
	import type { Component, ComponentType } from 'svelte';

	interface Props {
		label: string;
    onclick: () => void;
		type?: 'default' | 'green' | 'red';
		icon?: 'add' | 'bin';
	}

	type IconMapType = {
		[key in Exclude<Props['icon'], undefined>]: ComponentType;
	};

	const iconMap: IconMapType = {
		add: AddIcon,
		bin: BinIcon
	};

	const { label, onclick, type = 'default', icon = undefined }: Props = $props();
</script>

<button class="primary-button button-{type}" {onclick}>
	{#if icon}
		<svelte:component this={iconMap[icon]} width={24} height={24} fill="var(--secondary);" />
	{/if}
	<span>{label}</span>
</button>

<style lang="scss">
	.primary-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
		border-radius: var(--radius-S);
		padding: 10px 16px;
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
</style>
