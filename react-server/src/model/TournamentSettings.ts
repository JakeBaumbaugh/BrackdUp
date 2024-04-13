import { TournamentPrivacy } from "./Tournament";
import TournamentVoter from "./TournamentVoter";

export default class TournamentSettings {
    tournamentId: number;
    voters: TournamentVoter[];
    currentRoundDescription: string;
    matchDescriptions: MatchDescription[];
    roundDates: RoundDate[]|null;
    privacy: TournamentPrivacy;

    constructor(tournamentId: number, voters: TournamentVoter[], currentRoundDescription: string, matchDescriptions: MatchDescription[], roundDates: RoundDate[]|null, privacy: TournamentPrivacy) {
        this.tournamentId = tournamentId;
        this.voters = voters;
        this.currentRoundDescription = currentRoundDescription;
        this.matchDescriptions = matchDescriptions;
        this.roundDates = roundDates;
        this.privacy = privacy;
    }

    static fromJson(data: any): TournamentSettings {
        const voters = data.voters ? data.voters.map((voterData: any) => TournamentVoter.fromJson(voterData)) : [];
        const matchDescriptions = data.matchDescriptions ? data.matchDescriptions.map((matchData: any) => MatchDescription.fromJson(matchData)) : [];
        const roundDates = data.roundDates ? data.roundDates.map((roundDate: any) => RoundDate.fromJson(roundDate)): null;
        return new TournamentSettings(data.tournamentId, voters, data.currentRoundDescription, matchDescriptions, roundDates, data.privacy);
    }

    setVoters(voters: TournamentVoter[]): TournamentSettings {
        return new TournamentSettings(this.tournamentId, voters, this.currentRoundDescription, this.matchDescriptions, this.roundDates, this.privacy);
    }

    addVoter(voter: TournamentVoter): TournamentSettings {
        const voters = [...this.voters, voter];
        return this.setVoters(voters);
    }

    removeVoter(voter: TournamentVoter): TournamentSettings {
        const index = this.voters.indexOf(voter);
        const voters = index === -1 ? this.voters : this.voters.toSpliced(index, 1);
        return this.setVoters(voters);
    }

    hasVoter(email: string): boolean {
        return this.voters.some(voter => voter.email === email);
    }

    setCurrentRoundDescription(description: string): TournamentSettings {
        return new TournamentSettings(this.tournamentId, this.voters, description, this.matchDescriptions, this.roundDates, this.privacy);
    }

    setMatchDescription(description: string, matchIndex: number, entryIndex: number): TournamentSettings {
        const newMatchDescription = this.matchDescriptions[matchIndex].setEntryDescription(description, entryIndex);
        const matchDescriptions = this.matchDescriptions.toSpliced(matchIndex, 1, newMatchDescription);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, matchDescriptions, this.roundDates, this.privacy);
    }

    setRoundStartDate(roundIndex: number, startDate: Date): TournamentSettings {
        if (this.roundDates === null) {
            return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, null, this.privacy);
        }
        const newRoundDate = this.roundDates[roundIndex].setStartDate(startDate);
        const roundDates = this.roundDates.toSpliced(roundIndex, 1, newRoundDate);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, roundDates, this.privacy);
    }

    setRoundEndDate(roundIndex: number, endDate: Date): TournamentSettings {
        if (this.roundDates === null) {
            return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, null, this.privacy);
        }
        const newRoundDate = this.roundDates[roundIndex].setEndDate(endDate);
        const roundDates = this.roundDates.toSpliced(roundIndex, 1, newRoundDate);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, roundDates, this.privacy);
    }

    setPrivacy(privacy: TournamentPrivacy): TournamentSettings {
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, this.roundDates, privacy);
    }
}

export class MatchDescription {
    entry1Line1: string;
    entry1Description: string;
    entry2Line1: string;
    entry2Description: string;

    constructor(entry1Line1: string, entry1Description: string, entry2Line1: string, entry2Description: string) {
        this.entry1Line1 = entry1Line1;
        this.entry1Description = entry1Description;
        this.entry2Line1 = entry2Line1;
        this.entry2Description = entry2Description;
    }

    static fromJson(data: any): MatchDescription {
        return new MatchDescription(data.entry1Line1 ?? "", data.entry1Description ?? "", data.entry2Line1 ?? "", data.entry2Description ?? "");
    }

    setEntryDescription(description: string, index: number): MatchDescription {
        if(index === 1) {
            return new MatchDescription(this.entry1Line1, description, this.entry2Line1, this.entry2Description);
        } else if(index === 2) {
            return new MatchDescription(this.entry1Line1, this.entry1Description, this.entry2Line1, description);
        } else {
            return new MatchDescription(this.entry1Line1, this.entry1Description, this.entry2Line1, this.entry2Description);
        }
    }
}

export class RoundDate {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    static fromJson(data: any): RoundDate {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return new RoundDate(startDate, endDate);
    }

    setStartDate(startDate: Date): RoundDate {
        return new RoundDate(startDate, this.endDate);
    }

    setEndDate(endDate: Date): RoundDate {
        return new RoundDate(this.startDate, endDate);
    }
}