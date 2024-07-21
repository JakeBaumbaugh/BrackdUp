import Entry from "./Entry";
import { TournamentLevel, TournamentMode, TournamentPrivacy, TournamentRound } from "./Tournament";
import TournamentType, { DEFAULT_MISC_TYPE } from "./TournamentType";

export type TournamentOrder = "RANDOM" | "INORDER" | "SEEDED" | "TIEREDSEEDS";

export default class TournamentBuilder {
    name: string;
    entryCount: number;
    matchesPerRound: number;
    type: TournamentType;
    spotifyPlaylist: string;
    entries: Entry[];
    divisions: Entry[][];
    levels: TournamentLevel[];
    privacy: TournamentPrivacy;
    mode: TournamentMode;
    order: TournamentOrder | null;
    entryOrder: Entry[];
    seedingOrder: Entry[][];
    tieredSeedingOrder: Entry[][][];
    backgroundImage?: number;

    constructor() {
        this.name = "";
        this.entryCount = 64;
        this.matchesPerRound = 8;
        this.type = DEFAULT_MISC_TYPE;
        this.spotifyPlaylist = "";
        this.entries = [];
        this.divisions = [];
        this.levels = this.buildLevels();
        this.privacy = "VISIBLE";
        this.mode = "SCHEDULED";
        this.order = null;
        this.entryOrder = [];
        this.seedingOrder = [[]];
        this.tieredSeedingOrder = [[[]]];
    }

    copy(): TournamentBuilder {
        const newBuilder = new TournamentBuilder();
        newBuilder.name = this.name;
        newBuilder.entryCount = this.entryCount;
        newBuilder.matchesPerRound = this.matchesPerRound;
        newBuilder.type = this.type;
        newBuilder.spotifyPlaylist = this.spotifyPlaylist;
        newBuilder.entries = this.entries;
        newBuilder.divisions = this.divisions;
        newBuilder.levels = this.levels;
        newBuilder.privacy = this.privacy;
        newBuilder.mode = this.mode;
        newBuilder.order = this.order;
        newBuilder.entryOrder = this.entryOrder;
        newBuilder.seedingOrder = this.seedingOrder;
        newBuilder.tieredSeedingOrder = this.tieredSeedingOrder;
        newBuilder.backgroundImage = this.backgroundImage;
        return newBuilder;
    }

    isValid(): boolean {
        // Check name
        if (!this.name) {
            console.log("Missing tournament name.");
            return false;
        }
        // Check entry count
        if (this.entries.length !== this.entryCount) {
            console.log("Incorrect entry count.");
            return false;
        }
        // Check start/end date order
        if (this.mode === "SCHEDULED") {
            const rounds = this.levels.flatMap(level => level.rounds);
            if (!rounds.every(round => round.startDate! < round.endDate!)) {
                console.log("Round end date must be after round start date.");
                return false;
            }
        }
        // Check privacy and mode
        if (this.privacy === "PUBLIC" && this.mode === "INSTANT") {
            console.log("Instant tournaments cannot be public.");
            return false;
        }
        return true;
    }

    setName(name: string): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.name = name;
        return newBuilder;
    }

    setEntryCount(entryCount: number): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.entryCount = entryCount;
        newBuilder.levels = newBuilder.buildLevels();
        return newBuilder;
    }

    setMatchesPerRound(matchesPerRound: number): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.matchesPerRound = matchesPerRound;
        newBuilder.levels = newBuilder.buildLevels();
        return newBuilder;
    }

    setType(type: TournamentType): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.type = type;
        return newBuilder;
    }

    setSpotifyPlaylist(spotifyPlaylist: string): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.spotifyPlaylist = spotifyPlaylist;
        return newBuilder;
    }

    setPrivacy(privacy: TournamentPrivacy): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.privacy = privacy;
        return newBuilder;
    }

    setMode(mode: TournamentMode): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.mode = mode;
        return newBuilder;
    }

    setOrder(order: TournamentOrder): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.order = order;
        switch (order) {
            case "RANDOM":
                if (newBuilder.divisions.length > 0) {
                    newBuilder.entryOrder = newBuilder.divisions.map(d => randomize(d)).flat();
                } else {
                    newBuilder.entryOrder = randomize(newBuilder.entries);
                }
                break;
            case "INORDER":
                if (newBuilder.divisions.length > 0) {
                    newBuilder.entryOrder = newBuilder.divisions.flat();
                } else {
                    newBuilder.entryOrder = newBuilder.entries;
                }
                break;
            case "SEEDED":
                newBuilder.entryOrder = newBuilder.seedingOrder.flatMap(division => {
                    return seeded(division.length).map(seed => division[seed]);
                });
                break;
            case "TIEREDSEEDS":
                newBuilder.entryOrder = newBuilder.tieredSeedingOrder.flatMap(division => {
                    const randomizedOrder = division.flatMap(tier => randomize(tier));
                    return seeded(randomizedOrder.length).map(seed => randomizedOrder[seed]);
                });
                break;
        }
        return newBuilder;
    }

    setBackgroundImage(backgroundImage?: number): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.backgroundImage = backgroundImage;
        return newBuilder;
    }

    setEntries(entries: Entry[]): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.entries = entries;
        return newBuilder;
    }

    addEntry(entry: Entry): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.entries = [...newBuilder.entries, entry];
        return newBuilder;
    }

    removeEntry(entry: Entry): TournamentBuilder {
        const newBuilder = this.copy();
        const index = newBuilder.entries.indexOf(entry);
        newBuilder.entries = newBuilder.entries.toSpliced(index, 1);
        return newBuilder;
    }

    hasEntry(entry: Entry): boolean {
        return this.entries.some(e => e.line1 === entry.line1 && e.line2 === entry.line2);
    }

    setDivisionCount(divisionCount: number): TournamentBuilder {
        const newBuilder = this.copy();
        if (divisionCount < this.divisions.length) {
            newBuilder.divisions = newBuilder.divisions.slice(0, divisionCount);
            newBuilder.seedingOrder = newBuilder.seedingOrder.slice(0, divisionCount === 0 ? 1 : divisionCount);
            newBuilder.tieredSeedingOrder = newBuilder.tieredSeedingOrder.slice(0, divisionCount === 0 ? 1 : divisionCount);
        } else if (divisionCount > this.divisions.length) {
            while (newBuilder.divisions.length < divisionCount) {
                newBuilder.divisions.push([]);
            }
            while (newBuilder.seedingOrder.length < divisionCount) {
                newBuilder.seedingOrder.push([]);
            }
            while (newBuilder.tieredSeedingOrder.length < divisionCount) {
                newBuilder.tieredSeedingOrder.push([]);
            }
        }
        return newBuilder;
    }

    removeEntryFromDivisions(entry: Entry): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.divisions = newBuilder.divisions.map(division => division.filter(n => n !== entry));
        return newBuilder;
    }

    addToDivision(divIndex: number, entry: Entry): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.divisions[divIndex].push(entry);
        return newBuilder;
    }

    divisionsContains(entry: Entry): boolean {
        return this.divisions.some(division => division.includes(entry));
    }

    addToSeeding(entry: Entry, seedingIndex: number, divisionIndex?: number): TournamentBuilder {
        let seedingOrder = this.seedingOrder[divisionIndex ?? 0];
        const oldSeedingIndex = seedingOrder.indexOf(entry);
        const insertIndex = (oldSeedingIndex !== -1 && oldSeedingIndex < seedingIndex) ? seedingIndex - 1 : seedingIndex;
        const newBuilder = this.removeFromSeeding(entry);
        seedingOrder = newBuilder.seedingOrder[divisionIndex ?? 0];
        seedingOrder.splice(insertIndex, 0, entry);
        return newBuilder;
    }

    removeFromSeeding(entry: Entry): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.seedingOrder.forEach(division => {
            const index = division.indexOf(entry);
            if (index !== -1) {
                division.splice(index, 1);
            }
        });
        return newBuilder;
    }

    addToTieredSeeding(entry: Entry, tierIndex: number, divisionIndex?: number): TournamentBuilder {
        // const division = this.tieredSeedingOrder[divisionIndex ?? 0];
        // if (tierIndex === division.length) {
        //     division.push([]);
        // }
        // let seedingOrder = division[tierIndex];
        // const oldSeedingIndex = seedingOrder.indexOf(entry);
        // const insertIndex = (oldSeedingIndex !== -1 && oldSeedingIndex < seedingIndex) ? seedingIndex - 1 : seedingIndex;
        const newBuilder = this.removeFromTieredSeeding(entry, true);
        const division = newBuilder.tieredSeedingOrder[divisionIndex ?? 0];
        if (tierIndex === division.length) {
            division.push([]);
        }
        const tier = division[tierIndex];
        tier.push(entry);
        // seedingOrder = newBuilder.tieredSeedingOrder[divisionIndex ?? 0][tierIndex];
        // seedingOrder.splice(insertIndex, 0, entry);
        return newBuilder.trimTiers();
    }

    removeFromTieredSeeding(entry: Entry, skipTrim?: boolean): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.tieredSeedingOrder.forEach(division =>
            division.forEach(tier => {
                // if entry found in tier, remove it
                const index = tier.indexOf(entry);
                if (index !== -1) {
                    tier.splice(index, 1);
                }
            })
        );
        return skipTrim ? newBuilder : newBuilder.trimTiers();
    }

    trimTiers(): TournamentBuilder {
        const newBuilder = this.copy();
        newBuilder.tieredSeedingOrder = newBuilder.tieredSeedingOrder.map(division =>
            division.length > 1 ? division.filter(tier => tier.length > 0) : division
        );
        return newBuilder;
    }

    buildLevels(): TournamentLevel[] {
        const date = new Date();
        date.setHours(24, 0, 0, 0);

        const levels: TournamentLevel[] = [];
        let levelNumber = 1;
        for(let entriesInLevel = this.entryCount; entriesInLevel >= 2; entriesInLevel /= 2) {
            const matchesInLevel = entriesInLevel / 2;
            const roundsInLevel = Math.ceil(matchesInLevel / this.matchesPerRound);
            const rounds: TournamentRound[] = [];
            for(let roundIndex = 0; roundIndex < roundsInLevel; roundIndex++) {
                const startDate = new Date(date);
                date.setDate(date.getDate() + 1);
                const endDate = new Date(date);
                rounds.push(new TournamentRound(-1, startDate, endDate, []));
            }
            levels.push(new TournamentLevel(-1, `Level ${levelNumber}`, rounds));
            levelNumber++;
        }
        return levels;
    }

    setStartDate(date: Date): TournamentBuilder {
        const newBuilder = this.copy();
        const firstRound = newBuilder.levels[0].rounds[0];
        firstRound.startDate = date;
        return newBuilder;
    }

    setEndDate(date: Date, round: TournamentRound): TournamentBuilder {
        const newBuilder = this.copy();
        const rounds = newBuilder.levels.flatMap(level => level.rounds);
        const roundIndex = rounds.indexOf(round);
        rounds[roundIndex].endDate = date;
        if(roundIndex + 1 < rounds.length) {
            rounds[roundIndex + 1].startDate = date;
        }
        return newBuilder;
    }
}

function randomize(pre: Entry[]): Entry[] {
    const arr = [...pre];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function seeded(size: number): number[] {
    if (size === 1) {
        return [0];
    }
    if (size === 2) {
        return [0, 1];
    }
    let arr: any[] = [0, 1];
    while (arr.length < size) {
        const sum = arr[1] * 2 + 1;
        for (let i = 0; i < arr.length; i+=2) {
            arr[i] = [arr[i], sum-arr[i]];
            arr[i+1] = [sum-arr[i+1], arr[i+1]];
        }
        arr = arr.flat();
    }
    return arr;
}