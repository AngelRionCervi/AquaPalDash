<script lang="ts">
	import Select from '$lib/components/Inputs/Select.svelte';
	import PrimaryButton from '$lib/components/Buttons/PrimaryButton.svelte';
	import modalStore from '$lib/stores/modalStore.svelte';

	const { toggle } = modalStore;

	const id = `select_button_slot`;

	function onValidate() {
		console.log('validate button slot');
		toggle();
	}
</script>

<div class="button-slot-setting-container">
	<div class="top">
		<div class="inner-container left">
			<table class="buttons-table">
				<tbody>
					<tr class="table-row">
						<th>button 1:</th>
						<td>light</td>
					</tr>
					<tr class="table-row">
						<th>button 2:</th>
						<td>co2</td>
					</tr>
					<tr class="table-row">
						<th>button 3:</th>
						<td>filter</td>
					</tr>
					<tr class="table-row">
						<th>button 4:</th>
						<td class="id-free">free</td>
					</tr>
					<tr class="table-row">
						<th>button 5:</th>
						<td class="id-free">free</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="separator"></div>
		<div class="inner-container right">
			<Select
				{id}
				name={id}
				label="New button:"
				values={[
					{ label: '1', value: 1 },
					{ label: '2', value: 2 },
					{ label: '3', value: 3 },
					{ label: '4', value: 4 },
					{ label: '5', value: 5 }
				]}
				hasBorders
			/>
		</div>
	</div>
  <div class="change-recap">
  -->display change recap if binding on already bound button
  </div>
	<div class="bottom">
		<PrimaryButton onclick={onValidate} label="OK" />
	</div>
</div>

<style lang="scss">
	.button-slot-setting-container {
		display: flex;
		flex-direction: column;
		gap: 36px;
		justify-content: space-between;
	}

	.top {
		display: flex;
		justify-content: space-between;
	}

	.bottom {
		display: flex;
		justify-content: center;
	}

	.separator {
		width: 1px;
		height: auto;
		background-color: var(--secondary);
	}

	.inner-container {
		padding: 16px;
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		align-items: center;

		&.left {
			gap: 4px;

			p {
				width: 150px;
			}
		}

		&.right {
			margin-top: -32px;
		}
	}

	.buttons-table {
		text-align: left;
	}

	.id-free {
		color: var(--primary-success);
	}

  .table-row {
    display: flex;
    justify-content: flex-start;
    gap: 8px;

    th, td {
      width: 90px;
    }
  }
</style>
