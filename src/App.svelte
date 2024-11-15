<script lang="ts">
  import TabItem from './lib/TabItem.svelte';
  import TabContent from './lib/TabContent.svelte';
  import Players from './lib/Players.svelte';
  import Games from './lib/Games.svelte';

  let activeTab = 'players';

  const tabs = [
    { id: 'players', label: 'Players' },
    { id: 'games', label: 'Games' }
  ];
</script>

<main class="container mx-auto p-4">
  <nav class="flex border-b border-gray-200 mb-4">
    {#each tabs as tab}
      <TabItem
        label={tab.label}
        active={activeTab === tab.id}
        on:click={() => activeTab = tab.id}
      />
    {/each}
  </nav>

  <TabContent active={activeTab === 'players'}>
    <Players />
  </TabContent>

  <TabContent active={activeTab === 'games'}>
    <Games />
  </TabContent>
</main>

<style>

</style>
