export interface Rating {
    mu: number;
    sigma: number;
}

export interface Player {
    id: number;
    name: string;
    rating: Rating;
}
