import Profile from "./Profile";

export default class TournamentVoter {
    tournamentId: number;
    email: string;
    profile?: Profile;

    constructor(tournamentId: number, email: string, profile?: Profile) {
        this.tournamentId = tournamentId;
        this.email = email;
        this.profile = profile;
    }

    static fromJson(data: any): TournamentVoter {
        const profile = data.profile ? Profile.fromJson(data.profile) : undefined;
        return new TournamentVoter(data.tournamentId, data.email, profile);
    }
}