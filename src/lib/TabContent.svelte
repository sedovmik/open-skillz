<script lang="ts">
  export let active: boolean = false;
</script>

{#if active}
  <div class="py-4">
    <slot />
  </div>
{/if}
