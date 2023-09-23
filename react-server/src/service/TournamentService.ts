import { Tournament } from "../model/Tournament";

export function getTournament(id: number): Promise<Tournament> {
    return get("http://localhost:3001/tournament?id=" + id)
        .then(res => res.json())
        .then(res => res as Tournament);
}

function get(url: string): Promise<Response> {
    return fetch(url, {
        method: "GET",
        headers: {
            "Authorization": "Basic xxxxxxxxxxxxxxx=",
            "Accept": "application/json",
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin": "*",
        }
    });
}