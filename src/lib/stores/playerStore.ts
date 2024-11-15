import { writable } from 'svelte/store';
import { type Player, PlayerState } from '../types';
import type { Rating } from 'openskill';

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
          id: Date.now(),
          name,
          rating,
          state: PlayerState.Idle
        };
        const updatedPlayers = [...players, newPlayer];
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    },
    getPlayer: (id: number): Player => {
      let player: Player | undefined;
      subscribe(players => {
        player = players.find(p => p.id === id);
      })();
      if (!player) {
        throw new Error(`Player with id ${id} not found`);
      }
      return player;
    },
    updatePlayerState: (id: number, state: PlayerState) => {
      update(players => {
        const updatedPlayers = players.map(p => p.id === id ? {...p, state} : p);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    },
    updatePlayerRating: (id: number, rating: Rating) => {
      update(players => {
        const updatedPlayers = players.map(p => p.id === id ? {...p, rating} : p);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return updatedPlayers;
      });
    },
    clearPlayerStatus: () => {
      update(players => {
        const updatedPlayers = players.map(p => p.state = PlayerState.Idle);
        localStorage.setItem('players', JSON.stringify(updatedPlayers));
        return players;
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