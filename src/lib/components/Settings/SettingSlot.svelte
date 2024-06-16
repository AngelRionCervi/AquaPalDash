<script lang="ts">
	import type { Setting } from './type';
	import Select from '$lib/components/Inputs/Select.svelte';

	interface Props {
		setting: Setting;
		index: number;
	}

	const { setting, index }: Props = $props();
	const { name, type, defaultVal, values } = setting;

	const id = `${name}_${type}`;
</script>

<div class="setting-slot-container">
	{#if index === 0}
		<div class="separator"></div>
	{/if}
	<div class="inner-container">
		<div class="left-container">
			<label for={id}>{name}</label>
		</div>
		<div class="right-container">
			{#if type === 'text'}
				<input class="input" type="text" value={defaultVal} />
			{:else if type === 'select' && values?.length}
				<Select {id} {name} {values} />
			{/if}
		</div>
	</div>
	<div class="separator"></div>
</div>

<style lang="scss">
	.setting-slot-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.inner-container {
		display: flex;
		justify-content: space-between;
		padding: 16px 0;
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

	.select,
	.input {
		font-size: var(--font-M);
	}

	.input {
		width: 250px;
		border: 1px solid var(--secondary);
		padding: 2px;
		border-radius: var(--radius-S);
		background-color: var(--primary-lighter);
	}
</style>
