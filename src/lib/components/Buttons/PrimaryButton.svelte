<script lang="ts">
	import AddIcon from '$lib/icons/add.svg?component';
	import BinIcon from '$lib/icons/bin.svg?component';
	import type { Component, ComponentType } from 'svelte';

	interface Props {
		label: string;
		type?: 'default' | 'green';
		icon?: 'add' | 'bin';
	}

	type IconMapType = {
		[key in Exclude<Props['icon'], undefined>]: ComponentType;
	};

	const iconMap: IconMapType = {
		add: AddIcon,
		bin: BinIcon
	};

	const { label, type = 'default', icon = undefined }: Props = $props();
</script>

<button class="primary-button button-{type}">
	{#if icon}
		<svelte:component this={iconMap[icon]} width={24} height={24} fill="var(--secondary);" />
	{/if}
	<span>{label}</span>
</button>

<style lang="scss">
	.primary-button {
		border-radius: var(--radius-S);
		padding: 10px 16px;
	}

	.button-default {
		border: 1px solid var(--secondary);
		background-color: var(--primary);
		color: var(--secondary);
	}

	.button-green {
		border: 1px solid var(--secondary-success);
		background-color: var(--primary-success);
		color: var(--primary);
	}
</style>
