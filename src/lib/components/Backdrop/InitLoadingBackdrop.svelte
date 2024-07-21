<div class="backdrop">
	<div class="loader"></div>
	<div class="loading-text-and-dots">
		<span class="loading-text">Loading...</span>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--primary);
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.loader {
		border: 6px solid var(--primary-darker);
		border-top: 6px solid var(--secondary);
		border-radius: 50%;
		width: 250px;
		height: 250px;
		animation: spin 2s linear infinite;
	}

	.loading-text-and-dots {
		display: flex;
		position: absolute;
	}

	.loading-text {
		font-size: var(--font-L);
		color: var(--secondary);
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
