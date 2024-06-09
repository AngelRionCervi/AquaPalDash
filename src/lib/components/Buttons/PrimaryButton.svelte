<script lang="ts">
	interface Props {
    label: string;
		type?: 'default' | 'green';
		icon?: string;
	}
	const { label, type = 'default', icon = '' }: Props = $props();
</script>

<button class="primary-button button-{type}">
  {#if icon}
    icon
  {/if}
  <span>{label}</span>
</button>

<style lang="scss">
  .primary-button {
    border-radius: var(--radius-S);
    padding: 10px 16px;
  }

  .button-default {
    border: 1px solid var(--secondary);
    background-color: var(--primary);
    color: var(--secondary);
  }

  .button-green {
    border: 1px solid var(--secondary-success);
    background-color: var(--primary-success);
    color: var(--primary);
  }
</style>
