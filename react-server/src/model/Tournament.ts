import Song from "./Song";

export interface Tournament {
    id: number;
    name: string;
    matchesPerRound?: number;
    levels: TournamentLevel[];
}

export interface TournamentLevel {
    id: number;
    name: string;
    rounds: TournamentRound[];
}

export interface TournamentRound {
    id: number;
    startDate: Date;
    endDate: Date;
    matches: TournamentMatch[];
}

export interface TournamentMatch {
    id: number;
    song1: Song;
    song2: Song;
    songWinner?: Song;
}