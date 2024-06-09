<script lang="ts">
	import TopRightStat from "./TopRightStat.svelte";

</script>

<div class="main-container">
	<div class="left-container">
		<span class="aquarium-name">60x40 Living Room</span>
		<span class="aquarium-stat">status: <span class="status-on">online</span></span>
		<span class="aquarium-stat">schedules: <span class="status-on">on</span></span>
	</div>
	<div class="right-container">
    <div class="stat-container">
      <TopRightStat stat="ph" />
    </div>
    <div class="stat-container">
      <TopRightStat stat="temp" />
    </div>
  </div>
</div>

<style lang="scss">
	.main-container {
		display: flex;
		justify-content: space-between;
	}

	.left-container {
		display: flex;
		justify-content: space-between;
    align-items: flex-end;
		gap: 16px;
	}

	.aquarium-name {
		font-size: var(--font-XL);
		font-weight: bold;
	}

	.aquarium-stat {
    margin-bottom: 7px;

		.status-on {
			color: var(--primary-success);
		}

		.status-off {
			color: var(--primary-error);
		}
	}

  .right-container {
    display: flex;
    gap: 36px;
  }

  .stat-container {
    margin-top: 7px;
  }
</style>
