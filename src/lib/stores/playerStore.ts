import { writable } from 'svelte/store';
import type { Player, Rating } from '../types';

// Initialize the store with data from localStorage or empty array
const storedPlayers = localStorage.getItem('players');
const initialPlayers: Player[] = storedPlayers ? JSON.parse(storedPlayers) : [];

// Create a custom store
function createPlayerStore() {
  const { subscribe, set, update } = writable<Player[]>(initialPlayers);

  return {
    subscribe,
    addPlayer: (name: string, rating: Rating) => {
      update(players => {
        const newPlayer = {
          id: Date.now(), // Simple way to generate unique IDs
          name,
          rating
        };
        const updatedPlayers = [...players, newPlayer];
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    },
    removePlayer: (id: number) => {
      update(players => {
        const updatedPlayers = players.filter(p => p.id !== id);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    }
  };
}

export const playerStore = createPlayerStore();