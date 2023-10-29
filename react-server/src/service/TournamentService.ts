import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import TournamentBuilder from "../model/TournamentBuilder";
import TournamentSummary from "../model/TournamentSummary";
import { delet, get, post } from "./ServiceUtil";

export function getTournament(id: number): Promise<Tournament|undefined> {
    return get(`/tournament?id=${id}`)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res))
        .catch(() => {
            console.log("Failed to retrieve tournament.");
            return undefined;
        });
}

export function getTournaments(): Promise<TournamentSummary[]> {
    return get("/tournaments")
        .then(res => res.json())
        .then(res => res.map(TournamentSummary.fromJson))
        .catch(() => {
            console.log("Failed to retrieve tournaments.");
            return [];
        });
}

export function submitVote(tournamentId: number, songIds: number[]): Promise<Response> {
    return post("/tournament/vote", {
        tournament: tournamentId,
        songs: songIds
    });
}

export function getVotes(tournamentId: number): Promise<number[]> {
    return get(`/tournament/vote?id=${tournamentId}`)
        .then(res => res.json())
        .catch(() => {
            console.log("Failed to retrieve votes.");
            return [];
        });
}

export function deleteTournament(tournamentId: number): Promise<Response> {
    return delet(`/tournament/delete?id=${tournamentId}`);
}

export function searchSongs(title: string, artist: string): Promise<Song[]> {
    return get(`/song/search?title=${title}&artist=${artist}`)
        .then(res => res.json())
        .then(res => res as Song[])
        .catch(() => {
            console.log("Failed to search songs.");
            return [];
        });
}

export function createTournament(builder: TournamentBuilder): Promise<Response> {
    return post("/tournament/create", builder);
}