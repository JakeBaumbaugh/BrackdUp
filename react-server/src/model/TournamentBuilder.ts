import Entry from "./Entry";
import { TournamentLevel, TournamentMode, TournamentPrivacy, TournamentRound } from "./Tournament";
import TournamentType, { DEFAULT_MISC_TYPE } from "./TournamentType";

export default class TournamentBuilder {
    name: string;
    entryCount: number;
    matchesPerRound: number;
    type: TournamentType;
    spotifyPlaylist: string;
    entries: Entry[];
    levels: TournamentLevel[];
    privacy: TournamentPrivacy;
    mode: TournamentMode;
    backgroundImage?: number;

    constructor() {
        this.name = "";
        this.entryCount = 64;
        this.matchesPerRound = 8;
        this.type = DEFAULT_MISC_TYPE;
        this.spotifyPlaylist = "";
        this.entries = [];
        this.levels = this.buildLevels();
        this.privacy = "VISIBLE";
        this.mode = "SCHEDULED";
    }

    copy(): TournamentBuilder {
        const newBuilder = new TournamentBuilder();
        newBuilder.name = this.name;
        newBuilder.entryCount = this.entryCount;
        newBuilder.matchesPerRound = this.matchesPerRound;
        newBuilder.type = this.type;
        newBuilder.spotifyPlaylist = this.spotifyPlaylist;
        newBuilder.entries = this.entries;
        newBuilder.levels = this.levels;
        newBuilder.privacy = this.privacy;
        newBuilder.mode = this.mode;
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