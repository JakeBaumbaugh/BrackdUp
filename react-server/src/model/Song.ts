export default interface Song {
    id: number;
    title: string;
    artist: string;
    spotify?: string;
    youtube?: string;
    activeRound?: boolean;
}


export interface BracketSong extends Song {
    parent1VoteCount?: number;
    parent2VoteCount?: number;
    receivedVoteCount?: number;
    totalVoteCount?: number;
}