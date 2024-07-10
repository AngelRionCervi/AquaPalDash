<script lang="ts">
	import AddIcon from '$lib/icons/add.svg?component';
	import BinIcon from '$lib/icons/bin.svg?component';
	import LoadingIcon from '$lib/icons/loading.svg?component';
	import type { Component, ComponentType } from 'svelte';

	interface Props {
		label: string;
		onclick: () => void;
		type?: 'default' | 'green' | 'red';
		icon?: 'add' | 'bin';
		disabled?: boolean;
		isLoading?: boolean;
	}

	type IconMapType = {
		[key in Exclude<Props['icon'], undefined>]: ComponentType;
	};

	const {
		label,
		onclick,
		type = 'default',
		icon = undefined,
		disabled = false,
		isLoading = false
	}: Props = $props();

	const iconMap: IconMapType = {
		add: AddIcon,
		bin: BinIcon
	};
</script>

<button
	class="primary-button button-{type}"
	class:disabled={disabled || isLoading}
	{onclick}
	disabled={disabled || isLoading}
>
	{#if icon}
		<svelte:component this={iconMap[icon]} width={24} height={24} />
	{/if}
	{#if isLoading}
		<div class="loading-icon-container">
			<LoadingIcon width={24} height={24} />
		</div>
	{:else}
		<span>{label}</span>
	{/if}
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

	.loading-icon-container {
    width: 24px;
    height: 24px;
		animation: spin 3s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
