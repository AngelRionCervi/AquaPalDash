<script lang="ts">
	interface Props {
		label: string;
		onclick: () => void;
		type?: 'default' | 'green';
		disabled?: boolean;
	}

	const { label, onclick, type = 'default', disabled = false }: Props = $props();
</script>

<button class="primary-button button-{type}" class:disabled {onclick} {disabled}>
	<span>{label}</span>
</button>

<style lang="scss">
	.primary-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-S);
		padding: 2px 8px;
		font-size: var(--font-S);
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
</style>
