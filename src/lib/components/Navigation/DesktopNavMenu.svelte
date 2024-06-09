<script lang="ts">
	import { page } from '$app/stores';
	import menuRoutes from './navMenu';

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
	.nav-container {
		width: 100%;
		border-top: 1px solid var(--secondary);
		border-bottom: 1px solid var(--secondary);
		padding: 16px 0;
	}

	.nav-list {
		display: flex;
	}

	.nav-link {
		padding: 16px;

		&.current {
			background-color: var(--secondary);
			color: var(--primary);
		}
	}
</style>
