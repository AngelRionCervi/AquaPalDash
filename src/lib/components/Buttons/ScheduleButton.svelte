<script lang="ts">
</script>

<div class="container">
	<span class="button-label">Schedules</span>
	<button class="green-button"></button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		gap: 16px;
    justify-content: center;
    align-items: center;
		border: 1px solid var(--secondary);
		border-radius: var(--radius-XL);
    padding: 56px 26px;
	}

	.green-button {
		width: 180px;
    height: 180px;
		border-radius: 999px;
    background-color: var(--primary-success);
		border: 5px solid var(--secondary-success);
	}

	.button-label {
		font-size: var(--font-ML);
	}
</style>
