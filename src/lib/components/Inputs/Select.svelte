<script lang="ts">
	interface Props {
		name: string;
		id: string;
		currentValue?: unknown;
		values: Array<{ label: string; value: number | string | boolean }>;
    onchange: (evt: Event) => void;
		label?: string;
		hasBorders?: boolean;
	}

	const { name, id, values, currentValue, onchange, label = '', hasBorders = false }: Props = $props();
</script>

<div class="select-container">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<select {name} {id} class="select" class:borders={hasBorders} {onchange}>
		{#each values as { label, value }}
			<option selected={currentValue === value} {value}>{label}</option>
		{/each}
	</select>
</div>

<style lang="scss">
	.select-container {
		height: 32px;
		width: 150px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: space-between;
		border: 1px solid transparent;
	}

	.select {
		padding: 0 6px;
		background: url("data:image/svg+xml,<svg height='14px' width='14px' viewBox='0 0 16 16' fill='%23000000' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>")
			no-repeat;
		background-position: calc(100% - 0.75rem) center;
		-moz-appearance: none;
		-webkit-appearance: none;
		appearance: none;
		padding-right: 2rem;
    background-color: var(--primary-lighter);

		&.borders {
			border: 1px solid var(--secondary);
			border-radius: var(--radius-S);
		}
	}
</style>
