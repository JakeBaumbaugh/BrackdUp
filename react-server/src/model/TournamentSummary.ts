import Entry from "./Entry";

export default class TournamentSummary {
    id: number;
    name: string;
    startDate?: Date;
    endDate?: Date;
    entryWinner?: Entry;
    votingStartDate?: Date;
    votingEndDate?: Date;
    spotifyPlaylist?: string;

    constructor(id: number,
                name: string,
                startDate?: Date,
                endDate?: Date,
                entryWinner?: Entry,
                votingStartDate?: Date,
                votingEndDate?: Date,
                spotifyPlaylist?: string) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.entryWinner = entryWinner;
        this.votingStartDate = votingStartDate;
        this.votingEndDate = votingEndDate;
        this.spotifyPlaylist = spotifyPlaylist;
    }

    static fromJson(data: any): TournamentSummary {
        const startDate = data.startDate ? new Date(data.startDate) : undefined;
        const endDate = data.endDate ? new Date(data.endDate) : undefined;
        const votingStartDate = data.votingStartDate ? new Date(data.votingStartDate) : undefined;
        const votingEndDate = data.votingEndDate ? new Date(data.votingEndDate) : undefined;
        return new TournamentSummary(data.id, data.name, startDate, endDate, data.entryWinner, votingStartDate, votingEndDate, data.spotifyPlaylist);
    }
}