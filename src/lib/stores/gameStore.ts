import { writable } from "svelte/store";
import { type Game, PlayerState } from "../types";
import { playerStore } from './playerStore';
import { rate, type Rating } from 'openskill';

const storedGames = localStorage.getItem('games');
const initialGames: Game[] = storedGames ? JSON.parse(storedGames) : [];

function createGameStore() {
    const { subscribe, set, update } = writable<Game[]>(initialGames);

    return {
        subscribe,
        createGame: (teamA: [number], teamB: [number]) => {
          update(games => {
            const newGame = {
              id: Date.now(),
              teamA: teamA,
              teamB: teamB,
              createdAt: Date.now(),
              status: 'active'
            };
            const updatedGames = [...games, newGame];
            localStorage.setItem('games', JSON.stringify(updatedGames));
            
            [...teamA, ...teamB].forEach(
                playerId => playerStore.updatePlayerState(playerId, PlayerState.InGame)
            );

            return updatedGames;
          });
        },

        cancelGame: (gameId: number) => {
          update(games => {
            const game = games.find(g => g.id === gameId);
            if (game) {
                [...game.teamA, ...game.teamB].forEach(
                    playerId => playerStore.updatePlayerState(playerId, PlayerState.Idle)
                );
            }

            return games.map(g => g.id !== gameId ? g : {...g, status: 'cancelled'});
          });
        },

        clearGames: () => {
          playerStore.clearPlayerStatus();
          localStorage.removeItem('games');
          set([]);
        },

        completeGame: (gameId: number, teamA: number, teamB: number) => {
          update(games => {
            const updatedGames = games.map(game => {
              if (game.id === gameId) {
                [...game.teamA, ...game.teamB].forEach(
                    playerId => playerStore.updatePlayerState(playerId, PlayerState.Idle)
                );

                let playersA = game.teamA.map(playerId => playerStore.getPlayer(playerId));
                let playersB = game.teamB.map(playerId => playerStore.getPlayer(playerId));

                // Update ratings
                const ratings = rate([playersA.map(p => p.rating), playersB.map(p => p.rating)], {
                    score: [teamA, teamB]
                });

                let ratingUpdate: { [playerId: number]: [Rating, Rating] } = {};

                playersA.forEach((p, index) => {
                    playerStore.updatePlayerRating(p.id, ratings[0][index])
                    ratingUpdate[p.id] = [p.rating, ratings[0][index]];
                });

                playersB.forEach((p, index) => {
                    playerStore.updatePlayerRating(p.id, ratings[1][index])
                    ratingUpdate[p.id] = [p.rating, ratings[1][index]];
                });

                game.status = 'completed';
                game.ratingUpdate = ratingUpdate;
                
                return {
                  ...game,
                  score: { 
                    teamA: teamA, 
                    teamB: teamB
                  }
                };
              }

              return game;
            });
            
            localStorage.setItem('games', JSON.stringify(updatedGames));
            return updatedGames;
          });
        }
      };
    }
    
    export const gameStore = createGameStore();