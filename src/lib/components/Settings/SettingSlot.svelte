<script lang="ts">
	import type { Setting } from './type';

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
				<input type="text" value={defaultVal} />
			{:else if type === 'select' && values?.length}
				<select {name} {id} class="select">
					{#each values as { label, value }}
						<option {value}>{label}</option>
					{/each}
				</select>
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

	.separator {
		width: 100%;
		height: 1px;
		background-color: var(--secondary);
	}

  .select {
    width: 150px;
    font-size: var(--font-S);
  }
</style>
