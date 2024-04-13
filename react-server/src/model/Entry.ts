export default interface Entry {
    id: number;
    line1: string;
    line2?: string;
    spotify?: string;
    youtube?: string;
    activeRound?: boolean;
}

export interface BracketEntry extends Entry {
    parent1VoteCount?: number;
    parent2VoteCount?: number;
    receivedVoteCount?: number;
    totalVoteCount?: number;
}