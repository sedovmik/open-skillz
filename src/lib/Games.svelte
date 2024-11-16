<script lang="ts">
  import { gameStore } from './stores/gameStore';
  import { playerStore } from './stores/playerStore';
  import { PlayerState, type ActiveGame } from './types';
  import { User, Users, Trash2 } from 'lucide-svelte';
  // import { Skull } from 'lucide-svelte';

  let showCompleteDialog = false;
  let selectedGameId: number | null = null;
  let player1Score = '';
  let player2Score = '';

  $: availablePlayers = [...$playerStore].filter((p) => p.state === PlayerState.Idle);
  $: activePlayers = [...$playerStore];

  function createRandomSingleGame() {
    const available = availablePlayers;
    if (available.length < 2) return;

    const player1Index = Math.floor(Math.random() * available.length);
    const player1 = available[player1Index];
    const remainingPlayers = available.filter((p) => p.id !== player1.id);
    const player2Index = Math.floor(Math.random() * remainingPlayers.length);
    const player2 = remainingPlayers[player2Index];

    gameStore.createGame([player1.id], [player2.id]);
  }

  function createRandomDoubleGame() {
    const available = availablePlayers;
    if (available.length < 4) return;

    const shuffled = [...available].sort(() => Math.random() - 0.5);
    const [teamA1, teamA2, teamB1, teamB2] = shuffled.slice(0, 4);

    gameStore.createGame([teamA1.id, teamA2.id], [teamB1.id, teamB2.id]);
  }

  function handleCompleteGame() {
    if (selectedGameId && player1Score !== '' && player2Score !== '') {
      gameStore.completeGame(selectedGameId, parseInt(player1Score), parseInt(player2Score));
      showCompleteDialog = false;
      selectedGameId = null;
      player1Score = '';
      player2Score = '';
    }
  }

  function getPlayerNames(ids: [number]) {
    return ids.map((id) => $playerStore.find((p) => p.id === id)?.name || 'Unknown').join(', ');
  }

  function clearGames() {
    gameStore.clearGames();
  }
</script>

<div class="container mx-auto">
  <div class="mb-6 flex justify-between">
    <div class="space-x-3">
      <button
        on:click={createRandomSingleGame}
        disabled={availablePlayers.length < 2}
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
      >
        <User class="w-5 h-5" />
        <span>Single</span>
      </button>
      <button
        on:click={createRandomDoubleGame}
        disabled={availablePlayers.length < 4}
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
      >
        <Users class="w-5 h-5" />
        <span>Double</span>
      </button>
    </div>

    <button
      on:click={clearGames}
      class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-2"
    >
      <Trash2 class="w-5 h-5" />
      <span>Clear All</span>
    </button>
  </div>

  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Players</th
          >
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Status</th
          >
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >Actions</th
          >
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each $gameStore.sort((a, b) => b.createdAt - a.createdAt) as game}
          <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {getPlayerNames(game.teamA)} vs {getPlayerNames(game.teamB)}
              </div>
              <div class="text-sm font-medium text-gray-900 relative group">
                {#if game.status === 'completed' && game.score}
                  <span>{game.score.teamA} - {game.score.teamB}</span>
                  {#if game.ratingUpdate}
                    <div
                      class="z-10 w-64 p-2 mt-2 bg-gray-800 text-white text-xs rounded shadow-lg"
                    >
                      {#each Object.entries(game.ratingUpdate) as [playerId, [before, after]]}
                        <div class="mb-1">
                          {getPlayerNames([parseInt(playerId)])}: {before.mu.toFixed(2)} → {after.mu.toFixed(
                            2
                          )}
                        </div>
                      {/each}
                    </div>
                  {/if}
                {/if}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
              {#if game.status === 'active'}
                <button
                  on:click={() => {
                    selectedGameId = game.id;
                    showCompleteDialog = true;
                  }}
                  class="text-blue-600 hover:text-blue-900"
                >
                  Complete
                </button>

                <button
                  on:click={() => gameStore.cancelGame(game.id)}
                  class="text-red-600 hover:text-red-900"
                >
                  Cancel
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if showCompleteDialog}
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-medium mb-4">Complete Game</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {getPlayerNames(
                selectedGameId ? $gameStore.find((g) => g.id === selectedGameId)?.teamA || [0] : [0]
              )} Score
            </label>
            <input
              type="number"
              bind:value={player1Score}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {getPlayerNames(
                selectedGameId ? $gameStore.find((g) => g.id === selectedGameId)?.teamB || 0 : 0
              )} Score
            </label>
            <input
              type="number"
              bind:value={player2Score}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              on:click={() => {
                showCompleteDialog = false;
                selectedGameId = null;
                player1Score = '';
                player2Score = '';
              }}
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              on:click={handleCompleteGame}
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
