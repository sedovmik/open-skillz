import type { Rating } from 'openskill'

export interface Player {
    id: number;
    name: string;
    rating: Rating;
    state: PlayerState;
}

export enum PlayerState {
    Idle,
    InGame,
}

export interface Game {
    id: number;
    teamA: [number];
    teamB: [number];
    createdAt: number;
    status: 'active' | 'completed' | 'cancelled';
    score?: {
        teamA: number;
        teamB: number;
    }
}

