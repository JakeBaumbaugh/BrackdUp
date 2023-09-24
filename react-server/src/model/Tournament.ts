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

    getSongColumns(): (Song|null)[][] {
        const leftSongs: (Song|null)[][] = [];
        const rightSongs: (Song|null)[][] = [];
        // Assumption: first level is filled out entirely
        let halfLength = this.levels[0].getSongs().length / 2;
        this.levels.forEach(level => {
            const levelSongs = level.getSongs();
            const firstHalf = levelSongs.slice(0, halfLength);
            const secondHalf = levelSongs.slice(halfLength);
            leftSongs.push(firstHalf);
            rightSongs.unshift(secondHalf);
            halfLength /= 2;
        });
        // Fill with any nulls necessary
        if(this.levels.length > 1) {
            if(leftSongs.at(-1)!.length != leftSongs.at(-2)!.length / 2) {
                const toAdd = leftSongs.at(-2)!.length / 2 - leftSongs.at(-1)!.length;
                const nulls = new Array(toAdd).fill(null);
                leftSongs.at(-1)!.push(...nulls);
            }
            if(rightSongs.at(0)!.length != rightSongs.at(1)!.length / 2) {
                const toAdd = rightSongs.at(1)!.length / 2 - rightSongs.at(0)!.length;
                const nulls = new Array(toAdd).fill(null);
                rightSongs.at(0)!.push(...nulls);
            }
        }
        while(leftSongs.at(-1)!.length != 1) {
            const nulls = new Array(leftSongs.at(-1)!.length / 2).fill(null);
            leftSongs.push(nulls);
        }
        while(rightSongs.at(0)!.length != 1) {
            const nulls = new Array(rightSongs.at(0)!.length / 2).fill(null);
            rightSongs.unshift(nulls);
        }
        return [...leftSongs, [this.getWinner()], ...rightSongs];
    }

    getWinner(): Song|null {
        // Check for no levels
        if(!this.levels || this.levels.length == 0) {
            return null;
        }
        const lastLevel = this.levels.at(-1)!;
        // Check for no rounds
        if(!lastLevel.rounds || lastLevel.rounds.length == 0) {
            return null;
        }
        const finalMatches = lastLevel.rounds[0].matches;
        if(!finalMatches || finalMatches.length != 1) {
            return null;
        }
        return finalMatches[0].songWinner ?? null;
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