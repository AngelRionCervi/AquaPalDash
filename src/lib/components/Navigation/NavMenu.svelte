<script lang="ts">
	import { page } from '$app/stores';
	import menuRoutes from '$lib/data/navMenu';

	function checkCurrentRoute(route: string) {
		return $page.url.pathname === route;
	}
</script>

<nav class="nav-container">
	<ul class="nav-list">
		{#each menuRoutes as { id, label, route } (id)}
			<li>
				<a class="nav-link {checkCurrentRoute(route) ? 'current' : ''}" href={route}>{label}</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	@import '$lib/variables.scss';

	.nav-container {
		width: 100%;
		border-top: 1px solid var(--secondary);
		border-bottom: 1px solid var(--secondary);
		padding: 16px 0;

		@media screen and (max-width: $mobile-bp) {
			padding: 8px 0;
		}

		@media screen and (max-width: $small-mobile-bp) {
			padding: 3px;
		}
	}

	.nav-list {
		display: flex;

		@media screen and (max-width: $mobile-bp) {
			flex-wrap: wrap;
			justify-content: space-around;
		}
	}

	.nav-link {
		padding: 16px;

		&:not(.current):hover {
			background-color: var(--primary-darker);
		}

		&.current {
			background-color: var(--secondary);
			color: var(--primary);
		}

		@media screen and (max-width: $mobile-bp) {
			padding: 8px;
		}

		@media screen and (max-width: $small-mobile-bp) {
			font-size: var(--font-S);
			padding: 6px;
		}
	}
</style>
