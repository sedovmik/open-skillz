<script lang="ts">
    import { playerStore } from './stores/playerStore';
    import { type Player, PlayerState } from './types';
    import { type Rating, rating, ordinal } from 'openskill'

    // Form state
    let newPlayerName = '';
    let formError = '';

    // Function to handle form submission
    const handleSubmit = () => {
      const newRating: Rating = rating()
        
      // Validation
      if (!newPlayerName.trim()) {
        formError = 'Please enter a player name';
        return;
      }

      // Add player
      playerStore.addPlayer(newPlayerName.trim(), newRating);

      // Reset form
      newPlayerName = '';
      formError = '';
    };

    const compare = (a: Player, b: Player) => ordinal(b.rating) - ordinal(a.rating); 
    const formatRating = (rating: Rating) => ordinal(rating).toFixed(2);

    $: sortedPlayers = [...$playerStore].sort(compare);

    function getPlayerStatus(player: Player) {
        return player.state === PlayerState.InGame ? 'In Game' : 'Idle';
    }
    
</script>
  
<div class="container mx-auto">
  <!-- Players Table -->
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Rank
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Rating
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each sortedPlayers as player, index}
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              #{index + 1}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{player.name}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{formatRating(player.rating)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {getPlayerStatus(player)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button
                on:click={() => playerStore.removePlayer(player.id)}
                class="text-red-600 hover:text-red-900 focus:outline-none"
              >
                Remove
              </button>
            </td>
          </tr>
        {/each}
        {#if sortedPlayers.length === 0}
          <tr>
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
              No players added yet
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>

    <div class="border-t border-gray-200 my-6"></div>

    <!-- Add Player Form -->
    <div class="mb-6 bg-white shadow-md rounded-lg p-6">
      <h3 class="text-lg font-medium mb-4">Add New Player</h3>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              bind:value={newPlayerName}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter player name"
            />
          </div>
        </div>
        {#if formError}
          <div class="text-red-500 text-sm">{formError}</div>
        {/if}
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Player
        </button>
      </form>
    </div>
  
</div>