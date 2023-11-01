import TournamentVoter from "./TournamentVoter";

export default class TournamentSettings {
    tournamentId: number;
    voters: TournamentVoter[];

    constructor(tournamentId: number, voters: TournamentVoter[]) {
        this.tournamentId = tournamentId;
        this.voters = voters;
    }

    static fromJson(data: any): TournamentSettings {
        const voters = data.voters ? data.voters.map((voterData: any) => TournamentVoter.fromJson(voterData)) : [];
        return new TournamentSettings(data.tournamentId, voters);
    }

    setVoters(voters: TournamentVoter[]): TournamentSettings {
        return new TournamentSettings(this.tournamentId, voters);
    }

    addVoter(voter: TournamentVoter): TournamentSettings {
        const voters = [...this.voters, voter];
        return this.setVoters(voters);
    }

    removeVoter(voter: TournamentVoter): TournamentSettings {
        const index = this.voters.indexOf(voter);
        const voters = index === -1 ? this.voters : this.voters.toSpliced(index, 1);
        return new TournamentSettings(this.tournamentId, voters);
    }

    hasVoter(email: string): boolean {
        return this.voters.some(voter => voter.email === email);
    }
}