<script lang="ts">
  import EyeShowIcon from '$lib/icons/eye-show.svg?component';
  import EyeHideIcon from '$lib/icons/eye-hide.svg?component';

  interface Props {
    placeholder?: string;
    disabled?: boolean;
    maxlength?: number;
    minlength?: number;
    id?: string;
    onKeyPress?: (event: KeyboardEvent) => void;
    onInput: (value: string) => void;
  }

  const {
    placeholder,
    onInput,
    disabled = false,
    maxlength = undefined,
    minlength = undefined,
    onKeyPress = undefined,
    id = ''
  }: Props = $props();

  let show = $state(false);
  let value = $state('');

  function handleKeyDown(event: KeyboardEvent) {
    if (onKeyPress && event.key === 'Enter') {
      onKeyPress(event);
    }
  }
</script>

<div class="input-container" class:disabled>
  <input
    class="input"
    {id}
    type={show ? 'text' : 'password'}
    {placeholder}
    bind:value
    oninput={() => onInput(value)}
    {maxlength}
    {minlength}
    onkeypress={handleKeyDown}
    {disabled}
  />
  <button class="show-hide-button" onclick={() => (show = !show)}>
    {#if show}
      <EyeShowIcon />
    {:else}
      <EyeHideIcon/>
    {/if}
  </button>
</div>

<style lang="scss">
  .input-container {
    display: flex;
    border: 1px solid var(--secondary);
    padding: 2px;
    border-radius: var(--radius-S);
    background-color: var(--primary-lighter);
    padding: 2px 4px;
    height: 28px;
    box-sizing: border-box;

    &.disabled {
      background-color: var(--primary-darker);
    }
  }

  .input {
    border: none;
    outline: none;
    padding: 0;
    height: 22px;
  }

  .show-hide-button {
    background-color: transparent;
    width: 24px;
    display: flex;
  }
</style>
