import Song from "./Song";

export class Tournament {
    id: number;
    name: string;
    levels: TournamentLevel[];
    matchesPerRound?: number;

    constructor(id: number, name: string, levels: TournamentLevel[], matchesPerRound?: number) {
        this.id = id;
        this.name = name;
        this.levels = levels;
        this.matchesPerRound = matchesPerRound ?? 8;
    }

    static fromJson(data: any): Tournament {
        const levels = data.levels.map((levelData: any) => TournamentLevel.fromJson(levelData));
        return new Tournament(data.id, data.name, levels, data.matchesPerRound);
    }

    getSongColumns(): (Song|undefined)[][] {
        const songs: (Song|undefined)[][] = [];
        this.levels.forEach(level => {
            const levelSongs = level.getSongs();
            const midpoint = levelSongs.length/2;
            const firstHalf = levelSongs.slice(0, midpoint);
            const secondHalf = levelSongs.slice(midpoint);
            songs.splice(songs.length/2, 0, firstHalf, secondHalf);
        });
        songs.splice(songs.length/2, 0, [this.getWinner()]);
        return songs;
    }

    getWinner(): Song|undefined {
        return this.levels.at(-1)?.rounds[0].matches[0].songWinner;
    }
}

export class TournamentLevel {
    id: number;
    name: string;
    rounds: TournamentRound[];

    constructor(id: number, name: string, rounds: TournamentRound[]) {
        this.id = id;
        this.name = name;
        this.rounds = rounds;
    }

    static fromJson(data: any): TournamentLevel {
        const rounds = data.rounds.map((roundData: any) => TournamentRound.fromJson(roundData));
        return new TournamentLevel(data.id, data.name, rounds);
    }

    getSongs(): Song[] {
        return this.rounds.flatMap(round => round.getSongs());
    }
}

export class TournamentRound {
    id: number;
    startDate: Date;
    endDate: Date;
    matches: TournamentMatch[];

    constructor(id: number, startDate: Date, endDate: Date, matches: TournamentMatch[]) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.matches = matches;
    }

    static fromJson(data: any): TournamentRound {
        const matches = data.matches.map((matchData: any) => TournamentMatch.fromJson(matchData));
        return new TournamentRound(data.id, data.startDate, data.endDate, matches);
    }

    getSongs(): Song[] {
        return this.matches.flatMap(match => match.getSongs());
    }
}

export class TournamentMatch {
    id: number;
    song1: Song;
    song2: Song;
    songWinner?: Song;

    constructor(id: number, song1: Song, song2: Song, songWinner?: Song) {
        this.id = id;
        this.song1 = song1;
        this.song2 = song2;
        this.songWinner = songWinner;
    }

    static fromJson(data: any): TournamentMatch {
        return new TournamentMatch(data.id, data.song1, data.song2, data.songWinner);
    }

    getSongs(): Song[] {
        return [this.song1, this.song2];
    }
}