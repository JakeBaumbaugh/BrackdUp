import Entry, { BracketEntry } from "./Entry";

export type TournamentPrivacy = "PUBLIC" | "VISIBLE" | "PRIVATE";
export type TournamentMode = "SCHEDULED" | "INSTANT";

export class Tournament {
    id: number;
    name: string;
    levels: TournamentLevel[];
    mode: TournamentMode;
    spotifyPlaylist?: string;
    matchesPerRound?: number;
    creatorId?: number;

    constructor(id: number, name: string, levels: TournamentLevel[], mode: TournamentMode, spotifyPlaylist?: string, matchesPerRound?: number, creatorId?: number) {
        this.id = id;
        this.name = name;
        this.levels = levels;
        this.mode = mode;
        this.spotifyPlaylist = spotifyPlaylist;
        this.matchesPerRound = matchesPerRound ?? 8;
        this.creatorId = creatorId;
    }

    static fromJson(data: any): Tournament {
        const levels = data.levels.map((levelData: any) => TournamentLevel.fromJson(levelData));
        return new Tournament(data.id, data.name, levels, data.mode, data.spotifyPlaylist, data.matchesPerRound, data.creatorId);
    }

    getEntryColumns(): (BracketEntry|null)[][] {
        const leftEntries: (BracketEntry|null)[][] = [];
        const rightEntries: (BracketEntry|null)[][] = [];
        // Assumption: first level is filled out entirely
        let halfLength = this.levels[0].getEntries().length / 2;
        this.levels.forEach(level => {
            const levelEntries = level.getEntries();
            const firstHalf = levelEntries.slice(0, halfLength);
            const secondHalf = levelEntries.slice(halfLength);
            if(levelEntries.length > 0) {
                leftEntries.push(firstHalf);
                rightEntries.unshift(secondHalf);
            }
            halfLength /= 2;
        });
        // Fill with any nulls necessary
        if(leftEntries.length > 1 && leftEntries.at(-1)!.length != leftEntries.at(-2)!.length / 2) {
            const toAdd = leftEntries.at(-2)!.length / 2 - leftEntries.at(-1)!.length;
            const nulls = new Array(toAdd).fill(null);
            leftEntries.at(-1)!.push(...nulls);
        }
        if(rightEntries.length > 1 && rightEntries.at(0)!.length != rightEntries.at(1)!.length / 2) {
            const toAdd = rightEntries.at(1)!.length / 2 - rightEntries.at(0)!.length;
            const nulls = new Array(toAdd).fill(null);
            rightEntries.at(0)!.push(...nulls);
        }
        while(leftEntries.at(-1)!.length != 1) {
            const nulls = new Array(leftEntries.at(-1)!.length / 2).fill(null);
            leftEntries.push(nulls);
        }
        while(rightEntries.at(0)!.length != 1) {
            const nulls = new Array(rightEntries.at(0)!.length / 2).fill(null);
            rightEntries.unshift(nulls);
        }
        return [...leftEntries, [this.getWinner()], ...rightEntries];
    }

    getWinner(): Entry|null {
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
        return finalMatches[0].entryWinner ?? null;
    }

    getActiveRound(): TournamentRound|undefined {
        const rounds = this.levels.flatMap(level => level.rounds);
        return rounds.find(round => round.isActive());
    }

    getVotableRound(): TournamentRound|undefined {
        const now = new Date();
        const activeRound = this.getActiveRound();
        return (this.mode === "INSTANT" || activeRound?.isDateInRange(now)) ? activeRound : undefined;
    }

    getCurrentOrNextRound(): TournamentRound|undefined {
        if (this.mode === "SCHEDULED") {
            const now = new Date();
            return this.levels
                .flatMap(level => level.rounds)
                .filter(round => round.endDate! > now)
                .at(0);
        } else {
            return this.levels
                    .flatMap(level => level.rounds)
                    .filter(round => round.status !== "RESOLVED")
                    .at(0);
        }
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

    getEntries(): Entry[] {
        return this.rounds.flatMap(round => round.getEntries());
    }
}

export type RoundStatus = "CREATED" | "ACTIVE" | "RESOLVED";

export class TournamentRound {
    id: number;
    startDate: Date|null;
    endDate: Date|null;
    status: RoundStatus;
    description: string;
    matches: TournamentMatch[];

    constructor(id: number, startDate: Date|null, endDate: Date|null, matches: TournamentMatch[], status?: RoundStatus, description?: string) {
        this.id = id;
        this.startDate = startDate;
        this.endDate = endDate;
        this.matches = matches;
        this.description = description ?? "";
        this.status = status ?? "CREATED";
    }

    static fromJson(data: any): TournamentRound {
        const startDate = data.startDate ? new Date(data.startDate) : null;
        const endDate = data.endDate ? new Date(data.endDate) : null;
        const matches = data.matches.map((matchData: any) => TournamentMatch.fromJson(matchData));
        return new TournamentRound(data.id, startDate, endDate, matches, data.status, data.description);
    }

    getEntries(): Entry[] {
        const isActive = this.isActive();
        const entries = this.matches.flatMap(match => match.getEntries());
        entries.forEach(entry => entry.activeRound = isActive);
        return entries;
    }

    isActive(): boolean {
        // return this.status == "ACTIVE" && this.isDateInRange(new Date());
        return this.status == "ACTIVE";
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
    entry1: Entry;
    entry2: Entry;
    entryWinner?: Entry;
    entry1VoteCount?: number;
    entry2VoteCount?: number;
    entry1Description: string;
    entry2Description: string;

    constructor(id: number, entry1: Entry, entry2: Entry, entryWinner?: Entry, entry1VoteCount?: number, entry2VoteCount?: number, entry1Description?: string, entry2Description?: string) {
        this.id = id;
        this.entry1 = entry1;
        this.entry2 = entry2;
        this.entryWinner = entryWinner;
        this.entry1VoteCount = entry1VoteCount;
        this.entry2VoteCount = entry2VoteCount;
        this.entry1Description = entry1Description ?? "";
        this.entry2Description = entry2Description ?? "";
    }

    static fromJson(data: any): TournamentMatch {
        return new TournamentMatch(data.id, data.entry1, data.entry2, data.entryWinner, data.entry1VoteCount, data.entry2VoteCount, data.entry1Description, data.entry2Description);
    }

    getEntries(): Entry[] {
        return [{...this.entry1}, {...this.entry2}];
    }

    copy(): TournamentMatch {
        return new TournamentMatch(this.id, this.entry1, this.entry2, this.entryWinner, this.entry1VoteCount, this.entry2VoteCount, this.entry1Description, this.entry2Description);
    }
}