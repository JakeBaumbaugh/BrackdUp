import { Tournament } from "../model/Tournament";

export function getTournament(id: number): Promise<Tournament> {
    return get("http://192.168.0.154:3001/tournament?id=" + id)
        .then(res => res.json())
        .then(res => Tournament.fromJson(res));
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