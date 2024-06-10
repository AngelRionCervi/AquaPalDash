<script lang="ts">
	import PrimaryButton from "$lib/components/Buttons/PrimaryButton.svelte";
  import UndoIcon from "$lib/icons/undo.svg?component";

</script>

<div class="footer">
  <div class="left-container">
    <span>slots 4/5</span>
    <PrimaryButton label="Add new device" icon="add" />
    <PrimaryButton label="Remove devices" icon="bin" />
  </div>
  <div class="right-container">
    <div class="unsaved-infos">
      <p>Some modifications are <span class="unsaved-label">unsaved</span></p>
      <button class="button-undo"> 
        <svelte:component this={UndoIcon} width={16} height={16} fill="var(--secondary)" />
        <span>Undo all modifications</span>
      </button>
    </div>
    <PrimaryButton type="green" label="Save and restart" />
  </div>
</div>

<style lang="scss">
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--secondary);
    width: calc(100vw - 128px);
    margin-left: -64px;
    padding: 32px 64px;
    gap: 32px;
  }

  .left-container {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .right-container {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .unsaved-infos {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .unsaved-label {
    color: var(--primary-error);
  }

  .button-undo {
    display: flex;
    align-items: center;
    gap: 8px;

    span {
      text-decoration: underline;
    }
  }
</style>