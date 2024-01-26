import { TournamentPrivacy } from "./Tournament";
import TournamentVoter from "./TournamentVoter";

export default class TournamentSettings {
    tournamentId: number;
    voters: TournamentVoter[];
    currentRoundDescription: string;
    matchDescriptions: MatchDescription[];
    roundDates: RoundDate[];
    privacy: TournamentPrivacy;

    constructor(tournamentId: number, voters: TournamentVoter[], currentRoundDescription: string, matchDescriptions: MatchDescription[], roundDates: RoundDate[], privacy: TournamentPrivacy) {
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
        const roundDates = data.roundDates ? data.roundDates.map((roundDate: any) => RoundDate.fromJson(roundDate)): [];
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

    setMatchDescription(description: string, matchIndex: number, songIndex: number): TournamentSettings {
        const newMatchDescription = this.matchDescriptions[matchIndex].setSongDescription(description, songIndex);
        const matchDescriptions = this.matchDescriptions.toSpliced(matchIndex, 1, newMatchDescription);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, matchDescriptions, this.roundDates, this.privacy);
    }

    setRoundStartDate(roundIndex: number, startDate: Date): TournamentSettings {
        const newRoundDate = this.roundDates[roundIndex].setStartDate(startDate);
        const roundDates = this.roundDates.toSpliced(roundIndex, 1, newRoundDate);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, roundDates, this.privacy);
    }

    setRoundEndDate(roundIndex: number, endDate: Date): TournamentSettings {
        const newRoundDate = this.roundDates[roundIndex].setEndDate(endDate);
        const roundDates = this.roundDates.toSpliced(roundIndex, 1, newRoundDate);
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, roundDates, this.privacy);
    }

    setPrivacy(privacy: TournamentPrivacy): TournamentSettings {
        return new TournamentSettings(this.tournamentId, this.voters, this.currentRoundDescription, this.matchDescriptions, this.roundDates, privacy);
    }
}

export class MatchDescription {
    song1Title: string;
    song1Description: string;
    song2Title: string;
    song2Description: string;

    constructor(song1Title: string, song1Description: string, song2Title: string, song2Description: string) {
        this.song1Title = song1Title;
        this.song1Description = song1Description;
        this.song2Title = song2Title;
        this.song2Description = song2Description;
    }

    static fromJson(data: any): MatchDescription {
        return new MatchDescription(data.song1Title ?? "", data.song1Description ?? "", data.song2Title ?? "", data.song2Description ?? "");
    }

    setSongDescription(description: string, index: number): MatchDescription {
        if(index === 1) {
            return new MatchDescription(this.song1Title, description, this.song2Title, this.song2Description);
        } else if(index === 2) {
            return new MatchDescription(this.song1Title, this.song1Description, this.song2Title, description);
        } else {
            return new MatchDescription(this.song1Title, this.song1Description, this.song2Title, this.song2Description);
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