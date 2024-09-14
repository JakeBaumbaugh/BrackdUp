export default interface Entry {
    id: number;
    line1: string;
    line2?: string;
    spotify?: string;
    youtube?: string;
    activeRound?: boolean;
}

export function entryKey(entry: Entry): string {
    return `${entry.id}-${entry.line1}-${entry.line2}`;
}

export interface BracketEntry extends Entry {
    parent1VoteCount?: number;
    parent2VoteCount?: number;
    receivedVoteCount?: number;
    totalVoteCount?: number;
    matchId?: number;
}