<script lang="ts">
	interface Props {
		size?: 'small' | 'medium' | 'big';
		theme?: 'light' | 'dark';
	}

	const { size = 'small', theme = 'light' }: Props = $props();
</script>

<div class="loader loader-{size} loader-{theme}"></div>

<style lang="scss">
	.loader {
		border: 2px solid transparent;
		border-top-color: var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;

		&-small {
			width: 20px;
			height: 20px;
		}

		&-medium {
			width: 35px;
			height: 35px;
		}

		&-big {
			width: 80px;
			height: 80px;
      border: 4px solid transparent;
		}

		&-dark {
			border-top-color: var(--secondary);
		}

		&-light {
			border-top-color: var(--primary);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
