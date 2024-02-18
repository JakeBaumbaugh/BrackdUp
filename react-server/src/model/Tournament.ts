import Song, { BracketSong } from "./Song";

export type TournamentPrivacy = "PUBLIC" | "VISIBLE" | "PRIVATE";

export class Tournament {
    id: number;
    name: string;
    levels: TournamentLevel[];
    spotifyPlaylist?: string;
    matchesPerRound?: number;
    creatorId?: number;

    constructor(id: number, name: string, levels: TournamentLevel[], spotifyPlaylist?: string, matchesPerRound?: number, creatorId?: number) {
        this.id = id;
        this.name = name;
        this.levels = levels;
        this.spotifyPlaylist = spotifyPlaylist;
        this.matchesPerRound = matchesPerRound ?? 8;
        this.creatorId = creatorId;
    }

    static fromJson(data: any): Tournament {
        const levels = data.levels.map((levelData: any) => TournamentLevel.fromJson(levelData));
        return new Tournament(data.id, data.name, levels, data.spotifyPlaylist, data.matchesPerRound, data.creatorId);
    }

    getSongColumns(): (BracketSong|null)[][] {
        const leftSongs: (BracketSong|null)[][] = [];
        const rightSongs: (BracketSong|null)[][] = [];
        // Assumption: first level is filled out entirely
        let halfLength = this.levels[0].getSongs().length / 2;
        this.levels.forEach(level => {
            const levelSongs = level.getSongs();
            const firstHalf = levelSongs.slice(0, halfLength);
            const secondHalf = levelSongs.slice(halfLength);
            if(levelSongs.length > 0) {
                leftSongs.push(firstHalf);
                rightSongs.unshift(secondHalf);
            }
            halfLength /= 2;
        });
        // Fill with any nulls necessary
        if(leftSongs.length > 1 && leftSongs.at(-1)!.length != leftSongs.at(-2)!.length / 2) {
            const toAdd = leftSongs.at(-2)!.length / 2 - leftSongs.at(-1)!.length;
            const nulls = new Array(toAdd).fill(null);
            leftSongs.at(-1)!.push(...nulls);
        }
        if(rightSongs.length > 1 && rightSongs.at(0)!.length != rightSongs.at(1)!.length / 2) {
            const toAdd = rightSongs.at(1)!.length / 2 - rightSongs.at(0)!.length;
            const nulls = new Array(toAdd).fill(null);
            rightSongs.at(0)!.push(...nulls);
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

    getActiveRound(): TournamentRound|undefined {
        const rounds = this.levels.flatMap(level => level.rounds);
        return rounds.find(round => round.isActive());
    }

    getVotableRound(): TournamentRound|undefined {
        const now = new Date();
        const activeRound = this.getActiveRound();
        return activeRound?.isDateInRange(now) ? activeRound : undefined;
    }

    getCurrentOrNextRound(): TournamentRound|undefined {
        const now = new Date();
        return this.levels
            .flatMap(level => level.rounds)
            .filter(round => round.endDate > now)
            .at(0);
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

export type RoundStatus = "CREATED" | "ACTIVE" | "RESOLVED";

export class TournamentRound {
    id: number;
    startDate: Date;
    endDate: Date;
    status: RoundStatus;
    description: string;
    matches: TournamentMatch[];

    constructor(id: number, startDate: Date, endDate: Date, matches: TournamentMatch[], status?: RoundStatus, description?: string) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.matches = matches;
        this.description = description ?? "";
        this.status = status ?? "CREATED";
    }

    static fromJson(data: any): TournamentRound {
        const matches = data.matches.map((matchData: any) => TournamentMatch.fromJson(matchData));
        return new TournamentRound(data.id, new Date(data.startDate), new Date(data.endDate), matches, data.status, data.description);
    }

    getSongs(): Song[] {
        const isActive = this.isActive();
        const songs = this.matches.flatMap(match => match.getSongs());
        songs.forEach(song => song.activeRound = isActive);
        return songs;
    }

    isActive(): boolean {
        return this.status == "ACTIVE" && this.isDateInRange(new Date());
    }

    isDateInRange(date: Date): boolean {
        if(!this.startDate || !this.endDate) {
            return false;
        }
        return this.startDate < date && date < this.endDate;
    }
}

export class TournamentMatch {
    id: number;
    song1: Song;
    song2: Song;
    songWinner?: Song;
    song1VoteCount?: number;
    song2VoteCount?: number;
    song1Description: string;
    song2Description: string;

    constructor(id: number, song1: Song, song2: Song, songWinner?: Song, song1VoteCount?: number, song2VoteCount?: number, song1Description?: string, song2Description?: string) {
        this.id = id;
        this.song1 = song1;
        this.song2 = song2;
        this.songWinner = songWinner;
        this.song1VoteCount = song1VoteCount;
        this.song2VoteCount = song2VoteCount;
        this.song1Description = song1Description ?? "";
        this.song2Description = song2Description ?? "";
    }

    static fromJson(data: any): TournamentMatch {
        return new TournamentMatch(data.id, data.song1, data.song2, data.songWinner, data.song1VoteCount, data.song2VoteCount, data.song1Description, data.song2Description);
    }

    getSongs(): Song[] {
        return [{...this.song1}, {...this.song2}];
    }

    copy(): TournamentMatch {
        return new TournamentMatch(this.id, this.song1, this.song2, this.songWinner, this.song1VoteCount, this.song2VoteCount, this.song1Description, this.song2Description);
    }
}