import { VoteResponseBody } from "../model/ResponseBodies";
import Song from "../model/Song";
import { Tournament } from "../model/Tournament";
import TournamentBuilder from "../model/TournamentBuilder";
import TournamentSettings from "../model/TournamentSettings";
import TournamentSummary from "../model/TournamentSummary";
import { delet, get, post } from "./ServiceUtil";

export function getTournament(id: number): Promise<Tournament|undefined> {
    return get(`/tournament?id=${id}`)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res))
        .catch(() => {
            console.error(`Failed to retrieve tournament ${id}`);
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

export function submitVote(tournamentId: number, songIds: number[]): Promise<VoteResponseBody> {
    return post("/tournament/vote", {
        tournament: tournamentId,
        songs: songIds
    })
        .then(res => res.json())
}

export function getVotes(tournamentId: number): Promise<number[]|null> {
    return get(`/tournament/vote?tournamentId=${tournamentId}`)
        .then(res => res.json())
        .catch(() => {
            console.log("Failed to retrieve votes.");
            return null;
        });
}

export function getTournamentSettings(tournamentId: number): Promise<TournamentSettings|null> {
    return get(`/tournament/settings?tournamentId=${tournamentId}`)
        .then(res => res.json())
        .then(res => TournamentSettings.fromJson(res))
        .catch(() => {
            console.log("Failed to retrieve voters.");
            return null;
        });
}

export function saveTournamentSettings(settings: TournamentSettings): Promise<Response> {
    return post("/tournament/settings", settings);
}

export function deleteTournament(tournamentId: number): Promise<Response> {
    return delet(`/tournament/delete?tournamentId=${tournamentId}`);
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